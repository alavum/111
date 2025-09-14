import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { Users, MapPin, Gamepad2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Server {
  id: number;
  name: string;
  players: number;
  maxPlayers: number;
  queue: number;
  map: string;
  gameMode: string;
  status: "online" | "offline";
  reserved?: number;
}

interface ServerConnectionStatus {
  serverId: number;
  ok: boolean;
  connectUrl?: string;
  error?: string;
}

// Initial servers data - updated with RCON data
const initialServers: Server[] = [
  {
    id: 1,
    name: "RUBEZH Free",
    players: 0,
    maxPlayers: 100,
    queue: 0,
    map: "—",
    gameMode: "—",
    status: "offline",
    reserved: 0,
  },
  {
    id: 2,
    name: "RUBEZH #1",
    players: 0,
    maxPlayers: 100,
    queue: 0,
    map: "—",
    gameMode: "—",
    status: "offline",
    reserved: 0,
  },
  {
    id: 3,
    name: "RUBEZH Invasion",
    players: 0,
    maxPlayers: 100,
    queue: 0,
    map: "—",
    gameMode: "—",
    status: "offline",
    reserved: 0,
  },
  {
    id: 4,
    name: "RUBEZH International",
    players: 0,
    maxPlayers: 100,
    queue: 0,
    map: "—",
    gameMode: "—",
    status: "offline",
    reserved: 0,
  },
];

function getStatusColor(status: Server["status"]) {
  switch (status) {
    case "online":
      return "text-green-400";
    case "offline":
      return "text-red-400";
    default:
      return "text-gaming-text-muted";
  }
}

function getStatusDot(status: Server["status"]) {
  switch (status) {
    case "online":
      return "bg-green-400";
    case "offline":
      return "bg-red-400";
    default:
      return "bg-gaming-text-muted";
  }
}

// Cache interface
interface CacheData {
  data: Server[];
  timestamp: number;
}

// Cache duration: 10 seconds (shorter to revalidate more often)
const CACHE_DURATION = 10 * 1000;

export default function ServerStatus() {
  const [serverData, setServerData] = useState<Server[]>(initialServers);
  const [connectionStatuses, setConnectionStatuses] = useState<
    Record<number, ServerConnectionStatus>
  >({});
  const [loadingConnections, setLoadingConnections] = useState<
    Record<number, boolean>
  >({});
  const [isLoadingRcon, setIsLoadingRcon] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  // Track consecutive invalid map responses per server to avoid overreacting to single transient failures
  const invalidCountsRef = useRef<Record<number, number>>({});

  // Load cached data on mount (stale-while-revalidate): always show cache immediately if present
  const loadCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem("server_status_cache");
      if (cached) {
        const cacheData: CacheData = JSON.parse(cached);
        console.log("Loading cached server data (stale-while-revalidate)");
        setServerData(cacheData.data);
        // set lastFetchTime from cache so fetchRconData can decide to revalidate
        setLastFetchTime(cacheData.timestamp || 0);
        return true;
      }
    } catch (error) {
      console.error("Failed to load cached data:", error);
    }
    return false;
  }, []);

  // Helper: fetch JSON with AbortController timeout and graceful failure
  const fetchJsonWithTimeout = async (
    input: RequestInfo,
    init?: RequestInit,
    timeout = 8000,
  ) => {
    const attempt = async (attemptNum: number): Promise<any> => {
      const controller = new AbortController();
      const id = setTimeout(() => {
        try {
          // @ts-ignore
          controller.abort?.("timeout");
        } catch (e) {
          try {
            controller.abort();
          } catch (_) {}
        }
      }, timeout);

      try {
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          clearTimeout(id);
          return {
            ok: false,
            status: 0,
            json: null,
            error: new Error("offline"),
          } as any;
        }

        let fetchPromise: Promise<Response>;
        try {
          fetchPromise = (globalThis.fetch as typeof fetch)(input, {
            ...(init || {}),
            signal: controller.signal,
          });
        } catch (syncErr) {
          clearTimeout(id);
          if (
            syncErr instanceof Error &&
            /failed to fetch/i.test(syncErr.message)
          ) {
            return {
              ok: false,
              status: 0,
              json: null,
              error: new Error("network"),
            } as any;
          }
          return { ok: false, status: 0, json: null, error: syncErr } as any;
        }

        let res: Response;
        try {
          res = await fetchPromise;
        } catch (asyncErr) {
          clearTimeout(id);
          if (
            asyncErr &&
            (asyncErr.name === "AbortError" || String(asyncErr) === "timeout")
          ) {
            return {
              ok: false,
              status: 0,
              json: null,
              error: new Error("timeout"),
            } as any;
          }
          if (
            asyncErr instanceof Error &&
            /failed to fetch/i.test(asyncErr.message)
          ) {
            return {
              ok: false,
              status: 0,
              json: null,
              error: new Error("network"),
            } as any;
          }
          return { ok: false, status: 0, json: null, error: asyncErr } as any;
        }

        clearTimeout(id);
        if (!res.ok) return { ok: false, status: res.status, json: null };
        const json = await res.json();
        return { ok: true, status: res.status, json };
      } catch (err: any) {
        try {
          clearTimeout(id);
        } catch {}
        return { ok: false, status: 0, json: null, error: err } as any;
      }
    };

    const maxAttempts = 2;
    for (let i = 0; i < maxAttempts; i++) {
      const res = await attempt(i + 1);
      if (
        res.ok ||
        (res.error &&
          (res.error.message === "timeout" ||
            res.error.message === "network" ||
            res.error.message === "offline"))
      ) {
        return res;
      }
      // exponential backoff small delay
      await new Promise((r) => setTimeout(r, 200 * (i + 1)));
    }

    // last attempt
    return attempt(maxAttempts);
  };

  // Fetch RCON data with background updates
  const fetchRconData = useCallback(
    async (forceRefresh = false, showLoading = true) => {
      const now = Date.now();

      if (
        !forceRefresh &&
        lastFetchTime &&
        now - lastFetchTime < CACHE_DURATION
      ) {
        return;
      }

      if (showLoading) setIsLoadingRcon(true);

      try {
        const result = await fetchJsonWithTimeout(
          "/api/rcon-status",
          undefined,
          8000,
        );
        if (!result.ok || !result.json) {
          // If timeout happened, avoid noisy toasts on background refreshes
          const errMsg = result.error?.message || "";
          if (errMsg === "timeout") {
            if (showLoading) {
              toast({
                title: "Таймаут",
                description: "Сервер не ответил вовремя, попробуйте ещё раз",
                variant: "destructive",
              });
            }
            return;
          }

          if (showLoading) {
            toast({
              title: "Ошибка загрузки",
              description: "Не удалось обновить данные серверов",
              variant: "destructive",
            });
          }
          return;
        }

        const rconData = result.json;

        const updatedServers = rconData.map((rconServer: any) => {
          const existingServer = serverData.find(
            (s) => s.id === rconServer.serverId,
          );

          // Read candidate fields for total slots (support multiple RCON shapes)
          const reportedMax = Number(
            rconServer.maxPlayers ??
              rconServer.slots ??
              rconServer.totalSlots ??
              NaN,
          );

          // Detect partial/invalid map indicators (common during map rotations)
          const rawMap =
            typeof rconServer.map === "string"
              ? rconServer.map.trim()
              : rconServer.map;
          const mapIsInvalid =
            !rawMap ||
            /^unknown$/i.test(String(rawMap)) ||
            /connection failed/i.test(String(rawMap));

          // Update invalid counts and decide whether to treat this response as transient.
          const sid = Number(rconServer.serverId);
          if (mapIsInvalid) {
            invalidCountsRef.current[sid] =
              (invalidCountsRef.current[sid] || 0) + 1;
          } else {
            invalidCountsRef.current[sid] = 0;
          }
          // Only consider response unreliable if we got 2 or more consecutive invalid map results — this is a compromise
          const treatAsInvalid =
            mapIsInvalid && (invalidCountsRef.current[sid] || 0) >= 2;

          // Decide players: if response looks transient (treatAsInvalid=false) do not keep previous; only keep previous when treatAsInvalid===true
          const playersReported = rconServer.players;
          const players = (() => {
            const p = Number(playersReported ?? existingServer?.players ?? 0);
            if (
              (playersReported === 0 || playersReported === "0") &&
              existingServer &&
              existingServer.players > 0 &&
              treatAsInvalid
            ) {
              return existingServer.players;
            }
            return Math.max(0, Number.isNaN(p) ? 0 : p);
          })();
          const reserved = Math.max(
            0,
            Number(
              rconServer.reservedSlots ??
                rconServer.reserved ??
                rconServer.reservedPlayers ??
                existingServer?.reserved ??
                0,
            ),
          );

          // Construct a robust totalSlots: prefer a sensible reportedMax, but ensure it's at least players+reserved and at least existing known value, fallback 100
          const candidateReported =
            !isNaN(reportedMax) && reportedMax > 0 ? reportedMax : NaN;
          const existingMax = existingServer?.maxPlayers ?? NaN;
          let totalSlots = 100;
          if (!isNaN(candidateReported) && !isNaN(existingMax)) {
            totalSlots = Math.max(
              candidateReported,
              existingMax,
              players + reserved,
              100,
            );
          } else if (!isNaN(candidateReported)) {
            totalSlots = Math.max(candidateReported, players + reserved, 100);
          } else if (!isNaN(existingMax)) {
            totalSlots = Math.max(existingMax, players + reserved, 100);
          } else {
            totalSlots = Math.max(players + reserved, 100);
          }

          // Queue: prefer explicit field, otherwise compute conservatively
          const explicitQueue = Number(rconServer.queue ?? NaN);
          const queue = !isNaN(explicitQueue)
            ? Math.max(0, explicitQueue)
            : Math.max(0, players - (totalSlots - reserved));

          const map = treatAsInvalid
            ? (existingServer?.map ?? "—")
            : String(rconServer.map ?? existingServer?.map ?? "—");
          const gameMode = treatAsInvalid
            ? (existingServer?.gameMode ?? "—")
            : (rconServer.gameMode ?? existingServer?.gameMode ?? "—");

          // Normalize status: accept only known values, otherwise derive from players or fallback to previous
          let status = (rconServer.status as Server["status"]) ?? undefined;
          if (status !== "online" && status !== "offline") {
            if (players > 0) status = "online";
            else if (existingServer?.status) status = existingServer.status;
            else status = "offline";
          }

          return {
            id: rconServer.serverId,
            name: existingServer?.name || `RUBEZH Server ${rconServer.serverId}`,
            players,
            maxPlayers: totalSlots,
            queue,
            map,
            gameMode,
            status,
            reserved,
          };
        });

        // Only update UI if data actually changed to avoid flashing/loading
        const isEqual = (a: Server[], b: Server[]) => {
          if (a.length !== b.length) return false;
          for (let i = 0; i < a.length; i++) {
            const x = a[i];
            const y = b[i];
            if (
              x.id !== y.id ||
              x.players !== y.players ||
              x.maxPlayers !== y.maxPlayers ||
              x.queue !== y.queue ||
              x.map !== y.map ||
              x.gameMode !== y.gameMode ||
              x.status !== y.status ||
              (x.reserved || 0) !== (y.reserved || 0)
            )
              return false;
          }
          return true;
        };

        if (!isEqual(serverData, updatedServers)) {
          setServerData(updatedServers);
          // Cache the data
          const cacheData: CacheData = {
            data: updatedServers,
            timestamp: now,
          };
          localStorage.setItem(
            "server_status_cache",
            JSON.stringify(cacheData),
          );
        }

        // Always update last fetch time to avoid excessive refetching, but UI is only updated when data changed
        setLastFetchTime(now);
      } catch (error) {
        // Avoid noisy logs for common network issues/timeouts when not user-initiated
        const errMsg = (error as any)?.message || "";
        if (
          errMsg &&
          errMsg !== "timeout" &&
          errMsg !== "network" &&
          errMsg !== "offline"
        ) {
          console.error("Failed to fetch RCON data:", error);
        }
        // If user initiated (showLoading) show a toast for non-network errors
        if (
          showLoading &&
          errMsg &&
          errMsg !== "timeout" &&
          errMsg !== "network" &&
          errMsg !== "offline"
        ) {
          toast({
            title: "Ошибка загрузки",
            description: "Не удалось обновить данные серверов",
            variant: "destructive",
          });
        }
      } finally {
        if (showLoading) setIsLoadingRcon(false);
      }
    },
    [lastFetchTime, serverData],
  );

  // Connection cache key
  const CONNECTION_CACHE_KEY = "server_connection_cache";

  // Load cached connection statuses
  const loadCachedConnections = useCallback((): boolean => {
    try {
      const cached = localStorage.getItem(CONNECTION_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as CacheData & { connections?: any };
        const now = Date.now();
        // reuse regardless of age; we'll revalidate immediately
        if (parsed && (parsed.connections || parsed.connections === null)) {
          const statusMap = (parsed as any).connections as Record<
            number,
            ServerConnectionStatus
          >;
          if (statusMap) {
            setConnectionStatuses(statusMap);
            return true;
          }
        }
      }
    } catch (err) {
      console.error("Failed to load cached connections:", err);
    }
    return false;
  }, []);

  // Check server connection statuses (batch). Optionally skip if cache is fresh and not forceRefresh.
  const checkServerConnections = useCallback(
    async (forceRefresh = false) => {
      try {
        const serverIds = serverData.map((s) => s.id);

        // If we have cached connections and not forcing, skip network
        if (!forceRefresh) {
          const cached = localStorage.getItem(CONNECTION_CACHE_KEY);
          if (cached) {
            try {
              const parsed = JSON.parse(cached) as {
                timestamp: number;
                connections: Record<number, ServerConnectionStatus>;
              };
              if (
                parsed &&
                Date.now() - (parsed.timestamp || 0) < CACHE_DURATION
              ) {
                // already up-to-date
                return;
              }
            } catch {}
          }
        }

        const result = await fetchJsonWithTimeout(
          "/api/server-status/batch",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serverIds }),
          },
          5000,
        );

        if (result.ok && result.json) {
          const statuses: ServerConnectionStatus[] = result.json;
          const statusMap = statuses.reduce(
            (acc, status) => {
              acc[status.serverId] = status;
              return acc;
            },
            {} as Record<number, ServerConnectionStatus>,
          );
          // Compare shallowly to avoid unnecessary updates
          const keysA = Object.keys(connectionStatuses);
          const keysB = Object.keys(statusMap);
          let changed = false;
          if (keysA.length !== keysB.length) changed = true;
          else {
            for (const k of keysB) {
              const a = connectionStatuses[Number(k)];
              const b = statusMap[Number(k)];
              if (!a || a.ok !== b.ok || a.connectUrl !== b.connectUrl) {
                changed = true;
                break;
              }
            }
          }
          if (changed) {
            setConnectionStatuses(statusMap);
            try {
              localStorage.setItem(
                CONNECTION_CACHE_KEY,
                JSON.stringify({
                  timestamp: Date.now(),
                  connections: statusMap,
                }),
              );
            } catch (e) {
              // ignore localStorage errors
            }
          }
        } else {
          // If timeout or network happened, avoid noisy logs
          const errMsg = result.error?.message;
          if (
            errMsg &&
            errMsg !== "timeout" &&
            errMsg !== "network" &&
            errMsg !== "offline"
          ) {
            console.error("Failed to check server connections:", result.error);
          }
        }
      } catch (error) {
        console.error("Failed to check server connections:", error);
      }
    },
    [serverData, connectionStatuses],
  );

  // Initialize data: immediately show cache and prefetch fresh data so buttons are ready
  useEffect(() => {
    const hasCachedData = loadCachedData();
    const hasCachedConnections = loadCachedConnections();

    // Immediately start background revalidation in parallel for faster loading
    if (navigator.onLine) {
      Promise.allSettled([
        fetchRconData(true, false),
        checkServerConnections(true),
      ]).catch(() => {});
    } else {
      const onOnline = () => {
        Promise.allSettled([
          fetchRconData(true, false),
          checkServerConnections(true),
        ]).catch(() => {});
        window.removeEventListener("online", onOnline);
      };
      window.addEventListener("online", onOnline);
    }

    return () => {
      // nothing to cleanup here
    };
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    const intervalMs = 15000; // 15s for faster updates
    const interval = setInterval(() => {
      // Run in parallel for lower wall-clock time
      Promise.allSettled([
        fetchRconData(true, false),
        checkServerConnections(),
      ]).catch(() => {});
    }, intervalMs);

    return () => clearInterval(interval);
  }, [fetchRconData, checkServerConnections]);

  const handleConnect = async (server: Server) => {
    if (server.status !== "online") {
      toast({
        title: "С��рвер недоступен",
        description:
          "Сервер находится в оффлайне или на техническом обслуживан��и",
        variant: "destructive",
      });
      return;
    }

    const connectionStatus = connectionStatuses[server.id];

    if (!connectionStatus) {
      // According to UX requirement, do not perform network fetches on user click.
      toast({
        title: "Статус подключения неизвестен",
        description:
          "Информация о возможности подключения ещё не загружена. Пожалуйста, обновите страницу или подождите несколько секунд при загрузке сайта.",
        variant: "destructive",
      });
      return;
    }

    if (connectionStatus.ok && connectionStatus.connectUrl) {
      window.open(connectionStatus.connectUrl, "_blank");
    } else {
      toast({
        title: "Подключение недоступно",
        description:
          connectionStatus.error ||
          "Сервер временно недоступен для подключения",
        variant: "destructive",
      });
    }
  };

  const handleManualRefresh = () => {
    fetchRconData(true, true);
    checkServerConnections();
  };

  const isConnectionAvailable = (server: Server) => {
    return (
      server.status === "online" && connectionStatuses[server.id]?.ok === true
    );
  };

  const getConnectButtonText = (server: Server) => {
    if (server.status !== "online") return "Недоступен";
    if (loadingConnections[server.id]) return "Проверка...";

    const connectionStatus = connectionStatuses[server.id];
    if (!connectionStatus) return "Подключиться";

    return connectionStatus.ok ? "Подключиться" : "Недоступен";
  };

  return (
    <section id="servers" className="py-12 bg-gaming-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gaming-text">
            Статус серверов
          </h2>

          <div className="flex items-center space-x-4">
            {isLoadingRcon && (
              <div className="flex items-center text-gaming-accent">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm">Обнов��ение...</span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isLoadingRcon}
              className="border-gaming-border text-gaming-text hover:bg-gaming-card"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Обновить
            </Button>
          </div>
        </div>

        {/* Servers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serverData.map((server) => (
            <div
              key={server.id}
              className="group relative bg-gaming-card border border-gaming-border rounded-lg p-4 sm:p-6 hover:bg-gaming-card-hover transition-colors overflow-visible"
            >
              {/* Server Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 min-w-0">
                  <h3 className="font-semibold text-gaming-text truncate">
                    {server.name}
                  </h3>

                  {/* Seed indicator: show emoji 🌱 and a redesigned info card on hover */}
                  {String(server.gameMode || "").toLowerCase().includes("seed") && (
                    <div className="relative inline-flex items-center">
                      <span
                        className="peer text-sm select-none"
                        role="img"
                        aria-label="Seed mode"
                      >
                        🌱
                      </span>

                      {/* Tooltip/info card shown when hovering the emoji */}
                      <div className="absolute left-0 top-full mt-2 w-72 max-w-[320px] z-50 opacity-0 pointer-events-none transition-opacity duration-150 peer-hover:opacity-100 peer-hover:pointer-events-auto">
                        <div className="bg-gaming-card border border-gaming-border rounded-lg p-3 text-sm shadow-lg">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">🌱</div>
                            <div className="flex-1">
                              <div className="font-semibold text-gaming-text">Seed режим активен</div>
                              <p className="text-xs text-gaming-text-muted mt-1">
                                На этом сервере включён Seed режим — количество
                                бонусов увеличено. Заходите и зарабатывайте быстрее
                                на VIP-статус.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center" aria-hidden>
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(server.status)} shadow-sm`}
                  />
                </div>
                {/* Accessibility: provide textual status for screen readers */}
                <span className="sr-only">
                  {server.status === "online" ? "Online" : "Offline"}
                </span>
              </div>

              {/* Player Count */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gaming-text-muted text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Игроки</span>
                  </div>
                  <span className="text-gaming-text font-semibold">
                    {server.reserved && server.reserved > 0 ? (
                      <>
                        {Math.max(
                          server.maxPlayers -
                            server.players -
                            (server.reserved || 0),
                          0,
                        )}
                        <span className="text-yellow-400 ml-1">
                          (+{server.reserved})
                        </span>
                      </>
                    ) : (
                      <>
                        {server.players}/{server.maxPlayers}
                      </>
                    )}
                    {server.queue > 0 && (
                      <span className="text-yellow-400 ml-1">
                        (+{server.queue})
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full bg-gaming-border rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full bg-gaming-accent"
                    style={{
                      width: `${Math.min(((server.players + (server.reserved || 0)) / server.maxPlayers) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Map Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gaming-text-muted flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-gaming-text-muted text-xs">
                      Карта:
                    </span>
                    <p className="text-gaming-text text-sm truncate">
                      {server.map}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connect Button */}
              <button
                onClick={() => handleConnect(server)}
                disabled={
                  !isConnectionAvailable(server) &&
                  server.status === "online" &&
                  connectionStatuses[server.id]?.ok === false
                }
                className={`hidden md:block w-full mt-4 py-2 px-4 rounded-md font-medium transition-colors ${
                  isConnectionAvailable(server)
                    ? "bg-gaming-accent hover:bg-gaming-accent-hover text-black cursor-pointer"
                    : server.status === "online" &&
                        !connectionStatuses[server.id]
                      ? "bg-gaming-accent/70 hover:bg-gaming-accent text-black cursor-pointer"
                      : "bg-gaming-border text-gaming-text-muted cursor-not-allowed"
                }`}
              >
                {loadingConnections[server.id] && (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin inline" />
                )}
                {getConnectButtonText(server)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

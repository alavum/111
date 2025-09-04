import { useState, useEffect, useCallback } from "react";
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
  status: "online" | "offline" | "maintenance";
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
    name: "RSGS Free",
    players: 0,
    maxPlayers: 100,
    queue: 0,
    map: "—",
    gameMode: "—",
    status: "maintenance",
    reserved: 0,
  },
  {
    id: 2,
    name: "RSGS #1",
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
    name: "RSGS Invasion",
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
    name: "RSGS International",
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
    case "maintenance":
      return "text-yellow-400";
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
    case "maintenance":
      return "bg-yellow-400";
    default:
      return "bg-gaming-text-muted";
  }
}

// Cache interface
interface CacheData {
  data: Server[];
  timestamp: number;
}

// Cache duration: 20 seconds
const CACHE_DURATION = 20 * 1000;

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

  // Load cached data on mount
  const loadCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem("server_status_cache");
      if (cached) {
        const cacheData: CacheData = JSON.parse(cached);
        const now = Date.now();

        if (now - cacheData.timestamp < CACHE_DURATION) {
          console.log("Loading cached server data");
          setServerData(cacheData.data);
          setLastFetchTime(cacheData.timestamp);
          return true;
        }
      }
    } catch (error) {
      console.error("Failed to load cached data:", error);
    }
    return false;
  }, []);

  // Helper: fetch JSON with AbortController timeout and graceful failure
  const fetchJsonWithTimeout = async (input: RequestInfo, init?: RequestInit, timeout = 8000) => {
    const controller = new AbortController();
    // provide a reason when aborting to avoid unhelpful browser errors from some injected scripts
    const id = setTimeout(() => {
      try {
        // Abort with a reason when supported
        // @ts-ignore
        controller.abort?.("timeout");
      } catch (e) {
        try { controller.abort(); } catch (_) {}
      }
    }, timeout);

    try {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        clearTimeout(id);
        return { ok: false, status: 0, json: null, error: new Error("offline") } as any;
      }

      const res = await fetch(input, { ...(init || {}), signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) return { ok: false, status: res.status, json: null };
      const json = await res.json();
      return { ok: true, status: res.status, json };
    } catch (err: any) {
      clearTimeout(id);
      // Normalize abort reason to 'timeout' if we aborted
      if (err && (err.name === "AbortError" || String(err) === "timeout")) {
        return { ok: false, status: 0, json: null, error: new Error("timeout") } as any;
      }
      return { ok: false, status: 0, json: null, error: err } as any;
    }
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
        const result = await fetchJsonWithTimeout("/api/rcon-status", undefined, 8000);
        if (!result.ok || !result.json) {
          if (showLoading) {
            toast({ title: "Ошибка загрузки", description: "Не удалось обновить данные серверов", variant: "destructive" });
          }
          return;
        }

        const rconData = result.json;

        const updatedServers = rconData.map((rconServer: any) => {
          const existingServer = serverData.find(
            (s) => s.id === rconServer.serverId,
          );

          // Read candidate fields for total slots (support multiple RCON shapes)
          const reportedMax = Number(rconServer.maxPlayers ?? rconServer.slots ?? rconServer.totalSlots ?? NaN);
          const players = Math.max(0, Number(rconServer.players ?? existingServer?.players ?? 0));
          const reserved = Math.max(0, Number(
            rconServer.reservedSlots ?? rconServer.reserved ?? rconServer.reservedPlayers ?? existingServer?.reserved ?? 0,
          ));

          // Construct a robust totalSlots: prefer a sensible reportedMax, but ensure it's at least players+reserved and at least existing known value, fallback 100
          const candidateReported = !isNaN(reportedMax) && reportedMax > 0 ? reportedMax : NaN;
          const existingMax = existingServer?.maxPlayers ?? NaN;
          let totalSlots = 100;
          if (!isNaN(candidateReported) && !isNaN(existingMax)) {
            totalSlots = Math.max(candidateReported, existingMax, players + reserved, 100);
          } else if (!isNaN(candidateReported)) {
            totalSlots = Math.max(candidateReported, players + reserved, 100);
          } else if (!isNaN(existingMax)) {
            totalSlots = Math.max(existingMax, players + reserved, 100);
          } else {
            totalSlots = Math.max(players + reserved, 100);
          }

          // Queue: prefer explicit field, otherwise compute conservatively
          const explicitQueue = Number(rconServer.queue ?? NaN);
          const queue = !isNaN(explicitQueue) ? Math.max(0, explicitQueue) : Math.max(0, players - (totalSlots - reserved));

          const map = rconServer.map ?? existingServer?.map ?? "—";
          const gameMode = rconServer.gameMode ?? existingServer?.gameMode ?? "—";

          // Normalize status: accept only known values, otherwise derive from players or fallback to previous
          let status = (rconServer.status as Server["status"]) ?? undefined;
          if (status !== "online" && status !== "offline" && status !== "maintenance") {
            if (players > 0) status = "online";
            else if (existingServer?.status) status = existingServer.status;
            else status = "offline";
          }

          return {
            id: rconServer.serverId,
            name: existingServer?.name || `RSGS Server ${rconServer.serverId}`,
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
        console.error("Failed to fetch RCON data:", error);
      } finally {
        if (showLoading) setIsLoadingRcon(false);
      }
    },
    [lastFetchTime, serverData],
  );

  // Check server connection statuses
  const checkServerConnections = useCallback(async () => {
    try {
      const serverIds = serverData.map((s) => s.id);
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
        if (changed) setConnectionStatuses(statusMap);
      }
    } catch (error) {
      console.error("Failed to check server connections:", error);
    }
  }, [serverData]);

  // Initialize data
  useEffect(() => {
    const hasCachedData = loadCachedData();

    // Defer network calls slightly to avoid running inside other scripts' message handlers (FullStory)
    const initialDelay = 1000; // give injected scripts (FullStory) time to initialize
    if (hasCachedData) {
      setTimeout(() => {
        if (navigator.onLine) fetchRconData(true, false);
      }, initialDelay);
    } else {
      // small delay so we're not executing inside the same sync handler as other injected scripts
      setTimeout(() => {
        if (navigator.onLine) fetchRconData(true, true);
      }, initialDelay);
    }

    // Defer connection checks to later to avoid potential wrappers from fullstory or extensions
    setTimeout(() => {
      if (navigator.onLine) checkServerConnections();
    }, initialDelay + 250);
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRconData(true, false); // Background updates
      checkServerConnections();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [fetchRconData, checkServerConnections]);

  const handleConnect = async (server: Server) => {
    if (server.status !== "online") {
      toast({
        title: "Сервер недоступен",
        description:
          "Сервер находится в оффлайне или на техническом обслуживании",
        variant: "destructive",
      });
      return;
    }

    const connectionStatus = connectionStatuses[server.id];

    if (!connectionStatus) {
      setLoadingConnections((prev) => ({ ...prev, [server.id]: true }));

      try {
        const res = await fetchJsonWithTimeout(`/api/server-status/${server.id}`, undefined, 5000);
        if (!res.ok || !res.json) {
          toast({
            title: "Подключение недоступно",
            description: "Сервер временно недоступен для подключения",
            variant: "destructive",
          });
          return;
        }
        const status: ServerConnectionStatus = res.json;

        setConnectionStatuses((prev) => ({ ...prev, [server.id]: status }));

        if (status.ok && status.connectUrl) {
          window.open(status.connectUrl, "_blank");
        } else {
          toast({
            title: "Подключение недоступно",
            description: "Сервер временно недоступен для подключения",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Ошибка подключения",
          description: "Не удалось проверить статус подключения к серве��у",
          variant: "destructive",
        });
      } finally {
        setLoadingConnections((prev) => ({ ...prev, [server.id]: false }));
      }
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
                <span className="text-sm">Обновление...</span>
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
              className="bg-gaming-card border border-gaming-border rounded-lg p-4 sm:p-6 hover:bg-gaming-card-hover transition-colors"
            >
              {/* Server Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gaming-text">
                  {server.name}
                </h3>
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(server.status)}`}
                  />
                  <span className={`text-sm ${getStatusColor(server.status)}`}>
                    {server.status === "online"
                      ? "Online"
                      : server.status === "offline"
                        ? "Offline"
                        : "Maintenance"}
                  </span>
                </div>
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
                        {Math.max(server.maxPlayers - server.players - (server.reserved || 0), 0)}
                        <span className="text-yellow-400 ml-1">(+{server.reserved})</span>
                      </>
                    ) : (
                      <>{server.players}/{server.maxPlayers}</>
                    )}
                    {server.queue > 0 && (
                      <span className="text-yellow-400 ml-1">(+{server.queue})</span>
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

                <div className="flex items-start">
                  <Gamepad2 className="w-4 h-4 mr-2 mt-0.5 text-gaming-text-muted flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-gaming-text-muted text-xs">
                      Режим:
                    </span>
                    <p className="text-gaming-text text-sm">
                      {server.gameMode}
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

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { Users, MapPin, Gamepad2, Clock, RefreshCw } from "lucide-react";
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
    map: "Loading...",
    gameMode: "Checking...",
    status: "maintenance",
  },
  {
    id: 2,
    name: "RSGS #1",
    players: 0,
    maxPlayers: 100,
    queue: 0,
    map: "Offline",
    gameMode: "Offline",
    status: "offline",
  },
  {
    id: 3,
    name: "RSGS Invasion",
    players: 0,
    maxPlayers: 100,
    queue: 0,
    map: "Offline",
    gameMode: "Offline",
    status: "offline",
  },
  {
    id: 4,
    name: "RSGS International",
    players: 0,
    maxPlayers: 100,
    queue: 0,
    map: "Offline",
    gameMode: "Offline",
    status: "offline",
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

function getStatusBgColor(status: Server["status"]) {
  switch (status) {
    case "online":
      return "bg-green-400/20 border-green-400/30";
    case "offline":
      return "bg-red-400/20 border-red-400/30";
    case "maintenance":
      return "bg-yellow-400/20 border-yellow-400/30";
    default:
      return "bg-gaming-border/20 border-gaming-border/30";
  }
}

function getStatusIcon(status: Server["status"]) {
  switch (status) {
    case "online":
      return "⚡";
    case "offline":
      return "⭕";
    case "maintenance":
      return "🔧";
    default:
      return "❓";
  }
}

function getPlayerFillColor(percentage: number) {
  if (percentage >= 90) return "bg-red-400";
  if (percentage >= 70) return "bg-yellow-400";
  return "bg-gaming-accent";
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
  const [autoRefresh, setAutoRefresh] = useState(true);

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

  // Fetch RCON data with background updates
  const fetchRconData = useCallback(
    async (forceRefresh = false, showLoading = true) => {
      const now = Date.now();

      if (!forceRefresh && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
        return;
      }

      if (showLoading) setIsLoadingRcon(true);

      try {
        const response = await fetch("/api/rcon-status", {
          signal: AbortSignal.timeout(8000), // 8 second timeout
        });

        if (response.ok) {
          const rconData = await response.json();

          const updatedServers = rconData.map((rconServer: any) => {
            const existingServer = serverData.find(s => s.id === rconServer.serverId);
            return {
              id: rconServer.serverId,
              name: existingServer?.name || `RSGS Server ${rconServer.serverId}`,
              players: rconServer.players || 0,
              maxPlayers: rconServer.maxPlayers || 100,
              queue: Math.max(0, (rconServer.players || 0) - (rconServer.maxPlayers || 100)),
              map: rconServer.map || "Unknown",
              gameMode: rconServer.gameMode || "Unknown",
              status: rconServer.status as Server["status"],
            };
          });

          setServerData(updatedServers);
          setLastFetchTime(now);

          // Cache the data
          const cacheData: CacheData = {
            data: updatedServers,
            timestamp: now,
          };
          localStorage.setItem("server_status_cache", JSON.stringify(cacheData));
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Failed to fetch RCON data:", error);
          if (showLoading) {
            toast({
              title: "Ошибка загрузки",
              description: "Не удалось обновить данные серверов",
              variant: "destructive",
            });
          }
        }
      } finally {
        if (showLoading) setIsLoadingRcon(false);
      }
    },
    [lastFetchTime, serverData]
  );

  // Check server connection statuses
  const checkServerConnections = useCallback(async () => {
    try {
      const serverIds = serverData.map(s => s.id);
      const response = await fetch("/api/server-status/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverIds }),
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const statuses: ServerConnectionStatus[] = await response.json();
        const statusMap = statuses.reduce(
          (acc, status) => {
            acc[status.serverId] = status;
            return acc;
          },
          {} as Record<number, ServerConnectionStatus>
        );
        setConnectionStatuses(statusMap);
      }
    } catch (error) {
      console.error("Failed to check server connections:", error);
    }
  }, [serverData]);

  // Initialize data
  useEffect(() => {
    const hasCachedData = loadCachedData();
    
    // Fetch fresh data in background if we have cache, or immediately if no cache
    if (hasCachedData) {
      // Background update after short delay
      setTimeout(() => fetchRconData(true, false), 1000);
    } else {
      fetchRconData(true, true);
    }
    
    checkServerConnections();
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchRconData(true, false); // Background updates
      checkServerConnections();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchRconData, checkServerConnections]);

  const handleConnect = async (server: Server) => {
    if (server.status !== "online") {
      toast({
        title: "Сервер недоступен",
        description: "Сервер находится в оффлайне или на техническом обслуживании",
        variant: "destructive",
      });
      return;
    }

    const connectionStatus = connectionStatuses[server.id];
    
    if (!connectionStatus) {
      setLoadingConnections(prev => ({ ...prev, [server.id]: true }));
      
      try {
        const response = await fetch(`/api/server-status/${server.id}`);
        const status: ServerConnectionStatus = await response.json();
        
        setConnectionStatuses(prev => ({ ...prev, [server.id]: status }));
        
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
          description: "Не удалось проверить статус подключения к серверу",
          variant: "destructive",
        });
      } finally {
        setLoadingConnections(prev => ({ ...prev, [server.id]: false }));
      }
      return;
    }

    if (connectionStatus.ok && connectionStatus.connectUrl) {
      window.open(connectionStatus.connectUrl, "_blank");
    } else {
      toast({
        title: "Подключение недоступно",
        description: connectionStatus.error || "Сервер временно недоступен для подключения",
        variant: "destructive",
      });
    }
  };

  const handleManualRefresh = () => {
    fetchRconData(true, true);
    checkServerConnections();
  };

  const getPlayerPercentage = (players: number, maxPlayers: number) => {
    return Math.min((players / maxPlayers) * 100, 100);
  };

  const isConnectionAvailable = (server: Server) => {
    return server.status === "online" && connectionStatuses[server.id]?.ok === true;
  };

  const getConnectButtonText = (server: Server) => {
    if (server.status !== "online") return "Недоступен";
    if (loadingConnections[server.id]) return "Проверка...";
    
    const connectionStatus = connectionStatuses[server.id];
    if (!connectionStatus) return "Подключиться";
    
    return connectionStatus.ok ? "Подключиться" : "Недоступен";
  };

  return (
    <section id="servers" className="py-16 bg-gaming-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gaming-text mb-2">
              Статус серверов
            </h2>
            <p className="text-gaming-text-muted">
              Информация о серверах обновляется в реальном времени
            </p>
          </div>
          
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
          {serverData.map((server) => {
            const playerPercentage = getPlayerPercentage(server.players, server.maxPlayers);
            
            return (
              <div
                key={server.id}
                className={`relative bg-gaming-card border-2 rounded-xl p-6 transition-all duration-300 hover:scale-105 ${getStatusBgColor(server.status)}`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getStatusIcon(server.status)}</span>
                    <span className={`text-xs font-bold uppercase tracking-wide ${getStatusColor(server.status)}`}>
                      {server.status === "online" ? "Online" : 
                       server.status === "offline" ? "Offline" : "Maintenance"}
                    </span>
                  </div>
                </div>

                {/* Server Name */}
                <div className="mb-6 pr-20">
                  <h3 className="text-xl font-bold text-gaming-text">{server.name}</h3>
                </div>

                {/* Player Count */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gaming-text-muted">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Игроки</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gaming-text">
                        {server.players}
                      </span>
                      <span className="text-gaming-text-muted">/{server.maxPlayers}</span>
                      {server.queue > 0 && (
                        <div className="text-xs text-yellow-400 font-semibold">
                          +{server.queue} в очереди
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gaming-border/30 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${getPlayerFillColor(playerPercentage)}`}
                      style={{ width: `${playerPercentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gaming-text-muted mt-1 text-center">
                    {playerPercentage.toFixed(0)}% заполненность
                  </div>
                </div>

                {/* Server Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gaming-text-muted flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gaming-text-muted uppercase tracking-wide">Карта</div>
                      <div className="text-sm text-gaming-text font-medium truncate">{server.map}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Gamepad2 className="w-4 h-4 mr-2 mt-0.5 text-gaming-text-muted flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gaming-text-muted uppercase tracking-wide">Режим</div>
                      <div className="text-sm text-gaming-text font-medium">{server.gameMode}</div>
                    </div>
                  </div>
                </div>

                {/* Connect Button */}
                <Button
                  onClick={() => handleConnect(server)}
                  disabled={!isConnectionAvailable(server) && server.status === "online" && connectionStatuses[server.id]?.ok === false}
                  className={`w-full font-semibold transition-all duration-200 ${
                    isConnectionAvailable(server)
                      ? "bg-gaming-accent hover:bg-gaming-accent-hover text-black shadow-lg hover:shadow-xl"
                      : server.status === "online" && !connectionStatuses[server.id]
                      ? "bg-gaming-accent/80 hover:bg-gaming-accent text-black"
                      : "bg-gaming-border text-gaming-text-muted cursor-not-allowed"
                  }`}
                >
                  {loadingConnections[server.id] && (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {getConnectButtonText(server)}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Auto-refresh Toggle */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-3 bg-gaming-card border border-gaming-border rounded-lg px-4 py-2">
            <Clock className="w-4 h-4 text-gaming-text-muted" />
            <span className="text-sm text-gaming-text-muted">
              Автообновление: 
            </span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-sm font-medium transition-colors ${
                autoRefresh ? "text-gaming-accent" : "text-gaming-text-muted"
              }`}
            >
              {autoRefresh ? "Включено" : "Отключено"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

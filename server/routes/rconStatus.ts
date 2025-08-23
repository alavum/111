import { RequestHandler } from "express";
import { Rcon } from "rcon-ts";

export interface RconServerInfo {
  serverId: number;
  ip: string;
  port: number;
  rconPort: number;
  rconPassword: string;
  status: "online" | "offline" | "error";
  players?: number;
  maxPlayers?: number;
  map?: string;
  gameMode?: string;
  playerList?: string[];
  error?: string;
}

// Server configuration - only server 1 is active with RCON
const servers: Record<number, Omit<RconServerInfo, "serverId" | "status">> = {
  1: {
    ip: "87.121.89.14",
    port: 7787,
    rconPort: 21114,
    rconPassword: "password",
  },
  2: {
    ip: "server2.rgs-squad.ru",
    port: 7787,
    rconPort: 21115,
    rconPassword: "offline",
  },
  3: {
    ip: "server3.rgs-squad.ru", 
    port: 7787,
    rconPort: 21116,
    rconPassword: "offline",
  },
  4: {
    ip: "server4.rgs-squad.ru",
    port: 7787,
    rconPort: 21117,
    rconPassword: "offline",
  },
};

// Real RCON query function for Squad
async function querySquadRconServer(ip: string, port: number, password: string): Promise<any> {
  let rcon: Rcon | null = null;
  
  try {
    rcon = new Rcon({
      host: ip,
      port: port,
      password: password,
      timeout: 10000,
    });
    
    await rcon.connect();
    
    // Squad-specific RCON commands
    const [listPlayersResponse, mapResponse, serverInfoResponse] = await Promise.all([
      rcon.send('ListPlayers').catch(() => ''),
      rcon.send('ShowCurrentMap').catch(() => ''),
      rcon.send('ServerInfo').catch(() => ''),
    ]);
    
    await rcon.disconnect();
    
    // Parse Squad responses
    const playerCount = parseSquadPlayerCount(listPlayersResponse);
    const mapInfo = parseSquadMapInfo(mapResponse);
    const serverInfo = parseSquadServerInfo(serverInfoResponse);
    
    return {
      players: playerCount,
      maxPlayers: serverInfo.maxPlayers || 80,
      map: mapInfo.map || "Unknown",
      gameMode: mapInfo.gameMode || "Squad",
      playerList: parseSquadPlayerList(listPlayersResponse),
    };
    
  } catch (error) {
    if (rcon) {
      try {
        await rcon.disconnect();
      } catch (disconnectError) {
        console.error('Error disconnecting RCON:', disconnectError);
      }
    }
    throw error;
  }
}

// Parse Squad player count from ListPlayers response
function parseSquadPlayerCount(response: string): number {
  if (!response) return 0;
  
  // Squad ListPlayers format: ID: 0 | SteamID: 76561198000000000 | Name: PlayerName | Team ID: 0 | Squad ID: 0
  const playerLines = response.split('\n').filter(line => 
    line.includes('SteamID:') && line.includes('Name:')
  );
  
  return playerLines.length;
}

// Parse Squad map info
function parseSquadMapInfo(response: string): { map: string; gameMode: string } {
  if (!response) return { map: "Unknown", gameMode: "Squad" };
  
  // Squad ShowCurrentMap format varies, try to extract map name
  const mapMatch = response.match(/Current map is (.+)/i) || 
                   response.match(/Map: (.+)/i) ||
                   response.match(/(.+)/);
  
  let map = "Unknown";
  let gameMode = "Squad";
  
  if (mapMatch && mapMatch[1]) {
    const fullMapName = mapMatch[1].trim();
    
    // Extract game mode from map name (e.g., "Anvil RAAS v2" -> "RAAS")
    if (fullMapName.includes('RAAS')) gameMode = 'RAAS';
    else if (fullMapName.includes('AAS')) gameMode = 'AAS';
    else if (fullMapName.includes('Invasion')) gameMode = 'Invasion';
    else if (fullMapName.includes('TC')) gameMode = 'Territory Control';
    else if (fullMapName.includes('Skirmish')) gameMode = 'Skirmish';
    
    map = fullMapName;
  }
  
  return { map, gameMode };
}

// Parse Squad server info
function parseSquadServerInfo(response: string): { maxPlayers?: number } {
  if (!response) return {};
  
  // Try to extract max players from server info
  const maxPlayersMatch = response.match(/Max Players: (\d+)/i) ||
                          response.match(/MaxPlayers=(\d+)/i);
  
  return {
    maxPlayers: maxPlayersMatch ? parseInt(maxPlayersMatch[1]) : 80
  };
}

// Parse Squad player list
function parseSquadPlayerList(response: string): string[] {
  if (!response) return [];
  
  const playerLines = response.split('\n').filter(line => 
    line.includes('SteamID:') && line.includes('Name:')
  );
  
  return playerLines.map(line => {
    const nameMatch = line.match(/Name: ([^|]+)/);
    return nameMatch ? nameMatch[1].trim() : '';
  }).filter(name => name.length > 0);
}

// Check single server status
export const checkRconServerStatus: RequestHandler = async (req, res) => {
  const serverId = parseInt(req.params.serverId);
  
  if (!serverId || !servers[serverId]) {
    return res.status(404).json({
      error: "Server not found",
      availableServers: Object.keys(servers),
    });
  }

  const serverConfig = servers[serverId];
  
  // Only server 1 has real RCON, others are offline
  if (serverId !== 1) {
    const response: RconServerInfo = {
      serverId,
      ...serverConfig,
      status: "offline",
      players: 0,
      maxPlayers: 80,
      map: "Offline",
      gameMode: "Offline",
      error: "Server is offline",
    };
    
    return res.json(response);
  }
  
  try {
    const serverInfo = await querySquadRconServer(
      serverConfig.ip,
      serverConfig.rconPort,
      serverConfig.rconPassword
    );
    
    const response: RconServerInfo = {
      serverId,
      ...serverConfig,
      status: "online",
      ...serverInfo,
    };
    
    res.json(response);
    
  } catch (error) {
    console.error(`RCON query failed for server ${serverId}:`, error);
    
    const response: RconServerInfo = {
      serverId,
      ...serverConfig,
      status: "offline",
      players: 0,
      maxPlayers: 80,
      map: "Connection failed",
      gameMode: "Offline",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
    res.json(response);
  }
};

// Check all servers status
export const checkAllRconServers: RequestHandler = async (req, res) => {
  const serverIds = Object.keys(servers).map(Number);
  
  try {
    const statusPromises = serverIds.map(async (serverId) => {
      const serverConfig = servers[serverId];
      
      // Only check server 1 via RCON, others are offline
      if (serverId !== 1) {
        return {
          serverId,
          ...serverConfig,
          status: "offline" as const,
          players: 0,
          maxPlayers: 80,
          map: "Offline",
          gameMode: "Offline",
          error: "Server is offline",
        };
      }
      
      try {
        const serverInfo = await querySquadRconServer(
          serverConfig.ip,
          serverConfig.rconPort,
          serverConfig.rconPassword
        );
        
        return {
          serverId,
          ...serverConfig,
          status: "online" as const,
          ...serverInfo,
        };
      } catch (error) {
        return {
          serverId,
          ...serverConfig,
          status: "offline" as const,
          players: 0,
          maxPlayers: 80,
          map: "Connection failed",
          gameMode: "Offline",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });
    
    const results = await Promise.all(statusPromises);
    res.json(results);
    
  } catch (error) {
    console.error("Failed to check all servers:", error);
    res.status(500).json({ 
      error: "Failed to check server statuses" 
    });
  }
};

// Get server list
export const getServerList: RequestHandler = (req, res) => {
  const serverList = Object.entries(servers).map(([id, config]) => ({
    serverId: parseInt(id),
    name: `RSGS Server ${id}`,
    ip: config.ip,
    port: config.port,
    status: parseInt(id) === 1 ? "checking" : "offline",
  }));
  
  res.json(serverList);
};

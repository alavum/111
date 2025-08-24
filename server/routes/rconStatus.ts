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
      timeout: 15000,
    });
    
    await rcon.connect();
    
    // Squad-specific RCON commands
    const [listPlayersResponse, mapResponse, serverInfoResponse] = await Promise.all([
      rcon.send('ListPlayers').catch((err) => {
        console.error('ListPlayers command failed:', err.message);
        return '';
      }),
      rcon.send('ShowCurrentMap').catch((err) => {
        console.error('ShowCurrentMap command failed:', err.message);
        return '';
      }),
      rcon.send('ServerInfo').catch((err) => {
        console.error('ServerInfo command failed:', err.message);
        return '';
      }),
    ]);

    await rcon.disconnect();

    // Debug logging
    console.log('RCON Responses:');
    console.log('ListPlayers:', listPlayersResponse.substring(0, 200) + '...');
    console.log('ShowCurrentMap:', mapResponse);
    console.log('ServerInfo:', serverInfoResponse.substring(0, 200) + '...');

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
  // or sometimes just shows total player count at top

  // Try to get total from summary line first
  const summaryMatch = response.match(/(\d+) players online/i) ||
                       response.match(/Total: (\d+)/i) ||
                       response.match(/Players: (\d+)/i);

  if (summaryMatch) {
    return parseInt(summaryMatch[1]);
  }

  // Fallback: count individual player lines
  const playerLines = response.split('\n').filter(line =>
    (line.includes('SteamID:') && line.includes('Name:')) ||
    (line.includes('ID:') && line.includes('Name:') && line.includes('Team'))
  );

  return playerLines.length;
}

// Parse Squad map info
function parseSquadMapInfo(response: string): { map: string; gameMode: string } {
  if (!response) return { map: "Unknown", gameMode: "Unknown" };

  // Squad ShowCurrentMap format: "Current level is GE | Tallil, layer is GE_Tallil_SEED_CAS_LOACH_ONLY, factions GE_Blufor GE_Opfor"
  let map = "Unknown";
  let gameMode = "Unknown";

  // Extract layer name from "layer is [NAME]"
  const layerMatch = response.match(/layer is ([^,]+)/i);
  if (layerMatch && layerMatch[1]) {
    map = layerMatch[1].trim();

    // Extract game mode from layer name
    const layerName = map.toUpperCase();
    if (layerName.includes('_RAAS_')) gameMode = 'RAAS';
    else if (layerName.includes('_AAS_')) gameMode = 'AAS';
    else if (layerName.includes('_INVASION_')) gameMode = 'Invasion';
    else if (layerName.includes('_TC_')) gameMode = 'Territory Control';
    else if (layerName.includes('_SKIRMISH_')) gameMode = 'Skirmish';
    else if (layerName.includes('_SEED_')) gameMode = 'SEED';
    else if (layerName.includes('RAAS')) gameMode = 'RAAS';
    else if (layerName.includes('AAS')) gameMode = 'AAS';
    else if (layerName.includes('INVASION')) gameMode = 'Invasion';
    else if (layerName.includes('SKIRMISH')) gameMode = 'Skirmish';
    else if (layerName.includes('SEED')) gameMode = 'SEED';
    else gameMode = 'Squad';
  } else {
    // Fallback: try to extract from "Current level is" or other formats
    const mapMatch = response.match(/Current level is (.+?)(?:,|$)/i) ||
                     response.match(/Map: (.+?)(?:,|$)/i);

    if (mapMatch && mapMatch[1]) {
      map = mapMatch[1].trim();
      // Try to extract gamemode from map name
      if (map.includes('RAAS')) gameMode = 'RAAS';
      else if (map.includes('AAS')) gameMode = 'AAS';
      else if (map.includes('Invasion')) gameMode = 'Invasion';
      else if (map.includes('SEED')) gameMode = 'SEED';
      else gameMode = 'Squad';
    }
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

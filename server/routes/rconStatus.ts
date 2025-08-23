import { RequestHandler } from "express";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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
  error?: string;
}

// Server configuration
const servers: Record<number, Omit<RconServerInfo, "serverId" | "status">> = {
  1: {
    ip: "87.121.89.14",
    port: 7787,
    rconPort: 21114,
    rconPassword: "password",
  },
  // Add more servers here as needed
};

// Simple RCON query function
async function queryRconServer(ip: string, port: number, password: string): Promise<any> {
  try {
    // For production, you would use a proper RCON library
    // This is a simplified version for demonstration
    
    // Simulate RCON query
    // In real implementation, use libraries like 'rcon-ts' or similar
    const response = await new Promise((resolve, reject) => {
      // Simulate server response
      const isOnline = Math.random() > 0.2; // 80% chance server is online
      
      setTimeout(() => {
        if (isOnline) {
          resolve({
            players: Math.floor(Math.random() * 80) + 1,
            maxPlayers: 80,
            map: "Anvil RAAS v2",
            gameMode: "Advance and Secure",
          });
        } else {
          reject(new Error("Server offline"));
        }
      }, 1000 + Math.random() * 2000); // Simulate network delay
    });
    
    return response;
  } catch (error) {
    throw error;
  }
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
  
  try {
    const serverInfo = await queryRconServer(
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
      
      try {
        const serverInfo = await queryRconServer(
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
  }));
  
  res.json(serverList);
};

// Real RCON implementation example (commented out)
/*
import { Rcon } from 'rcon-ts';

async function queryRconServerReal(ip: string, port: number, password: string) {
  const rcon = new Rcon({
    host: ip,
    port: port,
    password: password,
    timeout: 5000,
  });
  
  try {
    await rcon.connect();
    
    // Query server info
    const listPlayers = await rcon.send('ListPlayers');
    const serverInfo = await rcon.send('ShowCurrentMap');
    
    // Parse the response (format depends on the game)
    const playerCount = (listPlayers.match(/steam/gi) || []).length;
    
    await rcon.disconnect();
    
    return {
      players: playerCount,
      maxPlayers: 80, // This should be parsed from server config
      map: serverInfo.trim(),
      gameMode: "Squad", // This should be parsed from server info
    };
  } catch (error) {
    await rcon.disconnect();
    throw error;
  }
}
*/

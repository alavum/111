interface Server {
  id: number;
  name: string;
  players: number;
  maxPlayers: number;
  queue: number;
  map: string;
  gameMode: string;
  status: 'online' | 'offline' | 'maintenance';
}

const servers: Server[] = [
  {
    id: 1,
    name: "RSGS Free",
    players: 98,
    maxPlayers: 100,
    queue: 3,
    map: "Anvil RAAS v2",
    gameMode: "Advance and Secure",
    status: 'online'
  },
  {
    id: 2,
    name: "RSGS #1",
    players: 98,
    maxPlayers: 100,
    queue: 5,
    map: "Yehorivka RAAS v2",
    gameMode: "Advance and Secure",
    status: 'online'
  },
  {
    id: 3,
    name: "RSGS Invasion",
    players: 96,
    maxPlayers: 100,
    queue: 4,
    map: "Mutaha Invasion v1",
    gameMode: "Invasion",
    status: 'online'
  },
  {
    id: 4,
    name: "RSGS International",
    players: 0,
    maxPlayers: 100,
    queue: 0,
    map: "Sumari Seed v1",
    gameMode: "Random AAS",
    status: 'offline'
  }
];

function getStatusColor(status: Server['status']) {
  switch (status) {
    case 'online':
      return 'text-gaming-success';
    case 'offline':
      return 'text-gaming-error';
    case 'maintenance':
      return 'text-gaming-warning';
    default:
      return 'text-gaming-text-muted';
  }
}

function getStatusDot(status: Server['status']) {
  switch (status) {
    case 'online':
      return 'bg-gaming-success';
    case 'offline':
      return 'bg-gaming-error';
    case 'maintenance':
      return 'bg-gaming-warning';
    default:
      return 'bg-gaming-text-muted';
  }
}

export default function ServerStatus() {
  return (
    <section className="py-12 bg-gaming-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gaming-text mb-8">
          Статус серверов
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servers.map((server) => (
            <div
              key={server.id}
              className="bg-gaming-card border border-gaming-border rounded-lg p-6 hover:bg-gaming-card-hover transition-colors"
            >
              {/* Server Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gaming-text">{server.name}</h3>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(server.status)}`} />
                  <span className={`text-sm ${getStatusColor(server.status)}`}>
                    {server.status === 'online' ? 'Online' : 
                     server.status === 'offline' ? 'Offline' : 'Maintenance'}
                  </span>
                </div>
              </div>

              {/* Player Count */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gaming-text-muted text-sm">Игроки</span>
                  <span className="text-gaming-text font-semibold">
                    {server.players}/{server.maxPlayers}
                    {server.queue > 0 && (
                      <span className="text-gaming-warning ml-1">(+{server.queue})</span>
                    )}
                  </span>
                </div>
                <div className="w-full bg-gaming-border rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full bg-gaming-accent"
                    style={{ width: `${(server.players / server.maxPlayers) * 100}%` }}
                  />
                </div>
              </div>

              {/* Map and Game Mode */}
              <div className="space-y-2">
                <div>
                  <span className="text-gaming-text-muted text-sm">Карта:</span>
                  <p className="text-gaming-text text-sm">{server.map}</p>
                </div>
                <div>
                  <span className="text-gaming-text-muted text-sm">Режим:</span>
                  <p className="text-gaming-text text-sm">{server.gameMode}</p>
                </div>
              </div>

              {/* Connect Button */}
              <button
                disabled={server.status !== 'online'}
                className={`w-full mt-4 py-2 px-4 rounded-md font-medium transition-colors ${
                  server.status === 'online'
                    ? 'bg-gaming-accent hover:bg-gaming-accent-hover text-black'
                    : 'bg-gaming-border text-gaming-text-muted cursor-not-allowed'
                }`}
              >
                {server.status === 'online' ? 'Подключиться' : 'Недоступен'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

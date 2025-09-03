import { Trophy, Target, Heart, Shield, Zap } from "lucide-react";

interface PlayerStat {
  rank: number;
  name: string;
  value: number;
  avatar?: string;
}

const mockData = {
  commanders: [
    { rank: 1, name: "Игрок 1", value: 375 },
    { rank: 2, name: "Игрок 2", value: 298 },
    { rank: 3, name: "Игрок 3", value: 275 },
  ],
  snipers: [
    { rank: 1, name: "Игрок 1", value: 537 },
    { rank: 2, name: "И��рок 2", value: 301 },
    { rank: 3, name: "Игрок 3", value: 150 },
  ],
  medics: [
    { rank: 1, name: "Игрок 1", value: 193 },
    { rank: 2, name: "Игрок 2", value: 130 },
    { rank: 3, name: "Игрок 3", value: 125 },
  ],
  soldiers: [
    { rank: 1, name: "Игрок 1", value: 770 },
    { rank: 2, name: "Игрок 2", value: 458 },
    { rank: 3, name: "Игрок 3", value: 420 },
  ],
  gunners: [
    { rank: 1, name: "Игрок 1", value: 370 },
    { rank: 2, name: "Игрок 2", value: 356 },
    { rank: 3, name: "Игрок 3", value: 338 },
  ],
  kills: [
    { rank: 1, name: "Игрок 1", value: 770 },
    { rank: 2, name: "Игрок 2", value: 458 },
    { rank: 3, name: "Игрок 3", value: 420 },
    { rank: 4, name: "Игрок 4", value: 401 },
    { rank: 5, name: "Игрок 5", value: 401 },
  ],
  damage: [
    { rank: 1, name: "Игрок 1", value: 537 },
    { rank: 2, name: "Игрок 2", value: 301 },
    { rank: 3, name: "Игрок 3", value: 300 },
    { rank: 4, name: "Игрок 4", value: 201 },
    { rank: 5, name: "Игрок 5", value: 201 },
  ],
  bestPlayer: [
    { rank: 1, name: "Игрок 1", value: 193 },
    { rank: 2, name: "Игрок 2", value: 150 },
    { rank: 3, name: "Игрок 3", value: 76 },
    { rank: 4, name: "Игрок 4", value: 50 },
    { rank: 5, name: "Игрок 5", value: 75 },
  ],
};

interface StatCardProps {
  title: string;
  data: PlayerStat[];
  icon: React.ReactNode;
  colorClass: string;
}

function StatCard({ title, data, icon, colorClass }: StatCardProps) {
  const showHours =
    title === "CMD" ||
    title === "Сквадные" ||
    title === "Медики" ||
    title === "Стрелки" ||
    title === "Пулеметчики";

  return (
    <div className="bg-gaming-card border border-gaming-border rounded-lg p-4">
      <div className={`flex items-center gap-2 mb-4 ${colorClass}`}>
        {icon}
        <h3 className="font-semibold text-gaming-text">{title}</h3>
      </div>

      <div className="space-y-2">
        {data.map((player) => (
          <div
            key={player.rank}
            className="flex items-center justify-between py-2 px-2 bg-gaming-bg/50 rounded"
          >
            <div className="flex items-center gap-3">
              <span className={`${colorClass} font-bold text-sm w-4`}>
                {player.rank}.
              </span>
              <div className="w-6 h-6 bg-gaming-border rounded-full flex items-center justify-center">
                <span className="text-xs text-gaming-text">👤</span>
              </div>
              <span className="text-gaming-text text-sm truncate">
                {player.name}
              </span>
            </div>
            <span className={`text-${color} font-semibold text-sm`}>
              {player.value}
              {showHours ? " ч." : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatListProps {
  title: string;
  data: PlayerStat[];
  colorClass: string;
}

function StatList({ title, data, colorClass }: StatListProps) {
  return (
    <div className="bg-gaming-card border border-gaming-border rounded-lg p-4">
      <h3 className={`font-semibold text-gaming-text mb-4 ${colorClass}`}>
        {title}
      </h3>

      <div className="space-y-2">
        {data.map((player) => (
          <div
            key={player.rank}
            className="flex items-center justify-between py-2 px-2 bg-gaming-bg/50 rounded"
          >
            <div className="flex items-center gap-3">
              <span className={`${colorClass} font-bold text-sm w-4`}>
                {player.rank}.
              </span>
              <div className="w-6 h-6 bg-gaming-border rounded-full flex items-center justify-center">
                <span className="text-xs text-gaming-text">👤</span>
              </div>
              <span className="text-gaming-text text-sm truncate">
                {player.name}
              </span>
            </div>
            <span className={`text-${color} font-semibold text-sm`}>
              {player.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Statistics() {
  return (
    <section className="py-16 bg-gaming-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gaming-text mb-4">
            Статистика за неделю
          </h2>
          <p className="text-gaming-text-muted">
            Лучшие игроки по различным показателям
          </p>
        </div>

        {/* Statistics Content */}
        <div className="space-y-8 blur-sm">
          {/* Role-based Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="CMD"
              data={mockData.commanders}
              icon={<Shield className="w-5 h-5" />}
              color="yellow-400"
            />

            <StatCard
              title="Сквадные"
              data={mockData.snipers}
              icon={<Target className="w-5 h-5" />}
              color="red-400"
            />

            <StatCard
              title="Медики"
              data={mockData.medics}
              icon={<Heart className="w-5 h-5" />}
              color="green-400"
            />

            <StatCard
              title="Стрелки"
              data={mockData.soldiers}
              icon={<Zap className="w-5 h-5" />}
              color="blue-400"
            />

            <StatCard
              title="Пулеметчики"
              data={mockData.gunners}
              icon={<Trophy className="w-5 h-5" />}
              color="purple-400"
            />
          </div>

          {/* Performance Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatList
              title="Количество убийств"
              data={mockData.kills}
              color="gaming-accent"
            />

            <StatList
              title="Подбития"
              data={mockData.damage}
              color="gaming-accent"
            />

            <StatList
              title="Лучший игрок"
              data={mockData.bestPlayer}
              color="gaming-accent"
            />
          </div>
        </div>

        {/* Development Overlay */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center bg-gaming-bg/10 backdrop-blur-sm">
          <div className="text-center bg-gaming-card border-2 border-gaming-accent rounded-lg p-6 shadow-2xl mx-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gaming-accent/20 rounded-full text-gaming-accent mb-3">
              <Trophy className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-gaming-text mb-2">
              В разработке
            </h3>
            <p className="text-gaming-text-muted mb-4 max-w-sm text-sm">
              Система статистик�� находится на стадии разработки. Скоро вы
              сможете видеть подробную статистику игроков.
            </p>

            <div className="flex items-center justify-center space-x-2 text-gaming-accent">
              <div className="w-2 h-2 bg-gaming-accent rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gaming-accent rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-gaming-accent rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

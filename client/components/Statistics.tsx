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

      <div>
        {data.slice(0, 10).map((player) => (
          <div
            key={player.rank}
            className="flex items-center justify-between py-2 px-2 rounded transition-colors group hover:bg-gaming-card-hover"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`${player.rank <= 3 ? "text-gaming-accent" : "text-gaming-text-muted"} font-bold text-sm w-4`}>{player.rank}.</span>
              <div className="w-6 h-6 bg-gaming-border rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-gaming-text">👤</span>
              </div>
              <div className="min-w-0">
                <div className={`text-sm truncate ${player.rank <= 3 ? "text-gaming-accent font-semibold" : "text-gaming-text"}`}>{player.name}</div>
                {showHours && (
                  <div className="text-xs text-gaming-text-muted mt-0.5">ч.</div>
                )}
              </div>
            </div>

            <div className={`${player.rank <= 3 ? "text-gaming-accent font-semibold" : colorClass} text-sm`}>{player.value}</div>
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
  const showTopHighlight = title === "Количество убийств" || title === "Поднятий" || title === "Лучший экипаж";

  return (
    <div className="bg-gaming-card border border-gaming-border rounded-lg p-4 min-h-[380px]">
      <h3 className={`font-semibold text-gaming-text mb-4 ${colorClass}`}>
        {title}
      </h3>

      <div>
        {data.slice(0, 10).map((player) => {
          const isTop = player.rank <= 3 && showTopHighlight;
          return (
            <div
              key={player.rank}
              className={`flex items-center justify-between py-2 px-2 transition-colors group hover:bg-gaming-card-hover ${isTop ? "" : ""}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`${isTop ? "text-gaming-accent font-semibold" : "text-gaming-text-muted"} font-bold text-sm w-4`}>{player.rank}.</span>
                <div className="w-6 h-6 bg-gaming-border rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gaming-text">👤</span>
                </div>
                <div className="min-w-0">
                  <div className={`text-sm truncate ${isTop ? "text-gaming-accent font-semibold" : "text-gaming-text"}
                    `}>{player.name}</div>
                  {/* If this list uses hours, show unit under name */}
                  {(title === "CMD" || title === "Сквадные" || title === "Медики" || title === "Стрелки" || title === "Пулеметчики") && (
                    <div className="text-xs text-gaming-text-muted mt-0.5">ч.</div>
                  )}
                </div>
              </div>

              <div className={`${isTop ? "text-gaming-accent font-semibold" : colorClass} text-sm`}>{player.value}</div>
            </div>
          );
        })}
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
        <div className="space-y-8">
          {/* Role-based Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <StatCard
              title="CMD"
              data={mockData.commanders}
              icon={<Shield className="w-5 h-5" />}
              colorClass="text-yellow-400"
            />

            <StatCard
              title="Сквадные"
              data={mockData.snipers}
              icon={<Target className="w-5 h-5" />}
              colorClass="text-red-400"
            />

            <StatCard
              title="Медики"
              data={mockData.medics}
              icon={<Heart className="w-5 h-5" />}
              colorClass="text-green-400"
            />

            <StatCard
              title="Стрелки"
              data={mockData.soldiers}
              icon={<Zap className="w-5 h-5" />}
              colorClass="text-blue-400"
            />

            <StatCard
              title="Пулеметчики"
              data={mockData.gunners}
              icon={<Trophy className="w-5 h-5" />}
              colorClass="text-purple-400"
            />
          </div>

          {/* Performance Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatList
              title="Количество убийств"
              data={mockData.kills}
              colorClass="text-gaming-accent"
            />

            <StatList
              title="Подбития"
              data={mockData.damage}
              colorClass="text-gaming-accent"
            />

            <StatList
              title="Лучший игрок"
              data={mockData.bestPlayer}
              colorClass="text-gaming-accent"
            />
          </div>
        </div>

      </div>
    </section>
  );
}

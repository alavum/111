import React from "react";
import { Trophy } from "lucide-react";

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
    { rank: 3, name: "��грок 3", value: 420 },
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
    <div className="bg-gaming-card border border-gaming-border rounded-lg p-4 w-full">
      <div className={`flex flex-col items-center gap-2 mb-4`}>
        {React.isValidElement(icon)
          ? React.cloneElement(icon, {
              className: `w-8 h-8 object-contain ${icon.props.className ?? ""}`,
            })
          : icon}
        <h3 className={`text-center font-bold ${colorClass}`}>{title}</h3>
      </div>

      <div>
        {data.slice(0, 10).map((player) => {
          const hours = Math.floor(player.value / 60);
          const mins = player.value % 60;
          return (
            <div
              key={player.rank}
              className="flex items-center justify-between py-1.5 px-2 rounded transition-colors group hover:bg-gaming-card-hover"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`${player.rank <= 3 ? "text-white font-bold" : "text-gaming-text-muted"} text-sm w-4`}
                >
                  {player.rank}.
                </span>
                <div className="w-6 h-6 bg-gaming-border rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gaming-text">👤</span>
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-sm truncate ${player.rank <= 3 ? "text-white font-bold" : "text-gaming-text font-semibold"} group-hover:text-white`}
                  >
                    {player.name}
                  </div>
                  {showHours && (
                    <div className="text-xs text-gaming-text-muted mt-0.5">
                      {hours} ч {mins} мин
                    </div>
                  )}
                </div>
              </div>

              {!showHours && (
                <div
                  className={`${player.rank <= 3 ? "text-white font-bold" : colorClass + " font-semibold"} text-sm group-hover:text-white`}
                >
                  {player.value}
                </div>
              )}
            </div>
          );
        })}
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
  const showTopHighlight =
    title === "Количество убийств" ||
    title === "П��днятий" ||
    title === "Лучший экипаж";

  return (
    <div className="bg-gaming-card border border-gaming-border rounded-lg p-4 min-h-[220px]">
      <h3 className={`text-center font-bold mb-4 ${colorClass}`}>{title}</h3>

      <div>
        {data.slice(0, 10).map((player) => {
          const isTop = player.rank <= 3 && showTopHighlight;
          return (
            <div
              key={player.rank}
              className={`flex items-center justify-between py-1.5 px-2 transition-colors group hover:bg-gaming-card-hover ${isTop ? "bg-gaming-bg/10" : ""}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`${isTop ? "text-white font-bold" : "text-gaming-text-muted font-semibold"} text-sm w-4`}
                >
                  {player.rank}.
                </span>
                <div className="w-6 h-6 bg-gaming-border rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gaming-text">👤</span>
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-sm truncate ${isTop ? "text-white font-bold" : "text-gaming-text font-semibold"} group-hover:text-white`}
                  >
                    {player.name}
                  </div>
                  {/* If this list uses hours, show unit under name */}
                  {(title === "CMD" ||
                    title === "Сквадные" ||
                    title === "Медики" ||
                    title === "Стрелки" ||
                    title === "Пулеметчики") && (
                    <div className="text-xs text-gaming-text-muted mt-0.5">
                      ч.
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`${isTop ? "text-white font-bold" : colorClass + " font-semibold"} text-sm group-hover:text-white`}
              >
                {player.value}
              </div>
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
        <div className="relative">
          <div className="space-y-8 blur-sm">
            {/* Role-based Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <StatCard
                title="CMD"
                data={mockData.commanders}
                icon={
                  <img
                    src="/images/icon-cmd.svg"
                    alt="CMD"
                    className="w-8 h-8 object-contain"
                  />
                }
                colorClass="text-yellow-400"
              />

              <StatCard
                title="Сквадные"
                data={mockData.snipers}
                icon={
                  <img
                    src="/images/icon-squad.svg"
                    alt="Squad"
                    className="w-8 h-8 object-contain"
                  />
                }
                colorClass="text-yellow-400"
              />

              <StatCard
                title="Медики"
                data={mockData.medics}
                icon={
                  <img
                    src="/images/icon-medic.svg"
                    alt="Medic"
                    className="w-8 h-8 object-contain"
                  />
                }
                colorClass="text-yellow-400"
              />

              <StatCard
                title="Стрелки"
                data={mockData.soldiers}
                icon={
                  <img
                    src="/images/icon-rifleman.svg"
                    alt="Rifleman"
                    className="w-8 h-8 object-contain"
                  />
                }
                colorClass="text-yellow-400"
              />

              <div className="hidden sm:block">
                <StatCard
                  title="Пулеметчики"
                  data={mockData.gunners}
                  icon={
                    <img
                      src="/images/icon-gunner.svg"
                      alt="Machinegunner"
                      className="w-8 h-8 object-contain"
                    />
                  }
                  colorClass="text-yellow-400"
                />
              </div>
            </div>

            {/* Performance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatList
                title="К��личество убийств"
                data={mockData.kills}
                colorClass="text-yellow-400"
              />

              <StatList
                title="Поднятий"
                data={mockData.damage}
                colorClass="text-yellow-400"
              />

              <StatList
                title="Лучший экипаж"
                data={mockData.bestPlayer}
                colorClass="text-yellow-400"
              />
            </div>
          </div>

          {/* Development Overlay */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="text-center bg-gaming-card border-2 border-gaming-accent rounded-lg p-6 shadow-2xl mx-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gaming-accent/20 rounded-full text-gaming-accent mb-3">
                <Trophy className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-gaming-text mb-2">
                В разработке
              </h3>
              <p className="text-gaming-text-muted mb-4 max-w-sm text-sm">
                Система статистик находится на стадии разраб��тки. Скоро вы
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
      </div>
    </section>
  );
}

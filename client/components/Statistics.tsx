import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Target, Heart, Crosshair, Zap } from "lucide-react";

interface Player {
  id: number;
  name: string;
  score: number;
  avatar?: string;
  rank: number;
}

interface StatCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  players: Player[];
  color: string;
}

const generatePlayers = (count: number, baseScore: number = 1000): Player[] => {
  const names = [
    "Volkov", "Petrov", "Smirnov", "Kuznetsov", "Popov", "Lebedev", "Kozlov", "Novikov",
    "Morozov", "Petrov", "Volkov", "Sokolov", "Zaytsev", "Pavlov", "Semenov", "Golubev"
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length] + (i > names.length - 1 ? ` ${Math.floor(i / names.length) + 1}` : ''),
    score: baseScore - i * 50 + Math.floor(Math.random() * 100),
    rank: i + 1
  }));
};

const statCategories: StatCategory[] = [
  {
    id: "commanders",
    title: "Командиры",
    icon: <Trophy className="w-5 h-5" />,
    players: generatePlayers(5, 2500),
    color: "text-gaming-warning"
  },
  {
    id: "snipers", 
    title: "Снайперы",
    icon: <Target className="w-5 h-5" />,
    players: generatePlayers(5, 2200),
    color: "text-red-400"
  },
  {
    id: "medics",
    title: "Медики", 
    icon: <Heart className="w-5 h-5" />,
    players: generatePlayers(5, 2000),
    color: "text-green-400"
  },
  {
    id: "riflemen",
    title: "Стрелки",
    icon: <Crosshair className="w-5 h-5" />,
    players: generatePlayers(5, 1800),
    color: "text-blue-400"
  },
  {
    id: "gunners",
    title: "Пулеметчики",
    icon: <Zap className="w-5 h-5" />,
    players: generatePlayers(5, 1600),
    color: "text-purple-400"
  }
];

const topPlayers = generatePlayers(10, 3000);

export default function Statistics() {
  return (
    <section className="py-12 bg-gaming-card relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gaming-text mb-8">
          Статистика за неделю
        </h2>

        {/* Category Leaderboards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {statCategories.map((category) => (
            <div key={category.id} className="bg-gaming-bg border border-gaming-border rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className={`${category.color} mr-2`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gaming-text">{category.title}</h3>
              </div>
              
              <div className="space-y-3">
                {category.players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-gaming-accent font-semibold text-sm w-4">
                        {player.rank}
                      </span>
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={player.avatar} />
                        <AvatarFallback className="text-xs bg-gaming-border text-gaming-text">
                          {player.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gaming-text text-sm truncate max-w-20">
                        {player.name}
                      </span>
                    </div>
                    <span className="text-gaming-accent font-semibold text-sm">
                      {player.score.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Main Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Players */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gaming-text mb-4 flex items-center">
              <Trophy className="w-5 h-5 text-gaming-warning mr-2" />
              Лучшие игроки
            </h3>
            <div className="bg-gaming-bg border border-gaming-border rounded-lg">
              <div className="divide-y divide-gaming-border">
                {topPlayers.map((player, index) => (
                  <div key={player.id} className="p-4 flex items-center justify-between hover:bg-gaming-card-hover transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className={`font-bold text-lg w-6 ${
                        index === 0 ? 'text-gaming-warning' : 
                        index === 1 ? 'text-gray-400' : 
                        index === 2 ? 'text-orange-400' : 'text-gaming-text-muted'
                      }`}>
                        {index + 1}
                      </span>
                      <Avatar>
                        <AvatarImage src={player.avatar} />
                        <AvatarFallback className="bg-gaming-border text-gaming-text">
                          {player.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gaming-text">{player.name}</p>
                        <p className="text-gaming-text-muted text-sm">Игрок RSGS</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gaming-accent">{player.score.toLocaleString()}</p>
                      <p className="text-gaming-text-muted text-sm">очков</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div>
            <h3 className="text-xl font-bold text-gaming-text mb-4">Общая статистика</h3>
            <div className="space-y-4">
              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-4">
                <h4 className="font-semibold text-gaming-text mb-2">Активность сегодня</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gaming-text-muted">Онлайн игроков</span>
                    <span className="text-gaming-accent font-semibold">292</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gaming-text-muted">Всего матчей</span>
                    <span className="text-gaming-accent font-semibold">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gaming-text-muted">Новых игроков</span>
                    <span className="text-gaming-accent font-semibold">23</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-4">
                <h4 className="font-semibold text-gaming-text mb-2">Популярные карты</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gaming-text-muted">Anvil RAAS</span>
                    <span className="text-gaming-text">34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gaming-text-muted">Yehorivka</span>
                    <span className="text-gaming-text">28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gaming-text-muted">Mutaha</span>
                    <span className="text-gaming-text">22%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

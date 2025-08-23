import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Shield, Zap, Users, Play, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    id: 1,
    icon: <Star className="w-8 h-8" />,
    title: "VIP привилегии",
    description: "Приоритетная очередь и эксклюзивные возможности для лучшего игрового опыта",
    color: "bg-gradient-to-br from-gaming-accent/20 to-gaming-accent/5",
    iconColor: "text-gaming-accent",
  },
  {
    id: 2,
    icon: <Shield className="w-8 h-8" />,
    title: "Честная игра",
    description: "Строгая модерация и защита от читеров для справедливой конкуренции",
    color: "bg-gradient-to-br from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    id: 3,
    icon: <Zap className="w-8 h-8" />,
    title: "Высокая производительность",
    description: "Мощные серверы с низким пингом и стабильным соединением 24/7",
    color: "bg-gradient-to-br from-green-500/20 to-green-500/5",
    iconColor: "text-green-400",
  },
  {
    id: 4,
    icon: <Users className="w-8 h-8" />,
    title: "Активное сообщество",
    description: "Тысячи игроков ежедневно, турниры и события для всех участников",
    color: "bg-gradient-to-br from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-400",
  },
];

const stats = [
  { label: "Игроков онлайн", value: "292+" },
  { label: "Активных серверов", value: "4" },
  { label: "Участников сообщества", value: "15K+" },
  { label: "Матчей сыграно", value: "50K+" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Main Hero Section */}
      <div className="relative bg-gradient-to-br from-gaming-bg via-gaming-card to-gaming-bg border-b border-gaming-border">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gaming-text mb-6">
              Добро пожаловать на
              <span className="block text-gaming-accent">RSGS Servers</span>
            </h1>
            <p className="text-xl md:text-2xl text-gaming-text-muted max-w-3xl mx-auto mb-8">
              Лучшие серверы для Squad с активным русскоязычным сообществом.
              Честная игра, профессиональная модерация и незабываемые сражения.
            </p>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/vip">
                <Button
                  size="lg"
                  className="bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold px-8 py-3 text-lg"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Получить VIP
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-gaming-border text-gaming-text hover:bg-gaming-card px-8 py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Как начать играть
              </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gaming-accent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gaming-text-muted text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className={`${feature.color} border border-gaming-border/50 hover:border-gaming-accent/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm`}
              >
                <CardContent className="p-6 text-center">
                  <div className={`${feature.iconColor} mb-4 flex justify-center`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gaming-text mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gaming-text-muted text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-gaming-card border-b border-gaming-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Join Server */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gaming-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gaming-accent/30 transition-colors">
                <Play className="w-8 h-8 text-gaming-accent" />
              </div>
              <h3 className="text-xl font-bold text-gaming-text mb-2">
                Подключиться к серверу
              </h3>
              <p className="text-gaming-text-muted mb-4">
                Выберите сервер и начинайте играть прямо сейчас
              </p>
              <Link
                to="/#servers"
                className="inline-flex items-center text-gaming-accent hover:text-gaming-accent-hover font-medium"
              >
                Выбрать сервер
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Rules */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gaming-text mb-2">
                Изучить правила
              </h3>
              <p className="text-gaming-text-muted mb-4">
                Ознакомьтесь с правилами для честной игры
              </p>
              <Link
                to="/rules"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
              >
                Читать правила
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Community */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gaming-text mb-2">
                Присоединиться к Discord
              </h3>
              <p className="text-gaming-text-muted mb-4">
                Общайтесь с игроками и участвуйте в событиях
              </p>
              <a
                href="https://discord.gg/HXne8JVJ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium"
              >
                Открыть Discord
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

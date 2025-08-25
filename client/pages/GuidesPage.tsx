import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Book, Target, Users, Shield } from "lucide-react";

const guides = [
  {
    id: 1,
    title: "Основы игры в Squad",
    description: "Изучите базовые механики игры, управление и интерфейс",
    icon: <Book className="w-6 h-6" />,
    difficulty: "Новичок",
    readTime: "10 мин",
  },
  {
    id: 2,
    title: "Тактика командной игры",
    description: "Координация с командой и эффективные стратегии",
    icon: <Users className="w-6 h-6" />,
    difficulty: "Средний",
    readTime: "15 мин",
  },
  {
    id: 3,
    title: "Снайперская подготовка",
    description: "Техники прицеливания и позиционирования снайпера",
    icon: <Target className="w-6 h-6" />,
    difficulty: "Продвинутый",
    readTime: "20 мин",
  },
  {
    id: 4,
    title: "Выживание на поле боя",
    description: "Ка�� избежать смерти и эффективно использовать укрытия",
    icon: <Shield className="w-6 h-6" />,
    difficulty: "Средний",
    readTime: "12 мин",
  },
];

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Новичок":
      return "text-green-400";
    case "Средний":
      return "text-gaming-accent";
    case "Продвинутый":
      return "text-red-400";
    default:
      return "text-gaming-text-muted";
  }
}

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gaming-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gaming-text mb-6">
              Гайды и <span className="text-gaming-accent">обучение</span>
            </h1>
            <p className="text-xl text-gaming-text-muted max-w-3xl mx-auto">
              Изучите тактики и стратегии для эффективной игры на серверах RSGS.
              От основ до продвинутых тех��ик.
            </p>
          </div>
        </section>

        {/* Coming Soon Main Section */}
        <section className="py-20 bg-gaming-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gaming-text mb-6">
                <span className="text-gaming-accent">Совсем скоро</span>
              </h2>
              <p className="text-xl text-gaming-text-muted mb-8 max-w-2xl mx-auto">
                Мы активно работаем над созданием подробных обучающих материалов.
                Качественные гайды требуют времени!
              </p>
            </div>

            {/* Progress indicator */}
            <div className="mb-12">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <div className="absolute inset-0 border-4 border-gaming-border rounded-full"></div>
                <div className="absolute inset-0 border-4 border-gaming-accent rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-4 bg-gaming-accent rounded-full flex items-center justify-center">
                  <Book className="w-8 h-8 text-black" />
                </div>
              </div>
              <p className="text-gaming-accent font-semibold text-lg">
                Разработка в процессе...
              </p>
            </div>

            {/* Future content preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-gaming-card border border-gaming-border rounded-lg p-6">
                <Users className="w-8 h-8 text-gaming-accent mb-4 mx-auto" />
                <h3 className="text-lg font-bold text-gaming-text mb-2">
                  Командная тактика
                </h3>
                <p className="text-gaming-text-muted text-sm">
                  Стратегии координации отрядов и эффективной командной игры
                </p>
              </div>

              <div className="bg-gaming-card border border-gaming-border rounded-lg p-6">
                <Target className="w-8 h-8 text-gaming-accent mb-4 mx-auto" />
                <h3 className="text-lg font-bold text-gaming-text mb-2">
                  Боевые навыки
                </h3>
                <p className="text-gaming-text-muted text-sm">
                  Продвинутые техники прицеливания и позиционирования
                </p>
              </div>

              <div className="bg-gaming-card border border-gaming-border rounded-lg p-6">
                <Shield className="w-8 h-8 text-gaming-accent mb-4 mx-auto" />
                <h3 className="text-lg font-bold text-gaming-text mb-2">
                  Выживание
                </h3>
                <p className="text-gaming-text-muted text-sm">
                  Как эффективно использовать укрытия и медицинскую помощь
                </p>
              </div>

              <div className="bg-gaming-card border border-gaming-border rounded-lg p-6">
                <Book className="w-8 h-8 text-gaming-accent mb-4 mx-auto" />
                <h3 className="text-lg font-bold text-gaming-text mb-2">
                  Основы Squad
                </h3>
                <p className="text-gaming-text-muted text-sm">
                  Базовые механики игры для новичков и начинающих игроков
                </p>
              </div>
            </div>

            {/* Call to action */}
            <div className="bg-gaming-card border border-gaming-border rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gaming-text mb-4">
                Хотите получить уведомление?
              </h3>
              <p className="text-gaming-text-muted mb-6">
                Присоединяйтесь к нашему Discord, чтобы первыми узнать о выходе новых гайдов
              </p>
              <a
                href="https://discord.gg/HXne8JVJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold px-8">
                  Присоединиться к Discord
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

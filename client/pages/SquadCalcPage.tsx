import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calculator, Users, Target, Shield } from "lucide-react";

const calculators = [
  {
    id: 1,
    title: "Калькулятор урона",
    description: "Рассчитайте урон от различных видов оружия",
    icon: <Target className="w-6 h-6" />,
    color: "text-red-400",
  },
  {
    id: 2,
    title: "Размер отряда",
    description: "Оптимальный состав команды для разных режимов",
    icon: <Users className="w-6 h-6" />,
    color: "text-blue-400",
  },
  {
    id: 3,
    title: "Броня и защита",
    description: "Эффективность различных типов брони",
    icon: <Shield className="w-6 h-6" />,
    color: "text-green-400",
  },
  {
    id: 4,
    title: "Общий калькулятор",
    description: "Универсальный инструмент для различных расчетов",
    icon: <Calculator className="w-6 h-6" />,
    color: "text-gaming-accent",
  },
];

export default function SquadCalcPage() {
  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gaming-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gaming-text mb-6">
              Squad <span className="text-gaming-accent">Калькулятор</span>
            </h1>
            <p className="text-xl text-gaming-text-muted max-w-3xl mx-auto">
              Инструменты для расчетов игровых механик, урона, эффективности команды
              и других важных параметров в Squad.
            </p>
          </div>
        </section>

        {/* Calculators Grid */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {calculators.map((calc) => (
                <div
                  key={calc.id}
                  className="bg-gaming-card border border-gaming-border rounded-lg p-8 hover:bg-gaming-card-hover transition-colors"
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gaming-accent/20 rounded-full ${calc.color} mb-6`}>
                      {calc.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gaming-text mb-4">
                      {calc.title}
                    </h3>
                    <p className="text-gaming-text-muted mb-6">
                      {calc.description}
                    </p>
                    <Button
                      className="bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                      onClick={() => {
                        // Will be implemented later
                        alert("Калькулятор в разработке");
                      }}
                    >
                      Открыть калькулятор
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Development Notice */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gaming-bg border border-gaming-border rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gaming-accent mb-4">
                В разработке
              </h2>
              <p className="text-gaming-text-muted mb-6">
                Мы активно работаем над созданием точных калькуляторов для Squad.
                Все расчеты будут основаны на официальных данных игры.
              </p>
              <div className="text-left max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gaming-text mb-3">
                  Планируемые функции:
                </h3>
                <ul className="text-gaming-text-muted space-y-2">
                  <li>• Точные расчеты урона для всех видов оружия</li>
                  <li>• Калькулятор эффективности брони против различных боеприпасов</li>
                  <li>• Оптимизация состава отряда для разных карт и режимов</li>
                  <li>• Расчет времени перемещения и логистики</li>
                  <li>• Анализ эффективности различных тактик</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

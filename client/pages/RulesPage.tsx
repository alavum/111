import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertTriangle, Shield, Zap, Target, Users, MessageCircle } from "lucide-react";

const gameRules = [
  "Уважайте других игроков и используйте вежливую речь",
  "Запрещены оскорбления, токсичное поведение и провокации",
  "Обязательное использование микрофона для командиров отрядов",
  "Следуйте указаниям Squad Leader и координируйтесь с командой",
  "Запрещено намеренное убийство союзников (Team Kill)",
  "Не покидайте отряд без разрешения Squad Leader",
  "Запрещено мешать работе союзных команд",
  "Соблюдайте ролевую игру и реалистичное поведение",
  "Запрещено использование читов, ботов и сторонних программ",
  "Не блокируйте респавн точки союзников",
];

const bannedEquipment = [
  {
    category: "Взрывчатые вещества",
    icon: <Zap className="w-6 h-6" />,
    items: [
      "C4 взрывчатка - лимит 2 шт. на игрока",
      "Противотанковые мины - лимит 2 шт. на игрока", 
      "Ручные гранаты - лимит по серверу",
      "Гранатометы - только с разрешения SL",
    ],
    reason: "Для баланса игрового процесса и предотвращения спама",
    color: "text-red-400",
  },
  {
    category: "Тяжелая техника",
    icon: <Shield className="w-6 h-6" />,
    items: [
      "Основные боевые танки - только командиры отрядов",
      "БТР и БМП - требуется опыт управления",
      "Артиллерия - строго ограниченное использование",
      "Вертолеты - только сертифицированные пилоты",
    ],
    reason: "Требует координации с командованием и опыта",
    color: "text-gaming-warning",
  },
  {
    category: "Снайперское оружие",
    icon: <Target className="w-6 h-6" />,
    items: [
      "Снайперские винтовки - лимит 2 на отряд",
      "Марксманские винтовки - лимит 3 на отряд", 
      "Противоматериальные винтовки - только командиры",
      "Оптические прицелы - приоритет опытным игрокам",
    ],
    reason: "Предотвращение кэмпинга и балансировка",
    color: "text-blue-400",
  },
];

const violations = [
  {
    level: "Предупреждение",
    description: "Первое нарушение правил",
    color: "text-gaming-warning",
    examples: ["Некритичное нарушение коммуникации", "Мелкие тактические ошибки"],
  },
  {
    level: "Кик с сервера",
    description: "Повторные или серьезные нарушения",
    color: "text-orange-400", 
    examples: ["Повторное TK", "Игнорирование команд SL", "Токсичное поведение"],
  },
  {
    level: "Временный бан (1-7 дней)",
    description: "Серьезные или множественные нарушения",
    color: "text-red-400",
    examples: ["Умышленный саботаж", "Использование читов", "Серьезное токсичное поведение"],
  },
  {
    level: "Постоянный бан",
    description: "Критические нарушения",
    color: "text-red-600",
    examples: ["Постоянное использование читов", "Экстремальная токсичность", "Угрозы игрокам"],
  },
];

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gaming-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gaming-text mb-6">
              Правила <span className="text-gaming-accent">сервера</span>
            </h1>
            <p className="text-xl text-gaming-text-muted max-w-3xl mx-auto">
              Правила поведения и ограничения для честной и увлекательной игры
              на серверах RSGS. Соблюдение правил обязательно для всех игроков.
            </p>
          </div>
        </section>

        {/* General Rules */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <Users className="w-8 h-8 text-gaming-accent mr-3" />
              <h2 className="text-3xl font-bold text-gaming-text">
                Основные правила поведения
              </h2>
            </div>

            <div className="bg-gaming-card border border-gaming-border rounded-lg p-8">
              <ul className="space-y-4">
                {gameRules.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-gaming-accent/20 rounded-full flex items-center justify-center text-gaming-accent font-bold text-sm mr-4">
                      {index + 1}
                    </span>
                    <span className="text-gaming-text">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Equipment Restrictions */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <AlertTriangle className="w-8 h-8 text-red-400 mr-3" />
              <h2 className="text-3xl font-bold text-gaming-text">
                Ограничения оборудования
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {bannedEquipment.map((category, index) => (
                <div
                  key={index}
                  className="bg-gaming-bg border border-gaming-border rounded-lg p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className={`${category.color} mr-3`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gaming-text">
                      {category.category}
                    </h3>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-gaming-text flex items-start"
                      >
                        <span className="text-gaming-accent mr-2 mt-2">•</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-gaming-border pt-4">
                    <p className="text-sm text-gaming-text-muted">
                      <span className="font-semibold text-gaming-text">Причина:</span><br />
                      {category.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Violations and Punishments */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text mb-8 text-center">
              Система наказаний
            </h2>

            <div className="space-y-6">
              {violations.map((violation, index) => (
                <div
                  key={index}
                  className="bg-gaming-card border border-gaming-border rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`text-xl font-bold ${violation.color}`}>
                        {violation.level}
                      </h3>
                      <p className="text-gaming-text-muted mt-1">
                        {violation.description}
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-gaming-accent">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gaming-text mb-2">
                      Примеры нарушений:
                    </p>
                    <ul className="text-sm text-gaming-text-muted space-y-1">
                      {violation.examples.map((example, exIndex) => (
                        <li key={exIndex}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Appeal Section */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gaming-bg border border-gaming-border rounded-lg p-8">
              <MessageCircle className="w-12 h-12 text-gaming-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gaming-text mb-4">
                Обжалование на��азаний
              </h2>
              <p className="text-gaming-text-muted mb-6">
                Считаете, что получили несправедливое наказание? Вы можете подать апелляцию
                через наш Discord сервер. Предоставьте доказательства и подробное описание ситуации.
              </p>
              <a
                href="https://discord.gg/HXne8JVJ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold rounded-md transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Обжаловать в Discord
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

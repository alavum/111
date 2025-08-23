import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertTriangle, Shield, Zap, Target } from "lucide-react";

const bannedEquipment = [
  {
    category: "Взрывчатые вещества",
    icon: <Zap className="w-6 h-6" />,
    items: [
      "C4 взрывчатка (ограничено)",
      "Противотанковые мины (лимит 2 на игрока)",
      "Гранаты (лимит по серверу)",
    ],
    reason: "Для баланса игрового процесса",
    color: "text-red-400",
  },
  {
    category: "Тяжелая техника",
    icon: <Shield className="w-6 h-6" />,
    items: [
      "Танки (только для командиров отрядов)",
      "БТР (требуется разрешение)",
      "Артиллерия (ограниченное использование)",
    ],
    reason: "Требует координации с командованием",
    color: "text-gaming-warning",
  },
  {
    category: "Снайперское оружие",
    icon: <Target className="w-6 h-6" />,
    items: [
      "Снайперские винтовки (лимит 2 на отряд)",
      "Марксманские винтовки (лимит 3 на отряд)",
      "Противоматериальные винтовки (командиры только)",
    ],
    reason: "Предотвращение кэмпинга",
    color: "text-blue-400",
  },
];

const serverRules = [
  "Запрещено намеренное убийство союзников (TK)",
  "Обязательное использование микрофона для командиров отрядов",
  "Запрещено покидание отряда без разрешения Squad Leader",
  "Соблюдение ролевой игры и реалистичного поведения",
  "Запрещено использование читов и сторонних программ",
  "Уважительное отношение к другим игрокам",
];

export default function EquipmentBanPage() {
  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gaming-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gaming-text mb-6">
              Оборудование <span className="text-red-400">бан</span>
            </h1>
            <p className="text-xl text-gaming-text-muted max-w-3xl mx-auto">
              Ограничения на использование определенного оборудования и правила
              поведения на серверах RSGS для честной игры.
            </p>
          </div>
        </section>

        {/* Equipment Restrictions */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text mb-8">
              Ограничения оборудования
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {bannedEquipment.map((category, index) => (
                <div
                  key={index}
                  className="bg-gaming-card border border-gaming-border rounded-lg p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className={`${category.color} mr-3`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gaming-text">
                      {category.category}
                    </h3>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-gaming-text-muted flex items-start"
                      >
                        <span className="text-gaming-accent mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-gaming-border pt-4">
                    <p className="text-sm text-gaming-text-muted">
                      <span className="font-semibold">Причина:</span>{" "}
                      {category.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Server Rules */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text mb-8 text-center">
              Основные правила сервера
            </h2>

            <div className="bg-gaming-bg border border-gaming-border rounded-lg p-8">
              <ul className="space-y-4">
                {serverRules.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-gaming-accent/20 rounded-full flex items-center justify-center text-gaming-accent font-bold text-sm mr-4">
                      {index + 1}
                    </span>
                    <span className="text-gaming-text">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-red-400 mb-2">
                  Нарушение правил
                </h3>
                <p className="text-gaming-text-muted">
                  Нарушение правил может привести к предупреждению, временному или
                  постоянному бану. Для обжалования используйте Discord канал.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

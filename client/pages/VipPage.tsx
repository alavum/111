import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Star, Shield, Zap, Users } from "lucide-react";
import VipPaymentModal from "@/components/VipPaymentModal";

const vipFeatures = [
  {
    icon: <Star className="w-6 h-6" />,
    title: "Приоритетная очередь",
    description: "Подключайтесь к серверам без ожидания",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Защита от кика",
    description: "Защита от автоматического отключения",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Эксклюзивные функции",
    description: "Доступ к дополнительным возможностям в игре",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "VIP сообщество",
    description: "Доступ к закрытому VIP чату и каналам",
  },
];

const vipPlans = [
  {
    id: "basic",
    name: "VIP Обычный",
    description: "Индивидуальный VIP статус",
    basePrice: 150,
    popular: false,
    features: [
      "Приоритетная очередь",
      "Защита от кика",
      "VIP чат в Discord",
      "Эксклюзивная роль",
    ],
  },
  {
    id: "group",
    name: "VIP Групповой",
    description: "10 VIP слотов с возможностью расширения",
    basePrice: 500,
    popular: true,
    features: [
      "10 VIP слотов",
      "Приоритетная очередь",
      "Возможность расширения",
      "Управление группой",
    ],
  },
  {
    id: "clan",
    name: "Клановый",
    description: "30 VIP слотов с возможностью расширения",
    basePrice: 1200,
    popular: false,
    features: [
      "30 VIP слотов",
      "Приоритетная очередь",
      "Возможность расширения",
      "Управление кланом",
    ],
  },
];

const sponsorPlan = {
  id: "sponsor",
  name: "Спонсор",
  description: "от 1 500 руб.",
  features: [
    "Эксклюзивная роль @Спонсор в Discord",
    "Любая уникальная роль на ваш выбор",
    "Прямая связь с администрацией проекта",
    "Персональная поддержка",
  ],
};

export default function VipPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handleBuyVip = (plan: any) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-gaming-card via-gaming-bg to-gaming-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gaming-text mb-6">
              Станьте <span className="text-gaming-accent">VIP</span> игроком
            </h1>
            <p className="text-xl text-gaming-text-muted max-w-3xl mx-auto mb-8">
              Получите эксклюзивные преимущества и возможности для лучшего
              игрового опыта на серверах RSGS. Приоритетное подключение, защита
              от кика и многое другое.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text text-center mb-12">
              Преимущества VIP статуса
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {vipFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gaming-accent/20 rounded-full text-gaming-accent mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gaming-text mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gaming-text-muted">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VIP Plans Section */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text text-center mb-12">
              Выберите подходящий план
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {vipPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-gaming-card border-2 rounded-lg p-8 ${
                    plan.popular
                      ? "border-gaming-accent"
                      : "border-gaming-border hover:border-gaming-accent/50"
                  } transition-colors`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gaming-accent text-black px-4 py-1 rounded-full text-sm font-semibold">
                        Рекомендуемый
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gaming-text mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gaming-text-muted mb-4">
                      {plan.description}
                    </p>
                    <div className="text-lg font-bold text-gaming-accent">
                      от {plan.basePrice} ₽/месяц
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-gaming-text"
                      >
                        <Check className="w-5 h-5 text-gaming-accent mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                        : "bg-gaming-border hover:bg-gaming-accent hover:text-black text-gaming-text"
                    }`}
                    size="lg"
                    onClick={() => handleBuyVip(plan)}
                  >
                    Выбрать план
                  </Button>
                </div>
              ))}
            </div>

            {/* Sponsor Section */}
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gaming-text mb-4">
                  Для потенциальных спонсоров
                </h3>
                <p className="text-gaming-text-muted">
                  Поддержите проект RSGS и получите эксклюзивные привилегии
                </p>
              </div>

              <div className="bg-gradient-to-r from-gaming-card via-yellow-900/10 to-gaming-card border-2 border-gradient-to-r border-yellow-500/50 rounded-lg p-8 shadow-xl">
                <div className="text-center mb-8">
                  <h4 className="text-3xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-yellow-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
                      {sponsorPlan.name}
                    </span>
                  </h4>
                  <p className="text-xl text-gaming-accent font-semibold mb-4">
                    {sponsorPlan.description}
                  </p>
                  <div className="inline-block bg-gradient-to-r from-yellow-400 to-purple-500 p-3 rounded-lg">
                    <p className="text-black font-bold text-sm">
                      Роль{" "}
                      <span className="bg-gradient-to-r from-yellow-300 to-purple-300 bg-clip-text text-transparent">
                        @Спонсор
                      </span>{" "}
                      с уникальным градиентом
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {sponsorPlan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start text-gaming-text bg-gaming-bg/50 p-4 rounded-lg"
                    >
                      <Star className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gaming-text">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center space-y-6">
                  <a
                    href="https://discord.gg/HXne8JVJ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="bg-gradient-to-r from-yellow-500 to-purple-500 hover:from-yellow-600 hover:to-purple-600 text-black font-bold px-12 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      Стать спонсором
                    </Button>
                  </a>
                  <p className="text-gaming-text-muted text-sm">
                    Нажмите кнопку выше, чтобы перейти в Discord и связаться с
                    администрацией
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text text-center mb-12">
              Частые вопросы
            </h2>

            <div className="space-y-6">
              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gaming-text mb-2">
                  Как активируется VIP статус?
                </h3>
                <p className="text-gaming-text-muted">
                  VIP статус активируется автоматически после оплаты в течение
                  5-10 минут. Вы получите уведомление в Discord о активации.
                </p>
              </div>

              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gaming-text mb-2">
                  На каких серверах действует VIP?
                </h3>
                <p className="text-gaming-text-muted">
                  VIP статус действует на всех серверах RSGS: Free, #1, Invasion
                  и International.
                </p>
              </div>

              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gaming-text mb-2">
                  Можно ли вернуть деньги?
                </h3>
                <p className="text-gaming-text-muted">
                  Возврат средств возможен в течение 7 дней после покупки при
                  условии, что VIP статус не использовался.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <VipPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}

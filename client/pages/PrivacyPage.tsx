import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Eye, Database, Lock } from "lucide-react";

const dataTypes = [
  {
    icon: <Database className="w-6 h-6" />,
    title: "Игровые данные",
    items: [
      "Steam ID для идентификации игроков",
      "Игровая статистика и достижения",
      "История матчей и результаты",
      "Настройки профиля игрока",
    ],
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Данные модерации",
    items: [
      "Сообщения в игровом чате",
      "Голосовые команды и координация",
      "Отчеты о нарушениях",
      "История административных действий",
    ],
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Технические данные",
    items: [
      "IP-адрес для подключения к серверу",
      "Системная информация для оптимизации",
      "Логи подключений и отключений",
      "Данные о производительности",
    ],
  },
];

const dataUsage = [
  "Обеспечение функционирования игровых серверов",
  "Модерация и поддержание порядка в игре",
  "Улучшение игрового опыта и баланса",
  "Предотвращение читерства и нарушений",
  "Техническая поддержка игроков",
  "Анализ производительности серверов",
];

const userRights = [
  {
    title: "Право на информацию",
    description: "Вы можете запросить информацию о том, какие данные мы собираем о вас",
  },
  {
    title: "Право на исправление",
    description: "Вы можете запросить исправление неточных или неполных данных",
  },
  {
    title: "Право на удаление",
    description: "Вы можете запросить удаление ваших персональных данных",
  },
  {
    title: "Право на ограничение",
    description: "Вы можете запросить ограничение обработки ваших данных",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gaming-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gaming-accent/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-gaming-accent" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gaming-text mb-6">
              Политика <span className="text-gaming-accent">конфиденциальности</span>
            </h1>
            <p className="text-xl text-gaming-text-muted max-w-3xl mx-auto">
              Мы серьезно относимся к защите ваших персональных данных.
              Ознакомьтесь с тем, как мы собираем, используем и защищаем вашу информацию.
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gaming-card border border-gaming-border rounded-lg p-8 mb-12">
              <h2 className="text-2xl font-bold text-gaming-text mb-4">
                Введение
              </h2>
              <p className="text-gaming-text-muted mb-4">
                Данная ��олитика конфиденциальности описывает, как Russian Squad Game Servers (RSGS) 
                собирает, использует и защищает информацию, которую вы предоставляете при 
                использовании наших игровых серверов и веб-сайта.
              </p>
              <p className="text-gaming-text-muted">
                Используя наши услуги, вы соглашаетесь с условиями данной политики конфиденциальности.
                Мы рекомендуем внимательно ознакомиться с этим документом.
              </p>
            </div>
          </div>
        </section>

        {/* Data Collection */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text mb-8 text-center">
              Какие данные мы собираем
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {dataTypes.map((type, index) => (
                <div
                  key={index}
                  className="bg-gaming-bg border border-gaming-border rounded-lg p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="text-gaming-accent mr-3">
                      {type.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gaming-text">
                      {type.title}
                    </h3>
                  </div>

                  <ul className="space-y-2">
                    {type.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-gaming-text-muted flex items-start"
                      >
                        <span className="text-gaming-accent mr-2 mt-1">•</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Usage */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text mb-8 text-center">
              Как мы используем ваши данные
            </h2>

            <div className="bg-gaming-card border border-gaming-border rounded-lg p-8">
              <p className="text-gaming-text-muted mb-6">
                Собранные данные используются исключительно для следующих целей:
              </p>
              <ul className="space-y-3">
                {dataUsage.map((usage, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-gaming-accent/20 rounded-full flex items-center justify-center text-gaming-accent font-bold text-xs mr-3 mt-1">
                      {index + 1}
                    </span>
                    <span className="text-gaming-text">{usage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Data Protection */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text mb-8 text-center">
              Защита данных
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-gaming-text mb-4">
                  Технические меры
                </h3>
                <ul className="text-gaming-text-muted space-y-2">
                  <li>• Шифрование данных при передаче</li>
                  <li>• Безопасное хранение на защищенных серверах</li>
                  <li>• Регулярное обновление систем безопасности</li>
                  <li>• Мониторинг несанкционированного доступа</li>
                </ul>
              </div>

              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-gaming-text mb-4">
                  Организационные меры
                </h3>
                <ul className="text-gaming-text-muted space-y-2">
                  <li>• Ограниченный доступ к данным</li>
                  <li>• Обучение персонала по безопасности</li>
                  <li>• Политики конфиденциал��ности для сотрудников</li>
                  <li>• Регулярные аудиты безопасности</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* User Rights */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text mb-8 text-center">
              Ваши права
            </h2>

            <div className="space-y-6">
              {userRights.map((right, index) => (
                <div
                  key={index}
                  className="bg-gaming-card border border-gaming-border rounded-lg p-6"
                >
                  <h3 className="text-lg font-bold text-gaming-text mb-2">
                    {right.title}
                  </h3>
                  <p className="text-gaming-text-muted">
                    {right.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gaming-text mb-8">
              Контактная информация
            </h2>
            <div className="bg-gaming-bg border border-gaming-border rounded-lg p-8">
              <p className="text-gaming-text-muted mb-6">
                Если у вас есть вопросы о нашей политике конфиденциальности или 
                вы хотите воспользоваться своими правами, свяжитесь с нами:
              </p>
              <div className="space-y-4">
                <p className="text-gaming-text">
                  <span className="font-semibold">Email:</span> privacy@rgs-squad.ru
                </p>
                <p className="text-gaming-text">
                  <span className="font-semibold">Discord:</span> 
                  <a 
                    href="https://discord.gg/HXne8JVJ" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gaming-accent hover:text-gaming-accent-hover ml-2"
                  >
                    RSGS Community
                  </a>
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

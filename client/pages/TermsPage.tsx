import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const serviceTerms = [
  "Пользование серверами RSGS предоставляется на условиях данного соглашения",
  "Администрация оставляет за собой право изменять условия обслуживания",
  "Пользователь обязуется соблюдать правила сервера и игровой этикет",
  "Запрещается использование читов, ботов и сторонних программ",
  "Администрация не несет ответственности за потерю игрового прогресса",
  "Возмещение средств возможно только в случаях, предусмотренных законом",
];

const userObligations = [
  {
    title: "Соблюдение правил",
    description: "Пользователь обязан ��облюдать все установленные правила сервера",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    title: "Уважение к игрокам",
    description: "Поддержание дружелюбной атмосферы и взаимного уважения",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    title: "Честная игра",
    description: "Запрет на использование читов и эксплойтов",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    title: "Ответственность за аккаунт",
    description: "Пользователь несет полную ответственность за свой игровой аккаунт",
    icon: <CheckCircle className="w-5 h-5" />,
  },
];

const prohibitedActivities = [
  "Использование читов, ботов или модификаций игры",
  "Намеренное нанесение вреда союзникам (Team Kill)",
  "Оскорбления, угрозы и дискриминация других игроков",
  "Спам в чате или голосовой связи",
  "Попытки взлома или нарушения безопасности серверов",
  "Продажа или передача игровых аккаунтов третьим лицам",
  "Использование багов и эксплойтов для получения преимуществ",
];

const vipTerms = [
  "VIP статус предоставляется на определенный срок согласно тарифному плану",
  "VIP привилегии действуют только на серверах RSGS",
  "Возврат средств за VIP статус возможен в течение 7 дней при отсутствии использования",
  "Администрация может лишить VIP статуса за нарушение правил без возврата средств",
  "VIP статус не защищает от наказаний за нарушение правил сервера",
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gaming-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gaming-accent/20 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gaming-accent" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gaming-text mb-6">
              Пользовательское <span className="text-gaming-accent">соглашение</span>
            </h1>
            <p className="text-xl text-gaming-text-muted max-w-3xl mx-auto">
              Условия использования серверов RSGS и предоставляемых услуг.
              Использование наших сервисов означает согласие с данными условиями.
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gaming-card border border-gaming-border rounded-lg p-8 mb-12">
              <h2 className="text-2xl font-bold text-gaming-text mb-4">
                Общие положения
              </h2>
              <p className="text-gaming-text-muted mb-4">
                Настоящее пользовательское соглашение (далее - "Соглашение") регулирует отношения 
                между администрацией Russian Squad Game Servers (далее - "RSGS") и пользователями 
                игровых серверов и связанных сервисов.
              </p>
              <p className="text-gaming-text-muted">
                Подключаясь к серверам или используя наши услуги, вы автоматически соглашаетесь 
                со всеми условиями данного соглашения.
              </p>
            </div>
          </div>
        </section>

        {/* Service Terms */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text mb-8 text-center">
              Условия предоставления услуг
            </h2>

            <div className="bg-gaming-bg border border-gaming-border rounded-lg p-8">
              <ul className="space-y-4">
                {serviceTerms.map((term, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-gaming-accent/20 rounded-full flex items-center justify-center text-gaming-accent font-bold text-sm mr-4">
                      {index + 1}
                    </span>
                    <span className="text-gaming-text">{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* User Obligations */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text mb-8 text-center">
              Обязанности пользователей
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {userObligations.map((obligation, index) => (
                <div
                  key={index}
                  className="bg-gaming-card border border-gaming-border rounded-lg p-6"
                >
                  <div className="flex items-center mb-3">
                    <div className="text-green-400 mr-3">
                      {obligation.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gaming-text">
                      {obligation.title}
                    </h3>
                  </div>
                  <p className="text-gaming-text-muted">
                    {obligation.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prohibited Activities */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <XCircle className="w-8 h-8 text-red-400 mr-3" />
              <h2 className="text-3xl font-bold text-gaming-text">
                Запрещенные действия
              </h2>
            </div>

            <div className="bg-gaming-bg border border-red-500/30 rounded-lg p-8">
              <p className="text-gaming-text-muted mb-6">
                Следующие действия строго запрещены и могут привести к немедленному бану:
              </p>
              <ul className="space-y-3">
                {prohibitedActivities.map((activity, index) => (
                  <li key={index} className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gaming-text">{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* VIP Terms */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text mb-8 text-center">
              Условия VIP статуса
            </h2>

            <div className="bg-gaming-card border border-gaming-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 text-gaming-warning mr-3" />
                <h3 className="text-xl font-bold text-gaming-text">
                  Важная информация о VIP
                </h3>
              </div>
              <ul className="space-y-4">
                {vipTerms.map((term, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-gaming-accent/20 rounded-full flex items-center justify-center text-gaming-accent font-bold text-xs mr-3 mt-1">
                      {index + 1}
                    </span>
                    <span className="text-gaming-text">{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Liability and Responsibility */}
        <section className="py-16 bg-gaming-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gaming-text mb-8 text-center">
              Ответственность сторон
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-gaming-text mb-4">
                  Ответственность администрации
                </h3>
                <ul className="text-gaming-text-muted space-y-2 text-sm">
                  <li>• Поддержание работоспособности серверов</li>
                  <li>• Обеспечение базовой модерации</li>
                  <li>• Защита персональных данных пользователей</li>
                  <li>• Предоставление технической поддержки</li>
                </ul>
              </div>

              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-gaming-text mb-4">
                  Ответств��нность пользователя
                </h3>
                <ul className="text-gaming-text-muted space-y-2 text-sm">
                  <li>• Соблюдение всех правил сервера</li>
                  <li>• Безопасность своего аккаунта</li>
                  <li>• Действия, совершенные с аккаунта</li>
                  <li>• Уважение к другим участникам</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final Provisions */}
        <section className="py-16 bg-gaming-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gaming-text mb-8">
              Заключительные положения
            </h2>
            <div className="bg-gaming-card border border-gaming-border rounded-lg p-8">
              <p className="text-gaming-text-muted mb-6">
                Данное соглашение может быть изменено администрацией в одностороннем порядке. 
                Уведомление об изменениях публикуется на сайте и в Discord сервере.
              </p>
              <p className="text-gaming-text-muted mb-6">
                Продолжение использования сервисов после внесения изменений означает 
                согласие с новыми условиями.
              </p>
              <div className="text-sm text-gaming-text-muted">
                <p>Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
                <p className="mt-2">
                  По вопросам соглашения обращайтесь: 
                  <a 
                    href="https://discord.gg/HXne8JVJ" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gaming-accent hover:text-gaming-accent-hover ml-1"
                  >
                    Discord
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

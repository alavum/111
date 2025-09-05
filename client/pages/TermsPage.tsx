import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";
import { renderRichText } from "@/lib/markdown";

export default function TermsPage() {
  const [terms, setTerms] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const { safeFetchJSON } = await import("@/lib/api");
      const data = await safeFetchJSON("/api/terms", {}, 7000);
      if (data) setTerms(data);
      else
        setTerms({
          content: getDefaultTerms(),
          lastUpdated: new Date().toISOString(),
        });
    } catch (error) {
      console.error("Error fetching terms:", error);
      setTerms({
        content: getDefaultTerms(),
        lastUpdated: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTerms = () => {
    return `# Пользовательское соглашение (Оферта)

## Общие полож��ния

Настоящее пользовательское соглашение (далее - "Соглашение") регулирует отношения между администрацией Russian Squad Game Servers (далее - "RSGS") и пользователями игровых серверов и связанных сервисов.

Подключаясь к серверам или используя наши услуги, вы автоматически соглашаетесь со всеми условиями данного соглашения.

## Условия предоставления услуг

1. Пользование серверами RSGS предоставляется на условиях данного соглашения
2. Администрация оставляет за собой право изменять условия обслуживания
3. Пользователь обязуется соблюдать правила сервера и игровой этикет
4. Запрещается использование читов, ботов и сторонних программ
5. Администрация не несет ответственности з�� потерю игрового прогресса
6. Возмещение средств возможно только в случаях, предусмотренных законом

## Обязанности пользователей

**Соблюдение правил** - Пользователь обязан соблюдать все установленные правила сервера

**Уважение к игрокам** - Поддержание дружелюбной атмосферы и взаимного уважения

**Честная игра** - Запрет на использование читов и эксплойтов

**Ответственность за аккаунт** - Пользователь несет полную ответственность за свой игровой аккаунт

## Запрещенные действия

- Использование читов, ботов или модификаций игры
- Намеренное нанесение вреда союзникам (Team Kill)
- Оскорбления, угрозы и дискриминация других игроков
- Спам в чате или голосовой свя��и
- Попытки взлома или нарушения безопасности серверов
- Прод��жа или передача игровых аккаунтов третьим лицам
- Использование багов и эксплойтов для получения преимуществ

## Условия VIP статуса

**Предоставление VIP** - VIP статус предоставляется на определенный срок согласно тарифному плану

**Область действия** - VIP привилегии действуют только на серверах RSGS

**Возврат средств** - Возврат средств за VIP статус возможен в течение 7 дней при отсутствии использования

**Лишение статуса** - Администрация может лишить VIP статуса за нарушение правил без возврата средств

**Отсутствие иммунитета** - VIP статус не защищает от наказаний за нарушение правил сервера

## Ответственность сторон

### Ответственность администрации
- Поддержани�� работоспособности серверов
- Обеспечение базовой модерации
- Защита персональных данных пользователей
- Предоставление технической поддержки

### Ответственность пользователя
- Соблюдение всех правил сервера
- Безопасность своего аккаунта
- Действия, совершенные с аккаунта
- Уважение к другим участникам

## Заключительные положения

Данное соглашение может быть изменено администрацией в одностороннем порядке. Уведомление об изменениях публикуется на сайте и в Discord сервере.

Продолжение использования сервисов после внесения изменений означает согласие с новыми условиями.

По вопросам соглашения обращайтесь: [Discord](https://discord.gg/HXne8JVJ)

Последнее обновление: ${new Date().toLocaleDateString("ru-RU")}`;
  };

  const formatText = (text: string) => {
    return renderRichText(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-gaming-text">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gaming-accent/20 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gaming-accent" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gaming-text mb-4">
              Пользовательское соглашение
            </h1>
            <p className="text-xl text-gaming-text-muted">
              Условия использования серверов и услуг RSGS
            </p>
          </div>

          {/* Content */}
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-8">
            <div className="flex justify-end text-gaming-text-muted text-sm mb-2">
              Последнее обновление:{" "}
              {terms?.lastUpdated
                ? new Date(terms.lastUpdated).toLocaleDateString("ru-RU")
                : "—"}
            </div>
            <div className="prose prose-lg prose-invert max-w-none">
              {formatText(terms?.content || "")}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

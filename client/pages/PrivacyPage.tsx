import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";
import { renderRichText } from '@/lib/markdown';

export default function PrivacyPage() {
  const [privacy, setPrivacy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrivacy();
  }, []);

  const fetchPrivacy = async () => {
    try {
      const { safeFetchJSON } = await import('@/lib/api');
      const data = await safeFetchJSON('/api/privacy', {}, 7000);
      if (data) {
        setPrivacy(data);
      } else {
        console.warn('Privacy fetch returned no data, using default');
        setPrivacy({ content: getDefaultPrivacy(), lastUpdated: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
      setPrivacy({ content: getDefaultPrivacy(), lastUpdated: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  const getDefaultPrivacy = () => {
    return `# Политика конфиденциальности RSGS

## Введение

Данн��я Политика конфиденциальности описывает, как Russian Squad Game Servers (RSGS) собирает, использует и защищает информацию, которую вы предоставляете при использовании наших игровых серверов и веб-сайта.

Используя наши услуги, вы соглашаетесь с условиями данной политики конфиденциальности.

## Какие данные мы собир��ем

### Игровые данные
- Steam ID для идентификации игроков
- Игровая статистика и достижени��
- История матчей и результаты
- Настройки профиля игрока

### Данные модерации
- Сообщения в игровом чате
- Голосовые команды и координация
- Отчеты о нарушениях
- История административных действий

### Технические данные
- IP-адрес для подключения к серверу
- Системная информация для оптимизации
- Логи подключений и отключений
- Дан��ые о производительности

## Как мы используем ваши данные

Собранные данные используются исключительно для сл��дующих целей:

1. Обеспечение функционирования игровых серверов
2. Модерация и поддержание порядка в игре
3. Улучшение игрового опыта и баланса
4. Предотвращение читерства и нарушений
5. Техническая поддержка игроков
6. Анализ производительности серверов

## Защита данных

### Технические меры
- Шифрование данных при передаче
- Безопасное хранение на защищенных серверах
- Регулярное обновление систем безопасности
- Мониторинг несанкционированного доступа

### Организационные меры
- Ограниченный доступ к данным
- Обучение персонала по безопасности
- Политики конфиденциальности для сотрудников
- Регулярные аудиты безопасности

## Ваши права

**Право на информацию** - Вы можете запросить информацию о том, какие данные мы собираем о вас

**Право на исправление** - Вы можете запросить исправление неточных или неполных данных

**Право на удаление** - Вы можете запросить удаление ваших персональных данных

**Право на ограничение** - Вы можете запросить ограничение обработки ваших данных

## Контактная информация

Если у вас есть вопросы о нашей политике конфиденциальности или вы хотите воспользоваться своими правами, свяжитесь с нами:

**Email:** privacy@rgs-squad.ru
**Discord:** [RSGS Community](https://discord.gg/HXne8JVJ)

## Изменения в политике

Мы можем обновлять данную политику конфиденциальности по мере необходимости. Все изменения будут опубликованы на этой страни��е.

Последнее обновление: ${new Date().toLocaleDateString('ru-RU')}`;
  };

  // renderRichText handles headings, lists, inline bold/italic, links and simple tables
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
                <Shield className="w-8 h-8 text-gaming-accent" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gaming-text mb-4">
              Политика конфиденциальности
            </h1>
            <p className="text-xl text-gaming-text-muted">
              Как мы собираем, используем и защищаем ваши данные
            </p>
          </div>

          {/* Content */}
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-8">
            <div className="flex justify-end text-gaming-text-muted text-sm mb-2">Последнее обновление: {privacy?.lastUpdated ? new Date(privacy.lastUpdated).toLocaleDateString('ru-RU') : '—'}</div>
            <div className="prose prose-lg prose-invert max-w-none">
              {formatText(privacy?.content || '')}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

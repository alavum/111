import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  slug: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Пожнем Горжанка. Поздравляем с Днём Победы!",
    excerpt:
      "Торжественное мероприятие в честь 79-й годовщины Победы в Великой Отечественной войне.",
    date: "09.05.2024 03:00",
    image: "/api/placeholder/400/250",
    category: "События",
    slug: "victory-day-celebration",
  },
  {
    id: 2,
    title: "Знакомь на играх с RSGS и KupiKod",
    excerpt:
      "Специальная акция с промокодами и скидками для новых игроков нашего сообщества.",
    date: "07.05.2024 14:30",
    image: "/api/placeholder/400/250",
    category: "Акции",
    slug: "rsgs-kupikod-promo",
  },
  {
    id: 3,
    title: "Битва CMD — каждому летчику на ��олок сообществе RSGS!",
    excerpt:
      "Новый турнир для пилотов с ценными призами и эксклюзивными наградами.",
    date: "05.05.2024 16:45",
    image: "/api/placeholder/400/250",
    category: "Турниры",
    slug: "cmd-pilots-tournament",
  },
  {
    id: 4,
    title: "Обновление Squad v8.2",
    excerpt:
      "Крупное обновление игры Squad с новыми картами, оружием и улучшениями геймплея.",
    date: "03.05.2024 12:00",
    image: "/api/placeholder/400/250",
    category: "Обновления",
    slug: "squad-v82-update",
  },
  {
    id: 5,
    title: "Обновление Squad v8.1",
    excerpt:
      "Исправления багов и оптимизация производительности в последней версии игры.",
    date: "01.05.2024 10:15",
    image: "/api/placeholder/400/250",
    category: "Обновления",
    slug: "squad-v81-update",
  },
  {
    id: 6,
    title: "Обновление Squad v8.0",
    excerpt:
      "Мажорное обновление с революционными изменениями в механике игры и но��ыми возможностями.",
    date: "28.04.2024 18:30",
    image: "/api/placeholder/400/250",
    category: "Обновления",
    slug: "squad-v80-update",
  },
];

function getCategoryColor(category: string) {
  switch (category) {
    case "События":
      return "text-green-400";
    case "Акции":
      return "text-gaming-accent";
    case "Турниры":
      return "text-purple-400";
    case "Обновления":
      return "text-blue-400";
    default:
      return "text-gaming-text-muted";
  }
}

export default function News() {
  return (
    <section className="py-12 bg-gaming-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gaming-text">
            Новости
          </h2>
          <Link to="/news">
            <Button
              variant="outline"
              className="border-gaming-border text-gaming-text hover:bg-gaming-card hover:text-gaming-accent"
            >
              Все новости
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="bg-gaming-card border border-gaming-border rounded-lg overflow-hidden hover:bg-gaming-card-hover transition-colors group"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-md bg-black/50 ${getCategoryColor(item.category)}`}
                  >
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center text-gaming-text-muted text-sm mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  {item.date}
                </div>

                <h3 className="font-bold text-gaming-text mb-3 line-clamp-2 group-hover:text-gaming-accent transition-colors">
                  <Link to={`/news/${item.id}`}>{item.title}</Link>
                </h3>

                <p className="text-gaming-text-muted text-sm line-clamp-3 mb-4">
                  {item.excerpt}
                </p>

                <Link
                  to={`/news/${item.id}`}
                  className="inline-flex items-center text-gaming-accent hover:text-gaming-accent-hover font-medium text-sm transition-colors"
                >
                  Читать далее
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-8">
            <h3 className="text-xl font-bold text-gaming-text mb-4">
              Не пропускайте важные новости!
            </h3>
            <p className="text-gaming-text-muted mb-6">
              Подпишитесь на наши уведомления, чтобы первыми узнавать о новых
              обновлениях, турнирах и событиях в сообществе RSGS.
            </p>
            <Button
              className="bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold"
              onClick={() => toast({
                title: "В разработке",
                description: "Функция подписки на новости скоро будет доступна",
                duration: 3000,
              })}
            >
              Подписаться на новости
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

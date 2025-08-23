import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  slug: string;
  featured?: boolean;
}

const allNewsItems: NewsItem[] = [
  {
    id: 1,
    title: "Пожнем Горжанка. Поздравляем с Днём Победы!",
    excerpt:
      "Торжественное мероприятие в честь 79-й годовщины П��беды в Великой Отечественной войне.",
    date: "09.05.2024 03:00",
    image: "/api/placeholder/600/350",
    category: "События",
    slug: "victory-day-celebration",
    featured: true,
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
    featured: true,
  },
  {
    id: 3,
    title: "Битва CMD — каждому летчику на полок сообществе RSGS!",
    excerpt:
      "Новый турнир для пилотов с ценными призами и эксклюзивными наградами.",
    date: "05.05.2024 16:45",
    image: "/api/placeholder/400/250",
    category: "Турниры",
    slug: "cmd-pilots-tournament",
    featured: true,
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
    featured: true,
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
      "Мажорное обновление с революционными изменениями в механике игры и новыми возможностями.",
    date: "28.04.2024 18:30",
    image: "/api/placeholder/400/250",
    category: "Обновления",
    slug: "squad-v80-update",
  },
];

function getCategoryColor(category: string) {
  switch (category) {
    case "События":
      return "text-green-400 bg-green-400/10";
    case "Акции":
      return "text-gaming-accent bg-gaming-accent/10";
    case "Турниры":
      return "text-purple-400 bg-purple-400/10";
    case "Обновления":
      return "text-blue-400 bg-blue-400/10";
    default:
      return "text-gaming-text-muted bg-gaming-text-muted/10";
  }
}

export default function NewsPage() {
  const featuredNews = allNewsItems.filter((item) => item.featured);
  const regularNews = allNewsItems.filter((item) => !item.featured);

  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main>
        {/* Page Header */}
        <section className="bg-gaming-card border-b border-gaming-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gaming-text mb-2">
                  Новости
                </h1>
                <p className="text-gaming-text-muted">
                  Последние новости и обновления от сообщества RSGS
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Поиск новостей..."
                    className="pl-4 pr-10 w-64 bg-gaming-bg border-gaming-border text-gaming-text"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gaming-border text-gaming-text hover:bg-gaming-bg"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Фильтр
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured News Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
              {featuredNews.map((item, index) => (
                <article
                  key={item.id}
                  className={`${
                    index === 0 ? "md:col-span-2" : ""
                  } bg-gaming-card border border-gaming-border rounded-lg overflow-hidden hover:bg-gaming-card-hover transition-colors group`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        index === 0 ? "h-64 md:h-80" : "h-48"
                      }`}
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className={`p-6 ${index === 0 ? "md:p-8" : ""}`}>
                    <div className="flex items-center text-gaming-text-muted text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {item.date}
                    </div>

                    <h2
                      className={`font-bold text-gaming-text mb-3 group-hover:text-gaming-accent transition-colors ${
                        index === 0 ? "text-xl md:text-2xl" : "text-lg"
                      }`}
                    >
                      <Link to={`/news/${item.slug}`}>{item.title}</Link>
                    </h2>

                    <p className="text-gaming-text-muted mb-4 line-clamp-3">
                      {item.excerpt}
                    </p>

                    <Link
                      to={`/news/${item.slug}`}
                      className="inline-flex items-center text-gaming-accent hover:text-gaming-accent-hover font-medium transition-colors"
                    >
                      Читать далее
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Regular News */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNews.map((item) => (
                <article
                  key={item.id}
                  className="bg-gaming-card border border-gaming-border rounded-lg overflow-hidden hover:bg-gaming-card-hover transition-colors group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-md ${getCategoryColor(item.category)}`}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-gaming-text-muted text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {item.date}
                    </div>

                    <h3 className="font-bold text-gaming-text mb-3 line-clamp-2 group-hover:text-gaming-accent transition-colors">
                      <Link to={`/news/${item.slug}`}>{item.title}</Link>
                    </h3>

                    <p className="text-gaming-text-muted text-sm line-clamp-3 mb-4">
                      {item.excerpt}
                    </p>

                    <Link
                      to={`/news/${item.slug}`}
                      className="inline-flex items-center text-gaming-accent hover:text-gaming-accent-hover font-medium text-sm transition-colors"
                    >
                      Читать далее
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="border-gaming-border text-gaming-text hover:bg-gaming-card hover:text-gaming-accent"
              >
                Загрузить больше новостей
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

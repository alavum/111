import { useState, useEffect } from "react";
import { Calendar, ArrowRight, Youtube, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  image?: string;
  author?: string;
  published?: boolean;
}

// Fallback news if API fails
const fallbackNewsItems: NewsItem[] = [
  {
    id: 1,
    title: "Новости загружаются...",
    content: "Пожалуйста, подождите, пока мы загружаем последние новости.",
    date: new Date().toISOString(),
    author: "System",
    published: true,
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

// Helper function to get category from content
function getCategory(content: string): string {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes("турнир") || lowerContent.includes("соревнование"))
    return "Турниры";
  if (lowerContent.includes("обновление") || lowerContent.includes("update"))
    return "Обновления";
  if (lowerContent.includes("акция") || lowerContent.includes("скидка"))
    return "Акции";
  if (lowerContent.includes("событие") || lowerContent.includes("поздрав"))
    return "События";
  return "Новости";
}

export default function News() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log("Fetching news from API...");
        const response = await fetch("/api/news");
        if (response.ok) {
          const apiNews = await response.json();
          console.log("Received news data:", apiNews);

          // Filter only published news, sort by date (newest first), and limit to 6 items
          const publishedNews = apiNews
            .filter((news: NewsItem) => news.published !== false)
            .sort(
              (a: NewsItem, b: NewsItem) =>
                new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .slice(0, 3);

          console.log("Filtered published news:", publishedNews);

          if (publishedNews.length > 0) {
            setNewsItems(publishedNews);
            console.log("Set news items to:", publishedNews);
          } else {
            console.log("No published news found, using fallback");
            setNewsItems([]);
          }
        } else {
          console.error("Failed to fetch news:", response.status);
          setNewsItems([]);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setNewsItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gaming-card border border-gaming-border rounded-lg overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gaming-bg"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gaming-bg rounded w-3/4"></div>
                  <div className="h-4 bg-gaming-bg rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gaming-bg rounded"></div>
                    <div className="h-3 bg-gaming-bg rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : newsItems.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gaming-card border border-gaming-border rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold text-gaming-text mb-2">
                Новостей пока нет
              </h3>
              <p className="text-gaming-text-muted">
                Загляните позже — мы обязательно поделимся обновлениями.
              </p>
            </div>
          ) : (
            newsItems.map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="bg-gaming-card border border-gaming-border rounded-lg overflow-hidden hover:bg-gaming-card-hover transition-colors group block"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.image || "/api/placeholder/400/250"}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 group-hover:grayscale transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-md bg-black/50 ${getCategoryColor(getCategory(item.content))}`}
                    >
                      {getCategory(item.content)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-gaming-text-muted text-sm mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(item.date).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <h3 className="font-bold text-gaming-text mb-3 line-clamp-2 group-hover:text-gaming-accent transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gaming-text-muted text-sm line-clamp-3 mb-4">
                    {item.content.substring(0, 150)}
                    {item.content.length > 150 ? "..." : ""}
                  </p>

                  <span className="inline-flex items-center text-gaming-accent font-medium text-sm transition-colors">
                    Читать далее
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-8">
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-3 w-full flex flex-col sm:flex-row items-center sm:items-stretch gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0 sm:max-w-3xl">
              <div className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gaming-accent/20 text-gaming-accent">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <h4 className="text-base font-semibold text-gaming-text">Следите за обновлениями RUBEZH</h4>
                <p className="text-gaming-text-muted text-sm">Подписывайтесь на наши каналы — важные объявления, турниры и акции появляются там первыми.</p>
              </div>
            </div>

            <div className="flex-shrink-0 self-center sm:self-auto">
              <div className="flex items-center gap-2">
                <a href="https://discord.gg/HXne8JVJ" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold py-2 px-6 min-w-[110px]">Discord</Button>
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 min-w-[110px] flex items-center justify-center gap-2"><Youtube className="w-4 h-4"/>YouTube</Button>
                </a>
                <a href="https://www.twitch.tv" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#6441a5] hover:bg-[#57328f] text-white font-semibold py-2 px-6 min-w-[110px] flex items-center justify-center gap-2"><Tv className="w-4 h-4"/>Twitch</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

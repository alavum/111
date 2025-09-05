import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, ArrowRight, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  category: string;
  slug: string;
  featured?: boolean;
  author?: string;
  published?: boolean;
}

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
    case "Правила":
      return "text-red-400 bg-red-400/10";
    default:
      return "text-gaming-text-muted bg-gaming-text-muted/10";
  }
}

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allNewsItems, setAllNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        if (response.ok) {
          const apiNews = await response.json();

          // Transform API data to match expected format
          const transformedNews = apiNews
            .map((item: any) => ({
              ...item,
              excerpt:
                item.excerpt || item.content?.substring(0, 150) + "..." || "",
              image: item.image || "/api/placeholder/600/350",
              slug: item.slug || item.id.toString(),
              category: item.category || "Общее",
              featured: item.id <= 4,
            }))
            .sort(
              (a: any, b: any) =>
                new Date(b.date).getTime() - new Date(a.date).getTime(),
            );

          setAllNewsItems(transformedNews);
        } else {
          console.error("Failed to fetch news");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Get unique categories
  const categories = [
    "Все",
    ...Array.from(new Set(allNewsItems.map((item) => item.category))),
  ];

  // Filter news based on search and category
  const filteredNews = allNewsItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "Все" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort filtered news by date (newest first)
  filteredNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const featuredNews: NewsItem[] = [];
  const regularNews = filteredNews;

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <Header />
        <main>
          <section className="bg-gaming-card border-b border-gaming-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gaming-text mb-2">
                Новости
              </h1>
              <p className="text-gaming-text-muted">Загрузка новостей...</p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-4 pr-10 w-64 bg-gaming-bg border-gaming-border text-gaming-text"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gaming-text-muted hover:text-gaming-text"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`border-gaming-border text-gaming-text hover:bg-transparent hover:text-inherit ${
                        selectedCategory !== "Все"
                          ? "bg-gaming-accent text-black"
                          : ""
                      }`}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {selectedCategory !== "Все" ? selectedCategory : "Фильтр"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 bg-gaming-card border-gaming-border p-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gaming-text">
                        Категория
                      </h4>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="bg-gaming-bg border-gaming-border text-gaming-text">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gaming-card border-gaming-border">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {(selectedCategory !== "Все" || searchQuery) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory("Все");
                            setSearchQuery("");
                            setIsFilterOpen(false);
                          }}
                          className="w-full border-gaming-border text-gaming-text hover:bg-gaming-bg"
                        >
                          Сбросить фильтры
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </section>

        {/* Featured News Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search/Filter Results Info */}
            {(searchQuery || selectedCategory !== "Все") && (
              <div className="mb-6 p-4 bg-gaming-card border border-gaming-border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gaming-text text-sm">
                      Найдено новостей:{" "}
                      <span className="font-semibold text-gaming-accent">
                        {filteredNews.length}
                      </span>
                    </p>
                    {searchQuery && (
                      <p className="text-gaming-text-muted text-xs">
                        Поиск: "{searchQuery}"
                      </p>
                    )}
                    {selectedCategory !== "Все" && (
                      <p className="text-gaming-text-muted text-xs">
                        Категория: {selectedCategory}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("Все");
                    }}
                    className="border-gaming-border text-gaming-text hover:bg-gaming-bg"
                  >
                    Сбросить
                  </Button>
                </div>
              </div>
            )}

            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gaming-text mb-2">
                  Новости не найдены
                </h3>
                <p className="text-gaming-text-muted mb-4">
                  Попробуйте изменить параметры поиска или сбросить фильтры
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Все");
                  }}
                  className="bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                >
                  Показать все новости
                </Button>
              </div>
            ) : (
              <>
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
                          {new Date(item.date).toLocaleDateString("ru-RU")}
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
                          {new Date(item.date).toLocaleDateString("ru-RU")}
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
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

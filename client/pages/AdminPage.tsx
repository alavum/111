import { useState, useEffect } from "react";
import AdminAuth from "@/components/AdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  FileText,
  Users,
  Shield,
  Eye,
  Edit,
  Save,
  Plus,
  Trash2,
  Server,
} from "lucide-react";
import AdminRichEditor from "@/components/AdminRichEditor";
import { toast } from "@/hooks/use-toast";

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  published: boolean;
  excerpt?: string;
  category?: string;
  image?: string;
  slug?: string;
}

interface ContentItem {
  id: number;
  title: string;
  content: string;
  lastUpdated: string;
}

function PublishedSwitch({
  editingNews,
  setEditingNews,
}: {
  editingNews: any;
  setEditingNews: any;
}) {
  return (
    <Switch
      checked={!!editingNews.published}
      onCheckedChange={(checked) =>
        setEditingNews({ ...editingNews, published: checked })
      }
    />
  );
}

export default function AdminPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [rules, setRules] = useState<ContentItem | null>(null);
  const [privacy, setPrivacy] = useState<ContentItem | null>(null);
  const [terms, setTerms] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [newNews, setNewNews] = useState({
    title: "",
    content: "",
    author: "Admin",
    excerpt: "",
    category: "Общее",
    image: null as File | null,
  });

  const compressImage = (file: File): Promise<File> => {
    const MAX_BYTES = 2 * 1024 * 1024; // 2MB target
    const steps = [
      { maxWidth: 1400, quality: 0.8 },
      { maxWidth: 1200, quality: 0.7 },
      { maxWidth: 1000, quality: 0.65 },
      { maxWidth: 900, quality: 0.6 },
      { maxWidth: 780, quality: 0.55 },
    ];
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          let bestBlob: Blob | null = null;
          let bestType = "image/jpeg";
          for (const s of steps) {
            const scale = Math.min(1, s.maxWidth / img.width);
            const width = Math.max(1, Math.round(img.width * scale));
            const height = Math.max(1, Math.round(img.height * scale));
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas not supported");
            ctx.drawImage(img, 0, 0, width, height);
            const jpeg: Blob | null = await new Promise((res) =>
              canvas.toBlob(res, "image/jpeg", s.quality),
            );
            const webp: Blob | null = await new Promise((res) =>
              canvas.toBlob(res, "image/webp", s.quality),
            );
            const candidate =
              webp && (!jpeg || webp.size < jpeg.size)
                ? { blob: webp, type: "image/webp" }
                : { blob: jpeg, type: "image/jpeg" };
            if (candidate.blob) {
              if (!bestBlob || candidate.blob.size < bestBlob.size) {
                bestBlob = candidate.blob;
                bestType = candidate.type;
              }
              if (candidate.blob.size <= MAX_BYTES) {
                return resolve(
                  new File(
                    [candidate.blob],
                    file.name.replace(
                      /\.[^.]+$/,
                      bestType === "image/webp" ? ".webp" : ".jpg",
                    ),
                    { type: bestType },
                  ),
                );
              }
            }
          }
          if (bestBlob) {
            return resolve(
              new File(
                [bestBlob],
                file.name.replace(
                  /\.[^.]+$/,
                  bestType === "image/webp" ? ".webp" : ".jpg",
                ),
                { type: bestType },
              ),
            );
          }
          reject(new Error("Compression failed"));
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_auth");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch all content
      const [newsRes, rulesRes, privacyRes, termsRes] = await Promise.all([
        fetch("/api/admin/news", { headers: getAuthHeaders() }),
        fetch("/api/rules"),
        fetch("/api/privacy"),
        fetch("/api/terms"),
      ]);

      if (newsRes.ok) setNews(await newsRes.json());
      if (rulesRes.ok) setRules(await rulesRes.json());
      if (privacyRes.ok) setPrivacy(await privacyRes.json());
      if (termsRes.ok) setTerms(await termsRes.json());
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить данные",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // News management
  const handleCreateNews = async () => {
    if (!newNews.title || !newNews.content) {
      toast({
        title: "Заполните все поля",
        description: "Заголовок и содержимое обязательны",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", newNews.title);
      formData.append("content", newNews.content);
      formData.append("author", newNews.author);
      formData.append("excerpt", newNews.excerpt);
      formData.append("category", newNews.category);

      if (newNews.image) {
        formData.append("image", newNews.image);
      }

      const token = localStorage.getItem("admin_auth");
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (response.ok) {
        const article = await response.json();
        setNews((prev) => [article, ...prev]);
        setNewNews({
          title: "",
          content: "",
          author: "Admin",
          excerpt: "",
          category: "Общее",
          image: null,
        });
        toast({
          title: "Новость создана",
          description: "Новость успешно добавлена",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка ��оздания",
        description: "Не удалось создать новость",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNews = async (
    article: NewsArticle & { newImage?: File },
  ) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", article.title);
      formData.append("content", article.content);
      formData.append("published", article.published.toString());
      formData.append("excerpt", article.excerpt || "");
      formData.append("category", article.category || "Общее");

      if (article.newImage) {
        formData.append("image", article.newImage);
      }

      const token = localStorage.getItem("admin_auth");
      const response = await fetch(`/api/news/${article.id}`, {
        method: "PUT",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (response.ok) {
        const updated = await response.json();
        setNews((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        setEditingNews(null);
        toast({
          title: "Новость обновлена",
          description: "Изменения сохранены",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка обновления",
        description: "Не удалось об��овить новость",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm("Удалить эту новость?")) return;

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setNews((prev) => prev.filter((n) => n.id !== id));
        toast({
          title: "Новость удалена",
          description: "Новость успешно удалена",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить новость",
        variant: "destructive",
      });
    }
  };

  // Content management
  const handleUpdateContent = async (
    type: "rules" | "privacy" | "terms",
    content: ContentItem,
  ) => {
    try {
      const response = await fetch(`/api/${type}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(content),
      });

      if (response.ok) {
        const updated = await response.json();

        if (type === "rules") setRules(updated);
        else if (type === "privacy") setPrivacy(updated);
        else if (type === "terms") setTerms(updated);

        toast({
          title: "Контент обновлен",
          description: `${type === "rules" ? "Правила" : type === "privacy" ? "Политика" : "Условия"} успешно обновлены`,
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка обновления",
        description: "Не удалось обновить контент",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AdminAuth>
        <div className="flex items-center justify-center h-96">
          <div className="text-gaming-text">Загрузка...</div>
        </div>
      </AdminAuth>
    );
  }

  return (
    <AdminAuth>
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Settings className="w-8 h-8 text-gaming-accent mr-3" />
            <h1 className="text-3xl font-bold text-gaming-text">
              Панель администратора
            </h1>
          </div>

          <Tabs defaultValue="news" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-md bg-gaming-card border-gaming-border">
              <TabsTrigger
                value="news"
                className="data-[state=active]:bg-gaming-accent data-[state=active]:text-black"
              >
                Новости
              </TabsTrigger>
              <TabsTrigger
                value="rules"
                className="data-[state=active]:bg-gaming-accent data-[state=active]:text-black"
              >
                Правила
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="data-[state=active]:bg-gaming-accent data-[state=active]:text-black"
              >
                Политика
              </TabsTrigger>
              <TabsTrigger
                value="terms"
                className="data-[state=active]:bg-gaming-accent data-[state=active]:text-black"
              >
                Условия
              </TabsTrigger>
            </TabsList>

            {/* News Management */}
            <TabsContent value="news" className="space-y-6">
              {/* Create News */}
              <Card className="bg-gaming-card border-gaming-border">
                <CardHeader>
                  <CardTitle className="text-gaming-text flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Создать новость
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="newsTitle" className="text-gaming-text">
                      Заголовок
                    </Label>
                    <Input
                      id="newsTitle"
                      value={newNews.title}
                      onChange={(e) =>
                        setNewNews((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="bg-gaming-bg border-gaming-border text-gaming-text"
                      placeholder="Введите заголовок новости"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsContent" className="text-gaming-text">
                      Содержимое
                    </Label>
                    <AdminRichEditor
                      id="newsContent"
                      value={newNews.content}
                      onChange={(val) =>
                        setNewNews((prev) => ({ ...prev, content: val }))
                      }
                      className="min-h-[120px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsExcerpt" className="text-gaming-text">
                      Краткое описание
                    </Label>
                    <Input
                      id="newsExcerpt"
                      value={newNews.excerpt}
                      onChange={(e) =>
                        setNewNews((prev) => ({
                          ...prev,
                          excerpt: e.target.value,
                        }))
                      }
                      className="bg-gaming-bg border-gaming-border text-gaming-text"
                      placeholder="Краткое описание новости"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsCategory" className="text-gaming-text">
                      Категория
                    </Label>
                    <Input
                      id="newsCategory"
                      value={newNews.category}
                      onChange={(e) =>
                        setNewNews((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="bg-gaming-bg border-gaming-border text-gaming-text"
                      placeholder="Категория новости"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsImage" className="text-gaming-text">
                      Изображение
                    </Label>
                    <Input
                      id="newsImage"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] || null;
                        if (!file) {
                          setNewNews((prev) => ({ ...prev, image: null }));
                          return;
                        }
                        try {
                          const compressed = await compressImage(file);
                          if (compressed.size > 9 * 1024 * 1024) {
                            toast({
                              title: "Файл слишком большой",
                              description: "Сократите изображение до < 9MB",
                              variant: "destructive",
                            });
                            return;
                          }
                          setNewNews((prev) => ({
                            ...prev,
                            image: compressed,
                          }));
                        } catch (err) {
                          setNewNews((prev) => ({ ...prev, image: file }));
                        }
                      }}
                      className="bg-gaming-bg border-gaming-border text-gaming-text"
                    />
                    {newNews.image && (
                      <p className="text-green-400 text-sm mt-1">
                        ✓ Файл выбран: {newNews.image.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="newsAuthor" className="text-gaming-text">
                      Автор
                    </Label>
                    <Input
                      id="newsAuthor"
                      value={newNews.author}
                      onChange={(e) =>
                        setNewNews((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      className="bg-gaming-bg border-gaming-border text-gaming-text"
                    />
                  </div>
                  <Button
                    onClick={handleCreateNews}
                    className="bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Создать новость
                  </Button>
                </CardContent>
              </Card>

              {/* News List */}
              <div className="space-y-4">
                {news.map((article) => (
                  <Card
                    key={article.id}
                    className="bg-gaming-card border-gaming-border"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-gaming-text">
                          {article.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              article.published
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {article.published ? "Опубликовано" : "Черновик"}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNews(article)}
                            className="border-gaming-border text-gaming-text hover:bg-gaming-bg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteNews(article.id)}
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gaming-text-muted text-sm">
                        {article.author} •{" "}
                        {new Date(article.date).toLocaleDateString("ru-RU")}
                      </p>
                    </CardHeader>
                    {editingNews?.id === article.id ? (
                      <CardContent className="space-y-4">
                        <Input
                          placeholder="Заголовок"
                          value={editingNews.title}
                          onChange={(e) =>
                            setEditingNews({
                              ...editingNews,
                              title: e.target.value,
                            })
                          }
                          className="bg-gaming-bg border-gaming-border text-gaming-text"
                        />
                        <Input
                          placeholder="Краткое описание"
                          value={editingNews.excerpt || ""}
                          onChange={(e) =>
                            setEditingNews({
                              ...editingNews,
                              excerpt: e.target.value,
                            })
                          }
                          className="bg-gaming-bg border-gaming-border text-gaming-text"
                        />
                        <Input
                          placeholder="Категория"
                          value={editingNews.category || ""}
                          onChange={(e) =>
                            setEditingNews({
                              ...editingNews,
                              category: e.target.value,
                            })
                          }
                          className="bg-gaming-bg border-gaming-border text-gaming-text"
                        />
                        <div>
                          <Label className="text-gaming-text text-sm">
                            Новое изображение
                          </Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0] || null;
                              if (!file) return;
                              try {
                                const compressed = await compressImage(file);
                                if (compressed.size > 9 * 1024 * 1024) {
                                  toast({
                                    title: "Файл слишком большой",
                                    description:
                                      "Сократите изображение до < 9MB",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                setEditingNews({
                                  ...(editingNews as any),
                                  newImage: compressed,
                                } as any);
                              } catch (err) {
                                setEditingNews({
                                  ...(editingNews as any),
                                  newImage: file,
                                } as any);
                              }
                            }}
                            className="bg-gaming-bg border-gaming-border text-gaming-text"
                          />
                          {editingNews.image && (
                            <p className="text-gaming-text-muted text-xs mt-1">
                              Текущее: {editingNews.image}
                            </p>
                          )}
                        </div>
                        <Textarea
                          placeholder="Содержимое"
                          value={editingNews.content}
                          onChange={(e) =>
                            setEditingNews({
                              ...editingNews,
                              content: e.target.value,
                            })
                          }
                          className="bg-gaming-bg border-gaming-border text-gaming-text min-h-[120px]"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Label className="text-gaming-text text-sm">
                              Опубликовано
                            </Label>
                            <PublishedSwitch
                              editingNews={editingNews}
                              setEditingNews={setEditingNews}
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() =>
                                handleUpdateNews(editingNews as any)
                              }
                              className="bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Сохранить
                            </Button>
                            <Button
                              onClick={() => setEditingNews(null)}
                              variant="outline"
                              className="border-gaming-border text-gaming-text hover:bg-gaming-bg"
                            >
                              Отмена
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    ) : (
                      <CardContent>
                        <p className="text-gaming-text-muted">
                          {article.content.substring(0, 200)}...
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Rules Management */}
            <TabsContent value="rules">
              {rules && (
                <Card className="bg-gaming-card border-gaming-border">
                  <CardHeader>
                    <CardTitle className="text-gaming-text flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Правила сервера
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="rulesTitle" className="text-gaming-text">
                        Заголовок
                      </Label>
                      <Input
                        id="rulesTitle"
                        value={rules.title}
                        onChange={(e) =>
                          setRules({ ...rules, title: e.target.value })
                        }
                        className="bg-gaming-bg border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="rulesContent"
                        className="text-gaming-text"
                      >
                        Содержимое
                      </Label>
                      <AdminRichEditor
                        id="rulesContent"
                        value={rules.content}
                        onChange={(val) => setRules({ ...rules, content: val })}
                        className="min-h-[300px]"
                      />
                    </div>
                    <Button
                      onClick={() => handleUpdateContent("rules", rules)}
                      className="bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить прав��ла
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Privacy Policy Management */}
            <TabsContent value="privacy">
              {privacy && (
                <Card className="bg-gaming-card border-gaming-border">
                  <CardHeader>
                    <CardTitle className="text-gaming-text flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Политика конфиденциальности
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label
                        htmlFor="privacyTitle"
                        className="text-gaming-text"
                      >
                        Заголовок
                      </Label>
                      <Input
                        id="privacyTitle"
                        value={privacy.title}
                        onChange={(e) =>
                          setPrivacy({ ...privacy, title: e.target.value })
                        }
                        className="bg-gaming-bg border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="privacyContent"
                        className="text-gaming-text"
                      >
                        Содержимое
                      </Label>
                      <AdminRichEditor
                        id="privacyContent"
                        value={privacy.content}
                        onChange={(val) =>
                          setPrivacy({ ...privacy, content: val })
                        }
                        className="min-h-[300px]"
                      />
                    </div>
                    <Button
                      onClick={() => handleUpdateContent("privacy", privacy)}
                      className="bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить политику
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Terms Management */}
            <TabsContent value="terms">
              {terms && (
                <Card className="bg-gaming-card border-gaming-border">
                  <CardHeader>
                    <CardTitle className="text-gaming-text flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      П��льзовательское соглашение
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="termsTitle" className="text-gaming-text">
                        Заголовок
                      </Label>
                      <Input
                        id="termsTitle"
                        value={terms.title}
                        onChange={(e) =>
                          setTerms({ ...terms, title: e.target.value })
                        }
                        className="bg-gaming-bg border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="termsContent"
                        className="text-gaming-text"
                      >
                        Содержимое
                      </Label>
                      <AdminRichEditor
                        id="termsContent"
                        value={terms.content}
                        onChange={(val) => setTerms({ ...terms, content: val })}
                        className="min-h-[300px]"
                      />
                    </div>
                    <Button
                      onClick={() => handleUpdateContent("terms", terms)}
                      className="bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить усл��вия
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </AdminAuth>
  );
}

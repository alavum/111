import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer for news image uploads
const newsImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/news-images";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `news-${timestamp}${ext}`);
  },
});

const newsImageUpload = multer({
  storage: newsImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Только изображения разрешены!"));
    }
  },
});

// File-based storage for persistence
const newsDataFile = "data/news-articles.json";

// Ensure data directory exists
if (!fs.existsSync("data")) {
  fs.mkdirSync("data", { recursive: true });
}

// Load news articles from file or use defaults
let newsArticles = (() => {
  try {
    if (fs.existsSync(newsDataFile)) {
      const data = fs.readFileSync(newsDataFile, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading news data:", error);
  }

  // Default news articles
  return [
    {
      id: 1,
      title: "Новый сервер RSGS Invasion",
      content: "Мы запустили новый сервер со специальным режимом Invasion...",
      author: "Admin",
      date: new Date().toISOString(),
      published: true,
      image: "/api/placeholder/600/350",
      excerpt: "Новый игровой режим с уникальными механиками",
      category: "Обновления",
      slug: "new-invasion-server",
    },
    {
      id: 2,
      title: "Обновление с��рверных правил",
      content: "Обновлены правила поведения на серверах...",
      author: "Moderator",
      date: new Date(Date.now() - 86400000).toISOString(),
      published: true,
      image: "/api/placeholder/600/350",
      excerpt: "Важные изменения в правилах сервера",
      category: "Правила",
      slug: "rules-update",
    },
  ];
})();

// Save news articles to file
const saveNewsArticles = () => {
  try {
    fs.writeFileSync(newsDataFile, JSON.stringify(newsArticles, null, 2));
  } catch (error) {
    console.error("Error saving news data:", error);
  }
};

let rules = {
  id: 1,
  title: "Игровые правила RSGS",
  content: `
# Основные правила сервера

## 1. Общие правила пове��ения
- Уважайте других игроков
- Запрещены оскорбления и токсичное поведение
- Используйте микрофон для командной игры

## 2. Игровые правила
- Следуйте указаниям Squad Leader
- Не покидайте отряд без разрешения
- Запрещено мешать сою��ным командам

## 3. Наказания
- Предупреждение
- Временный бан
- Постоянный бан
  `,
  lastUpdated: new Date().toISOString(),
};

let privacyPolicy = {
  id: 1,
  title: "Политика конфиденциальности",
  content: `
# Политика конфиденциальности RSGS

## Сбор информации
Мы ��обираем следующие данные:
- Steam ID для идентификации игроков
- Игровая статистика
- Сообщения в чате (для модерации)

## Использование данных
Данные используются для:
- Обеспечения функционирования серверов
- Модерации и поддержания порядка
- Улучшения игрового опыта

## Защита данных
Мы принимаем меры для защиты ваших данных...
  `,
  lastUpdated: new Date().toISOString(),
};

let terms = {
  id: 1,
  title: "Пользовательское соглашение (Офферта)",
  content: `
# Пользовательское соглашение

## 1. Предмет соглашения
Настоящее соглаше��ие регулирует отношения между администрацией RSGS и пользователями серверов.

## 2. Права и обязанности пользователей
- Соблюдение правил сервера
- Уважительное о��ношение к другим игрокам
- Запрет на использование читов и модификаций

## 3. Ответственность
- Администрация не несет ответственность за действия игроков
- Пользователи несут полную ответственность за свои действия

## 4. VIP статус
- VIP статус предоставляется на платной основе
- Включает дополнительные привилегии
- Не подлежит возврату после использования
  `,
  lastUpdated: new Date().toISOString(),
};

// News endpoints
export const getNews: RequestHandler = (req, res) => {
  const published = newsArticles.filter((article) => article.published);
  res.json(published);
};

// Admin: get all news (published and drafts)
export const getAllNews: RequestHandler = (_req, res) => {
  res.json(newsArticles);
};

export const getNewsById: RequestHandler = (req, res) => {
  const param = req.params.id;

  // Try to find by ID first (if param is numeric)
  const numericId = parseInt(param);
  let article;

  if (!isNaN(numericId)) {
    article = newsArticles.find((a) => a.id === numericId && a.published);
  }

  // If not found by ID, try to find by slug
  if (!article) {
    article = newsArticles.find((a) => a.slug === param && a.published);
  }

  if (!article) {
    return res.status(404).json({ error: "Новость не найдена" });
  }

  res.json(article);
};

export const createNews: RequestHandler = (req, res) => {
  const { title, content, author, excerpt, category } = req.body;
  const image = req.file;

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: "Заголовок и содержимое обязательны" });
  }

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^а-яa-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);

  const imageUrl = image
    ? `/uploads/news-images/${image.filename}`
    : "/api/placeholder/600/350";

  const newArticle = {
    id: newsArticles.length
      ? Math.max(...newsArticles.map((a) => a.id)) + 1
      : 1,
    title,
    content,
    author: author || "Admin",
    date: new Date().toISOString(),
    published: true,
    image: imageUrl,
    excerpt: excerpt || content.substring(0, 150) + "...",
    category: category || "Общее",
    slug: `${slug}-${Date.now()}`,
  };

  newsArticles.push(newArticle);
  saveNewsArticles();
  res.status(201).json(newArticle);
};

// Upload middleware for news images
export const uploadNewsImage = newsImageUpload.single("image");

export const updateNews: RequestHandler = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, published, excerpt, category } = req.body as any;
  const image = req.file;

  const articleIndex = newsArticles.findIndex((a) => a.id === id);
  if (articleIndex === -1) {
    return res.status(404).json({ error: "Новость не найдена" });
  }

  if (title) {
    newsArticles[articleIndex].title = title;
    // Update slug if title changed
    const slug = title
      .toLowerCase()
      .replace(/[^а-яa-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);
    newsArticles[articleIndex].slug =
      `${slug}-${newsArticles[articleIndex].id}`;
  }
  if (content) newsArticles[articleIndex].content = content;
  if (typeof published !== "undefined") {
    const pub = typeof published === "string" ? published === "true" : Boolean(published);
    newsArticles[articleIndex].published = pub;
  }
  if (excerpt) newsArticles[articleIndex].excerpt = excerpt;
  if (category) newsArticles[articleIndex].category = category;

  // Update image if new one is uploaded
  if (image) {
    // Delete old image file if it exists and is not a placeholder
    const oldImage = newsArticles[articleIndex].image;
    if (
      oldImage &&
      !oldImage.includes("placeholder") &&
      oldImage.startsWith("/uploads/")
    ) {
      const oldImagePath = `uploads${oldImage.substring("/uploads".length)}`;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    newsArticles[articleIndex].image = `/uploads/news-images/${image.filename}`;
  }

  saveNewsArticles();
  res.json(newsArticles[articleIndex]);
};

export const deleteNews: RequestHandler = (req, res) => {
  const id = parseInt(req.params.id);
  const articleIndex = newsArticles.findIndex((a) => a.id === id);

  if (articleIndex === -1) {
    return res.status(404).json({ error: "Новость не найдена" });
  }

  newsArticles.splice(articleIndex, 1);
  saveNewsArticles();
  res.json({ message: "Новость удалена" });
};

// Rules endpoints
export const getRules: RequestHandler = (req, res) => {
  res.json(rules);
};

export const updateRules: RequestHandler = (req, res) => {
  const { title, content } = req.body;

  if (title) rules.title = title;
  if (content) rules.content = content;
  rules.lastUpdated = new Date().toISOString();

  res.json(rules);
};

// Privacy policy endpoints
export const getPrivacyPolicy: RequestHandler = (req, res) => {
  res.json(privacyPolicy);
};

export const updatePrivacyPolicy: RequestHandler = (req, res) => {
  const { title, content } = req.body;

  if (title) privacyPolicy.title = title;
  if (content) privacyPolicy.content = content;
  privacyPolicy.lastUpdated = new Date().toISOString();

  res.json(privacyPolicy);
};

// Terms endpoints
export const getTerms: RequestHandler = (req, res) => {
  res.json(terms);
};

export const updateTerms: RequestHandler = (req, res) => {
  const { title, content } = req.body;

  if (title) terms.title = title;
  if (content) terms.content = content;
  terms.lastUpdated = new Date().toISOString();

  res.json(terms);
};

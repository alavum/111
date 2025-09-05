import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";

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
    fileSize: 9 * 1024 * 1024, // 9MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Только изображения разрешены! Формат файла должен быть image/*",
        ),
      );
    }
  },
});

// File-based storage for persistence
const dataDir = "data";
const newsDataFile = path.join(dataDir, "news-articles.json");
const rulesDataFile = path.join(dataDir, "rules.json");
const privacyDataFile = path.join(dataDir, "privacy.json");
const termsDataFile = path.join(dataDir, "terms.json");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load JSON helper
function safeLoadJson(filePath: string, fallback: any) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
  return fallback;
}

// Save JSON helper
function safeSaveJson(filePath: string, payload: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error);
  }
}

// Load news articles from file or use defaults
let newsArticles = safeLoadJson(newsDataFile, [
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
    title: "Обновление серверных правил",
    content: "Обновлены правила поведения на серверах...",
    author: "Moderator",
    date: new Date(Date.now() - 86400000).toISOString(),
    published: true,
    image: "/api/placeholder/600/350",
    excerpt: "Важные изменения в правилах сервера",
    category: "Правила",
    slug: "rules-update",
  },
]);

const saveNewsArticles = () => safeSaveJson(newsDataFile, newsArticles);

// Default content for rules/privacy/terms (will be saved if files don't exist)
const defaultRules = {
  id: 1,
  title: "Игровые правила RSGS",
  content: `# Основные правила сервера

## 1. Общие правила поведения
- Уважайте других игроков
- Запрещены оскорбления и токсичное поведение
- Используйте микрофон для командной игры

## 2. Игровые правила
- Следуйте указаниям Squad Leader
- Не покидайте отряд без разрешения
- Запрещено мешать союзным командам

## 3. Наказания
- Предупреждение
- Временный бан
- Постоянный бан
`,
  lastUpdated: new Date().toISOString(),
};

const defaultPrivacy = {
  id: 1,
  title: "Политика конфиденциальности",
  content: `# Политика конфиденциальности RSGS

## Сбор информации
Мы собираем следующие данные:
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

const defaultTerms = {
  id: 1,
  title: "Пользовательское соглашение (Офферта)",
  content: `# Пользовательское соглашение

## 1. Предмет соглашения
Настоящее соглашение регулирует отношения между администрацией RSGS и пользователями серверов.

## 2. Права и обязанности пользователей
- Соблюдение правил сервера
- Уважительное отношение к другим игрокам
- Запрет на использование читов и модификаций
`,
  lastUpdated: new Date().toISOString(),
};

let rules = safeLoadJson(rulesDataFile, defaultRules);
let privacyPolicy = safeLoadJson(privacyDataFile, defaultPrivacy);
let terms = safeLoadJson(termsDataFile, defaultTerms);

// Save helpers for content
const saveRules = () => safeSaveJson(rulesDataFile, rules);
const savePrivacy = () => safeSaveJson(privacyDataFile, privacyPolicy);
const saveTerms = () => safeSaveJson(termsDataFile, terms);

// Ensure default files exist (write fallback if file missing)
if (!fs.existsSync(rulesDataFile)) saveRules();
if (!fs.existsSync(privacyDataFile)) savePrivacy();
if (!fs.existsSync(termsDataFile)) saveTerms();
if (!fs.existsSync(newsDataFile)) saveNewsArticles();

// Validate input schemas using zod
const newsCreateSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string().min(1),
  author: z.string().optional(),
  excerpt: z.string().optional(),
  category: z.string().optional(),
});

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
  const numericId = parseInt(param);
  let article;

  if (!isNaN(numericId)) {
    article = newsArticles.find((a) => a.id === numericId && a.published);
  }

  if (!article) {
    article = newsArticles.find((a) => a.slug === param && a.published);
  }

  if (!article) {
    return res.status(404).json({ error: "Новость не найдена" });
  }

  res.json(article);
};

export const createNews: RequestHandler = (req, res) => {
  try {
    const parsed = newsCreateSchema.parse(req.body);
    const { title, content, author, excerpt, category } = parsed;
    const image = (req as any).file;

    // Generate slug from title
    const slugBase = title
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
      slug: `${slugBase}-${Date.now()}`,
    };

    newsArticles.push(newArticle);
    saveNewsArticles();
    res.status(201).json(newArticle);
  } catch (err) {
    console.error("createNews validation error", err);
    return res.status(400).json({ error: "Некорректные данные новости" });
  }
};

// Upload middleware for news images
export const uploadNewsImage = newsImageUpload.single("image");

export const updateNews: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content, published, excerpt, category } = req.body as any;
    const image = (req as any).file;

    const articleIndex = newsArticles.findIndex((a) => a.id === id);
    if (articleIndex === -1) {
      return res.status(404).json({ error: "Новость не найдена" });
    }

    if (title) {
      newsArticles[articleIndex].title = title;
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
      const pub =
        typeof published === "string"
          ? published === "true"
          : Boolean(published);
      newsArticles[articleIndex].published = pub;
    }
    if (excerpt) newsArticles[articleIndex].excerpt = excerpt;
    if (category) newsArticles[articleIndex].category = category;

    if (image) {
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
      newsArticles[articleIndex].image =
        `/uploads/news-images/${image.filename}`;
    }

    saveNewsArticles();
    res.json(newsArticles[articleIndex]);
  } catch (err) {
    console.error("updateNews error", err);
    res.status(400).json({ error: "Ошибка обновления новости" });
  }
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
  const { title, content } = req.body as any;

  if (title) rules.title = String(title).substring(0, 5000);
  if (content) rules.content = String(content).substring(0, 100000);
  rules.lastUpdated = new Date().toISOString();

  saveRules();
  res.json(rules);
};

// Privacy policy endpoints
export const getPrivacyPolicy: RequestHandler = (req, res) => {
  res.json(privacyPolicy);
};

export const updatePrivacyPolicy: RequestHandler = (req, res) => {
  const { title, content } = req.body as any;

  if (title) privacyPolicy.title = String(title).substring(0, 5000);
  if (content) privacyPolicy.content = String(content).substring(0, 200000);
  privacyPolicy.lastUpdated = new Date().toISOString();

  savePrivacy();
  res.json(privacyPolicy);
};

// Terms endpoints
export const getTerms: RequestHandler = (req, res) => {
  res.json(terms);
};

export const updateTerms: RequestHandler = (req, res) => {
  const { title, content } = req.body as any;

  if (title) terms.title = String(title).substring(0, 5000);
  if (content) terms.content = String(content).substring(0, 200000);
  terms.lastUpdated = new Date().toISOString();

  saveTerms();
  res.json(terms);
};

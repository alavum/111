import fs from "fs";
import path from "path";

export let sqliteAvailable = false;
let db: any = null;

function safeParseJson(filePath: string, fallback: any) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading JSON ${filePath}:`, err);
  }
  return fallback;
}

export function initSqlite(dbFile = path.join("data", "app.db")) {
  try {
    // dynamic import to avoid hard dependency if module not installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const BetterSqlite3 = require("better-sqlite3");
    const dir = path.dirname(dbFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new BetterSqlite3(dbFile);

    // Create tables
    db.prepare(
      `CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY,
        title TEXT,
        content TEXT,
        author TEXT,
        date TEXT,
        published INTEGER,
        image TEXT,
        excerpt TEXT,
        category TEXT,
        slug TEXT
      )`,
    ).run();

    db.prepare(
      `CREATE TABLE IF NOT EXISTS rules (
        id INTEGER PRIMARY KEY,
        title TEXT,
        content TEXT,
        lastUpdated TEXT
      )`,
    ).run();

    db.prepare(
      `CREATE TABLE IF NOT EXISTS privacy (
        id INTEGER PRIMARY KEY,
        title TEXT,
        content TEXT,
        lastUpdated TEXT
      )`,
    ).run();

    db.prepare(
      `CREATE TABLE IF NOT EXISTS terms (
        id INTEGER PRIMARY KEY,
        title TEXT,
        content TEXT,
        lastUpdated TEXT
      )`,
    ).run();

    sqliteAvailable = true;

    // Migrate existing JSON content if database empty
    try {
      const count = db.prepare(`SELECT COUNT(1) as c FROM news`).get()?.c || 0;
      if (count === 0) {
        const newsJson = safeParseJson(path.join("data", "news-articles.json"), []);
        const insert = db.prepare(`INSERT INTO news (id,title,content,author,date,published,image,excerpt,category,slug) VALUES (@id,@title,@content,@author,@date,@published,@image,@excerpt,@category,@slug)`);
        const insertMany = db.transaction((items: any[]) => {
          for (const it of items) {
            insert.run({
              id: it.id || undefined,
              title: it.title,
              content: it.content,
              author: it.author || "Admin",
              date: it.date || new Date().toISOString(),
              published: it.published ? 1 : 0,
              image: it.image || "/api/placeholder/600/350",
              excerpt: it.excerpt || (it.content || "").substring(0, 150) + "...",
              category: it.category || "Общее",
              slug: it.slug || null,
            });
          }
        });
        if (Array.isArray(newsJson) && newsJson.length) insertMany(newsJson);
      }

      // Migrate single-row documents
      const ruleCount = db.prepare(`SELECT COUNT(1) as c FROM rules`).get()?.c || 0;
      if (ruleCount === 0) {
        const rulesJson = safeParseJson(path.join("data", "rules.json"), null);
        if (rulesJson) {
          db.prepare(`INSERT INTO rules (id,title,content,lastUpdated) VALUES (1,@title,@content,@lastUpdated)`).run({
            title: rulesJson.title || "",
            content: rulesJson.content || "",
            lastUpdated: rulesJson.lastUpdated || new Date().toISOString(),
          });
        }
      }

      const privacyCount = db.prepare(`SELECT COUNT(1) as c FROM privacy`).get()?.c || 0;
      if (privacyCount === 0) {
        const privacyJson = safeParseJson(path.join("data", "privacy.json"), null);
        if (privacyJson) {
          db.prepare(`INSERT INTO privacy (id,title,content,lastUpdated) VALUES (1,@title,@content,@lastUpdated)`).run({
            title: privacyJson.title || "",
            content: privacyJson.content || "",
            lastUpdated: privacyJson.lastUpdated || new Date().toISOString(),
          });
        }
      }

      const termsCount = db.prepare(`SELECT COUNT(1) as c FROM terms`).get()?.c || 0;
      if (termsCount === 0) {
        const termsJson = safeParseJson(path.join("data", "terms.json"), null);
        if (termsJson) {
          db.prepare(`INSERT INTO terms (id,title,content,lastUpdated) VALUES (1,@title,@content,@lastUpdated)`).run({
            title: termsJson.title || "",
            content: termsJson.content || "",
            lastUpdated: termsJson.lastUpdated || new Date().toISOString(),
          });
        }
      }
    } catch (migErr) {
      console.warn("SQLite migration skipped due to error:", migErr);
    }

    return true;
  } catch (err) {
    console.warn("better-sqlite3 not available, falling back to JSON file storage");
    sqliteAvailable = false;
    return false;
  }
}

// News
export function getNewsRows() {
  if (!sqliteAvailable) return null;
  return db.prepare(`SELECT * FROM news WHERE published=1 ORDER BY date DESC`).all();
}
export function getAllNewsRows() {
  if (!sqliteAvailable) return null;
  return db.prepare(`SELECT * FROM news ORDER BY date DESC`).all();
}
export function getNewsByIdOrSlug(param: string) {
  if (!sqliteAvailable) return null;
  const numeric = parseInt(param as any);
  let row;
  if (!isNaN(numeric)) {
    row = db
      .prepare(`SELECT * FROM news WHERE id = ? AND published=1 LIMIT 1`)
      .get(numeric);
  }
  if (!row) {
    row = db.prepare(`SELECT * FROM news WHERE slug = ? AND published=1 LIMIT 1`).get(param);
  }
  return row;
}
export function createNewsRow(data: any) {
  if (!sqliteAvailable) return null;
  const stmt = db.prepare(`INSERT INTO news (title,content,author,date,published,image,excerpt,category,slug) VALUES (@title,@content,@author,@date,@published,@image,@excerpt,@category,@slug)`);
  const info = stmt.run({
    title: data.title,
    content: data.content,
    author: data.author,
    date: data.date,
    published: data.published ? 1 : 0,
    image: data.image,
    excerpt: data.excerpt,
    category: data.category,
    slug: data.slug,
  });
  const id = info.lastInsertRowid;
  return db.prepare(`SELECT * FROM news WHERE id = ?`).get(id);
}
export function updateNewsRow(id: number, data: any) {
  if (!sqliteAvailable) return null;
  const fields: string[] = [];
  const params: any = { id };
  for (const key of ["title", "content", "author", "published", "image", "excerpt", "category", "slug"]) {
    if (typeof data[key] !== "undefined") {
      fields.push(`${key} = @${key}`);
      params[key] = key === "published" ? (data[key] ? 1 : 0) : data[key];
    }
  }
  if (fields.length) {
    const sql = `UPDATE news SET ${fields.join(",")} WHERE id = @id`;
    db.prepare(sql).run(params);
  }
  return db.prepare(`SELECT * FROM news WHERE id = ?`).get(id);
}
export function deleteNewsRow(id: number) {
  if (!sqliteAvailable) return null;
  const info = db.prepare(`DELETE FROM news WHERE id = ?`).run(id);
  return info.changes > 0;
}

// Documents
export function getRulesRow() {
  if (!sqliteAvailable) return null;
  return db.prepare(`SELECT * FROM rules LIMIT 1`).get();
}
export function updateRulesRow(data: any) {
  if (!sqliteAvailable) return null;
  const existing = db.prepare(`SELECT * FROM rules LIMIT 1`).get();
  if (existing) {
    db.prepare(`UPDATE rules SET title = @title, content = @content, lastUpdated = @lastUpdated WHERE id = @id`).run({
      title: data.title,
      content: data.content,
      lastUpdated: new Date().toISOString(),
      id: existing.id,
    });
    return db.prepare(`SELECT * FROM rules WHERE id = ?`).get(existing.id);
  }
  const info = db.prepare(`INSERT INTO rules (title,content,lastUpdated) VALUES (@title,@content,@lastUpdated)`).run({
    title: data.title,
    content: data.content,
    lastUpdated: new Date().toISOString(),
  });
  return db.prepare(`SELECT * FROM rules WHERE id = ?`).get(info.lastInsertRowid);
}

export function getPrivacyRow() {
  if (!sqliteAvailable) return null;
  return db.prepare(`SELECT * FROM privacy LIMIT 1`).get();
}
export function updatePrivacyRow(data: any) {
  if (!sqliteAvailable) return null;
  const existing = db.prepare(`SELECT * FROM privacy LIMIT 1`).get();
  if (existing) {
    db.prepare(`UPDATE privacy SET title = @title, content = @content, lastUpdated = @lastUpdated WHERE id = @id`).run({
      title: data.title,
      content: data.content,
      lastUpdated: new Date().toISOString(),
      id: existing.id,
    });
    return db.prepare(`SELECT * FROM privacy WHERE id = ?`).get(existing.id);
  }
  const info = db.prepare(`INSERT INTO privacy (title,content,lastUpdated) VALUES (@title,@content,@lastUpdated)`).run({
    title: data.title,
    content: data.content,
    lastUpdated: new Date().toISOString(),
  });
  return db.prepare(`SELECT * FROM privacy WHERE id = ?`).get(info.lastInsertRowid);
}

export function getTermsRow() {
  if (!sqliteAvailable) return null;
  return db.prepare(`SELECT * FROM terms LIMIT 1`).get();
}
export function updateTermsRow(data: any) {
  if (!sqliteAvailable) return null;
  const existing = db.prepare(`SELECT * FROM terms LIMIT 1`).get();
  if (existing) {
    db.prepare(`UPDATE terms SET title = @title, content = @content, lastUpdated = @lastUpdated WHERE id = @id`).run({
      title: data.title,
      content: data.content,
      lastUpdated: new Date().toISOString(),
      id: existing.id,
    });
    return db.prepare(`SELECT * FROM terms WHERE id = ?`).get(existing.id);
  }
  const info = db.prepare(`INSERT INTO terms (title,content,lastUpdated) VALUES (@title,@content,@lastUpdated)`).run({
    title: data.title,
    content: data.content,
    lastUpdated: new Date().toISOString(),
  });
  return db.prepare(`SELECT * FROM terms WHERE id = ?`).get(info.lastInsertRowid);
}

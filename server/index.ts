import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getNews,
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getRules,
  updateRules,
  getPrivacyPolicy,
  updatePrivacyPolicy,
  getTerms,
  updateTerms,
  uploadNewsImage,
} from "./routes/content";
import { initSqlite } from "./sqlite";
import { checkServerStatus, checkMultipleServers } from "./routes/serverStatus";
import {
  checkRconServerStatus,
  checkAllRconServers,
  getServerList,
} from "./routes/rconStatus";
import {
  handleVipApplication,
  getVipApplications,
  updateVipApplicationStatus,
  uploadMiddleware,
} from "./routes/vipApplications";
import {
  adminLogin,
  verifyAdmin,
  requireAdmin,
  getAdminInfo,
} from "./routes/adminAuth";

export function createServer() {
  const app = express();

  // Sanitize route registration: convert absolute URLs used accidentally as paths
  const _wrapMethods = ["use", "get", "post", "put", "delete", "patch", "all"] as const;
  for (const m of _wrapMethods) {
    const orig = (app as any)[m];
    (app as any)[m] = function (...args: any[]) {
      if (typeof args[0] === "string" && /^https?:\/\//.test(args[0])) {
        try {
          args[0] = new URL(args[0]).pathname || "/";
        } catch (e) {
          args[0] = args[0].replace(/^https?:\/\/[^/]+/, "") || "/";
        }
      }
      return orig.apply(this, args);
    } as any;
  }

  // Initialize optional SQLite storage only when explicitly enabled via env
  // This avoids attempting to load native modules in environments where they are not wanted.
  try {
    if (String(process.env.ENABLE_SQLITE || "").toLowerCase() === "true") {
      initSqlite();
    } else {
      console.log(
        "SQLite disabled via ENABLE_SQLITE env; using JSON file storage",
      );
    }
  } catch (err) {
    console.warn("SQLite init failed:", err);
  }

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Content Management API routes
  // News routes (public read, admin write)
  app.get("/api/news", getNews);
  app.get("/api/news/:id", getNewsById);
  app.get("/api/admin/news", requireAdmin, getAllNews);
  app.post("/api/news", requireAdmin, uploadNewsImage, createNews);
  app.put("/api/news/:id", requireAdmin, uploadNewsImage, updateNews);
  app.delete("/api/news/:id", requireAdmin, deleteNews);

  // Rules routes (public read, admin write)
  app.get("/api/rules", getRules);
  app.put("/api/rules", requireAdmin, updateRules);

  // Privacy policy routes (public read, admin write)
  app.get("/api/privacy", getPrivacyPolicy);
  app.put("/api/privacy", requireAdmin, updatePrivacyPolicy);

  // Terms routes (public read, admin write)
  app.get("/api/terms", getTerms);
  app.put("/api/terms", requireAdmin, updateTerms);

  // Server status routes
  app.get("/api/server-status/:serverId", checkServerStatus);
  app.post("/api/server-status/batch", checkMultipleServers);

  // RCON status routes
  app.get("/api/rcon-status/:serverId", checkRconServerStatus);
  app.get("/api/rcon-status", checkAllRconServers);
  app.get("/api/servers", getServerList);

  // VIP applications routes
  app.post("/api/vip-applications", uploadMiddleware, handleVipApplication);
  app.get("/api/vip-applications", requireAdmin, getVipApplications);
  app.put(
    "/api/vip-applications/:applicationId",
    requireAdmin,
    updateVipApplicationStatus,
  );

  // Admin authentication routes
  app.post("/api/admin/login", adminLogin);
  app.get("/api/admin/verify", verifyAdmin);
  app.get("/api/admin/info", requireAdmin, getAdminInfo);

  return app;
}

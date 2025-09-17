import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function CookieConsent() {
  const STORAGE_KEY = "rgs_cookie_consent";
  const [accepted, setAccepted] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (accepted) {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    }
  }, [accepted]);

  if (accepted) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50">
      <div className="max-w-3xl mx-auto bg-gaming-card border border-gaming-border rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 shadow-lg">
        <div className="flex-1 text-sm text-gaming-text-muted">
          Мы используем cookies для улучшен��я работы сайта. Продовольняя
          персонализация и аналитика. Подробнее в{" "}
          <a href="/privacy" className="text-gaming-accent underline">
            политике конфиденциальности
          </a>
          .
        </div>

        <div className="flex-shrink-0 flex items-center gap-2">
          <Button
            className="bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold"
            onClick={() => setAccepted(true)}
          >
            Принять
          </Button>
        </div>
      </div>
    </div>
  );
}

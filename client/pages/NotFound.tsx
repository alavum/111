import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gaming-bg">
      <div className="bg-gaming-card border border-gaming-border rounded-lg p-8 text-center mx-4">
        <h1 className="text-6xl font-bold mb-4 text-gaming-text">404</h1>
        <p className="text-lg text-gaming-text-muted mb-6">
          Страница не найдена
        </p>
        <a
          href="/"
          className="inline-block bg-gaming-accent text-black font-semibold px-6 py-2 rounded hover:bg-gaming-accent-hover"
        >
          На главную
        </a>
      </div>
    </div>
  );
};

export default NotFound;

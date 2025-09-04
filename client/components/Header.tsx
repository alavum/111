import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getLinkClassName = (path: string) => {
    const baseClasses =
      "transition-all duration-200 font-medium px-3 py-2 rounded-md relative";
    return isActive(path)
      ? `${baseClasses} text-gaming-accent bg-gaming-accent/10 border-b-2 border-gaming-accent`
      : `${baseClasses} text-gaming-text hover:text-gaming-accent hover:bg-gaming-card`;
  };

  return (
    <header className="bg-gaming-bg border-b border-gaming-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gaming-accent rounded-md flex items-center justify-center">
                <span className="text-black font-bold text-xl">R</span>
              </div>
              <span className="text-gaming-text font-bold text-xl">RSGS</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center space-x-8">
              <Link to="/" className={getLinkClassName("/")}>Главная</Link>
              <Link to="/news" className={getLinkClassName("/news")}>Новости</Link>
              <Link to="/guides" className={getLinkClassName("/guides")}>Гайды</Link>
              <Link to="/rules" className={getLinkClassName("/rules") + ' pr-0'}>Правила</Link>
            </div>
          </nav>

          {/* External quick links separated to the right on desktop */}
          <div className="hidden md:flex items-center border-l border-gaming-border pl-3 space-x-6">
            <a
              href="https://squadcalc.rgs-squad.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gaming-text hover:text-gaming-accent transition-colors font-medium"
            >
              Squad Calc
            </a>
            <a
              href="https://discord.gg/HXne8JVJ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gaming-text hover:text-gaming-accent transition-colors font-medium"
            >
              Обжаловать бан
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* VIP Button */}
            <Link to="/vip">
              <Button
                className="bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold"
                size="sm"
              >
                Стать VIP
              </Button>
            </Link>

            {/* User Profile */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gaming-text hover:text-gaming-accent hover:bg-gaming-card"
              onClick={() =>
                toast({
                  title: "В разработке",
                  description: "Функция авторизации наход��тся в разработке",
                  duration: 3000,
                })
              }
            >
              <User className="w-4 h-4 mr-1" />
              Войти
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-gaming-text hover:text-gaming-accent"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile navigation panel */}
        {mobileOpen && (
          <div className="md:hidden mt-2 pb-4">
            <div className="flex flex-col space-y-2 px-2">
              <Link to="/" onClick={() => setMobileOpen(false)} className={getLinkClassName("/")}>Главная</Link>
              <Link to="/news" onClick={() => setMobileOpen(false)} className={getLinkClassName("/news")}>Новости</Link>
              <Link to="/guides" onClick={() => setMobileOpen(false)} className={getLinkClassName("/guides")}>Гайды</Link>
              <Link to="/rules" onClick={() => setMobileOpen(false)} className={getLinkClassName("/rules")}>Правила</Link>

              <div className="h-px bg-gaming-border my-2" />

              <a href="https://squadcalc.rgs-squad.ru" target="_blank" rel="noopener noreferrer" className="text-gaming-text hover:text-gaming-accent transition-colors font-medium px-3 py-2 rounded-md">Squad Calc</a>
              <a href="https://discord.gg/HXne8JVJ" target="_blank" rel="noopener noreferrer" className="text-gaming-text hover:text-gaming-accent transition-colors font-medium px-3 py-2 rounded-md">Обжаловать бан</a>

              <div className="pt-2 border-t border-gaming-border mt-2">
                <Link to="/vip" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold">Стать VIP</Button>
                </Link>
                <Button variant="ghost" className="w-full mt-2 text-gaming-text" onClick={() => { setMobileOpen(false); toast({ title: 'В разработке', description: 'Функция авторизации находится в разработке' }); }}>
                  <User className="w-4 h-4 mr-1" /> Войти
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

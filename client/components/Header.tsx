import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function Header() {
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
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/news"
              className="text-gaming-accent font-medium border-b-2 border-gaming-accent"
            >
              Новости
            </Link>
            <Link
              to="/guides"
              className="text-gaming-text hover:text-gaming-accent transition-colors font-medium"
            >
              Гайды
            </Link>
            <Link
              to="/squad-calc"
              className="text-gaming-text hover:text-gaming-accent transition-colors font-medium"
            >
              Squad Calc
            </Link>
            <Link
              to="/equipment-ban"
              className="text-gaming-text hover:text-gaming-accent transition-colors font-medium"
            >
              Оборудование бан
            </Link>
            <a
              href="https://discord.gg/HXne8JVJ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gaming-text hover:text-gaming-accent transition-colors font-medium"
            >
              Обжаловать бан
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gaming-text-muted w-4 h-4" />
              <Input
                type="search"
                placeholder="Поиск"
                className="pl-10 w-40 bg-gaming-card border-gaming-border text-gaming-text placeholder:text-gaming-text-muted"
              />
            </div>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gaming-text hover:text-gaming-accent hover:bg-gaming-card"
            >
              <Globe className="w-4 h-4 mr-1" />
              English
            </Button>

            {/* VIP Button */}
            <Button
              className="bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold"
              size="sm"
            >
              Стать VIP
            </Button>

            {/* User Profile */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gaming-text hover:text-gaming-accent hover:bg-gaming-card"
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
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

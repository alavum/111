import { Link } from "react-router-dom";
import { Youtube, MessageCircle, Music } from "lucide-react";

const footerSections = [
  {
    title: "Интересное",
    links: [
      { label: "Новости", href: "/news" },
      { label: "Стать VIP", href: "/vip" },
    ],
  },
  {
    title: "Ссылки",
    links: [
      { label: "YouTube", href: "https://youtube.com", external: true },
      { label: "Discord", href: "https://discord.com", external: true },
      { label: "TikTok", href: "https://tiktok.com", external: true },
    ],
  },
];

const socialLinks = [
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: <Youtube className="w-5 h-5" />,
  },
  {
    name: "Discord",
    href: "https://discord.com",
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    icon: <Music className="w-5 h-5" />,
  },
];

const bottomLinks = [
  { label: "Игровые правила", href: "/rules" },
  { label: "Политика конфиденциальности", href: "/privacy" },
  { label: "Офферта", href: "/terms" },
  { label: "Сотрудничество", href: "/partnership" },
];

export default function Footer() {
  return (
    <footer className="bg-gaming-card border-t border-gaming-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-start">
          {/* Left: Logo + small info */}
          <div className="flex flex-col items-start">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F9371a00d52894c5d9ce9e006bf6e8168%2F0e31f6f703ab47a08d4c5d915a7270c2?format=webp&width=800" alt="RSGS" className="w-20 h-20 md:w-24 md:h-24 object-contain -mt-1" />
            <p className="text-gaming-text-muted text-sm mt-3 max-w-xs">Официальные серверы и сообщество тактических симуляторов RSGS.</p>

            <div className="mt-4 flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gaming-text-muted hover:text-gaming-accent transition-colors p-2 rounded-md bg-gaming-card/50"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Middle: Navigation columns */}
          <div className="flex flex-col md:pl-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gaming-text mb-3">Инструменты</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="/squad-calc" className="text-gaming-text-muted hover:text-gaming-accent transition-colors text-sm">Squad Calc</a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gaming-text mb-3">Новичкам</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/guides" className="text-gaming-text-muted hover:text-gaming-accent transition-colors text-sm">Гайды</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Additional footer navigation links */}
            <div className="mt-6">
              <h4 className="font-semibold text-gaming-text mb-3">Полезное</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                {bottomLinks.map((link) => (
                  <Link key={link.label} to={link.href} className="text-gaming-text-muted hover:text-gaming-accent transition-colors">{link.label}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Provider info */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-gaming-text mb-4">Поставщик услуг</h3>
            <div className="bg-gaming-card border border-gaming-border rounded-md p-4">
              <p className="text-gaming-text font-medium">Лебидко Кирилл Алексеевич</p>
              <p className="text-gaming-text-muted text-sm mt-1">ИНН: 862203594392</p>
              <p className="text-gaming-text-muted text-sm mt-3">Оказание услуг и обслуживание серверов RSGS.</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gaming-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Bottom Links */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
              {bottomLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-gaming-text-muted hover:text-gaming-accent transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-gaming-text-muted text-sm text-center md:text-right">
              <p>© 2024 Russian Squad Game Servers</p>
              <p className="mt-1">Все права защищены</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

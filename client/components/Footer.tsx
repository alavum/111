import { Youtube, MessageCircle, Music } from "lucide-react";
import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Инструменты",
    links: [
      {
        label: "Squad Calc",
        href: "https://squadcalc.rgs-squad.ru",
        external: true,
      },
    ],
  },
  {
    title: "Новичкам",
    links: [{ label: "Гайды", href: "/guides" }],
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 items-center">
          {/* Column 1: Logo + description + socials */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F9371a00d52894c5d9ce9e006bf6e8168%2F55af46d0d2db4b599e3e6ac417b987b8?format=webp&width=800"
              alt="РУБЕЖ"
              className="block h-5 md:h-6 w-auto object-contain"
            />
            <p className="text-gaming-text-muted text-sm mt-2 max-w-xs">
              Игровое сообщество и серверы тактических симуляторов РУБЕЖ.
            </p>
          </div>

          {/* Column 2: Интересное */}
          <div className="flex flex-col">
            <h4 className="font-semibold text-gaming-text mb-3">Интересное</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  className="group relative inline-flex items-center space-x-2 text-gaming-text-muted transition"
                  aria-disabled
                >
                  <span className="transition-opacity duration-150 group-hover:opacity-60">
                    Недельная статистика
                  </span>
                  <span className="ml-2 hidden group-hover:inline-flex items-center text-xs bg-gaming-accent/10 text-gaming-accent border border-gaming-border rounded-full px-2 py-0.5">
                    недоступно
                  </span>
                </button>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-gaming-text-muted hover:text-gaming-accent transition-colors text-sm"
                >
                  Новости
                </Link>
              </li>
              <li>
                <Link
                  to="/vip"
                  className="text-gaming-text-muted hover:text-gaming-accent transition-colors text-sm"
                >
                  Стать VIP
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Инструменты + Новичкам */}
          <div className="flex flex-col">
            <h4 className="font-semibold text-gaming-text mb-3">Инструменты</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://squadcalc.rgs-squad.ru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gaming-text-muted hover:text-gaming-accent transition-colors"
                >
                  Squad Calc
                </a>
              </li>
            </ul>

            <h4 className="font-semibold text-gaming-text mb-3 mt-4">
              Новичкам
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/guides"
                  className="text-gaming-text-muted hover:text-gaming-accent transition-colors"
                >
                  Гайды
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Ссылки */}
          <div className="flex flex-col">
            <h4 className="font-semibold text-gaming-text mb-3">Ссылки</h4>
            <ul className="space-y-2 text-sm">
              {socialLinks.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gaming-text-muted hover:text-gaming-accent transition-colors flex items-center gap-2"
                  >
                    <span className="sr-only">{s.name}</span>
                    <span className="inline-block">{s.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gaming-border pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-4">
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

            <div className="mt-4 md:mt-0 md:ml-8">
              <div className="bg-gaming-card border border-gaming-border rounded-md p-2 text-sm">
                <p className="text-gaming-text-muted text-xs mb-1">
                  Услуги предоставляет
                </p>
                <p className="text-gaming-text-muted text-xs mb-1">Самозанятый</p>
                <p className="text-gaming-text font-medium">Лебидко Кирилл Алексеевич</p>
                <p className="text-gaming-text-muted text-xs mt-1">
                  ИНН: 862203594392
                </p>
              </div>
            </div>

            <div className="text-gaming-text-muted text-sm text-center md:text-right">
              <p>© 2024 RUBEZH</p>
              <p className="mt-1">Все права защищены</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

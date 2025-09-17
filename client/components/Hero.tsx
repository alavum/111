import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const heroSlides = [
  {
    id: 1,
    title: "Выгодный VIP",
    subtitle: "Проходка для себя или клана",
    description: "Получите доступ к эксклюзивным возможностям и преимуществам",
    background: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900",
    backgroundImage: "/images/hero-1.svg",
    primaryText: "Получить VIP",
    primaryLink: "/vip",
  },
  {
    id: 2,
    title: "Гайды",
    subtitle: "Лучшие советы и разборы",
    description:
      "Подробные руководства по игре: механики, стратегии и прокачка",
    background: "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900",
    backgroundImage: "/images/hero-2.svg",
    primaryText: "Читать гайды",
    primaryLink: "/guides",
  },
  {
    id: 3,
    title: "Новости и обновления",
    subtitle: "Будь в курсе всего",
    description: "Свежие анонсы, апдейты и важные события нашего проекта",
    background: "bg-gradient-to-r from-green-900 via-green-800 to-green-900",
    backgroundImage: "/images/hero-3.svg",
    primaryText: "Читать новости",
    primaryLink: "/news",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const progressElRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const [fading, setFading] = useState(false);
  const DURATION = 12000; // ms

  const rafRef = useRef<number>(0);
  const baseStartRef = useRef<number>(performance.now());
  const runningRef = useRef<boolean>(false);
  const advancingRef = useRef<boolean>(false);
  const pausedAtRef = useRef<number | null>(null);
  const totalPausedRef = useRef<number>(0);
  const hoverRef = useRef<boolean>(false);
  const autoDisabledRef = useRef<boolean>(false);

  const resetTimer = () => {
    progressRef.current = 0;
    if (progressElRef.current)
      progressElRef.current.style.transform = "scaleX(0)";
    baseStartRef.current = performance.now();
    totalPausedRef.current = 0;
    pausedAtRef.current = null;
  };

  const stopLoop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    runningRef.current = false;
  };

  const startLoop = () => {
    if (autoDisabledRef.current) return;
    stopLoop();
    runningRef.current = true;
    baseStartRef.current = performance.now();
    totalPausedRef.current = 0;
    pausedAtRef.current = null;
    const tick = (now: number) => {
      if (!runningRef.current) return;
      // handle pause only when hovering banner
      if (hoverRef.current) {
        if (pausedAtRef.current == null) pausedAtRef.current = now;
      } else if (pausedAtRef.current != null) {
        totalPausedRef.current += now - pausedAtRef.current;
        pausedAtRef.current = null;
      }
      const effectiveNow = pausedAtRef.current ?? now;
      const elapsed =
        effectiveNow - baseStartRef.current - totalPausedRef.current;
      const p = Math.min(Math.max(elapsed / DURATION, 0), 1);
      progressRef.current = p;
      if (progressElRef.current)
        progressElRef.current.style.transform = `scaleX(${p})`;
      if (p >= 1 && !advancingRef.current && !hoverRef.current) {
        advancingRef.current = true;
        setFading(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
          setFading(false);
          baseStartRef.current = performance.now();
          totalPausedRef.current = 0;
          pausedAtRef.current = null;
          progressRef.current = 0;
          if (progressElRef.current)
            progressElRef.current.style.transform = "scaleX(0)";
          advancingRef.current = false;
        }, 300);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const goToSlide = (index: number, disableAuto = false) => {
    setFading(true);
    stopLoop();
    setTimeout(() => {
      setCurrentSlide(index);
      setFading(false);
      resetTimer();
      if (disableAuto) {
        autoDisabledRef.current = true;
      } else {
        startLoop();
      }
    }, 250);
  };

  const nextSlide = (disableAuto = true) => {
    goToSlide((currentSlide + 1) % heroSlides.length, disableAuto);
  };

  const prevSlide = (disableAuto = true) => {
    goToSlide(
      (currentSlide - 1 + heroSlides.length) % heroSlides.length,
      disableAuto,
    );
  };

  const currentHero = heroSlides[currentSlide];

  useEffect(() => {
    startLoop();
    return () => stopLoop();
  }, []);

  return (
    <section
      className="relative h-96 md:h-[500px] overflow-hidden"
      onMouseEnter={() => {
        hoverRef.current = true;
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
      }}
    >
      {/* Background with overlay */}
      <div
        className={`absolute inset-0 ${currentHero.background} transition-opacity duration-700 ${fading ? "opacity-0" : "opacity-100"}`}
        style={{
          backgroundImage: `url(${currentHero.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div
        className={`relative z-10 h-full flex items-center transition-opacity duration-700 ${fading ? "opacity-0" : "opacity-100"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {currentHero.title}
            </h1>
            <p className="text-xl md:text-2xl text-gaming-accent mb-4">
              {currentHero.subtitle}
            </p>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              {currentHero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={currentHero.primaryLink}>
                <Button
                  size="lg"
                  className="bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold px-8"
                >
                  {currentHero.primaryText}
                </Button>
              </Link>
              <a
                href="https://discord.gg/HXne8JVJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  Присоединиться к Discord
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => prevSlide(true)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gaming-accent transition-colors z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={() => nextSlide(true)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gaming-accent transition-colors z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index, true)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide
                ? "bg-gaming-accent"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
        <div
          ref={progressElRef}
          className="h-full bg-gaming-accent origin-left will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}

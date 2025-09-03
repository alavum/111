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
    backgroundImage:
      "https://cdn.builder.io/api/v1/image/assets%2F9371a00d52894c5d9ce9e006bf6e8168%2Ff64625e0db6c45739b3d2e8425431fd9?format=webp&width=800",
  },
  {
    id: 2,
    title: "Премиум доступ",
    subtitle: "Расширенные возможности",
    description: "Доступ к закрытым серверам и дополнительным функциям",
    background: "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900",
    backgroundImage:
      "https://cdn.builder.io/api/v1/image/assets%2F9371a00d52894c5d9ce9e006bf6e8168%2F6390ed05dfb544d4bd8202f17235a24e?format=webp&width=800",
  },
  {
    id: 3,
    title: "Командная игра",
    subtitle: "Тактические преимущества",
    description:
      "Инструменты для координации команды и страте��ического планирования",
    background: "bg-gradient-to-r from-green-900 via-green-800 to-green-900",
    backgroundImage:
      "https://cdn.builder.io/api/v1/image/assets%2F9371a00d52894c5d9ce9e006bf6e8168%2Fa87aeff2b2084864bb13e2d2853abd7a?format=webp&width=800",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1
  const [fading, setFading] = useState(false);
  const DURATION = 12000; // ms

  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(performance.now());
  const runningRef = useRef<boolean>(false);
  const advancingRef = useRef<boolean>(false);

  const resetTimer = () => {
    setProgress(0);
    startRef.current = performance.now();
  };

  const stopLoop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    runningRef.current = false;
  };

  const startLoop = () => {
    stopLoop();
    runningRef.current = true;
    startRef.current = performance.now();
    const tick = (now: number) => {
      if (!runningRef.current) return;
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / DURATION, 1);
      setProgress(p);
      if (p >= 1 && !advancingRef.current) {
        advancingRef.current = true;
        setFading(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
          setFading(false);
          startRef.current = performance.now();
          setProgress(0);
          advancingRef.current = false;
        }, 300);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const goToSlide = (index: number) => {
    setFading(true);
    stopLoop();
    setTimeout(() => {
      setCurrentSlide(index);
      setFading(false);
      resetTimer();
      startLoop();
    }, 250);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentHero = heroSlides[currentSlide];

  useEffect(() => {
    startLoop();
    return () => stopLoop();
  }, []);

  return (
    <section className="relative h-96 md:h-[500px] overflow-hidden">
      {/* Background with overlay */}
      <div
        className={`absolute inset-0 ${currentHero.background} transition-opacity duration-700 ${fading ? 'opacity-0' : 'opacity-100'}`}
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
      <div className={`relative z-10 h-full flex items-center transition-opacity duration-700 ${fading ? 'opacity-0' : 'opacity-100'}`}>
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
              <Link to="/vip">
                <Button
                  size="lg"
                  className="bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold px-8"
                >
                  Получить VIP
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
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gaming-accent transition-colors z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={nextSlide}
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
            onClick={() => goToSlide(index)}
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
          className="h-full bg-gaming-accent"
          style={{ width: `${progress * 100}%`, transition: 'width 80ms linear' }}
        />
      </div>
    </section>
  );
}

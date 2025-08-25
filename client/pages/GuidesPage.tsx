import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gaming-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gaming-text mb-6">
              Гайды и <span className="text-gaming-accent">обучение</span>
            </h1>
            <p className="text-lg text-gaming-text-muted mb-12">
              Обучающие материалы для игры на серверах RSGS
            </p>

            <div className="bg-gaming-bg border border-gaming-border rounded-lg p-12">
              <div className="w-16 h-16 mx-auto mb-6 bg-gaming-accent/20 rounded-full flex items-center justify-center">
                <Book className="w-8 h-8 text-gaming-accent" />
              </div>
              
              <h2 className="text-2xl font-bold text-gaming-text mb-4">
                <span className="text-gaming-accent">Совсем скоро</span>
              </h2>
              
              <p className="text-gaming-text-muted mb-8 max-w-md mx-auto">
                Мы работаем над созданием качественных гайдов. Следите за обновлениями!
              </p>

              <a
                href="https://discord.gg/HXne8JVJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-gaming-accent hover:bg-gaming-accent-hover text-black font-semibold">
                  Присоединиться �� Discord
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

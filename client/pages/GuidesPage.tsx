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

            <div className="bg-gaming-bg border border-gaming-border rounded-lg p-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-gaming-accent/20 rounded-full flex items-center justify-center">
                <Book className="w-8 h-8 text-gaming-accent" />
              </div>

              <h2 className="text-2xl font-bold text-gaming-text mb-4">
                Гайды
              </h2>

              <p className="text-gaming-text-muted mb-6 max-w-md mx-auto text-center">
                Здесь вы найдете обучающие материалы по ролям и механикам игры.
              </p>

              {/* Guides list */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <a href="/guides/mechvod" className="block bg-gaming-card border border-gaming-border rounded-lg overflow-hidden hover:bg-gaming-card-hover transition-colors">
                  <div className="w-full h-40 overflow-hidden">
                    <img src="/images/guides/mechvod-cover.svg" alt="Механик-водитель" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gaming-text mb-2">Механик-водитель (мехвод)</h3>
                    <p className="text-gaming-text-muted text-sm mb-3">Короткое описание роли мехвода и его обязанностей</p>
                    <div className="text-right">
                      <Button className="bg-gaming-accent hover:bg-gaming-accent-hover text-black">Открыть</Button>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

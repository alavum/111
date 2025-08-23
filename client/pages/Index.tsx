import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServerStatus from "@/components/ServerStatus";
import Statistics from "@/components/Statistics";
import News from "@/components/News";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />
      <main>
        <Hero />
        <ServerStatus />
        <Statistics />
        <News />
      </main>
      <Footer />
    </div>
  );
}

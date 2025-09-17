import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const GUIDE_CONTENT: any = {
  "mechvod": {
    title: "Механик-водитель (мехвод)",
    subtitle: "Специалист по управлению и обслуживанию боевой техники",
    image: "/images/guides/mechvod-cover.svg",
    content: `

Механик-водитель, или попросту мехвод — это специалист, который не только управляет военной техникой, но знает ее устройство и нахождение слабых мест доверенной ему техники. Механик-водитель должен уметь управлять техникой и понимать ее возможности, деятельность механика-водителя непосредственно связана с выполнением боевой задачи.

Механик-водитель должен хорошо водить танк в любых условиях (в колонне, в боевых порядках подразделения), умело преодолевать препятствия и заграждения, труднодоступные участки местности, выбирать наиболее оптимальные режимы и маршруты движения, выполнять указания командира танка. Он также должен вести наблюдение за полем боя появляющимися целями, докладывать о них командиру танка, обеспечивать наводчику орудия наилучшие условия для стрельбы и докладывать командиру по состоянию техники о ее здоровье и целостности модулей. Деятельность механика-водителя осуществляется на основе умений и навыков, приобретенных в процессе освоения управления подвижным объектом.


Пройдемся обозначениям для механик-водителя (слева направо):

- Состояние боекомплекта
- Состояние башни
- Положение техники относительно боковой проекции по горизонту
- Обороты двигателя
- Скорость техники
- Передача, которая в данный момент работает на технике
- Состояние здоровья
- Общее количество боеприпасов, которые нужны для пополнения на ремонтной зоне или мейне
- Ручник заблокирован или разблокирован
- Состояние техники по отношению к лобовой проекции (наклон относительно горизонта)
- Состояние двигателя
- Состояние гусениц или колес


`,
  },
};

export default function GuideDetailPage() {
  const { slug } = useParams();
  const guide = slug ? GUIDE_CONTENT[slug] : null;

  if (!guide) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-semibold text-gaming-text mb-4">Гайд не найден</h2>
          <p className="text-gaming-text-muted mb-6">Запрашиваемый гайд не существует.</p>
          <Link to="/guides">
            <Button className="bg-gaming-accent hover:bg-gaming-accent-hover text-black">Вернуться к гайдам</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-bg">
      <Header />

      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cover */}
          <div className="bg-gaming-card border border-gaming-border rounded-lg overflow-hidden mb-8">
            <div className="w-full h-64 md:h-96 overflow-hidden relative">
              <img src={guide.image} alt={guide.title} className="w-full h-full object-cover" />
              <div className="absolute left-6 top-6 px-3 py-1 bg-yellow-400 text-black font-bold rounded-sm">ТЕХНИКА</div>
            </div>
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gaming-text mb-2">{guide.title}</h1>
              <p className="text-gaming-text-muted mb-4">{guide.subtitle}</p>

              <div className="prose prose-lg prose-invert max-w-none">
                <p>{guide.content}</p>

                {/* Attached HUD image example */}
                <div className="my-6">
                  <img src="https://cdn.builder.io/api/v1/image/assets%2F9371a00d52894c5d9ce9e006bf6e8168%2F30013641a3a64a499bf61b74eac55ee3?format=webp&width=1200" alt="HUD example" className="w-full h-auto rounded-md border border-gaming-border" />
                </div>

                {/* Additional example image provided */}
                <div className="my-6">
                  <img src="https://cdn.builder.io/api/v1/image/assets%2F9371a00d52894c5d9ce9e006bf6e8168%2F0e02121ca26847449400f849474ba590?format=webp&width=1200" alt="Example" className="w-full h-auto rounded-md border border-gaming-border" />
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

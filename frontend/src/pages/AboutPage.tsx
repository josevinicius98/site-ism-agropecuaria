import React from 'react';
import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import TeamCarousel from '../components/TeamCarousel';
import { Award, Target, Lightbulb } from 'lucide-react';

// SobrePage refatorada para usar assets do public e eliminar imports quebrados
const AboutPage: React.FC = () => {
  return (
    // Wrapper full-width para que o Hero ocupe toda a tela
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <Hero
        topImage={{
          src: '/assets/logosemf.png',
          alt: 'Logo ISM Agropecuária',
          className: 'mx-auto w-24 h-auto mb-4',
        }}
        title="Sobre a ISM Agropecuária"
        subtitle="Conheça nossa história, valores e compromisso com a excelência agropecuária"
        backgroundClass="bg-[url('/assets/boiadasobrenos.jpeg')] h-screen bg-cover bg-center bg-no-repeat bg-black/40 bg-blend-darken"
      />

      {/* Nossa História */}
      <section id="historia" className="py-20 bg-white">
        <div className="container-custom max-w-6xl mx-auto px-4">
          <SectionTitle
            title="Nossa História"
            subtitle="Uma trajetória de dedicação ao agronegócio brasileiro"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 mb-4">
                A Família Silva Machado tem raízes centenárias em Frutal-MG. Há mais de 40
                anos, nossos fundadores consolidaram uma trajetória de valores, ética e inovação no
                agronegócio brasileiro.
              </p>
              <p className="text-gray-700 mb-4">
                Hoje, a ISM Agropecuária segue esse legado, trazendo tecnologia e sustentabilidade
                para cada etapa da produção e fortalecendo a cadeia produtiva local.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden shadow-md h-48">
                <img
                  src="/assets/diretores.jpeg"
                  alt="Diretores da ISM"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md h-48">
                <img
                  src="/assets/pecuaria4.jpeg"
                  alt="Pecuária ISM"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md h-48">
                <img
                  src="/assets/pecuaria3.jpeg"
                  alt="Agricultura ISM"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md h-48">
                <img
                  src="/assets/logosemf.png"
                  alt="Logomarca ISM"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-20 bg-neutral-light">
        <div className="container-custom max-w-6xl mx-auto px-4">
          <SectionTitle
            title="Missão, Visão e Valores"
            subtitle="Os princípios que norteiam nossa atuação"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target size={30} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Missão</h3>
              <p className="text-gray-700">Fomentar o agronegócio com qualidade, legado familiar e inovação sustentável.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Lightbulb size={30} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visão</h3>
              <p className="text-gray-700">Ser referência nacional em gestão familiar e tecnologia no campo.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award size={30} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Valores</h3>
              <ul className="mx-auto text-center text-gray-700 list-disc list-inside space-y-2">
                <li>União</li>
                <li>Honestidade</li>
                <li>Confiança</li>
                <li>Legado</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section id="gallery" className="py-20 bg-white">
        <div className="container-custom max-w-6xl mx-auto px-4">
          <SectionTitle
            title="Galeria"
            subtitle="Nossa equipe em ação"
            centered
          />
          <TeamCarousel />
        </div>
      </section>
    </div>
  );
};

export default AboutPage;


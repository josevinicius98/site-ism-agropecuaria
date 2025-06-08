//INICIO

// src/pages/HomePage.tsx

// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // ← hook para navegar
import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import ActivityCard from '../components/ActivityCard';
import { Leaf, BarChartHorizontal, RotateCw, Users, ShieldCheck } from 'lucide-react';
import { GiCow } from 'react-icons/gi';


const HomePage: React.FC = () => {
  const navigate = useNavigate(); // inicializa o navigate

  return (
    <div>
      {/* Hero Section: Banner inicial com CTA */}
       <Hero
        topImage={{
          src: '/assets/logosemf.png',       // Caminho corrigido
          alt: 'Logo ISM Agropecuária',
          className: 'mx-auto mb-4 w-24 h-auto',
        }}
        title="ISM Agropecuária"
        subtitle="Excelência na produção agropecuária com compromisso sustentável e inovação tecnológica"
        // Caminho corrigido para a imagem de fundo
        backgroundClass="bg-[url('/assets/boi_inicial2.jpeg')] bg-cover bg-center bg-no-repeat bg-black/40 bg-blend-darken"
        ctaText="Conheça Nossas Atividades"
        ctaAction={() => {
          document
            .getElementById('highlights')
            ?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Highlights Section: Principais áreas de atuação */}
      <section id="highlights" className="py-20 bg-white">
        <div className="container-custom">
          <SectionTitle
            title="Nossa Excelência"
            subtitle="Conheça nossas principais áreas de atuação e o que nos destaca no mercado agropecuário."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <ActivityCard
              icon={<GiCow size={40} />}
              title="Pecuária"
              description="Especialistas na criação de gado com foco em qualidade, manejo sustentável e bem-estar animal."
            />
            <ActivityCard
              icon={<Leaf size={40} />}
              title="Agricultura"
              description="Cultivo sustentável de soja, cana, sorgo, milho e milheto com alta produtividade e respeito ao meio ambiente."
            />
            <ActivityCard
              icon={<BarChartHorizontal size={40} />}
              title="Gestão Eficiente"
              description="Implementação de técnicas modernas de gestão e tecnologia para maximizar resultados e reduzir impactos."
            />
            <ActivityCard
              icon={<RotateCw size={40} />}
              title="Sustentabilidade"
              description="Processos que respeitam o meio ambiente, utilizando práticas agrícolas que preservam o solo e os recursos naturais."
            />
            <ActivityCard
              icon={<Users size={40} />}
              title="Equipe Qualificada"
              description="Profissionais especializados e comprometidos com a produção agropecuária de excelência."
            />
            <ActivityCard
              icon={<ShieldCheck size={40} />}
              title="Qualidade Garantida"
              description="Produtos com rigoroso controle de qualidade, atendendo aos mais elevados padrões do mercado."
            />
          </div>
        </div>
      </section>

      {/* About Preview: Seção de introdução sobre tradição e inovação */}
      <section className="py-20 bg-primary text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle
                title="Tradição e Inovação"
                subtitle="Nossa história se baseia em respeito às tradições do campo aliado à inovação tecnológica."
                light
              />
              <p className="text-neutral-light mb-6">
                A ISM Agropecuária é referência no setor agropecuário, combinando tradição e inovação...
              </p>
              <p className="text-neutral-light mb-8">
                Com uma gestão moderna e práticas sustentáveis, garantimos alta produtividade...
              </p>
              {/* Botão redireciona para AboutPage e rola ao topo */}
              <button
                className="btn-secondary"
                onClick={() => {
                  navigate('/about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Conheça Nossa História
              </button>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-xl h-[400px]">
              <img
                src="/assets/boihomepage.jpeg"
                alt="Gado ISM Agropecuária"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary bg-opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* Agriculture Section: Detalhes da agricultura de precisão */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative rounded-lg overflow-hidden shadow-xl h-[400px]">
              <img
                src="/assets/sojahomepage.jpeg"
                alt="Plantação ISM Agropecuária"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary bg-opacity-20" />
            </div>
            <div className="order-1 lg:order-2">
              <SectionTitle
                title="Agricultura de Precisão"
                subtitle="Cultivamos o futuro com tecnologia e respeito ao meio ambiente."
              />
              <p className="text-accent mb-6">
                Nossa produção agrícola abrange culturas como soja, cana-de-açúcar, sorgo, milho e milheto...
              </p>
              <p className="text-accent mb-8">
                Utilizamos sistemas integrados de manejo que otimizam o uso de recursos naturais...
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  navigate('/activities');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Explore Nossas Culturas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section: Chamada para ação final */}
      <section className="py-16 bg-secondary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
            Pronto para conhecer mais sobre a ISM Agropecuária?
          </h2>
          <p className="text-lg text-primary-dark max-w-3xl mx-auto mb-8">
            Entre em contato com nossa equipe e descubra como podemos ser parceiros no desenvolvimento do agronegócio brasileiro.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Botões direcionam para ContactPage e rolam ao topo */}
            <button
              className="btn-primary"
              onClick={() => {
                navigate('/contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Fale Conosco
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                navigate('/contact');
                document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
            }}
            >
              Trabalhe Conosco
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

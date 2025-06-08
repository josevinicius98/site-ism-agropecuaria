//SOBRE NÓS

// Importa a biblioteca React e os componentes reutilizáveis
import React from 'react';
import Hero from '../components/Hero'; // Componente para o banner principal
import SectionTitle from '../components/SectionTitle'; // Componente de título de seção
import { Award, Target, Lightbulb } from 'lucide-react'; // Ícones utilizados nas seções
import TeamCarousel from '../components/TeamCarousel';

// Define o componente funcional AboutPage
const AboutPage: React.FC = () => {
  return (
    <div>
      {/* Seção de destaque da página (hero/banner) */}
      <Hero
        topImage={{
          src: '../src/assets/logosemf.png',       // coloque sua imagem em public/assets/
          alt: 'Logo ISM Agropecuária',
          className: 'mx-auto mb-4 w-24 h-auto',
        }}
        title="Sobre a ISM Agropecuária"
        subtitle="Conheça nossa história, valores e compromisso com a excelência agropecuária"
        backgroundClass="bg-[url('/assets/boiadasobrenos.jpeg')] bg-cover bg-center bg-no-repeat bg-black/40 bg-blend-darken"
      />

      {/* Seção: Nossa História */}
      <section id="historia" className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto da história da empresa */}
            <div>
              <SectionTitle
                title="Nossa História"
                subtitle="Uma trajetória de dedicação ao agronegócio brasileiro"
              />
              <p className="text-accent mb-4">
              A Família Silva Machado foi constituída há mais de 40 anos, porem a história de seus patriarcas é centenária. Formada por figuras inspiradoras que foram responsáveis pelo desenvolvimento de nossa região, estando eternizadas na história de Frutal-MG através de seus legados construídos por elos de confiança e lealdade com valores morais, éticos e afetivos por meio do surgimento da família Silva Machado. 
              Composta pelos saudosos: Dolmiro José da Silva e Anizia Silva Ribeiro (Luzia) e sua amada filha Gonia Maria da Silva, 
              se tornando Machado através de seu casamento com Aldiberto Dias Machado, filho querido de Balduino Antonio Machado e 
              Clotildes Machado Dias (Doca). Com o patrimônio crescendo e com muito trabalho, a Família pôde contribuir com o desenvolvimento 
              econômico no setor agropecuário do município de Frutal- MG e região. Esse legado, foi a base para estruturar hoje a então ISM Agropecuária. 
              Uma empresa que busca manter os mesmos valores, acompanhando a inovação do setor, objetivando desenvolvimento, com respeito aos colaboradores, pautados no profissionalismo 
              técnico com embasamento científico e legal, produzindo de forma sustentável e em equilíbrio com o meio ambiente, sociedade e economia se tornando referência no setor.
              </p>
              <p className="text-accent mb-4">
                Iniciamos nossas atividades com foco na pecuária e hoje atuamos em diversas áreas do agronegócio.
              </p>
              <p className="text-accent">
                Hoje, somos referência no setor, com uma operação integrada.
              </p>
            </div>

            {/* Galeria de imagens sobre a história */}
            <div className="grid grid-cols-2 gap-4">
              {/* Cada imagem representa uma etapa ou aspecto da empresa */}
              <div className="rounded-lg overflow-hidden shadow-md h-48 md:h-64">
                <img 
                  src='/assets/diretores.jpeg' 
                  alt="História da ISM" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md h-48 md:h-64">
                <img 
                  src='/assets/pecuaria4.jpeg'
                  alt="Fazenda ISM" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md h-48 md:h-64">
                <img 
                  src='/assets/pecuaria3.jpeg' 
                  alt="Agricultura ISM" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md h-48 md:h-64">
                <img 
                  src='/assets/pecuaria2.jpeg' 
                  alt="Tecnologia ISM" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Missão, Visão e Valores */}
      <section className="py-20 bg-neutral-light">
        <div className="container-custom">
          <SectionTitle
            title="Missão, Visão e Valores"
            subtitle="Os princípios que norteiam nossa atuação no mercado"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Bloco: Missão */}
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
                <Target size={30} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Missão</h3>
              <p className="text-accent">
                Produzir o desenvolvimento do agronegócio através do legado familiar, gerando alimentos de qualidade
                e fomentando a cadeia produtiva
              </p>
            </div>

            {/* Bloco: Visão */}
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
                <Lightbulb size={30} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Visão</h3>
              <p className="text-accent">
                Ser referência no agronegócio brasileiro através da gestão familiar, trabalhar com eficiência, desenvolvimento
                e tecnologia
              </p>
            </div>

            {/* Bloco: Valores */}
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
                <Award size={30} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Valores</h3>
              <ul className="text-accent text-left space-y-2">
                <li>• União</li>
                <li>• Honestidade</li>
                <li>• Confiança</li>
                <li>• Legado</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Galeria */}
      <section id="gallery" className="py-20 bg-white">
        <div className="container-custom">
          <SectionTitle
            title="Galeria"
            subtitle="Nossa galeria de fotos"
            centered
          />
          <TeamCarousel /> {/* Componente de carrossel com fotos da equipe */}
        </div>
      </section>
    </div>
  );
};

// Exporta o componente para ser utilizado em outras partes do site
export default AboutPage;

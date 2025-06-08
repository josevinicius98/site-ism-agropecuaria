//ATIVIDADES

import React from 'react'; // Importa React para usar JSX e componentes
import Hero from '../components/Hero'; // Componente de banner principal
import SectionTitle from '../components/SectionTitle'; // Componente de título de seção
import ImageGallery from '../components/ImageGallery'; // Componente de galeria de imagens reutilizável
import { User, Sprout, Wheat, Thermometer, Package} from 'lucide-react'; // Ícones da biblioteca lucide-react
import { cowHead, } from '@lucide/lab'; //icones 
import { GiSugarCane, GiCorn, GiCow} from 'react-icons/gi';//icones
import { FaFirstAid } from 'react-icons/fa';

const ActivitiesPage: React.FC = () => {
  // Define as imagens para a galeria de pecuária (livestock)
  const livestockImages = [
    {
      src: '/assets/02.jpeg', // URL da imagem
      alt: "Gado nelore", // Texto alternativo para acessibilidade
      caption: "Gado de corte de alta qualidade" // Legenda da imagem
    },
    {
      src: '/assets/pec2.jpeg',
      alt: "Curral de manejo",
      caption: "Estrutura para manejo do rebanho"
    },
    {
      src: '/assets/01.jpeg',
      alt: "Nutrição animal",
      caption: "Suplementação alimentar"
    },
  ];

  // Define as imagens para a galeria de agricultura (agriculture)
  const agricultureImages = [
    {
      src: "/assets/agr4.jpeg",
      alt: "Plantação de soja",
      caption: "Cultivo com alta produtividade"
    },
    {
      src: "/assets/agr6.jpeg",
      alt: "Plantação de milho",
      caption: "Uso de tecnologia e maquinário durante todo o processo"
    },
    {
      src: "/assets/cana_agricultura.jpeg",
      alt: "Colheita de cana",
      caption: "Colheita mecanizada de cana-de-açúcar"
    },
  ];

  return (
    <div>
      {/* Seção principal com título e subtítulo */}
      <Hero
        topImage={{
          src: '/assets/logosemf.png',       // coloque sua imagem em public/assets/
          alt: 'Logo ISM Agropecuária',
          className: 'mx-auto mb-4 w-24 h-auto',
        }}
        title="Nossas Atividades" // Título da seção hero
        subtitle="Conheça em detalhes as áreas de atuação da ISM Agropecuária" // Subtítulo explicativo
        backgroundClass="bg-[url('../src/assets/sojahomepage.jpeg')]   bg-cover bg-center bg-no-repeat bg-black/40 bg-blend-darken" // Classe de fundo para estilização
      />

      {/* Seção de Pecuária */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          {/* Título e subtítulo da seção de Pecuária */}
          <SectionTitle
            title="Pecuária"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Texto descritivo sobre Pecuária */}
            <div>
              <p className="text-accent mb-6">
                Excelência na criação de gado de corte com foco em qualidade e bem-estar animal
Na ISM Agropecuária, criamos gado de corte com disciplina científica e paixão pelo resultado. Cada animal cresce em pastagens manejadas, recebe nutrição de precisão e é monitorado digitalmente — garantindo carne mais macia, sabor superior e padrões sanitários que superam as exigências do mercado.

Nossa principal área de atuação é a pecuária
É nela que aplicamos nossa força de inovação. Utilizamos tecnologias de rastreabilidade por RFID, análises de dados de desempenho individual e protocolos de sanidade preventiva. Assim, transformamos cada etapa — da seleção genética ao embarque — em um processo mensurável, transparente e escalável.

Contamos com uma equipe especializada
Nosso time reúne zootecnistas, veterinários e engenheiros agrônomos, todos focados no bem-estar animal e na otimização produtiva. Eles trabalham lado a lado, analisando resultados em tempo real e ajustando dietas, sanidade e manejo constantemente. O compromisso é simples: gado saudável produz carne de excelência.
              </p>
              <p className="text-accent mb-6">
                
              </p>
              <p className="text-accent">
                
              </p>
            </div>
            {/* Galeria de imagens em grid para Pecuária */}
            <div className="grid grid-cols-2 gap-4">
              {/* Imagem de destaque ocupando duas colunas */}
              <div className="col-span-2 rounded-lg overflow-hidden shadow-md h-48 md:h-64">
                <img
                  src="/assets/pec1.jpeg"
                  alt="Pecuária ISM"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Outras imagens menores */}
              <div className="rounded-lg overflow-hidden shadow-md">
                <img
                  src="/assets/03.jpeg"
                  alt="Gado em pastagem"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <img
                  src="/assets/pec3.jpeg"
                  alt="Manejo de gado"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Cards de destaque de serviços na Pecuária */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-neutral-light rounded-lg p-6 flex flex-col items-center text-center">
              <GiCow size={40} className="text-primary mb-4" /> {/* Ícone de vaca */}
              <h3 className="text-xl font-semibold mb-2">Saúde animal</h3>
              <p className="text-accent">Peucupação e cuidado com a saúde animal.</p>
            </div>
            <div className="bg-neutral-light rounded-lg p-6 flex flex-col items-center text-center">
              <Package size={40} className="text-primary mb-4" /> {/* Ícone de caixa */}
              <h3 className="text-xl font-semibold mb-2">Nutrição Balanceada</h3>
              <p className="text-accent">Dietas personalizadas por fase de crescimento.</p>
            </div>
            <div className="bg-neutral-light rounded-lg p-6 flex flex-col items-center text-center">
              <Thermometer size={40} className="text-primary mb-4" /> {/* Ícone de termômetro */}
              <h3 className="text-xl font-semibold mb-2">Sanidade Rigorosa</h3>
              <p className="text-accent">Monitoramento e controle sanitário contínuo.</p>
            </div>
            <div className="bg-neutral-light rounded-lg p-6 flex flex-col items-center text-center">
              <FaFirstAid size={40} className="text-primary mb-4" /> {/* Ícone de  saúde*/}
              <h3 className="text-xl font-semibold mb-2">Manejo Humanitário</h3>
              <p className="text-accent">Práticas que priorizam o bem-estar animal.</p>
            </div>
          </div>

          {/* Insere o componente de galeria com as imagens de Pecuária */}
          <ImageGallery images={livestockImages} />
        </div>
      </section>

      {/* Seção de Agricultura */}
      <section className="py-20 bg-neutral-light">
        <div className="container-custom">
          {/* Título e subtítulo da seção de Agricultura */}
          <SectionTitle
            title="Agricultura"
            subtitle="Cultivo sustentável com tecnologia de ponta."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Galeria de imagens em grid (ordem invertida em large screens) */}
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              <div className="col-span-2 rounded-lg overflow-hidden shadow-md h-48 md:h-64">
                <img
                  src="/assets/agr1.jpeg"
                  alt="Agricultura ISM"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <img
                  src="/assets/agr2.jpeg"
                  alt="Plantação"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <img
                  src="/assets/agr3.jpeg"
                  alt="Colheita"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Texto descritivo sobre Agricultura */}
            <div className="order-1 lg:order-2">
              <p className="text-accent mb-6">
                
              </p>
              <p className="text-accent mb-6">
                Cultivo de culturas com produtividade e sustentabilidade
Nossa agricultura se destaca pelo cultivo de cana-de-açúcar, soja, sorgo, milho e milheto, escolhidos pela sua adaptabilidade e rendimento. Cada hectare é planejado para extrair o máximo de produtividade sem esgotar o solo, garantindo safras robustas e de qualidade consistente.

Tecnologia a serviço da eficiência
Investimos em sensores de umidade, drones para monitoramento e softwares de agricultura de precisão. Com isso, aplicamos água, fertilizantes e defensivos apenas onde e quando necessário, reduzindo custos, preservando recursos hídricos e minimizando o impacto ambiental.

Sistema integrado e rotação inteligente
Nosso sistema integrado permite alternar culturas de forma estratégica — milheto e sorgo preparam o solo para a soja, que por sua vez deixa terreno ideal para a cana. Essa rotação otimiza a fertilidade natural, controla pragas sem químicos excessivos e mantém a produtividade elevada ao longo dos anos.
              </p>
              <p className="text-accent">
                .
              </p>
            </div>
          </div>

          {/* Cards de culturas e ícones representativos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center">
              <Wheat size={36} className="text-primary mb-4" /> {/* Ícone de folha */}
              <h3 className="text-lg font-semibold mb-2">Soja</h3>
              <p className="text-accent text-sm">Variedades adaptadas para alta produtividade.</p>
            </div>
            <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center">
              <GiSugarCane size={36} className="text-primary mb-4" /> {/* Ícone de broto */}
              <h3 className="text-lg font-semibold mb-2">Cana</h3>
              <p className="text-accent text-sm">Cultivo mecanizado eficiente.</p>
            </div>
            <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center">
              <Wheat size={36} className="text-primary mb-4" /> {/* Ícone de trigo */}
              <h3 className="text-lg font-semibold mb-2">Sorgo</h3>
              <p className="text-accent text-sm">Resistente e versátil.</p>
            </div>
            <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center">
              <GiCorn size={36} className="text-primary mb-4" /> {/* Ícone de milho */}
              <h3 className="text-lg font-semibold mb-2">Milho</h3>
              <p className="text-accent text-sm">Híbridos de alta performance.</p>
            </div>
            <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center">
              <Sprout size={36} className="text-primary mb-4" /> {/* Ícone de trigo usado como substituto */}
              <h3 className="text-lg font-semibold mb-2">Milheto</h3>
              <p className="text-accent text-sm">Cobertura de solo e rotação.</p>
            </div>
          </div>

          {/* Insere galeria com imagens de Agricultura */}
          <ImageGallery images={agricultureImages} />
        </div>
      </section>

      {/* Seção de Sustentabilidade */}
      <section className="py-20 bg-primary text-white">
        <div className="container-custom">
          {/* Título, subtítulo e modo claro para texto */}
          <SectionTitle
            title="Compromisso com a Sustentabilidade"
            subtitle="Nossas práticas para um agronegócio ambientalmente responsável"
            light // Usa estilo de texto claro
            centered // Centraliza o título
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-12">
            <div>
              <p className="text-neutral-light mb-6">
                Na ISM Agropecuária, acreditamos que produtividade...
              </p>
              <ul className="space-y-4 text-neutral-light">
                {/* Lista de práticas sustentáveis com ícone personalizado */}
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-primary mr-3 flex-shrink-0 mt-1">✓</span>
                  <span>Sistema de plantio direto</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-primary mr-3 flex-shrink-0 mt-1">✓</span>
                  <span>Rotação de culturas</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-primary mr-3 flex-shrink-0 mt-1">✓</span>
                  <span>Manejo integrado de pragas</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-primary mr-3 flex-shrink-0 mt-1">✓</span>
                  <span>Uso racional da água</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-primary mr-3 flex-shrink-0 mt-1">✓</span>
                  <span>Preservação de áreas verdes</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-primary mr-3 flex-shrink-0 mt-1">✓</span>
                  <span>Tratamento de resíduos</span>
                </li>
              </ul>
            </div>
            {/* Grid de imagens ilustrativas SUSTENTABILIDADE*/}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/assets/agr2.jpeg"
                  alt="Sustentabilidade"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/assets/s2.jpeg"
                  alt="Práticas sustentáveis"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/assets/s3.jpg"
                  alt="Tecnologia no campo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/assets/s4.jpg"
                  alt="Monitoramento"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActivitiesPage; // Exporta o componente para uso no aplicativo
import React from 'react';
// Importa a biblioteca React para criar o componente

interface HeroProps {
  topImage?: {                  // Nova prop opcional para imagem acima do título
    src: string;
    alt: string;
    className?: string;
  };
  title: string | React.ReactNode; // Aceita string ou JSX (ReactNode) para maior flexibilidade
  subtitle: string;             // Subtítulo logo abaixo do título
  backgroundClass: string;      // Classe CSS com imagem ou cor de fundo
  ctaText?: string;             // Texto do botão de chamada para ação (opcional)
  ctaAction?: () => void;       // Função executada ao clicar no botão (opcional)
}
// Define os tipos esperados como props do componente, incluindo topImage e ReactNode

const Hero: React.FC<HeroProps> = ({
  topImage,
  title,
  subtitle,
  backgroundClass,
  ctaText,
  ctaAction,
}) => {
  return (
    <section
      className={`relative min-h-screen flex items-center justify-center ${backgroundClass} bg-cover bg-center bg-no-repeat`}
    >
      {/* Sessão principal do Hero: ocupa altura total da tela, centraliza conteúdo, usa imagem ou cor de fundo */}

      <div className="container-custom text-center py-20">
        {/* Container centralizado com padding vertical */}

        <div className="max-w-4xl mx-auto animate-fade-up">
          {/* Bloco de conteúdo com largura máxima e animação de entrada */}

          {/* Se topImage for passado, renderiza antes do título */}
          {topImage && (
            <img
              src={topImage.src}
              alt={topImage.alt}
              className={`mx-auto mb-6 ${topImage.className || ''}`}
            />
          )}

          {typeof title === 'string' ? (
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              {title}
            </h1>
          ) : (
            title
          )}
          {/* Título principal com responsividade e destaque visual; renderiza JSX diretamente se precisar */}

          <p className="text-lg sm:text-xl md:text-2xl text-neutral-light mb-10 max-w-3xl mx-auto">
            {subtitle}
          </p>
          {/* Subtítulo com responsividade e cor neutra */}

          {ctaText && ctaAction && (
            <button
              onClick={ctaAction}
              className="btn-primary text-lg"
            >
              {ctaText}
            </button>
          )}
          {/* Botão de chamada para ação, só aparece se texto e função forem passados */}
        </div>
      </div>

      {/* Indicador de rolagem (scroll) no rodapé do Hero */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-white text-sm mb-2">Conheça mais</span>
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
// Exporta o componente para ser usado em outras partes do sistema

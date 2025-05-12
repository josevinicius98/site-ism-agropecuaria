import React from 'react';
// Importa a biblioteca React

interface SectionTitleProps {
  title: string;              // Título principal (obrigatório)
  subtitle?: string;          // Subtítulo opcional
  centered?: boolean;         // Alinha o texto ao centro se true
  light?: boolean;            // Usa cores claras (para fundos escuros) se true
}
// Define os tipos das propriedades que o componente pode receber

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  centered = false,  // valor padrão: falso
  light = false,     // valor padrão: falso
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {/* Container com margem inferior. Centraliza o texto se `centered` for true */}

      <h2 className={`section-title ${light ? 'text-white' : 'text-primary'} ${centered ? 'after:mx-auto' : ''}`}>
        {title}
      </h2>
      {/* Título com estilo condicional: cor branca para fundo escuro, primária para fundo claro.
          Se centralizado, centraliza também o traço decorativo (supondo uso de ::after no CSS) */}

      {subtitle && (
        <p className={`mt-4 text-lg ${light ? 'text-neutral-light' : 'text-accent'}`}>
          {subtitle}
        </p>
      )}
      {/* Subtítulo aparece apenas se for passado, com cor ajustada conforme o fundo */}
    </div>
  );
};

export default SectionTitle;
// Exporta o componente para uso em outras seções

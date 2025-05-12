import React from 'react';
// Importa a biblioteca React, necessária para criar componentes em JSX/TSX

interface ActivityCardProps {
  icon: React.ReactNode;     // Propriedade esperada: um ícone ou qualquer outro elemento React
  title: string;             // Propriedade esperada: o título da atividade (texto)
  description: string;       // Propriedade esperada: a descrição da atividade (texto)
}
// Define a interface para o tipo das props que o componente ActivityCard vai receber

const ActivityCard: React.FC<ActivityCardProps> = ({ icon, title, description }) => {
  // Define o componente funcional ActivityCard com tipagem baseada na interface acima
  return (
    <div className="card p-6 h-full hover:translate-y-[-5px]">
      {/* Container do card com padding, altura total e efeito de elevação no hover */}
      
      <div className="text-secondary mb-4">{icon}</div>
      {/* Exibe o ícone passado via props, com margem inferior e cor secundária */}

      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {/* Exibe o título da atividade com estilo de título (tamanho e peso da fonte) */}

      <p className="text-accent">{description}</p>
      {/* Exibe a descrição com cor de texto diferenciada */}
    </div>
  );
};

export default ActivityCard;
// Exporta o componente para ser utilizado em outros arquivos

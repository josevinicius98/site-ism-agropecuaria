// src/pages/Links.tsx
import React from 'react';
import { DollarSign, Car, Leaf, BarChart, Truck as TruckIcon, CheckSquare  } from 'lucide-react';


interface LinkButton {
  name: string;      // Texto exibido no botão
  url: string;       // URL para abrir em nova aba
  icon: React.ReactNode; // Ícone exibido antes do texto
}

const linkButtons: LinkButton[] = [
  {
    name: 'Financeiro', // Link para dashboard financeiro
    url: 'https://app.powerbi.com/groups/me/apps/ca331862-4442-4a08-8636-2ec3aa5c7822/reports/95453353-a776-4abb-bbc3-2f46ae0590f0/ReportSection484dcc406711eeb9a09f?experience=power-bi',
    icon: <DollarSign size={20} />,
  },
  {
    name: 'Frotas', // Link para dashboard de frota
    url: 'https://app.powerbi.com/groups/me/apps/a9de2b3f-3a97-4497-a01a-9f5082a484c7/reports/51a3ec79-04fb-43e8-8aae-080225d66a51/6d6fdd5ce67baf64b941?ctid=aa6e2e9e-1a1a-4eac-b484-76b2a98e4795&experience=power-bi',
    icon: <Car size={20} />,
  },
  {
    name: 'Agrícola', // Link para dashboard de produção agrícola
    url: 'https://app.powerbi.com/groups/me/apps/a9de2b3f-3a97-4497-a01a-9f5082a484c7/reports/7b8958e5-a8c5-497a-af09-7fee07ac3cac/65e8d1df0b0a7eb3e51e?ctid=aa6e2e9e-1a1a-4eac-b484-76b2a98e4795&experience=power-bi',
    icon: <Leaf size={20} />,
  },
  {
    name: 'Orçado X Realizado', // Link para dashboard de orçamento
    url: 'https://app.powerbi.com/groups/me/apps/a9de2b3f-3a97-4497-a01a-9f5082a484c7/reports/70454850-7bd2-4005-95fc-3508b5fd5559/0db9adccd79603d4e4c7?experience=power-bi',
    icon: <BarChart size={20} />,
  },
  {
    name: 'Transportadora', // Link para dashboard de transportadora
    url: 'https://app.powerbi.com/groups/me/apps/406b4a40-2f5f-4a88-968a-c7a9bde26cbf/reports/c6f2e082-9ae7-4ae1-a5f9-ce3f9145d502/ReportSection935ce63adf3c3cfe180d?experience=power-bi',
    icon: <TruckIcon size={20} />,
  },
   {
    name: 'Checklist', // Link para dashboard de lchecklist
    url: 'https://app.powerbi.com/groups/me/apps/a9de2b3f-3a97-4497-a01a-9f5082a484c7/reports/2c73dc53-0f7b-4270-9891-289ae7da539d/95a2613d943e6a7e2e8c?experience=power-bi',
    icon: <CheckSquare size={20} />,
  },
];

const Links: React.FC = () => {
  return (
    <div className="container-custom py-20 text-center">
      {/* Logo da ISM centralizada acima do título */}
      <img
        src="../src/assets/logosemf.png"  // Caminho para a logo da ISM
        alt="Logo ISM Agropecuária"
        className="mx-auto mb-6 h-20"  // Centraliza e define altura da imagem
      />

      {/* Título da página de links */}
      <h1 className="text-3xl font-bold mb-8">Dashboards ISM</h1>

      {/* Grade de botões centralizados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {linkButtons.map(button => (
          <button
            key={button.name} // Chave única para cada botão
            onClick={() => window.open(button.url, '_blank')} // Abre o link em nova aba
            className="btn-outline flex items-center justify-center space-x-2 w-52 h-14"
          >
            {button.icon}   {/* Ícone do dashboard */}
            <span>{button.name}</span> {/* Texto do botão */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Links; // Exporta o componente para uso nas rotas

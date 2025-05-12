// src/pages/Portal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Portal: React.FC = () => {
  const nav = useNavigate();

  return (                                        // Inicia o JSX que será renderizado pelo componente
    <div className="container-custom py-20 text-center"> {/* Container centralizado com padding vertical e texto alinhado ao centro */}
      <h1 className="text-4xl font-bold mb-6">    {/* Título principal com tamanho grande, negrito e margem inferior */}
        Portal de Dashboards
      </h1>
      <p className="mb-8">                        {/* Parágrafo com margem inferior para espaçamento */}
        Clique abaixo para acessar nossos relatórios
      </p>
      <button                                   // Botão que dispara a navegação ao ser clicado //
        onClick={() => nav('/login')}            // Ao clicar, navega para a rota “/login”
        className="btn-primary px-8 py-3 text-lg"// Classes Tailwind para estilo de botão primário, padding e tamanho de texto
      >
        Acessar                                 {/* Texto exibido dentro do botão */}
      </button>
      </div>
  );
};

export default Portal;

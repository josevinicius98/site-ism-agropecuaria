// src/main.tsx
import React, { StrictMode } from 'react';             // Importa React e StrictMode para identificar problemas em desenvolvimento
import { createRoot } from 'react-dom/client';           // API de criação do root no React 18+
import { BrowserRouter } from 'react-router-dom';        // Provedor de roteamento para SPA
import App from './App';                                 // Importa o componente principal da aplicação
import './index.css';                                    // Importa estilos globais

const container = document.getElementById('root')!;      // Seleciona o elemento HTML com id "root"
const root = createRoot(container);                      // Cria o root React dentro desse container

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
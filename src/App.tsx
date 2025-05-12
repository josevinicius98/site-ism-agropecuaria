// src/App.tsx
import React, { useState, useEffect } from 'react';          // Importa React e hooks para estado e efeitos
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'; // Importa componentes de rota e hooks de navegação
import Header from './components/Header';                       // Importa o cabeçalho global
import Footer from './components/Footer';                       // Importa o rodapé global
import HomePage from './pages/HomePage';                        // Importa a página inicial
import AboutPage from './pages/AboutPage';                      // Importa a página "Sobre"
import ActivitiesPage from './pages/ActivitiesPage';            // Importa a página de atividades
import ContactPage from './pages/ContactPage';                  // Importa a página de contato
import Portal from './pages/Portal';                            // Importa a página "Painel"
import LoginPage from './pages/LoginPage';                      // Importa a página de login
import Links from './pages/Links';                              // Importa a página de links (dashboards)

const App: React.FC = () => {                                   // Define o componente principal da aplicação
  const location = useLocation();                              // Hook que fornece o caminho atual da URL
  const navigate = useNavigate();                              // Hook usado para navegar programaticamente
  const [scrolled, setScrolled] = useState(false);             // Estado que indica se houve scroll vertical

  useEffect(() => {                                            // Efeito que adiciona listener de scroll
    const onScroll = () => {
      const isScrolled = window.scrollY > 10;                 // Verifica se rolou mais de 10px
      if (isScrolled !== scrolled) setScrolled(isScrolled);   // Atualiza estado apenas se mudou
    };
    document.addEventListener('scroll', onScroll);             // Registra o listener
    return () => document.removeEventListener('scroll', onScroll); // Remove listener ao desmontar
  }, [scrolled]);                                              // Reexecuta quando `scrolled` mudar

  // Determina o valor de currentPage com base na URL ("/" => 'home')
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1);
  // Função para atualizar a rota e o estado de página atual
  const setCurrentPage = (page: string) => navigate(page === 'home' ? '/' : `/${page}`);

  return (
    <div className="min-h-screen flex flex-col">            {/* Container flex vertical ocupando toda a altura */}
      <Header                                            
        currentPage={currentPage}                             // Passa página atual ao Header
        setCurrentPage={setCurrentPage}                       // Passa setter de página ao Header
        scrolled={scrolled}                                   // Passa estado de scroll ao Header
      />
      <main className="flex-grow">                         {/* Área principal que cresce para preencher o espaço */}
        <Routes>                                            {/* Define as rotas da aplicação */}
          <Route path="/" element={<HomePage />} />         {/* Rota da HomePage */}
          <Route path="/about" element={<AboutPage />} />   {/* Rota da AboutPage */}
          <Route path="/activities" element={<ActivitiesPage />} /> {/* Rota de Atividades */}
          <Route path="/contact" element={<ContactPage />} /> {/* Rota de Contato */}
          <Route path="/portal" element={<Portal />} />     {/* Rota do Portal */}
          <Route path="/login" element={<LoginPage />} />   {/* Rota de Login */}
          <Route path="/links" element={<Links />} />       {/* Rota de Links */}
        </Routes>
      </main>
      <div id="footer">                                     {/* Container para o Footer */}
        <Footer setCurrentPage={setCurrentPage} />           {/* Renderiza o Footer passando setter */}
      </div>
    </div>
  );
};

export default App;                                         // Exporta o App como componente root

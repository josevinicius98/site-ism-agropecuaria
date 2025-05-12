// src/components/Header.tsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage: string;                   // Página atual selecionada
  setCurrentPage: (page: string) => void; // Função para alterar a página
  scrolled: boolean;                    // Indica se a página foi rolada (para mudar o estilo do header)
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, scrolled }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Adiciona 'Painel' ao menu
  const navItems = [
    { label: 'Início', value: 'home' },
    { label: 'Sobre Nós', value: 'about' },
    { label: 'Galeria', value: 'gallery' },
    { label: 'Atividades', value: 'activities' },
    { label: 'Contato', value: 'contact' },
    { label: 'Portal', value: 'portal' },
  ];

  const handleNavClick = (page: string) => {
    setMenuOpen(false);             // Fecha o menu móvel se estiver aberto
    if (page === 'gallery') {
      setCurrentPage('about');      // Galeria vive dentro de AboutPage
      window.scrollTo(0, 0);
      setTimeout(() => {
        const section = document.getElementById('gallery');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (page === 'portal') {
      setCurrentPage('portal');     // Navega para Portal
      window.scrollTo(0, 0);
    } else {
      setCurrentPage(page);         // Navega nas demais rotas
      window.scrollTo(0, 0);
    }
  };

  // Header fica azul escuro em Portal, Login, Links ou se rolado
  const forceBlue = ['portal', 'login', 'links'].includes(currentPage) || scrolled || currentPage === 'about';

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        forceBlue ? 'bg-[#070735] shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      {/* Container interno com logo e nav */}
      <div className="container-custom flex justify-between items-center">
        {/* Logo: volta para home */}
        <div className="cursor-pointer flex items-center" onClick={() => handleNavClick('home')}>
          <img src="../src/assets/logosemf.png" alt="ISM Agropecuária" className="h-12 sm:h-14 mr-2" />
          <span className="hidden md:block text-white font-display text-xl">
            ISM <span className="text-secondary">Agropecuária</span>
          </span>
        </div>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map(item => (
            <span
              key={item.value}
              onClick={() => handleNavClick(item.value)}
              className={`nav-link cursor-pointer ${
                currentPage === item.value ||
                (item.value === 'gallery' && currentPage === 'about')
                  ? 'active-nav-link'
                  : ''
              }`}
            >
              {item.label}
            </span>
          ))}
        </nav>

        {/* Botão mobile */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navegação Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-[#070735] animate-fade-in">
          <nav className="container-custom py-4 flex flex-col">
            {navItems.map(item => (
              <span
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`py-3 text-lg nav-link ${
                  currentPage === item.value ||
                  (item.value === 'gallery' && currentPage === 'about')
                    ? 'active-nav-link'
                    : ''
                }`}
              >
                {item.label}
              </span>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

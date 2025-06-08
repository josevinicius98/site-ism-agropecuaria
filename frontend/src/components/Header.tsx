import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../AuthContext';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  scrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  scrolled,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(scrolled);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const alwaysBluePages = [
    'portal', 'login', 'links',
    'denuncias', 'admin/denuncias', 'cadastrar',
    'alterar-senha', 'atendimento', 'painel-atendimentos', 'atendimento-suporte'
  ];
  const forceBlue = alwaysBluePages.includes(currentPage) || isScrolled;

  const navItems = [
    { label: 'Início', value: 'home' },
    { label: 'Sobre Nós', value: 'about' },
    { label: 'Galeria', value: 'gallery' },
    { label: 'Atividades', value: 'activities' },
    { label: 'Contato', value: 'contact' },
  ];

  const handleNavClick = (page: string) => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
    if (page === 'gallery') {
      setCurrentPage('about');
      setTimeout(() => {
        const el = document.getElementById('gallery');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      return;
    }
    setCurrentPage(page);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        forceBlue
          ? 'bg-[#070735] shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
      style={{
        background: forceBlue ? '#070735' : 'rgba(255,255,255,0)',
        boxShadow: forceBlue ? undefined : 'none'
      }}
    >
      <div className="container-custom flex justify-between items-center">
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleNavClick('home')}
        >
          <img src="src=/assets/logosemf.png" alt="ISM Agropecuária" className="h-12 sm:h-14 mr-2" />
          <span className="hidden md:block text-white font-display text-xl">
            ISM <span className="text-secondary">Agropecuária</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map(item => (
            <span
              key={item.value}
              onClick={() => handleNavClick(item.value)}
              className={`nav-link cursor-pointer px-1 ${
                item.value === 'gallery' && currentPage === 'about'
                  ? 'active-nav-link'
                  : currentPage === item.value
                  ? 'active-nav-link'
                  : ''
              }`}
            >
              {item.label}
            </span>
          ))}
          <button
            onClick={() => handleNavClick('portal')}
            className="btn-primary px-4 py-2 text-sm font-medium"
          >
            Portal
          </button>
          {isAuthenticated && (
            <button
              onClick={() => { logout(); setCurrentPage('login'); }}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium rounded transition-colors"
            >
              Sair
            </button>
          )}
        </nav>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#070735] animate-fade-in">
          <nav className="container-custom py-4 flex flex-col">
            {navItems.map(item => (
              <span
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`py-3 text-lg nav-link ${
                  item.value === 'gallery' && currentPage === 'about'
                    ? 'active-nav-link'
                    : currentPage === item.value
                    ? 'active-nav-link'
                    : ''
                }`}
              >
                {item.label}
              </span>
            ))}
            <span
              onClick={() => handleNavClick('portal')}
              className="py-3 text-lg cursor-pointer text-white"
            >
              Portal
            </span>
            {isAuthenticated && (
              <span
                onClick={() => { logout(); setCurrentPage('login'); setMenuOpen(false); }}
                className="py-3 text-lg cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded text-center mt-2"
              >
                Sair
              </span>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

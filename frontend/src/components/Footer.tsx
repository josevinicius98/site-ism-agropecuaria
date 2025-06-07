import React from 'react';
// Importa a biblioteca React

import { Linkedin, Mail, MapPin, Phone } from 'lucide-react';
// Importa ícones SVG da biblioteca lucide-react
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
// Importa ícones SVG da biblioteca react-icons

interface FooterProps {
  setCurrentPage: (page: string) => void;
}
// Define as propriedades esperadas: uma função para alterar a página atual

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  // Componente funcional que recebe uma função para alterar a página
  const handleNavClick = (page: string) => {
    setCurrentPage(page);       // Muda a página atual
    window.scrollTo(0, 0);      // Rola a página para o topo
  };

  const currentYear = new Date().getFullYear();
  // Captura o ano atual para exibir no rodapé

  return (
    <footer id="footer" className="bg-primary text-white pt-16 pb-8">
      {/* Rodapé com cor de fundo e espaçamento interno */}

      <div className="container-custom">
        {/* Container personalizado (geralmente largura limitada e padding lateral) */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Grid responsivo com 4 colunas em telas grandes, 2 em médias, e 1 em pequenas */}

          {/* Bloco 1 - Logo e Sobre */}
          <div className="space-y-4">
            <img 
              src="../src/assets/logosemf.png" 
              alt="ISM Agropecuária" 
              className="h-16"
            />
            {/* Logo da empresa */}

            <h3 className="text-xl font-display text-white">ISM Agropecuária</h3>
            <p className="text-neutral-light">
              Excelência em pecuária e agricultura sustentável, priorizando qualidade e inovação.
            </p>
            {/* Descrição da empresa */}
          </div>

          {/* Bloco 2 - Links rápidos */}
          <div>
            <h3 className="text-xl font-display text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {[
                { label: 'Início', value: 'home' },
                { label: 'Sobre Nós', value: 'about' },
                { label: 'Atividades', value: 'activities' },
                { label: 'Contato', value: 'contact' },
              ].map((item) => (
                <li key={item.value}>
                  <span
                    className="inline-block text-neutral-light hover:text-secondary transition-colors duration-300 cursor-pointer"
                    onClick={() => handleNavClick(item.value)}
                  >
                    {item.label}
                  </span>
                </li>
              ))}
              {/* Lista de navegação com clique que atualiza a página e rola para o topo */}
            </ul>
          </div>

          {/* Bloco 3 - Informações de contato */}
          <div>
            <h3 className="text-xl font-display text-white mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="text-secondary flex-shrink-0 mt-1" size={18} />
                <span className="text-neutral-light">
                  Rua Delfim Moreira, 20<br />
                  Centro - Frutal/MG<br />
                  CEP: 38200-098
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-secondary flex-shrink-0" size={18} />
                <span className="text-neutral-light">(34) 3421-0008</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-secondary flex-shrink-0" size={18} />
                <span className="text-neutral-light">contato@ismagro.com.br</span>
              </li>
              {/* Lista de contato com ícones e informações */}
            </ul>
          </div>

          {/* Bloco 4 - Trabalhe Conosco */}
          <div>
            <h3 className="text-xl font-display text-white mb-4">Trabalhe Conosco</h3>
            <p className="text-neutral-light mb-4">
              Junte-se à nossa equipe e ajude a construir o futuro da agricultura no Brasil.
            </p>

            <div className="flex space-x-4">
              {/* Ícones sociais e ação */}
              <a 
                href="https://www.linkedin.com/company/ism-agropecu%C3%A1ria/posts/?feedView=all" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-light hover:bg-secondary hover:text-primary flex items-center justify-center rounded-full transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              {/* Botão do LinkedIn */}
              <a
                href="https://contate.me/ios/ismagropecuaria"  // contato
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-light hover:bg-secondary hover:text-primary flex items-center justify-center rounded-full transition-colors duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>

              <a
                href="https://www.instagram.com/ismagropecuaria?igsh=MWhkMTNlcW42MDFsZA=="  // seu perfil
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-light hover:bg-secondary hover:text-primary flex items-center justify-center rounded-full transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              {/* Botão do Instagram */}

              <button 
                onClick={() => {
                  navigator.clipboard.writeText('recrutamento@ismagro.com.br');
                  alert('Email copiado para a área de transferência!');
                }}
                className="w-10 h-10 bg-primary-light hover:bg-secondary hover:text-primary flex items-center justify-center rounded-full transition-colors duration-300"
                aria-label="Copiar email"
              >
                <Mail size={20} />
              </button>
              {/* Botão que copia o e-mail para a área de transferência */}
            </div>
          </div>
        </div>

        {/* Rodapé inferior com direitos autorais */}
        <div className="pt-8 border-t border-primary-light text-center text-neutral-light">
          <p>© {currentYear} ISM Agropecuária. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// Exporta o componente Footer para ser usado em outras partes do projeto

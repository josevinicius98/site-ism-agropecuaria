/** @type {import('tailwindcss').Config} */
export default {
  // Define os arquivos de conteúdo nos quais o Tailwind deve buscar classes CSS
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Extende a paleta de cores padrão do Tailwind
      colors: {
        primary: {
          DEFAULT: '#070735', // Cor primária padrão (azul escuro)
          light: '#1a1a5c',   // Variante clara da cor primária
          dark: '#05052a',    // Variante escura da cor primária
        },
        secondary: {
          DEFAULT: '#e8c096', // Cor secundária padrão (bege)
          light: '#f0d3b2',   // Variante clara da cor secundária
          dark: '#d0a978',    // Variante escura da cor secundária
        },
        neutral: {
          DEFAULT: '#d2c9c3', // Neutro padrão (cinza claro)
          light: '#e5e0dc',   // Neutro claro
          dark: '#b2a89f',    // Neutro escuro
        },
        accent: {
          DEFAULT: '#7b849d', // Cor de destaque padrão (cinza azulado)
          light: '#9ba3b6',   // Variante clara de destaque
          dark: '#606a85',    // Variante escura de destaque
        },
        success: '#2e7d32', // Cor para estados de sucesso (verde)
        warning: '#ed6c02', // Cor para estados de alerta (laranja)
        error: '#d32f2f',   // Cor para estados de erro (vermelho)
      },
      // Define famílias de fonte customizadas
      fontFamily: {
        display: ['"Playfair Display"', 'serif'], // Fonte serif para títulos
        sans: ['Raleway', 'sans-serif'],            // Fonte sem serifa para corpo de texto
      },
      // Configura imagens de fundo personalizadas com overlay
      backgroundImage: {
        'hero-pattern': "linear-gradient(rgba(7, 7, 53, 0.7), rgba(7, 7, 53, 0.4)), url('/src/assets/hero-bg.jpg')",
        'cattle-pattern': "linear-gradient(rgba(7, 7, 53, 0.6), rgba(7, 7, 53, 0.3)), url('/src/assets/cattle-bg.jpg')",
        'agriculture-pattern': "linear-gradient(rgba(7, 7, 53, 0.6), rgba(7, 7, 53, 0.3)), url('/src/assets/agriculture-bg.jpg')",
      },
    },
  },
  plugins: [], // Lista de plugins Tailwind (vazia por enquanto)
};
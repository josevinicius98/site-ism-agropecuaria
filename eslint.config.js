import js from '@eslint/js'; // Importa configurações recomendadas do ESLint para JavaScript
import globals from 'globals'; // Importa lista de variáveis globais (browser, node, etc.)
import reactHooks from 'eslint-plugin-react-hooks'; // Plugin para regras de Hooks do React
import reactRefresh from 'eslint-plugin-react-refresh'; // Plugin para garantir exports adequados ao usar React Refresh (Fast Refresh)
import tseslint from 'typescript-eslint'; // Ferramenta para configurar ESLint com TypeScript

export default tseslint.config(
  // Parâmetros iniciais para o ts-eslint: ignorar a pasta 'dist'
  { ignores: ['dist'] },
  {
    // Extende configuração base: ESLint JS recomendado e configurações recomendadas do ts-eslint
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    // Aplica apenas a arquivos .ts e .tsx
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020, // Usa sintaxe ECMAScript 2020
      globals: globals.browser, // Define variáveis globais de ambiente browser
    },
    plugins: {
      'react-hooks': reactHooks, // Ativa regras de Hooks do React
      'react-refresh': reactRefresh, // Ativa regras de React Refresh
    },
    rules: {
      // Importa regras recomendadas do plugin react-hooks
      ...reactHooks.configs.recommended.rules,
      // Adiciona regra para permitir exports constantes com React Refresh
      'react-refresh/only-export-components': [
        'warn', // Nível de severidade: aviso
        { allowConstantExport: true }, // Permite exportar componentes como constantes
      ],
    },
  }
);
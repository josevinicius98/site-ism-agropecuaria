import React, { useEffect } from 'react'; // Importar useEffect
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext'; // Importar useAuth para o AppContent
import PrivateRoute from './PrivateRoute';

import Header from './components/Header';
import Footer from './components/Footer';

// Seus imports de páginas
import Portal from './pages/Portal'; // Importar a página do portal
import LoginPage from './pages/LoginPage'; // Importar a página de login
import HomePage from './pages/HomePage'; // Importar a página inicial
import AboutPage from './pages/AboutPage';  // Importar a página de sobre
import ActivitiesPage from './pages/ActivitiesPage'; // Importar a página de atividades
import ContactPage from './pages/ContactPage';  // Importar a página de contato
import CadastroPage from './pages/CadastroPage'; // Importar a página de cadastro
import LinksPage from './pages/Links'; // Importar a página de links
import DenunciasPage from './pages/DenunciaPage'; // Importar a página de denúncias
import AdminDenunciasPage from './pages/AdminDenuncias'; // Importar a página de gestão de denúncias
import AlterarSenhaPage from './pages/AlterarSenhaPage'; // Importar a página de alteração de senha
import AtendimentoChatPage from './pages/AtendimentoChatPage'; // Importar a página de atendimento
import PainelAtendimentosPage from './pages/PainelAtendimentosPage'; // Importar a página de gestão de atendimentos
import AtendimentoChatSuportePage from './pages/AtendimentoChatSuportePage'; // Importar a página de gestão de usuários
import UserManagementPage from './pages/UserManagementPage'; // Importar a página de gestão de usuários
import AuditoriaPage from './pages/AuditoriaPage'; // Importar a página de auditoria

// Criar um componente auxiliar para usar o hook useAuth
const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Usar o hook useAuth para acessar o estado de autenticação

  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1);
  const setCurrentPage = (page: string) => navigate(page === 'home' ? '/' : `/${page}`);

  // Lógica para forçar alteração de senha no primeiro login
  useEffect(() => {
    // Se o usuário está autenticado, seus dados foram carregados, e é o primeiro login...
    if (isAuthenticated && user && user.primeiro_login) {
      // E a página atual NÃO é a página de alteração de senha nem a de login,
      // então redireciona para a página de alteração de senha.
      if (location.pathname !== '/alterar-senha' && location.pathname !== '/login') {
        navigate('/alterar-senha', { replace: true }); // replace: true evita que o usuário volte para a página anterior
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate]);


  return (
    <>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} scrolled={false} />
      <main
        className="min-h-[calc(100vh-200px)] flex flex-col justify-center items-center"
        style={{
          minHeight: 'calc(100vh - 200px)',
          paddingTop: 0,
          marginTop: 0,
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/alterar-senha" element={
            <PrivateRoute> {/* A rota de alterar senha também deve ser protegida */}
              <AlterarSenhaPage />
            </PrivateRoute>
          } />

          {/* Rotas Protegidas */}
          <Route path="/portal" element={
            <PrivateRoute>
              <Portal />
            </PrivateRoute>
          } />
          <Route path="/cadastrar" element={
            <PrivateRoute requiredRole="admin">
              <CadastroPage />
            </PrivateRoute>
          } />
          <Route path="/links" element={
            <PrivateRoute>
              <LinksPage />
            </PrivateRoute>
          } />
          <Route path="/denuncias" element={
            <PrivateRoute>
              <DenunciasPage />
            </PrivateRoute>
          } />
          <Route path="/admin/denuncias" element={
            <PrivateRoute requiredRole={["admin", "rh", "compliance"]}>
              <AdminDenunciasPage />
            </PrivateRoute>
          } />
          <Route path="/atendimento" element={
            <PrivateRoute>
              <AtendimentoChatPage />
            </PrivateRoute>
          } />
          <Route path="/atendimento-suporte/:id" element={
            <PrivateRoute requiredRole={["admin", "rh", "compliance"]}>
              <AtendimentoChatSuportePage />
            </PrivateRoute>
          } />
          <Route path="/painel-atendimentos" element={
            <PrivateRoute requiredRole={["admin", "rh", "compliance"]}>
              <PainelAtendimentosPage />
            </PrivateRoute> 
          } />
          <Route path="/gestao-usuarios" element={<UserManagementPage />} /> {/* Página de gestão de usuários */}
          <Route path="/auditoria" element={<AuditoriaPage />} /> {/* Página de auditoria */}

        </Routes>
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </>
  );
};

// Componente principal App que envolve tudo com AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent /> {/* Renderiza o AppContent dentro do AuthProvider */}
    </AuthProvider>
  );
};

export default App;
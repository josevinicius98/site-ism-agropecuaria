import React, { useEffect } from 'react'; // Importar useEffect
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext'; // Importar useAuth para o AppContent
import PrivateRoute from './PrivateRoute';

import Header from './components/Header';
import Footer from './components/Footer';

// Seus imports de páginas
import Portal from './pages/Portal';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ContactPage from './pages/ContactPage';
import CadastroPage from './pages/CadastroPage';
import LinksPage from './pages/Links';
import DenunciasPage from './pages/DenunciaPage';
import AdminDenunciasPage from './pages/AdminDenuncias';
import AlterarSenhaPage from './pages/AlterarSenhaPage';
import AtendimentoChatPage from './pages/AtendimentoChatPage';
import PainelAtendimentosPage from './pages/PainelAtendimentosPage';
import AtendimentoChatSuportePage from './pages/AtendimentoChatSuportePage';

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
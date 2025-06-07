import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// Definição do tipo User, AGORA INCLUINDO 'primeiro_login'
type User = {
  id: number;
  nome: string;
  login: string;
  role: string;
  primeiro_login: boolean; // Propriedade adicionada para controlar o primeiro acesso
  // Você pode adicionar outras propriedades do usuário aqui se necessário
};

interface AuthContextType {
  token: string | null;
  user: User | null;
  // Assinatura da função login: recebe o token e o objeto User completo
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializa o estado com o que está no localStorage
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('portal_token'));
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('portal_user');
    // Tenta parsear o usuário armazenado; se falhar, retorna null
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Erro ao parsear usuário do localStorage:", e);
      return null;
    }
  });

  // Função para decodificar o token e extrair as informações do usuário
  const decodeToken = (token: string): User | null => {
    try {
      const decoded: any = jwtDecode(token);
      return {
        id: decoded.sub, // 'sub' é geralmente o ID do usuário no JWT
        nome: decoded.nome,
        login: decoded.login,
        role: decoded.role,
        primeiro_login: decoded.primeiro_login || false, // Garante que a propriedade exista
      };
    } catch (e) {
      console.error("Erro ao decodificar token JWT:", e);
      return null;
    }
  };

  // Efeito para sincronizar 'token' com 'localStorage'
  useEffect(() => {
    if (token) {
      localStorage.setItem('portal_token', token);
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setUser(decodedUser); // Atualiza o estado 'user' com base no token decodificado
      } else {
        // Se o token for inválido, limpa tudo
        localStorage.removeItem('portal_token');
        localStorage.removeItem('portal_user');
        setToken(null);
        setUser(null);
      }
    } else {
      // Se não há token no estado, remove do localStorage
      localStorage.removeItem('portal_token');
      localStorage.removeItem('portal_user'); // Garante que o usuário também seja limpo
      setUser(null);
    }
  }, [token]);

  // Efeito para sincronizar 'user' com 'localStorage' (útil para persistência de dados do usuário)
  useEffect(() => {
    if (user) {
      localStorage.setItem('portal_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('portal_user');
    }
  }, [user]);


  // Função de login atualizada para receber o token E o objeto de usuário completo do backend
  const login = (newToken: string, newUser: User) => {
    setToken(newToken); // Isso irá disparar o useEffect para decodificar o token e atualizar o 'user'
    setUser(newUser); // Define o usuário diretamente com os dados passados pelo backend
  };

  // Função de logout
  const logout = () => {
    setToken(null); // Limpa o token, o que acionará os useEffects para limpar o localStorage e o 'user'
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token && !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const AlterarSenhaPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // 'user' agora possui a propriedade 'primeiro_login' e 'doLogin' recebe dois argumentos
  const { user, token, login: doLogin } = useAuth();

  // UseEffect para exibir a mensagem do primeiro login e lidar com redirecionamento
  useEffect(() => {
    // Redireciona se não estiver logado ou se o usuário não for carregado
    if (!user || !token) {
        navigate('/login');
        return;
    }
    // Verifica a propriedade primeiro_login que agora existe no tipo User
    if (user.primeiro_login) {
      setMessage('É obrigatório alterar sua senha no primeiro acesso. Por favor, continue.');
    } else {
      setMessage(''); // Limpa a mensagem se não for primeiro login (usuário já alterou)
      // Opcional: Se o usuário já alterou a senha e tenta acessar esta página, pode redirecionar
      // navigate('/portal'); 
    }
  }, [user, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmNewPassword) {
      setError('A nova senha e a confirmação não coincidem.');
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/alterar-senha', { // Confirme a URL da sua API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          senhaAtual: currentPassword,
          novaSenha: newPassword
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Falha ao alterar senha.');
      }

      const data = await response.json();
      // Corrigido: Agora passa o token E o objeto 'user' completo retornado pelo backend para o 'doLogin'
      // data.user agora contém a propriedade `primeiro_login` como false
      doLogin(data.token, data.user);

      setMessage('Senha alterada com sucesso! Você será redirecionado em breve.');
      setTimeout(() => {
        navigate('/portal');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Se o usuário não estiver carregado ou logado, exibe mensagem de redirecionamento.
  // O useEffect já lida com o redirecionamento real.
  if (!user) {
    return <div className="text-center mt-16">Redirecionando para o login...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Alterar Senha</h2>

        {message && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Atenção!</strong>
            <span className="block sm:inline"> {message}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de Senha Atual: Condicionalmente visível se NÃO for o primeiro login */}
          {user && !user.primeiro_login && (
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Senha Atual:</label>
              <input
                type="password"
                id="current-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">Nova Senha:</label>
            <input
              type="password"
              id="new-password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha:</label>
            <input
              type="password"
              id="confirm-new-password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlterarSenhaPage;
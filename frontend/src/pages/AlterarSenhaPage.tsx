import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const AlterarSenhaPage: React.FC = () => {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(15); // 15 segundos
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  // Lógica do contador de redirecionamento após sucesso
  useEffect(() => {
    if (successMsg && redirectCountdown > 0) {
      const timer = setTimeout(() => setRedirectCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (successMsg && redirectCountdown === 0) {
      logout(); // Limpa o contexto de autenticação
      navigate('/login');
    }
  }, [successMsg, redirectCountdown, navigate, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Para o primeiro login, senhaAtual pode ser opcional (backend já trata isso!)
      await axios.post(
        '/api/alterar-senha',
        { senhaAtual, novaSenha },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg('Senha alterada com sucesso! Você será redirecionado para o login em 15 segundos...');
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        'Erro ao alterar a senha. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Alterar Senha</h2>
      {successMsg ? (
        <div className="mb-6 text-green-600 text-center">
          {successMsg}
          <div className="mt-2 text-sm">
            Redirecionando para o login em <span className="font-bold">{redirectCountdown}</span> segundos...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {/* Apenas pede a senha atual se NÃO for primeiro login */}
          {!user?.primeiro_login && (
            <input
              type="password"
              value={senhaAtual}
              onChange={e => setSenhaAtual(e.target.value)}
              placeholder="Senha atual"
              required
              className="w-full p-2 border rounded"
            />
          )}
          <input
            type="password"
            value={novaSenha}
            onChange={e => setNovaSenha(e.target.value)}
            placeholder="Nova senha"
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="btn-primary w-full py-2"
            disabled={loading}
          >
            {loading ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AlterarSenhaPage;

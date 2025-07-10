import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const LoginPage: React.FC = () => {
  const [loginInput, setLoginInput] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: doLogin } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // ATUALIZE AQUI: use URL relativa!
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginInput, senha }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Usuário ou senha inválidos');
      }

      const data = await res.json();
      doLogin(data.token, data.user);

      if (data.user.primeiro_login) {
        nav('/alterar-senha');
      } else {
        nav('/portal');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Bem-vindo!</h2>
      <h3 className="text-2xl font-bold mb-6">Por favor, insira seu usuário e senha para continuar.</h3>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={loginInput}
          onChange={e => setLoginInput(e.target.value)}
          placeholder="Usuário"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          placeholder="Senha"
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="btn-primary w-full py-2" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

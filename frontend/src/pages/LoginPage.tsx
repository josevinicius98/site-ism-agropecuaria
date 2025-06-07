import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const LoginPage: React.FC = () => {
  const [loginInput, setLoginInput] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento do botão
  const { login: doLogin } = useAuth(); // Renomeado para evitar conflito com a variável de estado 'loginInput'
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Inicia o estado de carregamento
    try {
      const res = await fetch('http://localhost:3001/api/login', { // Confirme a URL da sua API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginInput, senha }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Usuário ou senha inválidos');
      }

      const data = await res.json();
      // Corrigido: Agora passa o token E o objeto 'user' completo retornado pelo backend para o 'doLogin'
      doLogin(data.token, data.user); // data.user agora contém a propriedade `primeiro_login`

      if (data.user.primeiro_login) { // Verifica a propriedade `primeiro_login`
        nav('/alterar-senha'); // Redireciona para a página de alteração de senha
      } else {
        nav('/portal'); // Redireciona para o portal ou home após login normal
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Login</h2> <h3 className="text-lg mb-6">Caro, colaborador, acesse sua conta</h3>
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
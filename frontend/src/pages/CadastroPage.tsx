import React, { useState } from 'react';

// Componente funcional para cadastro de usuários
const CadastroPage: React.FC = () => {
  // Estados para armazenar os dados do formulário
  const [nome, setNome] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('colaborador'); // papel padrão
  const [msg, setMsg] = useState(''); // mensagem de sucesso ou erro

  // Função chamada ao enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // evita reload da página
    setMsg('');
    try {
      // Chamada à API para cadastrar usuário
      const res = await fetch('/api/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, login, senha, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido');
      // Se sucesso, limpa campos e mostra mensagem
      setMsg('Usuário cadastrado com sucesso!');
      setNome(''); setLogin(''); setSenha('');
    } catch (err: any) {
      // Mostra mensagem de erro
      setMsg('Erro: ' + err.message);
    }
  };

  // JSX: estrutura visual do formulário
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
          Cadastro de Usuário
        </h2>
        {/* Exibe mensagem de erro ou sucesso */}
        {msg && (
          <div className={`mb-4 text-center font-semibold ${msg.startsWith('Erro') ? 'text-red-600' : 'text-green-700'}`}>
            {msg}
          </div>
        )}
        {/* Formulário de cadastro */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Nome"
            required
          />
          <input
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={login}
            onChange={e => setLogin(e.target.value)}
            placeholder="Login"
            required
          />
          <input
            type="password"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="Senha"
            required
          />
          {/* Seleção de papel do usuário */}
          <select
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="colaborador">Colaborador</option>
            <option value="admin">Admin</option>
            <option value="rh">RH</option>
            <option value="compliance">Compliance</option>
          </select>
          {/* Botão de envio */}
          <button
            type="submit"
            className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroPage;

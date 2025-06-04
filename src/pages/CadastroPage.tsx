import React, { useState } from 'react';

const CadastroPage: React.FC = () => {
  const [nome, setNome] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('colaborador');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, login, senha, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido');
      setMsg('Usuário cadastrado com sucesso!');
      setNome(''); setLogin(''); setSenha('');
    } catch (err: any) {
      setMsg('Erro: ' + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Cadastro de Usuário</h2>
        {msg && <div className={`mb-4 text-center font-semibold ${msg.startsWith('Erro') ? 'text-red-600' : 'text-green-700'}`}>{msg}</div>}
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

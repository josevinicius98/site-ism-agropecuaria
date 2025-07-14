import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext'; // PEGUE O TOKEN!

interface Usuario {
  id: number;
  nome: string;
  login: string;
  role: string;
  status_usuario: string;
}

const UserManagement: React.FC = () => {
  const { token } = useAuth(); // USE O TOKEN DO CONTEXTO!
  const [users, setUsers] = useState<Usuario[]>([]);
  const [senhaNova, setSenhaNova] = useState<{ [id: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Carrega usuários ao montar o componente
  useEffect(() => {
    if (!token) return;
    fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) throw new Error('Sessão expirada, faça login novamente.');
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Falha ao buscar usuários');
        setUsers(data);
      })
      .catch(err => setMsg(err.message));
  }, [token]);

  // Alterar senha
  const alterarSenha = async (id: number) => {
    if (!senhaNova[id] || senhaNova[id].length < 6) {
      setMsg('A senha precisa ter ao menos 6 caracteres.');
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/users/${id}/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ password: senhaNova[id] })
    });
    setLoading(false);
    setMsg(res.ok ? 'Senha alterada com sucesso!' : 'Erro ao alterar senha');
    setSenhaNova(s => ({ ...s, [id]: '' }));
  };

  // Alterar status
  const alterarStatus = async (id: number, status: 'ativo' | 'inativo') => {
    setLoading(true);
    const res = await fetch(`/api/users/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status_usuario: status })
    });
    setLoading(false);
    setMsg(res.ok ? 'Status atualizado!' : 'Erro ao atualizar status');
    if (res.ok) {
      setUsers(us => us.map(u => u.id === id ? { ...u, status_usuario: status } : u));
    }
  };

  return (
    <div>
      {msg && <div className="mb-2 text-center text-blue-900">{msg}</div>}
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="pb-2">Nome</th>
            <th className="pb-2">Login</th>
            <th className="pb-2">Cargo</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Nova Senha</th>
            <th className="pb-2"></th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td>{u.nome}</td>
              <td>{u.login}</td>
              <td>{u.role}</td>
              <td>
                <span className={u.status_usuario === 'ativo' ? 'text-green-700' : 'text-red-600'}>
                  {u.status_usuario}
                </span>
              </td>
              <td>
                <input
                  type="password"
                  value={senhaNova[u.id] || ''}
                  onChange={e => setSenhaNova(s => ({ ...s, [u.id]: e.target.value }))}
                  placeholder="Nova senha"
                  className="border rounded px-2 py-1 w-32"
                  disabled={loading}
                />
              </td>
              <td>
                <button
                  onClick={() => alterarSenha(u.id)}
                  disabled={loading}
                  className="bg-blue-700 hover:bg-blue-900 text-white rounded px-3 py-1 text-sm"
                >
                  Alterar Senha
                </button>
              </td>
              <td>
                <button
                  onClick={() => alterarStatus(u.id, u.status_usuario === 'ativo' ? 'inativo' : 'ativo')}
                  disabled={loading}
                  className={`rounded px-3 py-1 text-sm ${u.status_usuario === 'ativo' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  {u.status_usuario === 'ativo' ? 'Inativar' : 'Ativar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

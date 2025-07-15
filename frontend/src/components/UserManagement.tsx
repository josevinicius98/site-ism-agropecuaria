import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

interface Usuario {
  id: number;
  nome: string;
  login: string;
  role: string;
  status_usuario: string;
}

const UserManagement: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<Usuario[]>([]);
  const [senhaNova, setSenhaNova] = useState<{ [id: number]: string }>({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Filtros
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'inativo'>('todos');

  // Edição de campos
  const [editFields, setEditFields] = useState<{ [id: number]: Partial<Usuario> }>({});

  useEffect(() => {
    if (!token) return;
    fetch('/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
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

  // Atualiza campos editados
  const handleEditField = (id: number, field: keyof Usuario, value: string) => {
    setEditFields(e => ({
      ...e,
      [id]: { ...e[id], [field]: value }
    }));
  };

  // Salvar alterações do usuário
  const salvarEdicao = async (id: number) => {
    const campos = editFields[id];
    if (!campos) return;
    setLoading(true);
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(campos)
    });
    setLoading(false);
    if (res.ok) {
      setMsg('Usuário atualizado!');
      setUsers(users.map(u => u.id === id ? { ...u, ...campos } : u));
      setEditFields(e => {
        const { [id]: _, ...rest } = e;
        return rest;
      });
    } else {
      setMsg('Erro ao atualizar usuário');
    }
  };

  // Troca senha
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

  // Troca status
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

  // Excluir usuário
  const excluirUsuario = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário? Essa ação não pode ser desfeita!')) return;
    setLoading(true);
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setLoading(false);
    if (res.ok) {
      setMsg('Usuário excluído com sucesso!');
      setUsers(us => us.filter(u => u.id !== id));
    } else {
      setMsg('Erro ao excluir usuário');
    }
  };

  // Filtragem
  const usuariosFiltrados = users.filter(u =>
    u.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
    (filtroStatus === 'todos' || u.status_usuario === filtroStatus)
  );

  return (
    <div>
      {msg && <div className="mb-2 text-center text-blue-900">{msg}</div>}

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          className="border rounded px-2 py-1"
          value={filtroNome}
          onChange={e => setFiltroNome(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1"
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value as any)}
        >
          <option value="todos">Todos</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="pb-2">Nome</th>
            <th className="pb-2">Login</th>
            <th className="pb-2">Cargo</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Nova Senha</th>
            <th className="pb-2"></th>
            <th className="pb-2"></th>
            <th className="pb-2"></th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map(u => (
            <tr key={u.id} className="border-t">
              <td>
                <input
                  className="border rounded px-2 py-1"
                  value={editFields[u.id]?.nome ?? u.nome}
                  onChange={e => handleEditField(u.id, 'nome', e.target.value)}
                  disabled={loading}
                />
              </td>
              <td>
                <input
                  className="border rounded px-2 py-1"
                  value={editFields[u.id]?.login ?? u.login}
                  onChange={e => handleEditField(u.id, 'login', e.target.value)}
                  disabled={loading}
                />
              </td>
              <td>
                <select
                  className="border rounded px-2 py-1"
                  value={editFields[u.id]?.role ?? u.role}
                  onChange={e => handleEditField(u.id, 'role', e.target.value)}
                  disabled={loading}
                >
                  <option value="colaborador">Colaborador</option>
                  <option value="admin">Admin</option>
                  <option value="rh">RH</option>
                  <option value="compliance">Compliance</option>
                </select>
              </td>
              <td>
                <select
                  className="border rounded px-2 py-1"
                  value={editFields[u.id]?.status_usuario ?? u.status_usuario}
                  onChange={e => handleEditField(u.id, 'status_usuario', e.target.value)}
                  disabled={loading}
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
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
                  onClick={() => salvarEdicao(u.id)}
                  disabled={loading || !editFields[u.id]}
                  className="bg-green-700 hover:bg-green-900 text-white rounded px-3 py-1 text-sm"
                >
                  Salvar Alterações
                </button>
              </td>
              <td>
                <button
                  onClick={() =>
                    alterarStatus(u.id, u.status_usuario === 'ativo' ? 'inativo' : 'ativo')
                  }
                  disabled={loading}
                  className={`rounded px-3 py-1 text-sm ${u.status_usuario === 'ativo'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {u.status_usuario === 'ativo' ? 'Inativar' : 'Ativar'}
                </button>
              </td>
              <td>
                <button
                  onClick={() => excluirUsuario(u.id)}
                  disabled={loading}
                  className="bg-gray-700 hover:bg-black text-white rounded px-3 py-1 text-sm"
                >
                  Excluir
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


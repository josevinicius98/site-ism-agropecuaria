import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

interface Usuario {
  id: number;
  nome: string;
  login: string;
  role: string;
  status_usuario: string;
}

const cargos = [
  { value: "colaborador", label: "Colaborador" },
  { value: "admin", label: "Admin" },
  { value: "rh", label: "RH" },
  { value: "compliance", label: "Compliance" }
];

const UserManagement: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<Usuario[]>([]);
  const [senhaNova, setSenhaNova] = useState<{ [id: number]: string }>({});
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);

  // Filtros
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'inativo'>('todos');

  // Edição de campos
  const [editFields, setEditFields] = useState<{ [id: number]: Partial<Usuario> }>({});

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch('/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        setLoading(false);
        if (res.status === 401) throw new Error('Sessão expirada, faça login novamente.');
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Falha ao buscar usuários');
        setUsers(data);
      })
      .catch(err => { setMsg(err.message); setMsgType('error'); });
  }, [token]);

  // Limpa mensagem após alguns segundos
  useEffect(() => {
    if (msg) {
      const t = setTimeout(() => setMsg(''), 3500);
      return () => clearTimeout(t);
    }
  }, [msg]);

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
      setMsgType('success');
      setUsers(users.map(u => u.id === id ? { ...u, ...campos } : u));
      setEditFields(e => {
        const { [id]: _, ...rest } = e;
        return rest;
      });
    } else {
      setMsg('Erro ao atualizar usuário');
      setMsgType('error');
    }
  };

  // Troca senha
  const alterarSenha = async (id: number) => {
    if (!senhaNova[id] || senhaNova[id].length < 6) {
      setMsg('A senha precisa ter ao menos 6 caracteres.');
      setMsgType('error');
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
    setMsgType(res.ok ? 'success' : 'error');
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
    setMsgType(res.ok ? 'success' : 'error');
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
      setMsgType('success');
      setUsers(us => us.filter(u => u.id !== id));
    } else {
      setMsg('Erro ao excluir usuário');
      setMsgType('error');
    }
  };

  // Filtragem
  const usuariosFiltrados = users.filter(u =>
    u.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
    (filtroStatus === 'todos' || u.status_usuario === filtroStatus)
  );

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-4 text-[#070735] text-center">Gestão de Usuários</h2>

      {msg && (
        <div className={`mb-4 px-4 py-2 text-center rounded ${msgType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
          {msg}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-5 items-center justify-between">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          className="border rounded px-3 py-2 w-56"
          value={filtroNome}
          onChange={e => setFiltroNome(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value as any)}
        >
          <option value="todos">Todos</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm border rounded-xl">
          <thead className="bg-[#eaf2ff]">
            <tr>
              <th className="p-2">Nome</th>
              <th className="p-2">Login</th>
              <th className="p-2">Cargo</th>
              <th className="p-2">Status</th>
              <th className="p-2">Nova Senha</th>
              <th className="p-2"></th>
              <th className="p-2"></th>
              <th className="p-2"></th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map(u => (
              <tr key={u.id} className={`border-t transition ${editFields[u.id] ? 'bg-yellow-50' : ''}`}>
                <td>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={editFields[u.id]?.nome ?? u.nome}
                    onChange={e => handleEditField(u.id, 'nome', e.target.value)}
                    disabled={loading}
                  />
                </td>
                <td>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={editFields[u.id]?.login ?? u.login}
                    onChange={e => handleEditField(u.id, 'login', e.target.value)}
                    disabled={loading}
                  />
                </td>
                <td>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={editFields[u.id]?.role ?? u.role}
                    onChange={e => handleEditField(u.id, 'role', e.target.value)}
                    disabled={loading}
                  >
                    {cargos.map(c => (
                      <option value={c.value} key={c.value}>{c.label}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="border rounded px-2 py-1 w-full"
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
                    className="bg-blue-700 hover:bg-blue-900 text-white rounded px-3 py-1 text-xs font-semibold"
                  >
                    Alterar Senha
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => salvarEdicao(u.id)}
                    disabled={loading || !editFields[u.id]}
                    className="bg-green-700 hover:bg-green-900 text-white rounded px-3 py-1 text-xs font-semibold"
                  >
                    Salvar
                  </button>
                </td>
                <td>
                  <button
                    onClick={() =>
                      alterarStatus(u.id, u.status_usuario === 'ativo' ? 'inativo' : 'ativo')
                    }
                    disabled={loading}
                    className={`rounded px-3 py-1 text-xs font-semibold ${u.status_usuario === 'ativo'
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
                    className="bg-gray-600 hover:bg-black text-white rounded px-3 py-1 text-xs font-semibold"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {usuariosFiltrados.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-gray-400 py-4">Nenhum usuário encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {loading && (
        <div className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center z-30">
          <div className="bg-white px-6 py-3 rounded-2xl shadow text-blue-800 font-bold border border-blue-200 flex items-center gap-2">
            <span className="animate-spin h-5 w-5 mr-2 border-b-2 border-blue-700 rounded-full inline-block"></span>
            Processando...
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

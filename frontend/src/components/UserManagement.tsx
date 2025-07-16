// src/components/UserManagement.tsx
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

  // Busca inicial de usuários
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
      .catch(err => {
        setMsg(err.message);
        setMsgType('error');
      });
  }, [token]);

  // Limpa mensagens após 3,5s
  useEffect(() => {
    if (msg) {
      const t = setTimeout(() => setMsg(''), 3500);
      return () => clearTimeout(t);
    }
  }, [msg]);

  const handleEditField = (id: number, field: keyof Usuario, value: string) => {
    setEditFields(e => ({ ...e, [id]: { ...e[id], [field]: value } }));
  };

  // Salva alterações e envia todos os campos obrigatórios
  const salvarEdicao = async (id: number) => {
    const campos = editFields[id];
    if (!campos) return;
    const usuario = users.find(u => u.id === id);
    if (!usuario) return;

    const payload = {
      nome: campos.nome ?? usuario.nome,
      login: campos.login ?? usuario.login,
      role: campos.role ?? usuario.role,
      status_usuario: campos.status_usuario ?? usuario.status_usuario
    };

    setLoading(true);
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    setLoading(false);

    if (res.ok) {
      setMsg('Usuário atualizado!');
      setMsgType('success');
      setUsers(users.map(u => u.id === id ? { ...u, ...payload } : u));
      setEditFields(e => {
        const { [id]: _, ...rest } = e;
        return rest;
      });
    } else {
      setMsg('Erro ao atualizar usuário');
      setMsgType('error');
    }
  };

  // Filtra antes de renderizar
  const usuariosFiltrados = users
    .filter(u => u.nome.toLowerCase().includes(filtroNome.toLowerCase()))
    .filter(u => filtroStatus === 'todos' || u.status_usuario === filtroStatus);

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-4 text-[#070735] text-center">
        Gestão de Usuários
      </h2>

      {msg && (
        <div className={`mb-4 px-4 py-2 text-center rounded ${
          msgType === 'success'
            ? 'bg-green-100 text-green-800 border-green-200'
            : 'bg-red-100 text-red-700 border-red-200'
        }`}>
          {msg}
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={filtroNome}
          onChange={e => setFiltroNome(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value as any)}
          className="border rounded px-3 py-2"
        >
          <option value="todos">Todos</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>

      {/* Tabela de usuários */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm border rounded-xl">
          <thead className="bg-[#eaf2ff]">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Login</th>
              <th className="px-4 py-2">Cargo</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map(u => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">
                  {editFields[u.id]?.nome != null
                    ? <input
                        value={editFields[u.id]!.nome}
                        onChange={e => handleEditField(u.id, 'nome', e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                      />
                    : u.nome
                  }
                </td>
                <td className="px-4 py-2">
                  {editFields[u.id]?.login != null
                    ? <input
                        value={editFields[u.id]!.login}
                        onChange={e => handleEditField(u.id, 'login', e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                      />
                    : u.login
                  }
                </td>
                <td className="px-4 py-2">
                  {editFields[u.id]?.role != null
                    ? <select
                        value={editFields[u.id]!.role}
                        onChange={e => handleEditField(u.id, 'role', e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        {cargos.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    : u.role
                  }
                </td>
                <td className="px-4 py-2">
                  {editFields[u.id]?.status_usuario != null
                    ? <select
                        value={editFields[u.id]!.status_usuario}
                        onChange={e => handleEditField(u.id, 'status_usuario', e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                      </select>
                    : u.status_usuario
                  }
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {editFields[u.id]
                    ? <button
                        onClick={() => salvarEdicao(u.id)}
                        disabled={loading}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        Salvar
                      </button>
                    : <button
                        onClick={() => setEditFields(e => ({ ...e, [u.id]: {} }))}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Editar
                      </button>
                  }
                </td>
              </tr>
            ))}
            {usuariosFiltrados.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  Nenhum usuário encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

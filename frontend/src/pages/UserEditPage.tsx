// src/pages/UserEditPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

interface Usuario {
  id: number;
  nome: string;
  login: string;
  role: string;
  status_usuario: string;
}

const cargos = [
  { value: 'colaborador', label: 'Colaborador' },
  { value: 'admin', label: 'Admin' },
  { value: 'rh', label: 'RH' },
  { value: 'compliance', label: 'Compliance' },
];

const UserEditPage: React.FC = () => {
  const { token, user } = useAuth();
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [origUser, setOrigUser] = useState<Usuario | null>(null);
  const [form, setForm] = useState<Partial<Usuario>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Autorização
  if (!['admin', 'rh'].includes(user?.role || '')) {
    return (
      <div className="p-4">
        <p className="text-red-600">Acesso negado.</p>
      </div>
    );
  }

  // Carrega usuário
  useEffect(() => {
    if (!token) return;
    fetch(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then((u: Usuario) => {
        setOrigUser(u);
        setForm(u);
      })
      .catch(() => setMsg('Erro ao carregar usuário.'));
  }, [id, token]);

  // Limpa mensagem
  useEffect(() => {
    if (msg) {
      const t = setTimeout(() => setMsg(null), 3500);
      return () => clearTimeout(t);
    }
  }, [msg]);

  const handleChange = (field: keyof Usuario, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const salvar = async () => {
    if (!form.nome || !form.login || !form.role) {
      setMsg('Nome, login e cargo são obrigatórios.');
      return;
    }
    setLoading(true);

    // Sempre envia os campos obrigatórios, status só se mudou
    const payload: any = {
      nome: form.nome,
      login: form.login,
      role: form.role,
    };
    if (origUser && form.status_usuario !== origUser.status_usuario) {
      payload.status_usuario = form.status_usuario;
    }

    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => null);
    setLoading(false);

    if (res.ok) {
      setMsg('Usuário salvo com sucesso!');
      setTimeout(() => nav('/gestao-usuarios'), 1000);
    } else {
      setMsg(json?.error || 'Erro ao salvar.');
    }
  };

  const excluir = async () => {
    if (!confirm('Deseja realmente excluir este usuário?')) return;
    setLoading(true);
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setLoading(false);
    if (res.ok) {
      nav('/gestao-usuarios');
    } else {
      setMsg('Falha ao excluir usuário.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
      <h1 className="text-2xl font-bold text-center mb-4">Editar Usuário</h1>
      {msg && (
        <div
          className={`mb-4 px-4 py-2 rounded ${
msg.startsWith('Usuário salvo')
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
        >
          {msg}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            value={form.nome || ''}
            onChange={e => handleChange('nome', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Login</label>
          <input
            type="text"
            value={form.login || ''}
            onChange={e => handleChange('login', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Cargo</label>
          <select
            value={form.role || ''}
            onChange={e => handleChange('role', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 p-2"
          >
            {cargos.map(c => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={form.status_usuario || ''}
            onChange={e => handleChange('status_usuario', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 p-2"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={salvar}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          Salvar
        </button>
        <button
          onClick={excluir}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          Excluir
        </button>
        <button
          onClick={() => nav('/gestao-usuarios')}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default UserEditPage;

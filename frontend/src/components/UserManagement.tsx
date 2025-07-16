// src/pages/UserManagementPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

interface Usuario {
  id: number;
  nome: string;
  login: string;
  role: string;
  status_usuario: string;
}

const UserManagementPage: React.FC = () => {
  const { token, user } = useAuth();
  const nav = useNavigate();
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Falha ao carregar usuários');
        const data = await res.json();
        setUsers(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [token]);

  if (!['admin', 'rh'].includes(user?.role || '')) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">Acesso negado. Perfil não autorizado.</p>
      </div>
    );
  }

  const filtered = users.filter(u =>
    u.nome.toLowerCase().includes(search.toLowerCase()) ||
    u.login.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-center text-[#070735] mb-6">Gestão de Usuários</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar por nome ou login..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-1/2 p-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        />
        <button
          onClick={() => nav('/gestao-usuarios/new')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Novo Usuário
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-[#eaf2ff]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">Carregando...</td>
              </tr>
            ) : filtered.length ? (
              filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{u.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.login}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{u.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{u.status_usuario}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => nav(`/gestao-usuarios/${u.id}`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">Nenhum usuário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;

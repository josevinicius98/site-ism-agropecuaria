import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  BarChart2,
  Megaphone,
  ShieldCheck,
  UserPlus,
  KeyRound,
  LogOut,
  Headset,
  Users2
} from 'lucide-react';

// --- Gestão de Usuários embutida aqui ---
interface Usuario {
  id: number;
  nome: string;
  login: string;
  role: string;
  status_usuario: string;
}
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [senhaNova, setSenhaNova] = useState<{[id: number]: string}>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const alterarSenha = async (id: number) => {
    if (!senhaNova[id] || senhaNova[id].length < 6) {
      setMsg('A senha precisa ter ao menos 6 caracteres.');
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/users/${id}/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: senhaNova[id] })
    });
    setLoading(false);
    setMsg(res.ok ? 'Senha alterada com sucesso!' : 'Erro ao alterar senha');
    setSenhaNova(s => ({ ...s, [id]: '' }));
  };

  const alterarStatus = async (id: number, status: 'ativo' | 'inativo') => {
    setLoading(true);
    const res = await fetch(`/api/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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
// --- Fim Gestão de Usuários ---

const Portal: React.FC = () => {
  const nav = useNavigate();
  const { logout, user: initialUser } = useAuth();

  const [userName, setUserName] = useState<string>(initialUser?.nome || '');
  const userRole = initialUser?.role || '';

  const baseButton = 'flex items-center gap-2 text-white font-semibold rounded-lg transition focus:outline-none';
  const sizes = 'py-2 px-6 text-base';
  const primaryColor = 'bg-[#070735] hover:bg-opacity-90';

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.nome) setUserName(data.nome);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-xl p-8 max-w-4xl w-full shadow-lg">
        <h1 className="text-4xl font-extrabold mb-4 text-[#070735] text-center">
          Portal do Colaborador
        </h1>
        <p className="text-lg font-semibold mb-6 text-gray-800 text-center">
          Olá, seja bem-vindo ao seu Portal{userName ? `, ${userName}` : ''}.
        </p>
        <p className="text-base mb-8 text-gray-600 text-center">
          Aqui você pode acessar seus dashboards, enviar solicitações e acompanhar suas atividades.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button onClick={() => nav('/links')} className={`${baseButton} ${sizes} ${primaryColor}`}>
            <BarChart2 size={20} /> Dashboards
          </button>
          <button onClick={() => nav('/denuncias')} className={`${baseButton} ${sizes} ${primaryColor}`}>
            <Megaphone size={20} /> Ouvidoria
          </button>
          {(userRole === 'admin' || userRole === 'rh' || userRole === 'compliance') && (
            <button onClick={() => nav('/admin/denuncias')} className={`${baseButton} ${sizes} ${primaryColor}`}>
              <ShieldCheck size={20} /> Gestão Ouvidoria
            </button>
          )}
          <button onClick={() => nav('/atendimento')} className={`${baseButton} ${sizes} ${primaryColor}`}>
            <Headset size={20} /> Suporte
          </button>
          {(userRole === 'admin' || userRole === 'rh' || userRole === 'compliance') && (
            <button onClick={() => nav('/painel-atendimentos')} className={`${baseButton} ${sizes} ${primaryColor}`}>
              <Users2 size={20} /> Painel de Suporte
            </button>
          )}
          {userRole === 'admin' && (
            <button onClick={() => nav('/cadastrar')} className={`${baseButton} ${sizes} ${primaryColor}`}>
              <UserPlus size={20} /> Cadastro de Usuário
            </button>
          )}
          {/* Botão sempre visível para alterar a própria senha */}
          <button onClick={() => nav('/alterar-senha')} className={`${baseButton} ${sizes} ${primaryColor}`}>
            <KeyRound size={20} /> Alterar Senha
          </button>
        </div>

        {/* --- Gestão de usuários visível só para admin/rh --- */}
        {(userRole === 'admin' || userRole === 'rh') && (
          <div className="mt-8 bg-gray-100 rounded-xl p-6 shadow">
            <h2 className="text-2xl font-bold text-[#070735] mb-4">Gestão de Usuários</h2>
            <UserManagement />
          </div>
        )}

        <button
          onClick={() => {
            logout();
            nav('/login');
          }}
          className={`${baseButton} ${sizes} ${primaryColor} mt-8`}
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
    </div>
  );
};

export default Portal;

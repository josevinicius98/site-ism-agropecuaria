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

interface Usuario {
  id: number;
  username: string; // campo retornado pelo backend em /api/users
  status_usuario: string; // ativo/inativo
}

const Portal: React.FC = () => {
  const nav = useNavigate();
  const { logout, user: initialUser, token } = useAuth();

  // Para exibir o nome
  const [userName, setUserName] = useState<string>(initialUser?.nome || '');
  const userRole = initialUser?.role || '';

  // Estado do painel admin/rh
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);

  // Botão base style
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

  // Carregar usuários se for admin ou rh
  useEffect(() => {
    if (userRole === 'admin' || userRole === 'rh') {
      setCarregandoUsuarios(true);
      fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : [])
        .then(async (data) => {
          // Recupera o status dos usuários individualmente (caso não venha no endpoint)
          // Se backend já retorna status_usuario em /api/users, remova o bloco abaixo!
          const promises = data.map(async (u: any) => {
            // Busca status no backend (pode ser melhorado no backend para retornar junto)
            const resp = await fetch(`/api/users/${u.id}/status`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const statusData = await resp.json();
            return { ...u, status_usuario: statusData.status_usuario || 'ativo' };
          });
          setUsuarios(await Promise.all(promises));
        })
        .catch(() => setUsuarios([]))
        .finally(() => setCarregandoUsuarios(false));
    }
  }, [userRole, token]);

  // Função: Alterar senha de usuário selecionado
  async function handleAlterarSenhaUsuario(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUserId || !novaSenha) return;
    setUserMsg('');
    try {
      const res = await fetch(`/api/users/${selectedUserId}/password`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: novaSenha })
      });
      if (res.ok) {
        setUserMsg('Senha alterada com sucesso!');
        setNovaSenha('');
        setSelectedUserId(null);
      } else {
        const data = await res.json();
        setUserMsg('Erro: ' + (data?.error || 'Erro ao alterar senha'));
      }
    } catch {
      setUserMsg('Erro ao alterar senha');
    }
  }

  // Função: Ativar/Inativar usuário
  async function handleToggleAtivo(id: number, novoStatus: string) {
    setUserMsg('');
    try {
      const res = await fetch(`/api/users/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status_usuario: novoStatus })
      });
      if (res.ok) {
        setUsuarios(usuarios.map(u =>
          u.id === id ? { ...u, status_usuario: novoStatus } : u
        ));
      } else {
        setUserMsg('Falha ao alterar status');
      }
    } catch {
      setUserMsg('Falha ao alterar status');
    }
  }

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
          {/* O botão "Alterar Senha" sempre aparece */}
          <button onClick={() => nav('/alterar-senha')} className={`${baseButton} ${sizes} ${primaryColor}`}>
            <KeyRound size={20} /> Alterar Senha
          </button>
        </div>

        {/* Painel RH/Admin para gestão de usuários */}
        {(userRole === 'admin' || userRole === 'rh') && (
          <div className="bg-gray-100 rounded-lg p-6 mt-8 shadow-inner">
            <h2 className="text-xl font-bold mb-3 text-blue-900">Gestão de Usuários</h2>
            {carregandoUsuarios ? (
              <div>Carregando usuários...</div>
            ) : (
              <div className="space-y-3">
                {usuarios.map(u => (
                  <div key={u.id} className="flex items-center gap-4 border-b py-2">
                    <div className="flex-1 font-semibold">{u.username}</div>
                    <div>
                      <span className={`px-3 py-1 rounded text-xs font-bold ${u.status_usuario === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.status_usuario}
                      </span>
                    </div>
                    <button
                      className="text-blue-900 hover:underline font-semibold"
                      onClick={() => setSelectedUserId(u.id)}
                    >
                      Alterar Senha
                    </button>
                    <button
                      className={`px-3 py-1 rounded ${u.status_usuario === 'ativo' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold`}
                      onClick={() => handleToggleAtivo(u.id, u.status_usuario === 'ativo' ? 'inativo' : 'ativo')}
                    >
                      {u.status_usuario === 'ativo' ? 'Inativar' : 'Ativar'}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {userMsg && <div className="mt-4 text-center text-blue-900 font-bold">{userMsg}</div>}

            {/* Modal/Box rápida para alterar senha */}
            {selectedUserId && (
              <form
                onSubmit={handleAlterarSenhaUsuario}
                className="mt-4 flex flex-col sm:flex-row items-center gap-3"
                style={{ borderTop: '1px solid #ccc', paddingTop: 16 }}
              >
                <input
                  type="password"
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Nova senha"
                  value={novaSenha}
                  minLength={6}
                  onChange={e => setNovaSenha(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
                >
                  Salvar Nova Senha
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedUserId(null); setNovaSenha(''); }}
                  className="ml-2 text-red-700 font-bold underline"
                >
                  Cancelar
                </button>
              </form>
            )}
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

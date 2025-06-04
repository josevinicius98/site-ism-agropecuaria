import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface Atendimento {
  id: number;
  usuario_id: number;
  nome_usuario: string;
  criado_em: string;
  status: string;
}

const PainelAtendimentosPage: React.FC = () => {
  const { token, user } = useAuth();
  const nav = useNavigate();
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    if (!token || !user?.role || !['admin', 'rh', 'compliance'].includes(user.role)) {
      nav('/login');
      return;
    }
    fetch('/api/atendimentos', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Acesso negado ou erro ao carregar atendimentos');
        return res.json();
      })
      .then(data => setAtendimentos(data))
      .catch(err => setErro(err.message))
      .finally(() => setLoading(false));
  }, [token, nav, user?.role]);

  // Filtro em tempo real (nome ou data)
  const atendimentosFiltrados = atendimentos.filter(a =>
    a.nome_usuario.toLowerCase().includes(filtro.toLowerCase()) ||
    a.criado_em.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <div className="text-center mt-16">Carregando atendimentos...</div>;
  if (erro) return <div className="text-red-600 text-center mt-10">{erro}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full">
        <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">Painel de Atendimentos</h2>
        <div className="flex items-center mb-6">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-blue-50 w-full max-w-sm">
            <Search className="text-blue-800 mr-2" size={20} />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-blue-900 text-lg"
              placeholder="Filtrar por nome ou data..."
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
          </div>
        </div>
        {atendimentosFiltrados.length === 0 ? (
          <div className="text-center text-gray-400">Nenhum atendimento registrado.</div>
        ) : (
          <table className="w-full text-left border-t border-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Colaborador</th>
                <th className="p-2">Data</th>
                <th className="p-2">Status</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {atendimentosFiltrados.map((a) => (
                <tr key={a.id} className="border-b hover:bg-blue-50/60">
                  <td className="p-2">{a.id}</td>
                  <td className="p-2">{a.nome_usuario}</td>
                  <td className="p-2">{new Date(a.criado_em).toLocaleString()}</td>
                  <td className="p-2">
                    <span className={`rounded px-3 py-1 text-xs font-bold
                      ${a.status === 'aberto'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-700'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      className="text-blue-700 hover:underline"
                      onClick={() => nav(`/atendimento-suporte/${a.id}`)}
                    >
                      Abrir Chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PainelAtendimentosPage;

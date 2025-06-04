import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

// Tipo alinhado com o banco
interface Denuncia {
  id: number;
  nome?: string | null;
  categoria: string;
  descricao: string;
  anonimato: boolean;
  criado_em: string;
  status?: string;
}

const AdminDenuncias: React.FC = () => {
  const { token, user } = useAuth();
  const nav = useNavigate();
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [detalhe, setDetalhe] = useState<Denuncia | null>(null);

  useEffect(() => {
if (!token || !user?.role || !['admin', 'rh', 'compliance'].includes(user.role)) {
      nav('/login');
      return;
    }
    fetch('/api/admin/denuncias', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Acesso negado ou erro ao carregar denúncias');
        return res.json();
      })
      .then(data => setDenuncias(data))
      .catch(err => setErro(err.message))
      .finally(() => setLoading(false));
  }, [token, nav, user?.role]);

  if (loading) return <div className="text-center py-12 text-lg">Carregando denúncias...</div>;
  if (erro) return <div className="text-red-600 text-center py-8">{erro}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-8 text-blue-900 mt-8">Gestão de Denúncias</h2>
        {denuncias.length === 0 ? (
          <div className="text-center text-gray-500">Nenhuma denúncia registrada.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-t border-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Categoria</th>
                  <th className="p-2">Data</th>
                  <th className="p-2">Anonimato</th>
                  <th className="p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {denuncias.map((d) => (
                  <tr key={d.id} className="border-b hover:bg-blue-50/60">
                    <td className="p-2">{d.id}</td>
                    <td className="p-2">{d.categoria}</td>
                    <td className="p-2">{new Date(d.criado_em).toLocaleString()}</td>
                    <td className="p-2">{d.anonimato ? 'Sim' : 'Não'}</td>
                    <td className="p-2">
                      <button
                        className="text-blue-700 hover:underline"
                        onClick={() => setDetalhe(d)}
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Modal Detalhes */}
        {detalhe && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded shadow-lg p-8 max-w-md w-full animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-blue-900">Detalhes da Denúncia</h3>
              <p><b>ID:</b> {detalhe.id}</p>
              <p><b>Categoria:</b> {detalhe.categoria}</p>
              <p><b>Data:</b> {new Date(detalhe.criado_em).toLocaleString()}</p>
              <p><b>Anonimato:</b> {detalhe.anonimato ? 'Sim' : 'Não'}</p>
              <p><b>Nome:</b> {detalhe.nome || '—'}</p>
              <div className="mb-4 mt-2"><b>Descrição:</b><br /><span className="block whitespace-pre-line">{detalhe.descricao}</span></div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDetalhe(null)}
                  className="bg-blue-700 hover:bg-blue-900 text-white px-4 py-2 rounded"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDenuncias;

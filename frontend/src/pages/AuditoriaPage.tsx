import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

interface Log {
  id: number;
  usuario_nome: string;
  login: string;
  acao: string;
  detalhes: string;
  data_hora: string;
}

const AuditoriaPage: React.FC = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [erro, setErro] = useState('');

  // Filtros
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [usuario, setUsuario] = useState('');
  const [acao, setAcao] = useState('');

  useEffect(() => {
    fetch('/api/auditoria', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject('Erro ao buscar auditoria'))
      .then(setLogs)
      .catch(e => setErro('Falha ao buscar logs: ' + e));
  }, [token]);

  // Função de filtro
  const logsFiltrados = logs.filter(log => {
    // Data
    const dt = new Date(log.data_hora);
    if (dataInicio && dt < new Date(dataInicio)) return false;
    if (dataFim && dt > new Date(dataFim + 'T23:59:59')) return false;
    // Usuário
    if (usuario && !log.usuario_nome.toLowerCase().includes(usuario.toLowerCase())) return false;
    // Ação
    if (acao && !log.acao.toLowerCase().includes(acao.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="bg-white rounded-xl p-8 w-full max-w-4xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#070735]">Auditoria do Sistema</h1>
        {erro && <div className="text-red-600 mb-4 text-center">{erro}</div>}

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-6 items-end justify-between">
          <div>
            <label className="block text-xs font-bold mb-1">Data Inicial</label>
            <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)}
              className="border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Data Final</label>
            <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)}
              className="border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Usuário</label>
            <input type="text" placeholder="Nome do usuário" value={usuario}
              onChange={e => setUsuario(e.target.value)} className="border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Ação</label>
            <input type="text" placeholder="Ação (ex: login)" value={acao}
              onChange={e => setAcao(e.target.value)} className="border rounded px-2 py-1" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="pb-2">Data/Hora</th>
                <th className="pb-2">Usuário</th>
                <th className="pb-2">Login</th>
                <th className="pb-2">Ação</th>
                <th className="pb-2">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {logsFiltrados.map(log => (
                <tr key={log.id} className="border-t">
                  <td>{new Date(log.data_hora).toLocaleString()}</td>
                  <td>{log.usuario_nome}</td>
                  <td>{log.login}</td>
                  <td>{log.acao}</td>
                  <td>{log.detalhes}</td>
                </tr>
              ))}
              {logsFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AuditoriaPage;

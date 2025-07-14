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

  useEffect(() => {
    fetch('/api/auditoria', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject('Erro ao buscar auditoria'))
      .then(setLogs)
      .catch(e => setErro('Falha ao buscar logs: ' + e));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="bg-white rounded-xl p-8 w-full max-w-4xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#070735]">Auditoria do Sistema</h1>
        {erro && <div className="text-red-600 mb-4 text-center">{erro}</div>}
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
            {logs.map(log => (
              <tr key={log.id} className="border-t">
                <td>{new Date(log.data_hora).toLocaleString()}</td>
                <td>{log.usuario_nome}</td>
                <td>{log.login}</td>
                <td>{log.acao}</td>
                <td>{log.detalhes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditoriaPage;

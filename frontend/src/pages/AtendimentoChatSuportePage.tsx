import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useParams } from 'react-router-dom';

interface Mensagem {
  id: number;
  atendimento_id: number;
  remetente: string;
  mensagem: string;
  enviado_em: string;
  tipo?: string; // adicionado
}

const AtendimentoChatSuportePage: React.FC = () => {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState('');
  const [erro, setErro] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true); // <- flag para evitar scroll inicial

  useEffect(() => {
    if (!id) return;
    const fetchMensagens = async () => {
      try {
        const res = await fetch(`/api/atendimentos/${id}/mensagens`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMensagens(prev => {
          // Só rola para o fim se não for o primeiro carregamento e aumentou o número de mensagens
          if (!isFirstLoad.current && data.length > prev.length) {
            setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
          }
          return data;
        });
        // Primeira carga feita
        isFirstLoad.current = false;
      } catch (e) {
        setErro('Erro ao buscar mensagens');
      }
    };
    fetchMensagens();
    const interval = setInterval(fetchMensagens, 3500);
    return () => clearInterval(interval);
  }, [token, id]);

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim() || !id) return;
    try {
      await fetch(`/api/atendimentos/${id}/mensagens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mensagem: texto.trim() })
      });
      setTexto('');
      // Após enviar, rola para o final:
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) {
      setErro('Erro ao enviar mensagem');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 pt-8">
      <div className="bg-white shadow-lg rounded-xl max-w-xl w-full flex flex-col h-[70vh]">
        <div className="p-4 border-b text-lg font-bold text-blue-900 text-center">Atendimento ao Colaborador</div>
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {mensagens.length === 0 && (
            <div className="text-gray-400 text-center">Nenhuma mensagem ainda...</div>
          )}
          {mensagens.map(m => (
            <div
              key={m.id}
              className={`flex ${m.remetente === 'suporte' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] px-4 py-2 rounded-xl shadow text-white ${
                m.remetente === 'suporte'
                  ? 'bg-blue-900 self-end'
                  : 'bg-gray-400 self-start'
              }`}>
                {/* Tratamento arquivo/texto */}
                {m.tipo === 'arquivo' ? (() => {
                  let arquivo = { url: '', nome: '' };
                  try { arquivo = JSON.parse(m.mensagem); } catch {}
                  const urlCompleta = arquivo.url.startsWith('http')
                    ? arquivo.url
                    : `http://localhost:3001${arquivo.url}`;
                  if (arquivo.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    return (
                      <a href={urlCompleta} target="_blank" rel="noopener noreferrer">
                        <img src={urlCompleta} alt={arquivo.nome} className="max-h-40 rounded" />
                        <div className="text-xs mt-1 underline">{arquivo.nome}</div>
                      </a>
                    );
                  }
                  return (
                    <a href={urlCompleta} target="_blank" rel="noopener noreferrer" className="underline">
                      {arquivo.nome}
                    </a>
                  );
                })() : (
                  <div className="text-sm">{m.mensagem}</div>
                )}
                <div className="text-xs text-right mt-1 opacity-70">{new Date(m.enviado_em).toLocaleString()}</div>
              </div>
            </div>
          ))}
          <div ref={endRef}></div>
        </div>
        <form onSubmit={enviarMensagem} className="flex p-4 border-t gap-2 bg-gray-50">
          <input
            className="flex-1 px-3 py-2 border rounded-lg"
            placeholder="Digite sua mensagem..."
            value={texto}
            onChange={e => setTexto(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-900 text-white rounded-lg px-5 py-2 font-bold hover:bg-blue-700 transition"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AtendimentoChatSuportePage;

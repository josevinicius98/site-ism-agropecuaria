import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../AuthContext';
import { UploadCloud } from 'lucide-react';

interface Mensagem {
  id: number;
  atendimento_id: number;
  remetente: string;
  mensagem: string;
  enviado_em: string;
  tipo?: string; // 'texto' ou 'arquivo'
}

const AtendimentoChatPage: React.FC = () => {
  const { token, user } = useAuth();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [atendimentoId, setAtendimentoId] = useState<number | null>(null);
  const [texto, setTexto] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [status, setStatus] = useState<'aberto' | 'fechado'>('aberto');
  const [mensagemInfo, setMensagemInfo] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);

  // Carrega ou cria atendimento
  useEffect(() => {
    const fetchAtendimento = async () => {
      setCarregando(true);
      setErro('');
      try {
        const res = await fetch('/api/atendimentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });
        const data = await res.json();
        setAtendimentoId(data.atendimentoId);

        // Buscar status do atendimento
        if (data.atendimentoId) {
          const resStatus = await fetch(`/api/atendimentos`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const atendimentos = await resStatus.json();
          const meuAtendimento = atendimentos.find((a: any) => a.id === data.atendimentoId);
          if (meuAtendimento) setStatus(meuAtendimento.status);
        }
      } catch (e) {
        setErro('Erro ao iniciar atendimento');
      }
      setCarregando(false);
    };
    fetchAtendimento();
  }, [token]);

  // Carrega mensagens
  useEffect(() => {
    if (!atendimentoId) return;
    const fetchMensagens = async () => {
      try {
        const res = await fetch(`/api/atendimentos/${atendimentoId}/mensagens`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMensagens(prev => {
          if (!isFirstLoad.current && data.length > prev.length) {
            setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
          }
          return data;
        });

        // Atualiza status do atendimento
        const resStatus = await fetch(`/api/atendimentos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const atendimentos = await resStatus.json();
        const meuAtendimento = atendimentos.find((a: any) => a.id === atendimentoId);
        if (meuAtendimento) setStatus(meuAtendimento.status);

        isFirstLoad.current = false;
      } catch (e) {
        setErro('Erro ao buscar mensagens');
      }
    };
    fetchMensagens();
    const interval = setInterval(fetchMensagens, 3500);
    return () => clearInterval(interval);
  }, [token, atendimentoId]);

  // Envia mensagem de texto
  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim() || !atendimentoId || status !== 'aberto') return;
    try {
      await fetch(`/api/atendimentos/${atendimentoId}/mensagens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mensagem: texto.trim() })
      });
      setTexto('');
      // Após enviar, rola para o fim
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) {
      setErro('Erro ao enviar mensagem');
    }
  };

  // Envia arquivo (upload)
  const handleUpload = async (file: File) => {
    if (!atendimentoId || !file) return;
    const formData = new FormData();
    formData.append('arquivo', file);

    try {
      const res = await fetch(`/api/atendimentos/${atendimentoId}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setMensagemInfo('Arquivo enviado!');
      } else if (data.error) {
        setMensagemInfo(data.error);
      }
      // Após upload, rola para o fim
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch {
      setMensagemInfo('Falha ao enviar arquivo');
    }
  };

  // Encerrar o chat
  const encerrarAtendimento = async () => {
    if (!atendimentoId) return;
    try {
      const res = await fetch(`/api/atendimentos/${atendimentoId}/fechar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMensagemInfo('Atendimento encerrado com sucesso.');
        setStatus('fechado');
      } else {
        setErro(data.error || 'Erro ao encerrar atendimento');
      }
    } catch (e) {
      setErro('Erro ao encerrar atendimento');
    }
  };

  if (carregando) return <div className="text-center mt-20">Carregando atendimento...</div>;
  if (erro) return <div className="text-center text-red-700 mt-10">{erro}</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f7f8fa] pt-24 pb-8">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl flex flex-col h-[75vh] px-0 sm:px-8">
        <div className="p-6 border-b rounded-t-2xl text-2xl font-bold text-blue-900 text-center bg-gradient-to-r from-[#eaf2ff] to-[#f6faff]">
          Atendimento ao Colaborador
          {user && (
            <div className="text-base font-medium text-blue-700 mt-1">
              {user.nome}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {mensagemInfo && (
            <div className="text-center text-green-700 font-bold mb-3">{mensagemInfo}</div>
          )}
          {status === 'fechado' && (
            <div className="text-center text-orange-700 font-semibold mb-3">
              Este atendimento foi encerrado.<br />Caso precise, inicie um novo chamado.
            </div>
          )}
          {mensagens.length === 0 && (
            <div className="text-gray-400 text-center">Inicie a conversa com o suporte...</div>
          )}
          {mensagens.map(m => (
            <div
              key={m.id}
              className={`flex ${m.remetente === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-white ${
                m.remetente === 'usuario'
                  ? 'bg-blue-900 self-end'
                  : 'bg-gray-400 self-start'
              }`}>
                {m.tipo === 'arquivo' ? (() => {
                  let arquivo = { url: '', nome: '' };
                  try { arquivo = JSON.parse(m.mensagem); } catch {}
                  if (arquivo.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    return (
                      <a href={arquivo.url} target="_blank" rel="noopener noreferrer">
                        <img src={arquivo.url} alt={arquivo.nome} className="max-h-40 rounded" />
                        <div className="text-xs mt-1 underline">{arquivo.nome}</div>
                      </a>
                    );
                  }
                  // Outros tipos de documento
                  return (
                    <a href={arquivo.url} target="_blank" rel="noopener noreferrer" className="underline">
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
        {/* Formulário de envio */}
        <form
          onSubmit={enviarMensagem}
          className={`flex items-center p-6 border-t gap-3 bg-[#f7f8fa] rounded-b-2xl relative ${dragActive ? 'border-4 border-blue-400' : ''}`}
          onDragOver={e => {
            e.preventDefault(); e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={e => {
            e.preventDefault(); e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={e => {
            e.preventDefault(); e.stopPropagation();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleUpload(e.dataTransfer.files[0]);
            }
          }}
        >
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            style={{ display: 'none' }}
            id="fileUploadInput"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                handleUpload(e.target.files[0]);
              }
            }}
          />
          <label
            htmlFor="fileUploadInput"
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition"
            title="Enviar arquivo"
          >
            <UploadCloud size={28} className="text-blue-800" />
          </label>
          <input
            className="flex-1 px-4 py-3 border rounded-xl bg-white text-lg"
            placeholder={status === 'fechado' ? "Atendimento encerrado" : "Digite sua mensagem..."}
            value={texto}
            onChange={e => setTexto(e.target.value)}
            disabled={status === 'fechado'}
            required
          />
          <button
            type="submit"
            className={`bg-blue-900 text-white rounded-xl px-8 py-3 font-bold text-lg shadow transition ${status === 'fechado' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={status === 'fechado'}
          >
            Enviar
          </button>
          {/* Botão de encerrar visível só se atendimento aberto */}
          {status === 'aberto' && (
            <button
              type="button"
              onClick={encerrarAtendimento}
              className="ml-2 bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-3 font-bold text-lg shadow transition"
            >
              Encerrar Chat
            </button>
          )}
          {/* Feedback visual drag-and-drop */}
          {dragActive && (
            <div className="absolute inset-0 bg-blue-100/80 flex items-center justify-center text-blue-900 text-lg font-bold rounded-2xl pointer-events-none z-10">
              Solte o arquivo para enviar
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AtendimentoChatPage;

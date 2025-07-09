import React, { useState } from 'react';
import SectionTitle from '../components/SectionTitle';

interface DenunciaForm {
  nome: string;
  categoria: string;
  descricao: string;
  anonimato: boolean;
}

const DenunciaPage: React.FC = () => {
  const [form, setForm] = useState<DenunciaForm>({
    nome: '',
    categoria: '',
    descricao: '',
    anonimato: true,
  });
  const [status, setStatus] = useState('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    try {
      const res = await fetch('/api/denuncias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('Sua denúncia foi registrada. Obrigado.');
      setForm({ nome: '', categoria: '', descricao: '', anonimato: true });
    } catch {
      setStatus('Falha ao enviar. Tente novamente.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-10 w-full max-w-xl mt-10">
        <SectionTitle
          centered
          title="Fale com a gente!"
          subtitle="Sua opinião é muito importante e será tratada com total confidencialidade e segurança. Você pode optar por permanecer anônimo."
        />
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Campo nome */}
          <div>
            <label htmlFor="nome" className="block font-medium mb-1">
              Nome (opcional)
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Seu nome ou anonimamente"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={form.anonimato}
            />
          </div>

          {/* Categoria */}
          <div>
            <label htmlFor="categoria" className="block font-medium mb-1">
              Categoria <span className="text-red-600">*</span>
            </label>
            <select
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Sugestão">Sugestão</option>
              <option value="Crítica">Crítica</option>
              <option value="Assédio">Assédio</option>
              <option value="Corrupção">Corrupção</option>
              <option value="Fraude">Fraude</option>
              <option value="Ambiental">Ambiental</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="descricao" className="block font-medium mb-1">
              Descrição <span className="text-red-600">*</span>
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows={5}
              value={form.descricao}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Anonimato */}
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="anonimato"
              name="anonimato"
              checked={form.anonimato}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="anonimato" className="text-gray-700">
              Desejo permanecer anônimo
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Enviar Formulário
          </button>

          {status && (
            <p
              className={`mt-2 text-center font-semibold ${
                status.startsWith('Falha') ? 'text-red-600' : 'text-green-700'
              }`}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default DenunciaPage;

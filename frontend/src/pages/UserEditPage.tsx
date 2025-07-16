// src/pages/UserEditPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

interface Usuario { id: number; nome: string; login: string; role: string; status_usuario: string; }

const cargos = [
  { value: "colaborador", label: "Colaborador" },
  { value: "admin", label: "Admin" },
  { value: "rh", label: "RH" },
  { value: "compliance", label: "Compliance" }
];

const UserEditPage: React.FC = () => {
  const { token, user } = useAuth();
  const nav = useNavigate();
  const { id } = useParams<{id: string}>();
  const [form, setForm] = useState<Partial<Usuario>>({});
  const [msg, setMsg] = useState<string | null>(null);

  // apenas admin/rh
  if (!['admin','rh'].includes(user?.role || '')) {
    return <p>Acesso negado.</p>;
  }

  useEffect(() => {
    if (!token) return;
    fetch(`/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then((u: Usuario) => setForm(u));
  }, [id, token]);

  const handleChange = (field: keyof Usuario, v: string) => {
    setForm(f => ({ ...f, [field]: v }));
  };

  const salvar = async () => {
    const payload = {
      nome: form.nome!,
      login: form.login!,
      role: form.role!,
      status_usuario: form.status_usuario!
    };
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type':'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (res.ok) {
      setMsg('Usuário salvo!');
      setTimeout(() => nav('/gestao-usuarios'), 1500);
    } else {
      setMsg(json.error || 'Erro');
    }
  };

  const excluir = async () => {
    if (!confirm('Confirma exclusão deste usuário?')) return;
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) nav('/gestao-usuarios');
    else setMsg('Falha ao excluir');
  };

  return (
    <div>
      <h1>Editar Usuário #{id}</h1>
      {msg && <p>{msg}</p>}
      <div>
        <label>Nome</label>
        <input
          value={form.nome || ''}
          onChange={e => handleChange('nome', e.target.value)}
        />
      </div>
      <div>
        <label>Login</label>
        <input
          value={form.login || ''}
          onChange={e => handleChange('login', e.target.value)}
        />
      </div>
      <div>
        <label>Cargo</label>
        <select
          value={form.role || ''}
          onChange={e => handleChange('role', e.target.value)}
        >
          {cargos.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
      <div>
        <label>Status</label>
        <select
          value={form.status_usuario || ''}
          onChange={e => handleChange('status_usuario', e.target.value)}
        >
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>
      <button onClick={salvar}>Salvar</button>
      <button onClick={excluir} style={{marginLeft:8, color:'red'}}>Excluir</button>
      <button onClick={() => nav('/gestao-usuarios')} style={{marginLeft:8}}>Voltar</button>
    </div>
  );
};

export default UserEditPage;

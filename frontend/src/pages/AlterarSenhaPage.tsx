import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

interface User { id: number; username: string; }

const AlterarSenhaPage: React.FC = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [targetUserId, setTargetUserId] = useState<number>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  if (!user) return <div className="text-center py-8">Carregando...</div>;

  useEffect(() => {
    if ((user.role === 'admin' || user.role === 'rh')) {
      axios.get<User[]>('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((resp) => {
        setUsers(resp.data);
        if (resp.data.length > 0) setTargetUserId(resp.data[0].id);
      })
      .catch(() => setMessage('Falha ao carregar usuários.'));
    }
  }, [user.role, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    try {
      if ((user.role === 'admin' || user.role === 'rh') && targetUserId) {
        // Admin/RH trocando senha de outro usuário
        await axios.patch(
          `/api/users/${targetUserId}/password`,
          { password: newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage('Senha do usuário atualizada com sucesso.');
      } else if (user.primeiro_login) {
        // PRIMEIRO LOGIN: POST em /api/alterar-senha (não exige senha atual)
        await axios.post(
          '/api/alterar-senha',
          { novaSenha: newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage('Senha alterada com sucesso! Faça login novamente.');
        setCurrentPassword('');
      } else {
        // Usuário comum trocando a própria senha (exige senha atual)
        await axios.post(
          '/api/alterar-senha',
          { senhaAtual: currentPassword, novaSenha: newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage('Senha alterada com sucesso.');
        setCurrentPassword('');
      }
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Erro ao alterar senha.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Alterar Senha</h2>
      <form onSubmit={handleSubmit}>
        {(user.role === 'admin' || user.role === 'rh') && (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Selecione um usuário:</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={targetUserId}
              onChange={e => setTargetUserId(Number(e.target.value))}
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          </div>
        )}

        {!(user.role === 'admin' || user.role === 'rh' || user.primeiro_login) && (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Senha Atual:</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Nova Senha:</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Confirme a Nova Senha:</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {message && <p className="mb-4 text-center text-red-600">{message}</p>}

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
        >
          {(user.role === 'admin' || user.role === 'rh')
            ? 'Atualizar Senha do Usuário'
            : 'Alterar Minha Senha'}
        </button>
      </form>
    </div>
  );
};

export default AlterarSenhaPage;

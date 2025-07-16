// src/pages/UserManagementPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

interface Usuario { id: number; nome: string; login: string; role: string; status_usuario: string; }

const UserManagementPage: React.FC = () => {
  const { token, user } = useAuth();
  const nav = useNavigate();
  const [users, setUsers] = useState<Usuario[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setUsers);
  }, [token]);

  // só admin/rh vê a listagem
  if (!['admin','rh'].includes(user?.role || '')) {
    return <p>Acesso negado.</p>;
  }

  return (
    <div>
      <h1>Usuários cadastrados</h1>
      <table>
        <thead><tr><th>Nome</th><th>Login</th><th>Cargo</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.nome}</td>
              <td>{u.login}</td>
              <td>{u.role}</td>
              <td>{u.status_usuario}</td>
              <td>
                <button onClick={() => nav(`/gestao-usuarios/${u.id}`)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementPage;

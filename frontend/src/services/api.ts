const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function login(login: string, senha: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, senha }),
  });

  if (!response.ok) {
    throw new Error('Erro ao fazer login');
  }

  return await response.json();
}

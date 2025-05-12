// src/pages/LoginPage.tsx

import React, { useState } from 'react';                 // Importa React e o hook useState para gerenciar estado local
import { useNavigate } from 'react-router-dom';           // Importa o hook de navegação do React Router

interface LoginForm {                                     // Define a interface para o estado do formulário
  username: string;                                      //   campo para o nome de usuário
  password: string;                                      //   campo para a senha
}

const LoginPage: React.FC = () => {                       // Declara o componente funcional LoginPage
  const [form, setForm] = useState<LoginForm>({           // Estado `form` guarda os valores dos inputs
    username: '',                                         //   inicia `username` vazio
    password: ''                                          //   inicia `password` vazio
  });
  const [error, setError] = useState('');                 // Estado `error` guarda mensagem de erro de login
  const navigate = useNavigate();                         // Hook para redirecionar o usuário a outras rotas

  const handleSubmit = async (e: React.FormEvent) => {    // Função chamada ao submeter o formulário
    e.preventDefault();                                   //   previne o reload da página padrão do navegador
    try {
      const res = await fetch('/api/login', {             //   faz request POST para a rota de login
        method: 'POST',                                   //     método HTTP
        headers: {                                        //     cabeçalhos informando que é JSON
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(form),                       //     transforma o estado `form` em JSON para envio
      });
      if (!res.ok) throw new Error('Credenciais inválidas'); //   se status diferente de 2xx, lança erro
      const { token } = await res.json();                 //   lê o JSON de resposta e extrai o token JWT
      localStorage.setItem('portal_token', token);        //   armazena o token no localStorage para autenticação
      navigate('/links');                                 //   redireciona o usuário para a página de links
    } catch (err: any) {
      setError(err.message);                              //   em caso de erro, atualiza o estado `error` para exibir mensagem
    }
  };

  return (                                                // Renderiza o JSX do componente
    <div className="container-custom py-20 max-w-md mx-auto"> {/* Container centralizado com padding e largura máxima */}
      <h2 className="text-2xl font-bold mb-4">Login</h2>  {/* Título da página */}
      {error && <div className="mb-4 text-red-500">{error}</div>} {/* Exibe erro caso exista */}
      <form onSubmit={handleSubmit} className="space-y-4"> {/* Form com espaçamento vertical entre campos */}
        <input
          name="username"                                  //   input para usuário, nome do campo "username"
          value={form.username}                           //   valor controlado pelo estado `form.username`
          onChange={e => setForm(prev => ({               //   ao digitar, atualiza apenas o campo `username`
            ...prev,
            username: e.target.value
          }))}
          placeholder="Usuário"                           //   texto guia dentro do campo
          required                                        //   marca o campo como obrigatório
          className="w-full p-2 border rounded"           //   classes Tailwind para estilo
        />
        <input
          type="password"                                 //   campo do tipo password, oculta o texto digitado
          name="password"                                 //   nome do campo "password"
          value={form.password}                           //   valor controlado pelo estado `form.password`
          onChange={e => setForm(prev => ({               //   ao digitar, atualiza apenas o campo `password`
            ...prev,
            password: e.target.value
          }))}
          placeholder="Senha"                             //   texto guia dentro do campo
          required                                        //   campo obrigatório
          className="w-full p-2 border rounded"           //   classes Tailwind para estilo
        />
        <button type="submit" className="btn-primary w-full py-2"> {/* Botão de submit, ocupa toda a largura */}
          Entrar                                           {/* Texto do botão */}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;                                // Exporta o componente para ser usado em outras partes do app


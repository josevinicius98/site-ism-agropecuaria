import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import UserManagement from '../components/UserManagement'; // <-- Use apenas assim!
import {
  BarChart2, Megaphone, ShieldCheck, UserPlus, KeyRound,
  LogOut, Headset, Users2
} from 'lucide-react';

const Portal: React.FC = () => {
  const nav = useNavigate();
  const { logout, user: initialUser } = useAuth();
  const [userName, setUserName] = useState<string>(initialUser?.nome || '');
  const userRole = initialUser?.role || '';

  const baseButton = 'flex items-center gap-2 text-white font-semibold rounded-lg transition focus:outline-none';
  const sizes = 'py-2 px-6 text-base';
  const primaryColor = 'bg-[#070735] hover:bg-opacity-90';

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.nome) setUserName(data.nome);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-xl p-8 max-w-4xl w-full shadow-lg">
        <h1 className="text-4xl font-extrabold mb-4 text-[#070735] text-center">
          Portal do Colaborador
        </h1>
        <p className="text-lg font-semibold mb-6 text-gray-800 text-center">
          Olá, seja bem-vindo ao seu Portal{userName ? `, ${userName}` : ''}.
        </p>
        <p className="text-base mb-8 text-gray-600 text-center">
          Aqui você pode acessar seus dashboards, enviar solicitações e acompanhar suas atividades.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button onClick={() => nav('/links')} className={`${baseButton} ${sizes} ${primaryColor}`}>
            <BarChart2 size={20} /> Dashboards
          </button>
          <button onClick={() => nav('/denuncias')} className={`${baseButton} ${sizes} ${primaryColor}`}>
            <Megaphone size={20} /> Ouvidoria
          </button>
          {(userRole === 'admin' || userRole === 'rh' || userRole === 'compliance') && (
            <button onClick={() => nav('/admin/denuncias')} className={`${baseButton} ${sizes} ${primaryColor}`}>
              <ShieldCheck size={20} /> Gestão Ouvidoria
            </button>
          )}
          <button onClick={() => nav('/atendimento')} className={`${baseButton} ${sizes} ${primaryColor}`}>
            <Headset size={20} /> Suporte
          </button>
          {(userRole === 'admin' || userRole === 'rh' || userRole === 'compliance') && (
            <button onClick={() => nav('/painel-atendimentos')} className={`${baseButton} ${sizes} ${primaryColor}`}>
              <Users2 size={20} /> Painel de Suporte
            </button>
          )}
          {userRole === 'admin' && (
            <button onClick={() => nav('/cadastrar')} className={`${baseButton} ${sizes} ${primaryColor}`}>
              <UserPlus size={20} /> Cadastro de Usuário
            </button>
          )}
          {/* Botão sempre visível para alterar a própria senha */}
          <button onClick={() => nav('/alterar-senha')} className={`${baseButton} ${sizes} ${primaryColor}`}>
            <KeyRound size={20} /> Alterar Senha
          </button>

          {(userRole === 'admin' || userRole === 'rh') && (
          <button onClick={() => nav('/gestao-usuarios')} className={`${baseButton} ${sizes} ${primaryColor}`}>
            <Users2 size={20} /> Gestão de Usuários
          </button>
          )} 
          
          {userRole === 'admin' && (
          <button onClick={() => nav('/auditoria')} className={`${baseButton} ${sizes} ${primaryColor}`}>
            <ShieldCheck size={20} /> Auditoria
          </button>
          )}

        </div>

        <button
          onClick={() => {
            logout();
            nav('/login');
          }}
          className={`${baseButton} ${sizes} ${primaryColor} mt-8`}
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
    </div>
  );
};

export default Portal;

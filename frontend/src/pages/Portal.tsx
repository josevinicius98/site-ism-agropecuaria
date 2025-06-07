import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  BarChart2,
  Megaphone,
  ShieldCheck,
  UserPlus,
  KeyRound,
  LogOut,
  Headset,
  Users2
} from 'lucide-react';

const Portal: React.FC = () => {
  const nav = useNavigate();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pb-10">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-4xl w-full flex flex-col items-center mt-14">
        <h1 className="text-5xl font-bold mb-10 text-blue-1000 text-center drop-shadow-sm">
          Portal do Colaborador
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 w-full">
          <button
            onClick={() => nav('/links')}
            className="flex items-center gap-2 bg-[#070735] hover:bg-blue-900 text-white py-5 px-8 rounded-2xl text-xl font-semibold shadow transition-all justify-center"
          >
            <BarChart2 size={28} /> Dashboards
          </button>
          <button
            onClick={() => nav('/denuncias')}
            className="flex items-center gap-2 bg-[#070735] hover:bg-blue-900 text-white py-5 px-8 rounded-2xl text-xl font-semibold shadow transition-all justify-center"
          >
            <Megaphone size={28} /> Ouvidoria
          </button>
          {(user?.role === 'admin' || user?.role === 'rh' || user?.role === 'compliance') && (
            <button
              onClick={() => nav('/admin/denuncias')}
              className="flex items-center gap-2 bg-[#070735]
              s hover:bg-[#070735] text-white py-5 px-8 rounded-2xl text-xl font-semibold shadow transition-all justify-center"
            >
              <ShieldCheck size={28} /> Gestão Ouvidoria
            </button>
          )}
          
          {/* Botão de Suporte visível para todos */}
          <button
            onClick={() => nav('/atendimento')}
            className="flex items-center gap-2 bg-[#070735] hover:bg-blue-900 text-white py-5 px-8 rounded-2xl text-xl font-semibold shadow transition-all justify-center"
          >
            <Headset size={28} /> Suporte
          </button>
          {/* Painel do Suporte/Admin/RH */}
          {(user?.role === 'admin' || user?.role === 'rh' || user?.role === 'compliance') && (
            <button
              onClick={() => nav('/painel-atendimentos')}
              className="flex items-center gap-2 bg-[#070735] hover:bg-[#070735] text-white py-5 px-8 rounded-2xl text-xl font-semibold shadow transition-all justify-center"
            >
              <Users2 size={28} /> Painel de Suporte
            </button>
          )}
          {user?.role === 'admin' && (
            <button
              onClick={() => nav('/cadastrar')}
              className="flex items-center gap-2 bg-green-800 hover:bg-green-800 text-white py-5 px-8 rounded-2xl text-xl font-semibold shadow transition-all justify-center"
            >
              <UserPlus size={28} /> Cadastro de Usuário
            </button>
          )}
          {user && (
            <button
              onClick={() => nav('/alterar-senha')}
              className="flex items-center gap-2 bg-yellow-800 hover:bg-yellow-800 text-white py-5 px-8 rounded-2xl text-xl font-semibold shadow transition-all justify-center"
            >
              <KeyRound size={28} /> Alterar Senha
            </button>
          )}
        </div>
        <button
          onClick={() => {
            logout();
            nav('/login');
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-10 py-3 text-xl rounded-2xl font-semibold shadow transition-all mt-2 justify-center"
        >
          <LogOut size={24} /> Sair
        </button>
      </div>
    </div>
  );
};

export default Portal;

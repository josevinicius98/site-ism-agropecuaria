import React from 'react';
import UserManagement from '../components/UserManagement';

const UserManagementPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
    <div className="bg-white rounded-xl p-8 max-w-4xl w-full shadow-lg">
      <h1 className="text-3xl font-bold text-[#070735] mb-6 text-center"></h1>
      <UserManagement />
    </div>
  </div>
);

export default UserManagementPage;

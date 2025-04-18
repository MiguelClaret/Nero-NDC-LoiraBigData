import React from 'react';
import { Shield, Bell, User } from 'lucide-react';

const AuditorHeader = () => {
  // Mock data for auditor
  const auditor = {
    name: "Dr. Carlos Mendes",
    role: "Senior Auditor",
    pendingTasks: 8
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{auditor.name}</h1>
            <p className="text-gray-600">{auditor.role}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {auditor.pendingTasks}
            </span>
          </div>
          
          <div className="bg-gray-200 p-1 rounded-full">
            <User className="h-8 w-8 text-gray-700" />
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <h3 className="text-yellow-800 font-medium">Pending Reviews</h3>
          <p className="text-2xl font-bold text-yellow-700">{auditor.pendingTasks}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-green-800 font-medium">Approved</h3>
          <p className="text-2xl font-bold text-green-700">12</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-red-800 font-medium">Rejected</h3>
          <p className="text-2xl font-bold text-red-700">3</p>
        </div>
      </div>
    </div>
  );
};

export default AuditorHeader;
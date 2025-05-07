import React from 'react';
import { Mail, Lock } from 'lucide-react';

const LoginForm = ({ loginData, handleLoginChange, handleLoginSubmit }) => {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Login
      </h2>

      <form onSubmit={handleLoginSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="h-4 w-4 inline mr-1 text-green-600" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
            className="w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Lock className="h-4 w-4 inline mr-1 text-green-600" />
            Senha
          </label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
            className="w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Lembrar-me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-green-600 hover:text-green-500">
              Esqueceu a senha?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition duration-300"
          >
            Entrar
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <a href="#" className="font-medium text-green-600 hover:text-green-500">
              Registre-se
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
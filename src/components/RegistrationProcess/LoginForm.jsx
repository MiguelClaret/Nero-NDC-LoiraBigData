import React, { useState } from 'react';
import { LogIn, Eye, EyeOff } from 'lucide-react';

const LoginForm = ({ loginData, handleLoginChange, handleLoginSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== loginData.password) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };
  
  // Override submit to check passwords match
  const onSubmit = (e) => {
    e.preventDefault();
    if (loginData.password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    handleLoginSubmit(e);
  };
  
  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Create Account or Login</h2>
      <p className="text-gray-600 mb-6">
        To continue with your crop registration, please create an account or log in to your existing account.
      </p>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input 
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
            className="w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="••••••••"
              required
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`w-full p-2 bg-white text-gray-800 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500`}
              placeholder="••••••••"
              required
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-500 text-xs mt-1">{passwordError}</p>
          )}
        </div>
        
        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition duration-300 flex items-center justify-center"
            disabled={!!passwordError}
          >
            <LogIn className="mr-2 h-5 w-5" />
            Login & Continue
          </button>
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account? <a href="#" className="text-green-600 hover:text-green-800 underline">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
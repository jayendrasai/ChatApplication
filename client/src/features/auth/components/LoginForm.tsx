import React from 'react'
import { useState } from 'react'
import { loginUser } from '../../../services/auth.services'
import { useAuth } from '../../../context/AuthProvider'

import {BrowserRouter as Router , Routes , Route , Link, useNavigate } from 'react-router-dom'

export const LoginForm = () => {
  const [email, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginUser({ email: email, password: password });
      if (data.accessToken) {
        login(data.accessToken);
        navigate('/'); // Navigate to home on successful login
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-500 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mail" className="block text-gray-700 font-medium mb-2">Enter your mail:</label>
            <input
              onChange={(e) => setMail(e.target.value)}
              type="email"
              required
              id="mail"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Enter password:</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-4 rounded-md hover:from-blue-600 hover:to-purple-600 transition duration-300 ease-in-out disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {/* <div className="mt-6 text-center">
          <p className="text-gray-600">Don't have an account? <Link to="/register" className="text-blue-500 hover:underline font-medium">Register here</Link></p>
        </div> */}
      </div>
    </div>
  );
};
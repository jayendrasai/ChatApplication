import React from 'react'
import { useState } from 'react'
import { registerUser } from '../../../services/auth.services'
import { useAuth } from '../../../context/AuthProvider'
import { Link } from 'react-router-dom'
export  const RegistrationForm = () =>  {
   const [username , setUsername] = useState('');
   const [mail ,setMail] = useState('');
   const [password , setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error , setError] = useState<string | null>(null);
   const [isLoading , setIsLoading ] = useState<boolean>(false);
   const {login} = useAuth();
  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if(password !== confirmPassword){
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    try {
      const data = await registerUser({username: username , email : mail , password :password })
      if(data.accessToken){
        login(data.accessToken);
      }

    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-500 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Enter your Username:</label>
            <input onChange={(e) => setUsername(e.target.value)} type="text" required id="username" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
          </div>
          <div>
            <label htmlFor="mail" className="block text-gray-700 font-medium mb-2">Enter your mail:</label>
            <input onChange={(e) => setMail(e.target.value)} type="email" required id="mail" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Enter password:</label>
            <input onChange={(e) => setPassword(e.target.value)} type="password" required id="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm your password:</label>
            <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" required id="confirmPassword" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-4 rounded-md hover:from-blue-600 hover:to-purple-600 transition duration-300 ease-in-out disabled:opacity-50">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {/* <Link to="/login" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-4 rounded-md hover:from-purple-600 hover:to-blue-600 transition duration-300 ease-in-out block text-center mt-4">
    Back to Login
  </Link> */}
      </div>
      
    </div>
  )
}

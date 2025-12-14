import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer' // Default role
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Register the User
      await api.post('/auth/register', formData);

      // 2. AUTO-LOGIN Logic (The Fix)
      // Immediately use the same credentials to get the token
      const loginRes = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // 3. Save Token & Redirect to Dashboard
      const { token, user } = loginRes.data;
      login(token, user.role);
      navigate('/'); 
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false); // Only stop loading on error
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 to-indigo-900 text-white items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="z-10 max-w-md">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Join the Family.</h1>
            <p className="text-purple-100 text-lg leading-relaxed">
              Start your journey with us today. Whether you're buying sweets or managing the empire, it all starts here.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-500">
              Already have an account? <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">Login here</Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              {/* Role Selection */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="block text-sm font-medium text-gray-700 mb-2">I want to register as:</span>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="customer" 
                      checked={formData.role === 'customer'}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700">Customer</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="admin" 
                      checked={formData.role === 'admin'}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700 font-bold text-red-500">Admin</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300 transition-colors"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
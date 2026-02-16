import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ShieldCheck, Loader } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      if (response.success) {
        // Redirect to contacts page
        navigate('/contacts');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-400 to-blue-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 animate-float">
        <div className="w-16 h-16 bg-white/40 backdrop-blur-sm rounded-2xl rotate-12 shadow-xl"></div>
      </div>
      <div className="absolute bottom-20 right-20 animate-float-delayed">
        <div className="w-20 h-20 bg-white/40 backdrop-blur-sm rounded-full shadow-xl"></div>
      </div>
      <div className="absolute top-1/2 right-10 animate-float">
        <Sparkles className="text-gray-400" size={32} />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side - Branding */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-blue-600 blur-2xl opacity-50"></div>
              <h1 className="relative text-6xl lg:text-7xl font-black bg-gradient-to-r from-blue-600 via-gray-600 to-gray-900 bg-clip-text text-transparent pb-2">
                Contact
                <br />
                Manager
              </h1>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 max-w-md">
            Organize your contacts efficiently with our powerful and intuitive contact management system.
          </p>

          {/* Features */}
          <div className="hidden lg:flex flex-col gap-4 pt-8">
            <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Secure & Private</h3>
                <p className="text-sm text-gray-600">Your data is encrypted and protected</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Easy to Use</h3>
                <p className="text-sm text-gray-600">Intuitive interface for everyone</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-auto lg:flex-shrink-0">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 via-gray-900 to-blue-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            {/* Card */}
            <div className="relative bg-gray-400 rounded-3xl shadow-2xl p-8 lg:p-10 w-full lg:w-[480px]">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                  <LogIn className="text-white" size={28} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
                <p className="text-gray-600">Login to access your contacts</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email/Phone Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email or Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    </div>
                    <input
                      type="text"
                      name="emailOrPhone"
                      value={formData.emailOrPhone}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
                      placeholder="Enter your email or phone"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-12 py-4 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-gray-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-semibold text-gray-600 hover:text-blue-700 transition-colors">
                    Forgot Password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full py-4 bg-gradient-to-r from-gray-900 via-gray-600 to-blue-800 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn size={20} />
                        Login
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-300 text-gray-700 rounded">Don't have an account?</span>
                </div>
              </div>

              {/* Register Link */}
              <Link
                to="/register"
                className="block w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-200 transition-colors"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
};

export default Login;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { LogIn, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { connectSocket } from "../socket/socket";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Convert enrollment to uppercase
  const handleEnrollmentChange = (e) => {
    setEnrollment(e.target.value.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginApi({ enrollment, password });

      // decode token to get userId
      const payload = JSON.parse(atob(data.token.split(".")[1]));

      login(data.token, {
  userId: payload.userId,
  role: payload.role
});

// 🔥 SOCKET CONNECT ADD KAR
connectSocket(data.token, payload.userId);

navigate("/chat");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-['Inter'] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E6C200]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#E6C200]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={32} className="text-[#E6C200]" />
            <span className="text-3xl font-light tracking-[0.2em] text-[#FFFFFF]">
              ORION
            </span>
          </div>
          <p className="text-[#B3B3B3] text-sm">Welcome back to your community</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111111] rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-xl font-light text-[#FFFFFF] flex items-center gap-2">
              <LogIn size={20} className="text-[#E6C200]" />
              Sign in to your account
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-sm text-red-400 text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Enrollment Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#B3B3B3]">
                Enrollment Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-[#7A7A7A]" />
                </div>
                <input
                  type="text"
                  value={enrollment}
                  onChange={handleEnrollmentChange}
                  placeholder="SC23CS301132"
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg pl-10 pr-4 py-3 text-[#FFFFFF] placeholder:text-[#7A7A7A] text-sm focus:outline-none focus:border-[#E6C200]/50 focus:ring-1 focus:ring-[#E6C200]/20 transition-all uppercase"
                  required
                  autoComplete="off"
                />
              </div>
              <p className="text-[10px] text-[#7A7A7A] mt-1">
                Enrollment number is automatically uppercase
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#B3B3B3]">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#7A7A7A]" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg pl-10 pr-4 py-3 text-[#FFFFFF] placeholder:text-[#7A7A7A] text-sm focus:outline-none focus:border-[#E6C200]/50 focus:ring-1 focus:ring-[#E6C200]/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-[#B3B3B3] hover:text-[#E6C200] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E6C200] hover:bg-[#f5d120] disabled:bg-gray-700 disabled:cursor-not-allowed text-[#0A0A0A] font-medium py-3 rounded-lg transition-all group flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Signup Link */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800/50"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[#111111] text-[#7A7A7A]">
                  New to ORION?
                </span>
              </div>
            </div>

            <p className="text-sm text-center">
              <Link 
                to="/signup" 
                className="text-[#E6C200] hover:text-[#f5d120] font-medium transition-colors"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-[#7A7A7A]">
          © 2026 ORION Community. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
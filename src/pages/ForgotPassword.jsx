import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setIsSuccess(false);

    if (!email) {
      setMsg("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMsg("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_AUTH_API}/forgot-password`,
        { email }
      );
      setMsg("Reset link sent to your email");
      setIsSuccess(true);
      setEmail("");
    } catch (err) {
      setMsg(
        err.response?.data?.message || "Something went wrong"
      );
      setIsSuccess(false);
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
            
            <span className="text-3xl font-light tracking-[0.2em] text-[#E6C200]">
              ORION
            </span>
          </div>
          <p className="text-[#B3B3B3] text-sm">Reset your password</p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-[#111111] rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-xl font-light text-[#FFFFFF] flex items-center gap-2">
              <Mail size={20} className="text-[#E6C200]" />
              Forgot Password
            </h2>
            <p className="text-xs text-[#7A7A7A] mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="px-8 pb-8 space-y-6">
            {/* Message Display */}
            {msg && (
              <div className={`rounded-lg p-4 flex items-start gap-3 ${
                isSuccess 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                {isSuccess ? (
                  <CheckCircle size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <p className={`text-sm ${
                  isSuccess ? 'text-green-400' : 'text-red-400'
                }`}>
                  {msg}
                </p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#B3B3B3]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-[#7A7A7A]" />
                </div>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg pl-10 pr-4 py-3 text-[#FFFFFF] placeholder:text-[#7A7A7A] text-sm focus:outline-none focus:border-[#E6C200]/50 focus:ring-1 focus:ring-[#E6C200]/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <p className="text-[10px] text-[#7A7A7A] mt-1">
                We'll send a password reset link to this email
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E6C200] hover:bg-[#f5d120] disabled:bg-gray-700 disabled:cursor-not-allowed text-[#0A0A0A] font-medium py-3 rounded-lg transition-all group flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Back to Login Link */}
            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-1 text-xs text-[#B3B3B3] hover:text-[#E6C200] transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-[#7A7A7A]">
          © 2024 ORION Community. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Lock, Eye, EyeOff, ArrowLeft, Sparkles, AlertCircle, CheckCircle, KeyRound } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setIsSuccess(false);

    // Validation
    if (!password || password.length < 6) {
      setMsg("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      setMsg("Passwords do not match");
      return;
    }

    // Password strength check (optional but recommended)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setMsg("Password must contain uppercase, lowercase and numbers");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_AUTH_API}/reset-password/${token}`,
        { password }
      );

      setIsSuccess(true);
      setMsg("Password reset successful! Redirecting to login...");
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMsg(
        err.response?.data?.message || "Invalid or expired link"
      );
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmVisibility = () => {
    setShowConfirm(!showConfirm);
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
          <p className="text-[#B3B3B3] text-sm">Create a new password</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-[#111111] rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-xl font-light text-[#FFFFFF] flex items-center gap-2">
              <KeyRound size={20} className="text-[#E6C200]" />
              Reset Password
            </h2>
            <p className="text-xs text-[#7A7A7A] mt-2">
              Please enter your new password below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="px-8 pb-8 space-y-5">
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

            {/* New Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#B3B3B3]">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#7A7A7A]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg pl-10 pr-10 py-3 text-[#FFFFFF] placeholder:text-[#7A7A7A] text-sm focus:outline-none focus:border-[#E6C200]/50 focus:ring-1 focus:ring-[#E6C200]/20 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || isSuccess}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-[#7A7A7A] hover:text-[#E6C200] transition-colors" />
                  ) : (
                    <Eye size={16} className="text-[#7A7A7A] hover:text-[#E6C200] transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#B3B3B3]">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#7A7A7A]" />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg pl-10 pr-10 py-3 text-[#FFFFFF] placeholder:text-[#7A7A7A] text-sm focus:outline-none focus:border-[#E6C200]/50 focus:ring-1 focus:ring-[#E6C200]/20 transition-all"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={loading || isSuccess}
                />
                <button
                  type="button"
                  onClick={toggleConfirmVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirm ? (
                    <EyeOff size={16} className="text-[#7A7A7A] hover:text-[#E6C200] transition-colors" />
                  ) : (
                    <Eye size={16} className="text-[#7A7A7A] hover:text-[#E6C200] transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-800/20 rounded-lg p-3 space-y-1">
              <p className="text-[10px] font-medium text-[#B3B3B3] mb-1">Password requirements:</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-1.5 text-[10px] text-[#7A7A7A]">
                  <span className={`w-1 h-1 rounded-full ${password.length >= 6 ? 'bg-[#E6C200]' : 'bg-[#7A7A7A]'}`} />
                  At least 6 characters
                </li>
                <li className="flex items-center gap-1.5 text-[10px] text-[#7A7A7A]">
                  <span className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-[#E6C200]' : 'bg-[#7A7A7A]'}`} />
                  At least one uppercase letter
                </li>
                <li className="flex items-center gap-1.5 text-[10px] text-[#7A7A7A]">
                  <span className={`w-1 h-1 rounded-full ${/[a-z]/.test(password) ? 'bg-[#E6C200]' : 'bg-[#7A7A7A]'}`} />
                  At least one lowercase letter
                </li>
                <li className="flex items-center gap-1.5 text-[10px] text-[#7A7A7A]">
                  <span className={`w-1 h-1 rounded-full ${/\d/.test(password) ? 'bg-[#E6C200]' : 'bg-[#7A7A7A]'}`} />
                  At least one number
                </li>
                <li className="flex items-center gap-1.5 text-[10px] text-[#7A7A7A]">
                  <span className={`w-1 h-1 rounded-full ${password === confirm && password !== '' ? 'bg-[#E6C200]' : 'bg-[#7A7A7A]'}`} />
                  Passwords match
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isSuccess}
              className="w-full bg-[#E6C200] hover:bg-[#f5d120] disabled:bg-gray-700 disabled:cursor-not-allowed text-[#0A0A0A] font-medium py-3 rounded-lg transition-all group flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle size={18} className="text-[#0A0A0A]" />
                  <span>Success!</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <Lock size={18} className="group-hover:scale-110 transition-transform" />
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
          © 2026 ORION Community. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
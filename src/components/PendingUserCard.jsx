import { useAuth } from "../context/AuthContext";
import {
  approveUserApi,
  rejectUserApi
} from "../api/adminApi";
import { CheckCircle, XCircle, User, Mail, Calendar, Clock } from 'lucide-react';
import { useState } from "react";

const PendingUserCard = ({ user, onAction }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const approve = async () => {
    setLoading(true);
    await approveUserApi(token, user._id);
    onAction();
    setLoading(false);
  };

  const reject = async () => {
    setLoading(true);
    await rejectUserApi(token, user._id);
    onAction();
    setLoading(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get initials from name
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <div className="bg-[#111111] rounded-xl border border-gray-800/50 overflow-hidden hover:border-[#E6C200]/30 transition-all duration-300 group">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-gray-800/50 group-hover:ring-[#E6C200]/20 transition-all"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center ring-2 ring-gray-800/50 group-hover:ring-[#E6C200]/20 transition-all">
                <span className="text-xl font-semibold text-[#B3B3B3]">
                  {getInitials(user.name)}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[#FFFFFF] font-semibold text-lg truncate">
                {user.name || 'User'}
              </h3>
              <span className="px-2 py-0.5 bg-[#E6C200]/10 text-[#E6C200] text-[10px] font-medium rounded-full border border-[#E6C200]/20">
                Pending
              </span>
            </div>

            <p className="text-[#B3B3B3] text-sm mb-2">
              {user.enrollment}
            </p>

            {/* Additional Details */}
            <div className="flex flex-wrap gap-3 text-xs text-[#7A7A7A]">
              {user.email && (
                <div className="flex items-center gap-1">
                  <Mail size={12} className="text-[#E6C200]" />
                  <span>{user.email}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock size={12} className="text-[#E6C200]" />
                <span>Requested {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={approve}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-all group/btn disabled:opacity-50"
              title="Approve user"
            >
              <CheckCircle size={16} className="text-green-400 group-hover/btn:scale-110 transition-transform" />
              <span className="text-xs font-medium text-green-400 hidden sm:inline">Approve</span>
            </button>
            <button
              onClick={reject}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all group/btn disabled:opacity-50"
              title="Reject user"
            >
              <XCircle size={16} className="text-red-400 group-hover/btn:scale-110 transition-transform" />
              <span className="text-xs font-medium text-red-400 hidden sm:inline">Reject</span>
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="mt-3 flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-[#E6C200]/30 border-t-[#E6C200] rounded-full animate-spin" />
            <span className="text-xs text-[#B3B3B3]">Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingUserCard;
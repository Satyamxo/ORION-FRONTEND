import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfileApi } from "../api/userApi";
import { 
  User, 
  Mail, 
  BookOpen, 
  MapPin, 
  Sparkles,
  ArrowLeft,
  Loader2,
  Award,
  MessageCircle
} from 'lucide-react';

const UserProfile = () => {
  const { userId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !userId) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getUserProfileApi(token, userId);
        setUser(data);
      } catch (err) {
        console.error("Profile load failed", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, userId]);

  // Get initials from name
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] font-['Inter'] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-[#E6C200] animate-spin" />
          <p className="text-[#B3B3B3] font-medium text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] font-['Inter'] flex items-center justify-center p-4">
        <div className="bg-[#111111] rounded-2xl border border-gray-800/50 p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <User size={24} className="text-red-400" />
          </div>
          <h3 className="text-[#FFFFFF] font-semibold text-lg mb-2">
            User Not Found
          </h3>
          <p className="text-[#B3B3B3] text-sm mb-6">
            The profile you're looking for doesn't exist or you don't have access.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-sm text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-['Inter'] py-8 px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E6C200]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#E6C200]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#B3B3B3] hover:text-[#E6C200] transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </button>

        {/* Profile Card */}
        <div className="bg-[#111111] rounded-2xl border border-gray-800/50 overflow-hidden">
          {/* Cover Photo - Reduced height */}
          <div className="h-28 bg-gradient-to-r from-[#E6C200]/20 to-[#E6C200]/5 relative">
            {/* Profile Image - Adjusted positioning */}
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-xl overflow-hidden ring-4 ring-[#111111] bg-[#111111] shadow-xl">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <span className="text-2xl font-semibold text-[#B3B3B3]">
                        {getInitials(user.name)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Online Indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#E6C200] rounded-full border-2 border-[#111111]" />
              </div>
            </div>
          </div>

          {/* Profile Info - Added proper margin-top to create space */}
          <div className="mt-16 p-6 md:p-8">
            {/* Name and Basic Info - Now properly positioned below image */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-[#FFFFFF]">
                {user.name}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-[#B3B3B3]">
                <BookOpen size={14} className="text-[#E6C200]" />
                <span className="text-sm">Enrollment: {user.enrollment}</span>
              </div>
            </div>

            {/* Bio Section */}
            {user.bio && (
              <div className="mb-6 p-4 bg-gray-800/20 rounded-xl border border-gray-800/30">
                <p className="text-[#B3B3B3] text-sm leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Role */}
              <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Award size={16} className="text-[#E6C200]" />
                  <span className="text-xs text-[#B3B3B3]">Role</span>
                </div>
                <p className="text-[#FFFFFF] font-medium capitalize">
                  {user.role || 'Student'}
                </p>
              </div>

              {/* Status */}
              <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-[#E6C200]" />
                  <span className="text-xs text-[#B3B3B3]">Status</span>
                </div>
                <p className="text-[#FFFFFF] font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#E6C200] rounded-full animate-pulse" />
                    Active
                  </span>
                </p>
              </div>
            </div>

            {/* Additional Info (if available from API) */}
            {(user.email || user.location) && (
              <div className="border-t border-gray-800/30 pt-6">
                <h3 className="text-sm font-medium text-[#FFFFFF] mb-3">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  {user.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-[#7A7A7A]" />
                      <span className="text-[#B3B3B3]">{user.email}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-[#7A7A7A]" />
                      <span className="text-[#B3B3B3]">{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => navigate(`/chat/private/${userId}`)}
                className="flex-1 px-4 py-2.5 bg-[#E6C200] hover:bg-[#f5d120] rounded-lg text-[#0A0A0A] font-medium text-sm transition-all flex items-center justify-center gap-2 group"
              >
                <MessageCircle size={16} />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-[#7A7A7A]">
          ORION Community • Member Profile
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
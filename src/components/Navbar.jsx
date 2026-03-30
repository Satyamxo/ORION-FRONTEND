import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { disconnectSocket } from "../socket/socket";
import { MessageSquare, Calendar, LogOut, User, Sparkles, Menu, X } from 'lucide-react';
import { useState } from "react";

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    disconnectSocket();
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
      isActive
        ? "text-[#E6C200]"
        : "text-[#B3B3B3] hover:text-[#FFFFFF]"
    }`;

  const handleMobileNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-gray-800/50 font-['Inter']">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            {/* Logo Section */}
<div 
  className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
  onClick={() => navigate("/chat")}
>
  {/* Animated background effect */}
  <div className="relative flex-shrink-0">
    <div className="absolute inset-0 bg-[#E6C200]/20 blur-md rounded-full group-hover:bg-[#E6C200]/30 transition-all duration-500" />
    <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#E6C200]/10 to-transparent border border-[#E6C200]/20 group-hover:border-[#E6C200]/40 transition-all duration-300 flex items-center justify-center">
      <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#E6C200] rounded-full opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
    </div>
  </div>
  
  {/* ORION text - with extra right padding for the N */}
  <div className="flex flex-col items-start">
    <span className="font-['Caveat'] text-2xl sm:text-3xl font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#E6C200] via-[#F5D742] to-[#E6C200] pr-3">
      ORION
    </span>
    <span className="text-[7px] sm:text-[8px] font-light text-[#7A7A7A] tracking-[0.2em] uppercase mt-0.5 group-hover:text-[#B3B3B3] transition-colors">
      CONNECT · CHAT · GROW
    </span>
  </div>
</div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/chat" className={linkClass}>
                {({ isActive }) => (
                  <div className="flex items-center gap-2">
                    <MessageSquare 
                      size={18} 
                      className={isActive ? "text-[#E6C200]" : "text-[#7A7A7A] group-hover:text-[#FFFFFF]"} 
                    />
                    <span>Chat</span>
                    {isActive && (
                      <div className="absolute -bottom-[1.35rem] left-0 right-0 h-0.5 bg-[#E6C200] rounded-full" />
                    )}
                  </div>
                )}
              </NavLink>

              <NavLink to="/events" className={linkClass}>
                {({ isActive }) => (
                  <div className="flex items-center gap-2">
                    <Calendar 
                      size={18} 
                      className={isActive ? "text-[#E6C200]" : "text-[#7A7A7A] group-hover:text-[#FFFFFF]"} 
                    />
                    <span>Events</span>
                    {isActive && (
                      <div className="absolute -bottom-[1.35rem] left-0 right-0 h-0.5 bg-[#E6C200] rounded-full" />
                    )}
                  </div>
                )}
              </NavLink>

              {/* Profile Section */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-800/50">
                {/* Profile Button */}
                <button
                  onClick={() => navigate("/me")}
                  className="relative group"
                  onMouseEnter={() => setIsProfileHovered(true)}
                  onMouseLeave={() => setIsProfileHovered(false)}
                >
                  <div className="absolute inset-0 bg-[#E6C200]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex items-center justify-center hover:border-[#E6C200]/50 transition-all">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={18} className="text-[#B3B3B3] group-hover:text-[#E6C200] transition-colors" />
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  {isProfileHovered && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-[#B3B3B3] text-xs font-medium px-2 py-1 rounded border border-gray-800 whitespace-nowrap">
                      My Profile
                    </div>
                  )}
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 hover:bg-red-500/10 border border-gray-800/50 hover:border-red-500/30 rounded-lg transition-all duration-300 group"
                >
                  <LogOut 
                    size={16} 
                    className="text-[#7A7A7A] group-hover:text-red-400 transition-colors" 
                  />
                  <span className="text-sm font-medium text-[#B3B3B3] group-hover:text-red-400 transition-colors">
                    Logout
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button (Three Dots) */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative p-2 text-[#B3B3B3] hover:text-[#E6C200] transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-gray-800/50 shadow-xl">
            <div className="px-4 py-3 space-y-2">
              {/* Mobile Chat Link */}
              <button
                onClick={() => handleMobileNavClick("/chat")}
                className="flex items-center gap-3 w-full px-4 py-3 text-[#B3B3B3] hover:text-[#E6C200] hover:bg-gray-900/50 rounded-lg transition-all"
              >
                <MessageSquare size={18} className="text-[#7A7A7A]" />
                <span className="text-sm font-medium">Chat</span>
              </button>

              {/* Mobile Events Link */}
              <button
                onClick={() => handleMobileNavClick("/events")}
                className="flex items-center gap-3 w-full px-4 py-3 text-[#B3B3B3] hover:text-[#E6C200] hover:bg-gray-900/50 rounded-lg transition-all"
              >
                <Calendar size={18} className="text-[#7A7A7A]" />
                <span className="text-sm font-medium">Events</span>
              </button>

              {/* Mobile Profile Link */}
              <button
                onClick={() => handleMobileNavClick("/me")}
                className="flex items-center gap-3 w-full px-4 py-3 text-[#B3B3B3] hover:text-[#E6C200] hover:bg-gray-900/50 rounded-lg transition-all"
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User size={18} className="text-[#7A7A7A]" />
                )}
                <span className="text-sm font-medium">My Profile</span>
              </button>

              {/* Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-[#B3B3B3] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <LogOut size={18} className="text-[#7A7A7A]" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Subtle gradient line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E6C200]/20 to-transparent" />
      </nav>

      {/* Spacer to prevent content from hiding under navbar */}
      <div className="h-16 w-full" />
    </>
  );
};

export default Navbar;
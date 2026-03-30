import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUsersApi } from "../api/userApi";
import { getPrivateChatSummaryApi } from "../api/messageApi";
import {
  connectSocket,
  getSocket,
  disconnectSocket
} from "../socket/socket";
import { Search, Users, MessageCircle, ChevronRight, X, ArrowLeft } from 'lucide-react';

const UserList = ({ onMobileClose }) => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= INITIAL LOAD (HTTP) ================= */
  useEffect(() => {
    if (!token || !user?.userId) return;

    const loadUsersWithChatInfo = async () => {
      try {
        setLoading(true);

        const usersData = await getUsersApi(token);
        const filteredUsers = usersData.filter(
          (u) => u.userId !== user.userId
        );

        const chatSummary = await getPrivateChatSummaryApi(token);

        const merged = filteredUsers.map((u) => {
          const chat = chatSummary.find(
            (c) => c.userId === u.userId
          );

          return {
            ...u,
            lastMessage: chat?.lastMessage || "",
            lastMessageAt: chat?.lastMessageTime || null,
            unreadCount: chat?.unreadCount || 0
          };
        });

        merged.sort(
          (a, b) =>
            new Date(b.lastMessageAt || 0) -
            new Date(a.lastMessageAt || 0)
        );

        setUsers(merged);
        setFilteredUsers(merged);
      } catch (err) {
        console.error("Failed to load user list:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsersWithChatInfo();
  }, [token, user]);

  /* ================= SEARCH FUNCTIONALITY ================= */
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.enrollment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  /* ================= REALTIME SOCKET UPDATES ================= */
  useEffect(() => {
    if (!token || !user?.userId) return;

    const socket = connectSocket(token);

    socket.on("chat_summary_update", (data) => {
      setUsers((prev) => {
        let found = false;

        const updated = prev.map((u) => {
          if (u.userId === data.fromUserId) {
            found = true;
            return {
              ...u,
              lastMessage: data.lastMessage,
              lastMessageAt: data.lastMessageAt,
              unreadCount:
                u.unreadCount + (data.unreadIncrement || 0)
            };
          }
          return u;
        });

        if (!found) return prev;

        return [...updated].sort(
          (a, b) =>
            new Date(b.lastMessageAt || 0) -
            new Date(a.lastMessageAt || 0)
        );
      });
    });

    return () => {
      socket.off("chat_summary_update");
      disconnectSocket();
    };
  }, [token, user]);

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleUserClick = (userId, name, avatar) => {
    navigate(`/chat/private/${userId}`, {
      state: { name, avatar }
    });
    if (onMobileClose) onMobileClose();
  };

  return (
    <div className="w-full h-full bg-[#0A0A0A] border-r border-gray-800/50 flex flex-col font-['Inter']">
      {/* Header with back button for mobile */}
      <div className="px-4 sm:px-5 py-4 sm:py-6 border-b border-gray-800/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Mobile back button */}
            {onMobileClose && (
              <button
                onClick={onMobileClose}
                className="md:hidden p-2 -ml-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-[#B3B3B3]" />
              </button>
            )}
            <div className="p-2.5 bg-[#E6C200]/10 rounded-xl">
              <Users size={20} className="text-[#E6C200]" />
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-light tracking-tight text-[#FFFFFF]">
              Connections
            </h2>
            <p className="text-xs font-medium text-[#7A7A7A] mt-0.5">
              {users.length} {users.length === 1 ? 'connection' : 'connections'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email or enrollment..."
            className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg pl-9 pr-8 py-2.5 text-sm text-[#FFFFFF] placeholder:text-[#7A7A7A] focus:outline-none focus:border-[#E6C200]/50 focus:ring-1 focus:ring-[#E6C200]/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-700/50 rounded-full transition-colors"
            >
              <X size={14} className="text-[#7A7A7A] hover:text-[#FFFFFF]" />
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#E6C200]/30 border-t-[#E6C200] rounded-full animate-spin" />
            <p className="text-sm font-medium text-[#7A7A7A] tracking-wide">
              Loading connections...
            </p>
          </div>
        </div>
      )}

      {/* User List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {!loading && filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mb-4">
              <Search size={24} className="text-[#7A7A7A]" />
            </div>
            <h3 className="text-[#FFFFFF] font-semibold text-sm tracking-tight mb-1">
              {searchQuery ? 'No results found' : 'No connections yet'}
            </h3>
            <p className="text-xs font-normal text-[#7A7A7A]">
              {searchQuery 
                ? `No matches for "${searchQuery}"` 
                : 'Start chatting to see your connections here'}
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-xs font-medium text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filteredUsers.map((u) => (
            <div
              key={u.userId}
              className="group relative px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-800/30 hover:bg-[#111111] transition-all duration-300 cursor-pointer"
              onClick={() => handleUserClick(u.userId, u.name, u.avatar)}
            >
              {u.lastMessageAt && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#E6C200]/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              )}

              <div className="flex items-center gap-3 sm:gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover ring-2 ring-gray-800/50 group-hover:ring-[#E6C200]/20 transition-all"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ring-2 ring-gray-800/50 group-hover:ring-[#E6C200]/20 transition-all">
                      <span className="text-sm sm:text-lg font-semibold text-[#B3B3B3]">
                        {getInitials(u.name)}
                      </span>
                    </div>
                  )}
                  
                  {u.lastMessageAt && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#E6C200] rounded-full border-2 border-[#0A0A0A]" />
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[#FFFFFF] font-semibold text-xs sm:text-sm tracking-tight truncate">
                      {u.name}
                    </h3>
                    
                    {u.unreadCount > 0 && (
                      <span className="bg-[#E6C200] text-[#0A0A0A] text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {u.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[8px] sm:text-[10px] font-medium text-[#7A7A7A] truncate">
                      {u.enrollment || u.email?.split('@')[0] || 'No ID'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-1.5">
                    <MessageCircle size={10} className="text-[#7A7A7A] flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs font-normal text-[#B3B3B3] truncate">
                      {u.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>

                {/* Timestamp & Arrow */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {u.lastMessageAt && (
                    <span className="text-[8px] sm:text-[9px] font-medium text-[#7A7A7A] whitespace-nowrap">
                      {formatLastSeen(u.lastMessageAt)}
                    </span>
                  )}
                  <ChevronRight 
                    size={2} 
                    className="text-[#7A7A7A] group-hover:text-[#E6C200] group-hover:translate-x-0.5 transition-all" 
                  />
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-[#E6C200]/0 via-[#E6C200]/0 to-[#E6C200]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {!loading && users.length > 0 && (
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-800/30 bg-[#0A0A0A]/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-[10px] sm:text-xs">
            <span className="font-medium text-[#7A7A7A]">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'result' : 'results'}
            </span>
            {searchQuery && filteredUsers.length > 0 && (
              <button
                onClick={clearSearch}
                className="text-[#E6C200] hover:text-[#f5d120] font-medium transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
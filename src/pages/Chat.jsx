import { useState, useEffect } from "react";
import GroupChat from "./GroupChat";
import UserList from "../components/UserList";
import PrivateChat from "../components/PrivateChat";
import { Menu, X, Users, MessageSquare } from 'lucide-react';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsUserListOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle user selection on mobile
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (isMobile) {
      setIsUserListOpen(false);
    }
  };

  // Handle back to group chat
  const handleBackToGroup = () => {
    setSelectedUser(null);
  };

  return (
    <div className="h-screen w-full bg-[#0A0A0A] font-['Inter'] overflow-hidden">
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-20 bg-[#111111] border-b border-gray-800/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsUserListOpen(!isUserListOpen)}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              {isUserListOpen ? (
                <X size={20} className="text-[#E6C200]" />
              ) : (
                <Menu size={20} className="text-[#E6C200]" />
              )}
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-[#FFFFFF] font-semibold text-sm">
                {selectedUser ? selectedUser.name : 'Group Chat'}
              </span>
            </div>

            {selectedUser && (
              <button
                onClick={handleBackToGroup}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <Users size={20} className="text-[#B3B3B3]" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex h-full w-full">
        {/* User List */}
        <div
          className={`
            ${isMobile 
              ? `fixed inset-y-0 left-0 z-10 w-80 transform transition-transform duration-300 ease-in-out ${
                  isUserListOpen ? 'translate-x-0' : '-translate-x-full'
                }`
              : 'relative w-80 flex-shrink-0'
            }
            h-full bg-[#111111] border-r border-gray-800/50
          `}
        >
          {isMobile && (
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setIsUserListOpen(false)}
                className="p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={18} className="text-[#B3B3B3]" />
              </button>
            </div>
          )}
          
          <UserList onSelect={handleUserSelect} />
        </div>

        {/* Chat Area */}
        <div className="flex-1 relative bg-[#0A0A0A] min-w-0">
          {!isMobile && selectedUser && (
            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={handleBackToGroup}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/30 hover:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 transition-all group"
              >
                <Users size={16} className="text-[#E6C200]" />
                <span className="text-xs font-medium text-[#B3B3B3] group-hover:text-[#FFFFFF] transition-colors">
                  Back to Group
                </span>
              </button>
            </div>
          )}

          {/* Chat Component */}
          <div className="h-full w-full">
            {selectedUser ? (
              <PrivateChat 
                selectedUser={selectedUser} 
                onBack={isMobile ? handleBackToGroup : undefined}
              />
            ) : (
              <GroupChat />
            )}
          </div>

          {/* Mobile overlay */}
          {isMobile && isUserListOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-0"
              onClick={() => setIsUserListOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      {isMobile && !selectedUser && !isUserListOpen && (
        <button
          onClick={() => setIsUserListOpen(true)}
          className="fixed bottom-16 left-6 z-20 p-4 bg-[#E6C200] hover:bg-[#f5d120] rounded-full shadow-lg shadow-[#E6C200]/20 transition-all hover:scale-110"
        >
          <MessageSquare size={14} className="text-[#0A0A0A]" />
        </button>
      )}
    </div>
  );
};

export default Chat;
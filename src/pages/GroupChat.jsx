import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  connectSocket,
  getSocket,
  disconnectSocket
} from "../socket/socket";
import { getGroupMessagesApi } from "../api/messageApi";
import { uploadImage } from "../api/mediaApi";
import { getUserProfileApiForGroupChat } from "../api/userApi";
import { 
  Send, 
  Paperclip, 
  X, 
  Maximize2, 
  Check, 
  CheckCheck,
  ArrowLeft,
  Users
} from 'lucide-react';

const Chat = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fullImage, setFullImage] = useState(null);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* 🔌 SOCKET + HISTORY */
  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    const loadHistory = async () => {
      const old = await getGroupMessagesApi(token);
      setMessages(old);
    };

    loadHistory();

    socket.on("new_group_message", (message) => {
      if (message.messageType === "group") {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("message_read", ({ messageId, readBy }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, readBy } : m
        )
      );
    });

    return () => {
      socket.off("new_group_message");
      socket.off("message_read");
      disconnectSocket();
    };
  }, [token]);

  /* 🔥 FETCH PROFILES */
  useEffect(() => {
    if (!token || messages.length === 0) return;

    const loadProfiles = async () => {
      const uniqueIds = [
        ...new Set(messages.map((m) => m.senderId))
      ];

      for (const id of uniqueIds) {
        if (profiles[id]) continue;

        try {
          const profile = await getUserProfileApiForGroupChat(token, id);
          setProfiles((prev) => ({
            ...prev,
            [id]: profile
          }));
        } catch {
          setProfiles((prev) => ({
            ...prev,
            [id]: {
              name: "User",
              avatar: null
            }
          }));
        }
      }
    };

    loadProfiles();
  }, [messages, token]);

  /* 🔽 AUTO SCROLL */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 👁️ MARK GROUP MESSAGES AS READ */
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?.userId) return;

    messages.forEach((msg) => {
      if (
        msg.messageType === "group" &&
        msg.senderId !== user.userId &&
        !msg.readBy?.includes(user.userId)
      ) {
        socket.emit("read_message", { messageId: msg._id });
      }
    });
  }, [messages, user]);

  /* 🖼️ IMAGE SELECT */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* 📤 SEND GROUP MESSAGE */
  const sendMessage = async () => {
    if (!text.trim() && !imageFile) return;

    const socket = getSocket();
    let imageUrl = null;

    try {
      if (imageFile) {
        setUploading(true);
        const res = await uploadImage({
          file: imageFile,
          context: "chat",
          token
        });
        imageUrl = res.imageUrl;
      }

      socket.emit("send_message", {
        type: "group",
        content: text,
        imageUrl
      });

      setText("");
      setImageFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setUploading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const DefaultAvatar = ({ name, onClick }) => (
    <div 
      onClick={onClick}
      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#E6C200]/50 transition-all ring-1 ring-gray-700/50"
    >
      <span className="text-[10px] sm:text-xs font-medium text-[#B3B3B3]">
        {getInitials(name)}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] font-['Inter']">
      {/* Header */}
      <div className="bg-[#111111] border-b border-gray-800/50 px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          {/* Mobile back button to show user list */}
          <button
            onClick={() => window.history.back()}
            className="md:hidden p-1.5 sm:p-2 -ml-1.5 sm:-ml-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} className="text-[#B3B3B3]" />
          </button>
          
          <div className="relative flex-shrink-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#E6C200]/20 to-[#E6C200]/5 flex items-center justify-center">
              <Users size={14} className="text-[#E6C200] sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[#FFFFFF] font-semibold text-sm sm:text-base md:text-lg tracking-tight truncate">
              Group Chat
            </h1>
            <p className="text-[10px] sm:text-xs text-[#7A7A7A] truncate">
              {Object.keys(profiles).length} participants
            </p>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent px-1.5 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
          {messages.map((msg, index) => {
            const isMe = msg.senderId?.toString() === user?.userId;
            

            const profile = profiles[msg.senderId?.toString()] || {};

const displayName =
  msg.senderName ||
  profile.name ||
  "User";
            const showHeader = index === 0 || messages[index - 1]?.senderId !== msg.senderId;

            const seenCount = msg.readBy?.length || 0;

            return (
              <div key={msg._id} className="space-y-0.5 sm:space-y-1">
                {/* Show sender header for new message senders (not for current user) */}
                {!isMe && showHeader && (
                  <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2 mb-0.5 sm:mb-1">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={displayName}
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full object-cover ring-1 ring-gray-700/50 cursor-pointer"
                        onClick={() => navigate(`/profile/${msg.senderId}`)}
                      />
                    ) : (
                      <DefaultAvatar 
                        name={displayName}
                        onClick={() => navigate(`/profile/${msg.senderId}`)}
                      />
                    )}
                    <span 
                      className="text-[9px] sm:text-[10px] md:text-xs font-medium text-[#B3B3B3] hover:text-[#E6C200] cursor-pointer transition-colors truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px]"
                      onClick={() => navigate(`/profile/${msg.senderId}`)}
                    >
                      {displayName || 'User'}
                    </span>
                  </div>
                )}

                {/* Message bubble */}
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] sm:max-w-[80%] md:max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`relative rounded-2xl px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 ${
                        isMe
                          ? "bg-[#E6C200] text-[#0A0A0A]"
                          : "bg-[#111111] border border-gray-800/50 text-[#FFFFFF]"
                      }`}
                    >
                      {msg.content && (
                        <p className="text-[11px] sm:text-xs md:text-sm font-normal leading-relaxed break-words">
                          {msg.content}
                        </p>
                      )}

                      {msg.imageUrl && (
                        <div className={`${msg.content ? 'mt-1.5 sm:mt-2' : ''} relative group/image`}>
                          <img
                            src={msg.imageUrl}
                            onClick={() => setFullImage(msg.imageUrl)}
                            className="max-w-full rounded-lg object-contain bg-gray-900/50 cursor-pointer hover:opacity-90 transition-opacity"
                            style={{ 
                              maxHeight: '150px',
                              width: 'auto',
                              maxWidth: '100%'
                            }}
                            alt="message attachment"
                          />
                          <button
                            onClick={() => setFullImage(msg.imageUrl)}
                            className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-1.5 bg-black/50 backdrop-blur-sm rounded-lg opacity-0 group-hover/image:opacity-100 transition-opacity"
                          >
                            <Maximize2 size={12} className="text-[#FFFFFF]" />
                          </button>
                        </div>
                      )}

                      {/* Timestamp and read receipts */}
                      <div className={`flex items-center justify-end gap-0.5 sm:gap-1 mt-0.5 sm:mt-1 ${
                        isMe ? 'text-[#0A0A0A]/60' : 'text-[#7A7A7A]'
                      }`}>
                        <span className="text-[7px] sm:text-[8px] md:text-[10px] font-medium">
                          {formatTime(msg.createdAt)}
                        </span>
                        {isMe && (
                          <span className="text-[7px] sm:text-[8px] md:text-[10px]">
                            {seenCount === 0 ? (
  <Check size={8} className="inline" />
) : (
  <span className="flex items-center gap-0.5">
    <CheckCheck size={8} className="inline" />
    <span className="text-[7px] sm:text-[8px]">
      {seenCount}
    </span>
  </span>
)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div className="border-t border-gray-800/50 bg-[#111111] px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={preview}
                alt="preview"
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-cover rounded-lg border border-gray-700/50"
              />
              <button
                onClick={() => {
                  setPreview(null);
                  setImageFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 p-0.5 bg-red-500/90 hover:bg-red-500 rounded-full transition-colors"
              >
                <X size={8} className="text-[#FFFFFF]" />
              </button>
            </div>
            <span className="text-[9px] sm:text-[10px] md:text-xs text-[#B3B3B3] font-medium truncate">
              Image ready to send
            </span>
          </div>
        </div>
      )}

      {/* INPUT - FIXED FOR MOBILE */}
      <div className="border-t border-gray-800/50 bg-[#111111] px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="groupImageUpload"
              ref={fileInputRef}
            />

            <label
              htmlFor="groupImageUpload"
              className="cursor-pointer p-2 sm:p-2.5 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg sm:rounded-xl transition-colors group flex-shrink-0"
            >
              <Paperclip size={18} className="text-[#7A7A7A] group-hover:text-[#E6C200] transition-colors sm:w-5 sm:h-5" />
            </label>

            <div className="flex-1 min-w-0">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg sm:rounded-xl px-3 py-2.5 text-[#FFFFFF] placeholder:text-[#7A7A7A] text-sm focus:outline-none focus:border-[#E6C200]/50 focus:ring-1 focus:ring-[#E6C200]/20 transition-all"
                placeholder="Type a message..."
                disabled={uploading}
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={(!text.trim() && !imageFile) || uploading}
              className="p-2 sm:p-2.5 bg-[#E6C200] hover:bg-[#f5d120] disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg sm:rounded-xl transition-all group flex-shrink-0"
            >
              {uploading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
              ) : (
                <Send size={18} className="text-[#0A0A0A] group-hover:scale-110 transition-transform sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
          
          {/* Hint text */}
          <div className="mt-1.5 text-[10px] text-[#7A7A7A] font-medium px-1">
            Press Enter to send • Images supported
          </div>
        </div>
      </div>

      {/* FULL IMAGE VIEW */}
      {fullImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setFullImage(null)}
        >
          <div className="relative max-w-[95vw] max-h-[90vh] mx-2 sm:mx-4">
            <img
              src={fullImage}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              alt="full size"
            />
            <button
              onClick={() => setFullImage(null)}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-4 md:right-4 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-colors"
            >
              <X size={16} className="text-[#FFFFFF] sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
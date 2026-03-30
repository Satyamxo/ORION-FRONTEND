import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  connectSocket,
  getSocket,
  disconnectSocket
} from "../socket/socket";
import { getPrivateMessagesApi } from "../api/messageApi";
import { uploadImage } from "../api/mediaApi";
import { getUserProfileApi } from "../api/userApi";
import { X, Maximize2, Send, Paperclip, ChevronLeft, Check, CheckCheck } from 'lucide-react';

const DefaultAvatar = () => (
  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0 ring-2 ring-gray-800/50">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4 sm:w-5 sm:h-5 text-[#B3B3B3]"
    >
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" />
    </svg>
  </div>
);

const PrivateChat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();

  // fallback from navigation
  const { name, avatar } = location.state || {};

  const [chatUser, setChatUser] = useState({
    name: name || "",
    avatar: avatar || null
  });

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const bottomRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  /* 🔥 FETCH PROFILE (MAIN FIX) */
  useEffect(() => {
    if (!token || !userId) return;

    const loadProfile = async () => {
      try {
        const profile = await getUserProfileApi(token, userId);
        setChatUser({
          name: profile.name,
          avatar: profile.avatar
        });
      } catch {
        console.warn("Profile fetch failed");
      }
    };

    loadProfile();
  }, [token, userId]);

  /* 🔌 SOCKET + HISTORY */
  useEffect(() => {
    if (!token || !userId) return;

    const socket = connectSocket(token);

    const loadMessages = async () => {
      const oldMessages = await getPrivateMessagesApi(token, userId);
      setMessages(oldMessages);
    };

    loadMessages();

    socket.on("new_message", (message) => {
      if (
        message.messageType === "private" &&
        (message.senderId === userId ||
          message.receiverId === userId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("message_read", ({ messageId, readBy }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, readBy } : msg
        )
      );
    });

    return () => {
      disconnectSocket();
    };
  }, [token, userId]);

  /* 🔽 AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 👁️ MARK AS READ */
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?.userId) return;

    messages.forEach((msg) => {
      if (
        msg.senderId !== user.userId &&
        !msg.readBy?.includes(user.userId)
      ) {
        socket.emit("read_message", { messageId: msg._id });
      }
    });
  }, [messages, user]);

  /* 🖼️ IMAGE */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* 📤 SEND */
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
        type: "private",
        receiverId: userId,
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

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-[#0A0A0A] font-['Inter'] overflow-hidden">
        {/* HEADER - Fixed, non-scrollable */}
        <div className="flex-shrink-0">
          <div
            className="px-3 sm:px-4 py-3 sm:py-4 bg-[#111111] text-[#FFFFFF] font-bold flex items-center gap-2 sm:gap-3 cursor-pointer border-b border-gray-800/50 hover:bg-[#1A1A1A] transition-colors"
            onClick={() => navigate(`/profile/${userId}`)}
          >
            {/* Back button for mobile */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              className="md:hidden p-1.5 -ml-1 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-[#B3B3B3]" />
            </button>

            {chatUser.avatar ? (
              <img
                src={chatUser.avatar}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-gray-800/50 object-cover"
                alt={chatUser.name}
              />
            ) : (
              <DefaultAvatar />
            )}

            <div className="flex flex-col leading-tight min-w-0 flex-1">
              <span className="text-sm sm:text-base text-[#FFFFFF] font-semibold truncate">
                {chatUser.name || "Private Chat"}
              </span>
              <span className="text-[10px] sm:text-xs text-[#E6C200] font-medium">
                View profile
              </span>
            </div>
          </div>
        </div>

        {/* MESSAGES - Scrollable with WhatsApp/Instagram style positioning */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 sm:py-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#2D2D2D #0A0A0A'
          }}
        >
          <div className="flex flex-col space-y-3 sm:space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderId === user?.userId;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Avatar for others */}
                  {!isMe && (
                    <div className="flex items-end mr-1.5 sm:mr-2">
                      {chatUser.avatar ? (
                        <img
                          src={chatUser.avatar}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full ring-2 ring-gray-800/50 object-cover cursor-pointer hover:ring-[#E6C200]/50 transition-all"
                          onClick={() => navigate(`/profile/${msg.senderId}`)}
                          alt={chatUser.name}
                        />
                      ) : (
                        <div onClick={() => navigate(`/profile/${msg.senderId}`)} className="cursor-pointer">
                          <DefaultAvatar />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div className={`max-w-[85%] sm:max-w-[70%] ${isMe ? 'mr-1.5 sm:mr-2' : ''}`}>
                    <div
                      className={`p-2 sm:p-2.5 text-xs sm:text-sm break-words ${isMe
                          ? "bg-[#E6C200] text-[#0A0A0A] rounded-2xl rounded-br-none"
                          : "bg-[#111111] border border-gray-800/50 text-[#FFFFFF] rounded-2xl rounded-tl-none"
                        }`}
                    >
                      {msg.content && <p className="leading-relaxed">{msg.content}</p>}

                      {msg.imageUrl && (
                        <div
                          className={`${msg.content ? 'mt-2' : ''} cursor-pointer group relative`}
                          onClick={() => setSelectedImage(msg.imageUrl)}
                        >
                          <img
                            src={msg.imageUrl}
                            className="max-w-[150px] sm:max-w-[200px] max-h-32 sm:max-h-48 rounded-lg object-cover hover:opacity-90 transition-opacity"
                            alt="message attachment"
                          />
                          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 bg-black/50 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 size={12} className="text-white" />
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className={`flex items-center gap-0.5 mt-1 text-[8px] sm:text-[9px] ${isMe ? 'text-[#0A0A0A]/60 justify-end' : 'text-[#7A7A7A] justify-start'
                        }`}>
                        <span>{formatTime(msg.createdAt)}</span>
                        {isMe && (
                          <span className="ml-0.5">
                            {msg.readBy?.includes(userId) ? (
                              <CheckCheck size={10} />
                            ) : (
                              <Check size={10} />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Spacer for my messages (to balance with avatar space) */}
                  {isMe && <div className="w-6 sm:w-7" />}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* PREVIEW - Fixed, non-scrollable */}
        {preview && (
          <div className="flex-shrink-0">
            <div className="p-2 sm:p-3 bg-[#111111] border-t border-gray-800/50 flex gap-2 sm:gap-3 items-center">
              <div className="relative flex-shrink-0">
                <img
                  src={preview}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover border border-gray-700/50"
                  alt="preview"
                />
                <button
                  onClick={() => {
                    setPreview(null);
                    setImageFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500/90 hover:bg-red-500 rounded-full transition-colors"
                >
                  <X size={10} className="text-white" />
                </button>
              </div>
              <span className="text-[10px] sm:text-xs text-[#B3B3B3] font-medium truncate">
                Image ready to send
              </span>
            </div>
          </div>
        )}

        {/* INPUT - Fixed, non-scrollable */}
        <div className="flex-shrink-0">
          <div className="p-2 sm:p-3 bg-[#111111] border-t border-gray-800/50 flex gap-1.5 sm:gap-2 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="imageUpload"
              ref={fileInputRef}
            />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer p-2 sm:p-2.5 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg sm:rounded-xl transition-colors group flex-shrink-0"
            >
              <Paperclip size={16} className="text-[#7A7A7A] group-hover:text-[#E6C200] transition-colors" />
            </label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-gray-800/30 border border-gray-700/50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#FFFFFF] placeholder:text-[#7A7A7A] focus:outline-none focus:border-[#E6C200]/50 focus:ring-1 focus:ring-[#E6C200]/20 transition-all"
              placeholder="Type a message..."
              disabled={uploading}
            />
            <button
              onClick={sendMessage}
              disabled={(!text.trim() && !imageFile) || uploading}
              className="p-2 sm:p-2.5 bg-[#E6C200] hover:bg-[#f5d120] disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg sm:rounded-xl transition-all group flex-shrink-0"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
              ) : (
                <Send size={16} className="text-[#0A0A0A] group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

          {/* Hint text */}
          <div className="px-3 sm:px-4 pb-1.5 text-[8px] sm:text-[10px] text-[#7A7A7A] font-medium">
            Press Enter to send • Images supported (max 5MB)
          </div>
        </div>
      </div>

      {/* FULL IMAGE VIEW MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[95vw] sm:max-w-5xl max-h-[90vh]">
            <img
              src={selectedImage}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              alt="Full size"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivateChat;
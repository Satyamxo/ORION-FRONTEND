import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createEventApi } from "../api/eventApi";
import { uploadImage } from "../api/mediaApi";
import { 
  X, 
  Image as ImageIcon, 
  Send, 
  Calendar,
  Type,
  AlignLeft,
  Tag,
  CheckCircle,
  Mail
} from 'lucide-react';

const CreateEvent = ({ onCreated }) => {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("announcement");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!title || !description) return;

    try {
      setLoading(true);

      let imageUrl = null;

      if (imageFile) {
        setUploading(true);
        const res = await uploadImage({
          file: imageFile,
          context: "event",
          token
        });
        imageUrl = res.imageUrl;
      }

      await createEventApi(token, {
        title,
        description,
        imageUrl,
        eventType
      });

      // 🔒 FORCE form open
      setIsExpanded(true);
      setShowSuccess(true);

      // Reset form
      setTitle("");
      setDescription("");
      setEventType("announcement");
      setImageFile(null);
      setPreview(null);

      // Delay parent refresh
      setTimeout(() => {
        onCreated();
      }, 10000);

      // Hide success only
      setTimeout(() => {
        setShowSuccess(false);
      }, 55000);

    } catch (err) {
      console.error("Event create failed", err);
      alert("Failed to create event");
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  const eventTypes = [
    { value: "announcement", label: "Announcement", color: "text-blue-400", bg: "bg-blue-400/10" },
    { value: "achievement", label: "Achievement", color: "text-[#E6C200]", bg: "bg-[#E6C200]/10" },
    { value: "marriage", label: "Marriage", color: "text-pink-400", bg: "bg-pink-400/10" },
    { value: "other", label: "Other", color: "text-[#B3B3B3]", bg: "bg-gray-800/30" }
  ];

  return (
    <div className="bg-[#111111] rounded-xl border border-gray-800/50 overflow-hidden">
      
      {/* Success Message */}
      {showSuccess && (
        <div className="m-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg animate-slideDown">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-400" />
            <div className="flex-1">
              <h4 className="text-[#FFFFFF] font-semibold text-sm mb-1">
                Event Created Successfully!
              </h4>
              <p className="text-xs text-[#B3B3B3] flex items-center gap-1.5">
                <Mail size={12} className="text-[#E6C200]" />
                Email notifications have been sent to all community members
              </p>
              <p className="text-xs text-green-400 mt-2">
                ✓ Everyone has been notified about this event
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="p-1 hover:bg-gray-800/50 rounded"
            >
              <X size={16} className="text-[#7A7A7A]" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/20
          ${(loading || uploading || showSuccess) ? "opacity-60 pointer-events-none" : ""}
        `}
        onClick={() => {
          if (loading || uploading || showSuccess) return;
          setIsExpanded(!isExpanded);
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E6C200]/10 rounded-lg">
            <Calendar size={18} className="text-[#E6C200]" />
          </div>
          <div>
            <h3 className="text-[#FFFFFF] font-semibold text-sm">
              Create New Event
            </h3>
            <p className="text-xs text-[#7A7A7A]">
              Share something with the community
            </p>
          </div>
        </div>
        <div className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}>
          ▼
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-800/30 animate-slideDown">
          <div className="space-y-4">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#B3B3B3] flex items-center gap-1.5">
                <Type size={14} className="text-[#E6C200]" />
                Title
              </label>
              <input
                className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-2.5 text-[#FFFFFF] placeholder:text-[#7A7A7A] text-sm focus:outline-none focus:border-[#E6C200]/50 focus:ring-1 focus:ring-[#E6C200]/20 transition-all"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#B3B3B3] flex items-center gap-1.5">
                <AlignLeft size={14} className="text-[#E6C200]" />
                Description
              </label>
              <textarea
                className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-2.5 text-[#FFFFFF] placeholder:text-[#7A7A7A] text-sm focus:outline-none focus:border-[#E6C200]/50 focus:ring-1 focus:ring-[#E6C200]/20 transition-all min-h-[100px] resize-none"
                placeholder="Describe your event..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Event Type Select */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#B3B3B3] flex items-center gap-1.5">
                <Tag size={14} className="text-[#E6C200]" />
                Event Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {eventTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setEventType(type.value)}
                    className={`
                      px-3 py-2 rounded-lg border text-xs font-medium capitalize
                      transition-all duration-200
                      ${eventType === type.value 
                        ? `${type.bg} ${type.color} border-${type.value === 'achievement' ? '[#E6C200]' : type.value === 'marriage' ? 'pink-400' : type.value === 'announcement' ? 'blue-400' : 'gray-700'}/50` 
                        : 'bg-gray-800/20 border-gray-700/50 text-[#7A7A7A] hover:bg-gray-800/40'
                      }
                    `}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#B3B3B3] flex items-center gap-1.5">
                <ImageIcon size={14} className="text-[#E6C200]" />
                Image (optional)
              </label>

              {/* Image Preview */}
              {preview && (
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="preview"
                    className="h-24 w-24 object-cover rounded-lg border border-gray-700/50"
                  />
                  <button
                    onClick={() => {
                      setPreview(null);
                      setImageFile(null);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500/90 hover:bg-red-500 rounded-full transition-colors"
                  >
                    <X size={12} className="text-[#FFFFFF]" />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="eventImage"
                />
                <label
                  htmlFor="eventImage"
                  className="cursor-pointer px-4 py-2 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs font-medium text-[#B3B3B3] hover:text-[#FFFFFF] transition-all flex items-center gap-2"
                >
                  <ImageIcon size={14} />
                  Choose Image
                </label>
                {preview && (
                  <span className="text-xs text-[#7A7A7A]">
                    {imageFile?.name}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={submit}
              disabled={loading || uploading || !title || !description}
              className="w-full mt-4 px-4 py-3 bg-[#E6C200] hover:bg-[#f5d120] disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-all group flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                  <span className="text-sm font-medium text-[#0A0A0A]">Uploading image...</span>
                </>
              ) : loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                  <span className="text-sm font-medium text-[#0A0A0A]">Creating event...</span>
                </>
              ) : (
                <>
                  <Send size={16} className="text-[#0A0A0A]" />
                  <span className="text-sm font-medium text-[#0A0A0A]">Create Event</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyProfileApi, upsertMyProfileApi } from "../api/userApi";
import { uploadImage } from "../api/mediaApi";
import { 
  User, 
  Edit2, 
  Camera, 
  Save, 
  Loader2,
  Mail,
  Calendar,
  MapPin,
  Link as LinkIcon
} from 'lucide-react';

/* 🔹 helper to decode JWT */
const getTokenPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const MyProfile = () => {
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [avatar, setAvatar] = useState(null); // stored url
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* 🔹 PREFILL NAME FROM TOKEN (INSTANT UX) */
  useEffect(() => {
    if (!token) return;

    const payload = getTokenPayload(token);
    if (payload?.name) {
      setName(payload.name);
    }
  }, [token]);

  /* 🔹 LOAD PROFILE (API CAN OVERRIDE IF NEEDED) */
  useEffect(() => {
    if (!token) return; 
    const load = async () => {
      const data = await getMyProfileApi(token);
      if (data) {
        setName(data.name || "");
        setAvatar(data.avatar || null);
        setBio(data.bio || "");
      }
    };
    load();
  }, [token]);

  // image select
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

  const saveProfile = async () => {
    try {
      setSaving(true);
      let avatarUrl = avatar;

      if (imageFile) {
        setUploading(true);

        const res = await uploadImage({
          file: imageFile,
          context: "profile",
          token
        });

        avatarUrl = res.imageUrl;
      }

      await upsertMyProfileApi(token, {
        name,
        bio,
        avatar: avatarUrl
      });

      alert("Profile updated");

      setAvatar(avatarUrl);
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setUploading(false);
      setSaving(false);
    }
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
    <div className="min-h-screen bg-[#0A0A0A] font-['Inter'] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-[#E6C200]/10 rounded-xl">
            <User size={20} className="text-[#E6C200]" />
          </div>
          <div>
            <h1 className="text-xl font-light tracking-tight text-[#FFFFFF]">
              My Profile
            </h1>
            <p className="text-xs text-[#7A7A7A] font-medium mt-0.5">
              Manage your personal information
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-[#111111] rounded-xl border border-gray-800/50 overflow-hidden">
          {/* Cover Photo Placeholder */}
          <div className="h-32 bg-gradient-to-r from-[#E6C200]/10 to-[#E6C200]/5 relative">
            <div className="absolute -bottom-12 left-8">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-xl overflow-hidden ring-4 ring-[#111111] bg-[#111111]">
                  {(preview || avatar) ? (
                    <img
                      src={preview || avatar}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <span className="text-2xl font-semibold text-[#B3B3B3]">
                        {getInitials(name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Image upload button */}
                <label
                  htmlFor="profileImage"
                  className="absolute -bottom-1 -right-1 p-2 bg-[#E6C200] hover:bg-[#f5d120] rounded-lg cursor-pointer transition-all hover:scale-110 shadow-lg"
                >
                  <Camera size={14} className="text-[#0A0A0A]" />
                </label>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 p-6">
            {/* Name Display */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-[#FFFFFF]">
                {name || 'Your Name'}
              </h2>
              <p className="text-sm text-[#B3B3B3] mt-1">
                {bio || 'Add a bio to tell others about yourself'}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#B3B3B3] flex items-center gap-1.5">
                  <Edit2 size={14} className="text-[#E6C200]" />
                  Full Name
                </label>
                <input
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-3 text-[#FFFFFF] placeholder:text-[#7A7A7A] text-sm focus:outline-none focus:border-[#E6C200]/50 focus:ring-1 focus:ring-[#E6C200]/20 transition-all"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Bio Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#B3B3B3] flex items-center gap-1.5">
                  <Edit2 size={14} className="text-[#E6C200]" />
                  Bio
                </label>
                <textarea
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-3 text-[#FFFFFF] placeholder:text-[#7A7A7A] text-sm focus:outline-none focus:border-[#E6C200]/50 focus:ring-1 focus:ring-[#E6C200]/20 transition-all resize-none"
                  placeholder="Say hi 👋 Where are you now and what are you doing?"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  maxLength={300}
                />
                
                {/* Character counter */}
                <div className="flex justify-end">
                  <span className={`text-xs font-medium ${bio.length >= 300 ? 'text-red-400' : 'text-[#7A7A7A]'}`}>
                    {bio.length}/300
                  </span>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profileImage"
              />

              {/* Image preview if changed */}
              {preview && (
                <div className="flex items-center gap-3 p-3 bg-gray-800/20 rounded-lg border border-gray-700/50">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <button
                      onClick={() => {
                        setPreview(null);
                        setImageFile(null);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500/90 hover:bg-red-500 rounded-full transition-colors"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                        <path d="M18 6L6 18M6 6L18 18" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <span className="text-xs text-[#B3B3B3]">
                    New profile picture ready to upload
                  </span>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={saveProfile}
                disabled={saving || uploading}
                className="w-full mt-6 px-4 py-3 bg-[#E6C200] hover:bg-[#f5d120] disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-all group flex items-center justify-center gap-2"
              >
                {(uploading || saving) ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-[#0A0A0A]" />
                    <span className="text-sm font-medium text-[#0A0A0A]">
                      {uploading ? "Uploading..." : "Saving..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Save size={18} className="text-[#0A0A0A]" />
                    <span className="text-sm font-medium text-[#0A0A0A]">
                      Save Profile
                    </span>
                  </>
                )}
              </button>
            </div>

            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
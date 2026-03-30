import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Users, Loader2, Heart, Star, Bookmark } from 'lucide-react';

const EventResponses = ({ eventId, refreshKey }) => {
  const { token } = useAuth();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResponses = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_EVENT_API}/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setResponses(res.data.responses || []);
      } catch (err) {
        console.error("Failed to load responses", err);
      } finally {
        setLoading(false);
      }
    };

    if (token && eventId) {
      loadResponses();
    }
  }, [eventId, token, refreshKey]);

  // Get response color and icon
  const getResponseStyle = (response) => {
    switch(response?.toLowerCase()) {
      case 'congrats':
        return { 
          bg: 'bg-[#E6C200]/10', 
          text: 'text-[#E6C200]', 
          border: 'border-[#E6C200]/20',
          icon: Star,
          label: 'Congrats'
        };
      case 'interested':
        return { 
          bg: 'bg-pink-400/10', 
          text: 'text-pink-400', 
          border: 'border-pink-400/20',
          icon: Heart,
          label: 'Interested'
        };
      case 'noted':
        return { 
          bg: 'bg-blue-400/10', 
          text: 'text-blue-400', 
          border: 'border-blue-400/20',
          icon: Bookmark,
          label: 'Noted'
        };
      default:
        return { 
          bg: 'bg-gray-800/30', 
          text: 'text-[#B3B3B3]', 
          border: 'border-gray-700/50',
          icon: Star,
          label: response
        };
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={20} className="text-[#E6C200] animate-spin" />
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center mb-3">
          <Users size={20} className="text-[#7A7A7A]" />
        </div>
        <p className="text-[#B3B3B3] text-sm font-medium">
          No responses yet
        </p>
        <p className="text-[#7A7A7A] text-xs mt-1">
          Be the first to respond to this event
        </p>
      </div>
    );
  }

  // Group responses by type
  const groupedResponses = responses.reduce((acc, response) => {
    const type = response.response?.toLowerCase() || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(response);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Response Summary */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(groupedResponses).map(([type, list]) => {
          const style = getResponseStyle(type);
          const Icon = style.icon;
          
          return (
            <div 
              key={type}
              className={`flex flex-col items-center p-2 rounded-lg border ${style.border} ${style.bg}`}
            >
              <Icon size={14} className={`${style.text} mb-1`} />
              <div className={`text-xs font-medium capitalize ${style.text}`}>
                {type}
              </div>
              <div className="text-sm font-semibold text-[#FFFFFF]">
                {list.length}
              </div>
            </div>
          );
        })}
      </div>

      {/* Responses List */}
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent pr-1">
        {responses.map((r, index) => {
          const style = getResponseStyle(r.response);
          const Icon = style.icon;
          
          return (
            <div
              key={`${r.userId}-${index}`}
              className="flex items-center justify-between p-3 bg-gray-800/20 rounded-lg border border-gray-800/30 hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                {r.avatar ? (
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-700/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <span className="text-xs font-semibold text-[#B3B3B3]">
                      {getInitials(r.name)}
                    </span>
                  </div>
                )}

                {/* User Info */}
                <div>
                  <div className="text-[#FFFFFF] font-medium text-sm">
                    {r.name}
                  </div>
                  <div className="text-[#7A7A7A] text-xs">
                    {r.enrollment || 'No ID'}
                  </div>
                </div>
              </div>

              {/* Response Badge */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${style.bg} ${style.text} text-xs font-medium capitalize border ${style.border}`}>
                <Icon size={10} />
                <span>{style.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Count */}
      <div className="pt-3 text-xs text-[#7A7A7A] border-t border-gray-800/30 flex justify-between items-center">
        <span>Total responses</span>
        <span className="font-semibold text-[#FFFFFF]">{responses.length}</span>
      </div>
    </div>
  );
};

export default EventResponses;
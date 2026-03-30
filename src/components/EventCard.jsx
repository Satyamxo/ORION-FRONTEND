import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { respondEventApi } from "../api/eventApi";
import EventResponses from "./EventResponses";
import { 
  Heart, 
  Star, 
  Bookmark, 
  Users, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  UserCircle
} from 'lucide-react';

const EventCard = ({ event, onResponded }) => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showResponses, setShowResponses] = useState(false);

  const respond = async (type) => {
    try {
      setLoading(true);
      await respondEventApi(token, event._id, type);
      setRefreshKey((k) => k + 1);
      onResponded();
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // Get event type color
  const getEventTypeColor = (type) => {
    switch(type) {
      case 'announcement':
        return { bg: 'bg-blue-400/10', text: 'text-blue-400', border: 'border-blue-400/20' };
      case 'achievement':
        return { bg: 'bg-[#E6C200]/10', text: 'text-[#E6C200]', border: 'border-[#E6C200]/20' };
      case 'marriage':
        return { bg: 'bg-pink-400/10', text: 'text-pink-400', border: 'border-pink-400/20' };
      default:
        return { bg: 'bg-gray-800/30', text: 'text-[#B3B3B3]', border: 'border-gray-700/50' };
    }
  };

  // Get response button config
  const getResponseConfig = (type) => {
    switch(type) {
      case 'congrats':
        return { 
          icon: Star, 
          label: 'Congrats', 
          color: 'text-[#E6C200]', 
          bgColor: 'bg-[#E6C200]/10',
          borderColor: 'border-[#E6C200]/20',
          hover: 'hover:bg-[#E6C200]/20' 
        };
      case 'interested':
        return { 
          icon: Heart, 
          label: 'Interested', 
          color: 'text-pink-400', 
          bgColor: 'bg-pink-400/10',
          borderColor: 'border-pink-400/20',
          hover: 'hover:bg-pink-400/20' 
        };
      case 'noted':
        return { 
          icon: Bookmark, 
          label: 'Noted', 
          color: 'text-blue-400', 
          bgColor: 'bg-blue-400/10',
          borderColor: 'border-blue-400/20',
          hover: 'hover:bg-blue-400/20' 
        };
      default:
        return { 
          icon: Star, 
          label: type, 
          color: 'text-[#B3B3B3]', 
          bgColor: 'bg-gray-800/30',
          borderColor: 'border-gray-700/50',
          hover: 'hover:bg-gray-800/50' 
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

  const typeStyle = getEventTypeColor(event.eventType);
  const isCreator = event.creatorId === user?.userId;

  return (
    <div className="bg-[#111111] rounded-xl border border-gray-800/50 overflow-hidden hover:border-[#E6C200]/30 transition-all duration-300 group">
      {/* Event Header with Type and Date */}
      <div className="flex items-center justify-between p-4 pb-2 border-b border-gray-800/30">
        <div className={`px-2 py-1 rounded-lg ${typeStyle.bg} ${typeStyle.text} text-xs font-medium capitalize flex items-center gap-1`}>
          <span>{event.eventType || 'announcement'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#7A7A7A] text-xs">
          <Calendar size={12} />
          <span>{formatDate(event.createdAt)}</span>
        </div>
      </div>

      {/* Event Image */}
      {event.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
        </div>
      )}

      {/* Event Content */}
      <div className="p-4">
        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-3">
          {event.creatorAvatar ? (
            <img
              src={event.creatorAvatar}
              alt={event.creatorName}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-700/50"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <UserCircle size={14} className="text-[#B3B3B3]" />
            </div>
          )}
          <span className="text-xs text-[#B3B3B3]">
            Created by{' '}
            <span className="text-[#E6C200] font-medium">
              {isCreator ? 'you' : event.creatorName || 'Organizer'}
            </span>
          </span>
        </div>

        {/* Title & Description */}
        <div className="mb-4">
          <h3 className="text-[#FFFFFF] font-semibold text-lg tracking-tight mb-2">
            {event.title}
          </h3>
          <p className="text-[#B3B3B3] text-sm leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Response Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {["congrats", "interested", "noted"].map((r) => {
            const config = getResponseConfig(r);
            const Icon = config.icon;
            
            return (
              <button
                key={r}
                disabled={loading}
                onClick={() => respond(r)}
                className={`
                  flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg 
                  border ${config.borderColor} ${config.bgColor} ${config.hover}
                  transition-all disabled:opacity-50 disabled:cursor-not-allowed 
                  group/btn hover:scale-105 active:scale-95
                `}
              >
                <Icon size={14} className={`${config.color} group-hover/btn:scale-110 transition-transform`} />
                <span className="text-xs font-medium text-[#B3B3B3] capitalize hidden sm:inline">
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800/30">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-[#7A7A7A]" />
            <span className="text-xs text-[#B3B3B3]">
              {event.responses?.length || 0} {event.responses?.length === 1 ? 'response' : 'responses'}
            </span>
          </div>

          <button
            onClick={() => setShowResponses(!showResponses)}
            className="flex items-center gap-1 text-xs font-medium text-[#E6C200] hover:text-[#f5d120] transition-colors"
          >
            <span>{showResponses ? 'Hide' : 'View'} responses</span>
            {showResponses ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
        </div>

        {/* Responses Section */}
        {showResponses && (
          <div className="mt-4 pt-4 border-t border-gray-800/30 animate-slideDown">
            <EventResponses
              eventId={event._id}
              refreshKey={refreshKey}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
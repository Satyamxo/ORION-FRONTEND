import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getEventsApi } from "../api/eventApi";
import EventCard from "../components/EventCard";
import CreateEvent from "../components/CreateEvent";
import EventResponses from "../components/EventResponses";
import { Calendar, Loader2, X, Filter } from 'lucide-react';

const Events = () => {
  const { token } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [showResponses, setShowResponses] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const loadEvents = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await getEventsApi(token);
      setEvents(data);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadEvents();
    }
  }, [token]);

  // Filter events
  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(event => event.eventType === filter);

  // Event types for filter
  const eventTypes = [
    { value: "all", label: "All", color: "text-[#FFFFFF]" },
    { value: "announcement", label: "Announcements", color: "text-blue-400" },
    { value: "achievement", label: "Achievements", color: "text-[#E6C200]" },
    { value: "marriage", label: "Marriages", color: "text-pink-400" },
    { value: "other", label: "Other", color: "text-[#B3B3B3]" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-[#E6C200] animate-spin" />
          <p className="text-[#B3B3B3] font-medium text-sm">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-['Inter']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 md:p-3 bg-[#E6C200]/10 rounded-xl">
              <Calendar size={20} className="md:w-6 md:h-6 text-[#E6C200]" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-light tracking-tight text-[#FFFFFF]">
                Events
              </h1>
              <p className="text-xs md:text-sm text-[#7A7A7A] font-medium mt-0.5">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
              </p>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700/50 transition-all">
              <Filter size={16} className="text-[#E6C200]" />
              <span className="text-sm text-[#FFFFFF] hidden sm:inline">
                {eventTypes.find(t => t.value === filter)?.label}
              </span>
            </button>
            
            {/* Filter Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-[#111111] border border-gray-800/50 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFilter(type.value)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-800/50 first:rounded-t-lg last:rounded-b-lg ${type.color} ${filter === type.value ? 'bg-gray-800/30' : ''}`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Create Event */}
        <div className="mb-8">
          <CreateEvent onCreated={loadEvents} />
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 rounded-2xl bg-gray-800/50 flex items-center justify-center mb-4">
              <Calendar size={32} className="text-[#7A7A7A]" />
            </div>
            <h3 className="text-[#FFFFFF] font-semibold text-lg mb-2">
              No events found
            </h3>
            <p className="text-[#B3B3B3] text-sm text-center max-w-md">
              {filter === "all" 
                ? "Create your first event to get started with ORION"
                : `No ${filter} events available`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onResponded={loadEvents}
              />
            ))}
          </div>
        )}
      </div>

      {/* Responses Modal */}
      {showResponses && selectedEventId && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowResponses(false);
            setSelectedEventId(null);
          }}
        >
          <div 
            className="bg-[#111111] rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden border border-gray-800/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-800/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E6C200]/10 flex items-center justify-center">
                  <Calendar size={16} className="text-[#E6C200]" />
                </div>
                <h2 className="text-[#FFFFFF] font-semibold text-base">
                  Event Responses
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowResponses(false);
                  setSelectedEventId(null);
                }}
                className="p-1.5 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <X size={18} className="text-[#B3B3B3] hover:text-[#FFFFFF]" />
              </button>
            </div>

            <div className="p-4 md:p-5 max-h-[calc(80vh-80px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              <EventResponses eventId={selectedEventId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
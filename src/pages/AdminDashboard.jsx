// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { getPendingUsersApi } from "../api/adminApi";
// import PendingUserCard from "../components/PendingUserCard";
// import { Shield, Users, UserCheck, UserX, Loader2 } from 'lucide-react';

// const AdminDashboard = () => {
//   const { token, user } = useAuth();
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     total: 0,
//     today: 0,
//     week: 0
//   });

//   const loadPendingUsers = async () => {
//     try {
//       setLoading(true);
//       const data = await getPendingUsersApi(token);
//       setPendingUsers(data);
      
//       // Calculate stats
//       const now = new Date();
//       const today = new Date(now.setHours(0, 0, 0, 0));
//       const weekAgo = new Date(now.setDate(now.getDate() - 7));
      
//       setStats({
//         total: data.length,
//         today: data.filter(u => new Date(u.createdAt) >= today).length,
//         week: data.filter(u => new Date(u.createdAt) >= weekAgo).length
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadPendingUsers();
//   }, []);

//   if (user?.role !== "admin") {
//     return (
//       <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
//         <div className="bg-[#111111] rounded-2xl border border-gray-800/50 p-8 text-center max-w-md">
//           <div className="w-16 h-16 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
//             <Shield size={24} className="text-red-400" />
//           </div>
//           <h3 className="text-[#FFFFFF] font-semibold text-lg mb-2">
//             Access Denied
//           </h3>
//           <p className="text-[#B3B3B3] text-sm mb-6">
//             You don't have permission to access the admin dashboard.
//           </p>
//           <button
//             onClick={() => window.history.back()}
//             className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-sm text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 size={32} className="text-[#E6C200] animate-spin" />
//           <p className="text-[#B3B3B3] font-medium text-sm">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0A0A0A] font-['Inter'] py-8 px-4">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 md:p-3 bg-[#E6C200]/10 rounded-xl">
//               <Shield size={20} className="md:w-6 md:h-6 text-[#E6C200]" />
//             </div>
//             <div>
//               <h1 className="text-xl md:text-2xl font-light tracking-tight text-[#FFFFFF]">
//                 Admin Dashboard
//               </h1>
//               <p className="text-xs md:text-sm text-[#7A7A7A] font-medium mt-0.5">
//                 Manage pending user requests
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="bg-[#111111] rounded-xl border border-gray-800/50 p-5">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-[#E6C200]/10 rounded-lg">
//                 <Users size={18} className="text-[#E6C200]" />
//               </div>
//               <span className="text-sm text-[#B3B3B3]">Total Pending</span>
//             </div>
//             <p className="text-2xl font-semibold text-[#FFFFFF]">{stats.total}</p>
//             <p className="text-xs text-[#7A7A7A] mt-1">Awaiting review</p>
//           </div>

//           <div className="bg-[#111111] rounded-xl border border-gray-800/50 p-5">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-blue-400/10 rounded-lg">
//                 <UserCheck size={18} className="text-blue-400" />
//               </div>
//               <span className="text-sm text-[#B3B3B3]">Today</span>
//             </div>
//             <p className="text-2xl font-semibold text-[#FFFFFF]">{stats.today}</p>
//             <p className="text-xs text-[#7A7A7A] mt-1">New requests today</p>
//           </div>

//           <div className="bg-[#111111] rounded-xl border border-gray-800/50 p-5">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-purple-400/10 rounded-lg">
//                 <UserX size={18} className="text-purple-400" />
//               </div>
//               <span className="text-sm text-[#B3B3B3]">This Week</span>
//             </div>
//             <p className="text-2xl font-semibold text-[#FFFFFF]">{stats.week}</p>
//             <p className="text-xs text-[#7A7A7A] mt-1">Last 7 days</p>
//           </div>
//         </div>

//         {/* Pending Users Section */}
//         <div className="bg-[#111111] rounded-xl border border-gray-800/50 overflow-hidden">
//           <div className="p-5 border-b border-gray-800/50">
//             <h2 className="text-[#FFFFFF] font-semibold text-lg flex items-center gap-2">
//               <UserCheck size={18} className="text-[#E6C200]" />
//               Pending Requests
//               {pendingUsers.length > 0 && (
//                 <span className="px-2 py-0.5 bg-[#E6C200]/10 text-[#E6C200] text-xs rounded-full border border-[#E6C200]/20">
//                   {pendingUsers.length} pending
//                 </span>
//               )}
//             </h2>
//           </div>

//           <div className="p-5">
//             {pendingUsers.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//                 <div className="w-16 h-16 rounded-xl bg-gray-800/50 flex items-center justify-center mb-4">
//                   <UserCheck size={24} className="text-[#7A7A7A]" />
//                 </div>
//                 <h3 className="text-[#FFFFFF] font-semibold text-lg mb-2">
//                   All Clear! 🎉
//                 </h3>
//                 <p className="text-[#B3B3B3] text-sm max-w-md">
//                   No pending user requests at the moment. New sign-ups will appear here.
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {pendingUsers.map((u) => (
//                   <PendingUserCard
//                     key={u._id}
//                     user={u}
//                     onAction={loadPendingUsers}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Footer Stats */}
//         {pendingUsers.length > 0 && (
//           <div className="mt-4 text-xs text-[#7A7A7A] text-right">
//             Showing {pendingUsers.length} pending {pendingUsers.length === 1 ? 'request' : 'requests'}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPendingUsersApi } from "../api/adminApi";
import PendingUserCard from "../components/PendingUserCard";
import { Shield, Users, UserCheck, UserX, Loader2, ChevronRight, Calendar, TrendingUp, Clock, Ban, CheckCircle, Search, Filter } from 'lucide-react';
import { blockUserApi, unblockUserApi } from "../api/adminApi";
import { getAllUsersApi } from "../api/adminApi";

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    week: 0
  });

  const loadAllUsers = async () => {
    try {
      const data = await getAllUsersApi(token);
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlock = async (userId) => {
    try {
      await blockUserApi(token, userId);

      loadPendingUsers();
      loadAllUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await unblockUserApi(token, userId);
      
      loadPendingUsers();
      loadAllUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const loadPendingUsers = async () => {
    try {
      setLoading(true);
      const data = await getPendingUsersApi(token);
      setPendingUsers(data);

      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const weekAgo = new Date(now.setDate(now.getDate() - 7));

      setStats({
        total: data.length,
        today: data.filter(u => new Date(u.createdAt) >= today).length,
        week: data.filter(u => new Date(u.createdAt) >= weekAgo).length
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingUsers();
    loadAllUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#000000] flex items-center justify-center p-4">
        <div className="bg-[#111111] rounded-2xl border border-gray-800/50 p-8 text-center max-w-md shadow-2xl backdrop-blur-sm">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield size={24} className="text-red-400" />
          </div>
          <h3 className="text-[#FFFFFF] font-semibold text-lg mb-2">
            Access Denied
          </h3>
          <p className="text-[#B3B3B3] text-sm mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-sm text-[#B3B3B3] hover:text-[#FFFFFF] transition-all duration-300 hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#000000] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Loader2 size={40} className="text-[#E6C200] animate-spin" />
            <div className="absolute inset-0 rounded-full blur-xl bg-[#E6C200]/20 animate-pulse"></div>
          </div>
          <p className="text-[#B3B3B3] font-medium text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#000000] font-['Inter'] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with gradient */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[#E6C200]/20 to-[#E6C200]/5 rounded-xl shadow-lg">
                <Shield size={22} className="md:w-6 md:h-6 text-[#E6C200]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#FFFFFF] bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-xs md:text-sm text-[#7A7A7A] font-medium mt-1">
                  Manage pending user requests and system controls
                </p>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-[#111111] rounded-lg border border-gray-800/50">
              <span className="text-xs text-[#E6C200]">Admin Access</span>
            </div>
          </div>
        </div>

        {/* Stats Cards with hover effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="group bg-[#111111] rounded-xl border border-gray-800/50 p-5 hover:border-[#E6C200]/30 hover:shadow-lg hover:shadow-[#E6C200]/5 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#E6C200]/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Users size={18} className="text-[#E6C200]" />
              </div>
              <span className="text-sm text-[#B3B3B3]">Total Pending</span>
            </div>
            <p className="text-3xl font-bold text-[#FFFFFF]">{stats.total}</p>
            <p className="text-xs text-[#7A7A7A] mt-1 flex items-center gap-1">
              <Clock size={10} /> Awaiting review
            </p>
          </div>

          <div className="group bg-[#111111] rounded-xl border border-gray-800/50 p-5 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-400/5 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-400/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Calendar size={18} className="text-blue-400" />
              </div>
              <span className="text-sm text-[#B3B3B3]">Today</span>
            </div>
            <p className="text-3xl font-bold text-[#FFFFFF]">{stats.today}</p>
            <p className="text-xs text-[#7A7A7A] mt-1 flex items-center gap-1">
              <TrendingUp size={10} /> New requests today
            </p>
          </div>

          <div className="group bg-[#111111] rounded-xl border border-gray-800/50 p-5 hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-400/5 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-400/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <UserX size={18} className="text-purple-400" />
              </div>
              <span className="text-sm text-[#B3B3B3]">This Week</span>
            </div>
            <p className="text-3xl font-bold text-[#FFFFFF]">{stats.week}</p>
            <p className="text-xs text-[#7A7A7A] mt-1 flex items-center gap-1">
              <TrendingUp size={10} /> Last 7 days
            </p>
          </div>
        </div>

        {/* Pending Users Section */}
        <div className="bg-[#111111] rounded-xl border border-gray-800/50 overflow-hidden shadow-xl mb-8">
          <div className="p-5 border-b border-gray-800/50 bg-gradient-to-r from-[#111111] to-[#0A0A0A]">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-[#FFFFFF] font-semibold text-lg flex items-center gap-2">
                <UserCheck size={18} className="text-[#E6C200]" />
                Pending Requests
                {pendingUsers.length > 0 && (
                  <span className="px-2.5 py-0.5 bg-[#E6C200]/10 text-[#E6C200] text-xs rounded-full border border-[#E6C200]/20 font-mono">
                    {pendingUsers.length} pending
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="p-5">
            {pendingUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-800/30 flex items-center justify-center mb-4 animate-pulse">
                  <UserCheck size={32} className="text-[#7A7A7A]" />
                </div>
                <h3 className="text-[#FFFFFF] font-semibold text-xl mb-2">
                  All Clear! 🎉
                </h3>
                <p className="text-[#B3B3B3] text-sm max-w-md">
                  No pending user requests at the moment. New sign-ups will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map((u, index) => (
                  <div key={u._id} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                    <PendingUserCard
                      user={u}
                      onAction={loadPendingUsers}
                      onBlock={handleBlock}
                      onUnblock={handleUnblock}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* All Users Section with Search */}
        <div className="bg-[#111111] rounded-xl border border-gray-800/50 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-gray-800/50 bg-gradient-to-r from-[#111111] to-[#0A0A0A]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-[#FFFFFF] font-semibold text-lg flex items-center gap-2">
                <Users size={18} className="text-[#E6C200]" />
                All Users
                <span className="px-2.5 py-0.5 bg-gray-800/50 text-[#B3B3B3] text-xs rounded-full font-mono">
                  {users.length} total
                </span>
              </h2>
              
              {/* Search Input */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded-lg text-sm text-[#FFFFFF] placeholder-[#7A7A7A] focus:outline-none focus:border-[#E6C200]/50 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="p-5">
            {filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-[#7A7A7A] text-sm">No users found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((u, index) => (
                  <div
                    key={u._id}
                    className="group flex justify-between items-center border border-gray-800 rounded-lg p-4 hover:border-gray-700 hover:bg-[#0A0A0A] transition-all duration-300 animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[#FFFFFF] text-sm font-medium">{u.name || 'No name'}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isBlocked ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                          {u.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </div>
                      <p className="text-[#7A7A7A] text-xs">{u.email}</p>
                      {u.createdAt && (
                        <p className="text-[#7A7A7A] text-xs mt-1 flex items-center gap-1">
                          <Calendar size={10} />
                          Joined: {new Date(u.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        u.isBlocked
                          ? handleUnblock(u._id)
                          : handleBlock(u._id)
                      }
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                        u.isBlocked
                          ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {u.isBlocked ? (
                        <>
                          <CheckCircle size={12} />
                          Unblock
                        </>
                      ) : (
                        <>
                          <Ban size={12} />
                          Block
                        </>
                      )}
                      <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        {pendingUsers.length > 0 && (
          <div className="mt-6 text-xs text-[#7A7A7A] text-right animate-fadeIn">
            Showing {pendingUsers.length} pending {pendingUsers.length === 1 ? 'request' : 'requests'}
          </div>
        )}
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
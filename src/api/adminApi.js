import axios from "axios";

const BASE = import.meta.env.VITE_AUTH_API;

// GET pending users
export const getPendingUsersApi = async (token) => {
  const res = await axios.get(
    `${BASE}/admin/pending-users`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
};
export const getAllUsersApi = async (token) => {
  const res = await axios.get(`${BASE}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
// APPROVE user
export const approveUserApi = async (token, userId) => {
  const res = await axios.post(
    `${BASE}/admin/approve/${userId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// REJECT user
export const rejectUserApi = async (token, userId) => {
  const res = await axios.post(
    `${BASE}/admin/reject/${userId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
export const blockUserApi = async (token, userId) => {
  const res = await axios.post(
    `${BASE}/admin/block/${userId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// 🟢 UNBLOCK user (NEW)
export const unblockUserApi = async (token, userId) => {
  const res = await axios.post(
    `${BASE}/admin/unblock/${userId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
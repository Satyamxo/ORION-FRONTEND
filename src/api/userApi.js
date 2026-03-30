import axios from "axios";

const BASE = import.meta.env.VITE_USER_API;

/**
 * Get all users (for chat user list)
 * GET /api/users
 */
export const getUsersApi = async (token) => {
  const res = await axios.get(
    `${BASE}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};

/**
 * Get user basic info (for group chat)
 * GET /api/users/:id
 */
export const getUserProfileApiForGroupChat = async (token, userId) => {
  const res = await axios.get(
    `${BASE}/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};

/**
 * Get full user profile by ID
 * GET /api/users/:id/profile
 */
export const getUserProfileApi = async (token, userId) => {
  const res = await axios.get(
    `${BASE}/${userId}/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};

/**
 * Get user by ID (alias)
 * GET /api/users/:id
 */
export const getUserByIdApi = async (token, userId) => {
  const res = await axios.get(
    `${BASE}/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};

/**
 * Get logged-in user's profile
 * GET /api/users/me
 */
export const getMyProfileApi = async (token) => {
  const res = await axios.get(
    `${BASE}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};

/**
 * Create / Update logged-in user's profile
 * POST /api/users/me
 */
export const upsertMyProfileApi = async (token, payload) => {
  const res = await axios.post(
    `${BASE}/me`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};
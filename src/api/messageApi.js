import axios from "axios";

const API_URL = import.meta.env.VITE_MESSAGE_API;

/**
 * 🔹 Get CLASS GROUP chat history
 */
export const getGroupMessagesApi = async (token) => {
  const res = await axios.get(
    `${API_URL}/group/class`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};

/**
 * 🔹 Get PRIVATE chat history with a user
 */
export const getPrivateMessagesApi = async (token, userId) => {
  if (!userId) return [];

  const res = await axios.get(
    `${API_URL}/private/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};

/**
 * 🔹 Mark PRIVATE messages as read
 */
export const markPrivateMessagesReadApi = async (token, userId) => {
  await axios.patch(
    `${API_URL}/private/read/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};


export const getPrivateChatSummaryApi = async (token) => {
  const res = await axios.get(
    `${API_URL}/private/summary`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};
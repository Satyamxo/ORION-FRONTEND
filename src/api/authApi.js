import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE = import.meta.env.VITE_AUTH_API;

/**
 * Login user
 * POST /api/auth/login
 */
export const loginApi = async (data) => {
  const res = await axios.post(
    `${BASE}/login`,
    data
  );

  const token = res.data.token;
  

  return res.data;
};

/**
 * Signup user
 * POST /api/auth/signup
 */
export const signupApi = async (payload) => {
  const res = await axios.post(
    `${BASE}/signup`,
    payload
  );
  return res.data;
};
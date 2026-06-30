import axios from "axios";
import { refreshAccessToken } from "./auth.service.js";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  
});
console.log(import.meta.env.VITE_API_URL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

    console.log("REQUEST:", config.url);
  console.log("TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


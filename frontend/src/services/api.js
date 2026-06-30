import axios from "axios";
import { refreshAccessToken } from "./auth.service";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

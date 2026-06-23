import { api } from "./api.js";
import { refreshClient } from "./refreshClient.js";

// Login
export const loginUser = (credentials) =>
  api.post("/users/login", credentials, { withCredentials: true });

// Logout
export const logoutUser = () =>
  api.post("/users/logout");

// Get current logged-in user
export const getCurrentUser = () =>
  api.get("/users/me", { withCredentials: true });

// Refresh token
export const refreshAccessToken = () =>
  refreshClient.post("/users/refresh-token");



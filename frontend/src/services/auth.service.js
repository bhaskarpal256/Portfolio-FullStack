import { api } from "./api.js";
import { refreshClient } from "./refreshClient.js";

// Login
export const loginUser = (credentials) => {
  console.log("LOGIN REQUEST");
  return api.post("/users/login", credentials);
};

// Logout
export const logoutUser = () =>
  api.post("/users/logout");

// Get current logged-in user
export const getCurrentUser = () =>
  api.get("/users/me", { withCredentials: true });

// Refresh token
export const refreshAccessToken = () =>
  refreshClient.post("/users/refresh-token", {}, {
    withCredentials: true
  });



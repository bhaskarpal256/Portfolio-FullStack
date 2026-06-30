import { api } from "./api.js";
import { refreshAccessToken, logoutUser } from "./auth.service.js";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If no response or not 401 → just pass error
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If refresh already running → queue request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // Refresh token request
      const res = await refreshAccessToken();

      const newAccessToken = res?.data?.data?.accessToken;

      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
      }

      // Retry queued requests
      processQueue(null);

      // Retry original request
      return api(originalRequest);
    } catch (refreshError) {
      // Reject queued requests
      processQueue(refreshError);

      // Logout safely
      try {
        await logoutUser();
      } catch (e) {}

      // Clear storage
      localStorage.clear();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
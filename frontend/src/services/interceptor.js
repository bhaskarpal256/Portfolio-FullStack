// interceptor.js
import { api } from "./api.js";
import { refreshAccessToken } from "./auth.service.js";

let isRefreshing = false;
let failedQueue = [];

/**
 * Resolve or reject all queued requests
 */
const processQueue = (error) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Not a 401 → pass through
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Already retried once → don't loop forever
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Refresh already running → queue request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // Refresh access token
      await refreshAccessToken();

      // Retry all queued requests
      processQueue(null);

      // Retry original request
      return api(originalRequest);
    } catch (refreshError) {
      // Reject queued requests
      processQueue(refreshError);

      // Refresh token invalid/expired
      try {
        await logoutUser();
      } catch {}

      localStorage.clear();

      return Promise.reject(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

import axios from "axios";

const api = axios.create({
  baseURL: "https://moviemart-backend.onrender.com",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Only try refreshing the access token once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/register")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/api/auth/refresh");

        return api(originalRequest);
      } catch (refreshError) {
        console.log("Session expired");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
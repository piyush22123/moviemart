import axios from "axios";

const api = axios.create({
  // Local Vite development calls the local Express server.
  // On Render, an empty base URL keeps API requests on the same origin.
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:3000" : ""),
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register")
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

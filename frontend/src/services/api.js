import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/auth/refresh",
          {
            refresh_token: refreshToken,
          }
        );

        const newToken = response.data.access_token;

        localStorage.setItem("token", newToken);

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(originalRequest);

      } catch {
        localStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
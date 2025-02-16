import axios from "axios";

const apiLink = "https://ihsaanlms.onrender.com/api";
let authToken = null;

const http = axios.create({
  baseURL: apiLink,
  headers: {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  },
});

if (typeof window !== "undefined") {
  authToken = localStorage.getItem("token");

  // Add a request interceptor to add Authorization header
  http.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Function to refresh token using refresh token
  async function refreshToken() {
    try {
      const response = await axios.post(`${apiLink}/auth/token/refresh`, {
        refresh: localStorage.getItem("refresh-token"),
      });
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      authToken = newToken; // Update authToken variable with new token
      return newToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      throw error; // Throw error to propagate it further
    }
  }

  // Add a response interceptor to handle token refresh and retry failed requests
  http.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest); // Retry original request with new token
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
}

export default http;

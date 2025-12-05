import axios from "axios";

export const apiLink = "https://api.ihsaanacademia.com/api";
export const apiLink2 = "https://api.ihsaanacademia.com";

// Create Axios instance without initial auth header
const http = axios.create({
  baseURL: apiLink,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export const http2 = axios.create({
  baseURL: apiLink2,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get token dynamically
export const getAuthToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

// Request interceptor to add the Authorization header dynamically
http.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http2.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to refresh token
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refresh-token");
    if (!refresh) throw new Error("No refresh token found");

    const response = await axios.post(`${apiLink}/auth/token/refresh`, {
      refresh,
    });

    const newToken = response.data.token;
    localStorage.setItem("token", newToken);

    return newToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

// Response interceptor to handle 401 errors and refresh token
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // originalRequest._retry = true;
      if (originalRequest._retryCount === 5) {
        try {
          const newToken = await refreshToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return http(originalRequest); // Retry original request with new token
        } catch (refreshError) {
          // return Promise.reject(refreshError);
        }
      }

      // try {
      //   const newToken = await refreshToken();
      //   originalRequest.headers.Authorization = `Bearer ${newToken}`;

      //   return http(originalRequest); // Retry original request with new token
      // } catch (refreshError) {
      //   return Promise.reject(refreshError);
      // }
      localStorage.removeItem("token");
      localStorage.removeItem("refresh-token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

http2.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return http2(originalRequest); // Retry original request with new token
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default http;

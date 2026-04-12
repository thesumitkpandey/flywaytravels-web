// lib/axios.ts
import axios, { AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor
instance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// response interceptor
instance.interceptors.response.use(
  (response) => {
    const res = response.data;

    if (!res.success) {
      return Promise.reject({
        message: res.message,
        errors: res.errors || [],
      });
    }

    return res.data; // unwrap
  },
  (error) => {
    const res = error.response?.data;

    return Promise.reject({
      message: res?.message || "Something went wrong",
      errors: res?.errors || [],
    });
  },
);

// ✅ typed wrapper
const axiosInstance = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    instance.get<any, T>(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.post<any, T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.put<any, T>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<any, T>(url, config),
};

export default axiosInstance;

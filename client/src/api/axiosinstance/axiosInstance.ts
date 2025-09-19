import axios, { AxiosResponse } from "axios";

export const baseUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => Promise.reject(error)
);

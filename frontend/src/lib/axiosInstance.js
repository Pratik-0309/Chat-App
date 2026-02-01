import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
    async(error) => {
        const originalRequest = error.config;
        if(!originalRequest){
            return Promise.reject(error);
        }

        const status = error.response?.status;
        const isRefreshCall = originalRequest?.url?.includes('/api/users/refresh-token');

        if(status === 401 && !originalRequest._retry && !isRefreshCall){
            originalRequest._retry = true;
            try {
                await axiosInstance.get('/api/users/refresh-token');
                return axiosInstance(originalRequest);
            } catch (error) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
  },
);

export default axiosInstance;

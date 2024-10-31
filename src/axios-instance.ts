import axios, { AxiosInstance } from "axios";

const axiosInstanceToBack = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      console.error("요청 에러", error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const phone = localStorage.getItem("phone");
          const request = await instance.post("/api/member/login", { phone });

          if (request.status === 200)
            localStorage.setItem("accessToken", request.data.result.data.token);

          originalRequest.headers.Authorization = `Bearer ${request.data.result.data.token}`;
          return instance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("phone");
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosInstanceToBack;

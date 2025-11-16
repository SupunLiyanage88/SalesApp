import axios from "axios";

// Configure axios interceptors
axios.interceptors.request.use(
  function (config) {
    config.baseURL = getBaseUrl();

    try {
      const token = `Bearer ${localStorage.getItem("token") || ""}`;

      if (!config.headers) {
        config.headers = {};
      }

      config.headers.Authorization = token;
      config.validateStatus = (status) => status >= 200 && status < 300;
    } catch (error) {
      console.error(
        "Error setting Authorization header or validateStatus:",
        error
      );
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function getBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.response.use(
  (response) => response,
  function (error) {
    // Handle 401 Unauthorized errors
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error?.response ?? error);
  }
);

// Export all services
export { AuthService } from "./auth";
export { CustomerService } from "./customer";
export { ProductService } from "./product";
export { SalesOrderService } from "./salesOrder";

// Export schemas for validation
export { LoginSchema, RegisterSchema, AuthResponseSchema } from "./auth";
export { CustomerSchema } from "./customer";
export { ProductSchema } from "./product";
export { SalesOrderSchema, SalesOrderItemSchema } from "./salesOrder";

export default axios;

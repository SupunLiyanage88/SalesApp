import axios from "axios";
import { z } from "zod";

// Zod schemas for authentication
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const AuthResponseSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  expiresAt: z.string().optional(),
});

// Base API URL
const API_URL = "/api/auth";

// Service functions
export const AuthService = {
  login: async (credentials) => {
    // Validate with Zod before sending
    const parsed = LoginSchema.parse(credentials);
    
    const res = await axios.post(`${API_URL}/login`, parsed);
    
    // Validate response
    const validatedResponse = AuthResponseSchema.parse(res.data);
    
    // Store token in localStorage
    if (validatedResponse.token) {
      localStorage.setItem("token", validatedResponse.token);
    }
    
    return validatedResponse;
  },

  register: async (userData) => {
    // Validate with Zod before sending
    const parsed = RegisterSchema.parse(userData);
    
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...dataToSend } = parsed;
    
    const res = await axios.post(`${API_URL}/register`, dataToSend);
    
    // Validate response
    const validatedResponse = AuthResponseSchema.parse(res.data);
    
    // Store token in localStorage
    if (validatedResponse.token) {
      localStorage.setItem("token", validatedResponse.token);
    }
    
    return validatedResponse;
  },

  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

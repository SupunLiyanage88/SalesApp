import axios from "axios";
import { z } from "zod";

// Zod schema for validating product objects
export const ProductSchema = z.object({
  id: z.number().int(),
  itemCode: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number().int(),
  category: z.string(),
  isActive: z.boolean(),
});

// Base API URL
const API_URL = "/api/products";

// Service functions
export const ProductService = {
  getAll: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  create: async (data) => {
    // Validate with Zod before sending
    const parsed = ProductSchema.partial({ id: true }).parse(data);

    const res = await axios.post(API_URL, parsed);
    return res.data;
  },

  update: async (id, data) => {
    const parsed = ProductSchema.parse(data);
    const res = await axios.put(`${API_URL}/${id}`, parsed);
    return res.data;
  },

  delete: async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};

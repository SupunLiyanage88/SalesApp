import axios from "axios";
import { z } from "zod";

// Zod schema for validating customer objects
export const CustomerSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address1: z.string(),
  address2: z.string(),
  address3: z.string(),
  state: z.string(),
  postCode: z.string(),
  isActive: z.boolean(),
});

// Base API URL
const API_URL = "/api/customers";

// Service functions
export const CustomerService = {
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
    const parsed = CustomerSchema.partial({ id: true }).parse(data);

    const res = await axios.post(API_URL, parsed);
    return res.data;
  },

  update: async (id, data) => {
    const parsed = CustomerSchema.parse(data);
    const res = await axios.put(`${API_URL}/${id}`, parsed);
    return res.data;
  },

  delete: async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};

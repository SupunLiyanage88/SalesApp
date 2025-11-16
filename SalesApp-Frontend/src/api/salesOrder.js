import axios from "axios";
import { z } from "zod";

// Zod schema for sales order items
export const SalesOrderItemSchema = z.object({
  id: z.number().int().optional(),
  productId: z.number().int(),
  productName: z.string().optional(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  discount: z.number().min(0).max(100).default(0),
  total: z.number().optional(),
});

// Zod schema for sales orders
export const SalesOrderSchema = z.object({
  id: z.number().int().optional(),
  orderNumber: z.string().optional(),
  customerId: z.number().int(),
  customerName: z.string().optional(),
  orderDate: z.string().or(z.date()),
  totalAmount: z.number().optional(),
  status: z.enum(["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"]).default("Pending"),
  notes: z.string().optional(),
  items: z.array(SalesOrderItemSchema).min(1, "At least one item is required"),
});

// Base API URL
const API_URL = "/api/salesorders";

// Service functions
export const SalesOrderService = {
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
    const parsed = SalesOrderSchema.partial({ id: true, orderNumber: true, totalAmount: true }).parse(data);

    const res = await axios.post(API_URL, parsed);
    return res.data;
  },

  update: async (id, data) => {
    const parsed = SalesOrderSchema.parse(data);
    const res = await axios.put(`${API_URL}/${id}`, parsed);
    return res.data;
  },

  delete: async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },

  getByCustomer: async (customerId) => {
    const res = await axios.get(`${API_URL}/customer/${customerId}`);
    return res.data;
  },

  getByDateRange: async (startDate, endDate) => {
    const res = await axios.get(`${API_URL}/date-range`, {
      params: { startDate, endDate },
    });
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await axios.patch(`${API_URL}/${id}/status`, { status });
    return res.data;
  },
};

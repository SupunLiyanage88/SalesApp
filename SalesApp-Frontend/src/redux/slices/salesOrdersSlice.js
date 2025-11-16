import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { salesOrdersAPI } from '../../services/api';

// Async thunks
export const fetchSalesOrders = createAsyncThunk(
  'salesOrders/fetchSalesOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await salesOrdersAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch sales orders');
    }
  }
);

export const createSalesOrder = createAsyncThunk(
  'salesOrders/createSalesOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await salesOrdersAPI.create(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create sales order');
    }
  }
);

export const updateSalesOrder = createAsyncThunk(
  'salesOrders/updateSalesOrder',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await salesOrdersAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update sales order');
    }
  }
);

export const deleteSalesOrder = createAsyncThunk(
  'salesOrders/deleteSalesOrder',
  async (id, { rejectWithValue }) => {
    try {
      await salesOrdersAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete sales order');
    }
  }
);

const salesOrdersSlice = createSlice({
  name: 'salesOrders',
  initialState: {
    items: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sales orders
      .addCase(fetchSalesOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSalesOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create sales order
      .addCase(createSalesOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSalesOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createSalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update sales order
      .addCase(updateSalesOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSalesOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateSalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete sales order
      .addCase(deleteSalesOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSalesOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteSalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentOrder, clearCurrentOrder } = salesOrdersSlice.actions;
export default salesOrdersSlice.reducer;

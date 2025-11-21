import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import customersReducer from './slices/customersSlice';
import salesOrdersReducer from './slices/salesOrdersSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    customers: customersReducer,
    salesOrders: salesOrdersReducer,
    auth: authReducer,
  },
});

export default store;

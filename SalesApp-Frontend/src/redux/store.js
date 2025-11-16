import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import customersReducer from './slices/customersSlice';
import salesOrdersReducer from './slices/salesOrdersSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    customers: customersReducer,
    salesOrders: salesOrdersReducer,
  },
});

export default store;

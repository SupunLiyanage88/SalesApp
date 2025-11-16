# API Services

This directory contains all API service modules with built-in Zod validation.

## Structure

- `index.js` - Axios configuration and service exports
- `auth.js` - Authentication services
- `customer.js` - Customer CRUD operations
- `product.js` - Product CRUD operations
- `salesOrder.js` - Sales Order CRUD operations

## Usage

### Import Services

```javascript
// Import all services from index
import { AuthService, CustomerService, ProductService, SalesOrderService } from '@/api';

// Or import individually
import { CustomerService } from '@/api/customer';
```

### Authentication

```javascript
import { AuthService } from '@/api';

// Login
try {
  const response = await AuthService.login({
    email: 'user@example.com',
    password: 'password123'
  });
  console.log('Token:', response.token);
} catch (error) {
  console.error('Login failed:', error);
}

// Register
try {
  const response = await AuthService.register({
    email: 'newuser@example.com',
    password: 'password123',
    confirmPassword: 'password123'
  });
  console.log('Registered:', response.email);
} catch (error) {
  console.error('Registration failed:', error);
}

// Logout
AuthService.logout();

// Check authentication
const isLoggedIn = AuthService.isAuthenticated();
```

### Customers

```javascript
import { CustomerService } from '@/api';

// Get all customers
const customers = await CustomerService.getAll();

// Get customer by ID
const customer = await CustomerService.getById(1);

// Create customer
const newCustomer = await CustomerService.create({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  address1: '123 Main St',
  address2: 'Apt 4',
  address3: '',
  state: 'CA',
  postCode: '90210',
  isActive: true
});

// Update customer
const updated = await CustomerService.update(1, {
  id: 1,
  name: 'John Updated',
  // ... other fields
});

// Delete customer
await CustomerService.delete(1);
```

### Products

```javascript
import { ProductService } from '@/api';

// Get all products
const products = await ProductService.getAll();

// Get product by ID
const product = await ProductService.getById(1);

// Create product
const newProduct = await ProductService.create({
  itemCode: 'PROD001',
  name: 'Widget',
  description: 'A great widget',
  price: 29.99,
  stock: 100,
  category: 'Electronics',
  isActive: true
});

// Update product
const updated = await ProductService.update(1, {
  id: 1,
  itemCode: 'PROD001',
  name: 'Updated Widget',
  // ... other fields
});

// Delete product
await ProductService.delete(1);
```

### Sales Orders

```javascript
import { SalesOrderService } from '@/api';

// Get all sales orders
const orders = await SalesOrderService.getAll();

// Get order by ID
const order = await SalesOrderService.getById(1);

// Create sales order
const newOrder = await SalesOrderService.create({
  customerId: 1,
  orderDate: new Date().toISOString(),
  status: 'Pending',
  notes: 'Rush order',
  items: [
    {
      productId: 1,
      quantity: 2,
      unitPrice: 29.99,
      discount: 0
    },
    {
      productId: 2,
      quantity: 1,
      unitPrice: 49.99,
      discount: 10
    }
  ]
});

// Update sales order
const updated = await SalesOrderService.update(1, orderData);

// Delete sales order
await SalesOrderService.delete(1);

// Get orders by customer
const customerOrders = await SalesOrderService.getByCustomer(1);

// Get orders by date range
const rangeOrders = await SalesOrderService.getByDateRange(
  '2025-01-01',
  '2025-12-31'
);

// Update order status
await SalesOrderService.updateStatus(1, 'Shipped');
```

## Features

### Automatic Token Management
- Tokens are automatically added to all requests
- Stored in localStorage after login/register
- Removed on logout or 401 errors
- 401 errors automatically redirect to login

### Zod Validation
- All data is validated before sending to the API
- Schemas exported for reuse in forms
- Type-safe data structures
- Helpful error messages

### Error Handling
- Consistent error format across all services
- Network errors handled gracefully
- Validation errors caught before API calls

## Environment Variables

Set the API base URL in your `.env` file:

```
VITE_API_BASE_URL=http://localhost:5000
```

## Schemas

All Zod schemas are exported for use in forms and validation:

```javascript
import { CustomerSchema, ProductSchema, SalesOrderSchema } from '@/api';

// Use in form validation
const customerForm = CustomerSchema.partial({ id: true });
```

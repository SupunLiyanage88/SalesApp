# SalesApp Frontend

A modern React frontend application for managing sales orders, built with Vite, Redux Toolkit, React Router, and Tailwind CSS.

## Tech Stack

- **React 18** - UI library with functional components and hooks
- **Vite** - Fast build tool and development server
- **Redux Toolkit** - Centralized state management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API communication
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Table.jsx
│   ├── Card.jsx
│   ├── Loading.jsx
│   ├── Alert.jsx
│   └── Navbar.jsx
├── pages/              # Page components
│   ├── Home.jsx        # Screen 2 - Sales orders list
│   └── SalesOrder.jsx  # Screen 1 - Create sales order
├── redux/              # Redux state management
│   ├── slices/
│   │   ├── productsSlice.js
│   │   ├── customersSlice.js
│   │   └── salesOrdersSlice.js
│   └── store.js
├── services/           # API service layer
│   └── api.js
├── hooks/              # Custom React hooks
├── utils/              # Helper functions and constants
│   ├── helpers.js
│   └── constants.js
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles with Tailwind
```

## Features

### Screen 1 - Sales Order Creation
- Customer selection dropdown
- Dynamic order items management
- Product selection with auto-price population
- Quantity and price inputs
- Real-time total calculation
- Form validation
- Success/error alerts

### Screen 2 - Home/Sales Orders List
- Dashboard with key metrics (Total Orders, Revenue, Pending Orders)
- Tabular display of all sales orders
- Edit and delete functionality
- Responsive design

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` file and update `VITE_API_URL` if needed

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173/` (or the next available port)

## Build for Production

```bash
npm run build
```

Build files will be generated in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Tailwind CSS Design System

The application uses a consistent design system defined in `tailwind.config.js`:

### Colors
- Primary: Blue (#3b82f6)
- Secondary: Gray (#64748b)
- Success: Green (#22c55e)
- Danger: Red (#ef4444)
- Warning: Orange (#f59e0b)
- Info: Cyan (#06b6d4)

### Utility Classes
- Layout: `flex`, `grid`, `gap-*`, `p-*`, `m-*`
- Typography: `text-sm`, `text-lg`, `font-semibold`
- Colors: `bg-gray-100`, `bg-white`, `text-gray-700`, `border-gray-300`

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api` (configurable via `.env`)

### Endpoints Used:
- `/products` - Products CRUD
- `/customers` - Customers CRUD
- `/salesorders` - Sales orders CRUD
- `/auth` - Authentication (login/register)

## Components Documentation

### Reusable Components

- **Button** - Customizable button with variants (primary, secondary, success, danger, outline)
- **Input** - Text input with label, validation, and error display
- **Select** - Dropdown select with options
- **Table** - Data table with edit/delete actions
- **Card** - Container component with optional title and actions
- **Loading** - Loading spinner (can be fullscreen)
- **Alert** - Alert messages (success, error, warning, info)
- **Navbar** - Navigation bar with routing

## License

MIT


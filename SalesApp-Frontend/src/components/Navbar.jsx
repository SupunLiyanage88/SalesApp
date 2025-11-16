import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="text-2xl font-bold text-primary">
              SalesApp
            </Link>
          </div>
          <div className="flex gap-6">
            <Link
              to={ROUTES.HOME}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isActive(ROUTES.HOME)
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              to={ROUTES.SALES_ORDER}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isActive(ROUTES.SALES_ORDER)
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Sales Order
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

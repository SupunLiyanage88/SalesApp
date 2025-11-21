import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { ROUTES } from '../utils/constants';
import Button from './Button';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="text-2xl font-bold text-primary">
              SalesApp
            </Link>
          </div>
          <div className="flex gap-6 items-center">
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
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-300">
              {user && (
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-semibold">{user.email || user.username}</span>
                </span>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

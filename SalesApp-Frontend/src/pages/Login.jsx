import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../redux/slices/authSlice';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { ROUTES } from '../utils/constants';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Demo credentials
  const DEMO_CREDENTIALS = {
    username: 'supun',
    password: 'supun1234',
  };

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear errors when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await dispatch(login(formData)).unwrap();
      navigate(ROUTES.HOME);
    } catch (err) {
      // Error is handled by Redux
      console.error('Login failed:', err);
    }
  };

  const handleDemoLogin = () => {
    setFormData(DEMO_CREDENTIALS);
    setValidationErrors({});
    // Auto-submit with demo credentials
    setTimeout(() => {
      dispatch(login(DEMO_CREDENTIALS))
        .unwrap()
        .then(() => navigate(ROUTES.HOME))
        .catch((err) => console.error('Demo login failed:', err));
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sales App Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your sales orders
          </p>
        </div>
        
        <Card className="mt-8">
          {error && (
            <Alert type="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={validationErrors.username}
              placeholder="Enter your username"
              autoComplete="username"
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={validationErrors.password}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={handleDemoLogin}
                disabled={loading}
              >
                🎯 Try Demo Login
              </Button>
              <p className="mt-2 text-xs text-center text-gray-500">
                Use demo credentials: supun / supun1234
              </p>
            </div>
          </div>
        </Card>

        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate(ROUTES.REGISTER)}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

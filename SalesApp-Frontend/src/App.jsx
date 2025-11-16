import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SalesOrder from './pages/SalesOrder';
import { ROUTES } from './utils/constants';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.SALES_ORDER} element={<SalesOrder />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;


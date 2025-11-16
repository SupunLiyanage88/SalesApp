import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesOrders, deleteSalesOrder } from '../redux/slices/salesOrdersSlice';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { formatDate, formatCurrency } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: salesOrders, loading, error } = useSelector((state) => state.salesOrders);
  const [deleteSuccess, setDeleteSuccess] = useState('');

  useEffect(() => {
    dispatch(fetchSalesOrders());
  }, [dispatch]);

  const handleDelete = async (order) => {
    if (window.confirm(`Are you sure you want to delete order #${order.id}?`)) {
      try {
        await dispatch(deleteSalesOrder(order.id)).unwrap();
        setDeleteSuccess('Sales order deleted successfully!');
        setTimeout(() => setDeleteSuccess(''), 3000);
      } catch (err) {
        console.error('Failed to delete order:', err);
      }
    }
  };

  const handleEdit = (order) => {
    // Navigate to sales order page with order data
    navigate(ROUTES.SALES_ORDER, { state: { order } });
  };

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (value, row) => row.customer?.name || 'N/A',
    },
    {
      key: 'orderDate',
      label: 'Order Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'completed' ? 'bg-green-100 text-green-800' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value || 'Pending'}
        </span>
      ),
    },
  ];

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card
        title="Sales Orders"
        actions={
          <Button onClick={() => navigate(ROUTES.SALES_ORDER)}>
            + New Order
          </Button>
        }
      >
        {deleteSuccess && (
          <Alert type="success" message={deleteSuccess} onClose={() => setDeleteSuccess('')} />
        )}
        {error && <Alert type="error" message={error} />}

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-primary">{salesOrders.length}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-success">
                {formatCurrency(
                  salesOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                )}
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Pending Orders</h3>
              <p className="text-3xl font-bold text-warning">
                {salesOrders.filter((order) => !order.status || order.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          data={salesOrders}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>
    </div>
  );
};

export default Home;

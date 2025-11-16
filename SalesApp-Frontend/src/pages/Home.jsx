import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesOrders, deleteSalesOrder } from '../redux/slices/salesOrdersSlice';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import PrintSalesOrder from '../components/PrintSalesOrder';
import { formatDate, formatCurrency } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: salesOrders, loading, error } = useSelector((state) => state.salesOrders);
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

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

  const handlePrint = (order) => {
    setSelectedOrder(order);
    setShowPrintModal(true);
  };

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
    },
    {
      key: 'invoiceNo',
      label: 'Invoice No.',
    },
    {
      key: 'customerName',
      label: 'Customer',
    },
    {
      key: 'invoiceDate',
      label: 'Invoice Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'totalIncl',
      label: 'Total Amount',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'completed' || value === 'Completed' ? 'bg-green-100 text-green-800' :
          value === 'pending' || value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
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
                  salesOrders.reduce((sum, order) => sum + (order.totalIncl || 0), 0)
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

        {/* Custom Actions for each row */}
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Invoice No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{order.invoiceNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(order.invoiceDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(order.totalIncl)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePrint(order)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        🖨️ Print
                      </button>
                      <button
                        onClick={() => handleEdit(order)}
                        className="text-primary hover:text-blue-700 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(order)}
                        className="text-danger hover:text-red-700 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Print Modal */}
        {showPrintModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Print Sales Order</h2>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <PrintSalesOrder order={selectedOrder} />
              <div className="mt-4">
                <Button onClick={() => setShowPrintModal(false)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Home;

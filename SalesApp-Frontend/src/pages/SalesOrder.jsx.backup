import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productsSlice';
import { fetchCustomers } from '../redux/slices/customersSlice';
import { createSalesOrder } from '../redux/slices/salesOrdersSlice';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { formatCurrency, calculateTotal } from '../utils/helpers';

const SalesOrder = () => {
  const dispatch = useDispatch();
  const { items: products, loading: productsLoading } = useSelector((state) => state.products);
  const { items: customers, loading: customersLoading } = useSelector((state) => state.customers);
  const { loading: orderLoading, error } = useSelector((state) => state.salesOrders);

  const [formData, setFormData] = useState({
    customerId: '',
    orderDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [orderItems, setOrderItems] = useState([
    { productId: '', quantity: 1, price: 0 },
  ]);

  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;

    // Update price when product is selected
    if (field === 'productId' && value) {
      const product = products.find((p) => p.id.toString() === value);
      if (product) {
        updatedItems[index].price = product.price;
      }
    }

    setOrderItems(updatedItems);
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1, price: 0 }]);
  };

  const removeOrderItem = (index) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      customerId: parseInt(formData.customerId),
      orderDate: formData.orderDate,
      notes: formData.notes,
      items: orderItems.map((item) => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
      })),
      totalAmount: calculateTotal(orderItems),
    };

    try {
      await dispatch(createSalesOrder(orderData)).unwrap();
      setSuccessMessage('Sales order created successfully!');
      
      // Reset form
      setFormData({
        customerId: '',
        orderDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setOrderItems([{ productId: '', quantity: 1, price: 0 }]);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  };

  const total = calculateTotal(orderItems);

  if (productsLoading || customersLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card title="Create Sales Order">
        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}
        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Customer"
              name="customerId"
              value={formData.customerId}
              onChange={handleFormChange}
              options={customers.map((customer) => ({
                value: customer.id,
                label: customer.name,
              }))}
              required
            />

            <Input
              label="Order Date"
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Items</h3>

            {orderItems.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <Select
                  label="Product"
                  name={`product-${index}`}
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  options={products.map((product) => ({
                    value: product.id,
                    label: `${product.name} - ${formatCurrency(product.price)}`,
                  }))}
                  required
                />

                <Input
                  label="Quantity"
                  type="number"
                  name={`quantity-${index}`}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  min="1"
                  required
                />

                <Input
                  label="Price"
                  type="number"
                  name={`price-${index}`}
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => removeOrderItem(index)}
                    disabled={orderItems.length === 1}
                    className="w-full"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addOrderItem}>
              + Add Item
            </Button>
          </div>

          <div className="mt-6">
            <Input
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
              placeholder="Additional notes..."
            />
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button type="submit" variant="primary" disabled={orderLoading}>
              {orderLoading ? 'Creating...' : 'Create Order'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  customerId: '',
                  orderDate: new Date().toISOString().split('T')[0],
                  notes: '',
                });
                setOrderItems([{ productId: '', quantity: 1, price: 0 }]);
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SalesOrder;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productsSlice';
import { fetchCustomers } from '../redux/slices/customersSlice';
import { createSalesOrder } from '../redux/slices/salesOrdersSlice';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { formatCurrency } from '../utils/helpers';

const SalesOrder = () => {
  const dispatch = useDispatch();
  const { items: products, loading: productsLoading } = useSelector((state) => state.products);
  const { items: customers, loading: customersLoading } = useSelector((state) => state.customers);
  const { loading: orderLoading, error } = useSelector((state) => state.salesOrders);

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    address1: '',
    address2: '',
    address3: '',
    state: '',
    postCode: '',
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    referenceNo: '',
    notes: '',
  });

  const [orderItems, setOrderItems] = useState([
    { productId: '', itemCode: '', description: '', note: '', quantity: 1, taxRate: 0, price: 0 },
  ]);

  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const customer = customers.find((c) => c.id.toString() === customerId);

    if (customer) {
      setFormData({
        ...formData,
        customerId: customer.id,
        customerName: customer.name,
        address1: customer.address1 || '',
        address2: customer.address2 || '',
        address3: customer.address3 || '',
        state: customer.state || '',
        postCode: customer.postCode || '',
      });
    } else {
      setFormData({
        ...formData,
        customerId: '',
        customerName: '',
        address1: '',
        address2: '',
        address3: '',
        state: '',
        postCode: '',
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChangeByCode = (index, itemCode) => {
    const product = products.find((p) => p.itemCode === itemCode);
    handleItemProductChange(index, product);
  };

  const handleItemChangeByDescription = (index, description) => {
    const product = products.find((p) => p.description === description);
    handleItemProductChange(index, product);
  };

  const handleItemProductChange = (index, product) => {
    const updatedItems = [...orderItems];
    if (product) {
      updatedItems[index] = {
        ...updatedItems[index],
        productId: product.id,
        itemCode: product.itemCode,
        description: product.description,
        price: product.price,
      };
    }
    setOrderItems(updatedItems);
  };

  const handleItemFieldChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;
    setOrderItems(updatedItems);
  };

  const calculateLineTotal = (item) => {
    const exclAmount = item.quantity * item.price;
    const taxAmount = (exclAmount * item.taxRate) / 100;
    const inclAmount = exclAmount + taxAmount;
    return { exclAmount, taxAmount, inclAmount };
  };

  const calculateTotals = () => {
    let totalExcl = 0;
    let totalTax = 0;
    let totalIncl = 0;

    orderItems.forEach((item) => {
      const { exclAmount, taxAmount, inclAmount } = calculateLineTotal(item);
      totalExcl += exclAmount;
      totalTax += taxAmount;
      totalIncl += inclAmount;
    });

    return { totalExcl, totalTax, totalIncl };
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { productId: '', itemCode: '', description: '', note: '', quantity: 1, taxRate: 0, price: 0 },
    ]);
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
      customerName: formData.customerName,
      address1: formData.address1,
      address2: formData.address2,
      address3: formData.address3,
      state: formData.state,
      postCode: formData.postCode,
      invoiceNo: formData.invoiceNo,
      invoiceDate: formData.invoiceDate,
      referenceNo: formData.referenceNo,
      notes: formData.notes,
      items: orderItems.map((item) => ({
        productId: parseInt(item.productId),
        note: item.note,
        quantity: parseInt(item.quantity),
        taxRate: parseFloat(item.taxRate),
      })),
    };

    try {
      await dispatch(createSalesOrder(orderData)).unwrap();
      setSuccessMessage('Sales order saved successfully!');

      // Reset form
      setFormData({
        customerId: '',
        customerName: '',
        address1: '',
        address2: '',
        address3: '',
        state: '',
        postCode: '',
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        referenceNo: '',
        notes: '',
      });
      setOrderItems([
        { productId: '', itemCode: '', description: '', note: '', quantity: 1, taxRate: 0, price: 0 },
      ]);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  };

  const { totalExcl, totalTax, totalIncl } = calculateTotals();

  if (productsLoading || customersLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-300 bg-gray-100 px-6 py-3">
          <h1 className="text-xl font-bold text-gray-800">Sales Order</h1>
        </div>

        <div className="p-6">
          {successMessage && (
            <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
          )}
          {error && <Alert type="error" message={error} />}

          <form onSubmit={handleSubmit}>
            {/* Save Order Button */}
            <div className="mb-6">
              <Button type="submit" variant="primary" disabled={orderLoading}>
                {orderLoading ? 'Saving...' : '✓ Save Order'}
              </Button>
            </div>

            {/* Customer and Invoice Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column - Customer Details */}
              <div className="space-y-4">
                {/* Customer Name Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Name <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={handleCustomerChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address Fields */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address 1</label>
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address 2</label>
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address 3</label>
                  <input
                    type="text"
                    name="address3"
                    value={formData.address3}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Post Code</label>
                  <input
                    type="text"
                    name="postCode"
                    value={formData.postCode}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Right Column - Invoice Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Invoice No. <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Invoice Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Reference No.</label>
                  <textarea
                    name="referenceNo"
                    value={formData.referenceNo}
                    onChange={handleFormChange}
                    rows="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="mb-6 overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold">Item Code</th>
                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold">Description</th>
                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold">Note</th>
                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold">Quantity</th>
                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold">Price</th>
                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold">Tax %</th>
                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold">Excl Amount</th>
                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold">Tax Amount</th>
                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold">Incl Amount</th>
                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => {
                    const { exclAmount, taxAmount, inclAmount } = calculateLineTotal(item);
                    return (
                      <tr key={index}>
                        <td className="px-2 py-2 border border-gray-300">
                          <select
                            value={item.itemCode}
                            onChange={(e) => handleItemChangeByCode(index, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Select</option>
                            {products.map((product) => (
                              <option key={product.id} value={product.itemCode}>
                                {product.itemCode}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          <select
                            value={item.description}
                            onChange={(e) => handleItemChangeByDescription(index, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Select</option>
                            {products.map((product) => (
                              <option key={product.id} value={product.description}>
                                {product.description}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          <input
                            type="text"
                            value={item.note}
                            onChange={(e) => handleItemFieldChange(index, 'note', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemFieldChange(index, 'quantity', e.target.value)}
                            min="1"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-2 py-2 border border-gray-300 text-right text-sm">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          <input
                            type="number"
                            value={item.taxRate}
                            onChange={(e) => handleItemFieldChange(index, 'taxRate', e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-2 py-2 border border-gray-300 text-right text-sm">
                          {formatCurrency(exclAmount)}
                        </td>
                        <td className="px-2 py-2 border border-gray-300 text-right text-sm">
                          {formatCurrency(taxAmount)}
                        </td>
                        <td className="px-2 py-2 border border-gray-300 text-right text-sm">
                          {formatCurrency(inclAmount)}
                        </td>
                        <td className="px-2 py-2 border border-gray-300 text-center">
                          <button
                            type="button"
                            onClick={() => removeOrderItem(index)}
                            disabled={orderItems.length === 1}
                            className="text-red-600 hover:text-red-800 disabled:text-gray-400 text-sm"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <Button type="button" variant="outline" onClick={addOrderItem} className="mt-2">
                + Add Row
              </Button>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end">
              <div className="w-96 space-y-2">
                <div className="grid grid-cols-2 gap-4 items-center">
                  <label className="text-right font-semibold text-gray-700">Total Excl</label>
                  <div className="px-4 py-2 border border-gray-300 rounded bg-gray-50 text-right font-semibold">
                    {formatCurrency(totalExcl)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <label className="text-right font-semibold text-gray-700">Total Tax</label>
                  <div className="px-4 py-2 border border-gray-300 rounded bg-gray-50 text-right font-semibold">
                    {formatCurrency(totalTax)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <label className="text-right font-semibold text-gray-700">Total Incl</label>
                  <div className="px-4 py-2 border border-gray-300 rounded bg-blue-50 text-right font-bold text-lg text-blue-700">
                    {formatCurrency(totalIncl)}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalesOrder;

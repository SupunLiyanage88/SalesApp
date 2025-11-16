import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { formatCurrency, formatDate } from '../utils/helpers';
import Button from './Button';

const PrintSalesOrder = ({ order }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (!order) return null;

  return (
    <div>
      <Button onClick={handlePrint} variant="primary">
        🖨️ Print Order
      </Button>

      <div style={{ display: 'none' }}>
        <div ref={componentRef} className="p-8" style={{ width: '210mm', minHeight: '297mm' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">SALES ORDER</h1>
            <p className="text-lg">Your Company Name</p>
            <p className="text-sm">Company Address Line 1</p>
            <p className="text-sm">Company Address Line 2</p>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Customer Details:</h3>
              <p className="font-semibold">{order.customerName}</p>
              {order.address1 && <p>{order.address1}</p>}
              {order.address2 && <p>{order.address2}</p>}
              {order.address3 && <p>{order.address3}</p>}
              {order.state && <p>{order.state}</p>}
              {order.postCode && <p>{order.postCode}</p>}
            </div>

            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="font-semibold py-1">Invoice No.:</td>
                    <td>{order.invoiceNo}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-1">Invoice Date:</td>
                    <td>{formatDate(order.invoiceDate)}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-1">Reference No.:</td>
                    <td>{order.referenceNo}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-1">Status:</td>
                    <td>{order.status}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse border border-gray-400 mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2 text-left">Item Code</th>
                <th className="border border-gray-400 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-400 px-4 py-2 text-left">Note</th>
                <th className="border border-gray-400 px-4 py-2 text-right">Qty</th>
                <th className="border border-gray-400 px-4 py-2 text-right">Price</th>
                <th className="border border-gray-400 px-4 py-2 text-right">Tax %</th>
                <th className="border border-gray-400 px-4 py-2 text-right">Excl Amt</th>
                <th className="border border-gray-400 px-4 py-2 text-right">Tax Amt</th>
                <th className="border border-gray-400 px-4 py-2 text-right">Incl Amt</th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-4 py-2">{item.itemCode}</td>
                  <td className="border border-gray-400 px-4 py-2">{item.description}</td>
                  <td className="border border-gray-400 px-4 py-2">{item.note}</td>
                  <td className="border border-gray-400 px-4 py-2 text-right">{item.quantity}</td>
                  <td className="border border-gray-400 px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                  <td className="border border-gray-400 px-4 py-2 text-right">{item.taxRate}%</td>
                  <td className="border border-gray-400 px-4 py-2 text-right">{formatCurrency(item.exclAmount)}</td>
                  <td className="border border-gray-400 px-4 py-2 text-right">{formatCurrency(item.taxAmount)}</td>
                  <td className="border border-gray-400 px-4 py-2 text-right">{formatCurrency(item.inclAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <table className="w-96">
              <tbody>
                <tr>
                  <td className="py-2 px-4 text-right font-semibold">Total Excl:</td>
                  <td className="py-2 px-4 text-right font-semibold">{formatCurrency(order.totalExcl)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-right font-semibold">Total Tax:</td>
                  <td className="py-2 px-4 text-right font-semibold">{formatCurrency(order.totalTax)}</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="py-2 px-4 text-right font-bold text-lg">Total Incl:</td>
                  <td className="py-2 px-4 text-right font-bold text-lg">{formatCurrency(order.totalIncl)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">Notes:</h3>
              <p>{order.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-600">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintSalesOrder;

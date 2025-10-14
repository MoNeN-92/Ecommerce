// app/admin/orders/invoice/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!order) {
    return <div className="p-8">Order not found</div>;
  }

  const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(order.id).padStart(5, '0')}`;
  const subtotal = order.OrderItems?.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0) || 0;
  const tax = Number(order.tax_amount) || subtotal * 0.18;
  const shipping = Number(order.shipping_amount) || 10;
  const total = Number(order.total_amount) || (subtotal + tax + shipping);

  // თუ shipping_address ობიექტია
  const shippingAddress = order.shipping_address || {};

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between mb-8 no-print">
        <Link href="/admin/invoices" className="text-blue-600">
          ← Back to Invoices
        </Link>
        <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded">
          Print Invoice
        </button>
      </div>

      {/* Invoice */}
      <div className="bg-white p-8 rounded shadow">
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">INVOICE</h1>
            <p className="text-gray-600">#{invoiceNumber}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">E-Shop</h2>
            <p className="text-gray-600">info@eshop.ge</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-8">
          <h3 className="font-bold mb-2">Bill To:</h3>
          <p>{order.User?.name || 'Guest'}</p>
          <p>{order.User?.email}</p>
          {shippingAddress && (
            <>
              <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
              <p>{shippingAddress.phone}</p>
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
            </>
          )}
        </div>

        {/* Items */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.OrderItems?.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{item.product_name}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">₾{Number(item.price).toFixed(2)}</td>
                <td className="text-right py-2">₾{(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="text-right">
          <div className="flex justify-end mb-2">
            <span className="w-32">Subtotal:</span>
            <span className="w-32">₾{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-end mb-2">
            <span className="w-32">Tax (18%):</span>
            <span className="w-32">₾{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-end mb-2">
            <span className="w-32">Shipping:</span>
            <span className="w-32">₾{shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-end font-bold text-lg">
            <span className="w-32">Total:</span>
            <span className="w-32">₾{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

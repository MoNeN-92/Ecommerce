'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, MapPin, CreditCard, User, Phone, Mail, Edit } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

function AdminOrderDetailContent({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (resolvedParams.id) {
      fetchOrderDetails();
    }
  }, [resolvedParams.id]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${resolvedParams.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      console.log('Order data received:', data); // Debug log

      if (data.success) {
        setOrder(data.data); // ✅ შეცვლილი: data.order ნაცვლად data.data
      } else {
        alert('Order not found');
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!confirm(`Are you sure you want to change status to "${newStatus}"?`)) {
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${resolvedParams.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();

      if (data.success) {
        setOrder({ ...order, status: newStatus });
        alert('Order status updated successfully!');
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'processing':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-purple-500" />;
      case 'delivered':
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderAddress = (address) => {
    if (!address) return 'No address provided';

    if (typeof address === 'string') {
      return address;
    }

    // Handle JSON object address
    if (typeof address === 'object') {
      return (
        <div>
          {(address.firstName || address.lastName) && (
            <p className="font-medium">{address.firstName} {address.lastName}</p>
          )}
          {address.address && <p>{address.address}</p>}
          {address.city && (
            <p>
              {address.city}
              {address.state ? `, ${address.state}` : ''}
              {address.postalCode ? ` ${address.postalCode}` : ''}
            </p>
          )}
          {address.country && <p>{address.country}</p>}
          {address.phone && <p className="mt-2">📞 {address.phone}</p>}
        </div>
      );
    }

    return 'Invalid address format';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
          <button
            onClick={() => router.push('/admin/orders')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/orders')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
              {order.order_number && (
                <p className="text-gray-600 mt-1">
                  Order Number: {order.order_number}
                </p>
              )}
              <p className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })} at {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>
            <div className={`flex items-center px-4 py-2 rounded-lg border ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-2 font-semibold capitalize">{order.status}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Customer Details</h3>
                    <p className="text-gray-700 font-medium">{order.User?.name || order.user?.name || 'Guest User'}</p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Mail className="w-4 h-4 mr-1" />
                      {order.User?.email || order.user?.email || 'No email'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Contact</h3>
                    <p className="text-gray-600 flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {order.User?.phone || order.user?.phone || order.shipping_address?.phone || 'No phone'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Items ({order.OrderItems?.length || order.items?.length || 0})
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {(order.OrderItems || order.items || []).length > 0 ? (
                    (order.OrderItems || order.items).map((item, index) => (
                      <div key={item.id || index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.product_image || item.Product?.image_url || '/images/placeholder-product.png'}
                          alt={item.product_name || item.Product?.name || 'Product'}
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder-product.png';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {item.product_name || item.Product?.name || 'Unknown Product'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Product ID: {item.product_id || item.Product?.id || 'N/A'}
                          </p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            <span className="text-sm text-gray-600">Unit Price: ₾{parseFloat(item.price || 0).toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₾{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                          </p>
                          {item.total && (
                            <p className="text-xs text-gray-500">Total: ₾{parseFloat(item.total).toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No items found in this order</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  Update Status
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={updating || order.status === status}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${order.status === status
                          ? getStatusColor(status) + ' font-semibold'
                          : 'border-gray-300 hover:bg-gray-50'
                        } disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center">
                        {getStatusIcon(status)}
                        <span className="ml-2 capitalize">{status}</span>
                        {order.status === status && (
                          <span className="ml-auto text-sm">(Current)</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      ₾{(parseFloat(order.total_amount || 0) - parseFloat(order.shipping_amount || 0) - parseFloat(order.tax_amount || 0)).toFixed(2)}
                    </span>
                  </div>
                  {order.shipping_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">₾{parseFloat(order.shipping_amount).toFixed(2)}</span>
                    </div>
                  )}
                  {order.tax_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (18%)</span>
                      <span className="text-gray-900">₾{parseFloat(order.tax_amount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ₾{parseFloat(order.total_amount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </h2>
              </div>
              <div className="p-6">
                <div className="text-gray-900">
                  {renderAddress(order.shipping_address)}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="text-gray-900 capitalize">
                      {order.payment_method?.replace('_', ' ') || 'Cash on Delivery'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${order.payment_status === 'completed' || order.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : order.payment_status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {order.payment_status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrderDetailPage({ params }) {
  return (
    <ProtectedRoute adminOnly={true}>
      <AdminOrderDetailContent params={params} />
    </ProtectedRoute>
  );
}
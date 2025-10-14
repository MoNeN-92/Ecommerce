'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, User, MapPin, CreditCard, Calendar, Loader2 } from 'lucide-react';

function OrderDetailContent() {
  // Use useParams hook instead of props
  const params = useParams();
  const orderId = params.id;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      console.log('Order details:', data); // Debug log
      
      if (data.success) {
        setOrder(data.data || data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date Error';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Helper function to render address
  const renderAddress = (address) => {
    if (!address) return 'No address provided';
    
    // If address is a string
    if (typeof address === 'string') {
      return address;
    }
    
    // If address is an object
    if (typeof address === 'object') {
      // Check if it's a nested object with specific fields
      const { 
        firstName, lastName, email, phone,
        address: streetAddress, street,
        city, state, zipCode, zip, country 
      } = address;
      
      return (
        <div>
          {(firstName || lastName) && (
            <p className="font-medium">{firstName} {lastName}</p>
          )}
          {email && <p className="text-sm">{email}</p>}
          {phone && <p className="text-sm">{phone}</p>}
          {(streetAddress || street || address.address) && (
            <p>{streetAddress || street || address.address}</p>
          )}
          {city && (
            <p>
              {city}{state ? `, ${state}` : ''} {zipCode || zip || ''}
            </p>
          )}
          {country && <p>{country}</p>}
        </div>
      );
    }
    
    return 'Invalid address format';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Order not found</p>
        <Link href="/orders" className="text-blue-600 hover:text-blue-700">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/orders" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Order #{order.order_number || order.id}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                <Calendar className="inline w-4 h-4 mr-1" />
                {formatDate(order.created_at || order.createdAt)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-900">{order.User?.name || 'Guest User'}</span>
                </div>
                {order.User?.email && (
                  <div className="flex items-center">
                    <span className="text-gray-600 ml-6">{order.User.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                <div className="text-gray-900">
                  {renderAddress(order.shipping_address)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.OrderItems && order.OrderItems.length > 0 ? (
              order.OrderItems.map((item, index) => (
                <div key={item.id || index} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center">
                    {item.product_image ? (
                      <img 
                        src={item.product_image} 
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded mr-4"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded mr-4 flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.product_name || 'Unknown Product'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ₾{parseFloat(item.price).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₾{(parseFloat(item.price) * item.quantity).toFixed(2)} total
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items in this order</p>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>
                ₾{(
                  parseFloat(order.total_amount || 0) - 
                  parseFloat(order.shipping_amount || 0) - 
                  parseFloat(order.tax_amount || 0)
                ).toFixed(2)}
              </span>
            </div>
            {order.shipping_amount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₾{parseFloat(order.shipping_amount).toFixed(2)}</span>
              </div>
            )}
            {order.tax_amount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₾{parseFloat(order.tax_amount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>₾{parseFloat(order.total_amount || 0).toFixed(2)}</span>
            </div>
          </div>

          {order.payment_method && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">Payment Method:</span>
                </div>
                <span className="text-gray-900 capitalize">{order.payment_method}</span>
              </div>
              {order.payment_status && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                    order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return <OrderDetailContent />;
}
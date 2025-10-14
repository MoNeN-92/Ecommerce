'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Eye,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  RefreshCw,
  FileText
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { debounce } from 'lodash'; // npm install lodash

function AdminOrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Debounced search function
  const debouncedFetch = useCallback(
    debounce((searchValue) => {
      fetchOrders(searchValue);
    }, 500),
    [statusFilter, pagination.page]
  );

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, statusFilter]);

  useEffect(() => {
    if (searchTerm) {
      debouncedFetch(searchTerm);
    } else {
      fetchOrders();
    }
  }, [searchTerm]);

  const fetchOrders = async (search = '') => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(statusFilter && { status: statusFilter }),
        ...(search && { search })
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        const ordersArray = data.orders || data.data || [];
        setOrders(ordersArray);

        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const refreshOrders = () => {
    setIsRefreshing(true);
    fetchOrders(searchTerm);
  };

  const formatOrderDate = (order) => {
    const dateValue = order.created_at || order.createdAt || order.date;

    if (!dateValue) {
      return { date: 'N/A', time: 'N/A' };
    }

    try {
      const date = new Date(dateValue);

      if (isNaN(date.getTime())) {
        return { date: 'Invalid Date', time: '' };
      }

      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      return { date: formattedDate, time: formattedTime };
    } catch (error) {
      console.error('Date parsing error:', error);
      return { date: 'Date Error', time: '' };
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      const data = await res.json();

      if (data.success) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert(
          'Failed to update order status: ' + (data.message || 'Unknown error')
        );
        fetchOrders(searchTerm);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
      fetchOrders(searchTerm);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const displayOrders = orders;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600 mt-2">
              Manage customer orders and update their status
            </p>
          </div>
          <button
            onClick={refreshOrders}
            className={`px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 ${
              isRefreshing ? 'opacity-50' : ''
            }`}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
        </div>

        {/* Filters */}
        {/* ... unchanged filter section ... */}

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayOrders.length > 0 ? (
                displayOrders.map((order) => {
                  const { date, time } = formatOrderDate(order);

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.order_number || order.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.User?.name || 'Guest User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.User?.email || 'No email'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.OrderItems?.length || 0} items
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.OrderItems?.length > 0
                            ? order.OrderItems.slice(0, 2).map((item, index) => (
                                <span key={index}>
                                  {item.product_name || 'Unknown Product'}
                                  {index <
                                    Math.min(order.OrderItems.length, 2) - 1 &&
                                    ', '}
                                </span>
                              ))
                            : 'No items'}
                          {order.OrderItems?.length > 2 && '...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₾{parseFloat(order.total_amount || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusUpdate(order.id, e.target.value)
                            }
                            className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(
                              order.status
                            )}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{date}</div>
                        {time !== 'N/A' && (
                          <div className="text-sm text-gray-500">{time}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                           <Link
                          href={`/admin/orders/invoice/${order.id}`}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Invoice
                        </Link>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Link>
                     
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm || statusFilter
                        ? 'No orders found matching your filters'
                        : 'No orders yet'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination + Stats ... */}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute adminOnly={true}>
      <AdminOrdersContent />
    </ProtectedRoute>
  );
}

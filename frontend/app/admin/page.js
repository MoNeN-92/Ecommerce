// app/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Eye,
  Plus,
  ArrowUpRight,
  DollarSign,
  AlertTriangle,
  Calendar,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  ShoppingBag,
  Activity,
  Download,
  Mail
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

function AdminDashboardContent() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    todayOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    averageOrderValue: 0,
    totalCategories: 0,
    outOfStockProducts: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  useEffect(() => {
    fetchDashboardData();
  }, []);


  const createCategory = async () => {
    if (!categoryName) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: categoryName })
    });

    if (res.ok) {
      alert('Category created!');
      setCategoryName('');
      setShowCategoryModal(false);
    }
  };

  // Modal HTML (გვერდის ბოლოში)
  {
    showCategoryModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h3 className="text-lg font-bold mb-4">Create Category</h3>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category name"
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="flex-1 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={createCategory}
              className="flex-1 py-2 bg-blue-600 text-white rounded"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    )
  }

  
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Try fetching dashboard statistics from backend
      try {
        const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/statistics`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success && statsData.data) {
            // Update stats from backend
            setStats({
              totalProducts: statsData.data.products?.total || 0,
              totalOrders: statsData.data.orders?.total || 0,
              totalUsers: statsData.data.users?.total || 0,
              totalRevenue: statsData.data.orders?.revenue || 0,
              lowStockProducts: statsData.data.products?.lowStock || 0,
              outOfStockProducts: statsData.data.products?.outOfStock || 0,
              todayOrders: statsData.data.orders?.today || 0,
              pendingOrders: statsData.data.orders?.pending || 0,
              processingOrders: statsData.data.orders?.processing || 0,
              shippedOrders: statsData.data.orders?.shipped || 0,
              deliveredOrders: statsData.data.orders?.delivered || 0,
              cancelledOrders: statsData.data.orders?.cancelled || 0,
              monthlyRevenue: statsData.data.orders?.monthlyRevenue || 0,
              yearlyRevenue: statsData.data.orders?.yearlyRevenue || 0,
              averageOrderValue: statsData.data.orders?.averageValue || 0,
              totalCategories: statsData.data.categories?.total || 0
            });

            setRecentProducts(statsData.data.recentProducts || []);
            setRecentOrders(statsData.data.recentOrders || []);
            setTopProducts(statsData.data.topProducts || []);
          }
        }
      } catch (dashboardError) {
        console.log('Dashboard endpoint not available, fetching individual data...');

        // Fallback: Fetch individual endpoints
        await fetchIndividualStats(token);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndividualStats = async (token) => {
    try {
      // Fetch products
      const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        const products = productsData.data || [];

        setStats(prev => ({
          ...prev,
          totalProducts: products.length,
          lowStockProducts: products.filter(p => p.stock > 0 && p.stock < 10).length,
          outOfStockProducts: products.filter(p => p.stock === 0).length
        }));

        setRecentProducts(products.slice(0, 5));
      }

      // Fetch orders
      const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const orders = ordersData.data || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOrders = orders.filter(o => {
          const orderDate = new Date(o.created_at);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime();
        });

        const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          todayOrders: todayOrders.length,
          totalRevenue: totalRevenue,
          averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          processingOrders: orders.filter(o => o.status === 'processing').length,
          shippedOrders: orders.filter(o => o.status === 'shipped').length,
          deliveredOrders: orders.filter(o => o.status === 'delivered').length,
          cancelledOrders: orders.filter(o => o.status === 'cancelled').length
        }));

        setRecentOrders(orders.slice(0, 5));

        // Generate recent invoices from orders
        const invoices = orders.slice(0, 5).map(order => ({
          id: order.id,
          invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(order.id).padStart(5, '0')}`,
          orderNumber: order.order_number || order.id,
          customerName: order.User?.name || 'Guest',
          amount: order.total_amount,
          status: order.payment_status || 'pending',
          date: order.created_at
        }));
        setRecentInvoices(invoices);
      }

    } catch (error) {
      console.error('Error fetching individual stats:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change, link }) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {link && (
        <Link
          href={link}
          className="text-sm text-blue-600 hover:text-blue-800 mt-3 inline-flex items-center"
        >
          View details <ArrowUpRight className="w-4 h-4 ml-1" />
        </Link>
      )}
    </div>
  );

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₾${stats.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            color="bg-green-500"
            change="+12% from last month"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="bg-blue-500"
            link="/admin/orders"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            color="bg-purple-500"
            link="/admin/products"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="bg-orange-500"
          />
        </div>

        {/* Order Status Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.processingOrders}</p>
              <p className="text-xs text-gray-600">Processing</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <Truck className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.shippedOrders}</p>
              <p className="text-xs text-gray-600">Shipped</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.deliveredOrders}</p>
              <p className="text-xs text-gray-600">Delivered</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.cancelledOrders}</p>
              <p className="text-xs text-gray-600">Cancelled</p>
            </div>
          </div>
        </div>

        {/* Alert Cards */}
        {(stats.lowStockProducts > 0 || stats.outOfStockProducts > 0) && (
          <div className="space-y-4 mb-8">
            {stats.lowStockProducts > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Low Stock Alert</h3>
                    <p className="text-sm text-yellow-700">
                      {stats.lowStockProducts} products have low stock (less than 10 items)
                    </p>
                  </div>
                  <Link
                    href="/admin/products?filter=low-stock"
                    className="ml-auto text-sm text-yellow-800 hover:text-yellow-900 font-medium"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            )}

            {stats.outOfStockProducts > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Out of Stock</h3>
                    <p className="text-sm text-red-700">
                      {stats.outOfStockProducts} products are out of stock
                    </p>
                  </div>
                  <Link
                    href="/admin/products?filter=out-of-stock"
                    className="ml-auto text-sm text-red-800 hover:text-red-900 font-medium"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/admin/products/new"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Add Product</h3>
                <p className="text-sm text-gray-600">Create new listing</p>
              </div>
            </div>
          </Link>


          <Link
            href="/admin/categories"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Add Category</h3>
                <p className="text-sm text-gray-600">Create new category</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">View Orders</h3>
                <p className="text-sm text-gray-600">Manage orders</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/invoices"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Invoices</h3>
                <p className="text-sm text-gray-600">Manage invoices</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/reports"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Reports</h3>
                <p className="text-sm text-gray-600">View analytics</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Data Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                <Link
                  href="/admin/orders"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Order #{order.order_number || order.id}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.User?.name || 'Guest'} • {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ₾{parseFloat(order.total_amount || 0).toFixed(2)}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No orders yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Recent Products</h2>
                <Link
                  href="/admin/products"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentProducts.length > 0 ? (
                  recentProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4">
                      <img
                        className="w-10 h-10 rounded object-cover"
                        src={product.image_url || '/placeholder-product.png'}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-product.png';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₾{product.price} • Stock: {product.stock}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' :
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {product.stock > 10 ? 'In Stock' :
                          product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-3">No products yet</p>
                    <Link
                      href="/admin/products/new"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Add your first product
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
                <Link
                  href="/admin/orders"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentInvoices.length > 0 ? (
                  recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            {invoice.customerName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${invoice.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                          {invoice.status}
                        </span>
                        <Link
                          href={`/admin/orders/invoice/${invoice.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No invoices yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute adminOnly={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
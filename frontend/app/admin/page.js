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

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        {/* ... დანარჩენი კოდი უცვლელია ... */}
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

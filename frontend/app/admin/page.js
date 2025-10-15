// frontend/app/admin/page.js
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
  Activity
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
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce-production-3c82.up.railway.app/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      console.log('📊 Fetching dashboard data...');

      // Fetch Dashboard Statistics
      const statsRes = await fetch(`${API_URL}/dashboard/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log('✅ Dashboard data:', statsData);

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
        }
      } else {
        console.error('❌ Dashboard API failed:', statsRes.status);
      }

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change, link, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className="text-sm font-medium text-green-600 flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {link && (
        <Link
          href={link}
          className="text-sm text-blue-600 hover:text-blue-800 mt-4 inline-flex items-center font-medium"
        >
          ნახვა <ArrowUpRight className="w-4 h-4 ml-1" />
        </Link>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ჩატვირთვა...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            მოგესალმებით! აქ ჩანს თქვენი მაღაზიის სტატისტიკა.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="სულ პროდუქტი"
            value={stats.totalProducts}
            icon={Package}
            color="bg-blue-600"
            link="/admin/products"
            subtitle={`${stats.lowStockProducts} დაბალი მარაგი`}
          />
          <StatCard
            title="სულ შეკვეთები"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="bg-green-600"
            link="/admin/orders"
            subtitle={`${stats.todayOrders} დღეს`}
          />
          <StatCard
            title="მომხმარებლები"
            value={stats.totalUsers}
            icon={Users}
            color="bg-purple-600"
            subtitle="რეგისტრირებული"
          />
          <StatCard
            title="შემოსავალი"
            value={`₾${stats.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            color="bg-orange-600"
            change="+12.5%"
            subtitle={`საშუალო: ₾${stats.averageOrderValue.toFixed(2)}`}
          />
        </div>

        {/* Order Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">მოლოდინში</p>
                <p className="text-xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">მუშავდება</p>
                <p className="text-xl font-bold text-gray-900">{stats.processingOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">გზაშია</p>
                <p className="text-xl font-bold text-gray-900">{stats.shippedOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">მიწოდებული</p>
                <p className="text-xl font-bold text-gray-900">{stats.deliveredOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">გაუქმებული</p>
                <p className="text-xl font-bold text-gray-900">{stats.cancelledOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/products/new"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">ახალი პროდუქტი</h3>
                <p className="text-sm text-gray-600">დაამატე ახალი პროდუქტი</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">შეკვეთები</h3>
                <p className="text-sm text-gray-600">მართე შეკვეთები</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">კატეგორიები</h3>
                <p className="text-sm text-gray-600">მართე კატეგორიები</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders & Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">ბოლო შეკვეთები</h2>
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                ყველას ნახვა
              </Link>
            </div>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">შეკვეთა #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.User?.name || 'სტუმარი'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₾{order.total_amount}</p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('ka-GE')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>შეკვეთები არ არის</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">ბოლო პროდუქტები</h2>
              <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                ყველას ნახვა
              </Link>
            </div>
            <div className="space-y-4">
              {recentProducts.length > 0 ? (
                recentProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image_url || '/placeholder.png'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">მარაგი: {product.stock}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₾{product.price}</p>
                      {product.stock < 10 && (
                        <p className="text-xs text-orange-600 font-medium">დაბალი მარაგი</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>პროდუქტები არ არის</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alerts */}
        {(stats.lowStockProducts > 0 || stats.outOfStockProducts > 0) && (
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">გაფრთხილება</h3>
                <p className="text-sm text-orange-800">
                  {stats.outOfStockProducts > 0 && `${stats.outOfStockProducts} პროდუქტი ამოიწურა. `}
                  {stats.lowStockProducts > 0 && `${stats.lowStockProducts} პროდუქტს აქვს დაბალი მარაგი.`}
                </p>
                <Link href="/admin/products" className="text-sm text-orange-600 hover:text-orange-800 font-medium mt-2 inline-block">
                  ნახვა და შევსება →
                </Link>
              </div>
            </div>
          </div>
        )}
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
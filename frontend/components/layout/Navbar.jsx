// frontend/components/Navbar.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import useCartStore from '@/store/useCartStore';
import SearchBar from '@/components/SearchBar';
import { ShoppingCart, Menu, X, User, LogOut, Package, Settings } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  
  // Get cart state from store
  const totalItems = useCartStore((state) => state.totalItems);

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      const { loadCart } = useCartStore.getState();
      if (typeof loadCart === 'function') {
        loadCart();
      }
    }
  }, [user]);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 hover:text-blue-700 transition whitespace-nowrap"
            >
              E-Commerce
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
            >
              პროდუქტები
            </Link>
          </div>

          {/* Search Bar - Desktop & Tablet */}
          <div className="hidden sm:block flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>

          {/* Right Menu - Desktop */}
          <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
            {/* Cart Icon */}
            {user && (
              <Link 
                href="/cart" 
                className="relative p-2 text-gray-700 hover:text-blue-600 transition duration-200"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none transition"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="w-8 h-8 lg:w-9 lg:h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block text-sm lg:text-base font-medium truncate max-w-[100px]">
                    {user.name || user.username}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200 animate-fade-in">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      პროფილი
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      ჩემი შეკვეთები
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        ადმინისტრაცია
                      </Link>
                    )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      გასვლა
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm lg:text-base font-medium"
                >
                  შესვლა
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm lg:text-base font-medium whitespace-nowrap"
                >
                  რეგისტრაცია
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex sm:hidden items-center space-x-2">
            {/* Mobile Cart Icon */}
            {user && (
              <Link 
                href="/cart" 
                className="relative p-2 text-gray-700"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none transition"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden py-3 border-t border-gray-100">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-2xl z-50 sm:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <div className="p-4">
              {/* User Info or Login */}
              {user ? (
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.name || user.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="pb-4 border-b border-gray-200 mb-4 space-y-2">
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    შესვლა
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    რეგისტრაცია
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-1">
                <Link
                  href="/products"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package className="h-5 w-5" />
                  <span className="font-medium">პროდუქტები</span>
                </Link>
                
                {user && (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">პროფილი</span>
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="h-5 w-5" />
                      <span className="font-medium">ჩემი შეკვეთები</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5" />
                        <span className="font-medium">ადმინისტრაცია</span>
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">გასვლა</span>
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
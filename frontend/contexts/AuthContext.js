// frontend/contexts/AuthContext.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce-production-3c82.up.railway.app/api';
      
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Auth check response:', result);
        
        if (result.success && result.user) {
          console.log('✅ Setting user from /me:', result.user);
          setUser(result.user);
        } else if (result.user) {
          console.log('✅ Setting user (no success field):', result.user);
          setUser(result.user);
        } else {
          console.log('❌ No user in response');
          localStorage.removeItem('token');
        }
      } else {
        console.log('❌ Auth check failed:', response.status);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce-production-3c82.up.railway.app/api';
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      console.log('✅ Login response:', result);

      if (response.ok && result.token) {
        localStorage.setItem('token', result.token);
        
        // CRITICAL: Make sure to save the full user object with role
        if (result.user) {
          console.log('✅ Setting user after login:', result.user);
          setUser(result.user);
        } else {
          console.warn('⚠️ No user object in login response');
          setUser({ email });
        }
        
        return { success: true };
      } else {
        return {
          success: false,
          message: result.message || 'შესვლა ვერ მოხერხდა'
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return {
        success: false,
        message: 'სერვერთან დაკავშირების შეცდომა'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce-production-3c82.up.railway.app/api';
      
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password
      };

      console.log('📝 Registering with:', userData);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();
      console.log('✅ Register response:', result);

      if (response.ok && result.token) {
        localStorage.setItem('token', result.token);
        
        // Save full user object with role
        if (result.user) {
          console.log('✅ Setting user after register:', result.user);
          setUser(result.user);
        } else {
          setUser({ name, email, role: 'customer' });
        }
        
        return { success: true };
      } else {
        return {
          success: false,
          message: result.message || 'რეგისტრაცია ვერ მოხერხდა'
        };
      }
    } catch (error) {
      console.error('❌ Register error:', error);
      return {
        success: false,
        message: 'სერვერთან დაკავშირების შეცდომა'
      };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce-production-3c82.up.railway.app/api';
        
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(() => {});
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);

      // Clear cart
      if (typeof window !== 'undefined') {
        try {
          const cartStore = require('../store/useCartStore');
          if (cartStore && cartStore.default) {
            const { resetCart } = cartStore.default.getState();
            if (resetCart) {
              resetCart();
            }
          }
        } catch (error) {
          console.log('Cart store not found, skipping cart reset');
        }
      }
    }
  };

  const isAdmin = () => {
    console.log('🔍 isAdmin check:', user?.role);
    return user && user.role === 'admin';
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
    if (user) {
      localStorage.setItem('user', JSON.stringify({ ...user, ...updatedData }));
    }
  };

  // Debug logging
  useEffect(() => {
    console.log('=== AUTH CONTEXT STATE ===');
    console.log('User:', user);
    console.log('User Role:', user?.role);
    console.log('Is Admin:', user?.role === 'admin');
    console.log('Loading:', loading);
    console.log('=========================');
  }, [user, loading]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
    isAdmin,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
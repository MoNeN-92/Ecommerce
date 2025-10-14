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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          setUser(result.user);
        } else if (result.user) {
          // Backend might not send 'success' field
          setUser(result.user);
        } else {
          localStorage.removeItem('token');
        }
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok && result.token) {
        localStorage.setItem('token', result.token);
        setUser(result.user || { email });
        return { success: true };
      } else {
        return {
          success: false,
          message: result.message || 'შესვლა ვერ მოხერხდა'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'სერვერთან დაკავშირების შეცდომა'
      };
    }
  };

  // ✅ გამოსწორებული register ფუნქცია
  const register = async (name, email, password) => {
    try {
      // მონაცემების მომზადება - სწორი ფორმატით
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password
      };

      console.log('Registering with:', userData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData) // მხოლოდ ერთხელ stringify
      });

      const result = await response.json();

      if (response.ok && result.token) {
        localStorage.setItem('token', result.token);
        setUser(result.user || { name, email });
        return { success: true };
      } else {
        return {
          success: false,
          message: result.message || 'რეგისტრაცია ვერ მოხერხდა'
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'სერვერთან დაკავშირების შეცდომა'
      };
    }
  };

  const logout = async () => {
    try {
      // შეიძლება გინდოდეს Backend-ზე logout endpoint-ის გამოძახება
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(() => { }); // Ignore logout errors
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // ყოველთვის წაშალე ლოკალური მონაცემები
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);

      // კალათის გასუფთავება
      if (typeof window !== 'undefined') {
        try {
          // ჯერ შეამოწმე არსებობს თუ არა useCartStore
          const cartStore = require('../store/cartStore');
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

  // ადმინის შემოწმება
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // მომხმარებლის განახლება (პროფილის რედაქტირებისთვის)
  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
    // შეინახე localStorage-შიც
    if (user) {
      localStorage.setItem('user', JSON.stringify({ ...user, ...updatedData }));
    }
  };

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
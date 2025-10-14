// frontend/store/useCartStore.js
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const useCartStore = create(
  subscribeWithSelector((set, get) => ({
    items: [],
    totalAmount: 0,
    totalItems: 0,
    isLoading: false,
    error: null,

    // Get auth token from localStorage
    getAuthToken: () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
      }
      return null;
    },

    // Get auth headers
    getAuthHeaders: () => {
      const token = get().getAuthToken();
      return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
    },

    // Load cart from server
    loadCart: async () => {
      const token = get().getAuthToken();
      if (!token) {
        set({ items: [], totalAmount: 0, totalItems: 0 });
        return;
      }

      set({ isLoading: true, error: null });
      
      try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
          headers: get().getAuthHeaders()
        });

        if (!response.ok) {
          throw new Error('Cart loading failed');
        }

        const result = await response.json();
        
        if (result.success) {
          set({
            items: Array.isArray(result.data.items) ? result.data.items : [],
            totalAmount: result.data.totalAmount || 0,
            totalItems: result.data.totalItems || 0,
            isLoading: false
          });
        } else {
          throw new Error(result.message || 'Failed to load cart');
        }
      } catch (error) {
        console.error('Load cart error:', error);
        set({ 
          error: error.message,
          isLoading: false,
          items: [],
          totalAmount: 0,
          totalItems: 0
        });
      }
    },

    // Add item to cart (for ProductCard compatibility)
    addItem: async (product, quantity = 1) => {
      const token = get().getAuthToken();
      if (!token) {
        set({ error: 'შესვლა საჭიროა კალათის გამოყენებისთვის' });
        return false;
      }

      return await get().addToCart(product.id, quantity);
    },

    // Add item to cart (server-synced)
    addToCart: async (productId, quantity = 1) => {
      const token = get().getAuthToken();
      if (!token) {
        set({ error: 'შესვლა საჭიროა კალათის გამოყენებისთვის' });
        return false;
      }

      set({ isLoading: true, error: null });

      try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
          method: 'POST',
          headers: get().getAuthHeaders(),
          body: JSON.stringify({ productId, quantity })
        });

        const result = await response.json();

        if (result.success) {
          // Reload cart to get updated totals
          await get().loadCart();
          return true;
        } else {
          set({ error: result.message, isLoading: false });
          return false;
        }
      } catch (error) {
        console.error('Add to cart error:', error);
        set({ error: 'პროდუქტის დამატება ვერ მოხერხდა', isLoading: false });
        return false;
      }
    },

    // Update cart item quantity - FIXED to use correct endpoint
    updateCartItem: async (productId, quantity) => {
      const token = get().getAuthToken();
      if (!token) return false;

      console.log('Updating cart item:', { productId, quantity });

      set({ isLoading: true, error: null });

      try {
        const response = await fetch(`${API_BASE_URL}/cart/update/${productId}`, {
          method: 'PUT',
          headers: get().getAuthHeaders(),
          body: JSON.stringify({ quantity })
        });

        console.log('Update response status:', response.status);

        const result = await response.json();
        console.log('Update result:', result);

        if (result.success) {
          // Reload cart to get fresh data
          await get().loadCart();
          return true;
        } else {
          set({ error: result.message, isLoading: false });
          return false;
        }
      } catch (error) {
        console.error('Update cart error:', error);
        set({ error: 'რაოდენობის განახლება ვერ მოხერხდა', isLoading: false });
        return false;
      }
    },

    // Remove item from cart - FIXED to use correct endpoint
    removeFromCart: async (productId) => {
      const token = get().getAuthToken();
      if (!token) return false;

      console.log('Removing from cart, productId:', productId);

      set({ isLoading: true, error: null });

      try {
        const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
          method: 'DELETE',
          headers: get().getAuthHeaders()
        });

        console.log('Remove response status:', response.status);

        const result = await response.json();
        console.log('Remove result:', result);

        if (result.success) {
          // Reload cart to get fresh data
          await get().loadCart();
          return true;
        } else {
          set({ error: result.message, isLoading: false });
          return false;
        }
      } catch (error) {
        console.error('Remove from cart error:', error);
        set({ error: 'პროდუქტის წაშლა ვერ მოხერხდა', isLoading: false });
        return false;
      }
    },

    // Clear entire cart
    clearCart: async () => {
      const token = get().getAuthToken();
      if (!token) {
        set({ items: [], totalAmount: 0, totalItems: 0 });
        return true;
      }

      set({ isLoading: true, error: null });

      try {
        const response = await fetch(`${API_BASE_URL}/cart/clear`, {
          method: 'DELETE',
          headers: get().getAuthHeaders()
        });

        const result = await response.json();

        if (result.success) {
          set({
            items: [],
            totalAmount: 0,
            totalItems: 0,
            isLoading: false
          });
          return true;
        } else {
          set({ error: result.message, isLoading: false });
          return false;
        }
      } catch (error) {
        console.error('Clear cart error:', error);
        set({ error: 'კალათის გასუფთავება ვერ მოხერხდა', isLoading: false });
        return false;
      }
    },

    // Helper methods
    getTotalPrice: () => {
      return get().totalAmount;
    },

    getItemCount: () => {
      return get().totalItems;
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Reset cart (for logout)
    resetCart: () => set({
      items: [],
      totalAmount: 0,
      totalItems: 0,
      isLoading: false,
      error: null
    })
  }))
);

export default useCartStore;
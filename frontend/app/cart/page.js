'use client';

import { useEffect, useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import useCartStore from '@/store/useCartStore';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const totalAmount = useCartStore((state) => state.totalAmount);
  const isLoading = useCartStore((state) => state.isLoading);
  const error = useCartStore((state) => state.error);
  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const loadCart = useCartStore((state) => state.loadCart);
  
  // Local loading states to prevent refresh
  const [updatingItems, setUpdatingItems] = useState({});
  const [removingItems, setRemovingItems] = useState({});

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Calculate totals
  const subtotal = totalAmount || 0;
  const tax = subtotal * 0.18; // 18% VAT
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  // Optimistic update for quantity
  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    
    // Set loading state for this specific item
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    
    try {
      // Optimistically update the UI first
      const optimisticUpdate = () => {
        const updatedItems = items.map(item => {
          const itemProductId = item.product_id || item.product?.id || item.id;
          if (itemProductId === productId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        
        // Temporarily update the store without API call
        useCartStore.setState({ items: updatedItems });
      };
      
      optimisticUpdate();
      
      // Then make the API call
      const success = await updateCartItem(productId, newQuantity);
      
      if (!success) {
        // If failed, reload to get correct state
        console.error('Failed to update quantity');
        loadCart();
      }
    } finally {
      setUpdatingItems(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    }
  };

  // Optimistic remove
  const handleRemoveItem = async (productId) => {
    // Set loading state for this specific item
    setRemovingItems(prev => ({ ...prev, [productId]: true }));
    
    try {
      // Optimistically remove from UI
      const optimisticRemove = () => {
        const updatedItems = items.filter(item => {
          const itemProductId = item.product_id || item.product?.id || item.id;
          return itemProductId !== productId;
        });
        
        useCartStore.setState({ items: updatedItems });
      };
      
      optimisticRemove();
      
      // Then make the API call
      const success = await removeFromCart(productId);
      
      if (!success) {
        // If failed, reload to get correct state
        console.error('Failed to remove item');
        loadCart();
      }
    } finally {
      setRemovingItems(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">იტვირთება...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadCart}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              სცადეთ ხელახლა
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">თქვენი კალათა ცარიელია</h2>
            <p className="text-gray-600 mb-6">დაამატეთ პროდუქტები შოპინგის დასაწყებად</p>
            <Link href="/products">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                განაგრძეთ შოპინგი
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">საყიდლების კალათა</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {items.map((item) => {
                // Handle nested product structure
                const product = item.product || item.Product || {};
                const productName = product.name || item.name || 'უცნობი პროდუქტი';
                const productPrice = parseFloat(product.price || item.price || 0);
                const productImage = product.image_url || item.image_url;
                const quantity = item.quantity || 1;
                const productId = item.product_id || product.id || item.id;
                
                const isUpdating = updatingItems[productId];
                const isRemoving = removingItems[productId];
                
                return (
                  <div 
                    key={item.id} 
                    className={`flex items-center gap-4 p-4 border-b last:border-b-0 transition-opacity ${
                      isRemoving ? 'opacity-50' : ''
                    }`}
                  >
                    <img 
                      src={productImage || '/placeholder-product.png'} 
                      alt={productName}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">{productName}</h3>
                      <p className="text-gray-600">₾{productPrice.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleUpdateQuantity(productId, quantity, -1);
                        }}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 transition"
                        disabled={quantity <= 1 || isUpdating || isRemoving}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className={`w-8 text-center font-semibold ${
                        isUpdating ? 'text-blue-600' : ''
                      }`}>
                        {quantity}
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleUpdateQuantity(productId, quantity, 1);
                        }}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 transition"
                        disabled={isUpdating || isRemoving}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="font-bold min-w-[80px] text-right">
                      ₾{(productPrice * quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveItem(productId);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 transition"
                      disabled={isRemoving}
                    >
                      {isRemoving ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <Link href="/products">
              <button className="mt-4 text-blue-600 hover:text-blue-700 font-semibold">
                ← განაგრძეთ შოპინგი
              </button>
            </Link>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">შეკვეთის დეტალები</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">ქვეჯამი</span>
                  <span>₾{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">მიწოდება</span>
                  <span>{shipping === 0 ? 'უფასო' : `₾${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">დღგ (18%)</span>
                  <span>₾{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>სულ</span>
                    <span>₾{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {subtotal < 100 && (
                <p className="text-sm text-gray-600 mb-4">
                  დაამატეთ კიდევ ₾{(100 - subtotal).toFixed(2)} უფასო მიწოდებისთვის
                </p>
              )}

              <Link href="/checkout">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  გადახდაზე გადასვლა
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
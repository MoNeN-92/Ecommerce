// components/products/AddToCartButton.jsx
'use client';

import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import useCartStore from '@/store/useCartStore';

export default function AddToCartButton({ product, className = '' }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  if (!product.stock || product <= 0) {
    return (
      <button 
        disabled
        className={`bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed ${className}`}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="flex items-center border rounded-lg">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-3 py-2 hover:bg-gray-100"
        >
          -
        </button>
        <span className="px-4 py-2 font-semibold">{quantity}</span>
        <button 
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          className="px-3 py-2 hover:bg-gray-100"
        >
          +
        </button>
      </div>
      
      <button 
        onClick={handleAddToCart}
        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </button>
    </div>
  );
}
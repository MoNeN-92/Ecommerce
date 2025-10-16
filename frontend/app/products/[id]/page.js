// frontend/app/products/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ShoppingCart, Heart, Share2, Star, Truck, Shield, Package, X } from 'lucide-react';
import useCartStore from '@/store/useCartStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/products/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Product not found');
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setProduct(data.data);
      } else {
        throw new Error('Product data not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get all product images with proper Base64 support
  const getAllImages = () => {
    if (!product) return ['/placeholder-product.png'];
    
    const allImages = [];
    
    // Handle images array (JSON field)
    if (product.images) {
      if (Array.isArray(product.images)) {
        allImages.push(...product.images.filter(img => img && img.trim() !== ''));
      } else if (typeof product.images === 'string') {
        try {
          const parsed = JSON.parse(product.images);
          if (Array.isArray(parsed)) {
            allImages.push(...parsed.filter(img => img && img.trim() !== ''));
          }
        } catch {
          if (product.images.trim() !== '') {
            allImages.push(product.images);
          }
        }
      }
    }
    
    // Add main image if not already in array
    if (product.image_url && product.image_url.trim() !== '' && !allImages.includes(product.image_url)) {
      allImages.unshift(product.image_url);
    }
    
    // Return placeholder if no images
    if (allImages.length === 0) {
      allImages.push('/placeholder-product.png');
    }
    
    return allImages;
  };

  // ✅ Build proper image URL with Base64 support
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return '/placeholder-product.png';
    }
    
    // ✅ Check if it's Base64 data URI
    if (imageUrl.startsWith('data:image/')) {
      return imageUrl;
    }
    
    // Check if it's absolute URL
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Build relative URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    if (imageUrl.startsWith('/')) {
      return `${apiUrl}${imageUrl}`;
    }
    
    return `${apiUrl}/uploads/${imageUrl}`;
  };

  const handleImageError = (e) => {
    console.log(`Image failed to load for product ${params.id}`);
    e.target.onerror = null;
    e.target.src = '/placeholder-product.png';
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem(product, quantity);
    window.dispatchEvent(new Event('cartUpdated'));
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase' && quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">{error || 'The requested product does not exist'}</p>
          <Link href="/products">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">
              Back to Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const productImages = getAllImages();
  const currentImage = productImages[currentImageIndex];

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb - Hidden on mobile */}
          <nav className="hidden sm:flex items-center space-x-2 text-sm mb-6 lg:mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </nav>

          {/* Mobile Back Button */}
          <button
            onClick={() => router.back()}
            className="sm:hidden flex items-center text-gray-600 mb-4"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Gallery */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div 
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
                  onClick={() => setShowImageModal(true)}
                >
                  <img
                    src={getImageUrl(currentImage)}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain" 
                    onError={handleImageError}
                  />
                  
                  {/* Image Counter Badge */}
                  {productImages.length > 1 && (
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs sm:text-sm">
                      {currentImageIndex + 1} / {productImages.length}
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm font-semibold">
                      Out of Stock
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Images */}
                {productImages.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {productImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-blue-600 ring-2 ring-blue-600' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-contain"
                          onError={handleImageError}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Category */}
                {product.category && (
                  <div className="text-xs sm:text-sm text-gray-500 mb-2">
                    {product.category.name}
                  </div>
                )}

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          i < Math.floor(product.rating || 4) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 text-xs sm:text-sm">
                    ({product.reviews_count || 0} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-blue-600">
                    ₾{parseFloat(product.price).toFixed(2)}
                  </span>
                  {product.old_price && (
                    <span className="ml-2 text-lg sm:text-xl text-gray-500 line-through">
                      ₾{parseFloat(product.old_price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4 sm:mb-6">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {product.description || 'No description available'}
                  </p>
                </div>

                {/* Stock Status */}
                <div className="mb-4 sm:mb-6">
                  {product.stock > 0 ? (
                    <div className="flex flex-wrap items-center text-green-600 text-sm sm:text-base">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      <span>In Stock ({product.stock} available)</span>
                      {product.stock <= 5 && (
                        <span className="ml-2 text-orange-600 text-xs sm:text-sm">
                          - Only {product.stock} left!
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 text-sm sm:text-base">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <span className="text-gray-700 text-sm sm:text-base">Quantity:</span>
                    <div className="flex items-center border rounded-lg w-full sm:w-auto">
                      <button
                        onClick={() => handleQuantityChange('decrease')}
                        className="px-4 py-2 hover:bg-gray-100 transition flex-1 sm:flex-none"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x flex-1 sm:flex-none text-center min-w-[60px]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange('increase')}
                        className="px-4 py-2 hover:bg-gray-100 transition flex-1 sm:flex-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                      product.stock > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {addedToCart ? 'Added!' : (product.stock > 0 ? 'Add to Cart' : 'Out of Stock')}
                  </button>
                  <button className="sm:flex-none px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <Heart className="h-5 w-5 text-gray-600 mx-auto" />
                  </button>
                  <button className="sm:flex-none px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <Share2 className="h-5 w-5 text-gray-600 mx-auto" />
                  </button>
                </div>

                {/* Features */}
                <div className="border-t pt-4 sm:pt-6 space-y-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <Truck className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="text-gray-700 text-xs sm:text-sm">Free shipping on orders over ₾100</span>
                  </div>
                  <div className="flex items-start sm:items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="text-gray-700 text-xs sm:text-sm">30-day return guarantee</span>
                  </div>
                  <div className="flex items-start sm:items-center gap-3">
                    <Package className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="text-gray-700 text-xs sm:text-sm">Original product</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal - Full Screen */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="relative max-w-6xl max-h-full">
            <img
              src={getImageUrl(currentImage)}
              alt={`${product.name} - Full size`}
              className="max-w-full max-h-[90vh] object-contain"
              onError={handleImageError}
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Image navigation in modal */}
            {productImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition ${
                      index === currentImageIndex ? 'bg-white' : 'bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
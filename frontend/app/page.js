// frontend/app/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingCart, Truck, Shield, Clock, Award, Grid3x3, Laptop, Shirt, Home as HomeIcon, Book, Package, Heart, Star } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // ✅ Changed: null instead of 'all'
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce-production-3c82.up.railway.app/api';

  useEffect(() => {
    console.log('🔍 Environment Check:');
    console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('API_URL being used:', API_URL);
  }, []);

  const categoryIcons = {
    'Electronics': <Laptop className="w-6 h-6" />,
    'Clothing': <Shirt className="w-6 h-6" />,
    'Home': <HomeIcon className="w-6 h-6" />,
    'Books': <Book className="w-6 h-6" />,
    'All': <Grid3x3 className="w-6 h-6" />
  };

  const staticCategories = [
    { id: 'all', name: 'All', count: 0 },
    { id: 1, name: 'Electronics', count: 12 },
    { id: 2, name: 'Clothing', count: 24 },
    { id: 3, name: 'Home', count: 18 },
    { id: 4, name: 'Books', count: 7 }
  ];

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (featuredProducts.length > 0) {
      const interval = setInterval(() => {
        if (!isPaused) {
          setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
        }
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [featuredProducts, isPaused]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchFeaturedProducts = async () => {
    try {
      setFeaturedLoading(true);
      
      const url = `${API_URL}/products/featured`;
      console.log('📡 Fetching featured products from:', url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('✅ Featured products response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('✅ Featured products data:', data);
        setFeaturedProducts(data.data || []);
      } else {
        console.error('❌ Featured products fetch failed:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
    } finally {
      setFeaturedLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let url = `${API_URL}/products?limit=8`;
      
      // ✅ Fixed: Send category_id instead of category name
      if (selectedCategory && selectedCategory !== 'all') {
        url += `&category_id=${selectedCategory}`;
      }

      console.log('📡 Fetching products from:', url);
      console.log('🏷️ Selected category ID:', selectedCategory);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('✅ Products response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('✅ Products data:', data);
        setProducts(data.data || []);
      } else {
        console.error('❌ Products fetch failed:', res.status, res.statusText);
      }

      // Fetch categories
      try {
        const categoriesUrl = `${API_URL}/categories`;
        console.log('📡 Fetching categories from:', categoriesUrl);
        
        const categoriesRes = await fetch(categoriesUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          console.log('✅ Categories data:', categoriesData);
          setCategories([
            { id: 'all', name: 'ყველა', count: 0 },
            ...(categoriesData.data || [])
          ]);
        } else {
          console.warn('⚠️ Categories fetch failed, using static categories');
          setCategories(staticCategories);
        }
      } catch (catError) {
        console.error('❌ Categories error:', catError);
        setCategories(staticCategories);
      }

    } catch (err) {
      console.error('❌ Fetch error:', err);
      setCategories(staticCategories);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  // ✅ Helper function to get category name
  const getCategoryName = () => {
    if (!selectedCategory || selectedCategory === 'all') {
      return 'ყველა პროდუქტი';
    }
    const category = categories.find(c => c.id === selectedCategory);
    return category ? category.name : 'პროდუქტები';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Featured Products Slider */}
      <div className="relative h-[650px] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        {featuredLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-slate-300 border-t-slate-800"></div>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <Package className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-sm">პროდუქტები ჩატვირთვაში</p>
            </div>
          </div>
        ) : (
          <>
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-95 z-10 pointer-events-none'
                }`}
              >
                <div className="h-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full items-center">
                    {/* Product Info */}
                    <div className="space-y-8 relative z-20 pointer-events-auto">
                      <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        რჩეული
                      </div>

                      <div className="space-y-4">
                        <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                          {product.name}
                        </h1>

                        {product.description && (
                          <p className="text-lg text-slate-600 leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-bold text-slate-900">
                          ₾{product.price}
                        </span>
                        {product.category && (
                          <span className="text-sm text-slate-500 font-medium">
                            / {product.category.name}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-4 relative z-30 pointer-events-auto">
                        <Link href={`/products/${product.id}`} className="pointer-events-auto">
                          <button className="group bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 relative z-30 cursor-pointer pointer-events-auto">
                            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            ნახვა
                          </button>
                        </Link>
                        <button className="px-6 py-4 rounded-lg border-2 border-slate-200 hover:border-slate-900 transition-colors duration-300 relative z-30 cursor-pointer pointer-events-auto">
                          <Heart className="w-5 h-5 text-slate-600 hover:text-slate-900" />
                        </button>
                      </div>

                      {product.stock > 0 && product.stock < 10 && (
                        <div className="inline-flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">
                          <Award className="w-4 h-4" />
                          <span>დარჩა მხოლოდ {product.stock} ერთეული</span>
                        </div>
                      )}
                    </div>

                    {/* Product Image */}
                    <div className="relative z-10">
                      <div className="aspect-square rounded-2xl bg-white shadow-2xl shadow-slate-900/10 p-8 lg:p-12 overflow-hidden relative z-10">
                        <div className="relative w-full h-full z-10">
                          <img
                            src={product.image_url || '/placeholder-product.png'}
                            alt={product.name}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-700 relative z-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation */}
            {featuredProducts.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-50 bg-white/90 backdrop-blur-sm text-slate-900 p-3 rounded-full hover:bg-white shadow-lg transition-all pointer-events-auto cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-50 bg-white/90 backdrop-blur-sm text-slate-900 p-3 rounded-full hover:bg-white shadow-lg transition-all pointer-events-auto cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                  {featuredProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`transition-all duration-300 cursor-pointer ${
                        index === currentSlide
                          ? 'w-8 h-2 bg-slate-900'
                          : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                      } rounded-full`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Features */}
      <div className="border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <Truck className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">უფასო მიწოდება</h4>
                <p className="text-sm text-slate-500">100₾-ზე მეტი შეკვეთისას</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <Shield className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">დაცული გადახდა</h4>
                <p className="text-sm text-slate-500">100% უსაფრთხო</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <Clock className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">24/7 მხარდაჭერა</h4>
                <p className="text-sm text-slate-500">ყოველთვის ხელმისაწვდომი</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <Award className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">ხარისხის გარანტია</h4>
                <p className="text-sm text-slate-500">უკეთესი ფასები</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                const categoryId = category.id === 'all' ? null : category.id;
                console.log('🏷️ Category clicked:', category.name, 'ID:', categoryId);
                setSelectedCategory(categoryId);
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id || (selectedCategory === null && category.id === 'all')
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {categoryIcons[category.name] || <Package className="w-5 h-5" />}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900">
            {getCategoryName()}
          </h3>
          <Link href="/products">
            <button className="text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-1 group">
              ყველას ნახვა
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-slate-200 border-t-slate-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-20">
                <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400">პროდუქტები არ მოიძებნა</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Newsletter */}
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-3">მიიღე სიახლეები</h3>
          <p className="text-slate-300 mb-8">გამოიწერე და მიიღე განახლებები</p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="შენი ელ-ფოსტა"
              className="flex-1 px-6 py-4 rounded-l-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-500"
            />
            <button className="bg-white text-slate-900 px-8 py-4 rounded-r-lg font-semibold hover:bg-slate-50 transition">
              გამოწერა
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold text-slate-900 mb-4">E-Shop</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                საუკეთესო ონლაინ შოპინგი საქართველოში
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 mb-3 text-sm">ლინკები</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="text-slate-500 hover:text-slate-900 transition">პროდუქტები</Link></li>
                <li><Link href="/cart" className="text-slate-500 hover:text-slate-900 transition">კალათა</Link></li>
                <li><Link href="/profile" className="text-slate-500 hover:text-slate-900 transition">პროფილი</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 mb-3 text-sm">დახმარება</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-500 hover:text-slate-900 transition">კონტაქტი</a></li>
                <li><a href="#" className="text-slate-500 hover:text-slate-900 transition">მიწოდება</a></li>
                <li><a href="#" className="text-slate-500 hover:text-slate-900 transition">დაბრუნება</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 mb-3 text-sm">სოციალური</h5>
              <div className="flex gap-4 text-sm">
                <a href="#" className="text-slate-500 hover:text-slate-900 transition">Facebook</a>
                <a href="#" className="text-slate-500 hover:text-slate-900 transition">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
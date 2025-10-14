// frontend/app/checkout/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import useCartStore from '@/store/useCartStore';

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { clearCart } = useCartStore();

  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [notes, setNotes] = useState('');

  // Load checkout data
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadCheckoutData();
  }, [user]);

  const loadCheckoutData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/checkout`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setCheckoutData(result.data);
        
        // Pre-fill form with user data if available
        if (result.data.user) {
          setShippingForm(prev => ({
            ...prev,
            firstName: result.data.user.first_name || result.data.user.name?.split(' ')[0] || '',
            lastName: result.data.user.last_name || result.data.user.name?.split(' ')[1] || '',
            phone: result.data.user.phone || '',
            address: result.data.user.address || ''
          }));
        }
      } else {
        setError(result.message);
        if (result.message === 'კალათა ცარიელია') {
          setTimeout(() => router.push('/cart'), 2000);
        }
      }
    } catch (error) {
      console.error('Load checkout data error:', error);
      setError('Checkout მონაცემების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'phone', 'address', 'city'];
    
    for (let field of required) {
      if (!shippingForm[field].trim()) {
        setError(`გთხოვთ შეავსოთ ${getFieldLabel(field)}`);
        return false;
      }
    }

    if (!paymentMethod) {
      setError('გთხოვთ აირჩიოთ გადახდის მეთოდი');
      return false;
    }

    return true;
  };

  const getFieldLabel = (field) => {
    const labels = {
      firstName: 'სახელი',
      lastName: 'გვარი',
      phone: 'ტელეფონი',
      address: 'მისამართი',
      city: 'ქალაქი'
    };
    return labels[field] || field;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setProcessing(true);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
     const response = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingAddress: shippingForm,
          paymentMethod,
          notes
        })
      });

      const result = await response.json();

      if (result.success) {
        // Clear cart in store
        await clearCart();
        
        // Redirect to success page with order ID
        router.push(`/orders/${result.data.id}?success=true`);
      } else {
        setError(result.message);
        
        // If stock issues, reload checkout data
        if (result.data?.stockIssues) {
          loadCheckoutData();
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('შეკვეთის დამუშავება ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">ჩატვირთვა...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">შეცდომა</h2>
            <p className="text-red-600">{error || 'მონაცემები არ მოიძებნა'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">შეკვეთის დასრულება</h1>
          <p className="text-gray-600">შეავსეთ თქვენი მონაცემები და დაასრულეთ შეკვეთა</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">მიწოდების მისამართი</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      სახელი *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingForm.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      გვარი *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingForm.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ტელეფონი *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingForm.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    მისამართი *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingForm.address}
                    onChange={handleInputChange}
                    required
                    placeholder="ქუჩა, სახლის ნომერი"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ქალაქი *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingForm.city}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      საფოსტო კოდი
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingForm.postalCode}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">გადახდის მეთოდი</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">ნაღდი ფული მიწოდებისას</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">ბანკური გადარიცხვა</span>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">შეკვეთის შენიშვნები</h2>
                
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="დამატებითი ინსტრუქციები..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className={`w-full py-3 px-4 rounded-md text-white font-semibold ${
                  processing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition duration-200`}
              >
                {processing ? 'მუშავდება...' : 'შეკვეთის დასრულება'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">შეკვეთის დეტალები</h2>
              
              <div className="space-y-4">
                {checkoutData.items.map((item) => {
                  const product = item.product || item.Product || {};
                  const productName = product.name || 'უცნობი პროდუქტი';
                  const productPrice = parseFloat(product.price || 0);
                  const productImage = product.image_url || '/placeholder-product.png';
                  
                  return (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-product.png';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{productName}</h3>
                        <p className="text-sm text-gray-600">რაოდენობა: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-900">
                          ₾{(productPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">ქვეჯამი:</span>
                  <span className="font-semibold">₾{checkoutData.pricing.subtotal}</span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">მიწოდება:</span>
                  <span className="font-semibold">
                    {checkoutData.pricing.shipping === '0.00' || checkoutData.pricing.shipping === 0 
                      ? 'უფასო' 
                      : `₾${checkoutData.pricing.shipping}`}
                  </span>
                </div>
                
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">სულ:</span>
                    <span className="text-lg font-bold text-blue-600">₾{checkoutData.pricing.total}</span>
                  </div>
                </div>
              </div>
              
              {(checkoutData.pricing.shipping === '0.00' || checkoutData.pricing.shipping === 0) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-green-800">მიწოდება უფასოა 500 ლარზე მეტი შეკვეთისას თბილისში</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
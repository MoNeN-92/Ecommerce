// frontend/components/CookieBanner.jsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X, Settings } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    functional: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after 1 second
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(localStorage.getItem('cookiePreferences'));
        if (saved) {
          setPreferences(prev => ({ ...prev, ...saved }));
        }
      } catch (e) {
        console.error('Failed to load cookie preferences');
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    savePreferences(allAccepted);
  };

  const handleAcceptNecessary = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    savePreferences(onlyNecessary);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs) => {
    localStorage.setItem('cookieConsent', 'configured');
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    setShowBanner(false);
    setShowSettings(false);
    
    // Apply preferences
    applyPreferences(prefs);
  };

  const applyPreferences = (prefs) => {
    // Analytics
    if (prefs.analytics) {
      // Enable Google Analytics if you have it
      console.log('✅ Analytics enabled');
    } else {
      console.log('❌ Analytics disabled');
    }

    // Marketing
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('✅ Marketing enabled');
    } else {
      console.log('❌ Marketing disabled');
    }
  };

  const togglePreference = (key) => {
    if (key === 'necessary') return; // Can't disable necessary
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in" />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl z-50 animate-slide-up">
        {/* Settings View */}
        {showSettings ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Cookie პარამეტრები</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">აუცილებელი</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">სავალდებულო</span>
                  </div>
                  <p className="text-xs text-gray-600">ავთენტიფიკაცია, კალათა, უსაფრთხოება</p>
                </div>
                <div className="ml-3">
                  <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-not-allowed opacity-50">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">ფუნქციონალური</h4>
                  <p className="text-xs text-gray-600">ენა, თემა, შენახული ფილტრები</p>
                </div>
                <button
                  onClick={() => togglePreference('functional')}
                  className="ml-3"
                >
                  <div className={`w-10 h-6 rounded-full relative transition ${
                    preferences.functional ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.functional ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                  </div>
                </button>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">ანალიტიკა</h4>
                  <p className="text-xs text-gray-600">გვერდის ნახვები, მომხმარებლის ქცევა</p>
                </div>
                <button
                  onClick={() => togglePreference('analytics')}
                  className="ml-3"
                >
                  <div className={`w-10 h-6 rounded-full relative transition ${
                    preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.analytics ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                  </div>
                </button>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">მარკეტინგი</h4>
                  <p className="text-xs text-gray-600">რეკლამა, სოციალური მედია</p>
                </div>
                <button
                  onClick={() => togglePreference('marketing')}
                  className="ml-3"
                >
                  <div className={`w-10 h-6 rounded-full relative transition ${
                    preferences.marketing ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.marketing ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSavePreferences}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                შენახვა
              </button>
            </div>
          </div>
        ) : (
          /* Default Banner View */
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Cookie className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cookie ფაილებზე წვდომა
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  ჩვენ ვიყენებთ Cookie ფაილებს საიტის სწორად ფუნქციონირებისა და თქვენი გამოცდილების გასაუმჯობესებლად.
                  {' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    კონფიდენციალურობა
                  </Link>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleAcceptAll}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                ყველას მიღება
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleAcceptNecessary}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                >
                  აუცილებელი მხოლოდ
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm flex items-center justify-center gap-1"
                >
                  <Settings className="w-4 h-4" />
                  პარამეტრები
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
// frontend/components/auth/OAuthButtons.jsx
'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import Script from 'next/script';

const OAuthButtons = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Google Login
  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        login(data.user);
        router.push('/profile');
      } else {
        setError(data.message || 'Google login failed');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Facebook Login
  const handleFacebookLogin = () => {
    setLoading(true);
    setError('');

    window.FB.login(async (response) => {
      if (response.authResponse) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              accessToken: response.authResponse.accessToken,
              userID: response.authResponse.userID
            }),
          });

          const data = await res.json();

          if (data.success) {
            localStorage.setItem('token', data.token);
            login(data.user);
            router.push('/profile');
          } else {
            setError(data.message || 'Facebook login failed');
          }
        } catch (err) {
          console.error('Facebook login error:', err);
          setError('Facebook login failed. Please try again.');
        }
      } else {
        setError('Facebook login cancelled');
      }
      setLoading(false);
    }, { scope: 'email,public_profile' });
  };

  // Initialize Google
  const initializeGoogle = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleSuccess,
        auto_select: false,
      });
    }
  };

  // Initialize Facebook
  const initializeFacebook = () => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    };
  };

  return (
    <>
      {/* Load OAuth Scripts */}
      <Script 
        src="https://accounts.google.com/gsi/client"
        onLoad={initializeGoogle}
        strategy="afterInteractive"
      />
      <Script 
        src="https://connect.facebook.net/en_US/sdk.js"
        onLoad={initializeFacebook}
        strategy="afterInteractive"
      />

      <div className="space-y-3">
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">ან გაგრძელეთ</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => {
            if (window.google) {
              window.google.accounts.id.prompt();
            }
          }}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <FcGoogle className="w-5 h-5" />
              <span className="text-gray-700 font-medium">შესვლა Google-ით</span>
            </>
          )}
        </button>

        {/* Facebook Login Button */}
        <button
          type="button"
          onClick={handleFacebookLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-[#1877F2] text-white rounded-lg hover:bg-[#1665D8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <FaFacebook className="w-5 h-5" />
              <span className="font-medium">შესვლა Facebook-ით</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default OAuthButtons;
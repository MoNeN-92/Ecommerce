// frontend/components/auth/OAuthButtons.jsx
'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Script from 'next/script';

const OAuthButtons = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Google Login
  const handleGoogleSuccess = (response) => {
    setLoading(true);
    setError('');

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential: response.credential
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('token', data.token);
          // Don't call login() - it expects email/password, not user object
          // Instead, the page will refresh and checkAuthStatus will load the user
          window.location.href = '/profile';
        } else {
          setError(data.message || 'Google login failed');
        }
      })
      .catch(err => {
        console.error('Google login error:', err);
        setError('Google login failed. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
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
            // Don't call login() - it expects email/password, not user object
            // Instead, redirect and let checkAuthStatus load the user
            window.location.href = '/profile';
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
        cancel_on_tap_outside: true,
        itp_support: true,
      });
      
      // Render the button instead of using prompt
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { 
          theme: 'outline',
          size: 'large',
          width: 400,
          text: 'signin_with',
          locale: 'ka'
        }
      );
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

        {/* Google Login Button - Will be replaced by Google's button */}
        <div id="google-signin-button" className="w-full"></div>

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
              {/* Facebook "f" SVG Icon */}
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-medium">შესვლა Facebook-ით</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default OAuthButtons;

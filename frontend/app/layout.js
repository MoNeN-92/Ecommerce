// frontend/app/layout.js

import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/ui/CookieBanner';

const inter = Inter({ subsets: ['latin'] });

// ✅ SmallMall SEO Metadata
export const metadata = {
  title: {
    default: 'SmallMall - საუკეთესო ონლაინ შოპინგი საქართველოში',
    template: '%s | SmallMall'
  },
  description: 'SmallMall - თანამედროვე ონლაინ მაღაზია საუკეთესო ფასებით და სწრაფი მიწოდებით საქართველოში. შეიძინე ელექტრონიკა, მოდა, სახლის ნივთები და ბაღის პროდუქტები.',
  keywords: ['SmallMall', 'smallmall.ge', 'ონლაინ შოპინგი', 'ელექტრონიკა', 'მოდა', 'საქართველო', 'ონლაინ მაღაზია'],
  authors: [{ name: 'SmallMall' }],
  
  openGraph: {
    title: 'SmallMall - საუკეთესო ონლაინ შოპინგი',
    description: 'იყიდე უახლესი პროდუქტები საუკეთესო ფასებით SmallMall.ge-ზე',
    type: 'website',
    locale: 'ka_GE',
    url: 'https://smallmall.ge',
    siteName: 'SmallMall',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'SmallMall - საუკეთესო ონლაინ შოპინგი',
    description: 'იყიდე უახლესი პროდუქტები საუკეთესო ფასებით',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  
  other: {
    'theme-color': '#3b82f6',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ka">
      <head>
        <meta name="cookie-policy" content="/privacy" />
        <link rel="canonical" href="https://smallmall.ge" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
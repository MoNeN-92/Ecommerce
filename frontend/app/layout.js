// frontend/app/layout.js

import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

// ✅ SEO Metadata
export const metadata = {
  title: {
    default: 'E-Commerce Store - Best Online Shopping in Georgia',
    template: '%s | E-Commerce Store'
  },
  description: 'Modern e-commerce platform with best prices and fast delivery in Georgia. Shop electronics, fashion, home & garden products.',
  keywords: ['ecommerce', 'online shopping', 'georgia', 'buy online', 'shopping store'],
  authors: [{ name: 'E-Commerce Store' }],
  
  openGraph: {
    title: 'E-Commerce Store - Best Online Shopping',
    description: 'Shop the latest products with best prices',
    type: 'website',
    locale: 'ka_GE',
    url: 'https://yourstore.ge',
    siteName: 'E-Commerce Store',
  },
  
  robots: {
    index: true,
    follow: true,
  },
  
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
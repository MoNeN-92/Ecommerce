import type { ReactNode } from "react";
import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { JsonLd } from "@/components/seo/json-ld";
import { COMPANY_NAME, SITE_DESCRIPTION_EN, SITE_NAME } from "@/lib/site";
import "./globals.css";

const fontSans = Noto_Serif_Georgian({
  subsets: ["georgian"],
  variable: "--font-sans",
  display: "swap"
});

const fontDisplay = Noto_Sans_Georgian({
  subsets: ["georgian"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION_EN
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontDisplay.variable} bg-background font-sans text-foreground antialiased`}>
        <Providers>
          {children}
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: COMPANY_NAME,
              url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
              email: 'support@teqstore.ge',
              telephone: '+995555000111'
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

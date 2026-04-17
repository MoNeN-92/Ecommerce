import type { ReactNode } from "react";
import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { JsonLd } from "@/components/seo/json-ld";
import {
  COMPANY_IDENTIFIER,
  COMPANY_NAME,
  DEFAULT_LOCALE,
  SITE_DESCRIPTION_EN,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
  SUPPORTED_LOCALES
} from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION_EN,
  applicationName: SITE_NAME
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontDisplay.variable} bg-background font-sans text-foreground antialiased`}>
        <Providers>
          {children}
          <JsonLd
            data={[
              {
                "@context": "https://schema.org",
                "@type": "OnlineStore",
                name: SITE_NAME,
                legalName: COMPANY_NAME,
                url: SITE_URL,
                taxID: COMPANY_IDENTIFIER,
                email: SITE_EMAIL,
                telephone: SITE_PHONE,
                areaServed: "GE",
                knowsLanguage: SUPPORTED_LOCALES,
                acceptedPaymentMethod: [
                  "https://schema.org/CreditCard",
                  "https://schema.org/ByBankTransferInAdvance"
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  email: SITE_EMAIL,
                  telephone: SITE_PHONE,
                  contactType: "customer support",
                  areaServed: "GE",
                  availableLanguage: SUPPORTED_LOCALES
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: SITE_NAME,
                url: SITE_URL,
                inLanguage: SUPPORTED_LOCALES,
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${SITE_URL}/${DEFAULT_LOCALE}/search?q={search_term_string}`,
                  "query-input": "required name=search_term_string"
                }
              }
            ]}
          />
        </Providers>
      </body>
    </html>
  );
}

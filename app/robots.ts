import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const disallowPaths = [
  "/admin/",
  "/api/",
  "/auth/",
  "/ka/account",
  "/en/account",
  "/ka/cart",
  "/en/cart",
  "/ka/checkout",
  "/en/checkout",
  "/ka/wishlist",
  "/en/wishlist",
  "/ka/search",
  "/en/search",
  "/ka/order-confirmation/",
  "/en/order-confirmation/"
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowPaths
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "Google-Extended"],
        allow: ["/", "/llms.txt", "/sitemap.xml"],
        disallow: disallowPaths
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}

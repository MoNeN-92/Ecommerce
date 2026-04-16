import { SITE_DESCRIPTION_EN, SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const content = `# ${SITE_NAME}

> ${SITE_DESCRIPTION_EN} Public storefront content is available in Georgian (/ka) and English (/en).

This website is an ecommerce storefront focused on consumer electronics, audio, gadgets, and accessories in Georgia.

Important notes:
- Public catalog pages are localized under /ka and /en.
- Product, category, and catalog pages are the best sources for current storefront information.
- Admin, account, cart, checkout, and internal search pages are not intended as public reference material.

## Primary pages

- [Georgian homepage](${SITE_URL}/ka): Main storefront entry in Georgian.
- [English homepage](${SITE_URL}/en): Main storefront entry in English.
- [All products in Georgian](${SITE_URL}/ka/products): Main product catalog in Georgian.
- [All products in English](${SITE_URL}/en/products): Main product catalog in English.

## Key categories

- [Phones](${SITE_URL}/ka/category/phones): Smartphones and related devices.
- [Headphones](${SITE_URL}/ka/category/headphones): Audio products and headphones.
- [Chargers](${SITE_URL}/ka/category/chargers): Chargers, adapters, and cables.
- [Gadgets](${SITE_URL}/ka/category/gadgets): Smartwatches and general gadgets.

## Machine-readable files

- [robots.txt](${SITE_URL}/robots.txt): Crawl policy for bots.
- [sitemap.xml](${SITE_URL}/sitemap.xml): Indexable public URLs.

## Optional

- [Admin panel](${SITE_URL}/admin): Private administrative area, requires authentication.
- [Sign in](${SITE_URL}/auth/sign-in): Private authentication flow.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}

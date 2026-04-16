# TechStore Georgia

Production-oriented eCommerce scaffold for an electronics and accessories store serving Georgia with Georgian (`ka`) as the primary locale and English (`en`) as the secondary locale.

## Stack

- Next.js App Router with SSR/SSG hybrid pages
- PostgreSQL with Prisma ORM
- NextAuth credentials auth with JWT sessions
- Tailwind CSS + reusable UI primitives
- Zustand for cart, wishlist, and recently viewed state
- Stripe checkout abstraction with webhook handling
- Vercel-first deployment plus Docker support

## Folder Structure

```text
.
├─ app/
│  ├─ [locale]/
│  │  ├─ page.tsx
│  │  ├─ products/page.tsx
│  │  ├─ product/[slug]/page.tsx
│  │  ├─ category/[slug]/page.tsx
│  │  ├─ search/page.tsx
│  │  ├─ cart/page.tsx
│  │  ├─ checkout/page.tsx
│  │  ├─ wishlist/page.tsx
│  │  ├─ account/
│  │  │  ├─ page.tsx
│  │  │  ├─ orders/page.tsx
│  │  │  └─ addresses/page.tsx
│  │  └─ order-confirmation/[orderId]/page.tsx
│  ├─ admin/
│  │  ├─ page.tsx
│  │  ├─ products/
│  │  ├─ categories/page.tsx
│  │  └─ orders/page.tsx
│  ├─ auth/
│  │  ├─ sign-in/page.tsx
│  │  └─ register/page.tsx
│  ├─ api/
│  │  ├─ auth/
│  │  ├─ products/
│  │  ├─ categories/
│  │  ├─ cart/
│  │  ├─ checkout/
│  │  ├─ orders/
│  │  ├─ account/
│  │  ├─ wishlist/
│  │  ├─ admin/
│  │  └─ stripe/webhook/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ robots.ts
│  └─ sitemap.ts
├─ components/
│  ├─ admin/
│  ├─ auth/
│  ├─ cart/
│  ├─ checkout/
│  ├─ layout/
│  ├─ product/
│  ├─ seo/
│  └─ ui/
├─ lib/
│  ├─ auth/
│  ├─ db/
│  ├─ email/
│  ├─ i18n/
│  ├─ payments/
│  ├─ rate-limit/
│  ├─ seo/
│  ├─ services/
│  └─ validators/
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ store/
├─ Dockerfile
├─ docker-compose.yml
└─ .env.example
```

## Prisma Models

Core models implemented in `prisma/schema.prisma`:

- `User`
- `Category`
- `Product`
- `Address`
- `Order`
- `OrderItem`
- `Review`
- `WishlistItem`
- NextAuth support models: `Account`, `Session`, `VerificationToken`

Product schema supports:

- localized names and descriptions
- brand filtering
- JSON specs table
- stock tracking
- compare-at pricing
- featured flags
- image galleries
- localized SEO fields

## Setup

1. Install dependencies.
   `npm install`
2. Copy environment variables.
   `cp .env.example .env`
3. Start PostgreSQL locally or with Docker.
   `docker compose up -d postgres`
4. Generate the Prisma client and apply schema.
   `npm run prisma:generate`
   `npm run prisma:push`
5. Seed the database.
   `npm run seed`
6. Run the app.
   `npm run dev`

Seeded admin account after `npm run seed`:

- Email: `admin@teqstore.ge`
- Password: `Admin123!`

Change the seeded password immediately in any non-local environment.

## SEO Implementation

- Locale-aware metadata via `lib/seo/metadata.ts`
- Product JSON-LD and breadcrumb schema on product detail pages
- Organization schema in the root layout
- Clean localized URLs such as `/ka/product/iphone-15-pro-256gb`
- Dynamic `sitemap.xml`
- `robots.txt`
- SSR/SSG hybrid via server components and revalidation

## Payments

- Checkout API creates orders first, then initializes payment
- Stripe Checkout is used when Stripe keys are configured
- Fallback manual payment flow redirects to the internal confirmation page
- Stripe webhook marks orders as paid on `checkout.session.completed`

## Security

- Zod validation on auth, catalog, checkout, and account inputs
- Basic in-memory rate limiting for registration and checkout routes
- JWT sessions through NextAuth
- Prisma-based access checks for admin and account data
- Environment-variable based secret management

## Deployment

### Vercel

1. Import the repository into Vercel.
2. Provision PostgreSQL and set `DATABASE_URL`.
3. Set all variables from `.env.example`.
4. Configure a post-deploy step for Prisma:
   `npx prisma generate && npx prisma db push`
5. Add a Stripe webhook endpoint pointing to:
   `/api/stripe/webhook`

Use `npm run seed` only for initial sample data setup.

If you intentionally want a full reset before seeding, run:
`SEED_RESET=true npm run seed`

### Docker

1. Build the image.
   `docker build -t teq-store-ge .`
2. Run the stack.
   `docker compose up --build`

## Notes

- Wishlist server sync is enabled for signed-in users and local persistence is enabled for guests.
- Recently viewed products are persisted client-side through Zustand.
- SMTP email sending is optional and only activates when SMTP variables are configured.
- Image storage currently uses remote placeholders; swap to a real media bucket or upload pipeline before launch.

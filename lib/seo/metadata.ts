import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import {
  COMPANY_NAME,
  SITE_DESCRIPTION_EN,
  SITE_DESCRIPTION_KA,
  SITE_NAME,
  SITE_URL,
  SUPPORTED_LOCALES
} from "@/lib/site";
import { buildAbsoluteUrl } from "@/lib/utils";

function getLocaleDescription(locale: Locale) {
  return locale === "ka" ? SITE_DESCRIPTION_KA : SITE_DESCRIPTION_EN;
}

function getOpenGraphLocale(locale: Locale) {
  return locale === "ka" ? "ka_GE" : "en_US";
}

function stripLocaleFromPath(path: string, locale: Locale) {
  if (path === `/${locale}`) {
    return "";
  }

  if (path.startsWith(`/${locale}/`)) {
    return path.slice(locale.length + 1);
  }

  return path;
}

function buildLanguageAlternates(path: string, locale: Locale) {
  const sharedPath = stripLocaleFromPath(path, locale);

  return Object.fromEntries(
    SUPPORTED_LOCALES.map((entry) => [entry, buildAbsoluteUrl(`/${entry}${sharedPath}`)])
  );
}

type MetadataOptions = {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  images?: string[];
  noIndex?: boolean;
};

type OgImageOptions = {
  locale: Locale;
  title: string;
  description?: string;
  eyebrow?: string;
};

export function buildOgImageUrl({
  locale,
  title,
  description,
  eyebrow
}: OgImageOptions) {
  const params = new URLSearchParams({
    locale,
    title
  });

  if (description) {
    params.set("description", description);
  }

  if (eyebrow) {
    params.set("eyebrow", eyebrow);
  }

  return `${SITE_URL}/api/og?${params.toString()}`;
}

export function buildBaseMetadata(locale: Locale): Metadata {
  const description = getLocaleDescription(locale);
  const ogImage = buildOgImageUrl({
    locale,
    title: SITE_NAME,
    description,
    eyebrow: locale === "ka" ? "ტექნიკის ონლაინ მაღაზია" : "Electronics store"
  });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`
    },
    description,
    applicationName: SITE_NAME,
    authors: [{ name: COMPANY_NAME }],
    creator: COMPANY_NAME,
    publisher: COMPANY_NAME,
    category: "technology",
    keywords:
      locale === "ka"
        ? ["ტექნიკა", "ელექტრონიკა", "ონლაინ მაღაზია", "გაჯეტები", "აქსესუარები", "საქართველო"]
        : ["electronics", "gadgets", "accessories", "online store", "Georgia", "tech shop"],
    alternates: {
      canonical: buildAbsoluteUrl(`/${locale}`),
      languages: buildLanguageAlternates(`/${locale}`, locale)
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },
    openGraph: {
      title: SITE_NAME,
      description,
      siteName: SITE_NAME,
      locale: getOpenGraphLocale(locale),
      type: "website",
      url: buildAbsoluteUrl(`/${locale}`),
      images: [{ url: ogImage }]
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description,
      images: [ogImage]
    }
  };
}

export function buildPageMetadata({
  locale,
  title,
  description,
  path,
  keywords,
  images,
  noIndex = false
}: MetadataOptions): Metadata {
  const ogImage = buildOgImageUrl({
    locale,
    title,
    description,
    eyebrow: SITE_NAME
  });
  const allImages = [ogImage, ...(images ?? [])];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: buildAbsoluteUrl(path),
      languages: buildLanguageAlternates(path, locale)
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true
          }
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
          }
        },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      type: "website",
      locale: getOpenGraphLocale(locale),
      url: buildAbsoluteUrl(path),
      images: allImages.map((image) => ({
        url: image
      }))
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: allImages
    }
  };
}

export function buildProductMetadata({
  locale,
  title,
  description,
  path,
  images,
  keywords
}: Omit<MetadataOptions, "noIndex">) {
  return buildPageMetadata({
    locale,
    title,
    description,
    path,
    images,
    keywords
  });
}

export function buildNoIndexMetadata(title: string, description?: string): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true
      }
    }
  };
}

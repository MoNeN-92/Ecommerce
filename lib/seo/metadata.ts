import type { Metadata } from "next";
import { buildAbsoluteUrl } from "@/lib/utils";
import { SITE_DESCRIPTION_EN, SITE_DESCRIPTION_KA, SITE_NAME } from "@/lib/site";

export function buildBaseMetadata(locale: "ka" | "en"): Metadata {
  const description = locale === "ka" ? SITE_DESCRIPTION_KA : SITE_DESCRIPTION_EN;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`
    },
    description,
    applicationName: SITE_NAME,
    alternates: {
      canonical: buildAbsoluteUrl(`/${locale}`),
      languages: {
        ka: buildAbsoluteUrl("/ka"),
        en: buildAbsoluteUrl("/en")
      }
    },
    openGraph: {
      title: SITE_NAME,
      description,
      siteName: SITE_NAME,
      locale: locale === "ka" ? "ka_GE" : "en_US",
      type: "website",
      url: buildAbsoluteUrl(`/${locale}`)
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description
    }
  };
}

export function buildProductMetadata({
  title,
  description,
  path,
  images
}: {
  title: string;
  description: string;
  path: string;
  images?: string[];
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: buildAbsoluteUrl(path)
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: buildAbsoluteUrl(path),
      images: images?.map((image) => ({
        url: image
      }))
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images
    }
  };
}

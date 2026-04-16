const PRODUCT_PLACEHOLDER_IMAGE = "/placeholders/product.svg";
const CATEGORY_PLACEHOLDER_IMAGE = "/placeholders/category.svg";

type ImageKind = "product" | "category";

function getFallbackImage(kind: ImageKind) {
  return kind === "category" ? CATEGORY_PLACEHOLDER_IMAGE : PRODUCT_PLACEHOLDER_IMAGE;
}

function isLegacyPlaceholder(url: string) {
  return /^https?:\/\/placehold\.co/i.test(url);
}

export function normalizeImageUrl(url: string | null | undefined, kind: ImageKind = "product") {
  const value = url?.trim();

  if (!value || isLegacyPlaceholder(value)) {
    return getFallbackImage(kind);
  }

  return value;
}

export function normalizeImageList(urls: Array<string | null | undefined> | null | undefined, kind: ImageKind = "product") {
  const normalized = (urls ?? [])
    .map((url) => normalizeImageUrl(url, kind))
    .filter((url, index, array) => array.indexOf(url) === index);

  return normalized.length ? normalized : [getFallbackImage(kind)];
}

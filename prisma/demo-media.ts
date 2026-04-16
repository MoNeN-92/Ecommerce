export type DemoCategorySlug = "phones" | "headphones" | "chargers" | "gadgets";

type DemoMediaEntry = {
  categoryImage: string;
  productImages: string[];
};

// Central manifest for demo seed media.
// Replace these local placeholders with Cloudinary URLs later without touching seed logic.
const demoMedia: Record<DemoCategorySlug, DemoMediaEntry> = {
  phones: {
    categoryImage: "/placeholders/phones-category.svg",
    productImages: ["/placeholders/phones-product.svg"]
  },
  headphones: {
    categoryImage: "/placeholders/headphones-category.svg",
    productImages: ["/placeholders/headphones-product.svg"]
  },
  chargers: {
    categoryImage: "/placeholders/chargers-category.svg",
    productImages: ["/placeholders/chargers-product.svg"]
  },
  gadgets: {
    categoryImage: "/placeholders/gadgets-category.svg",
    productImages: ["/placeholders/gadgets-product.svg"]
  }
};

export function getDemoCategoryImage(categorySlug: DemoCategorySlug) {
  return demoMedia[categorySlug].categoryImage;
}

export function getDemoProductImages(categorySlug: DemoCategorySlug) {
  return demoMedia[categorySlug].productImages;
}

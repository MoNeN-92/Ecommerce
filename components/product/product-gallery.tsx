"use client";

import { useState } from "react";
import { RemoteImage } from "@/components/ui/remote-image";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const galleryImages = images.length ? images : ["/placeholders/product.svg"];
  const [active, setActive] = useState(galleryImages[0]);

  return (
    <div className="grid gap-4 xl:grid-cols-[96px_minmax(0,1fr)]">
      <div className="order-2 grid grid-cols-4 gap-3 sm:grid-cols-5 xl:order-1 xl:grid-cols-1">
        {galleryImages.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(image)}
            className={`overflow-hidden rounded-2xl border bg-white p-2 transition ${
              active === image ? "border-[#b98b52]/60 ring-2 ring-[#b98b52]/15" : "border-border"
            }`}
          >
            <RemoteImage src={image} alt={alt} width={200} height={200} sizes="96px" className="aspect-square w-full rounded-xl object-cover" />
          </button>
        ))}
      </div>
      <div className="order-1 overflow-hidden rounded-[2rem] border border-border bg-white p-3 sm:p-4 shadow-soft xl:order-2">
        <RemoteImage src={active} alt={alt} width={900} height={900} sizes="(max-width: 1279px) 100vw, 55vw" className="aspect-square w-full rounded-[1.5rem] object-cover" priority />
      </div>
    </div>
  );
}

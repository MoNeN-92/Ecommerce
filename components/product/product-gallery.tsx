"use client";

import { useState } from "react";
import { RemoteImage } from "@/components/ui/remote-image";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const galleryImages = images.length ? images : ["/placeholders/product.svg"];
  const [active, setActive] = useState(galleryImages[0]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-white p-4 shadow-soft">
        <RemoteImage src={active} alt={alt} width={900} height={900} sizes="(max-width: 1024px) 100vw, 55vw" className="aspect-square w-full rounded-[1.5rem] object-cover" priority />
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {galleryImages.map((image) => (
          <button key={image} type="button" onClick={() => setActive(image)} className="overflow-hidden rounded-2xl border border-border bg-white p-2">
            <RemoteImage src={image} alt={alt} width={200} height={200} sizes="25vw" className="aspect-square w-full rounded-xl object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

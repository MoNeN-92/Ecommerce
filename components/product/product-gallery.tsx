"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-white p-4 shadow-soft">
        <Image src={active} alt={alt} width={900} height={900} className="aspect-square w-full rounded-[1.5rem] object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image) => (
          <button key={image} type="button" onClick={() => setActive(image)} className="overflow-hidden rounded-2xl border border-border bg-white p-2">
            <Image src={image} alt={alt} width={200} height={200} className="aspect-square w-full rounded-xl object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

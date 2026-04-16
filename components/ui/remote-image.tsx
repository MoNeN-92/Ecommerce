import Image from "next/image";
import { normalizeImageUrl } from "@/lib/images";

export function RemoteImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  priority = false,
  kind = "product"
}: {
  src: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  kind?: "product" | "category";
}) {
  const normalizedSrc = normalizeImageUrl(src, kind);

  if (normalizedSrc.startsWith("http://") || normalizedSrc.startsWith("https://")) {
    return (
      <img
        src={normalizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={normalizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}

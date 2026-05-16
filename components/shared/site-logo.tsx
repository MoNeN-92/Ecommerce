import Image from "next/image";

type SiteLogoProps = {
  className?: string;
  priority?: boolean;
  variant?: "full" | "mark";
};

export function SiteLogo({ className, priority = false, variant = "full" }: SiteLogoProps) {
  const src = variant === "mark" ? "/images/site-logo-mark.png" : "/images/a81ebfba-9ba6-4a41-aba7-8eb766f752f6.jpeg";
  const alt = "Joker Shops";
  const width = variant === "mark" ? 512 : 961;
  const height = variant === "mark" ? 512 : 624;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}

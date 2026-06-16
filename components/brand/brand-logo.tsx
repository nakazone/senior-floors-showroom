"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  onClick?: () => void;
  variant?: "header" | "footer";
  showStudioLabel?: boolean;
}

export function BrandLogo({
  className,
  imageClassName,
  onClick,
  variant = "header",
  showStudioLabel = true,
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);
  const height = variant === "footer" ? 128 : 80;

  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 flex-col items-start no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
        className,
      )}
    >
      {!imageError ? (
        <Image
          src={brand.logo.localPath}
          alt={brand.logo.alt}
          width={120}
          height={height}
          priority={variant === "header"}
          onError={() => setImageError(true)}
          className={cn(
            "w-auto object-contain",
            variant === "footer" ? "h-28 md:h-32" : "h-14 md:h-20",
            imageClassName,
          )}
        />
      ) : (
        <span
          className={cn(
            "font-semibold tracking-wide text-white",
            variant === "footer" ? "text-3xl" : "text-xl md:text-2xl",
          )}
        >
          Senior Floors
        </span>
      )}
      {showStudioLabel ? (
        <small className="mt-0.5 text-[10px] font-semibold tracking-[0.2em] text-secondary uppercase">
          Studio Showroom
        </small>
      ) : null}
    </Link>
  );
}

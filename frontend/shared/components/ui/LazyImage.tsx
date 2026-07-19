"use client";

import * as React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/src/lib/utils";

interface LazyImageProps extends Omit<ImageProps, "loading"> {
  /** Wrapper div className */
  wrapperClassName?: string;
  /** Show a blur placeholder while loading. Default: true */
  showBlur?: boolean;
  /** Fallback src to display if the main image fails to load */
  fallbackSrc?: string;
}

/**
 * Opinionated wrapper around next/image with:
 * - Lazy loading by default
 * - Blur placeholder
 * - Error fallback
 * - Consistent aspect-ratio wrapper
 *
 * Usage:
 *   <LazyImage src="/photo.jpg" alt="A photo" width={400} height={300} />
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  wrapperClassName,
  showBlur = true,
  fallbackSrc = "/placeholder.png",
  ...rest
}: LazyImageProps) {
  const [imgSrc, setImgSrc] = React.useState<ImageProps["src"]>(src);

  // Reset if `src` prop changes
  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        placeholder={showBlur ? "blur" : undefined}
        blurDataURL={
          showBlur
            ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4="
            : undefined
        }
        onError={() => setImgSrc(fallbackSrc)}
        className={cn("object-cover", className)}
        {...rest}
      />
    </div>
  );
}

export default LazyImage;

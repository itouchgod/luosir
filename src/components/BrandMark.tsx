import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactElement } from "react";

type BrandMarkProps = ComponentPropsWithoutRef<"span"> & {
  readonly size?: number;
  readonly priority?: boolean;
};

export function BrandMark({
  size = 40,
  priority = false,
  className = "",
  style,
  ...props
}: BrandMarkProps): ReactElement {
  return (
    <span
      {...props}
      className={`brand-mark relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-black ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      <Image
        src="/brand/logo-dark.png"
        alt="Luo Sir logo"
        width={size}
        height={size}
        priority={priority}
        loading={priority ? undefined : "eager"}
        className="brand-mark__image brand-mark__image--dark absolute inset-0 h-full w-full object-cover"
      />
      <Image
        src="/brand/logo-light.png"
        alt="Luo Sir logo"
        width={size}
        height={size}
        priority={priority}
        loading={priority ? undefined : "eager"}
        className="brand-mark__image brand-mark__image--light absolute inset-0 h-full w-full object-cover"
      />
    </span>
  );
}

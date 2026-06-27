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
  ...props
}: BrandMarkProps): ReactElement {
  return (
    <span
      {...props}
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-black shadow-[0_0_28px_rgba(124,58,237,0.28)] ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/logo-dark.png"
        alt="Luo Sir logo"
        width={size}
        height={size}
        priority={priority}
        loading={priority ? undefined : "eager"}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

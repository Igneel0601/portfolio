import type { AnchorHTMLAttributes, ReactNode } from "react";

type BtnVariant = "default" | "solid" | "term";

type BtnProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: BtnVariant;
  children: ReactNode;
};

export function Btn({
  variant = "default",
  className = "",
  children,
  ...rest
}: BtnProps) {
  const variantClass = variant === "default" ? "" : ` ${variant}`;
  const extra = className ? ` ${className}` : "";
  return (
    <a className={`btn${variantClass}${extra}`} {...rest}>
      {children}
    </a>
  );
}

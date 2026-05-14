import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

// motion-spec.md §Locked decisions item 3 — 16:10 lock, no exceptions.
export function ProjectImage({ src, alt, priority = false, sizes = "(max-width: 768px) 100vw, 60vw", className = "" }: Props) {
  return (
    <div className={`relative w-full overflow-hidden rounded-md ${className}`} style={{ aspectRatio: "16 / 10" }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}

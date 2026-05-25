"use client";

import { useEffect, useRef, useState } from "react";
import type { PanzoomObject } from "@panzoom/panzoom";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, X } from "lucide-react";

export function ZoomableImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [open, setOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const pzRef = useRef<PanzoomObject | null>(null);

  useEffect(() => {
    if (!open) return;
    // browser stops dispatching `mousemove` to document while pointer is
    // captured by panzoom — keep the site's custom cursor following via
    // pointermove instead.
    const cursor = document.getElementById("custom-cursor");
    if (!cursor) return;
    const onPointerMove = (e: PointerEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };
    document.addEventListener("pointermove", onPointerMove);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !imgRef.current) return;
    let cancelled = false;
    let cleanupWheel: (() => void) | null = null;
    (async () => {
      const Panzoom = (await import("@panzoom/panzoom")).default;
      if (cancelled || !imgRef.current) return;
      const img = imgRef.current;
      const parent = img.parentElement!;

      if (!img.complete || !img.naturalWidth) {
        await new Promise<void>((resolve) => {
          const onLoad = () => {
            img.removeEventListener("load", onLoad);
            resolve();
          };
          img.addEventListener("load", onLoad);
        });
        if (cancelled) return;
      }

      const pz = Panzoom(img, {
        maxScale: 6,
        minScale: 0.5,
        step: 0.3,
        animate: false,
        cursor: "grab",
      });
      pzRef.current = pz;

      const wheelHandler = (e: WheelEvent) => {
        pz.zoomWithWheel(e);
      };
      parent.addEventListener("wheel", wheelHandler, { passive: false });
      cleanupWheel = () => parent.removeEventListener("wheel", wheelHandler);
    })();
    return () => {
      cancelled = true;
      cleanupWheel?.();
      pzRef.current?.destroy();
      pzRef.current = null;
    };
  }, [open]);

  const zoomIn = () => pzRef.current?.zoomIn({ animate: true, duration: 150 });
  const zoomOut = () => pzRef.current?.zoomOut({ animate: true, duration: 150 });
  const reset = () => pzRef.current?.reset({ animate: true, duration: 200 });

  return (
    <>
      <button
        type="button"
        className="cs-arch-trigger no-pop"
        onClick={() => setOpen(true)}
        aria-label="open diagram in fullscreen"
      >
        <img src={src} alt={alt} />
        <span className="cs-arch-expand-hint c-xs">
          <Maximize2 className="i-sm i-bold" aria-hidden /> click to explore
        </span>
      </button>

      {open && (
        <div
          className="cs-arch-modal"
          role="dialog"
          aria-modal="true"
          onPointerDown={(e) => {
            // only close if the press started directly on the backdrop
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="cs-arch-modal-inner" onClick={(e) => e.stopPropagation()}>
            <div className="cs-arch-toolbar">
              <button type="button" className="no-pop" onClick={zoomIn} aria-label="zoom in">
                <ZoomIn className="i-sm i-bold" />
              </button>
              <button type="button" className="no-pop" onClick={zoomOut} aria-label="zoom out">
                <ZoomOut className="i-sm i-bold" />
              </button>
              <button type="button" className="no-pop" onClick={reset} aria-label="reset">
                <RotateCcw className="i-sm i-bold" />
              </button>
              <button
                type="button"
                className="cs-arch-close no-pop"
                onClick={() => setOpen(false)}
                aria-label="close"
              >
                <X className="i-sm i-bold" />
              </button>
            </div>
            <div className="cs-arch-canvas">
              <img
                ref={imgRef}
                src={src}
                alt={alt}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

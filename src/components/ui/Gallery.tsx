import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ProjectImage } from "@/content/projectCatalog";
import { thumbOf } from "@/content/projectCatalog";
import { lockScroll } from "@/lib/smoothScroll";

const url = (src: string) => `${import.meta.env.BASE_URL}${src}`;

/** Thumbnail grid; clicking opens a full-size lightbox (Esc / ← / → to navigate). */
export function Gallery({ images }: { images: ProjectImage[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [isOpen, close, step]);

  if (!images.length) return null;
  const cur = open === null ? null : images[open];

  return (
    <>
      <div className="gallery">
        {images.map((im, i) => (
          <figure key={im.src} className="gallery__item">
            <button type="button" className="gallery__btn" onClick={() => setOpen(i)} aria-label={`Enlarge: ${im.alt}`} data-cursor="VIEW">
              <img src={url(thumbOf(im.src))} alt={im.alt} loading="lazy" decoding="async" />
            </button>
            <figcaption>{im.caption}</figcaption>
          </figure>
        ))}
      </div>
      {cur
        ? createPortal(
            <div className="lightbox" role="dialog" aria-modal="true" aria-label={cur.alt} onClick={close}>
              <figure className="lightbox__fig" onClick={(e) => e.stopPropagation()}>
                <img src={url(cur.src)} alt={cur.alt} />
                <figcaption>
                  <span>{cur.caption}</span>
                  <span className="lightbox__count">
                    {open! + 1} / {images.length}
                  </span>
                </figcaption>
              </figure>
              {images.length > 1 ? (
                <>
                  <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label="Previous image" onClick={(e) => (e.stopPropagation(), step(-1))}>
                    ←
                  </button>
                  <button type="button" className="lightbox__nav lightbox__nav--next" aria-label="Next image" onClick={(e) => (e.stopPropagation(), step(1))}>
                    →
                  </button>
                </>
              ) : null}
              <button type="button" className="lightbox__close" aria-label="Close" onClick={close}>
                ×
              </button>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  variant: "hero" | "portrait" | "live-large" | "live" | "history" | "history-natural";
  priority?: boolean;
  caption?: string;
  openLabel: string;
  width?: number;
  height?: number;
};

type GalleryLightboxLabels = {
  dialogLabel: string;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
};

type GalleryNarrative = {
  contemporaryTitle: string;
  contemporaryText: string;
  historyKicker: string;
  historyTitle: string;
  historyText: string;
};

type GalleryLightboxProps = {
  items: GalleryItem[];
  narrative: GalleryNarrative;
  labels: GalleryLightboxLabels;
};

export default function GalleryLightbox({ items, narrative, labels }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  const isOpen = activeIndex !== null;
  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  const hasMultipleItems = items.length > 1;
  const heroItem = items[0];
  const portraitItems = items.slice(1, 3);
  const liveItems = items.slice(3, 5);
  const historyItems = items.slice(5, 8);
  const storyItems = items.slice(8);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    lastFocusedElementRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveIndex(null);
        return;
      }

      if (!hasMultipleItems) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) => {
          if (current === null) {
            return current;
          }

          return (current + 1) % items.length;
        });
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) => {
          if (current === null) {
            return current;
          }

          return (current - 1 + items.length) % items.length;
        });
      }

      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) {
          return;
        }

        const focusableElements = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );

        if (focusableElements.length === 0) {
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (event.shiftKey && activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
          return;
        }

        if (!event.shiftKey && activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      lastFocusedElementRef.current?.focus();
    };
  }, [hasMultipleItems, isOpen, items.length]);

  function closeLightbox() {
    setActiveIndex(null);
  }

  function showPrevious() {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return (current - 1 + items.length) % items.length;
    });
  }

  function showNext() {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return (current + 1) % items.length;
    });
  }

  function renderItemButton(item: GalleryItem, index: number) {
    const isNaturalHistory = item.variant === "history-natural" && item.width && item.height;

    return (
      <button
        key={item.id}
        type="button"
        className="gallery-media-button"
        aria-label={item.openLabel}
        onClick={() => setActiveIndex(index)}
      >
        {isNaturalHistory ? (
          <span className="gallery-media-card gallery-media-card-history-natural">
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              loading="lazy"
              sizes="(max-width: 760px) calc(100vw - 72px), (max-width: 1100px) calc((100vw - 120px) / 2), calc((100vw - 160px) / 3)"
              className="gallery-media-natural-image w-full h-auto"
            />
          </span>
        ) : (
          <span className={`gallery-media-card gallery-media-card-${item.variant}`}>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              priority={item.priority}
              sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 72px), 1100px"
            />
          </span>
        )}
      </button>
    );
  }

  return (
    <>
      <div className="gallery-narrative" aria-label={labels.dialogLabel}>
        <div className="gallery-hero">{heroItem ? renderItemButton(heroItem, 0) : null}</div>

        <div className="gallery-contemporary-copy">
          <h3>{narrative.contemporaryTitle}</h3>
          <p>{narrative.contemporaryText}</p>
        </div>

        <div className="gallery-portraits-grid">
          {portraitItems.map((item, index) => renderItemButton(item, index + 1))}
        </div>

        <div className="gallery-live-grid">
          {liveItems.map((item, index) => renderItemButton(item, index + 3))}
        </div>

        <article className="gallery-history-block" aria-labelledby="gallery-history-title">
          <p className="gallery-history-kicker">{narrative.historyKicker}</p>
          <h3 id="gallery-history-title">{narrative.historyTitle}</h3>
          <p className="gallery-history-text">{narrative.historyText}</p>

          <div className="gallery-history-grid">
            {historyItems.map((item, index) => renderItemButton(item, index + 5))}
          </div>

          <div className="gallery-history-grid gallery-history-grid-story">
            {storyItems.map((item, index) => (
              <div key={item.id} className="gallery-history-card">
                {renderItemButton(item, index + 8)}
                {item.caption ? <h4 className="gallery-history-caption">{item.caption}</h4> : null}
              </div>
            ))}
          </div>
        </article>
      </div>

      {isOpen && activeItem && (
        <div
          ref={dialogRef}
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={labels.dialogLabel}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <div className="gallery-lightbox-inner">
            <div className="gallery-lightbox-toolbar">
              {hasMultipleItems && (
                <div className="gallery-lightbox-nav">
                  <button type="button" onClick={showPrevious} aria-label={labels.previousLabel}>
                    <span aria-hidden="true">‹</span>
                  </button>
                  <button type="button" onClick={showNext} aria-label={labels.nextLabel}>
                    <span aria-hidden="true">›</span>
                  </button>
                </div>
              )}

              <button
                ref={closeButtonRef}
                type="button"
                className="gallery-lightbox-close"
                onClick={closeLightbox}
                aria-label={labels.closeLabel}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="gallery-lightbox-frame">
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                fill
                sizes="100vw"
                className="gallery-lightbox-image"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

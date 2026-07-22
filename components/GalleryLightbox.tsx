"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  onOpen?: () => void;
};

export default function GalleryLightbox({
  items,
  narrative,
  labels,
  onOpen,
}: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const hasLightboxHistoryEntryRef = useRef(false);
  const ignoreNextPopStateRef = useRef(false);
  const isOpenRef = useRef(false);
  const mouseDragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    panX: number;
    panY: number;
  } | null>(null);
  const touchPanStartRef = useRef<{
    touchX: number;
    touchY: number;
    panX: number;
    panY: number;
  } | null>(null);
  const pinchStartRef = useRef<{
    distance: number;
    zoom: number;
  } | null>(null);
  const lastTapTimeRef = useRef(0);

  const activeItem = activeIndex !== null ? (items[activeIndex] ?? null) : null;
  const isOpen = activeItem !== null;
  const hasMultipleItems = items.length > 1;
  const leadItem = items[0] ?? null;
  const portraitItems = items.slice(1, 3);
  const liveItems = items.slice(3, 5);
  const historyItems = items.slice(5, 8);
  const storyItems = items.slice(8);

  const minZoom = 1;
  const maxZoom = 4;

  const clampZoom = useCallback((value: number) => {
    return Math.min(maxZoom, Math.max(minZoom, value));
  }, [maxZoom, minZoom]);

  const resetZoomState = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    mouseDragStartRef.current = null;
    touchPanStartRef.current = null;
    pinchStartRef.current = null;
  }, []);

  const applyZoom = useCallback((nextZoom: number) => {
    setZoom((currentZoom) => {
      const clampedZoom = clampZoom(nextZoom);

      if (clampedZoom === minZoom && currentZoom !== minZoom) {
        setPan({ x: 0, y: 0 });
      }

      return clampedZoom;
    });
  }, [clampZoom, minZoom]);

  const increaseZoom = useCallback(() => {
    setZoom((currentZoom) => {
      const nextZoom = clampZoom(currentZoom + 0.25);
      return nextZoom;
    });
  }, [clampZoom]);

  const decreaseZoom = useCallback(() => {
    setZoom((currentZoom) => {
      const nextZoom = clampZoom(currentZoom - 0.25);

      if (nextZoom === minZoom && currentZoom !== minZoom) {
        setPan({ x: 0, y: 0 });
      }

      return nextZoom;
    });
  }, [clampZoom, minZoom]);

  const closeLightbox = useCallback(() => {
    if (!isOpen) {
      return;
    }

    resetZoomState();

    const shouldSyncHistory = hasLightboxHistoryEntryRef.current;

    hasLightboxHistoryEntryRef.current = false;
    setActiveIndex(null);

    if (shouldSyncHistory) {
      ignoreNextPopStateRef.current = true;
      window.history.back();
    }
  }, [isOpen, resetZoomState]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || hasLightboxHistoryEntryRef.current) {
      return;
    }

    hasLightboxHistoryEntryRef.current = true;
    window.history.pushState(
      {
        ...(window.history.state ?? {}),
        galleryLightboxOpen: true,
      },
      "",
    );
  }, [isOpen]);

  useEffect(() => {
    function handlePopState() {
      if (ignoreNextPopStateRef.current) {
        ignoreNextPopStateRef.current = false;
        return;
      }

      if (!hasLightboxHistoryEntryRef.current || !isOpenRef.current) {
        return;
      }

      hasLightboxHistoryEntryRef.current = false;
      setActiveIndex(null);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;
    const scrollY = window.scrollY;

    lastFocusedElementRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
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
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.removeEventListener("keydown", handleKeyDown);
      lastFocusedElementRef.current?.focus();
      window.scrollTo(0, scrollY);
    };
  }, [closeLightbox, hasMultipleItems, isOpen, items.length]);

  function showPrevious() {
    resetZoomState();
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return (current - 1 + items.length) % items.length;
    });
  }

  function showNext() {
    resetZoomState();
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return (current + 1) % items.length;
    });
  }

  function openLightboxAt(index: number) {
    if (index < 0 || index >= items.length) {
      return;
    }

    resetZoomState();
    setActiveIndex(index);
    onOpen?.();
  }

  function renderItemButton(item: GalleryItem, index: number) {
    const isNaturalHistory = item.variant === "history-natural" && item.width && item.height;

    return (
      <button
        key={item.id}
        type="button"
        className="gallery-media-button"
        aria-label={item.openLabel}
        onClick={() => openLightboxAt(index)}
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

  function getTouchDistance(
    firstTouch: { clientX: number; clientY: number },
    secondTouch: { clientX: number; clientY: number },
  ) {
    const deltaX = firstTouch.clientX - secondTouch.clientX;
    const deltaY = firstTouch.clientY - secondTouch.clientY;
    return Math.hypot(deltaX, deltaY);
  }

  function handleLightboxMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (zoom <= 1 || event.button !== 0) {
      return;
    }

    event.preventDefault();
    setIsDragging(true);
    mouseDragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  }

  function handleLightboxMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!isDragging || !mouseDragStartRef.current) {
      return;
    }

    event.preventDefault();
    const deltaX = event.clientX - mouseDragStartRef.current.pointerX;
    const deltaY = event.clientY - mouseDragStartRef.current.pointerY;
    setPan({
      x: mouseDragStartRef.current.panX + deltaX,
      y: mouseDragStartRef.current.panY + deltaY,
    });
  }

  function stopMouseDrag() {
    setIsDragging(false);
    mouseDragStartRef.current = null;
  }

  function handleLightboxWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.2 : -0.2;
    applyZoom(zoom + delta);
  }

  function handleLightboxDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();

    if (zoom > 1) {
      resetZoomState();
      return;
    }

    applyZoom(2);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (event.touches.length === 2) {
      const distance = getTouchDistance(event.touches[0], event.touches[1]);
      pinchStartRef.current = {
        distance,
        zoom,
      };
      touchPanStartRef.current = null;
      return;
    }

    if (event.touches.length !== 1) {
      return;
    }

    const now = Date.now();
    if (now - lastTapTimeRef.current < 280) {
      if (zoom > 1) {
        resetZoomState();
      } else {
        applyZoom(2);
      }
      lastTapTimeRef.current = 0;
      return;
    }

    lastTapTimeRef.current = now;

    if (zoom > 1) {
      touchPanStartRef.current = {
        touchX: event.touches[0].clientX,
        touchY: event.touches[0].clientY,
        panX: pan.x,
        panY: pan.y,
      };
      setIsDragging(true);
    }
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (event.touches.length === 2 && pinchStartRef.current) {
      event.preventDefault();
      const distance = getTouchDistance(event.touches[0], event.touches[1]);
      const ratio = distance / pinchStartRef.current.distance;
      applyZoom(pinchStartRef.current.zoom * ratio);
      return;
    }

    if (event.touches.length === 1 && touchPanStartRef.current && zoom > 1) {
      event.preventDefault();
      const deltaX = event.touches[0].clientX - touchPanStartRef.current.touchX;
      const deltaY = event.touches[0].clientY - touchPanStartRef.current.touchY;
      setPan({
        x: touchPanStartRef.current.panX + deltaX,
        y: touchPanStartRef.current.panY + deltaY,
      });
    }
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (event.touches.length < 2) {
      pinchStartRef.current = null;
    }

    if (event.touches.length === 0) {
      touchPanStartRef.current = null;
      setIsDragging(false);
    }
  }

  const lightboxPortal =
    typeof document !== "undefined" && isOpen && activeItem
      ? createPortal(
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
            {hasMultipleItems && (
              <div className="gallery-lightbox-nav">
                <button
                  type="button"
                  className="gallery-lightbox-prev"
                  onClick={showPrevious}
                  aria-label={labels.previousLabel}
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  type="button"
                  className="gallery-lightbox-next"
                  onClick={showNext}
                  aria-label={labels.nextLabel}
                >
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
              title={labels.closeLabel}
            >
              <span aria-hidden="true">×</span>
            </button>

            <div className="gallery-lightbox-zoom-controls" aria-label="Zoom controls">
              <button
                type="button"
                onClick={decreaseZoom}
                aria-label="Zoom out"
                disabled={zoom <= minZoom}
              >
                <span aria-hidden="true">−</span>
              </button>
              <button
                type="button"
                onClick={increaseZoom}
                aria-label="Zoom in"
                disabled={zoom >= maxZoom}
              >
                <span aria-hidden="true">+</span>
              </button>
            </div>

            <div className="gallery-lightbox-inner">
              <div
                ref={frameRef}
                className={zoom > 1 ? "gallery-lightbox-frame gallery-lightbox-frame-zoomed" : "gallery-lightbox-frame"}
                onWheel={handleLightboxWheel}
                onDoubleClick={handleLightboxDoubleClick}
                onMouseDown={handleLightboxMouseDown}
                onMouseMove={handleLightboxMouseMove}
                onMouseUp={stopMouseDrag}
                onMouseLeave={stopMouseDrag}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  sizes="100vw"
                  className="gallery-lightbox-image"
                  style={{
                    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: isDragging ? "none" : "transform 160ms ease",
                  }}
                />
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="gallery-lead">
        {leadItem ? renderItemButton(leadItem, 0) : null}
      </div>

      <div className="gallery-narrative" aria-label={labels.dialogLabel}>
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

      {lightboxPortal}
    </>
  );
}

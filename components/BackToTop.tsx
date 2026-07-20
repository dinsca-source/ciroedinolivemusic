"use client";

import { useEffect, useRef, useState } from "react";

type BackToTopProps = {
  ariaLabel: string;
  targetId?: string;
};

const SHOW_OFFSET = 620;

export default function BackToTop({ ariaLabel, targetId = "home" }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const internalNavIntentAwayRef = useRef(false);

  useEffect(() => {
    function updateState() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const currentHash = window.location.hash.toLowerCase();
      const hasNonHomeHash = currentHash !== "" && currentHash !== "#home";
      const isAwayFromHome =
        scrollTop > SHOW_OFFSET || hasNonHomeHash || internalNavIntentAwayRef.current;

      setIsVisible(isAwayFromHome);

      if (!hasNonHomeHash && scrollTop <= SHOW_OFFSET) {
        internalNavIntentAwayRef.current = false;
      }

      const footer = document.querySelector(".site-footer") as HTMLElement | null;
      if (!footer) {
        setIsNearFooter(false);
        return;
      }

      const footerTop = footer.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      setIsNearFooter(footerTop < viewportHeight - 24);
    }

    function scheduleUpdate() {
      window.requestAnimationFrame(updateState);
    }

    function handleInternalAnchorClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) {
        return;
      }

      const anchor = event.target.closest("a[href^='#']");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      const rawHash = anchor.getAttribute("href");
      if (!rawHash || rawHash === "#") {
        return;
      }

      const normalizedHash = rawHash.toLowerCase();
      const isHomeTarget = normalizedHash === "#home";

      internalNavIntentAwayRef.current = !isHomeTarget;
      setIsVisible(!isHomeTarget);
      scheduleUpdate();
    }

    updateState();
    scheduleUpdate();
    const delayedCheck = window.setTimeout(scheduleUpdate, 60);

    window.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    window.addEventListener("hashchange", scheduleUpdate);
    window.addEventListener("popstate", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    document.addEventListener("click", handleInternalAnchorClick, true);

    return () => {
      window.clearTimeout(delayedCheck);
      window.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
      window.removeEventListener("hashchange", scheduleUpdate);
      window.removeEventListener("popstate", scheduleUpdate);
      window.removeEventListener("pageshow", scheduleUpdate);
      document.removeEventListener("click", handleInternalAnchorClick, true);
    };
  }, []);

  function handleClick() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth";
    const target = document.getElementById(targetId);

    internalNavIntentAwayRef.current = false;
    setIsVisible(false);

    if (window.location.hash && window.location.hash.toLowerCase() !== "#home") {
      const cleanUrl = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, "", cleanUrl);
    }

    if (target) {
      target.scrollIntoView({ behavior, block: "start" });
      return;
    }

    window.scrollTo({ top: 0, behavior });
  }

  const className = [
    "back-to-top",
    isVisible ? "back-to-top-visible" : "",
    isNearFooter ? "back-to-top-near-footer" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 6l-6 6 1.6 1.6 3.3-3.3V18h2.2v-7.7l3.3 3.3L18 12z" fill="currentColor" />
      </svg>
    </button>
  );
}

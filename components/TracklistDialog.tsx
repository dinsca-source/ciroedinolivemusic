"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  title: string;
  tracklist: string[];
  onClose: () => void;
  labels: {
    dialogLabel: string;
    closeLabel: string;
    exportLabel: string;
    tracklistHeading: string;
  };
};

function buildExportFilename(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
    + "-tracklist.txt"
  );
}

function buildExportContent(title: string, tracklist: string[]): string {
  const numbered = tracklist
    .map((track, index) => {
      const n = String(index + 1).padStart(3, "0");

      return `${n} - ${track}`;
    })
    .join("\n");

  return `${title}\n\n${numbered}\n\nCiro & Dino Live Music`;
}

export default function TracklistDialog({
  isOpen,
  title,
  tracklist,
  onClose,
  labels,
}: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    closeBtnRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  function handleExport() {
    const content = buildExportContent(title, tracklist);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = buildExportFilename(title);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="tracklist-modal-backdrop"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <section
        className="tracklist-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracklist-modal-title"
      >
        <div className="tracklist-modal-header">
          <h2 className="tracklist-modal-title" id="tracklist-modal-title">
            {labels.tracklistHeading}
          </h2>
          <h3 className="tracklist-modal-subtitle">{title}</h3>
          <button
            ref={closeBtnRef}
            type="button"
            className="tracklist-modal-close"
            onClick={onClose}
            aria-label={labels.closeLabel}
          >
            ✕
          </button>
        </div>

        <ol className="tracklist-list">
          {tracklist.map((track) => (
            <li key={track}>{track}</li>
          ))}
        </ol>

        <div className="tracklist-modal-footer">
          <button
            type="button"
            className="tracklist-export-btn"
            onClick={handleExport}
          >
            {labels.exportLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}

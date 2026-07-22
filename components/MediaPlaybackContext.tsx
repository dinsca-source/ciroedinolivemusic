"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
} from "react";
import type { ReactNode } from "react";

type PauseFn = () => void;

type RegistryEntry = {
  pause: PauseFn;
};

type MediaPlaybackContextValue = {
  register: (id: string, pauseFn: PauseFn) => void;
  unregister: (id: string) => void;
  notifyPlaying: (id: string) => void;
};

const MediaPlaybackContext = createContext<MediaPlaybackContextValue | null>(null);

export function MediaPlaybackProvider({ children }: { children: ReactNode }) {
  const registryRef = useRef<Map<string, RegistryEntry>>(new Map());

  const register = useCallback((id: string, pauseFn: PauseFn) => {
    registryRef.current.set(id, { pause: pauseFn });
  }, []);

  const unregister = useCallback((id: string) => {
    registryRef.current.delete(id);
  }, []);

  const notifyPlaying = useCallback((id: string) => {
    registryRef.current.forEach((entry, entryId) => {
      if (entryId !== id) {
        entry.pause();
      }
    });
  }, []);

  return (
    <MediaPlaybackContext.Provider value={{ register, unregister, notifyPlaying }}>
      {children}
    </MediaPlaybackContext.Provider>
  );
}

export function useMediaPlayback() {
  const context = useContext(MediaPlaybackContext);

  if (!context) {
    throw new Error("useMediaPlayback must be used inside MediaPlaybackProvider");
  }

  return context;
}

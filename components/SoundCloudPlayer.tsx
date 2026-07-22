"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useMediaPlayback } from "./MediaPlaybackContext";

// Minimal stubs for the SoundCloud Widget API
declare global {
  interface Window {
    SC?: {
      Widget: (
        iframeOrId: HTMLIFrameElement | string,
      ) => SCWidgetInstance;
    };
  }
}

type SCWidgetInstance = {
  bind: (eventName: string, handler: () => void) => void;
  unbind: (eventName: string) => void;
  pause: () => void;
};

const SC_EVENTS = {
  PLAY: "play",
};

let scApiPromise: Promise<void> | null = null;

function loadSoundCloudApi(): Promise<void> {
  if (scApiPromise) {
    return scApiPromise;
  }

  if (window.SC) {
    return Promise.resolve();
  }

  scApiPromise = new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;

    script.onload = () => {
      resolve();
    };

    document.head.appendChild(script);
  });

  return scApiPromise;
}

type Props = {
  playerId: string;
  embedUrl: string;
  iframeTitle: string;
};

export default function SoundCloudPlayer({
  playerId,
  embedUrl,
  iframeTitle,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SCWidgetInstance | null>(null);
  const mountedRef = useRef(true);
  const currentStateRef = useRef<{ playerId: string; notifyPlaying: (id: string) => void }>({ playerId, notifyPlaying: () => {} });

  const { register, unregister, notifyPlaying } = useMediaPlayback();

  // Keep currentStateRef in sync with latest values
  useEffect(() => {
    currentStateRef.current = { playerId, notifyPlaying };
  }, [playerId, notifyPlaying]);

  const pause = useCallback(() => {
    try {
      if (widgetRef.current && typeof widgetRef.current.pause === "function") {
        widgetRef.current.pause();
      }
    } catch {
      // Player may not be ready yet
    }
  }, []);

  useEffect(() => {
    register(playerId, pause);

    return () => {
      unregister(playerId);
    };
  }, [playerId, pause, register, unregister]);

  useEffect(() => {
    mountedRef.current = true;

    loadSoundCloudApi()
      .then(() => {
        if (!mountedRef.current || !window.SC || !iframeRef.current) {
          return;
        }

        const widget = window.SC.Widget(iframeRef.current);
        widgetRef.current = widget;

        widget.bind(SC_EVENTS.PLAY, () => {
          const { playerId: currentPlayerId, notifyPlaying: currentNotifyPlaying } = currentStateRef.current;
          currentNotifyPlaying(currentPlayerId);
        });
      })
      .catch((error) => {
        console.error("SoundCloudPlayer: failed to load API", error);
      });

    return () => {
      mountedRef.current = false;

      try {
        widgetRef.current?.unbind(SC_EVENTS.PLAY);
      } catch {
        // ignore
      }

      widgetRef.current = null;
    };
  }, []);

  return (
    <div className="audio-player-shell">
      <iframe
        ref={iframeRef}
        title={iframeTitle}
        loading="lazy"
        allow="autoplay"
        src={embedUrl}
      />
    </div>
  );
}

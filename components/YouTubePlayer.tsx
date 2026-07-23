"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useMediaPlayback } from "./MediaPlaybackContext";

// Minimal type stubs for the YouTube IFrame API
declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          events: {
            onReady?: () => void;
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => YTPlayerInstance;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayerInstance = {
  pauseVideo: () => void;
  destroy: () => void;
};

let ytApiPromise: Promise<typeof window.YT> | null = null;

function loadYouTubeApi(): Promise<typeof window.YT> {
  if (ytApiPromise) {
    return ytApiPromise;
  }

  if (window.YT) {
    return Promise.resolve(window.YT);
  }

  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      if (prev) {
        prev();
      }

      if (window.YT) {
        resolve(window.YT);
      }
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });

  return ytApiPromise;
}

type Props = {
  playerId: string;
  embedUrl: string;
  iframeTitle: string;
  orientation?: "landscape" | "portrait";
};

export default function YouTubePlayer({
  playerId,
  embedUrl,
  iframeTitle,
  orientation = "landscape",
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { register, unregister, notifyPlaying } = useMediaPlayback();
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const iframeLoadHandlerRef = useRef<(() => void) | null>(null);
  const pauseRef = useRef<() => void>(() => {});
  const registeredRef = useRef(false);
  const initStartedRef = useRef(false);
  const mountedRef = useRef(true);
  const currentStateRef = useRef({
    playerId,
    notifyPlaying,
    register,
    unregister,
  });

  // Keep current refs aligned with latest callbacks and IDs to avoid stale closures.
  useEffect(() => {
    currentStateRef.current = {
      playerId,
      notifyPlaying,
      register,
      unregister,
    };
  }, [playerId, notifyPlaying, register, unregister]);

  // The embed URL needs enablejsapi=1 to work with the IFrame API
  const apiUrl = embedUrl.includes("?")
    ? `${embedUrl}&enablejsapi=1`
    : `${embedUrl}?enablejsapi=1`;

  const pause = useCallback(() => {
    try {
      if (playerRef.current && typeof playerRef.current.pauseVideo === "function") {
        playerRef.current.pauseVideo();
        return;
      }

      // Fallback for edge cases where iframe is playable but Player API isn't ready yet.
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: "pauseVideo",
            args: [],
          }),
          "*",
        );
      }
    } catch {
      // Player may have been destroyed or not yet initialised
    }
  }, []);

  useEffect(() => {
    pauseRef.current = pause;
  }, [pause]);

  const ensureRegistered = useCallback(() => {
    if (registeredRef.current) {
      return;
    }

    const { playerId: currentPlayerId, register: currentRegister } = currentStateRef.current;
    currentRegister(currentPlayerId, () => {
      pauseRef.current();
    });
    registeredRef.current = true;
  }, []);

  const cleanupRegistration = useCallback(() => {
    if (!registeredRef.current) {
      return;
    }

    const { playerId: currentPlayerId, unregister: currentUnregister } = currentStateRef.current;
    currentUnregister(currentPlayerId);
    registeredRef.current = false;
  }, []);

  const initPlayer = useCallback((YT: NonNullable<typeof window.YT>) => {
    if (!mountedRef.current || !iframeRef.current || !YT || initStartedRef.current) {
      return;
    }

    const iframeId = iframeRef.current.id;
    if (!iframeId) {
      console.warn("YouTubePlayer: iframe has no ID");
      return;
    }

    initStartedRef.current = true;

    try {
      const player = new YT.Player(iframeId, {
        events: {
          onReady() {
            ensureRegistered();
          },
          onStateChange(event) {
            if (YT && event.data === YT.PlayerState.PLAYING) {
              const {
                playerId: currentPlayerId,
                notifyPlaying: currentNotifyPlaying,
              } = currentStateRef.current;
              currentNotifyPlaying(currentPlayerId);
            }
          },
        },
      });

      playerRef.current = player;
    } catch (error) {
      initStartedRef.current = false;
      console.error("YouTubePlayer: failed to create player", error);
    }
  }, [ensureRegistered]);

  useEffect(() => {
    mountedRef.current = true;
    initStartedRef.current = false;
    const iframeElement = iframeRef.current;

    loadYouTubeApi()
      .then((YT) => {
        if (!mountedRef.current || !YT) {
          return;
        }

        initPlayer(YT);

        if (!iframeElement) {
          return;
        }

        const handleIframeLoad = () => {
          if (!window.YT) {
            return;
          }

          initPlayer(window.YT);
        };

        iframeLoadHandlerRef.current = handleIframeLoad;
        iframeElement.addEventListener("load", handleIframeLoad);

        // In case the iframe is already loaded before listener attachment.
        handleIframeLoad();

        if (!mountedRef.current) {
          iframeElement.removeEventListener("load", handleIframeLoad);
        }
      })
      .catch((error) => {
        console.error("YouTubePlayer: failed to load API", error);
      });

    return () => {
      mountedRef.current = false;
      cleanupRegistration();

      if (iframeElement && iframeLoadHandlerRef.current) {
        iframeElement.removeEventListener("load", iframeLoadHandlerRef.current);
      }
      iframeLoadHandlerRef.current = null;

      try {
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      } catch {
        // ignore
      }

      playerRef.current = null;
      initStartedRef.current = false;
    };
  }, [cleanupRegistration, initPlayer, playerId]);

  const shellClass =
    orientation === "portrait"
      ? "video-player-shell video-player-shell-portrait"
      : "video-player-shell";

  // Generate a stable ID based on playerId to avoid hydration issues
  const iframeId = `yt-player-${playerId}`;

  return (
    <div className={shellClass}>
      <iframe
        ref={iframeRef}
        id={iframeId}
        src={apiUrl}
        title={iframeTitle}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

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
  const mountedRef = useRef(true);
  const currentStateRef = useRef({ playerId, notifyPlaying });

  // Keep currentStateRef in sync with latest playerId and notifyPlaying
  useEffect(() => {
    currentStateRef.current = { playerId, notifyPlaying };
  }, [playerId, notifyPlaying]);

  // The embed URL needs enablejsapi=1 to work with the IFrame API
  const apiUrl = embedUrl.includes("?")
    ? `${embedUrl}&enablejsapi=1`
    : `${embedUrl}?enablejsapi=1`;

  const pause = useCallback(() => {
    try {
      if (playerRef.current && typeof playerRef.current.pauseVideo === "function") {
        playerRef.current.pauseVideo();
      }
    } catch {
      // Player may have been destroyed or not yet initialised
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

    loadYouTubeApi()
      .then((YT) => {
        if (!mountedRef.current || !iframeRef.current || !YT) {
          return;
        }

        // Get the iframe's ID for the Player constructor
        const iframeId = iframeRef.current.id;

        if (!iframeId) {
          console.warn("YouTubePlayer: iframe has no ID");
          return;
        }

        try {
          const player = new YT.Player(iframeId, {
            events: {
              onStateChange(event) {
                const { playerId: currentPlayerId, notifyPlaying: currentNotifyPlaying } = currentStateRef.current;
                if (YT && event.data === YT.PlayerState.PLAYING) {
                  currentNotifyPlaying(currentPlayerId);
                }
              },
            },
          });

          playerRef.current = player;
        } catch (error) {
          console.error("YouTubePlayer: failed to create player", error);
        }
      })
      .catch((error) => {
        console.error("YouTubePlayer: failed to load API", error);
      });

    return () => {
      mountedRef.current = false;

      try {
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      } catch {
        // ignore
      }

      playerRef.current = null;
    };
  }, [playerId]);

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

"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type TransitionEvent,
} from "react";

export type ProductMedia =
  | { type: "image"; src: string }
  | { type: "video"; source: "upload" | "youtube"; src: string };

interface ProductGalleryProps {
  /** Ordered media — the feature image first, then the video (if any), then gallery images. */
  media: ProductMedia[];
  alt: string;
  /** Pre-rendered on the server; shown when the product has no media at all. */
  fallback: ReactNode;
  /** Gradient classes behind the fallback icon. */
  fallbackGradient: string;
  badge?: ReactNode;
}

/** How long each image stays before the gallery moves on. */
const AUTOPLAY_MS = 5000;

// "https://www.youtube.com/embed/{id}" → YouTube's own thumbnail for the strip.
function youtubeThumbnail(embedUrl: string): string | null {
  const id = embedUrl.match(/\/embed\/([\w-]{6,})/)?.[1];
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

// Browsers only allow autoplay when muted; viewers can unmute in the player.
function youtubeAutoplayUrl(embedUrl: string): string {
  const joiner = embedUrl.includes("?") ? "&" : "?";
  return `${embedUrl}${joiner}autoplay=1&mute=1&playsinline=1&rel=0`;
}

export function ProductGallery({
  media,
  alt,
  fallback,
  fallbackGradient,
  badge,
}: ProductGalleryProps) {
  const count = media.length;
  const videoIndex = media.findIndex((item) => item.type === "video");
  const hasVideo = videoIndex !== -1;
  // Without a video the slideshow loops, so a copy of the first slide sits at
  // the end: sliding up onto it looks like wrapping, then we snap back to 0.
  const loops = !hasVideo && count > 1;
  const slides = loops ? [...media, media[0]] : media;

  const [slide, setSlide] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [hovering, setHovering] = useState(false);
  // With a video, autoplay is a one-shot: feature image → video, then stop.
  const [videoAutoplayed, setVideoAutoplayed] = useState(false);

  const activeIndex = count ? slide % count : 0;
  const active = media[activeIndex];

  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const goTo = useCallback((index: number) => {
    setAnimate(true);
    setSlide(index);
  }, []);

  // Fit the gallery into one screen: measure how far down the page it starts
  // (top bar + sticky header + breadcrumb) and the sticky header's height, and
  // expose both as CSS variables that size the main viewer below.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const header = document.querySelector("header");

    const measure = () => {
      // The parent grid isn't sticky, so its top is the gallery's resting position.
      const anchor = root.parentElement ?? root;
      const top = anchor.getBoundingClientRect().top + window.scrollY;
      root.style.setProperty("--gallery-offset", `${Math.round(top)}px`);
      root.style.setProperty(
        "--header-h",
        `${Math.round(header?.getBoundingClientRect().height ?? 0)}px`,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (header) observer.observe(header);
    observer.observe(document.documentElement);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Autoplay timer. Restarts whenever the slide changes (including a manual
  // thumbnail click), and waits while the viewer is hovered or the tab is hidden.
  useEffect(() => {
    if (count < 2 || hovering || active?.type === "video") return;
    if (hasVideo && (videoAutoplayed || activeIndex !== 0)) return;

    const timer = setTimeout(() => {
      if (document.visibilityState === "hidden") return;
      if (hasVideo) {
        setVideoAutoplayed(true);
        goTo(videoIndex);
      } else {
        goTo(slide + 1);
      }
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [
    active?.type,
    activeIndex,
    count,
    goTo,
    hasVideo,
    hovering,
    slide,
    videoAutoplayed,
    videoIndex,
  ]);

  // Play an uploaded video when it slides in, pause it when it slides away.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active?.type === "video") {
      video.play().catch(() => {
        video.muted = true;
        void video.play().catch(() => {});
      });
    } else {
      video.pause();
    }
  }, [active]);

  // After sliding onto the copy of the first slide, jump back to the real one
  // with the transition off, then turn it back on for the next move.
  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (loops && slide === count) {
      setAnimate(false);
      setSlide(0);
    }
  };

  useEffect(() => {
    if (animate) return;
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimate(true)),
    );
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  return (
    <div
      ref={rootRef}
      // Fallbacks until measured: typical desktop offset / header height.
      style={{ "--gallery-offset": "186px", "--header-h": "70px" } as CSSProperties}
      className="lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:self-start"
    >
      <div
        className={`grid gap-3 ${count > 1 ? "lg:grid-cols-[4.5rem_minmax(0,1fr)]" : ""}`}
      >
        {/* Main viewer — a square no taller than the screen space left under
            the header (minus the thumbnail row on small screens). */}
        <div
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className={`relative aspect-square w-full max-w-[max(18rem,calc(100dvh-var(--gallery-offset)-6.5rem))] overflow-hidden rounded-(--radius-2xl) max-lg:mx-auto lg:order-2 lg:max-w-[max(20rem,calc(100dvh-var(--gallery-offset)-1.5rem))] ${
            !active ? `bg-linear-to-br ${fallbackGradient}` : "bg-white"
          }`}
        >
          {/* Hidden over video so it doesn't cover the player's own controls. */}
          {active?.type !== "video" && badge}

          {!active ? (
            fallback
          ) : (
            // Vertical track: each move slides the next slide up from the bottom.
            <div
              onTransitionEnd={handleTransitionEnd}
              style={{ transform: `translateY(-${slide * 100}%)` }}
              className={`flex h-full flex-col ${
                animate
                  ? "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                  : ""
              }`}
            >
              {slides.map((item, index) => {
                const isActive = index === slide;
                return (
                  <div
                    key={`${index}-${item.src}`}
                    aria-hidden={!isActive}
                    className={`relative h-full w-full shrink-0 ${
                      item.type === "video" ? "bg-black" : ""
                    }`}
                  >
                    {item.type === "image" ? (
                      <Image
                        src={item.src}
                        alt={isActive ? alt : ""}
                        fill
                        unoptimized
                        priority={index === 0}
                        className="object-contain p-4 sm:p-6"
                      />
                    ) : item.source === "youtube" ? (
                      isActive ? (
                        <iframe
                          src={youtubeAutoplayUrl(item.src)}
                          title={alt}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full border-0"
                        />
                      ) : (
                        // Only the active slide loads the player; others show its poster.
                        youtubeThumbnail(item.src) && (
                          <Image
                            src={youtubeThumbnail(item.src)!}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover opacity-80"
                          />
                        )
                      )
                    ) : (
                      <video
                        ref={videoRef}
                        src={item.src}
                        controls
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Autoplay progress — a thin bar that fills over the 5s wait. */}
          {count > 1 &&
            active?.type === "image" &&
            !hovering &&
            (!hasVideo || (!videoAutoplayed && activeIndex === 0)) && (
              <span
                key={`progress-${slide}`}
                aria-hidden="true"
                style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                className="absolute inset-x-0 bottom-0 z-10 h-0.5 origin-left animate-[gallery-progress_linear_forwards] bg-(--color-primary)/70 motion-reduce:hidden"
              />
            )}
        </div>

        {/* Thumbnails — a row under the image on small screens, a scrollable
            column beside it on desktop that never grows taller than the image. */}
        {count > 1 && (
          <div className="relative lg:order-1">
            <div className="flex gap-2.5 overflow-x-auto pb-1 max-lg:justify-center lg:absolute lg:inset-0 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pb-0 lg:[scrollbar-width:thin]">
              {media.map((item, index) => {
                const isActive = index === activeIndex;
                const thumb =
                  item.type === "image"
                    ? item.src
                    : item.source === "youtube"
                      ? youtubeThumbnail(item.src)
                      : null;

                return (
                  <button
                    key={`${item.type}-${item.src}`}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={
                      item.type === "video"
                        ? "Play product video"
                        : `Show image ${index + 1}`
                    }
                    aria-current={isActive}
                    className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-(--radius-md) border-2 bg-white p-0 transition-colors lg:w-full ${
                      isActive
                        ? "border-(--color-primary)"
                        : "border-(--color-border) hover:border-(--color-primary)"
                    }`}
                  >
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        unoptimized
                        className={
                          item.type === "image"
                            ? "object-contain p-1"
                            : "object-cover"
                        }
                      />
                    ) : (
                      // Uploaded video: its first frame stands in as the thumbnail.
                      <video
                        src={`${item.src}#t=0.1`}
                        muted
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 h-full w-full bg-black object-cover"
                      />
                    )}
                    {item.type === "video" && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-(--color-dark)">
                          <Play
                            aria-hidden="true"
                            className="ms-0.5 h-3.5 w-3.5 fill-current"
                          />
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductGallery;

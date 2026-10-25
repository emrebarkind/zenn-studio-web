"use client";

import { useEffect, useRef } from "react";

// Written as plain HTML so `muted`, `autoplay` and `playsinline` are real
// attributes in the page from the first byte: React sets `muted` only as a
// property, and iPhones refuse to autoplay a video that is not muted in markup.
const VIDEO_HTML = `<video autoplay muted loop playsinline webkit-playsinline preload="auto" disablepictureinpicture disableremoteplayback
  class="hero-video absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700">
  <source media="(min-width: 640px)" src="/video/hero-wide.mp4" type="video/mp4">
  <source src="/video/hero-tall.mp4" type="video/mp4">
</video>`;

/**
 * The hero's moving background (owner, 2026-10-25): ten seconds of a pilates
 * session, looped and silent, starting by itself as soon as the page opens
 * (owner, 2026-10-25). Wide screens get the landscape cut, phones the portrait
 * one at 720p. Files: public/video/hero-{wide,tall}.*
 *
 * The still underneath paints first. Some browsers ignore `media` on a video
 * <source>, so a wide screen is switched to the landscape cut here. If the
 * phone still blocks autoplay (iOS Low Power Mode), the first touch or scroll
 * starts it.
 */
export function HeroVideo() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = box.current?.querySelector("video");
    if (!video) return;
    const wide = window.matchMedia("(min-width: 640px)").matches;
    const want = wide ? "/video/hero-wide.mp4" : "/video/hero-tall.mp4";
    if (!video.currentSrc.endsWith(want)) {
      video.src = want;
    }
    // Hidden until it really plays: a paused video on an iPhone shows a big play button; the still shows instead.
    const show = () => video.classList.remove("opacity-0");
    if (!video.paused && video.currentTime > 0) show();
    video.addEventListener("playing", show);
    video.muted = true;
    const play = () => video.play().catch(() => {});
    play();
    video.addEventListener("canplay", play, { once: true });
    const events = ["touchstart", "pointerdown", "scroll", "keydown"] as const;
    const remove = () => events.forEach((e) => window.removeEventListener(e, onFirstTouch));
    const onFirstTouch = () => {
      play();
      remove();
    };
    events.forEach((e) => window.addEventListener(e, onFirstTouch, { passive: true }));
    return () => {
      video.removeEventListener("canplay", play);
      video.removeEventListener("playing", show);
      remove();
    };
  }, []);

  return (
    <div aria-hidden className="absolute inset-0">
      <picture>
        <source media="(min-width: 640px)" srcSet="/video/hero-wide.webp" type="image/webp" />
        <source media="(min-width: 640px)" srcSet="/video/hero-wide.jpg" />
        <source srcSet="/video/hero-tall.webp" type="image/webp" />
        <img src="/video/hero-tall.jpg" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      <div ref={box} className="absolute inset-0" dangerouslySetInnerHTML={{ __html: VIDEO_HTML }} />
    </div>
  );
}

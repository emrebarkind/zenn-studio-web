/**
 * The hero's moving background (owner, 2026-10-25): ten seconds of a pilates
 * session (from the original 1080×1920 file), looped and silent. Wide screens get a landscape cut of the
 * portrait video (each scene cropped around the action), phones the portrait
 * original. The still underneath shows while the video loads and is all
 * that shows under reduced motion. Files: public/video/hero-{wide,tall}.*
 */
export function HeroVideo() {
  return (
    <div aria-hidden className="absolute inset-0">
      <picture>
        <source media="(min-width: 640px)" srcSet="/video/hero-wide.jpg" />
        <img src="/video/hero-tall.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden">
        <source media="(min-width: 640px)" src="/video/hero-wide.mp4" type="video/mp4" />
        <source src="/video/hero-tall.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

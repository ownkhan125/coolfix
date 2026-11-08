"use client";

import { Children, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard } from "swiper/modules";
import { motion, useInView, useReducedMotion } from "motion/react";
// Swiper's base layout CSS (slide track, sizing). Our look for it is in styles/components.css (.glass-swiper).
import "swiper/css";

// Cards per screen and the space between them (the same 768px / 1024px breakpoints as the rest of the site).
// Mobile shows a bit of the next card, so people can see they can swipe.
const SLIDE_BREAKPOINTS = {
  0: { slidesPerView: 1.15, spaceBetween: 16 },
  768: { slidesPerView: 2, spaceBetween: 24 },
  1024: { slidesPerView: 3, spaceBetween: 24 },
};

// Autoplay: next card every 5 seconds.
// Autoplay and screen reader labels are our own code, not Swiper's Autoplay / A11y modules:
// those modules read the current time while the page is prerendered, which Next.js blocks.
const AUTOPLAY_SECONDS = 5;

// Glass swiper: a Swiper slider for glass cards. Each child becomes one slide.
// Swipe or drag, cards lift on hover, a clay control pill (arrows + dots) and a thin autoplay progress line.
// Autoplay pauses on hover, touch and off screen. Reduced motion: no autoplay, slides change instantly.
export default function GlassSwiper({ label, children }) {
  const slides = Children.toArray(children);
  const swiperRef = useRef(null);
  const sliderAreaRef = useRef(null);
  const isInView = useInView(sliderAreaRef, { amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const isAutoplaying = !shouldReduceMotion && !isPaused && isInView;

  // Dots: one per stop. With 3 cards on screen, 5 cards have 3 stops (Swiper calls them "snaps").
  const [snapCount, setSnapCount] = useState(slides.length);
  const [activeSnap, setActiveSnap] = useState(0);

  // Keep the dots in sync with Swiper (after setup, after a slide change, after a screen size change)
  function syncDots(swiper) {
    setSnapCount(swiper.snapGrid.length);
    setActiveSnap(swiper.snapIndex);
  }

  // Autoplay: one timer per stop. Any slide change (also by hand) restarts it, so it always matches the progress line.
  // "rewind" makes the last stop jump back to the first.
  useEffect(() => {
    if (!isAutoplaying) return;
    const timer = setTimeout(() => swiperRef.current?.slideNext(), AUTOPLAY_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [isAutoplaying, activeSnap]);

  return (
    <div
      ref={sliderAreaRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      // Pause autoplay while the mouse is over the slider or a finger is on it
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="flex flex-col items-center gap-6"
    >
      {/* Slider: a little top/bottom padding so the hover lift is not cut off */}
      <Swiper
        modules={[Keyboard]}
        breakpoints={SLIDE_BREAKPOINTS}
        speed={shouldReduceMotion ? 0 : 600}
        rewind
        grabCursor
        keyboard={{ enabled: true, onlyInViewport: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          syncDots(swiper);
        }}
        onSnapIndexChange={syncDots}
        onSnapGridLengthChange={syncDots}
        className="glass-swiper w-full py-3"
      >
        {slides.map((slide, slideIndex) => (
          <SwiperSlide key={slide.key} role="group" aria-roledescription="slide" aria-label={`${slideIndex + 1} of ${slides.length}`}>
            {/* Card: lifts a little on hover */}
            <motion.div whileHover={shouldReduceMotion ? undefined : { y: -6 }} className="grid">
              {slide}
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Controls: clay pill with the previous arrow, one dot per stop (active = wide pill) and the next arrow */}
      <div className="clay-tab-list flex items-center gap-4 p-1.5">
        <motion.button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => swiperRef.current?.slidePrev()}
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
          className="clay-round-button flex h-10 w-10 items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </motion.button>

        <div className="flex items-center gap-2">
          {Array.from({ length: snapCount }, (unused, snapIndex) => (
            <motion.button
              key={snapIndex}
              type="button"
              layout={!shouldReduceMotion}
              aria-label={`Go to testimonial ${snapIndex + 1}`}
              aria-current={snapIndex === activeSnap}
              onClick={() => swiperRef.current?.slideTo(snapIndex)}
              className={`clay-dot ${snapIndex === activeSnap ? "clay-dot-active w-7" : "w-2.5"} h-2.5`}
            />
          ))}
        </div>

        <motion.button
          type="button"
          aria-label="Next testimonial"
          onClick={() => swiperRef.current?.slideNext()}
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
          className="clay-round-button flex h-10 w-10 items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </motion.button>
      </div>

      {/* Autoplay progress: a thin line that fills up until the next card. Restarts on every slide change. */}
      {!shouldReduceMotion && (
        <div className="swiper-progress-track h-1 w-32 overflow-hidden" aria-hidden="true">
          <motion.div
            key={`${activeSnap}-${isAutoplaying}`}
            className="swiper-progress-fill h-full w-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isAutoplaying ? 1 : 0 }}
            transition={{ duration: isAutoplaying ? AUTOPLAY_SECONDS : 0, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
}

import type { Transition, Variants } from "motion/react"

/**
 * KURS motion system — deliberately quiet.
 * One gesture only: a slow, overdamped fade-in-up when content enters the
 * viewport. No scale, no glow, no parallax. Reduced motion is handled
 * globally by <MotionConfig reducedMotion="user"> in `providers.tsx`:
 * transforms are dropped, opacity stays.
 */

/** Soft, unhurried reveal on scroll (overdamped — no bounce). */
export const springReveal: Transition = {
  type: "spring",
  stiffness: 40,
  damping: 25,
}

/** Step change and progress inside the booking wizard. */
export const springSlide: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 34,
}

/** Fade-in-up used by <Reveal />, <RevealItem /> and section content. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: springReveal },
}

/** Container that staggers its children. */
export function stagger(staggerChildren = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  }
}

/** Viewport options for scroll-triggered reveals. */
export const viewportOnce = { once: true, amount: 0.2 } as const

/** Direction-aware horizontal slide for AnimatePresence (custom = direction). */
export const slide: Variants = {
  enter: (direction: number) => ({ x: direction * 24, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: springSlide },
  exit: (direction: number) => ({
    x: direction * -24,
    opacity: 0,
    transition: { duration: 0.16, ease: "easeIn" },
  }),
}

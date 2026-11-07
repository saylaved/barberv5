/**
 * Inertial wheel/trackpad scroll (Lenis), desktop full tier only.
 * Loaded on demand — never part of the initial bundle.
 *
 * Unlike Lenis' autoRaf (a permanent 60 fps loop), the loop here is
 * demand-driven: it wakes on wheel / pointer / key / click and goes back to
 * sleep a few frames after the glide ends. A still page costs zero frames.
 */
export async function startSmoothScroll(): Promise<() => void> {
  const { default: Lenis } = await import("lenis")

  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.085,
    wheelMultiplier: 0.95,
    smoothWheel: true,
    syncTouch: false,
    allowNestedScroll: true,
    anchors: { offset: -64 },
    prevent: (node) => node.closest?.("[role='dialog']") != null,
  })

  let raf = 0
  let still = 0
  const tick = (t: number) => {
    lenis.raf(t)
    if (lenis.isScrolling) still = 0
    else if (++still > 3) {
      raf = 0
      return
    }
    raf = requestAnimationFrame(tick)
  }
  const wake = () => {
    still = 0
    if (!raf) raf = requestAnimationFrame(tick)
  }

  const events = ["wheel", "pointerdown", "keydown", "click"] as const
  for (const e of events) window.addEventListener(e, wake, { passive: true, capture: true })

  // Radix Dialog locks <body>; let the booking wizard scroll natively.
  const observer = new MutationObserver(() => {
    if (document.body.hasAttribute("data-scroll-locked")) lenis.stop()
    else lenis.start()
  })
  observer.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked"] })

  return () => {
    for (const e of events) window.removeEventListener(e, wake, { capture: true })
    observer.disconnect()
    cancelAnimationFrame(raf)
    lenis.destroy()
  }
}

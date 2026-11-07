/**
 * Magnetic CTAs: elements marked [data-magnetic] lean a few pixels toward
 * the mouse. Vanilla, desktop full tier only. The rect is measured once on
 * enter (no layout reads while moving); one transform write per frame; the
 * glide/settle is a CSS transform transition (globals.css).
 */
export function attachMagnetic(strength = 0.22): () => void {
  const cleanups: Array<() => void> = []

  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    let rect: DOMRect | null = null
    let raf = 0
    let x = 0
    let y = 0

    const enter = () => {
      rect = el.getBoundingClientRect()
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      rect ??= el.getBoundingClientRect()
      x = (e.clientX - (rect.left + rect.width / 2)) * strength
      y = (e.clientY - (rect.top + rect.height / 2)) * strength
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
        })
    }
    const leave = () => {
      cancelAnimationFrame(raf)
      raf = 0
      rect = null
      el.style.transform = ""
    }

    el.addEventListener("pointerenter", enter, { passive: true })
    el.addEventListener("pointermove", move, { passive: true })
    el.addEventListener("pointerleave", leave, { passive: true })
    cleanups.push(() => {
      leave()
      el.removeEventListener("pointerenter", enter)
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
    })
  })

  return () => cleanups.forEach((c) => c())
}

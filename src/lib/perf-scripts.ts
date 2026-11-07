/**
 * Tiny inline bootstrap scripts (no framework, run before hydration).
 *
 * TIER_SCRIPT — in <head>, before first paint. Picks the motion tier once:
 *   data-perf="lite" → zero animation, everything static and visible.
 *   data-perf="full" → compositor-only motion (the default).
 * Lite only with Data Saver or on genuinely low-end touch devices (≤1 GB
 * RAM, or ≤2 cores on a touch screen). The OS "reduce motion" flag is NOT a
 * trigger: on Windows it is the global "Animation effects" switch that
 * performance tweaks turn off, and it would silently strip the site.
 * Desktops with a mouse always get the full experience.
 * `?perf=lite` / `?perf=full` force a tier (QA).
 *
 * REVEAL_SCRIPT — at the end of <body>. One shared IntersectionObserver
 * flips `data-shown` on [data-reveal] elements; CSS does the rest.
 */
export const TIER_SCRIPT = `(function(){try{var d=document.documentElement,n=navigator,c=n.connection||{},q=/[?&]perf=(lite|full)/.exec(location.search),mm=function(s){return !!(window.matchMedia&&matchMedia(s).matches)};var touch=mm("(pointer: coarse)");var lite=c.saveData===true||(n.deviceMemory>0&&n.deviceMemory<=1)||(touch&&n.hardwareConcurrency>0&&n.hardwareConcurrency<=2);d.setAttribute("data-perf",q?q[1]:lite?"lite":"full")}catch(e){}})()`

export const REVEAL_SCRIPT = `(function(){var d=document.documentElement;if(d.getAttribute("data-perf")!=="full"||!("IntersectionObserver" in window))return;var io=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++){var e=es[i];if(e.isIntersecting){e.target.setAttribute("data-shown","");io.unobserve(e.target)}}},{rootMargin:"0px 0px -8% 0px",threshold:0.12});window.__kursIO=io;var els=document.querySelectorAll("[data-reveal]");for(var j=0;j<els.length;j++)io.observe(els[j])})()`

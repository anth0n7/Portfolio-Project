// Hero: the name is sampled into particles that dodge the cursor and spring back.
// Decorative only. The real <h1> lives in the page (index.astro), so this canvas is aria-hidden.
//
// Performance notes (Lighthouse counts any main-thread task over 50 ms as blocking):
//  - only the band of the canvas that actually contains the text is sampled, not the whole hero
//  - sampling is split into short slices that yield to the browser between them
//  - the build runs once at startup, and later only when the size really changes (debounced)
import { useEffect, useRef } from 'react';

type Props = {
  lines: string[]; // wide layout
  narrowLines?: string[]; // used under 640px
  font: string; // CSS font-family name; must be loaded
  weight?: number;
  colors: [string, string]; // gradient, left to right
  fill?: number; // fraction of the container width the text spans
  className?: string;
};

type Particle = { ox: number; oy: number; x: number; y: number; vx: number; vy: number; c: string };

const hexToRgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// Give the browser a chance to handle taps and paint between slices of work.
const yieldToMain = (): Promise<void> => {
  const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  return s?.yield ? s.yield() : new Promise((resolve) => setTimeout(resolve, 0));
};

export default function ParticleName({ lines, narrowLines, font, weight = 800, colors, fill = 0.86, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // no canvas support: the plain-text name stays visible

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const [c0, c1] = colors.map(hexToRgb);
    let parts: Particle[] = [];
    let raf = 0, w = 0, h = 0, builtW = 0, builtH = 0;
    let running = false, visible = true, generation = 0, resizeTimer = 0, alive = true;
    const mouse = { x: -9999, y: -9999 };

    // Draw the name offscreen, then turn its filled pixels into particles. Resolves false if superseded.
    const build = async (): Promise<boolean> => {
      const mine = ++generation;
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      if (!cw || !ch) return false;
      w = cw; h = ch;
      const dpr = Math.min(2, devicePixelRatio || 1);
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const ls = w < 640 && narrowLines ? narrowLines : lines;
      const probe = document.createElement('canvas').getContext('2d')!;
      let fs = 200;
      probe.font = `${weight} ${fs}px "${font}"`;
      const widest = Math.max(...ls.map((l) => probe.measureText(l).width));
      fs = Math.min((fs * w * fill) / widest, (h * 0.8) / ls.length);

      // Only the horizontal band holding the text needs to be read back.
      const lineH = fs * 0.95;
      const bandH = Math.min(h, Math.ceil(lineH * ls.length + fs * 0.6));
      const bandTop = Math.round(h / 2 - bandH / 2);
      const off = document.createElement('canvas'); off.width = w; off.height = bandH;
      const o = off.getContext('2d', { willReadFrequently: true })!;
      o.font = `${weight} ${fs}px "${font}"`;
      o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillStyle = '#000';
      ls.forEach((l, i) => o.fillText(l, w / 2, bandH / 2 + (i - (ls.length - 1) / 2) * lineH));
      const data = o.getImageData(0, 0, w, bandH).data;

      const gap = Math.max(3, Math.round(w / 280));
      const prev = parts;
      const next: Particle[] = [];
      let sliceStart = performance.now();
      for (let y = 0; y < bandH; y += gap) {
        for (let px = 0; px < w; px += gap) {
          if (data[(y * w + px) * 4 + 3] < 128) continue;
          const t = px / w;
          const c = `rgb(${c0.map((v, i) => Math.round(v + (c1[i] - v) * t)).join(',')})`;
          const p = prev[next.length]; // keep positions across a rebuild so nothing jumps
          const oy = y + bandTop;
          next.push({ ox: px, oy, x: reduced ? px : p ? p.x : Math.random() * w, y: reduced ? oy : p ? p.y : Math.random() * h, vx: 0, vy: 0, c });
        }
        if (performance.now() - sliceStart > 8) {
          await yieldToMain();
          if (mine !== generation || !alive) return false;
          sliceStart = performance.now();
        }
      }
      parts = next; builtW = w; builtH = h;
      return true;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const R = 80;
      for (const p of parts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < R * R) { const d = Math.sqrt(d2) || 1, f = ((R - d) / R) * 6; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }
        p.vx += (p.ox - p.x) * 0.05; p.vy += (p.oy - p.y) * 0.05;
        p.vx *= 0.84; p.vy *= 0.84; p.x += p.vx; p.y += p.vy;
        ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 2.2, 2.2);
      }
    };
    const loop = () => { draw(); if (running) raf = requestAnimationFrame(loop); };

    const start = async () => {
      cancelAnimationFrame(raf); running = false;
      if (!(await build()) || !alive) return;
      document.documentElement.dataset.heroReady = '1'; // fades the plain-text fallback out
      if (reduced) { draw(); return; } // static dots, no animation
      if (visible) { running = true; loop(); }
      // The size may have changed while we were building.
      if (canvas.clientWidth !== builtW || canvas.clientHeight !== builtH) { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(start, 150); }
    };

    // Pause the animation when the hero is off-screen.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (reduced || !parts.length) return;
      if (visible && !running) { running = true; loop(); }
      if (!visible) { running = false; cancelAnimationFrame(raf); }
    });
    io.observe(canvas);

    document.fonts.load(`${weight} 100px "${font}"`).then(start, start);

    // Rebuild only on a real size change, and only after the first build has finished.
    const ro = new ResizeObserver(() => {
      if (!builtW || (canvas.clientWidth === builtW && canvas.clientHeight === builtH)) return;
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(start, 150);
    });
    ro.observe(canvas);

    const move = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const leave = () => { mouse.x = mouse.y = -9999; };
    const burst = () => { if (!reduced) parts.forEach((p) => { p.vx += (Math.random() - 0.5) * 60; p.vy += (Math.random() - 0.5) * 60; }); };
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);
    canvas.addEventListener('click', burst);

    return () => {
      alive = false; running = false; generation++;
      cancelAnimationFrame(raf); clearTimeout(resizeTimer); io.disconnect(); ro.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('click', burst);
    };
  }, [lines.join('|'), narrowLines?.join('|'), font, weight, colors.join('|'), fill]);

  return <canvas ref={ref} className={className} style={{ touchAction: 'pan-y' }} aria-hidden="true" />;
}

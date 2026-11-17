// Hero: the name is sampled into particles that dodge the cursor and spring back.
// Decorative only. The real <h1> lives in the page (index.astro), so this canvas is aria-hidden.
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

export default function ParticleName({ lines, narrowLines, font, weight = 800, colors, fill = 0.86, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // no canvas support: the plain-text name stays visible

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const [c0, c1] = colors.map(hexToRgb);
    let parts: Particle[] = [];
    let raf = 0, w = 0, h = 0, running = false;
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      if (!w || !h) return false;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw the name offscreen, then sample its filled pixels into particles.
      const off = document.createElement('canvas'); off.width = w; off.height = h;
      const o = off.getContext('2d')!;
      const ls = w < 640 && narrowLines ? narrowLines : lines;
      let fs = 200;
      o.font = `${weight} ${fs}px "${font}"`;
      const widest = Math.max(...ls.map(l => o.measureText(l).width));
      fs = Math.min((fs * w * fill) / widest, (h * 0.8) / ls.length);
      o.font = `${weight} ${fs}px "${font}"`;
      o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillStyle = '#000';
      ls.forEach((l, i) => o.fillText(l, w / 2, h / 2 + (i - (ls.length - 1) / 2) * fs * 0.95));

      const data = o.getImageData(0, 0, w, h).data;
      const gap = Math.max(3, Math.round(w / 280));
      const prev = parts; parts = [];
      for (let y = 0; y < h; y += gap) for (let px = 0; px < w; px += gap) {
        if (data[(y * w + px) * 4 + 3] < 128) continue;
        const t = px / w;
        const c = `rgb(${c0.map((v, i) => Math.round(v + (c1[i] - v) * t)).join(',')})`;
        const p = prev[parts.length]; // keep positions across a resize so nothing jumps
        parts.push({ ox: px, oy: y, x: reduced ? px : p ? p.x : Math.random() * w, y: reduced ? y : p ? p.y : Math.random() * h, vx: 0, vy: 0, c });
      }
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

    const start = () => {
      cancelAnimationFrame(raf);
      if (!build()) return;
      document.documentElement.dataset.heroReady = '1'; // fades the plain-text fallback out
      if (reduced) { draw(); return; } // static dots, no animation
      running = true; loop();
    };

    // Pause the animation when the hero is off-screen or the tab is hidden.
    const io = new IntersectionObserver(([e]) => {
      if (reduced || !parts.length) return;
      if (e.isIntersecting && !running) { running = true; loop(); }
      if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
    });
    io.observe(canvas);

    document.fonts.load(`${weight} 100px "${font}"`).then(start, start);
    const ro = new ResizeObserver(start); ro.observe(canvas);

    const move = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const leave = () => { mouse.x = mouse.y = -9999; };
    const burst = () => { if (!reduced) parts.forEach(p => { p.vx += (Math.random() - 0.5) * 60; p.vy += (Math.random() - 0.5) * 60; }); };
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);
    canvas.addEventListener('click', burst);

    return () => {
      running = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('click', burst);
    };
  }, [lines.join('|'), narrowLines?.join('|'), font, weight, colors.join('|'), fill]);

  return <canvas ref={ref} className={className} style={{ touchAction: 'pan-y' }} aria-hidden="true" />;
}

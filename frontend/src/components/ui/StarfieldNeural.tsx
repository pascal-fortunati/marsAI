import { useEffect, useRef, useState } from "react";

type StarfieldNeuralProps = {
  className?: string;
};

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  pulseSpeed: number;
  warmth: number;
};

const MIN_STARS = 70;
const MAX_STARS = 220;
const AREA_PER_STAR = 9000;
const LINK_DISTANCE = 140;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTheme(): "dark" | "light" {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light") return "light";
  if (attr === "dark") return "dark";
  // Fallback
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function StarfieldNeural({ className }: StarfieldNeuralProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">(getTheme());

  // Detect theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(getTheme());
    };

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let frameId = 0;

    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const initStars = () => {
      const area = width * height;
      const count = clamp(
        Math.floor(area / AREA_PER_STAR),
        MIN_STARS,
        MAX_STARS,
      );

      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: randomRange(-0.07, 0.07),
        vy: randomRange(-0.07, 0.07),
        radius: randomRange(0.8, 2.4),
        phase: randomRange(0, Math.PI * 2),
        pulseSpeed: randomRange(0.6, 1.8),
        warmth: Math.random(),
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initStars();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Adapt colors and opacity based on theme
      const isDark = theme === "dark";
      const starAlphaMax = isDark ? 0.6 : 0.15; // Subtle in light mode
      const linkAlphaMultiplier = isDark ? 0.26 : 0.08; // Much more subtle links in light mode
      const lightMin = isDark ? 76 : 45; // Darker in light mode
      const lightMax = isDark ? 72 : 50; // Darker in light mode

      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];

        if (!reducedMotion) {
          star.x += star.vx;
          star.y += star.vy;

          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;
        }

        // Draw links between nearby stars
        for (let j = i + 1; j < stars.length; j += 1) {
          const other = stars[j];
          const dx = other.x - star.x;
          const dy = other.y - star.y;
          const dist = Math.hypot(dx, dy);

          if (dist > LINK_DISTANCE) continue;

          const intensity = 1 - dist / LINK_DISTANCE;
          const alpha = intensity * intensity * linkAlphaMultiplier;

          // Slightly mix cool/warm links
          const hue = isDark ? 245 - (star.warmth + other.warmth) * 20 : 250;
          const sat = isDark ? 85 : 60;
          const light = isDark ? 68 : 55;

          ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;
          ctx.lineWidth = 0.7 + intensity * 0.7;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }

        // Draw stars with pulsing effect
        const pulse =
          0.58 + 0.42 * Math.sin(time * 0.0015 * star.pulseSpeed + star.phase);
        const starAlpha = (0.35 + pulse * 0.6) * (starAlphaMax / 0.95);

        let hue: number;
        let sat: number;
        let light: number;

        if (isDark) {
          hue = star.warmth > 0.82 ? 28 : 255;
          sat = star.warmth > 0.82 ? 90 : 88;
          light = star.warmth > 0.82 ? 72 : 76;
        } else {
          // Light mode: darker, more muted colors
          hue = star.warmth > 0.82 ? 20 : 240;
          sat = star.warmth > 0.82 ? 70 : 65;
          light = lightMin + pulse * (lightMax - lightMin);
        }

        ctx.beginPath();
        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${starAlpha})`;
        ctx.arc(
          star.x,
          star.y,
          star.radius * (0.7 + pulse * 0.4),
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      if (!reducedMotion) {
        frameId = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw(0);

    if (!reducedMotion) {
      frameId = window.requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none h-full w-full ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

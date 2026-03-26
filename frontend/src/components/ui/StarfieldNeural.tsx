import { useEffect, useRef, useState } from "react";

type StarfieldNeuralProps = {
  className?: string;
  theme?: "dark" | "light";
  intensity?: "normal" | "high";
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

const MIN_STARS = 45;
const MAX_STARS = 150;
const AREA_PER_STAR = 10500;
const LINK_DISTANCE = 180;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTheme(): "dark" | "light" {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light") return "light";
  if (attr === "dark") return "dark";
  // Repli
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function StarfieldNeural({
  className,
  theme: themeProp,
  intensity = "normal",
}: StarfieldNeuralProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">(themeProp ?? getTheme());

  // Detecte les changements de theme
  useEffect(() => {
    if (themeProp) {
      setTheme(themeProp);
      return;
    }

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
    let lastFrameTime = 0;
    let resizeObserver: ResizeObserver | null = null;

    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const initStars = () => {
      const area = width * height;
      const count = clamp(
        Math.floor(area / AREA_PER_STAR),
        MIN_STARS,
        MAX_STARS,
      );

      stars = Array.from({ length: count }, () => {
        const angle = randomRange(0, Math.PI * 2);
        const speed = randomRange(0.315, 0.504);
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: randomRange(1.1, 3.2),
          phase: randomRange(0, Math.PI * 2),
          pulseSpeed: randomRange(0.6, 1.8),
          warmth: Math.random(),
        };
      });
    };

    const resize = () => {
      const host = canvas.parentElement;
      width = host?.clientWidth || window.innerWidth;
      height = host?.clientHeight || window.innerHeight;

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
      const deltaFactor =
        lastFrameTime > 0
          ? clamp((time - lastFrameTime) / 16.67, 0.75, 1.75)
          : 1;
      lastFrameTime = time;

      ctx.clearRect(0, 0, width, height);

      // Adapte les couleurs et l'opacite selon le theme
      const isDark = theme === "dark";
      const isHigh = intensity === "high";
      const starAlphaMax = isDark ? 0.9 : isHigh ? 0.82 : 0.62;
      const linkAlphaMultiplier = isDark
        ? isHigh
          ? 0.58
          : 0.38
        : isHigh
          ? 0.52
          : 0.42;
      const lightMin = isDark ? 80 : 54;
      const lightMax = isDark ? 78 : 84;

      // Cadrillage subtil de fond, visible dans les deux themes.
      const gridStep = isDark ? 92 : 86;
      const gridAlpha = isDark ? 0.065 : 0.13;
      const gridHue = isDark ? 225 : 250;
      const gridSat = isDark ? 22 : 24;
      const gridLight = isDark ? 62 : 44;
      ctx.strokeStyle = `hsla(${gridHue}, ${gridSat}%, ${gridLight}%, ${gridAlpha})`;
      ctx.lineWidth = 1;

      for (let x = 0; x <= width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];

        if (!reducedMotion) {
          star.x += star.vx * deltaFactor;
          star.y += star.vy * deltaFactor;

          // Donne une petite courbure de trajectoire pour eviter l'effet trop lineaire.
          const drift = 0.07 * deltaFactor;
          star.x += Math.sin(time * 0.0012 + star.phase) * drift;
          star.y += Math.cos(time * 0.0011 + star.phase * 1.17) * drift;

          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;
        }

        // Dessine des liens entre etoiles proches
        for (let j = i + 1; j < stars.length; j += 1) {
          const other = stars[j];
          const dx = other.x - star.x;
          const dy = other.y - star.y;
          const dist = Math.hypot(dx, dy);

          if (dist > LINK_DISTANCE) continue;

          const intensity = 1 - dist / LINK_DISTANCE;
          const alpha = intensity * intensity * linkAlphaMultiplier;

          // En mode clair, on suit la palette du logo (violet <-> or/jaune).
          const avgWarmth = (star.warmth + other.warmth) * 0.5;
          const hue = isDark
            ? 245 - (star.warmth + other.warmth) * 20
            : 266 - avgWarmth * 220;
          const sat = isDark ? 85 : 74;
          const light = isDark ? 68 : 44;

          ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;
          ctx.lineWidth = 0.9 + intensity * 0.9;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }

        // Dessine les etoiles avec un effet de pulsation
        const pulse =
          0.52 + 0.48 * Math.sin(time * 0.0017 * star.pulseSpeed + star.phase);
        const starAlpha = (0.45 + pulse * 0.7) * (starAlphaMax / 0.95);

        let hue: number;
        let sat: number;
        let light: number;

        if (isDark) {
          hue = star.warmth > 0.82 ? 28 : 255;
          sat = star.warmth > 0.82 ? 90 : 88;
          light = star.warmth > 0.82 ? 72 : 76;
        } else {
          // Mode clair : palette inspiree du logo clair (or/jaune, violet, cyan)
          if (star.warmth > 0.82) {
            hue = 46; // or/jaune
            sat = 88;
          } else if (star.warmth < 0.22) {
            hue = 182; // cyan/turquoise
            sat = 78;
          } else {
            hue = 266; // violet
            sat = 72;
          }
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
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => resize());
      const host = canvas.parentElement;
      if (host) resizeObserver.observe(host);
    }

    return () => {
      window.removeEventListener("resize", resize);
      resizeObserver?.disconnect();
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

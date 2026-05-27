"use client";

import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    particlesJS?: (id: string, config: unknown) => void;
    pJSDom?: Array<{ pJS?: { fn?: { vendors?: { destroypJS?: () => void } } } }>;
  }
}

const CDN_SRC = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";

const CONFIG = {
  particles: {
    number: { value: 63, density: { enable: true, value_area: 900 } },
    color: { value: "#dfe7f7" },
    shape: {
      type: "circle",
      stroke: { width: 0, color: "#000000" },
      polygon: { nb_sides: 5 },
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
    },
    size: {
      value: 2,
      random: true,
      anim: { enable: true, speed: 8, size_min: 0.1, sync: false },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1.6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: { enable: false, rotateX: 600, rotateY: 1200 },
    },
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "bubble" },
      resize: true,
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 1 } },
      bubble: { distance: 400, size: 5, duration: 1, opacity: 1, speed: 3 },
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 },
    },
  },
  retina_detect: true,
};

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.particlesJS) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${CDN_SRC}"]`
  );
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener("load", () => resolve(), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = CDN_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("particles.js failed to load"));
    document.head.appendChild(s);
  });
}

type Props = {
  className?: string;
};

export default function ParticlesBg({ className = "" }: Props) {
  const reactId = useId();
  const elementId = `particles-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const initedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadScript().then(() => {
      if (cancelled || initedRef.current) return;
      if (window.particlesJS) {
        window.particlesJS(elementId, CONFIG);
        initedRef.current = true;
      }
    });
    return () => {
      cancelled = true;
      const instances = window.pJSDom;
      if (instances && instances.length) {
        const idx = instances.findIndex(
          (d) => (d as unknown as { pJS?: { canvas?: { el?: HTMLCanvasElement } } })
            ?.pJS?.canvas?.el?.parentElement?.id === elementId
        );
        if (idx >= 0) {
          try {
            instances[idx]?.pJS?.fn?.vendors?.destroypJS?.();
          } catch {}
          instances.splice(idx, 1);
        }
      }
      initedRef.current = false;
    };
  }, [elementId]);

  return (
    <div
      id={elementId}
      className={`absolute inset-0 ${className}`}
      aria-hidden
      style={{ pointerEvents: "none" }}
    />
  );
}

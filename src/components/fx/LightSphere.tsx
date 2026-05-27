"use client";

import { useEffect, useRef } from "react";

type ColorRGB = { r: number; g: number; b: number };

type Props = {
  size?: number;             // canvas square size (px)
  radius?: number;           // sphere radius — defaults to size * 0.475
  particlesPerFrame?: number;
  particleRad?: number;
  rotationSpeed?: number;    // radians per frame
  palette?: ColorRGB[];      // accent colors (used ~2% of the time)
  primaryColor?: ColorRGB;   // dominant color (~98% of particles)
  coreColor?: ColorRGB;      // bright inner core color (default cream-white)
  trailAlpha?: number;       // 0..1 — semi-transparent background fill for light trails
  bloomScale?: number;       // outer halo multiplier (1 = none, 2.5 = strong glow)
  twinkleAmount?: number;    // 0..1 — per-particle alpha sine modulation
  className?: string;
};

type Particle = {
  x: number; y: number; z: number;
  velX: number; velY: number; velZ: number;
  accelX: number; accelY: number; accelZ: number;
  age: number;
  alpha: number;
  attack: number; hold: number; decay: number;
  initValue: number; holdValue: number; lastValue: number;
  stuckTime: number;
  projX: number; projY: number;
  dead: boolean;
  twinklePhase: number;
  twinkleFreq: number;
  prev: Particle | null;
  next: Particle | null;
};

const GOLD_PALETTE: ColorRGB[] = [
  { r: 254, g: 243, b: 199 }, // #fef3c7 — cream highlight
  { r: 245, g: 158, b: 11 },  // #f59e0b — amber
  { r: 252, g: 211, b: 77 },  // #fcd34d — light gold
];

const GOLD_PRIMARY: ColorRGB = { r: 251, g: 191, b: 36 }; // #fbbf24

function makeParticle(): Particle {
  return {
    x: 0, y: 0, z: 0,
    velX: 0, velY: 0, velZ: 0,
    accelX: 0, accelY: 0, accelZ: 0,
    age: 0,
    alpha: 0,
    attack: 0, hold: 0, decay: 0,
    initValue: 0, holdValue: 0, lastValue: 0,
    stuckTime: 0,
    projX: 0, projY: 0,
    dead: false,
    twinklePhase: 0,
    twinkleFreq: 0,
    prev: null, next: null,
  };
}

const CORE_DEFAULT: ColorRGB = { r: 255, g: 251, b: 235 }; // #fffbeb

export default function LightSphere({
  size = 600,
  radius,
  particlesPerFrame = 8,
  particleRad = 9,
  rotationSpeed = (2 * Math.PI) / 2200,
  palette = GOLD_PALETTE,
  primaryColor = GOLD_PRIMARY,
  coreColor = CORE_DEFAULT,
  trailAlpha = 0.45,
  bloomScale = 1.8,
  twinkleAmount = 0.3,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = size;
    const displayHeight = size;
    canvas.width = Math.floor(displayWidth * dpr);
    canvas.height = Math.floor(displayHeight * dpr);
    canvas.style.width = displayWidth + "px";
    canvas.style.height = displayHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sphereRadius = radius ?? size * 0.475;
    const fLen = size * 0.75;
    const projCenterX = displayWidth / 2;
    const projCenterY = displayHeight / 2;
    const zMax = fLen - 1;
    const randAccelX = 0.1;
    const randAccelY = 0.1;
    const randAccelZ = 0.1;
    const sphereCenterY = 0;
    const sphereCenterZ = -3 - sphereRadius;
    const zeroAlphaDepth = -750;
    const particleAlpha = 0.9;
    const wait = 1;
    let count = wait - 1;
    let turnAngle = 0;

    const particleList: { first: Particle | null } = { first: null };
    const recycleBin: { first: Particle | null } = { first: null };

    function rgbPrefix(): string {
      // ~98% primary color, ~2% palette accent (matches original's 1-in-50)
      if (Math.floor(Math.random() * 50) !== 1) {
        return `rgba(${primaryColor.r},${primaryColor.g},${primaryColor.b},`;
      }
      const c = palette[Math.floor(Math.random() * palette.length)];
      return `rgba(${c.r},${c.g},${c.b},`;
    }

    function addParticle(
      x0: number, y0: number, z0: number,
      vx0: number, vy0: number, vz0: number
    ): Particle {
      let newParticle: Particle;
      if (recycleBin.first !== null) {
        newParticle = recycleBin.first;
        if (newParticle.next !== null) {
          recycleBin.first = newParticle.next;
          newParticle.next.prev = null;
        } else {
          recycleBin.first = null;
        }
      } else {
        newParticle = makeParticle();
      }
      if (particleList.first === null) {
        particleList.first = newParticle;
        newParticle.prev = null;
        newParticle.next = null;
      } else {
        newParticle.next = particleList.first;
        particleList.first.prev = newParticle;
        particleList.first = newParticle;
        newParticle.prev = null;
      }
      newParticle.x = x0;
      newParticle.y = y0;
      newParticle.z = z0;
      newParticle.velX = vx0;
      newParticle.velY = vy0;
      newParticle.velZ = vz0;
      newParticle.age = 0;
      newParticle.dead = false;
      return newParticle;
    }

    function recycle(p: Particle) {
      if (particleList.first === p) {
        if (p.next !== null) {
          p.next.prev = null;
          particleList.first = p.next;
        } else {
          particleList.first = null;
        }
      } else {
        if (p.next === null) {
          p.prev!.next = null;
        } else {
          p.prev!.next = p.next;
          p.next.prev = p.prev;
        }
      }
      if (recycleBin.first === null) {
        recycleBin.first = p;
        p.prev = null;
        p.next = null;
      } else {
        p.next = recycleBin.first;
        recycleBin.first.prev = p;
        recycleBin.first = p;
        p.prev = null;
      }
    }

    function spawnParticle() {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const x0 = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y0 = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const z0 = sphereRadius * Math.cos(phi);
      const p = addParticle(
        x0,
        sphereCenterY + y0,
        sphereCenterZ + z0,
        0.005 * x0,
        0.002 * y0,
        0.002 * z0
      );
      p.attack = 120;
      p.hold = 120;
      p.decay = 46 * Math.random() * 20;
      p.initValue = 0;
      p.holdValue = particleAlpha;
      p.lastValue = 0;
      p.stuckTime = 120 + Math.random() * 20;
      p.accelX = Math.random() / 3 - 0.15;
      p.accelY = Math.random() / 3 - 0.15;
      p.accelZ = Math.random() / 3 - 0.15;
      p.twinklePhase = Math.random() * Math.PI * 2;
      p.twinkleFreq = 0.06 + Math.random() * 0.12;
    }

    function tick() {
      count++;
      if (count >= wait) {
        count = 0;
        for (let i = 0; i < particlesPerFrame; i++) {
          spawnParticle();
        }
      }

      turnAngle = (turnAngle + rotationSpeed) % (2 * Math.PI);
      const sinAngle = Math.sin(turnAngle);
      const cosAngle = Math.cos(turnAngle);

      // Semi-transparent black fill leaves faint trails of previous frames,
      // giving the impression of bloom in dense areas.
      ctx!.globalCompositeOperation = "source-over";
      ctx!.fillStyle = `rgba(0,0,0,${trailAlpha})`;
      ctx!.fillRect(0, 0, displayWidth, displayHeight);

      // All particle drawing uses additive blending so overlaps brighten.
      ctx!.globalCompositeOperation = "lighter";

      let p = particleList.first;
      while (p !== null) {
        const nextParticle = p.next;
        p.age++;
        if (p.age > p.stuckTime) {
          p.velX += p.accelX + randAccelX * (Math.random() * 2 - 1);
          p.velY += p.accelY + randAccelY * (Math.random() * 2 - 1);
          p.velZ += p.accelZ + randAccelZ * (Math.random() * 2 - 1);
          p.x += p.velX;
          p.y += p.velY;
          p.z += p.velZ;
        }

        const rotX = cosAngle * p.x + sinAngle * (p.z - sphereCenterZ);
        const rotZ =
          -sinAngle * p.x + cosAngle * (p.z - sphereCenterZ) + sphereCenterZ;
        const m = fLen / (fLen - rotZ);
        p.projX = rotX * m + projCenterX;
        p.projY = p.y * m + projCenterY;

        if (p.age < p.attack + p.hold + p.decay) {
          if (p.age < p.attack) {
            p.alpha =
              ((p.holdValue - p.initValue) / p.attack) * p.age + p.initValue;
          } else if (p.age < p.attack + p.hold) {
            p.alpha = p.holdValue;
          } else {
            p.alpha =
              ((p.lastValue - p.holdValue) / p.decay) *
                (p.age - p.attack - p.hold) +
              p.holdValue;
          }
        } else {
          p.dead = true;
        }

        const outside =
          p.projX > displayWidth ||
          p.projX < 0 ||
          p.projY < 0 ||
          p.projY > displayHeight ||
          rotZ > zMax;

        if (outside || p.dead) {
          recycle(p);
        } else {
          let depthAlphaFactor = 1 - rotZ / zeroAlphaDepth;
          depthAlphaFactor =
            depthAlphaFactor > 1 ? 1 : depthAlphaFactor < 0 ? 0 : depthAlphaFactor;

          // Per-particle twinkle: gentle sine modulation of alpha
          p.twinklePhase += p.twinkleFreq;
          const twinkle = 1 - twinkleAmount + twinkleAmount * (0.5 + 0.5 * Math.sin(p.twinklePhase));

          const effectiveAlpha = depthAlphaFactor * p.alpha * twinkle;
          const baseR = m * particleRad;

          // 1. Outer bloom — large, very dim
          const outerColor = rgbPrefix();
          ctx!.fillStyle = outerColor + (effectiveAlpha * 0.06).toFixed(3) + ")";
          ctx!.beginPath();
          ctx!.arc(p.projX, p.projY, baseR * bloomScale, 0, 2 * Math.PI, false);
          ctx!.fill();

          // 2. Mid halo — colored, medium
          ctx!.fillStyle = outerColor + (effectiveAlpha * 0.4).toFixed(3) + ")";
          ctx!.beginPath();
          ctx!.arc(p.projX, p.projY, baseR, 0, 2 * Math.PI, false);
          ctx!.fill();

          // 3. Bright core — cream/white, tight
          ctx!.fillStyle = `rgba(${coreColor.r},${coreColor.g},${coreColor.b},${(effectiveAlpha * 0.85).toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(p.projX, p.projY, baseR * 0.4, 0, 2 * Math.PI, false);
          ctx!.fill();
        }

        p = nextParticle;
      }

      ctx!.globalCompositeOperation = "source-over";

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [
    size,
    radius,
    particlesPerFrame,
    particleRad,
    rotationSpeed,
    palette,
    primaryColor,
    coreColor,
    trailAlpha,
    bloomScale,
    twinkleAmount,
  ]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}

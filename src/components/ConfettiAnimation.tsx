"use client";

import { useEffect, useRef } from "react";

type AnimationType = "confetti" | "float-hearts" | "sparkles" | "shimmer" | "soft-pulse";

interface ConfettiAnimationProps {
  type: AnimationType;
}

export default function ConfettiAnimation({ type }: ConfettiAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (type === "confetti") {
      return runConfetti(ctx, canvas);
    }
    if (type === "float-hearts") {
      return runHearts(ctx, canvas);
    }
    if (type === "sparkles") {
      return runSparkles(ctx, canvas);
    }
  }, [type]);

  if (type === "shimmer" || type === "soft-pulse") {
    return (
      <div
        className={`fixed inset-0 z-40 pointer-events-none ${
          type === "shimmer" ? "animate-shimmer" : "animate-pulse-soft"
        }`}
        style={{
          background:
            type === "shimmer"
              ? "linear-gradient(90deg, transparent 0%, rgba(255,200,220,0.15) 50%, transparent 100%)"
              : "radial-gradient(circle at center, rgba(255,107,138,0.08) 0%, transparent 70%)",
          backgroundSize: type === "shimmer" ? "200% 100%" : undefined,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-40 pointer-events-none"
    />
  );
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

function runConfetti(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const colors = ["#ff6b8a", "#ff8fab", "#ffd1dc", "#fff0f5", "#ffffff", "#ffe4ec"];
  const particles: Particle[] = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * -1 - 20,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 3 + 2,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    opacity: 1,
  }));

  let frame = 0;
  let animId: number;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.vy += 0.03;
      if (frame > 120) p.opacity = Math.max(0, p.opacity - 0.015);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }
    if (frame < 240) {
      animId = requestAnimationFrame(draw);
    }
  }
  animId = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(animId);
}

function runHearts(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const hearts: Particle[] = Array.from({ length: 25 }, () => ({
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * 100,
    vx: (Math.random() - 0.5) * 1,
    vy: -(Math.random() * 2 + 1.5),
    size: Math.random() * 16 + 10,
    color: "",
    rotation: 0,
    rotationSpeed: 0,
    opacity: 0.8 + Math.random() * 0.2,
  }));

  let frame = 0;
  let animId: number;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    for (const h of hearts) {
      h.y += h.vy;
      h.x += h.vx + Math.sin(frame * 0.02 + h.x) * 0.3;
      if (frame > 100) h.opacity = Math.max(0, h.opacity - 0.008);

      ctx.save();
      ctx.globalAlpha = h.opacity;
      ctx.font = `${h.size}px serif`;
      ctx.fillText("💕", h.x, h.y);
      ctx.restore();
    }
    if (frame < 240) {
      animId = requestAnimationFrame(draw);
    }
  }
  animId = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(animId);
}

function runSparkles(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const sparkles: Particle[] = Array.from({ length: 40 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    return {
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 4 + 2,
      color: `hsl(${340 + Math.random() * 30}, 90%, ${70 + Math.random() * 20}%)`,
      rotation: 0,
      rotationSpeed: 0,
      opacity: 1,
    };
  });

  let frame = 0;
  let animId: number;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    for (const s of sparkles) {
      s.x += s.vx;
      s.y += s.vy;
      s.opacity = Math.max(0, s.opacity - 0.01);
      s.size *= 0.99;

      ctx.save();
      ctx.globalAlpha = s.opacity;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (frame < 180) {
      animId = requestAnimationFrame(draw);
    }
  }
  animId = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(animId);
}

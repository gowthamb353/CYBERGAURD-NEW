import React, { useEffect, useRef } from 'react';

interface ShieldAnimationProps {
  pulseTrigger?: number;
}

interface ThreatParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  deflected: boolean;
}

interface DeflectionRipple {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export const ShieldAnimation: React.FC<ShieldAnimationProps> = ({ pulseTrigger = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pulseIntensityRef = useRef<number>(0);

  // Trigger gentle pulse when pulseTrigger increments
  useEffect(() => {
    if (pulseTrigger > 0) {
      pulseIntensityRef.current = 1.0;
    }
  }, [pulseTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    if (prefersReducedMotion) {
      // Draw static subtle shield
      const cx = width / 2;
      const cy = height / 2;
      ctx.fillStyle = '#050b14';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.stroke();
      return () => window.removeEventListener('resize', handleResize);
    }

    const threats: ThreatParticle[] = [];
    const ripples: DeflectionRipple[] = [];

    // Shield geometry nodes (curved shield polygon points)
    const getShieldPoints = (cx: number, cy: number, scale = 1) => {
      const baseR = 145 * scale;
      return [
        { x: cx, y: cy - baseR * 1.15 },
        { x: cx + baseR * 0.85, y: cy - baseR * 0.85 },
        { x: cx + baseR * 0.95, y: cy + baseR * 0.1 },
        { x: cx + baseR * 0.65, y: cy + baseR * 0.75 },
        { x: cx, y: cy + baseR * 1.2 },
        { x: cx - baseR * 0.65, y: cy + baseR * 0.75 },
        { x: cx - baseR * 0.95, y: cy + baseR * 0.1 },
        { x: cx - baseR * 0.85, y: cy - baseR * 0.85 },
      ];
    };

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Pulse decay
      if (pulseIntensityRef.current > 0) {
        pulseIntensityRef.current = Math.max(0, pulseIntensityRef.current - 0.035);
      }
      const pulse = pulseIntensityRef.current;

      // Spawn threat particles occasionally (max 28 threats)
      if (threats.length < 24 && Math.random() < 0.08) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.max(width, height) * 0.55;
        const speed = 1.2 + Math.random() * 1.4;
        threats.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: -Math.cos(angle) * speed,
          vy: -Math.sin(angle) * speed,
          size: 2 + Math.random() * 2,
          color: Math.random() > 0.4 ? 'rgba(239, 68, 68, ' : 'rgba(249, 115, 22, ',
          alpha: 0.85,
          deflected: false,
        });
      }

      // Draw background ambient grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Shield scale reacts to breathing and pulse
      const breathe = Math.sin(time) * 0.02;
      const currentScale = 1 + breathe + pulse * 0.08;
      const shieldNodes = getShieldPoints(cx, cy, currentScale);

      // Glow behind shield
      const glowGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 220 * currentScale);
      glowGrad.addColorStop(0, `rgba(6, 182, 212, ${0.08 + pulse * 0.15})`);
      glowGrad.addColorStop(0.7, `rgba(56, 189, 248, ${0.03 + pulse * 0.08})`);
      glowGrad.addColorStop(1, 'rgba(5, 11, 20, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 220 * currentScale, 0, Math.PI * 2);
      ctx.fill();

      // Connect shield polygon
      ctx.beginPath();
      ctx.moveTo(shieldNodes[0].x, shieldNodes[0].y);
      for (let i = 1; i < shieldNodes.length; i++) {
        ctx.lineTo(shieldNodes[i].x, shieldNodes[i].y);
      }
      ctx.closePath();

      // Subtle shield fill
      ctx.fillStyle = `rgba(14, 34, 61, ${0.35 + pulse * 0.2})`;
      ctx.fill();

      // Shield border with glowing stroke
      ctx.strokeStyle = `rgba(6, 182, 212, ${0.45 + pulse * 0.45})`;
      ctx.lineWidth = 2 + pulse * 2;
      ctx.stroke();

      // Inner geometric lock shield grid lines
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.18 + pulse * 0.2})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < shieldNodes.length; i++) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(shieldNodes[i].x, shieldNodes[i].y);
        ctx.stroke();
      }

      // Draw shield vertex nodes
      for (let i = 0; i < shieldNodes.length; i++) {
        const node = shieldNodes[i];
        ctx.fillStyle = `rgba(56, 189, 248, ${0.8 + pulse * 0.2})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3.5 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Node halo
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.4 + pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 7 + pulse * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Central Lock Icon (stylized vector)
      const lockY = cy;
      ctx.save();
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.75 + pulse * 0.25})`;
      ctx.lineWidth = 2.5;

      // Shackle
      ctx.beginPath();
      ctx.arc(cx, lockY - 14, 12, Math.PI, 0, false);
      ctx.lineTo(cx + 12, lockY - 2);
      ctx.lineTo(cx - 12, lockY - 2);
      ctx.stroke();

      // Body
      ctx.fillStyle = `rgba(6, 182, 212, ${0.3 + pulse * 0.3})`;
      ctx.fillRect(cx - 16, lockY - 2, 32, 24);
      ctx.strokeRect(cx - 16, lockY - 2, 32, 24);

      // Keyhole
      ctx.fillStyle = `rgba(255, 255, 255, ${0.85 + pulse * 0.15})`;
      ctx.beginPath();
      ctx.arc(cx, lockY + 7, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx - 1.5, lockY + 8);
      ctx.lineTo(cx + 1.5, lockY + 8);
      ctx.lineTo(cx + 2.5, lockY + 15);
      ctx.lineTo(cx - 2.5, lockY + 15);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Update & Draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 1.8;
        r.alpha -= 0.035;

        if (r.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(56, 189, 248, ${r.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Update & Draw threat particles
      const shieldRadius = 150 * currentScale;

      for (let i = threats.length - 1; i >= 0; i--) {
        const t = threats[i];
        t.x += t.vx;
        t.y += t.vy;

        const dx = t.x - cx;
        const dy = t.y - cy;
        const distToCenter = Math.sqrt(dx * dx + dy * dy);

        // Check shield collision
        if (!t.deflected && distToCenter <= shieldRadius) {
          t.deflected = true;
          // Deflect outward with randomized angle
          const deflectAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
          const bounceSpeed = 2.4 + Math.random() * 1.5;
          t.vx = Math.cos(deflectAngle) * bounceSpeed;
          t.vy = Math.sin(deflectAngle) * bounceSpeed;

          // Add deflection ripple
          ripples.push({
            x: t.x,
            y: t.y,
            radius: 4,
            alpha: 0.9,
          });
        }

        if (t.deflected) {
          t.alpha -= 0.025;
        }

        // Out of screen or faded out
        if (t.alpha <= 0 || t.x < -50 || t.x > width + 50 || t.y < -50 || t.y > height + 50) {
          threats.splice(i, 1);
          continue;
        }

        // Draw threat particle
        ctx.fillStyle = `${t.color}${t.alpha})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle threat tail
        ctx.strokeStyle = `${t.color}${t.alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(t.x - t.vx * 3, t.y - t.vy * 3);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
};

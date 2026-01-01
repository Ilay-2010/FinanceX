import React, { useRef, useEffect } from 'react';

interface ThreadsProps {
  amplitude?: number;
  distance?: number;
  enableMouseInteraction?: boolean;
}

const Threads: React.FC<ThreadsProps> = ({
  amplitude = 1,
  enableMouseInteraction = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;

    const threadsCount = 45;
    const pointsCount = 25;
    const threads: { points: { x: number; y: number; ox: number; oy: number }[]; color: string }[] = [];

    const init = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      threads.length = 0;
      const isDark = document.documentElement.classList.contains('dark');
      
      for (let i = 0; i < threadsCount; i++) {
        const points = [];
        const ox = (width / threadsCount) * i + (Math.random() - 0.5) * 60;
        for (let j = 0; j < pointsCount; j++) {
          const oy = (height / pointsCount) * j;
          points.push({ x: ox, y: oy, ox, oy });
        }
        
        const alpha = isDark ? 0.08 + Math.random() * 0.12 : 0.03 + Math.random() * 0.05;
        const color = `rgba(255, 159, 252, ${alpha})`;
        
        threads.push({ points, color });
      }
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = time * 0.0008;

      threads.forEach((thread, threadIdx) => {
        ctx.beginPath();
        ctx.strokeStyle = thread.color;
        ctx.lineWidth = 0.8;

        thread.points.forEach((p, i) => {
          const noise = Math.sin(t + i * 0.25 + threadIdx * 0.4) * 25 * amplitude;
          const targetX = p.ox + noise;
          
          if (enableMouseInteraction) {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
              const force = (200 - dist) / 200;
              p.x += (mouseX - p.x) * force * 0.015;
            }
          }

          p.x += (targetX - p.x) * 0.04;

          if (i === 0) ctx.moveTo(p.x, p.y);
          else {
            const prev = thread.points[i - 1];
            const cx = (p.x + prev.x) / 2;
            const cy = (p.y + prev.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
          }
        });

        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleResize = () => init();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Watch for theme changes to re-init colors
    const observer = new MutationObserver(handleResize);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    init();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [amplitude, enableMouseInteraction]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default Threads;

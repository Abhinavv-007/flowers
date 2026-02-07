import React, { useEffect, useRef } from 'react';

export const AuroraBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // Aurora wave parameters
    const waves = [
      { speed: 0.0005, amplitude: 80, frequency: 0.002, offset: 0, alpha: 0.08 },
      { speed: 0.0007, amplitude: 100, frequency: 0.0015, offset: 100, alpha: 0.06 },
      { speed: 0.0003, amplitude: 60, frequency: 0.0025, offset: 200, alpha: 0.1 },
    ];

    let time = 0;

    const drawAurora = () => {
      // Very subtle dark background overlay
      ctx.fillStyle = 'rgba(15, 5, 5, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      waves.forEach((wave, index) => {
        time += wave.speed;

        // Create gradient for each wave
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        
        // Green aurora colors - very subtle
        if (index === 0) {
          gradient.addColorStop(0, `rgba(16, 185, 129, ${wave.alpha})`); // emerald
          gradient.addColorStop(0.5, `rgba(5, 150, 105, ${wave.alpha * 0.7})`);
          gradient.addColorStop(1, `rgba(4, 120, 87, 0)`);
        } else if (index === 1) {
          gradient.addColorStop(0, `rgba(52, 211, 153, ${wave.alpha})`); // lighter emerald
          gradient.addColorStop(0.5, `rgba(16, 185, 129, ${wave.alpha * 0.6})`);
          gradient.addColorStop(1, `rgba(5, 150, 105, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(110, 231, 183, ${wave.alpha})`); // very light emerald
          gradient.addColorStop(0.5, `rgba(52, 211, 153, ${wave.alpha * 0.5})`);
          gradient.addColorStop(1, `rgba(16, 185, 129, 0)`);
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        // Draw flowing wave
        for (let x = 0; x <= canvas.width; x += 5) {
          // Add mouse interaction - very subtle
          const distanceToMouse = Math.sqrt(
            Math.pow(x - mouseX, 2) + Math.pow(canvas.height / 2 - mouseY, 2)
          );
          const mouseInfluence = Math.max(0, 1 - distanceToMouse / 300) * 20;

          const y =
            canvas.height / 2 +
            wave.offset +
            Math.sin(x * wave.frequency + time) * wave.amplitude +
            Math.cos(x * wave.frequency * 1.3 + time * 0.7) * (wave.amplitude * 0.5) +
            mouseInfluence;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawAurora);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      resize();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    drawAurora();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

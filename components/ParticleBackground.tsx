import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    hue: number;
    life: number;
    velocityChange: number;
}

export const ParticleBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();

        const particles: Particle[] = [];

        // Create more particles for a futuristic look (60-80 particles)
        const particleCount = 70;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5, // Smaller: 0.5-2px
                speedX: (Math.random() - 0.5) * 2, // More random speeds
                speedY: (Math.random() - 0.5) * 2,
                opacity: Math.random() * 0.6 + 0.2, // 0.2-0.8
                hue: Math.random() * 40 + 140, // Green hues: 140-180
                life: Math.random() * Math.PI * 2, // For pulsing effect
                velocityChange: Math.random() * 0.02 + 0.01, // Random acceleration
            });
        }

        const drawParticles = () => {
            // Darker fade for trail effect
            ctx.fillStyle = 'rgba(15, 5, 5, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            time += 0.01;

            particles.forEach((particle, index) => {
                // Completely random, chaotic movement - no patterns
                particle.speedX += (Math.random() - 0.5) * 0.1;
                particle.speedY += (Math.random() - 0.5) * 0.1;

                // Limit max speed for aesthetic control
                const maxSpeed = 2.5;
                particle.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, particle.speedX));
                particle.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, particle.speedY));

                // Apply friction for natural deceleration
                particle.speedX *= 0.98;
                particle.speedY *= 0.98;

                // Random turbulence boost
                if (Math.random() < 0.02) {
                    particle.speedX += (Math.random() - 0.5) * 3;
                    particle.speedY += (Math.random() - 0.5) * 3;
                }

                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Bounce off edges instead of wrapping for more dynamic feel
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.speedX *= -0.8;
                    particle.x = Math.max(0, Math.min(canvas.width, particle.x));
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.speedY *= -0.8;
                    particle.y = Math.max(0, Math.min(canvas.height, particle.y));
                }

                // Pulsing life cycle
                particle.life += particle.velocityChange;
                const pulse = Math.sin(particle.life) * 0.3 + 0.7;

                // Dynamic opacity based on movement speed
                const speed = Math.sqrt(particle.speedX ** 2 + particle.speedY ** 2);
                const dynamicOpacity = particle.opacity * pulse * Math.min(1, speed / 2);

                // Draw particle with enhanced glow
                const glowSize = particle.size * 8 * pulse;

                // Outer glow
                const outerGlow = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, glowSize
                );
                outerGlow.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${dynamicOpacity * 0.8})`);
                outerGlow.addColorStop(0.3, `hsla(${particle.hue}, 65%, 50%, ${dynamicOpacity * 0.4})`);
                outerGlow.addColorStop(0.6, `hsla(${particle.hue}, 60%, 40%, ${dynamicOpacity * 0.1})`);
                outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = outerGlow;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
                ctx.fill();

                // Inner bright core
                const coreGlow = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 2
                );
                coreGlow.addColorStop(0, `hsla(${particle.hue}, 90%, 80%, ${dynamicOpacity})`);
                coreGlow.addColorStop(0.5, `hsla(${particle.hue}, 80%, 60%, ${dynamicOpacity * 0.6})`);
                coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = coreGlow;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                ctx.fill();

                // Occasionally spawn new random trajectory
                if (Math.random() < 0.001) {
                    particle.speedX = (Math.random() - 0.5) * 4;
                    particle.speedY = (Math.random() - 0.5) * 4;
                }
            });

            animationFrameId = requestAnimationFrame(drawParticles);
        };

        const handleResize = () => {
            resize();
        };

        window.addEventListener('resize', handleResize);
        drawParticles();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
        />
    );
};

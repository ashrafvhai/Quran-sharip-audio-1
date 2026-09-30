import React, { useEffect, useRef } from 'react';
import { BackgroundTheme } from '../types/quran';

interface BackgroundVideoProps {
  theme: BackgroundTheme;
  isVideoEnabled: boolean;
  dimmerOpacity: number; // 0.3 to 0.9
  blurAmount: number; // 0 to 16
  isParticlesEnabled: boolean;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  theme,
  isVideoEnabled,
  dimmerOpacity,
  blurAmount,
  isParticlesEnabled
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Particle animation loop
  useEffect(() => {
    if (!isParticlesEnabled || theme.ambientType === 'none') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle setups
    const ambientType = theme.ambientType;
    const particleCount = ambientType === 'rain' ? 80 : ambientType === 'stars' ? 90 : 45;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      length?: number;
    }

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: ambientType === 'stars' ? Math.random() * 2 + 0.8 : Math.random() * 3 + 1,
      speedY: ambientType === 'rain' ? Math.random() * 8 + 6 : (Math.random() - 0.5) * 0.4,
      speedX: ambientType === 'rain' ? -0.8 : (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.2,
      fadeSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      length: ambientType === 'rain' ? Math.random() * 15 + 10 : undefined
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Rain particles
        if (ambientType === 'rain') {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(200, 230, 255, ${p.opacity * 0.5})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + (p.length || 15));
          ctx.stroke();

          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * width;
          }
        } else if (ambientType === 'stars') {
          // Star twinkle
          p.opacity += p.fadeSpeed;
          if (p.opacity > 0.95 || p.opacity < 0.15) {
            p.fadeSpeed = -p.fadeSpeed;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (ambientType === 'gold_dust') {
          // Golden floating dust motes
          p.opacity += p.fadeSpeed;
          if (p.opacity > 0.8 || p.opacity < 0.2) {
            p.fadeSpeed = -p.fadeSpeed;
          }
          p.x += p.speedX;
          p.y -= Math.abs(p.speedY) * 0.5; // slow float upwards

          if (p.y < 0) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(234, 179, 8, ${p.opacity * 0.6})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(234, 179, 8, 0.4)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme.ambientType, isParticlesEnabled]);

  // Video autoplay helper
  useEffect(() => {
    if (videoRef.current && isVideoEnabled && theme.videoUrl) {
      videoRef.current.play().catch(() => {
        // Video autoplay was prevented or network error; gracefully fallback to image
      });
    }
  }, [isVideoEnabled, theme.videoUrl, theme.id]);

  const hasVideo = Boolean(isVideoEnabled && theme.videoUrl);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-slate-950">
      {/* Fallback & Base Image */}
      {theme.imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
          style={{
            backgroundImage: `url(${theme.imageUrl})`,
            filter: `blur(${blurAmount}px)`
          }}
        />
      )}

      {/* Looping Ambient Video */}
      {hasVideo && (
        <video
          ref={videoRef}
          key={theme.videoUrl}
          src={theme.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{
            filter: `blur(${blurAmount}px)`,
            opacity: 0.85
          }}
        />
      )}

      {/* Ambient Particle Canvas */}
      {isParticlesEnabled && theme.ambientType !== 'none' && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />
      )}

      {/* Dimmer Scrim & Contrast Gradient */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          backgroundColor: `rgba(3, 7, 18, ${dimmerOpacity})`
        }}
      />

      {/* Subtle Top & Bottom vignette for maximum typographic readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90 pointer-events-none" />
    </div>
  );
};

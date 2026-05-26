import React, { useEffect, useRef, useState } from 'react';
import { useDebug } from './utils/DebugContext';

const PredictiveDebugger = () => {
  const { debugData, isEnabled } = useDebug();
  const canvasRef = useRef(null);
  const [trail, setIntentTrail] = useState([]);

  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (e) => {
      // Find the highest score among all tracked elements for trail color
      const maxScore = Math.max(0, ...Object.values(debugData).map(d => d.score));
      
      setIntentTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, score: maxScore, time: Date.now() }];
        // Keep only last 50 dots or dots from last 2 seconds
        return newTrail.filter(p => Date.now() - p.time < 2000).slice(-50);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isEnabled, debugData]);

  useEffect(() => {
    if (!isEnabled || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Intent Trail
      trail.forEach((p, i) => {
        const alpha = (i / trail.length) * 0.8;
        // Red (0 score) to Green (1 score)
        const r = Math.floor(255 * (1 - p.score));
        const g = Math.floor(255 * p.score);
        ctx.fillStyle = `rgba(${r}, ${g}, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Target Info & Vector Ghost
      Object.entries(debugData).forEach(([url, data]) => {
        const { rect, score, velocity, cursor } = data;
        
        // Draw score label
        ctx.fillStyle = score > 0.85 ? '#38a169' : '#e53e3e';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(`Score: ${score.toFixed(3)}`, rect.left, rect.top - 10);
        
        // Draw Vector Ghost (velocity line)
        if (score > 0.1) {
            ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(cursor.x, cursor.y);
            // Draw line in direction of velocity (scaled)
            ctx.lineTo(cursor.x + velocity.x * 0.2, cursor.y + velocity.y * 0.2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
      });

      requestAnimationFrame(draw);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    const animationId = requestAnimationFrame(draw);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isEnabled, debugData, trail]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};

export default PredictiveDebugger;

import { useEffect, useRef, useState, useCallback } from 'react';
import MarkovTracker from './MarkovTracker';

/**
 * usePredictiveFetch
 * A React hook that prefetches data based on either:
 * 1. High-confidence behavioral sequence (Markov Chain)
 * 2. Mouse kinematics (Kinematic intent prediction)
 * 
 * @param {React.RefObject} targetRef - Ref to the target DOM element.
 * @param {string} url - The GET endpoint to prefetch.
 * @param {Object} options - Optional configuration.
 * @param {number} options.ttl - Cache TTL in milliseconds (default 5000).
 * @param {number} options.threshold - Probability threshold (default 0.85).
 * @param {string} options.routeKey - The route identifier for Markov prediction.
 */
export const usePredictiveFetch = (targetRef, url, { ttl = 5000, threshold = 0.85, routeKey } = {}) => {
  const [data, setData] = useState(null);
  const cache = useRef(new Map());
  
  // Kinematic state
  const state = useRef({
    lastX: null,
    lastY: null,
    lastTime: null,
    currentX: null,
    currentY: null,
    velocity: { x: 0, y: 0 },
    speed: 0,
    acceleration: 0,
    isTicking: false,
    hasFired: false
  });

  const performFetch = useCallback(async (targetUrl) => {
    const cachedEntry = cache.current.get(targetUrl);
    const now = Date.now();

    // Only update state if data is NEW or cache was empty
    if (cachedEntry && (now - cachedEntry.timestamp < ttl)) {
      setData(prev => (prev === cachedEntry.data ? prev : cachedEntry.data));
      return;
    }

    try {
      const response = await fetch(targetUrl, { method: 'GET' });
      if (!response.ok) throw new Error('Prefetch failed');
      
      const json = await response.json();
      const newEntry = { data: json, timestamp: Date.now() };
      
      cache.current.set(targetUrl, newEntry);
      setData(json);
    } catch (err) {
      console.warn('Predictive fetch failed:', err);
    }
  }, [ttl]);

  const calculateProbability = useCallback(() => {
    const s = state.current;
    if (!targetRef.current) return 0;

    const rect = targetRef.current.getBoundingClientRect();
    const targetCenterX = rect.left + rect.width / 2;
    const targetCenterY = rect.top + rect.height / 2;

    const toTargetX = targetCenterX - s.currentX;
    const toTargetY = targetCenterY - s.currentY;
    const distance = Math.sqrt(toTargetX * toTargetX + toTargetY * toTargetY);

    // Filter noise: ignore if very slow or very far
    if (distance < 10 || s.speed < 40) {
      if (distance > 200) s.hasFired = false;
      return 0;
    }

    const normVx = s.velocity.x / s.speed;
    const normVy = s.velocity.y / s.speed;
    const normTx = toTargetX / distance;
    const normTy = toTargetY / distance;
    const dotProduct = (normVx * normTx) + (normVy * normTy);
    
    // REQUIRE sharp alignment (within ~36 degrees)
    if (dotProduct < 0.8) {
      s.hasFired = false;
      return 0;
    }
    
    // Normalize deceleration: ignore micro-jitter (< 500 px/s2)
    let decelerationFactor = 0;
    if (s.acceleration < -500) { 
       decelerationFactor = Math.min(1, Math.abs(s.acceleration) / 4000);
    }

    const proximity = Math.max(0, 1 - (distance / 600));

    // Composite score: Alignment (40%), Deceleration (40%), Proximity (20%)
    const score = (dotProduct * 0.4) + (decelerationFactor * 0.4) + (proximity * 0.2);

    if (score > threshold && !s.hasFired) {
      s.hasFired = true;
      performFetch(url);
    } else if (score < 0.4) {
      s.hasFired = false;
    }

    return score;
  }, [url, threshold, targetRef, performFetch]);

  const update = useCallback(() => {
    const s = state.current;
    const now = performance.now();
    
    if (s.lastTime !== null) {
      const dt = (now - s.lastTime) / 1000;
      if (dt > 0) {
        const dx = s.currentX - s.lastX;
        const dy = s.currentY - s.lastY;
        const vx = dx / dt;
        const vy = dy / dt;
        const currentSpeed = Math.sqrt(vx * vx + vy * vy);
        
        s.acceleration = (currentSpeed - s.speed) / dt;
        s.velocity = { x: vx, y: vy };
        s.speed = currentSpeed;

        calculateProbability();
      }
    }

    s.lastX = s.currentX;
    s.lastY = s.currentY;
    s.lastTime = now;
    s.isTicking = false;
  }, [calculateProbability]);

  // Markov Integration: Immediate fetch if confidence is high
  useEffect(() => {
    const currentPath = window.location.pathname;
    const prediction = MarkovTracker.predictNext(currentPath);

    if (prediction && prediction.confidence > 0.8 && prediction.route === routeKey) {
      console.log(`Markov Confidence Met (${(prediction.confidence * 100).toFixed(0)}%): Prefetching ${routeKey}`);
      performFetch(url);
    }
  }, [url, routeKey, performFetch]);

  useEffect(() => {
    const s = state.current;
    
    const handleMouseMove = (e) => {
      s.currentX = e.clientX;
      s.currentY = e.clientY;
      
      if (!s.isTicking) {
        requestAnimationFrame(update);
        s.isTicking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [update]);

  return data;
};

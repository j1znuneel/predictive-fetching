/**
 * Calculates the best directional alignment toward a rectangular target.
 * It checks the vector toward the center and the four corners of the target's bounding box,
 * returning the maximum dot product found.
 * 
 * @param {{x: number, y: number}} cursorPos - Current cursor coordinates.
 * @param {{x: number, y: number}} velocity - Current velocity vector.
 * @param {DOMRect | Object} rect - Bounding box of the target element.
 * @returns {number} The maximum dot product (alignment score).
 */
export const calculateBestFitAlignment = (cursorPos, velocity, rect) => {
  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  if (speed === 0) return 0;

  const points = [
    { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, // Center
    { x: rect.left, y: rect.top }, // Top-left
    { x: rect.right || (rect.left + rect.width), y: rect.top }, // Top-right
    { x: rect.left, y: rect.bottom || (rect.top + rect.height) }, // Bottom-left
    { x: rect.right || (rect.left + rect.width), y: rect.bottom || (rect.top + rect.height) } // Bottom-right
  ];

  const normVx = velocity.x / speed;
  const normVy = velocity.y / speed;

  let maxDot = -Infinity;

  for (const point of points) {
    const dx = point.x - cursorPos.x;
    const dy = point.y - cursorPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      const dot = (normVx * (dx / dist)) + (normVy * (dy / dist));
      if (dot > maxDot) maxDot = dot;
    }
  }

  return maxDot === -Infinity ? 0 : maxDot;
};

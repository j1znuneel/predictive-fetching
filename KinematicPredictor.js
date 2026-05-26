/**
 * KinematicPredictor
 * A lightweight, dependency-free class to predict user click intent based on mouse kinematics.
 */
class KinematicPredictor {
  /**
   * @param {HTMLElement} element - The target DOM element to monitor.
   */
  constructor(element) {
    if (!element) throw new Error('Target element is required');
    
    this.target = element;
    this.lastX = null;
    this.lastY = null;
    this.lastTime = null;
    this.currentX = null;
    this.currentY = null;
    
    this.velocity = { x: 0, y: 0 };
    this.speed = 0;
    this.acceleration = 0;
    
    this.isTicking = false;
    this.predictionThreshold = 0.85;
    this.hasFired = false; // Prevent spamming logs for a single approach

    this._onMouseMove = this.handleMouseMove.bind(this);
    this._tick = this.update.bind(this);
    
    this.init();
  }

  init() {
    window.addEventListener('mousemove', this._onMouseMove, { passive: true });
  }

  /**
   * Remove event listeners and clean up.
   */
  destroy() {
    window.removeEventListener('mousemove', this._onMouseMove);
  }

  handleMouseMove(e) {
    this.currentX = e.clientX;
    this.currentY = e.clientY;
    
    if (!this.isTicking) {
      requestAnimationFrame(this._tick);
      this.isTicking = true;
    }
  }

  update() {
    const now = performance.now();
    
    if (this.lastTime !== null) {
      const dt = (now - this.lastTime) / 1000; // Time delta in seconds

      if (dt > 0) {
        const dx = this.currentX - this.lastX;
        const dy = this.currentY - this.lastY;
        
        const vx = dx / dt;
        const vy = dy / dt;
        const currentSpeed = Math.sqrt(vx * vx + vy * vy);
        
        // Acceleration (derivative of velocity magnitude)
        this.acceleration = (currentSpeed - this.speed) / dt;
        this.velocity = { x: vx, y: vy };
        this.speed = currentSpeed;

        this.calculateProbability();
      }
    }

    this.lastX = this.currentX;
    this.lastY = this.currentY;
    this.lastTime = now;
    this.isTicking = false;
  }

  calculateProbability() {
    const rect = this.target.getBoundingClientRect();
    const targetCenterX = rect.left + rect.width / 2;
    const targetCenterY = rect.top + rect.height / 2;

    const toTargetX = targetCenterX - this.currentX;
    const toTargetY = targetCenterY - this.currentY;
    const distance = Math.sqrt(toTargetX * toTargetX + toTargetY * toTargetY);

    // Minimum speed threshold to avoid noise from jitter or tiny movements
    if (distance < 5 || this.speed < 20) {
      if (distance > 100) this.hasFired = false; // Reset if they move away
      return 0;
    }

    // Directional Vector Alignment (Dot Product)
    const normVx = this.velocity.x / this.speed;
    const normVy = this.velocity.y / this.speed;
    const normTx = toTargetX / distance;
    const normTy = toTargetY / distance;

    const dotProduct = (normVx * normTx) + (normVy * normTy);
    
    // Logic:
    // 1. alignment: how much is the velocity pointing towards the target?
    const alignment = Math.max(0, dotProduct);
    
    // 2. deceleration: is the user slowing down as they get closer?
    // Fitts's Law suggests deceleration as the cursor enters the target's "functional" area.
    // We normalize deceleration against a typical "braking" value.
    let decelerationFactor = 0;
    if (this.acceleration < -100) { // Significant slowing
       decelerationFactor = Math.min(1, Math.abs(this.acceleration) / 3000);
    }

    // 3. proximity: the closer the cursor, the more certain we are of the intent
    const proximity = Math.max(0, 1 - (distance / 800));

    // Combine factors
    // Alignment is the primary signal. Deceleration confirms intent.
    let score = 0;
    if (alignment > 0.7) {
        // High weight on alignment, supplemented by deceleration and proximity
        score = (alignment * 0.5) + (decelerationFactor * 0.3) + (proximity * 0.2);
    }

    if (score > this.predictionThreshold && !this.hasFired) {
      console.log(`Prediction Threshold Met: User will click [${this.target.id || this.target.tagName}]`);
      this.hasFired = true;
    } else if (score < 0.5) {
      this.hasFired = false; // Reset when intent drops
    }

    return score;
  }
}

// Export for usage if in a module environment, or keep global for vanilla scripts
if (typeof module !== 'undefined') {
  module.exports = KinematicPredictor;
}

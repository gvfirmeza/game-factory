/**
 * Responsive Canvas renderer with high-DPI retina support and camera transformations.
 */
export class CanvasRenderer {
  constructor(canvas, virtualWidth = 720, virtualHeight = 450) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.virtualWidth = virtualWidth;
    this.virtualHeight = virtualHeight;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dpr = window.devicePixelRatio || 1;

    this.resize = this.resize.bind(this);
    this.resize();
    window.addEventListener('resize', this.resize);
    document.addEventListener('fullscreenchange', this.resize);
  }

  resize() {
    const parent = this.canvas.parentElement || document.body;
    const containerWidth = parent.clientWidth || window.innerWidth || this.virtualWidth;
    const containerHeight = parent.clientHeight || window.innerHeight || this.virtualHeight;

    if (containerWidth <= 0 || containerHeight <= 0) return;

    // Calculate aspect-ratio preserving fit
    const scaleX = containerWidth / this.virtualWidth;
    const scaleY = containerHeight / this.virtualHeight;
    this.scale = Math.min(scaleX, scaleY);
    if (this.scale <= 0 || !isFinite(this.scale)) this.scale = 1;

    const displayWidth = Math.max(1, Math.floor(this.virtualWidth * this.scale));
    const displayHeight = Math.max(1, Math.floor(this.virtualHeight * this.scale));

    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(displayWidth * this.dpr);
    this.canvas.height = Math.floor(displayHeight * this.dpr);

    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;

    this.offsetX = (containerWidth - displayWidth) / 2;
    this.offsetY = (containerHeight - displayHeight) / 2;
  }

  beginFrame(camera = null) {
    this.ctx.save();
    this.ctx.scale(this.dpr * this.scale, this.dpr * this.scale);

    // Clear frame
    this.ctx.clearRect(0, 0, this.virtualWidth, this.virtualHeight);

    // Apply camera transform if provided
    if (camera) {
      this.ctx.save();
      this.ctx.translate(-camera.x + (camera.shakeX || 0), -camera.y + (camera.shakeY || 0));
    }
  }

  endWorldFrame(camera = null) {
    if (camera) {
      this.ctx.restore();
    }
  }

  endFrame() {
    this.ctx.restore();
  }

  screenToWorld(clientX, clientY, camera = null) {
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = (clientX - rect.left) / this.scale;
    const canvasY = (clientY - rect.top) / this.scale;

    return {
      x: canvasX + (camera ? camera.x : 0),
      y: canvasY + (camera ? camera.y : 0)
    };
  }

  destroy() {
    window.removeEventListener('resize', this.resize);
    document.removeEventListener('fullscreenchange', this.resize);
  }
}

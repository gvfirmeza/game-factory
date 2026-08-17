/**
 * Explicit, strongly-typed rendering layers for consistent visual hierarchy.
 * Prevents world geometry or gameplay objects from accidentally overlapping UI or dialogue.
 */
export const RenderLayers = Object.freeze({
  BACKGROUND: 0,   // Parallax skies, distant mountains, backdrop geometry
  WORLD_BACK: 10,  // Background walls, ambient foliage, decorative pillars
  WORLD: 20,       // Solid platforms, ground geometry, hazard spikes, water
  PROPS: 30,       // Shrines, waystones, doors, springboards, updrafts
  COLLECTIBLES: 40,// Coins, berries, shells, gems, medallions
  CHARACTERS: 50,  // Player, enemies, NPCs, bosses
  EFFECTS: 60,     // Particles, shockwaves, splash effects, wind trails
  WORLD_UI: 70,    // Floating damage numbers, prompt indicators, quest arrows
  DIALOGUE: 80,    // Dialogue box, character portraits, typewriter text
  HUD: 90,         // Health hearts, item counters, control hints, boss bar
  OVERLAY: 100     // Screen flashes, fade transitions, pause modal, victory screen
});

export class LayeredRenderer {
  constructor() {
    this.drawQueues = new Map();
    Object.values(RenderLayers).forEach(layer => {
      this.drawQueues.set(layer, []);
    });
  }

  /**
   * Enqueue a draw command to be executed in a specific layer.
   * @param {number} layer - One of RenderLayers
   * @param {Function} drawFn - Function receiving (ctx, camera)
   */
  draw(layer, drawFn) {
    if (!this.drawQueues.has(layer)) {
      this.drawQueues.set(layer, []);
    }
    this.drawQueues.get(layer).push(drawFn);
  }

  /**
   * Flush and execute all queued draw commands in strict ascending z-order.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} camera
   */
  flush(ctx, camera = null) {
    const sortedLayers = Array.from(this.drawQueues.keys()).sort((a, b) => a - b);
    for (const layer of sortedLayers) {
      const queue = this.drawQueues.get(layer);
      for (let i = 0; i < queue.length; i++) {
        queue[i](ctx, camera);
      }
      queue.length = 0; // Clear queue for next frame
    }
  }

  clear() {
    for (const queue of this.drawQueues.values()) {
      queue.length = 0;
    }
  }
}

export class GameLoop {
  constructor(update, render) {
    this.update = update;
    this.render = render;
    this.lastTime = performance.now();
    this.rafId = null;
    this.loop = this.loop.bind(this);
  }

  start() {
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  loop(now) {
    let dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    dt = Math.min(dt, 0.033);

    this.update(dt);
    this.render();

    this.rafId = requestAnimationFrame(this.loop);
  }
}

import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, CONFIG.PLAYER_W, CONFIG.PLAYER_H);
    this.facing = 1;
    this.walkAnim = 0;
  }

  updateMovement(dt, keys) {
    let ax = 0;
    if (keys.left) ax -= 1;
    if (keys.right) ax += 1;

    this.vx = ax * CONFIG.MOVE_SPEED;
    if (this.vx > 8) this.facing = 1;
    if (this.vx < -8) this.facing = -1;

    this.x += this.vx * dt;
    
    if (this.x < CONFIG.WALL_MARGIN) {
      this.x = CONFIG.WALL_MARGIN;
      if (this.vx < 0) this.vx = 0;
    }
    if (this.x > CONFIG.W - CONFIG.WALL_MARGIN) {
      this.x = CONFIG.W - CONFIG.WALL_MARGIN;
      if (this.vx > 0) this.vx = 0;
    }

    this.walkAnim += dt * (Math.abs(this.vx) > 5 ? 10 : 2);
  }

  render(ctx, cameraY) {
    const sy = this.y - cameraY;
    const x = this.x;
    const w = this.w;
    const h = this.h;
    const bob = Math.abs(this.vx) > 5 ? Math.sin(this.walkAnim) * 1.5 : 0;

    ctx.save();
    ctx.translate(x, sy + bob);

    ctx.fillStyle = '#2b3a67';
    ctx.fillRect(-w / 2 + 2, h / 2 - 8, 6, 8);
    ctx.fillRect(w / 2 - 8, h / 2 - 8, 6, 8);

    ctx.fillStyle = '#3ea6ff';
    ctx.fillRect(-w / 2, -h / 2 + 10, w, h - 16);

    ctx.fillStyle = '#ffd8a8';
    ctx.fillRect(-w / 2 + 3, -h / 2, w - 6, 14);

    ctx.fillStyle = '#2b1d14';
    ctx.fillRect(-w / 2 + 2, -h / 2 - 2, w - 4, 5);

    ctx.fillStyle = '#1a1a1a';
    const eyeOffset = this.facing >= 0 ? 3 : -3;
    ctx.fillRect(eyeOffset - 1, -h / 2 + 6, 2, 3);
    ctx.fillRect(eyeOffset + 4, -h / 2 + 6, 2, 3);

    ctx.restore();
  }
}

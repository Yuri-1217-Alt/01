import { CONFIG } from '../config.js';

export class Physics {
  static applyGravity(entity, dt) {
    entity.vy += CONFIG.GRAVITY * dt;
    if (entity.vy > CONFIG.MAX_FALL_SPEED) entity.vy = CONFIG.MAX_FALL_SPEED;
  }

  static checkCollisions(player, platforms, prevY, onHitNormal, onHitSpike) {
    if (player.vy <= 0) return;
    
    const prevBottom = prevY + player.h / 2;
    const currBottom = player.y + player.h / 2;

    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      const left = p.x - p.w / 2;
      const right = p.x + p.w / 2;
      
      const overlapX = (player.x + player.w * 0.28) > left && (player.x - player.w * 0.28) < right;
      const surfaceY = p.type === 'spike' ? (p.y - CONFIG.PLAT_H - CONFIG.SPIKE_TIP_H) : (p.y - CONFIG.PLAT_H);
      
      if (overlapX && prevBottom <= surfaceY && currBottom >= surfaceY) {
        if (p.type === 'spike') {
          onHitSpike();
        } else {
          onHitNormal(surfaceY);
        }
        break;
      }
    }
  }
}

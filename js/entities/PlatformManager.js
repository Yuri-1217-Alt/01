import { CONFIG } from '../config.js';

function rand(a, b) { return a + Math.random() * (b - a); }

export class PlatformManager {
  constructor() {
    this.platforms = [];
    this.spikeStreak = 0;
    this.lastPlatformX = CONFIG.W / 2;
    this.totalTime = 0;
  }

  reset() {
    this.platforms = [];
    this.spikeStreak = 0;
    this.lastPlatformX = CONFIG.W / 2;
    this.totalTime = 0;
    // Starting safe platform
    this.platforms.push({ x: CONFIG.W / 2, y: 220, w: 140, type: 'normal', vx: 0 });
    let y = 220;
    while (y < CONFIG.H + 200) {
      y += rand(CONFIG.GAP_MIN, CONFIG.GAP_MAX);
      this.spawnPlatformAt(y, 0);
    }
  }

  spawnPlatformAt(y, currentScore) {
    const w = rand(CONFIG.PLAT_W_MIN, CONFIG.PLAT_W_MAX);
    let x;
    if (Math.random() < 0.35) {
      const hugLeft = Math.random() < 0.5;
      x = hugLeft ? (CONFIG.WALL_MARGIN + w / 2) : (CONFIG.W - CONFIG.WALL_MARGIN - w / 2);
    } else {
      x = rand(w / 2 + 12, CONFIG.W - w / 2 - 12);
    }

    if (Math.abs(x - this.lastPlatformX) < CONFIG.MIN_ADJACENT_X_GAP) {
      if (this.lastPlatformX < CONFIG.W / 2) {
        x = Math.min(CONFIG.W - w / 2 - 12, this.lastPlatformX + CONFIG.MIN_ADJACENT_X_GAP);
      } else {
        x = Math.max(w / 2 + 12, this.lastPlatformX - CONFIG.MIN_ADJACENT_X_GAP);
      }
    }
    this.lastPlatformX = x;

    const layer = Math.floor(y / CONFIG.LAYER_HEIGHT);
    const inMovingWave = layer >= CONFIG.MOVING_WAVE_START_LAYER && layer < CONFIG.MOVING_WAVE_END_LAYER;

    // In moving wave: no spikes, platforms move left-right
    if (inMovingWave) {
      const speed = rand(CONFIG.MOVING_PLAT_SPEED_MIN, CONFIG.MOVING_PLAT_SPEED_MAX);
      const dir = Math.random() < 0.5 ? 1 : -1;
      this.platforms.push({ x, y, w, type: 'normal', vx: speed * dir });
      return;
    }

    let isSpike;
    if (this.spikeStreak >= CONFIG.MAX_SPIKE_STREAK) {
      isSpike = false;
    } else {
      isSpike = Math.random() < CONFIG.SPIKE_CHANCE;
    }
    this.spikeStreak = isSpike ? this.spikeStreak + 1 : 0;

    const type = isSpike ? 'spike' : 'normal';
    this.platforms.push({ x, y, w, type, vx: 0 });
  }

  update(cameraY, currentScore, dt) {
    // Update moving platforms
    for (let i = 0; i < this.platforms.length; i++) {
      const p = this.platforms[i];
      if (p.vx !== 0) {
        p.x += p.vx * dt;
        // Bounce off walls
        if (p.x - p.w / 2 <= CONFIG.WALL_MARGIN) {
          p.x = CONFIG.WALL_MARGIN + p.w / 2;
          p.vx = Math.abs(p.vx);
        }
        if (p.x + p.w / 2 >= CONFIG.W - CONFIG.WALL_MARGIN) {
          p.x = CONFIG.W - CONFIG.WALL_MARGIN - p.w / 2;
          p.vx = -Math.abs(p.vx);
        }
      }
    }

    this.platforms = this.platforms.filter(p => p.y > cameraY - 60);
    let lowestY = this.platforms.reduce((m, p) => Math.max(m, p.y), 0);
    while (lowestY < cameraY + CONFIG.H + 150) {
      lowestY += rand(CONFIG.GAP_MIN, CONFIG.GAP_MAX);
      this.spawnPlatformAt(lowestY, currentScore);
    }
  }

  render(ctx, cameraY) {
    for (let i = 0; i < this.platforms.length; i++) {
      const p = this.platforms[i];
      const sy = p.y - cameraY;
      if (sy < -20 || sy > CONFIG.H + 20) continue;
      const left = p.x - p.w / 2;

      const isMoving = p.vx !== 0;

      if (p.type === 'normal') {
        ctx.fillStyle = isMoving ? '#2a6a8a' : '#8a5a2c';
        ctx.fillRect(left, sy - CONFIG.PLAT_H, p.w, CONFIG.PLAT_H);
        ctx.fillStyle = isMoving ? '#4eaad8' : '#c98a4b';
        ctx.fillRect(left, sy - CONFIG.PLAT_H, p.w, 3);
        ctx.fillStyle = isMoving ? '#1a4a6a' : '#5c3a1a';
        ctx.fillRect(left, sy - 1, p.w, 2);
        // Direction arrows on moving platforms
        if (isMoving) {
          ctx.fillStyle = 'rgba(78, 200, 220, 0.7)';
          ctx.font = '9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(p.vx > 0 ? '▶' : '◀', p.x, sy - CONFIG.PLAT_H + 9);
        }
      } else {
        ctx.fillStyle = '#5c1420';
        ctx.fillRect(left, sy - CONFIG.PLAT_H, p.w, CONFIG.PLAT_H);
        ctx.fillStyle = '#ff3b5c';
        const spikeCount = Math.max(2, Math.floor(p.w / 14));
        const spikeW = p.w / spikeCount;
        for (let s = 0; s < spikeCount; s++) {
          const sx = left + s * spikeW;
          ctx.beginPath();
          ctx.moveTo(sx, sy - CONFIG.PLAT_H);
          ctx.lineTo(sx + spikeW / 2, sy - CONFIG.PLAT_H - CONFIG.SPIKE_TIP_H);
          ctx.lineTo(sx + spikeW, sy - CONFIG.PLAT_H);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
    ctx.textAlign = 'left';
  }
}

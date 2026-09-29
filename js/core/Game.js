import { CONFIG } from '../config.js';
import { Player } from '../entities/Player.js';
import { PlatformManager } from '../entities/PlatformManager.js';
import { Physics } from '../systems/Physics.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { AudioManager } from '../systems/AudioManager.js';

export class Game {
  constructor(canvas, hud, input) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.hud = hud;
    this.input = input;
    this.audio = new AudioManager();

    this.state = 'ready';
    this.player = new Player(CONFIG.W / 2, 40);
    this.platformManager = new PlatformManager();
    this.particleSystem = new ParticleSystem();

    this.cameraY = 0;
    this.maxCameraY = 0;
    this.score = 0;
    this.elapsedTime = 0;
    this.bossWaveAnnounced = false;
    this.bossWaveEnded = false;

    this.input.onStart = (code) => {
      if (this.state === 'ready' || (this.state === 'gameover' && code === 'Space')) {
        this.start();
      }
    };

    this.input.onToggleMute = () => {
      this.toggleMusic();
    };

    if (this.hud.musicBtn) {
      this.hud.musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMusic();
      });
    }

    const stage = document.getElementById('stage');
    if (stage) {
      stage.addEventListener('click', () => {
        if (this.state === 'ready' || this.state === 'gameover') {
          this.start();
        }
      });
    }
    
    this.reset();
  }

  toggleMusic() {
    const isMuted = this.audio.toggleMute();
    this.hud.updateMusicBtn(isMuted);
  }

  reset() {
    if (this.audio) {
      this.audio.stopBGM();
    }
    this.player = new Player(CONFIG.W / 2, 40);
    this.platformManager.reset();
    this.cameraY = 0;
    this.maxCameraY = 0;
    this.score = 0;
    this.elapsedTime = 0;
    this.bossWaveAnnounced = false;
    this.bossWaveEnded = false;
    this.hud.updateScore(0);
    this.hud.hideToast();
  }

  start() {
    this.reset();
    this.state = 'playing';
    this.hud.hideOverlay();
    this.audio.playBGM();
  }

  endGame(reason) {
    this.state = 'gameover';
    this.audio.pauseBGM();
    this.hud.showGameOver(reason, this.score);
  }

  update(dt) {
    if (this.state !== 'playing') return;

    this.player.updateMovement(dt, this.input.keys);

    const prevY = this.player.y;
    Physics.applyGravity(this.player, dt);
    this.player.y += this.player.vy * dt;

    Physics.checkCollisions(
      this.player, 
      this.platformManager.platforms, 
      prevY, 
      (surfaceY) => {
        this.player.y = surfaceY - this.player.h / 2;
        this.player.vy = CONFIG.BOUNCE_VELOCITY;
      },
      () => {
        this.endGame('踩到尖刺陷阱了！');
      }
    );

    this.elapsedTime += dt;
    const forcedScroll = Math.min(CONFIG.MAX_SCROLL, CONFIG.BASE_SCROLL + this.elapsedTime * CONFIG.FALL_ACCEL);
    this.cameraY += forcedScroll * dt;
    if (this.cameraY > this.maxCameraY) this.maxCameraY = this.cameraY;
    
    const newScore = Math.max(this.score, Math.floor(this.maxCameraY / CONFIG.LAYER_HEIGHT));
    if (newScore > this.score) {
      this.score = newScore;
      this.hud.updateScore(this.score);
    }

    if (!this.bossWaveAnnounced && this.score >= CONFIG.BOSS_WAVE_START_LAYER) {
      this.bossWaveAnnounced = true;
      this.hud.showToast(`⚠ BOSS WAVE：躲避尖刺，撐過 ${CONFIG.BOSS_WAVE_LENGTH} 層！`, 3000);
    }
    if (!this.bossWaveEnded && this.score >= CONFIG.BOSS_WAVE_END_LAYER) {
      this.bossWaveEnded = true;
      this.hud.showToast('BOSS WAVE 結束！', 2000);
    }

    if (this.player.y - this.cameraY > CONFIG.H) {
      this.endGame('掉到最底層，被淘汰了！');
      return;
    }

    this.platformManager.update(this.cameraY, this.score);
    this.particleSystem.update(dt);
  }

  render() {
    this.ctx.clearRect(0, 0, CONFIG.W, CONFIG.H);

    this.ctx.save();
    const stripeH = 40;
    const offset = ((this.cameraY * 0.4) % stripeH + stripeH) % stripeH;
    for (let y = -stripeH; y < CONFIG.H + stripeH; y += stripeH) {
      const yy = y - offset;
      this.ctx.fillStyle = (Math.floor((y - offset + this.cameraY) / stripeH) % 2 === 0) ? '#121222' : '#151528';
    }
    this.ctx.fillStyle = '#141428';
    for (let i = -1; i * stripeH - offset < CONFIG.H + stripeH; i++) {
      if (i % 2 === 0) continue;
      this.ctx.fillRect(0, i * stripeH - offset, CONFIG.W, stripeH);
    }
    this.ctx.restore();

    this.platformManager.render(this.ctx, this.cameraY);
    this.player.render(this.ctx, this.cameraY);
    this.particleSystem.render(this.ctx, this.cameraY);
  }
}

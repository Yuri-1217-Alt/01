export class HUD {
  constructor() {
    this.scoreEl = document.getElementById('scoreVal');
    this.highEl = document.getElementById('highVal');
    this.bossToast = document.getElementById('bossToast');
    this.overlay = document.getElementById('overlay');
    this.overlayTitle = document.getElementById('overlayTitle');
    this.overlayMsg = document.getElementById('overlayMsg');
    this.overlayBlink = document.getElementById('overlayBlink');
    this.musicBtn = document.getElementById('musicBtn');

    this.toastTimer = null;
    this.highScore = 0;
    this._loadHighScore();
  }

  _loadHighScore() {
    try {
      const saved = localStorage.getItem('kidsStairsHighScore');
      if (saved) this.highScore = parseInt(saved, 10) || 0;
    } catch (e) { }
    this.highEl.textContent = this.highScore;
  }

  saveHighScore(v) {
    if (v > this.highScore) {
      this.highScore = v;
      this.highEl.textContent = this.highScore;
      try { localStorage.setItem('kidsStairsHighScore', String(this.highScore)); }
      catch (e) { }
    }
  }

  updateScore(score) {
    this.scoreEl.textContent = score;
  }

  showToast(text, duration = 2600) {
    this.bossToast.textContent = text;
    this.bossToast.classList.add('show');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.bossToast.classList.remove('show');
    }, duration);
  }

  hideToast() {
    this.bossToast.classList.remove('show');
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  showReady() {
    this.overlay.classList.remove('hidden');
    this.overlayTitle.textContent = '小朋友下樓梯';
    this.overlayTitle.classList.remove('gameover');
    this.overlayMsg.innerHTML = '← → 或 <span class="accent">A / D</span> 左右移動';
    this.overlayBlink.textContent = '按下方向鍵開始移動即可開始遊戲';
  }

  hideOverlay() {
    this.overlay.classList.add('hidden');
  }

  showGameOver(reason, score) {
    this.saveHighScore(score);
    this.overlayTitle.textContent = 'GAME OVER';
    this.overlayTitle.classList.add('gameover');
    this.overlayMsg.innerHTML = reason + '<br>本次分數：<span class="accent">' + score + '</span>　最高分：<span class="accent">' + this.highScore + '</span>';
    this.overlayBlink.textContent = '按下［空白鍵］重新開始';
    this.overlay.classList.remove('hidden');
  }

  updateMusicBtn(isMuted) {
    if (!this.musicBtn) return;
    if (isMuted) {
      this.musicBtn.textContent = '🔇 靜音';
      this.musicBtn.classList.add('muted');
    } else {
      this.musicBtn.textContent = '🔊 音樂';
      this.musicBtn.classList.remove('muted');
    }
  }
}

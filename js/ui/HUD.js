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
    this.overlayMsg.innerHTML = '← → 或 <span class="accent">A / D</span> 左右移動<br>按 <span class="accent">M</span> 鍵可開關音樂 🎵';
    this.overlayBlink.textContent = '點擊畫面或按方向鍵即可開始 (播放音樂 🎵)';
  }

  hideOverlay() {
    this.overlay.classList.add('hidden');
  }

  showGameOver(reason, score) {
    this.saveHighScore(score);
    this.overlayTitle.textContent = 'GAME OVER';
    this.overlayTitle.classList.add('gameover');

    const funnyMessages = [
      // 🎮 經典遊戲重現風
      '「恭喜達成終極成就：在第一層踩到致命鋼刺，直接 Game Over。」',
      '「事實證明，他不是走得太慢被畫面頂上去壓死，而是單純腳滑。」',
      '「可惜這不是遊戲，你沒辦法按 F5 重新整理再來一局。」',
      // 💀 地獄毒舌風
      '「他一生都在追求步步高升，沒想到最後讓他留名青史的，是驚天動地的一步登天。」',
      '「人家下樓梯是為了走路，他下樓梯是為了示範牛頓的萬有引力定律。」',
      '「地心引力抓得住他，但他的腳顯然抓不住階梯。」',
      // 👻 迷因短句風
      '「平地摔是萌點，樓梯摔是終點。」',
      '「他的下半生（身）走得很安詳，速度也很快。」',
      '「這就是不聽勸的下場——早就叫你搭電梯了吧！」',
    ];
    const randomMsg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

    this.overlayMsg.innerHTML =
      '<span style="font-style:italic; font-size:13px; color:#ffd23f; line-height:1.7;">' + randomMsg + '</span>' +
      '<br><br>本次分數：<span class="accent">' + score + '</span>　最高分：<span class="accent">' + this.highScore + '</span>';
    this.overlayBlink.textContent = '點擊畫面或按［空白鍵］重新開始';
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

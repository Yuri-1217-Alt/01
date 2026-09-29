export class AudioManager {
  constructor() {
    this.bgm = new Audio('assets/audio/bgm.mp3?v=' + Date.now());
    this.bgm.loop = true;
    this.bgm.volume = 0.45;
    this.deathSound = new Audio('assets/audio/death.mp3');
    this.deathSound.volume = 0.8;
    this.isMuted = false;
    this.isPlaying = false;
  }

  playBGM() {
    if (this.isMuted) return;
    const playPromise = this.bgm.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying = true;
      }).catch(err => {
        console.log('Audio play waiting for user interaction:', err);
      });
    }
  }

  pauseBGM() {
    this.bgm.pause();
    this.isPlaying = false;
  }

  stopBGM() {
    this.bgm.pause();
    this.bgm.currentTime = 0;
    this.isPlaying = false;
  }

  playDeath() {
    if (this.isMuted) return;
    try {
      this.deathSound.currentTime = 0;
      this.deathSound.play().catch(err => {
        console.log('Death sound play prevented:', err);
      });
    } catch (e) {
      console.error(e);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.bgm.pause();
      this.deathSound.pause();
    } else {
      this.playBGM();
    }
    return this.isMuted;
  }
}

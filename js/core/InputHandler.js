export class InputHandler {
  constructor() {
    this.keys = { left: false, right: false, space: false };
    this.onStart = null;
    this.onToggleMute = null;
    this._bindEvents();
  }

  _isMoveKey(code) {
    return code === 'ArrowLeft' || code === 'ArrowRight' || code === 'KeyA' || code === 'KeyD';
  }

  _bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (this._isMoveKey(e.code) || e.code === 'Space') {
        e.preventDefault();
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = true;
      if (e.code === 'Space') this.keys.space = true;
      if (e.code === 'KeyM') {
        if (this.onToggleMute) this.onToggleMute();
      }
      
      if (this.onStart) {
        if (this._isMoveKey(e.code) || e.code === 'Space') {
          this.onStart(e.code);
        }
      }
    });
    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
      if (e.code === 'Space') this.keys.space = false;
    });
  }
}

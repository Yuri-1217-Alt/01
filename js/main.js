import { InputHandler } from './core/InputHandler.js';
import { HUD } from './ui/HUD.js';
import { Game } from './core/Game.js';
import { GameLoop } from './core/GameLoop.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  const input = new InputHandler();
  const hud = new HUD();
  
  const game = new Game(canvas, hud, input);
  
  const loop = new GameLoop(
    (dt) => game.update(dt),
    () => game.render()
  );
  
  game.render();
  loop.start();

  // Top navigation action buttons
  const btnRestart = document.getElementById('btnRestart');
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      game.start();
    });
  }

  const btnFullscreen = document.getElementById('btnFullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      const target = document.getElementById('stage') || document.documentElement;
      if (!document.fullscreenElement) {
        if (target.requestFullscreen) {
          target.requestFullscreen().catch(err => console.log(err));
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(err => console.log(err));
        }
      }
    });
  }

  const btnNewTab = document.getElementById('btnNewTab');
  if (btnNewTab) {
    btnNewTab.addEventListener('click', () => {
      window.open(window.location.href, '_blank');
    });
  }

  const btnClose = document.getElementById('btnClose');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.close();
      }
    });
  }
});

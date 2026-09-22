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
});

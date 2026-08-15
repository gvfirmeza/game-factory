import {
  GameLoop,
  CanvasRenderer,
  InputManager,
  ProceduralAudio,
  ParticleSystem,
  JuiceEffects,
  TweenManager,
  StateMachine,
  Camera2D,
  PlaygamaBridge
} from '../../engine/index.js';

/**
 * Base Arcade Game Framework with integrated loops, HUD, audio, particles, and state transitions.
 */
export class ArcadeGame {
  constructor(canvasElement, config = {}) {
    this.canvas = canvasElement;
    this.config = Object.assign(
      {
        virtualWidth: 480,
        virtualHeight: 800,
        title: 'Arcade Game',
        fps: 60
      },
      config
    );

    this.renderer = new CanvasRenderer(this.canvas, this.config.virtualWidth, this.config.virtualHeight);
    this.input = new InputManager(this.canvas);
    this.audio = new ProceduralAudio();
    this.particles = new ParticleSystem(300);
    this.juice = new JuiceEffects();
    this.tweens = new TweenManager();
    this.camera = new Camera2D(this.config.virtualWidth, this.config.virtualHeight);
    this.playgama = new PlaygamaBridge();

    this.score = 0;
    this.highScore = 0;
    this.lives = 3;
    this.gameOver = false;

    this.fsm = new StateMachine();
    this.setupStates();

    this.loop = new GameLoop({
      onUpdate: (dt) => this.update(dt),
      onRender: (alpha) => this.render(alpha)
    });
  }

  async init() {
    await this.playgama.init();
    this.highScore = await this.playgama.getHighScore();
    this.fsm.transitionTo('TITLE');
    this.loop.start();
  }

  setupStates() {
    this.fsm.addState('TITLE', {
      enter: () => {},
      update: () => {
        if (this.input.isJustPressed('up') || this.input.isJustPressed('action')) {
          this.audio.init();
          this.audio.playButtonClick();
          this.fsm.transitionTo('PLAYING');
        }
      }
    });

    this.fsm.addState('PLAYING', {
      enter: () => {
        this.resetGame();
      },
      update: (dt) => {
        this.updateGameplay(dt);
      }
    });

    this.fsm.addState('GAMEOVER', {
      enter: () => {
        this.audio.playGameOver();
        this.playgama.setHighScore('main', this.score);
        if (this.score > this.highScore) {
          this.highScore = this.score;
        }
      },
      update: () => {
        if (this.input.isJustPressed('up') || this.input.isJustPressed('action')) {
          this.audio.playButtonClick();
          this.fsm.transitionTo('PLAYING');
        }
      }
    });
  }

  resetGame() {
    this.score = 0;
    this.gameOver = false;
  }

  update(dt) {
    this.fsm.update(dt);
    this.tweens.update(dt);
    this.particles.update(dt);
    this.juice.update(dt);
    this.input.endFrame();
  }

  updateGameplay(dt) {
    // Override in derived game
  }

  render(alpha) {
    this.camera.setShakeOffset(this.juice.shakeX, this.juice.shakeY);
    this.renderer.beginFrame(this.camera);

    this.renderWorld(this.renderer.ctx);
    this.particles.render(this.renderer.ctx);
    this.juice.renderWorld(this.renderer.ctx);

    this.renderer.endWorldFrame(this.camera);

    this.renderUI(this.renderer.ctx);
    this.juice.renderScreen(this.renderer.ctx, this.config.virtualWidth, this.config.virtualHeight);

    this.renderer.endFrame();
  }

  renderWorld(ctx) {
    // Override in derived game
  }

  renderUI(ctx) {
    // Override in derived game
  }

  destroy() {
    this.loop.stop();
    this.input.destroy();
    this.renderer.destroy();
  }
}

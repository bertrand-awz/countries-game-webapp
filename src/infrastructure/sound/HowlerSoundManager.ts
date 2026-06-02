import { Howl } from "howler";

import countdownSound from "@/assets/sounds/countdown.mp3";
import backgroundMusicSound from "@/assets/sounds/main-theme.mp3";
import mouseClickSound from "@/assets/sounds/mouse-click.mp3";
import {
  LoopableSoundEffectName,
  SoundEffectName,
  type SoundManager,
} from "@/domain/game/ports/SoundManager.ts";

const SOUND_SCALE: number = 100;

export class HowlerSoundManager implements SoundManager {
  private effects: Record<SoundEffectName, Howl>;
  private loopableEffects: Record<LoopableSoundEffectName, Howl>;
  private backgroundMusic: Howl;

  private soundEffectVolume = 0.1;
  private mainThemeVolume = 0.2;

  constructor() {
    this.effects = {
      [SoundEffectName.CLICK]: new Howl({
        src: [mouseClickSound],
        volume: this.soundEffectVolume,
      }),

      [SoundEffectName.CORRECT_ANSWER]: new Howl({
        src: ["/sounds/effects/correct.mp3"],
        volume: this.soundEffectVolume,
      }),

      [SoundEffectName.WRONG_ANSWER]: new Howl({
        src: ["/sounds/effects/wrong.mp3"],
        volume: this.soundEffectVolume,
      }),

      [SoundEffectName.SUCCESS]: new Howl({
        src: ["/sounds/effects/success.mp3"],
        volume: this.soundEffectVolume,
      }),

      [SoundEffectName.CELEBRATION]: new Howl({
        src: ["/sounds/effects/celebration.mp3"],
        volume: this.soundEffectVolume,
      }),
    };

    this.loopableEffects = {
      [LoopableSoundEffectName.TIMER_COUNTDOWN]: new Howl({
        src: [countdownSound],
        volume: this.soundEffectVolume,
        loop: true,
      }),
    };

    this.backgroundMusic = new Howl({
      src: [backgroundMusicSound],
      volume: this.mainThemeVolume,
      loop: true,
    });
  }

  getMainVolume(): number {
    return Math.round(this.mainThemeVolume * SOUND_SCALE);
  }

  getSoundEffectVolume(): number {
    return Math.round(this.soundEffectVolume * SOUND_SCALE);
  }

  playEffect(effectName: SoundEffectName): void {
    this.effects[effectName].play();
  }

  playEffectInLoop(effectName: LoopableSoundEffectName) {
    const loopableEffect = this.loopableEffects[effectName];
    if (!loopableEffect.playing()) loopableEffect.play();
  }

  stopLoopableEffect(effectName: LoopableSoundEffectName) {
    const loopableEffect = this.loopableEffects[effectName];
    if (loopableEffect.playing()) loopableEffect.stop();
  }
  playMainThemeSound(): void {
    if (this.backgroundMusic.playing()) {
      return;
    }

    this.backgroundMusic.play();
  }

  setMainThemeVolume(volume: number): void {
    this.mainThemeVolume = this.normalizeVolume(volume);
    this.backgroundMusic.volume(this.mainThemeVolume);
  }

  setSoundEffectVolume(volume: number): void {
    this.soundEffectVolume = this.normalizeVolume(volume);

    Object.values(this.effects).forEach((sound) => {
      sound.volume(this.soundEffectVolume);
    });

    Object.values(this.loopableEffects).forEach((sound) => {
      sound.volume(this.soundEffectVolume);
    });
  }

  private normalizeVolume(volume: number): number {
    const normalizedVolume = volume / SOUND_SCALE;

    return Math.max(0, Math.min(1, normalizedVolume));
  }
}

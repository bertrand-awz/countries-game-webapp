export enum SoundEffectName {
  CLICK = "click",
  CORRECT_ANSWER = "correct",
  WRONG_ANSWER = "wrong",
  SUCCESS = "success",
  CELEBRATION = "celebration",
}

export enum LoopableSoundEffectName {
  TIMER_COUNTDOWN = "timer_tictac",
}

export interface SoundManager {
  playMainThemeSound(): void;
  stopMainThemeSound(): void;
  playEffect(effectName: SoundEffectName): void;
  playEffectInLoop(effectName: LoopableSoundEffectName): void;
  stopLoopableEffect(effectName: LoopableSoundEffectName): void;
  stopAllSounds(): void;
  setMainThemeVolume(newVolume: number): void;
  setSoundEffectVolume(newVolume: number): void;
  setSoundEffectsEnabled(isEnabled: boolean): void;
  getMainVolume(): number;
  getSoundEffectVolume(): number;
  areSoundEffectsEnabled(): boolean;
}

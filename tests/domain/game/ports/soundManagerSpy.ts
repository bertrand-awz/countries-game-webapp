import type {
  LoopableSoundEffectName,
  SoundEffectName,
  SoundManager,
} from "@/domain/game/ports/SoundManager.ts";

export class SoundManagerSpy implements SoundManager {
  playedEffects: SoundEffectName[] = [];
  loopedEffects: LoopableSoundEffectName[] = [];
  stoppedLoopableEffects: LoopableSoundEffectName[] = [];
  stopAllSoundsCallCount = 0;
  mainThemePlayCount = 0;
  mainThemeStopCount = 0;
  mainThemeVolume = 20;
  soundEffectVolume = 10;
  soundEffectsEnabled = true;

  playMainThemeSound(): void {
    this.mainThemePlayCount++;
  }

  stopMainThemeSound(): void {
    this.mainThemeStopCount++;
  }

  playEffect(effectName: SoundEffectName): void {
    if (!this.soundEffectsEnabled) {
      return;
    }

    this.playedEffects.push(effectName);
  }

  playEffectInLoop(effectName: LoopableSoundEffectName): void {
    if (!this.soundEffectsEnabled) {
      return;
    }

    this.loopedEffects.push(effectName);
  }

  stopLoopableEffect(effectName: LoopableSoundEffectName): void {
    this.stoppedLoopableEffects.push(effectName);
  }

  stopAllSounds(): void {
    this.stopAllSoundsCallCount++;
    this.stopMainThemeSound();
  }

  setMainThemeVolume(newVolume: number): void {
    this.mainThemeVolume = newVolume;
  }

  setSoundEffectVolume(newVolume: number): void {
    this.soundEffectVolume = newVolume;
  }

  setSoundEffectsEnabled(isEnabled: boolean): void {
    this.soundEffectsEnabled = isEnabled;
  }

  getMainVolume(): number {
    return this.mainThemeVolume;
  }

  getSoundEffectVolume(): number {
    return this.soundEffectVolume;
  }

  areSoundEffectsEnabled(): boolean {
    return this.soundEffectsEnabled;
  }
}

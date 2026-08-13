import {
  type LoopableSoundEffectName,
  type SoundEffectName,
  type SoundManager,
} from "@/domain/game/ports/SoundManager.ts";

export class SoundManagerSpy implements SoundManager {
  playedEffects: SoundEffectName[] = [];
  loopedEffects: LoopableSoundEffectName[] = [];
  stoppedLoopableEffects: LoopableSoundEffectName[] = [];
  mainThemePlayCount = 0;
  mainThemeVolume = 20;
  soundEffectVolume = 10;

  playMainThemeSound(): void {
    this.mainThemePlayCount++;
  }

  playEffect(effectName: SoundEffectName): void {
    this.playedEffects.push(effectName);
  }

  playEffectInLoop(effectName: LoopableSoundEffectName): void {
    this.loopedEffects.push(effectName);
  }

  stopLoopableEffect(effectName: LoopableSoundEffectName): void {
    this.stoppedLoopableEffects.push(effectName);
  }

  setMainThemeVolume(newVolume: number): void {
    this.mainThemeVolume = newVolume;
  }

  setSoundEffectVolume(newVolume: number): void {
    this.soundEffectVolume = newVolume;
  }

  getMainVolume(): number {
    return this.mainThemeVolume;
  }

  getSoundEffectVolume(): number {
    return this.soundEffectVolume;
  }
}

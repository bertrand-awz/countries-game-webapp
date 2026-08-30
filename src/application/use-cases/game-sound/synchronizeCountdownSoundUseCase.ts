import { GameConstraints } from "@/domain/game/constraints/gameConstraints.ts";
import { GameStatus } from "@/domain/game/models/state/GameState.ts";
import { LoopableSoundEffectName } from "@/domain/game/ports/SoundManager.ts";

import { UseCase } from "../useCase.ts";

export type CountdownSoundSynchronization = {
  gameStatus: GameStatus | null | undefined;
  timeLeftInSeconds: number;
  totalDurationInSeconds: number;
};

export class SynchronizeCountdownSoundUseCase extends UseCase<CountdownSoundSynchronization, void> {
  private isCountdownSoundPlaying = false;

  execute(): void {
    if (!this.options) {
      this.stopCountdownSound();
      return;
    }

    const shouldPlayCountdown =
      this.options.gameStatus === GameStatus.PLAYING &&
      this.options.timeLeftInSeconds > 0 &&
      this.soundManager.areSoundEffectsEnabled() &&
      this.options.timeLeftInSeconds <=
        this.getCountdownSoundThresholdInSeconds(this.options.totalDurationInSeconds);

    if (shouldPlayCountdown) {
      this.playCountdownSound();
      return;
    }

    this.stopCountdownSound();
  }

  stop(): void {
    this.stopCountdownSound();
  }

  private getCountdownSoundThresholdInSeconds(totalDurationInSeconds: number): number {
    return Math.ceil(
      totalDurationInSeconds * (GameConstraints.TIMER_ALERT_REMAINING_TIME_PERCENTAGE / 100),
    );
  }

  private playCountdownSound(): void {
    if (this.isCountdownSoundPlaying) {
      return;
    }

    this.soundManager.playEffectInLoop(LoopableSoundEffectName.TIMER_COUNTDOWN);
    this.isCountdownSoundPlaying = true;
  }

  private stopCountdownSound(): void {
    if (!this.isCountdownSoundPlaying) {
      return;
    }

    this.soundManager.stopLoopableEffect(LoopableSoundEffectName.TIMER_COUNTDOWN);
    this.isCountdownSoundPlaying = false;
  }
}

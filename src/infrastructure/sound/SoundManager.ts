import { Howl, Howler } from "howler";

import mouseClickSound from "@/assets/sounds/mouse-click.mp3";

export enum SoundEffect {
  CLICK = "click",
  CORRECT_ANSWER = "correct",
  WRONG_ANSWER = "wrong",
  SUCCESS = "success",
  CELEBRATION = "celebration",
}

export const BackgroundMusics = {
  MAIN: "main",
  GAME: "game",
} as const;

export type BackgroundMusicName = (typeof BackgroundMusics)[keyof typeof BackgroundMusics];

class SoundManager {
  private effects: Record<SoundEffect, Howl>;
  private musics: Record<BackgroundMusicName, Howl>;

  private currentMusic: Howl | null = null;

  private masterVolume = 1;
  private effectsVolume = 0.7;
  private musicVolume = 0.4;

  private muted = false;

  constructor() {
    this.effects = {
      [SoundEffect.CLICK]: new Howl({
        src: [mouseClickSound],
        volume: this.effectsVolume,
      }),

      [SoundEffect.CORRECT_ANSWER]: new Howl({
        src: ["/sounds/effects/correct.mp3"],
        volume: this.effectsVolume,
      }),

      [SoundEffect.WRONG_ANSWER]: new Howl({
        src: ["/sounds/effects/wrong.mp3"],
        volume: this.effectsVolume,
      }),

      [SoundEffect.SUCCESS]: new Howl({
        src: ["/sounds/effects/success.mp3"],
        volume: this.effectsVolume,
      }),

      [SoundEffect.CELEBRATION]: new Howl({
        src: ["/sounds/effects/celebration.mp3"],
        volume: this.effectsVolume,
      }),
    };

    this.musics = {
      [BackgroundMusics.MAIN]: new Howl({
        src: ["/sounds/music/main-theme.mp3"],
        volume: this.musicVolume,
        loop: true,
      }),

      [BackgroundMusics.GAME]: new Howl({
        src: ["/sounds/music/game-theme.mp3"],
        volume: this.musicVolume,
        loop: true,
      }),
    };

    Howler.volume(this.masterVolume);
  }

  playEffect(name: SoundEffect): void {
    this.effects[name].play();
  }

  playMusic(name: BackgroundMusicName): void {
    const music = this.musics[name];

    if (this.currentMusic === music && music.playing()) {
      return;
    }

    this.stopMusic();

    this.currentMusic = music;
    this.currentMusic.play();
  }

  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  pauseMusic(): void {
    this.currentMusic?.pause();
  }

  resumeMusic(): void {
    if (this.currentMusic && !this.currentMusic.playing()) {
      this.currentMusic.play();
    }
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = this.normalizeVolume(volume);
    Howler.volume(this.masterVolume);
  }

  setEffectsVolume(volume: number): void {
    this.effectsVolume = this.normalizeVolume(volume);

    Object.values(this.effects).forEach((sound) => {
      sound.volume(this.effectsVolume);
    });
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = this.normalizeVolume(volume);

    Object.values(this.musics).forEach((music) => {
      music.volume(this.musicVolume);
    });
  }

  mute(): void {
    this.muted = true;
    Howler.mute(true);
  }

  unmute(): void {
    this.muted = false;
    Howler.mute(false);
  }

  toggleMute(): void {
    this.muted = !this.muted;
    Howler.mute(this.muted);
  }

  isMuted(): boolean {
    return this.muted;
  }

  private normalizeVolume(volume: number): number {
    return Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();

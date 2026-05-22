// src/services/sound/SoundManager.ts

import { Howl, Howler } from "howler";

type SoundEffectName = "click" | "correct" | "wrong" | "success" | "celebration";

type BackgroundMusicName = "main" | "game";

class SoundManager {
  private effects: Record<SoundEffectName, Howl>;
  private musics: Record<BackgroundMusicName, Howl>;

  private currentMusic: Howl | null = null;

  private masterVolume = 1;
  private effectsVolume = 0.7;
  private musicVolume = 0.4;

  constructor() {
    this.effects = {
      click: new Howl({
        src: ["/sounds/effects/click.mp3"],
        volume: this.effectsVolume,
      }),

      correct: new Howl({
        src: ["/sounds/effects/correct.mp3"],
        volume: this.effectsVolume,
      }),

      wrong: new Howl({
        src: ["/sounds/effects/wrong.mp3"],
        volume: this.effectsVolume,
      }),

      success: new Howl({
        src: ["/sounds/effects/success.mp3"],
        volume: this.effectsVolume,
      }),

      celebration: new Howl({
        src: ["/sounds/effects/celebration.mp3"],
        volume: this.effectsVolume,
      }),
    };

    this.musics = {
      main: new Howl({
        src: ["/sounds/music/main-theme.mp3"],
        volume: this.musicVolume,
        loop: true,
      }),

      game: new Howl({
        src: ["/sounds/music/game-theme.mp3"],
        volume: this.musicVolume,
        loop: true,
      }),
    };

    Howler.volume(this.masterVolume);
  }

  playEffect(name: SoundEffectName): void {
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
    Howler.mute(true);
  }

  unmute(): void {
    Howler.mute(false);
  }

  toggleMute(): void {
    Howler.mute(!Howler._muted);
  }

  private normalizeVolume(volume: number): number {
    return Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Sound Synthesizer - 100% Client-side, zero external assets
class SoundFxService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    try {
      const storedMute = localStorage.getItem("pai_game_sound_muted");
      if (storedMute !== null) {
        this.isMuted = storedMute === "true";
      }
    } catch {
      this.isMuted = false;
    }
  }

  private initCtx() {
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem("pai_game_sound_muted", String(this.isMuted));
    } catch {}
    return this.isMuted;
  }

  // 1. Click sound
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch {}
  }

  // 2. Correct chime (C5 -> E5 -> G5 ascending chord)
  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, this.audioCtx!.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.25, this.audioCtx!.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx!.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);
        osc.start(this.audioCtx!.currentTime + idx * 0.08);
        osc.stop(this.audioCtx!.currentTime + idx * 0.08 + 0.25);
      });
    } catch {}
  }

  // 3. Wrong buzzer (Low dual tone)
  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, this.audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(130, this.audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch {}
  }

  // 4. Coin collect (High bright ding)
  public playCoin() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, this.audioCtx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, this.audioCtx.currentTime + 0.06); // E6
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch {}
  }

  // 5. Victory celebration
  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      const fanfare = [
        { f: 523.25, d: 0.12 },
        { f: 523.25, d: 0.12 },
        { f: 523.25, d: 0.12 },
        { f: 659.25, d: 0.3 },
        { f: 783.99, d: 0.45 }
      ];
      let t = this.audioCtx.currentTime;
      fanfare.forEach((item) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(item.f, t);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + item.d);
        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);
        osc.start(t);
        osc.stop(t + item.d);
        t += item.d + 0.04;
      });
    } catch {}
  }

  // 6. Wheel spin tick
  public playTick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.02);
    } catch {}
  }
}

export const soundFx = new SoundFxService();

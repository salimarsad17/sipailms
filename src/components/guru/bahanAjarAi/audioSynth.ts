/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesized Web Audio & Speech API Helper
 * Memberikan efek suara instan tanpa perlu asset file eksternal yang rawan gagal muat.
 */

let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn("Web Audio API not supported", e);
    return null;
  }
}

export const SoundEngine = {
  getIsMuted(): boolean {
    return isMuted;
  },

  setMuted(muted: boolean) {
    isMuted = muted;
    if (muted && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  },

  toggleMute(): boolean {
    isMuted = !isMuted;
    if (isMuted && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    return isMuted;
  },

  /** Suara nada benar (akor ceria C5 - E5 - G5) */
  playCorrect() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.45);
    });
  },

  /** Suara jawaban salah (nada lembut rendah) */
  playWrong() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
    osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  },

  /** Suara klik / tap kartu */
  playClick() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.07);
  },

  /** Fanfare perayaan juara / tamat (akor megah) */
  playFanfare() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const melody = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.12 },
      { f: 783.99, d: 0.15, t: 0.24 },
      { f: 1046.5, d: 0.45, t: 0.38 }
    ];

    melody.forEach((item) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(item.f, ctx.currentTime + item.t);

      gain.gain.setValueAtTime(0, ctx.currentTime + item.t);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + item.t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.t + item.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + item.t);
      osc.stop(ctx.currentTime + item.t + item.d + 0.05);
    });
  },

  /** Suara ambient tenang untuk video */
  playGentleBeep() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.42);
  }
};

/**
 * Helper Web Speech API untuk membaca narasi video secara otomatis dalam Bahasa Indonesia
 */
export const VoiceNarration = {
  isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  },

  speak(text: string, rate: number = 1.0, onEnd?: () => void) {
    if (!this.isSupported() || isMuted) {
      if (onEnd) setTimeout(onEnd, 1500);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // batalkan suara sebelumnya jika ada
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = rate;
      utterance.pitch = 1.0;

      // Cari suara bahasa Indonesia jika tersedia di browser
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find((v) => v.lang.startsWith("id") || v.lang.includes("ID"));
      if (idVoice) {
        utterance.voice = idVoice;
      }

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
      if (onEnd) onEnd();
    }
  },

  stop() {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
  },

  pause() {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.pause();
      } catch (e) {
        // ignore
      }
    }
  },

  resume() {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {
        // ignore
      }
    }
  }
};

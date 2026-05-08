import { loadSettings } from './settings';

export type SoundName =
  | 'pass'
  | 'kick'
  | 'tackle'
  | 'tackleFail'
  | 'whistle'
  | 'goal'
  | 'blip';

let ctx: AudioContext | null = null;
let unlockArmed = false;

function armUnlock(audioCtx: AudioContext): void {
  if (unlockArmed || typeof window === 'undefined') return;
  unlockArmed = true;
  const events: Array<keyof WindowEventMap> = ['pointerdown', 'touchend', 'keydown'];
  const handler = () => {
    if (audioCtx.state === 'suspended') {
      void audioCtx.resume().catch(() => {});
    }
    for (const ev of events) window.removeEventListener(ev, handler);
  };
  for (const ev of events) window.addEventListener(ev, handler, { once: false });
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
    armUnlock(ctx);
    return ctx;
  } catch {
    return null;
  }
}

interface ToneSpec {
  type: OscillatorType;
  freq: number;
  endFreq?: number;
  duration: number; // seconds
  gain: number; // 0..1
  attack?: number;
}

const TONES: Record<SoundName, ToneSpec[]> = {
  blip:        [{ type: 'square',   freq: 880,                duration: 0.04, gain: 0.20 }],
  pass:        [{ type: 'triangle', freq: 520,  endFreq: 760, duration: 0.10, gain: 0.25 }],
  kick:        [{ type: 'square',   freq: 220,  endFreq: 110, duration: 0.12, gain: 0.35 }],
  tackle:      [{ type: 'square',   freq: 140,  endFreq: 60,  duration: 0.14, gain: 0.40 }],
  tackleFail:  [{ type: 'sawtooth', freq: 200,  endFreq: 240, duration: 0.10, gain: 0.25 }],
  whistle:     [
    { type: 'sine', freq: 1900, duration: 0.18, gain: 0.20 },
    { type: 'sine', freq: 2100, duration: 0.18, gain: 0.20 },
  ],
  goal: [
    { type: 'triangle', freq: 523, duration: 0.12, gain: 0.30 },
    { type: 'triangle', freq: 659, duration: 0.12, gain: 0.30 },
    { type: 'triangle', freq: 784, duration: 0.20, gain: 0.30 },
  ],
};

function playTone(audioCtx: AudioContext, spec: ToneSpec, when: number, volume: number) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = spec.type;
  osc.frequency.setValueAtTime(spec.freq, when);
  if (spec.endFreq !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, spec.endFreq), when + spec.duration);
  }
  const peak = spec.gain * volume;
  const attack = spec.attack ?? 0.005;
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(peak, when + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + spec.duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(when);
  osc.stop(when + spec.duration + 0.02);
}

function schedule(audioCtx: AudioContext, name: SoundName, volume: number): void {
  const tones = TONES[name];
  let when = audioCtx.currentTime;
  for (const t of tones) {
    playTone(audioCtx, t, when, volume);
    when += t.duration * 0.85;
  }
}

export function play(name: SoundName): void {
  const settings = loadSettings();
  if (!settings.soundEnabled || settings.volume <= 0) return;
  const audioCtx = getCtx();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => schedule(audioCtx, name, settings.volume)).catch(() => {});
    return;
  }
  schedule(audioCtx, name, settings.volume);
}

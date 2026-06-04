// ── Generative ambient sound engine ─────────────────────────────────────────
// Pure Web Audio — no audio files. Each preset is a small set of sine voices
// tuned to "healing" / solfeggio frequencies, with slow LFO movement and
// occasional soft shimmer tones so the texture never loops or repeats.
//
// Usage (client only):
//   const engine = new AmbientEngine();
//   engine.play(PRESETS[0]);   // must be inside a user gesture (click)
//   engine.stop();

export interface AmbientVoice {
  /** base frequency in Hz */
  freq: number;
  /** oscillator shape — sine is softest, triangle adds a little body */
  type?: OscillatorType;
  /** relative loudness 0..1 */
  gain: number;
  /** stereo position -1 (left) .. 1 (right) */
  pan?: number;
  /** slow movement: LFO rate in Hz (e.g. 0.05 = one sway every 20s) */
  lfoRate?: number;
  /** movement depth in cents */
  lfoDepth?: number;
}

export interface AmbientPreset {
  id: string;
  /** Hebrew display name */
  name: string;
  /** short label, e.g. "528 Hz" */
  hz: string;
  /** Hebrew one-liner about the mood */
  desc: string;
  /** accent colour (hex) for the card */
  color: string;
  voices: AmbientVoice[];
  /** optional pool of frequencies for gentle random shimmer bells */
  shimmer?: number[];
  /** optional sparse generative piano on a calm scale */
  piano?: AmbientPiano;
}

export interface AmbientPiano {
  /** scale to draw notes from, in Hz */
  scale: number[];
  /** peak loudness of a struck note 0..1 */
  gain: number;
  /** min / max gap between notes, in ms */
  gapMin: number;
  gapMax: number;
}

// A pleasant pool of overtones used by several presets for the shimmer bells.
const SHIMMER_SOFT = [528, 660, 792, 880, 1056];

export const PRESETS: AmbientPreset[] = [
  {
    id: "piano-light",
    name: "פסנתר ואור",
    hz: "פסנתר רך",
    desc: "תווי פסנתר בודדים ואיטיים מעל פּאד חמים — עדין ושליו",
    color: "#fde9b0",
    voices: [
      { freq: 110, type: "sine", gain: 0.12, pan: -0.25, lfoRate: 0.04, lfoDepth: 3 },
      { freq: 164.8, type: "sine", gain: 0.08, pan: 0.25, lfoRate: 0.05, lfoDepth: 4 },
      { freq: 220, type: "sine", gain: 0.05, pan: 0, lfoRate: 0.03, lfoDepth: 4 },
    ],
    // A-minor pentatonic — never dissonant, always calm
    piano: {
      scale: [220, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25],
      gain: 0.14,
      gapMin: 3200,
      gapMax: 6500,
    },
  },
  {
    id: "lullaby",
    name: "ערש",
    hz: "פסנתר • הכי עדין",
    desc: "תווים נדירים ורכים מאוד — כמעט לחישה, למנוחה ושינה",
    color: "#e9d5ff",
    voices: [
      { freq: 130.8, type: "sine", gain: 0.09, pan: -0.2, lfoRate: 0.03, lfoDepth: 3 },
      { freq: 196.0, type: "sine", gain: 0.06, pan: 0.2, lfoRate: 0.04, lfoDepth: 3 },
    ],
    // C-major pentatonic, higher and sparser
    piano: {
      scale: [261.63, 293.66, 329.63, 392.0, 440.0],
      gain: 0.1,
      gapMin: 4500,
      gapMax: 9000,
    },
  },
  {
    id: "528",
    name: "אהבה ותיקון",
    hz: "528 Hz",
    desc: "תדר ה'אהבה' — חמים, מרומם, פותח את הלב",
    color: "#fbbf24",
    voices: [
      { freq: 132, type: "sine", gain: 0.22, pan: -0.3, lfoRate: 0.05, lfoDepth: 4 },
      { freq: 264, type: "sine", gain: 0.18, pan: 0.3, lfoRate: 0.07, lfoDepth: 5 },
      { freq: 528, type: "sine", gain: 0.12, pan: 0, lfoRate: 0.04, lfoDepth: 6 },
      { freq: 396, type: "triangle", gain: 0.05, pan: -0.5, lfoRate: 0.06, lfoDepth: 3 },
    ],
    shimmer: SHIMMER_SOFT,
  },
  {
    id: "432",
    name: "כוונון טבעי",
    hz: "432 Hz",
    desc: "כוונון רך ומאוזן — מרגיע ומקרקע",
    color: "#f59e0b",
    voices: [
      { freq: 108, type: "sine", gain: 0.24, pan: -0.25, lfoRate: 0.04, lfoDepth: 4 },
      { freq: 216, type: "sine", gain: 0.16, pan: 0.25, lfoRate: 0.05, lfoDepth: 5 },
      { freq: 432, type: "sine", gain: 0.1, pan: 0, lfoRate: 0.03, lfoDepth: 6 },
      { freq: 324, type: "triangle", gain: 0.05, pan: 0.5, lfoRate: 0.06, lfoDepth: 3 },
    ],
    shimmer: [432, 540, 648, 864],
  },
  {
    id: "396",
    name: "שחרור ושלווה",
    hz: "396 Hz",
    desc: "דרון עמוק ומקרקע — משחרר מתח ודאגה",
    color: "#d97706",
    voices: [
      { freq: 99, type: "sine", gain: 0.28, pan: -0.2, lfoRate: 0.03, lfoDepth: 3 },
      { freq: 198, type: "sine", gain: 0.16, pan: 0.2, lfoRate: 0.05, lfoDepth: 4 },
      { freq: 396, type: "sine", gain: 0.08, pan: 0, lfoRate: 0.04, lfoDepth: 5 },
    ],
    shimmer: [396, 495, 594],
  },
  {
    id: "639",
    name: "חיבור וקהילה",
    hz: "639 Hz",
    desc: "הרמוניה חמה — מחבר בין אנשים ולבבות",
    color: "#fcd34d",
    voices: [
      { freq: 160, type: "sine", gain: 0.2, pan: -0.3, lfoRate: 0.05, lfoDepth: 4 },
      { freq: 213, type: "sine", gain: 0.16, pan: 0.3, lfoRate: 0.06, lfoDepth: 5 },
      { freq: 320, type: "sine", gain: 0.12, pan: 0.1, lfoRate: 0.04, lfoDepth: 5 },
      { freq: 639, type: "sine", gain: 0.07, pan: 0, lfoRate: 0.03, lfoDepth: 6 },
    ],
    shimmer: [639, 799, 959, 1066],
  },
  {
    id: "sunrise",
    name: "זריחה",
    hz: "אקורד אור",
    desc: "אקורד מז'ורי נוצץ — תקווה ואור של בוקר",
    color: "#fde68a",
    voices: [
      { freq: 130.8, type: "sine", gain: 0.2, pan: -0.35, lfoRate: 0.05, lfoDepth: 4 }, // C3
      { freq: 164.8, type: "sine", gain: 0.16, pan: 0.0, lfoRate: 0.07, lfoDepth: 5 }, // E3
      { freq: 196.0, type: "sine", gain: 0.16, pan: 0.35, lfoRate: 0.06, lfoDepth: 5 }, // G3
      { freq: 261.6, type: "triangle", gain: 0.06, pan: 0.1, lfoRate: 0.04, lfoDepth: 6 }, // C4
    ],
    shimmer: [523.2, 659.2, 784.0, 1046.5],
  },
];

export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private voices: { osc: OscillatorNode; lfo?: OscillatorNode }[] = [];
  private shimmerTimer: ReturnType<typeof setTimeout> | null = null;
  private pianoTimer: ReturnType<typeof setTimeout> | null = null;
  private currentId: string | null = null;
  private volume = 0.7;

  /** id of the preset currently sounding, or null */
  get playingId(): string | null {
    return this.currentId;
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      // gentle limiter so layered sines never clip
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -12;
      comp.ratio.value = 12;
      this.master.connect(comp);
      comp.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.master && this.ctx && this.currentId) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.2);
    }
  }

  /** Start a preset, cross-fading out anything already playing. */
  play(preset: AmbientPreset) {
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") ctx.resume();
    this.teardownVoices(0.6);

    const now = ctx.currentTime;
    const master = this.master as GainNode;

    for (const v of preset.voices) {
      const osc = ctx.createOscillator();
      osc.type = v.type ?? "sine";
      osc.frequency.value = v.freq;

      const g = ctx.createGain();
      g.gain.value = 0;
      g.gain.setTargetAtTime(v.gain, now, 1.5); // slow fade-in

      const panner = ctx.createStereoPanner();
      panner.pan.value = v.pan ?? 0;

      osc.connect(g);
      g.connect(panner);
      panner.connect(master);
      osc.start();

      let lfo: OscillatorNode | undefined;
      if (v.lfoRate && v.lfoDepth) {
        lfo = ctx.createOscillator();
        lfo.frequency.value = v.lfoRate;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = v.lfoDepth; // in cents
        lfo.connect(lfoGain);
        lfoGain.connect(osc.detune);
        lfo.start();
      }

      this.voices.push({ osc, lfo });
    }

    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(this.volume, now, 1.2);

    this.currentId = preset.id;
    if (preset.shimmer && preset.shimmer.length) {
      this.scheduleShimmer(preset.shimmer);
    }
    if (preset.piano) {
      this.schedulePiano(preset.piano);
    }
  }

  /** Synthesize one soft, struck piano note (harmonics + decay). */
  private pianoNote(freq: number, t: number, vel: number, dur: number, pan: number) {
    const ctx = this.ctx as AudioContext;
    const master = this.master as GainNode;

    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, t);
    noteGain.gain.linearRampToValueAtTime(vel, t + 0.006); // quick strike
    noteGain.gain.exponentialRampToValueAtTime(0.0001, t + dur); // long natural decay

    // soften the tone so it never sounds harsh
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2600;
    lp.Q.value = 0.4;

    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;

    noteGain.connect(lp);
    lp.connect(panner);
    panner.connect(master);

    // partials with slight inharmonicity, like a real string
    const partials = [1, 0.5, 0.25, 0.13, 0.07];
    const B = 0.0004;
    for (let i = 0; i < partials.length; i++) {
      const n = i + 1;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq * n * Math.sqrt(1 + B * n * n);
      const pg = ctx.createGain();
      pg.gain.value = partials[i];
      osc.connect(pg);
      pg.connect(noteGain);
      osc.start(t);
      osc.stop(t + dur + 0.1);
    }
  }

  /** Schedule sparse, gentle piano notes from the preset scale. */
  private schedulePiano(cfg: AmbientPiano) {
    const ctx = this.ctx as AudioContext;
    const step = () => {
      if (!this.currentId) return;
      const t = ctx.currentTime + 0.05;
      const pick = () => cfg.scale[Math.floor(Math.random() * cfg.scale.length)];
      const vel = cfg.gain * (0.7 + Math.random() * 0.3);
      const dur = 3.5 + Math.random() * 2.5;
      const pan = Math.random() * 0.8 - 0.4;
      this.pianoNote(pick(), t, vel, dur, pan);
      // sometimes a soft companion note for a little warmth
      if (Math.random() < 0.35) {
        this.pianoNote(pick(), t + 0.09, vel * 0.65, dur, -pan);
      }
      const gap = cfg.gapMin + Math.random() * (cfg.gapMax - cfg.gapMin);
      this.pianoTimer = setTimeout(step, gap);
    };
    this.pianoTimer = setTimeout(step, 900);
  }

  /** Play one soft bell from the pool, then schedule the next at a random gap. */
  private scheduleShimmer(pool: number[]) {
    const ctx = this.ctx as AudioContext;
    const master = this.master as GainNode;
    const ring = () => {
      if (!this.currentId) return;
      const freq = pool[Math.floor(Math.random() * pool.length)];
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.08); // soft attack
      g.gain.exponentialRampToValueAtTime(0.0001, t + 4); // long tail
      const panner = ctx.createStereoPanner();
      panner.pan.value = Math.random() * 1.4 - 0.7;
      osc.connect(g);
      g.connect(panner);
      panner.connect(master);
      osc.start(t);
      osc.stop(t + 4.2);
      const nextGap = 4000 + Math.random() * 7000; // 4–11s between bells
      this.shimmerTimer = setTimeout(ring, nextGap);
    };
    this.shimmerTimer = setTimeout(ring, 2500);
  }

  private teardownVoices(fade: number) {
    if (this.shimmerTimer) {
      clearTimeout(this.shimmerTimer);
      this.shimmerTimer = null;
    }
    if (this.pianoTimer) {
      clearTimeout(this.pianoTimer);
      this.pianoTimer = null;
    }
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const dying = this.voices;
    this.voices = [];
    for (const { osc, lfo } of dying) {
      try {
        osc.stop(now + fade + 0.1);
        if (lfo) lfo.stop(now + fade + 0.1);
      } catch {
        /* already stopped */
      }
    }
  }

  /** Fade everything out and go silent. */
  stop() {
    if (!this.ctx || !this.master) {
      this.currentId = null;
      return;
    }
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(0, now, 0.4);
    this.teardownVoices(1.0);
    this.currentId = null;
  }

  dispose() {
    this.stop();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
      this.master = null;
    }
  }
}

/**
 * Optional generative ambient soundtrack + analyser (Web Audio API).
 * Only started from an explicit user gesture; exposes bass/mid/treble levels
 * that the particle engine can consume without knowing about audio.
 */
import type { AudioLevels } from '../particles/types';

export class AmbientAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private data: Uint8Array | null = null;
  private nodes: AudioScheduledSourceNode[] = [];
  private kickTimer: number | null = null;
  private nextKick = 0;

  get running(): boolean {
    return this.ctx !== null;
  }

  async start(): Promise<void> {
    if (this.ctx) return;
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    this.ctx = ctx;
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 2.5);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.75;
    master.connect(analyser);
    analyser.connect(ctx.destination);
    this.master = master;
    this.analyser = analyser;
    this.data = new Uint8Array(analyser.frequencyBinCount);

    // Pad: detuned saws through a slowly breathing low-pass filter.
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 700;
    filter.Q.value = 3;
    filter.connect(master);
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 450;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();
    this.nodes.push(lfo);
    [110, 164.81, 220, 261.63, 329.63].forEach((f, i) => {
      for (const det of [-6, 6]) {
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = f;
        o.detune.value = det + i;
        const g = ctx.createGain();
        g.gain.value = 0.05;
        o.connect(g).connect(filter);
        o.start();
        this.nodes.push(o);
      }
    });
    // Shimmer
    const sh = ctx.createOscillator();
    sh.frequency.value = 1318.5;
    const shGain = ctx.createGain();
    shGain.gain.value = 0.012;
    const trem = ctx.createOscillator();
    const tremGain = ctx.createGain();
    trem.frequency.value = 3.2;
    tremGain.gain.value = 0.01;
    trem.connect(tremGain).connect(shGain.gain);
    sh.connect(shGain).connect(master);
    sh.start();
    trem.start();
    this.nodes.push(sh, trem);

    // Soft heartbeat kick, scheduled slightly ahead of time.
    this.nextKick = ctx.currentTime + 0.5;
    const schedule = () => {
      if (!this.ctx || !this.master) return;
      while (this.nextKick < this.ctx.currentTime + 0.3) {
        this.kick(this.nextKick);
        this.nextKick += 0.92;
      }
    };
    this.kickTimer = window.setInterval(schedule, 100);
  }

  private kick(at: number): void {
    if (!this.ctx || !this.master) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.frequency.setValueAtTime(110, at);
    o.frequency.exponentialRampToValueAtTime(42, at + 0.25);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.9, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.5);
    o.connect(g).connect(this.master);
    o.start(at);
    o.stop(at + 0.55);
  }

  getLevels = (): AudioLevels => {
    if (!this.analyser || !this.data) return { bass: 0, mid: 0, treble: 0 };
    this.analyser.getByteFrequencyData(this.data as Uint8Array<ArrayBuffer>);
    const avg = (a: number, b: number) => {
      let s = 0;
      for (let i = a; i < b; i++) s += this.data![i];
      return s / ((b - a) * 255);
    };
    return { bass: avg(0, 4), mid: avg(4, 40), treble: avg(40, 160) };
  };

  async stop(): Promise<void> {
    const ctx = this.ctx;
    if (!ctx) return;
    if (this.kickTimer !== null) window.clearInterval(this.kickTimer);
    this.kickTimer = null;
    this.master?.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    await new Promise((r) => setTimeout(r, 450));
    this.nodes.forEach((n) => { try { n.stop(); } catch { /* already stopped */ } });
    this.nodes = [];
    this.ctx = null;
    this.master = null;
    this.analyser = null;
    await ctx.close();
  }
}


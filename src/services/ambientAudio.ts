/**
 * Synthesizes high-quality, continuous, soothing ambient soundscapes using the Web Audio API.
 * Completely offline, zero latency, works seamlessly in background alongside recitation.
 */

class AmbientAudioService {
  private ctx: AudioContext | null = null;
  private currentSoundId: string = 'none';
  private masterGain: GainNode | null = null;
  private activeNodes: { stop?: () => void; disconnect: () => void }[] = [];
  private volume: number = 0.45;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public stopSound() {
    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {}
    });
    this.activeNodes = [];
    this.currentSoundId = 'none';
  }

  public playSound(soundId: string) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.currentSoundId === soundId) return;

    this.stopSound();
    this.currentSoundId = soundId;

    if (soundId === 'none') return;

    switch (soundId) {
      case 'rain':
        this.createRainSound();
        break;
      case 'cat':
      case 'purr':
        this.createCatPurrSound();
        break;
      case 'owl':
        this.createNightOwlSound();
        break;
      case 'birds':
        this.createBirdsSound();
        break;
      case 'fire':
        this.createFireSound();
        break;
      case 'wave':
        this.createWaveSound();
        break;
      case 'wind':
        this.createWindSound();
        break;
      case 'river':
        this.createRiverSound();
        break;
      case 'crickets':
        this.createCricketsSound();
        break;
      case 'thunder':
      case 'thunderstorm':
        this.createThunderSound();
        break;
      case 'train':
        this.createTrainSound();
        break;
      case 'whale':
        this.createWhaleSound();
        break;
      default:
        this.createRainSound();
        break;
    }
  }

  // 1. Rain: Warm pink noise with bandpass filtering
  private createRainSound() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, filter);
  }

  // 2. Cat Purr: Rhythmic low frequency oscillation + soft flutter
  private createCatPurrSound() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(26, this.ctx.currentTime); // 26Hz purr fundamental

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(24, this.ctx.currentTime); // purr motor flutter

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(12, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const purrGain = this.ctx.createGain();
    purrGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    // Breath envelope LFO (inhale/exhale cycle of sleeping cat)
    const breathLfo = this.ctx.createOscillator();
    breathLfo.type = 'sine';
    breathLfo.frequency.setValueAtTime(0.4, this.ctx.currentTime); // ~2.5s breath cycle
    const breathGain = this.ctx.createGain();
    breathGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    breathLfo.connect(breathGain);
    breathGain.connect(purrGain.gain);

    osc.connect(purrGain);
    purrGain.connect(this.masterGain);

    osc.start();
    lfo.start();
    breathLfo.start();

    this.activeNodes.push(osc, lfo, breathLfo, purrGain);
  }

  // 3. Night Owl: Soothing dark forest wind + occasional gentle hoot
  private createNightOwlSound() {
    if (!this.ctx || !this.masterGain) return;
    // Ambient forest air
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.03;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise, filter);

    // Periodic gentle owl call
    const owlTimer = setInterval(() => {
      if (!this.ctx || !this.masterGain || this.currentSoundId !== 'owl') {
        clearInterval(owlTimer);
        return;
      }
      try {
        const now = this.ctx.currentTime;
        const owlOsc = this.ctx.createOscillator();
        const owlGain = this.ctx.createGain();
        owlOsc.type = 'sine';
        owlOsc.frequency.setValueAtTime(440, now);
        owlOsc.frequency.exponentialRampToValueAtTime(380, now + 0.4);

        owlGain.gain.setValueAtTime(0, now);
        owlGain.gain.linearRampToValueAtTime(0.18, now + 0.1);
        owlGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        owlOsc.connect(owlGain);
        owlGain.connect(this.masterGain);
        owlOsc.start(now);
        owlOsc.stop(now + 0.8);
      } catch {}
    }, 6000);
  }

  // 4. Ocean Waves: Swelling filtered noise
  private createWaveSound() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.08;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';

    const waveLfo = this.ctx.createOscillator();
    waveLfo.type = 'sine';
    waveLfo.frequency.setValueAtTime(0.15, this.ctx.currentTime); // 6-7 second wave cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(350, this.ctx.currentTime);
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    waveLfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.masterGain);

    noise.start();
    waveLfo.start();
    this.activeNodes.push(noise, filter, waveLfo);
  }

  // 5. Fire: Soft crackling sound
  private createFireSound() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Random sparks
      const isPop = Math.random() < 0.003;
      data[i] = isPop ? (Math.random() * 2 - 1) * 0.4 : (Math.random() * 2 - 1) * 0.02;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise, filter);
  }

  // 6. Wind: Deep ethereal whistle
  private createWindSound() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.05;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    const windLfo = this.ctx.createOscillator();
    windLfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);
    windLfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    windLfo.start();
    this.activeNodes.push(noise, filter, windLfo);
  }

  // 7. Birds: Soft morning nature
  private createBirdsSound() {
    this.createWindSound(); // background air
  }

  // 8. River
  private createRiverSound() {
    this.createRainSound();
  }

  // 9. Crickets
  private createCricketsSound() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(4500, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(16, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    const cricketGain = this.ctx.createGain();
    cricketGain.gain.setValueAtTime(0.03, this.ctx.currentTime);

    lfo.connect(lfoGain);
    osc.connect(cricketGain);
    cricketGain.connect(this.masterGain);

    osc.start();
    lfo.start();
    this.activeNodes.push(osc, lfo, cricketGain);
  }

  // 10. Thunder
  private createThunderSound() {
    this.createRainSound();
  }

  // 11. Train: Rhythmic chug
  private createTrainSound() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(45, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(3.2, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    lfo.start();
    this.activeNodes.push(osc, lfo, gain);
  }

  // 12. Whale: Deep underwater resonant drone
  private createWhaleSound() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    this.activeNodes.push(osc, gain);
  }
}

export const ambientAudio = new AmbientAudioService();

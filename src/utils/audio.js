class AudioEngine {
  constructor() {
    // AudioContext will be created on first interaction to bypass browser autoplay policies
    this.ctx = null;
    this.enabled = true; // SFX enabled by default
    this.isSupported = typeof window !== "undefined" && !!(window.AudioContext || window.webkitAudioContext);
  }

  init() {
    if (!this.isSupported) return;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.init();
      this.playCameraClick(); // Feedback sound
    }
    return this.enabled;
  }

  playTelemetryPing() {
    if (!this.enabled) return;
    if (!this.ctx) this.init();
    if (this.ctx.state === "suspended") return; // Waiting for user interaction
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Crisp, realistic radio tracking beacon (pure sine, no sweep)
    osc.type = "sine";
    osc.frequency.setValueAtTime(1500, this.ctx.currentTime);
    
    // Instant attack, short sustain, very fast release
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime + 0.005); // Instant blip
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime + 0.05);  // Hold for 45ms
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08); // Fast decay
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playFlyInSweep() {
    if (!this.enabled || !this.ctx) return;
    
    // Create a burst of white noise
    const bufferSize = this.ctx.sampleRate * 3; // 3 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // white noise
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Pass noise through a sweeping bandpass filter for a "whoosh" sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 2.0;
    
    filter.frequency.setValueAtTime(6000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 2.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  playCameraClick() {
    if (!this.enabled || !this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Sharp electronic click
    osc.type = "square";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
}

export const sfx = new AudioEngine();

// ===== EDITAR FEEDBACK SONORO AQUI =====
// Estes tons sao placeholders. Depois voce pode trocar por efeitos reais.
export class AudioSystem {
  constructor() {
    this.context = null;
    this.enabled = true;
  }

  prime() {
    if (!this.context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;

      if (AudioContextClass) {
        this.context = new AudioContextClass();
      }
    }

    if (this.context?.state === "suspended") {
      this.context.resume();
    }
  }

  play(cue) {
    if (!this.enabled || !this.context) {
      return;
    }

    const presets = {
      success: { frequency: 660, duration: 0.12, type: "square" },
      warning: { frequency: 360, duration: 0.14, type: "sawtooth" },
      error: { frequency: 220, duration: 0.18, type: "triangle" },
      alert: { frequency: 520, duration: 0.09, type: "square" }
    };
    const preset = presets[cue] || presets.alert;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = preset.type;
    oscillator.frequency.value = preset.frequency;
    gain.gain.value = 0.05;
    oscillator.connect(gain);
    gain.connect(this.context.destination);

    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + preset.duration);
    oscillator.stop(this.context.currentTime + preset.duration);
  }
}

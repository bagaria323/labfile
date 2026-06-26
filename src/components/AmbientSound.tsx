import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Flame, CloudRain, Coffee, Sparkles } from 'lucide-react';

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<'furnace' | 'rain' | 'pad'>('pad');
  const [volume, setVolume] = useState(0.3);

  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Audio Nodes for Furnace Crackle / hum
  const furnaceHumRef = useRef<OscillatorNode | null>(null);
  const furnaceNoiseRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);
  const furnaceGainRef = useRef<GainNode | null>(null);

  // Audio Nodes for Rain
  const rainNoiseRef = useRef<ScriptProcessorNode | null>(null);
  const rainFilterRef = useRef<BiquadFilterNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);

  // Audio Nodes for Lofi Synth Pad
  const padOsc1Ref = useRef<OscillatorNode | null>(null);
  const padOsc2Ref = useRef<OscillatorNode | null>(null);
  const padFilterRef = useRef<BiquadFilterNode | null>(null);
  const padGainRef = useRef<GainNode | null>(null);
  const padIntervalRef = useRef<number | null>(null);

  const masterGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      stopAll();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      // Create audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      
      // Master gain node
      masterGainRef.current = audioCtxRef.current.createGain();
      masterGainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
      masterGainRef.current.connect(audioCtxRef.current.destination);
    }
    
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const createWhiteNoise = (ctx: AudioContext) => {
    // Generate white noise using ScriptProcessorNode for wide compatibility
    const bufferSize = 4096;
    const node = ctx.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2.0 - 1.0;
      }
    };
    return node;
  };

  const startFurnaceHum = () => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    // A deep low-frequency hum (55Hz and 110Hz harmonics) representing the big XRD/sintering furnaces
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note, deep hum

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110, ctx.currentTime); // A2 note, warm harmonic

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, ctx.currentTime);

    // Create a crackling noise
    const noise = ctx.createScriptProcessor(4096, 1, 1);
    noise.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < e.outputBuffer.length; i++) {
        // Random clicks & crackles (furnace cooling or heat expansion)
        const rand = Math.random();
        if (rand > 0.997) {
          output[i] = (Math.random() * 2 - 1) * 0.4;
        } else {
          output[i] = (Math.random() * 2 - 1) * 0.01; // Low background hiss
        }
      }
    };

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);

    // Connect them
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    noise.connect(gainNode);
    gainNode.connect(master);

    osc1.start();
    osc2.start();

    // Store references
    furnaceHumRef.current = osc1; // keep osc1 for tracking, stop() both in stopAll
    furnaceNoiseRef.current = noise;
    furnaceGainRef.current = gainNode;

    // Auxiliary oscillators so we can stop them
    (osc2 as any)._secondary = true;
  };

  const startRain = () => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    // Lanka rain is cozy pink noise filtered to sound like distant showers
    const noise = ctx.createScriptProcessor(4096, 1, 1);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    noise.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < e.outputBuffer.length; i++) {
        const white = Math.random() * 2.0 - 1.0;
        // Pink noise filter approximation
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // normalise
        b6 = white * 0.115926;
      }
    };

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.6, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(master);

    rainNoiseRef.current = noise;
    rainFilterRef.current = filter;
    rainGainRef.current = gainNode;
  };

  const startNostalgiaPad = () => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    // Warm, retro ambient pad synthesizer that plays slow cozy chords
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, ctx.currentTime);
    filter.Q.setValueAtTime(1, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(master);

    // Play simple slow, breathing, beautiful chord changes:
    // Cmaj7 (C4, E4, G4, B4) -> Fmaj7 (F4, A4, C5, E5) -> Am (A3, C4, E4, G4)
    const chords = [
      [261.63, 329.63], // C4, E4
      [349.23, 440.00], // F4, A4
      [220.00, 261.63], // A3, C4
      [293.66, 349.23]  // D4, F4
    ];
    let chordIdx = 0;

    const playChord = () => {
      const now = ctx.currentTime;
      const freq1 = chords[chordIdx][0];
      const freq2 = chords[chordIdx][1];

      // Smooth frequency glide
      osc1.frequency.setValueAtTime(osc1.frequency.value, now);
      osc1.frequency.exponentialRampToValueAtTime(freq1, now + 1.5);

      osc2.frequency.setValueAtTime(osc2.frequency.value, now);
      osc2.frequency.exponentialRampToValueAtTime(freq2, now + 1.5);

      // Filter sweep simulation
      filter.frequency.setValueAtTime(filter.frequency.value, now);
      filter.frequency.linearRampToValueAtTime(200 + Math.random() * 200, now + 2);

      chordIdx = (chordIdx + 1) % chords.length;
    };

    // Initial frequency
    osc1.frequency.setValueAtTime(chords[0][0], ctx.currentTime);
    osc2.frequency.setValueAtTime(chords[0][1], ctx.currentTime);

    osc1.start();
    osc2.start();

    padOsc1Ref.current = osc1;
    padOsc2Ref.current = osc2;
    padFilterRef.current = filter;
    padGainRef.current = gainNode;

    // Chord progression interval
    playChord();
    const interval = window.setInterval(playChord, 5000);
    padIntervalRef.current = interval;
  };

  const stopAll = () => {
    // Stop furnace
    if (furnaceHumRef.current) {
      try { furnaceHumRef.current.stop(); } catch(e){}
      furnaceHumRef.current = null;
    }
    if (furnaceNoiseRef.current) {
      furnaceNoiseRef.current.disconnect();
      furnaceNoiseRef.current = null;
    }
    furnaceGainRef.current = null;

    // Stop rain
    if (rainNoiseRef.current) {
      rainNoiseRef.current.disconnect();
      rainNoiseRef.current = null;
    }
    rainFilterRef.current = null;
    rainGainRef.current = null;

    // Stop pad
    if (padOsc1Ref.current) {
      try { padOsc1Ref.current.stop(); } catch(e){}
      padOsc1Ref.current = null;
    }
    if (padOsc2Ref.current) {
      try { padOsc2Ref.current.stop(); } catch(e){}
      padOsc2Ref.current = null;
    }
    if (padIntervalRef.current) {
      clearInterval(padIntervalRef.current);
      padIntervalRef.current = null;
    }
    padFilterRef.current = null;
    padGainRef.current = null;
  };

  const startTrack = (track: 'furnace' | 'rain' | 'pad') => {
    stopAll();
    initAudioContext();
    if (!audioCtxRef.current) return;

    if (track === 'furnace') {
      startFurnaceHum();
    } else if (track === 'rain') {
      startRain();
    } else if (track === 'pad') {
      startNostalgiaPad();
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAll();
      setIsPlaying(false);
    } else {
      initAudioContext();
      setIsPlaying(true);
      startTrack(currentTrack);
    }
  };

  const handleChangeTrack = (track: 'furnace' | 'rain' | 'pad') => {
    setCurrentTrack(track);
    if (isPlaying) {
      startTrack(track);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(val, audioCtxRef.current.currentTime);
    }
  };

  return (
    <div id="ambient-player" className="fixed bottom-4 right-4 z-50 flex flex-col md:flex-row items-center gap-3 bg-white/95 backdrop-blur-md border border-[#e5e5e0] px-4 py-2.5 rounded-full shadow-md text-[#2d2d2d] transition-all duration-300">
      
      {/* Play/Pause Button */}
      <button
        id="btn-play-ambient"
        onClick={handleTogglePlay}
        className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
          isPlaying 
            ? 'bg-[#6b705c]/10 text-[#6b705c] hover:bg-[#6b705c]/20' 
            : 'bg-[#f0ede4] text-[#6d6875] hover:bg-[#e5e5e0]'
        }`}
        title={isPlaying ? "Mute Background Sound" : "Play Background Sound"}
      >
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-4 w-4 overflow-hidden">
            <span className="w-0.5 bg-[#6b705c] animate-[bounce_1s_infinite] h-full" style={{ animationDelay: '0.1s' }}></span>
            <span className="w-0.5 bg-[#6b705c] animate-[bounce_1s_infinite] h-2/3" style={{ animationDelay: '0.3s' }}></span>
            <span className="w-0.5 bg-[#6b705c] animate-[bounce_1s_infinite] h-4/5" style={{ animationDelay: '0.5s' }}></span>
            <span className="w-0.5 bg-[#6b705c] animate-[bounce_1s_infinite] h-1/2" style={{ animationDelay: '0.7s' }}></span>
          </div>
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </button>

      {/* Audio Controls */}
      <div className="flex items-center gap-3">
        {/* Track selection buttons */}
        <div className="flex items-center gap-1.5 bg-[#f0ede4]/60 p-1 rounded-full border border-[#e5e5e0]">
          <button
            id="btn-track-pad"
            onClick={() => handleChangeTrack('pad')}
            className={`px-2.5 py-1 rounded-full text-xs transition-all duration-150 cursor-pointer flex items-center gap-1 font-bold ${
              currentTrack === 'pad' 
                ? 'bg-[#b5838d]/10 text-[#b5838d]' 
                : 'text-[#6d6875] hover:text-[#4a4e40]'
            }`}
            title="Lofi Nostalgia Melodies"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">Nostalgia</span>
          </button>
          
          <button
            id="btn-track-furnace"
            onClick={() => handleChangeTrack('furnace')}
            className={`px-2.5 py-1 rounded-full text-xs transition-all duration-150 cursor-pointer flex items-center gap-1 font-bold ${
              currentTrack === 'furnace' 
                ? 'bg-[#b5838d]/10 text-[#b5838d]' 
                : 'text-[#6d6875] hover:text-[#4a4e40]'
            }`}
            title="Sintering Furnace Hum"
          >
            <Flame className="w-3 h-3" />
            <span className="hidden sm:inline">Furnace</span>
          </button>

          <button
            id="btn-track-rain"
            onClick={() => handleChangeTrack('rain')}
            className={`px-2.5 py-1 rounded-full text-xs transition-all duration-150 cursor-pointer flex items-center gap-1 font-bold ${
              currentTrack === 'rain' 
                ? 'bg-[#b5838d]/10 text-[#b5838d]' 
                : 'text-[#6d6875] hover:text-[#4a4e40]'
            }`}
            title="Lanka Monsoon & Chai Stall Rain"
          >
            <CloudRain className="w-3 h-3" />
            <span className="hidden sm:inline">Lanka Rain</span>
          </button>
        </div>

        {/* Volume slider */}
        <div className="hidden md:flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-[#6d6875]" />
          <input
            id="slider-ambient-volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 accent-[#6b705c] h-1 rounded-lg bg-[#e5e5e0] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

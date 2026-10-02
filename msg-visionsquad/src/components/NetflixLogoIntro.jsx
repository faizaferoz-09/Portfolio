import React, { useEffect, useState, useRef } from 'react';
import { FastForward } from 'lucide-react';

export default function NetflixLogoIntro({ onComplete }) {
  const [fading, setFading] = useState(false);
  const audioPlayedRef = useRef(false);

  // Play Netflix-style deep cinematic "Ta-Dum" bass & chime impact using Web Audio API
  const playCinematicSound = () => {
    if (audioPlayedRef.current) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // ── Sub-Bass Impact (Deep "Ta-Dum" Boom) ──
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.7, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 2.0);

      // ── Secondary Shimmer Chime / Multiverse Flare Chord ──
      [440, 659.25, 880, 1318.5].forEach((freq, idx) => {
        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.type = 'triangle';
        chime.frequency.setValueAtTime(freq, now + 0.3);

        chimeGain.gain.setValueAtTime(0.001, now + 0.3);
        chimeGain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 0.5);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

        chime.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chime.start(now + 0.3);
        chime.stop(now + 2.4);
      });

      audioPlayedRef.current = true;
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    // Attempt sound trigger
    playCinematicSound();

    // Fade out at 2.6s, complete at 3.2s
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2600);

    const finishTimer = setTimeout(() => {
      window.__playBackgroundVideo?.();
      onComplete?.();
    }, 3250);

    // Skip on Escape or Space
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        finish();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const finish = () => {
    window.__playBackgroundVideo?.();
    setFading(true);
    setTimeout(() => {
      onComplete?.();
    }, 400);
  };

  return (
    <div 
      className={`fv-intro-overlay ${fading ? 'fv-intro-overlay--fade-out' : ''}`}
      onClick={finish}
      title="Click or press Escape to skip intro"
    >
      {/* Background Nebula */}
      <div className="fv-intro-nebula" />

      {/* Netflix-Style Vertical Color Ribbon Spectrum */}
      <div className="fv-intro-ribbons">
        <div className="fv-intro-ribbon fv-intro-ribbon--1" />
        <div className="fv-intro-ribbon fv-intro-ribbon--2" />
        <div className="fv-intro-ribbon fv-intro-ribbon--3" />
        <div className="fv-intro-ribbon fv-intro-ribbon--4" />
        <div className="fv-intro-ribbon fv-intro-ribbon--5" />
        <div className="fv-intro-ribbon fv-intro-ribbon--6" />
      </div>

      {/* Central Stage */}
      <div className="fv-intro-stage">
        {/* Shockwave Rings on Impact */}
        <div className="fv-intro-shockwave" />
        <div className="fv-intro-shockwave fv-intro-shockwave--delay" />

        {/* Cinematic Logo */}
        <div className="fv-intro-logo-wrap">
          <img 
            src="/assets/img/fandomverse-logo.png" 
            alt="FandomVerse Logo" 
            className="fv-intro-logo-img"
          />
          {/* Light Sweep Beam */}
          <div className="fv-intro-flare" />
        </div>

        {/* Cinematic Tagline / Loading indicator */}
        <div className="fv-intro-tagline">
          <span className="fv-intro-tagline-dot" />
          <span>Entering the Multiverse</span>
          <span className="fv-intro-tagline-dot" />
        </div>
      </div>

      {/* Skip Button */}
      <button 
        className="fv-intro-skip-btn" 
        onClick={(e) => { e.stopPropagation(); finish(); }}
      >
        <span>Skip</span>
        <FastForward size={14} />
      </button>
    </div>
  );
}

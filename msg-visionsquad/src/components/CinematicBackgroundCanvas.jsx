import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function CinematicBackgroundCanvas({ activeTab = 'home' }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const START_SECONDS = 4;
  const END_SECONDS = 331.5; // Cut out closing credits at the end

  // Seamless loop restart at 4 seconds
  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = START_SECONDS;
    video.play().catch(() => {});
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.currentTime >= END_SECONDS) {
      video.currentTime = START_SECONDS;
      video.play().catch(() => {});
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict browser autoplay compliance
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    // Start playback directly at 4 seconds
    const startPlayback = () => {
      if (video.currentTime < START_SECONDS) {
        video.currentTime = START_SECONDS;
      }
      video.play().catch((err) => {
        console.warn('Autoplay waiting for gesture:', err);
      });
    };

    if (video.readyState >= 1) {
      startPlayback();
    } else {
      video.addEventListener('loadedmetadata', startPlayback, { once: true });
    }

    // Force play on any user gesture
    const handleGesture = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    window.addEventListener('click', handleGesture, { passive: true });
    window.addEventListener('touchstart', handleGesture, { passive: true });
    window.addEventListener('scroll', handleGesture, { passive: true, once: true });
    window.addEventListener('keydown', handleGesture, { passive: true, once: true });

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('scroll', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      video.volume = 1.0;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <div 
      className="fv-cinematic-bg-root"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        backgroundColor: '#0a0301'
      }}
      aria-hidden="true"
    >
      {/* ── 1. The Pure Native HTML5 Background Video (ZERO YouTube UI, ZERO pause icons, ZERO loading spinners, 100% direct instant autoplay) ── */}
      <video
        ref={videoRef}
        src="/assets/video/fatui-bg.mp4"
        autoPlay
        muted
        loop={false}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          opacity: 0.78,
          filter: 'contrast(1.02) brightness(0.92)',
          transition: 'opacity 0.6s ease'
        }}
      />

      {/* ── 2. Cinematic Warm Obsidian Tint Overlay (Eliminates harsh video lines behind text) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 40% 38%, rgba(12, 3, 1, 0.6) 0%, rgba(18, 4, 0, 0.45) 55%, rgba(10, 2, 0, 0.85) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* ── 3. Bottom Gradient Fade into Body Background ── */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '240px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(18, 4, 0, 0.72) 65%, #120400 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* ── 4. Subtle Interactive Sound Pill (Only on Home page so it doesn't obstruct other views) ── */}
      {activeTab === 'home' && (
        <div 
          style={{
            position: 'fixed',
            bottom: '18px',
            left: '18px',
            zIndex: 50,
            pointerEvents: 'auto'
          }}
        >
          <button
            onClick={toggleMute}
            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              fontSize: '0.74rem',
              fontWeight: 600,
              borderRadius: '9999px',
              backgroundColor: 'rgba(18, 4, 0, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 77, 45, 0.4)',
              color: !isMuted ? '#ff4d2d' : 'rgba(255, 255, 255, 0.75)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
            }}
          >
            <span 
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#ff4d2d',
                boxShadow: '0 0 8px #ff4d2d',
                display: 'inline-block'
              }} 
            />
            {!isMuted ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{!isMuted ? 'Sound On' : 'Muted (Click for Sound)'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

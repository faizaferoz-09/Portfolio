import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe, Star, Sparkles } from 'lucide-react';

// Render word with individual animated character spans
function CharWord({ word, startIndex, isGrad = false }) {
  return (
    <span className="fv-char-word">
      {word.split('').map((ch, idx) => (
        <span 
          key={idx} 
          className={`fv-char ${isGrad ? 'fv-grad-char' : ''}`} 
          style={{ '--char-index': startIndex + idx }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function HeroCinematic({ onNavigateTab }) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      className="fv-hero-fluxora"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '94vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'clamp(7.5rem, 10vh, 9rem)',
        paddingBottom: '3.5rem',
        background: 'transparent',
        zIndex: 1
      }}
    >
      <div 
        className="container-custom" 
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '0 1.5rem',
          width: '100%'
        }}
      >
        {/* ── 1. Eyebrow Badge ── */}
        <div 
          className={`fv-hero-eyebrow-wrap fv-text-fade-up ${isRevealed ? 'revealed' : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem',
            transitionDelay: '0.04s'
          }}
        >
          <div 
            className="fv-hero-globe-icon"
            style={{
              padding: '0.45rem',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <Globe size={18} color="#ffffff" />
          </div>
          <p 
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
              lineHeight: 1.25,
              color: 'rgba(255, 255, 255, 0.75)',
              margin: 0
            }}
          >
            Multi-Fandom Verse Portal<br />
            <span className="fv-hero-eyebrow-accent">Explored by fans from all over the world</span>
          </p>
        </div>

        {/* Soft Cinematic Ambient Dark Backdrop behind Title to prevent video lines/pillars cutting through */}
        <div 
          style={{
            position: 'absolute',
            top: '25%',
            left: '10%',
            width: '1000px',
            maxWidth: '95vw',
            height: '460px',
            background: 'radial-gradient(ellipse 70% 60% at 35% 45%, rgba(10, 2, 1, 0.75) 0%, rgba(14, 3, 1, 0.45) 55%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 0,
            filter: 'blur(35px)'
          }}
          aria-hidden="true"
        />

        {/* ── 2. Massive Editorial Kinetic Heading with Character-by-Character Effect ── */}
        <h1 
          className="fv-hero-kinetic-title"
          style={{
            fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)',
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: '-0.035em',
            maxWidth: '1100px',
            color: '#ffffff',
            margin: '0 0 2rem 0',
            fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            textTransform: 'uppercase',
            position: 'relative',
            zIndex: 2,
            overflow: 'visible',
            perspective: '1000px',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
        >
          {/* Line 1: ENTER THE */}
          <span style={{ display: 'block', overflow: 'visible', padding: '4px 0' }}>
            <span 
              className={`fv-hero-line fv-hero-line--1 ${isRevealed ? 'revealed' : ''}`}
              style={{
                display: 'inline-flex',
                gap: '0.35em',
                overflow: 'visible'
              }}
            >
              <CharWord word="ENTER" startIndex={0} />
              <CharWord word="THE" startIndex={5} />
            </span>
          </span>

          {/* Line 2: FANDOM VERSE */}
          <span style={{ display: 'block', overflow: 'visible', padding: '4px 0' }}>
            <span 
              className={`fv-hero-line fv-hero-line--2 ${isRevealed ? 'revealed' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: '0.35em',
                overflow: 'visible'
              }}
            >
              <CharWord word="FANDOM" startIndex={8} />
              <CharWord word="VERSE" startIndex={14} isGrad={true} />
            </span>
          </span>

          {/* Line 3: WHERE EVERY FAN BELONGS */}
          <span style={{ display: 'block', overflow: 'visible', padding: '4px 0' }}>
            <span 
              className={`fv-hero-line fv-hero-line--3 ${isRevealed ? 'revealed' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                gap: '0.38em',
                overflow: 'visible'
              }}
            >
              <CharWord word="WHERE" startIndex={19} />
              <CharWord word="EVERY" startIndex={24} />
              <CharWord word="FAN" startIndex={29} isGrad={true} />
              <CharWord word="BELONGS" startIndex={32} isGrad={true} />
            </span>
          </span>
        </h1>

        {/* ── 3. Subtitle & Action Row ── */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '2.5rem',
            marginTop: '1.5rem'
          }}
        >
          <div style={{ maxWidth: '540px' }}>
            <p 
              className={`fv-hero-sub-text fv-text-fade-up ${isRevealed ? 'revealed' : ''}`}
              style={{
                fontSize: 'clamp(0.98rem, 1.15vw, 1.08rem)',
                color: '#ffffff',
                lineHeight: 1.6,
                margin: '0 0 2rem 0',
                fontFamily: "var(--font-body), 'Inter', sans-serif",
                transitionDelay: '0.38s',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.85), 0 1px 3px rgba(0, 0, 0, 0.95)'
              }}
            >
              Where every fandom has a dedicated verse. Discover curated lore, characters, media streams, and official collectibles shaped for true fans.
            </p>

            {/* CTAs and Social Proof */}
            <div 
              className={`fv-hero-cta-group fv-text-fade-up ${isRevealed ? 'revealed' : ''}`}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1.75rem',
                transitionDelay: '0.48s'
              }}
            >
              {/* Primary Fluxora Button */}
              <button
                onClick={() => onNavigateTab('categories')}
                className="group"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#ff4d2d',
                  borderRadius: '9999px',
                  padding: '5px 5px 5px 22px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 6px 24px rgba(255, 77, 45, 0.45)'
                }}
              >
                <span 
                  style={{
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    marginRight: '14px',
                    letterSpacing: '0.02em'
                  }}
                >
                  Explore Realms
                </span>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.25s ease'
                  }}
                >
                  <ArrowRight size={18} color="#000000" />
                </div>
              </button>

              {/* Secondary Ghost Button */}
              <button
                onClick={() => onNavigateTab('characters')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.75rem 1.6rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 77, 45, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                }}
              >
                Meet Characters
              </button>

              {/* Social Proof Avatars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex' }}>
                  {[
                    "/assets/img/anime/gojo.jpg",
                    "/assets/img/anime/demon-slayer.jpg",
                    "/assets/img/gaming/genshin.jpg"
                  ].map((src, i) => (
                    <div 
                      key={i} 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '2px solid #120400',
                        overflow: 'hidden',
                        marginLeft: i === 0 ? 0 : '-10px',
                        backgroundColor: '#1f1410'
                      }}
                    >
                      <img src={src} alt="Fan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.95)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                    800K+ Active Fans
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.45)' }}>Over 50+ Verses</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. Metric Stat Cards ── */}
          <div className="fv-hero-stats-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Stat Card 1 */}
            <div 
              className="group"
              style={{
                position: 'relative',
                padding: '1.6rem 2rem',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                minWidth: '170px',
                color: '#ffffff',
                transition: 'all 0.3s ease'
              }}
            >
              <Star 
                size={16} 
                color="rgba(255, 255, 255, 0.35)" 
                style={{ position: 'absolute', top: '16px', right: '16px' }} 
              />
              <h3 className="fv-stat-number" style={{ fontSize: '2.5rem', fontWeight: 400, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
                150+
              </h3>
              <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.5)', margin: 0, fontWeight: 600 }}>
                Fandom Hubs
              </p>
            </div>

            {/* Stat Card 2 */}
            <div 
              className="group"
              style={{
                position: 'relative',
                padding: '1.6rem 2rem',
                borderRadius: '24px',
                border: '1px solid rgba(255, 77, 45, 0.3)',
                backgroundColor: 'rgba(255, 77, 45, 0.08)',
                backdropFilter: 'blur(16px)',
                minWidth: '170px',
                color: '#ffffff',
                transition: 'all 0.3s ease'
              }}
            >
              <Sparkles 
                size={16} 
                color="#ff4d2d" 
                style={{ position: 'absolute', top: '16px', right: '16px' }} 
              />
              <h3 className="fv-stat-number" style={{ fontSize: '2.5rem', fontWeight: 400, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', color: '#ff4d2d' }}>
                98%
              </h3>
              <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.5)', margin: 0, fontWeight: 600 }}>
                Fan Satisfaction
              </p>
            </div>
          </div>
        </div>

        {/* ── 5. Partner / Universe Ticker ── */}
        <div 
          className="fv-franchise-ticker"
          style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            opacity: 0.65
          }}
        >
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 600 }}>
            Featured Franchises
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.7)' }}>
            <span>SHONEN JUMP</span>
            <span>•</span>
            <span>MARVEL</span>
            <span>•</span>
            <span>HOYOVERSE</span>
            <span>•</span>
            <span>PLAYSTATION</span>
            <span>•</span>
            <span>DC MULTIVERSE</span>
            <span>•</span>
            <span>K-POP WAVE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

/* ─── 3D Tilt & Specular Light Hook ────────────────────────── */
function useTilt3D(strength = 14) {
  const ref = useRef(null);
  const cur = useRef({ x: 0, y: 0 });
  const tgt = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const onMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;

    tgt.current.x = (nx - 0.5) * strength;
    tgt.current.y = (ny - 0.5) * -strength;

    setGlarePos({
      x: Math.round(nx * 100),
      y: Math.round(ny * 100),
      opacity: 0.18
    });
  }, [strength]);

  const onLeave = useCallback(() => {
    tgt.current = { x: 0, y: 0 };
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  }, []);

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      cur.current.x = lerp(cur.current.x, tgt.current.x, 0.12);
      cur.current.y = lerp(cur.current.y, tgt.current.y, 0.12);
      if (ref.current) {
        ref.current.style.transform =
          `perspective(1000px) rotateY(${cur.current.x}deg) rotateX(${cur.current.y}deg) translateZ(0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return { ref, onMove, onLeave, glarePos };
}

/* ─── Real Authentic Franchise Visual & Thematic Badge Showcase ─────────── */
function FandomRealVisual({ category, accentColor = '#ff4d2d' }) {
  const REAL_CATEGORY_ASSETS = {
    anime: {
      image: '/assets/img/anime/demon-slayer.jpg',
      icon: 'fa-solid fa-dragon',
      realm: 'Anime Realm',
      tag: 'DEMON SLAYER & JUJUTSU'
    },
    gaming: {
      image: '/assets/img/gaming/genshin.jpg',
      icon: 'fa-solid fa-gamepad',
      realm: 'Gaming Realm',
      tag: 'GENSHIN & CYBERPUNK'
    },
    movies: {
      image: 'https://img.youtube.com/vi/cqGjhVJWtEg/hqdefault.jpg',
      icon: 'fa-solid fa-film',
      realm: 'Cinema Realm',
      tag: 'SPIDER-VERSE & MCU'
    },
    'tv-shows': {
      image: 'https://img.youtube.com/vi/b9EkMc79ZSU/hqdefault.jpg',
      icon: 'fa-solid fa-tv',
      realm: 'Series Realm',
      tag: 'STRANGER THINGS & ARCANE'
    },
    'k-pop': {
      image: 'https://img.youtube.com/vi/gdZLi9oWNZg/hqdefault.jpg',
      icon: 'fa-solid fa-microphone-lines',
      realm: 'K-Pop Realm',
      tag: 'BTS & BLACKPINK'
    },
    comics: {
      image: 'https://img.youtube.com/vi/kmJLuwP3MbY/hqdefault.jpg',
      icon: 'fa-solid fa-book-open',
      realm: 'Comics Realm',
      tag: 'DARK KNIGHT & SPIDER-MAN'
    },
    manga: {
      image: 'https://img.youtube.com/vi/89JWRYEIG-s/hqdefault.jpg',
      icon: 'fa-solid fa-book-bookmark',
      realm: 'Manga Realm',
      tag: 'ONE PIECE & BERSERK'
    }
  };

  const asset = REAL_CATEGORY_ASSETS[category.id] || {
    image: category.banner || '/assets/img/hero-bg.jpg',
    icon: 'fa-solid fa-compass',
    realm: `${category.name} Realm`,
    tag: 'EXPLORE REALM'
  };

  const finalImg = asset.image || category.banner || '/assets/img/hero-bg.jpg';

  return (
    <div className="fv-iso-card__media-wrap">
      {/* Real Authentic Studio Franchise Image */}
      <img
        src={finalImg}
        alt={`${category.name} Realm Artwork`}
        className="fv-iso-card__media-img"
        loading="lazy"
        onError={(e) => {
          if (e.target.src !== (category.banner || '/assets/img/hero-bg.jpg')) {
            e.target.src = category.banner || '/assets/img/hero-bg.jpg';
          }
        }}
      />

      {/* Atmospheric Vignette & Fade to Card Background */}
      <div className="fv-iso-card__media-overlay" />

      {/* Bottom Realm Ambient Floor Glow */}
      <div 
        className="fv-iso-ambient-wash" 
        style={{ '--wash-color': `${accentColor}55` }} 
      />
    </div>
  );
}

/* ─── Main Category Fandom Card with Real Franchise Artwork ─── */
export default function IsometricFandomCard({
  category,
  charCount = 5,
  articleCount = 2,
  mediaCount = 4,
  merchCount = 6,
  onClick,
  disableTilt = false
}) {
  const { ref, onMove, onLeave, glarePos } = useTilt3D(disableTilt ? 0 : 12);

  // Map category to a short luxury tagline if not provided
  const taglineMap = {
    anime: 'Infinite Shonen, transcendent anime arcs & legendary heroes.',
    gaming: 'Next-gen open worlds, competitive esports & legendary lore.',
    movies: 'Cinematic verses, visionary sci-fi epics & blockbuster VFX.',
    'tv-shows': 'Prestige streaming sagas, mystery dramas & cultural icons.',
    'k-pop': 'Global chart-toppers, hypnotic choreography & fan armies.',
    comics: 'Multiverse graphic panels, legendary superheroes & gritty arcs.',
    manga: 'Serialized tankobon chapters, raw mangaka artistry & dark lore.'
  };

  const currentDesc = category.description || taglineMap[category.id] || category.tagline;

  return (
    <div
      ref={ref}
      className="fv-iso-card"
      style={{
        '--card-accent': category.accentColor || '#ff4d2d',
        '--card-glow': `color-mix(in srgb, ${category.accentColor || '#ff4d2d'} 25%, transparent)`
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Explore ${category.name} Realm`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick && onClick(); }}
    >
      {/* Specular Flashlight/Cursor Glare */}
      <div
        className="fv-iso-card__glare"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}) 0%, transparent 60%)`
        }}
      />

      {/* Top Laser Border Rim Light */}
      <div className="fv-iso-card__top-rim" />

      {/* ── 1. UPPER SECTION: Real Authentic Franchise Visual & Thematic Badge Showcase ── */}
      <FandomRealVisual category={category} accentColor={category.accentColor || '#ff4d2d'} />

      {/* ── 2. LOWER SECTION: Content Details ── */}
      <div className="fv-iso-card__content">
        {/* Title */}
        <h3 className="fv-iso-card__title">
          {category.name}
        </h3>

        {/* Description / Lore Excerpt */}
        <p className="fv-iso-card__desc">
          {currentDesc}
        </p>

        {/* Dynamic Metric Badges */}
        <div className="fv-iso-card__metrics">
          <span className="fv-metric-badge">
            <span className="fv-metric-dot" />
            {charCount} Legends
          </span>
          <span className="fv-metric-sep">•</span>
          <span className="fv-metric-badge">
            {articleCount} Lore
          </span>
        </div>

        {/* Popular Franchise Tags */}
        {category.popularFranchises && category.popularFranchises.length > 0 && (
          <div className="fv-iso-card__tags">
            {category.popularFranchises.slice(0, 2).map((fr, idx) => (
              <span key={idx} className="fv-tag-chip">
                {fr}
              </span>
            ))}
          </div>
        )}

        {/* Interactive Action CTA Footer */}
        <div className="fv-iso-card__footer">
          <span className="fv-iso-card__cta">
            Enter Realm
            <ArrowRight size={14} className="fv-iso-card__arrow" />
          </span>
        </div>
      </div>

      {/* Bottom Glowing Laser Accent Line */}
      <div className="fv-iso-card__bottom-laser" />
    </div>
  );
}

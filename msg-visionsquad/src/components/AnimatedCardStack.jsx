import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, Bookmark, Play, ArrowRight, ChevronLeft, ChevronRight, 
  Pause, RotateCcw, Flame, Shield, Layers 
} from 'lucide-react';

/**
 * AnimatedCardStack
 * 
 * Recreates the luxury stacked animated cards deck (Image 2 style)
 * for the 7 Multiverse Realm categories.
 * 
 * Features:
 * - 3D stacked depth layers (front card + offset cards peeking from bottom)
 * - Fluid smooth card cycling with spring-like cubic bezier transitions
 * - Circular avatar preview badge (Image 2 signature element)
 * - Top-right metric pill ("X Legends • Y Lore") & bookmark button
 * - Bottom franchise tag chips ("Demon Slayer", "Jujutsu Kaisen", etc.)
 * - Auto-rotation with pause-on-hover & play/pause toggle
 * - Left/Right navigation arrows & clickable realm pagination dots
 * - Interactive direct click on stacked layers to bring them to front
 */
export default function AnimatedCardStack({
  categories = [],
  onSelectCategory,
  onNavigateTab,
  onWatchTrailer,
  onBookmarkToggle,
  isItemBookmarked,
  selectedCategoryFilter = 'all'
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('next'); // 'next' or 'prev'
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayTimerRef = useRef(null);
  const touchStartRef = useRef(0);

  // Sync activeIndex if user selected a specific filter in the pill bar
  useEffect(() => {
    if (selectedCategoryFilter && selectedCategoryFilter !== 'all') {
      const idx = categories.findIndex(c => c.id === selectedCategoryFilter);
      if (idx !== -1 && idx !== activeIndex) {
        setDirection(idx > activeIndex ? 'next' : 'prev');
        setActiveIndex(idx);
      }
    }
  }, [selectedCategoryFilter, categories]);

  // Next card handler
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('next');
    setActiveIndex(prev => (prev + 1) % categories.length);
    setTimeout(() => setIsAnimating(false), 450);
  };

  // Prev card handler
  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('prev');
    setActiveIndex(prev => (prev - 1 + categories.length) % categories.length);
    setTimeout(() => setIsAnimating(false), 450);
  };

  // Direct select handler
  const handleSelectIndex = (index) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);
    setDirection(index > activeIndex ? 'next' : 'prev');
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 450);
  };

  // Auto-play interval
  useEffect(() => {
    if (isPaused || categories.length <= 1) return;

    autoPlayTimerRef.current = setInterval(() => {
      setDirection('next');
      setActiveIndex(prev => (prev + 1) % categories.length);
    }, 4800);

    return () => clearInterval(autoPlayTimerRef.current);
  }, [isPaused, categories.length, activeIndex]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  // Specific avatar visual mapping for each realm (similar to Image 2 avatar)
  const REALM_AVATARS = {
    anime: '/assets/img/anime/demon-slayer.jpg',
    gaming: '/assets/img/gaming/genshin.jpg',
    movies: 'https://img.youtube.com/vi/cqGjhVJWtEg/hqdefault.jpg',
    'tv-shows': 'https://img.youtube.com/vi/b9EkMc79ZSU/hqdefault.jpg',
    'k-pop': 'https://img.youtube.com/vi/gdZLi9oWNZg/hqdefault.jpg',
    comics: 'https://img.youtube.com/vi/kmJLuwP3MbY/hqdefault.jpg',
    manga: 'https://img.youtube.com/vi/89JWRYEIG-s/hqdefault.jpg'
  };

  if (!categories || categories.length === 0) return null;

  // We display up to 4 layers in the stack (Front = 0, layer 1 = offset 1, layer 2 = offset 2, layer 3 = offset 3)
  const visibleLayers = [0, 1, 2, 3];

  return (
    <div 
      className="fv-animated-card-stack-section"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        padding: '1.5rem 1rem 3.5rem 1rem',
        userSelect: 'none'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Outer Card Deck Viewport ── */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: '440px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          perspective: '1200px'
        }}
      >
        {visibleLayers.map((layerOffset) => {
          const itemIndex = (activeIndex + layerOffset) % categories.length;
          const item = categories[itemIndex];
          if (!item) return null;

          const isFront = layerOffset === 0;
          const isSecond = layerOffset === 1;
          const isThird = layerOffset === 2;
          const isFourth = layerOffset === 3;

          // Stacking geometry matching Image 2:
          // Front: Y=0, Scale=1, Z=10
          // 2nd: Y=24px, Scale=0.94, Z=9 (peeking out from bottom)
          // 3rd: Y=46px, Scale=0.88, Z=8 (peeking further)
          // 4th: Y=66px, Scale=0.82, Z=7
          const translateY = layerOffset * 22;
          const scale = 1 - layerOffset * 0.058;
          const zIndex = 10 - layerOffset;
          const opacity = isFourth ? 0.35 : isThird ? 0.65 : isSecond ? 0.88 : 1;
          const brightness = isFront ? 1 : 1 - layerOffset * 0.18;
          const accentColor = item.accentColor || '#ff4d2d';
          const isBookmarked = isItemBookmarked?.(item.id);
          const avatarImg = REALM_AVATARS[item.id] || item.topTrailer?.thumbnail || item.banner;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (!isFront) {
                  handleSelectIndex(itemIndex);
                }
              }}
              style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                maxWidth: '780px',
                height: '380px',
                borderRadius: '30px',
                transform: `translateY(${translateY}px) scale(${scale})`,
                zIndex: zIndex,
                opacity: opacity,
                filter: `brightness(${brightness})`,
                transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: isFront ? 'default' : 'pointer',
                boxShadow: isFront
                  ? '0 25px 65px rgba(0, 0, 0, 0.85), 0 0 40px rgba(255, 77, 45, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                  : `0 18px 45px rgba(0, 0, 0, 0.75), 0 0 20px ${accentColor}22`,
                border: isFront 
                  ? '1px solid rgba(255, 77, 45, 0.45)' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(24, 8, 5, 0.95) 0%, rgba(14, 4, 2, 0.98) 100%)'
              }}
            >
              {/* Authentic Character Artwork Backdrop (In the background of the card) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${avatarImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'right 15% center',
                  opacity: isFront ? 0.75 : 0.35,
                  transform: isFront ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease'
                }}
              />

              {/* Seamless Dark Luxury Vignette & Left-to-Right Reading Mask */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `
                    linear-gradient(90deg, 
                      rgba(14, 4, 2, 0.98) 0%, 
                      rgba(16, 5, 3, 0.93) 36%, 
                      rgba(18, 5, 2, 0.65) 68%, 
                      rgba(10, 2, 1, 0.35) 100%
                    ),
                    linear-gradient(to top, 
                      rgba(10, 2, 1, 0.95) 0%, 
                      transparent 42%
                    ),
                    radial-gradient(ellipse at 85% 25%, ${accentColor}30 0%, transparent 60%)
                  `
                }}
              />

              {/* Top Accent Laser Line (Front Card Only) */}
              {isFront && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '5%',
                    right: '5%',
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${accentColor}, #ff856b, transparent)`,
                    boxShadow: `0 0 12px ${accentColor}`,
                    zIndex: 4
                  }}
                />
              )}

              {/* ── CARD CONTENT (Image 2 Layout & Architecture) ── */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 3,
                  width: '100%',
                  height: '100%',
                  padding: '1.75rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}
              >
                {/* 1. Top Bar: Eyebrow Tag + Metric Pill + Bookmark */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  {/* Eyebrow Fandom Tag */}
                  <span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: accentColor,
                      fontFamily: "'Inter Tight', sans-serif"
                    }}
                  >
                    <Sparkles size={13} color={accentColor} />
                    {item.name.toUpperCase()} VERSE • MULTIVERSE REALM
                  </span>

                  {/* Top Right Cluster: Metric Pill (like "3+ years" in Image 2) + Bookmark Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span
                      style={{
                        padding: '0.35rem 0.95rem',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Layers size={12} color="#ff4d2d" />
                      {item.charCount || 5} Legends • {item.articleCount || 2} Lore
                    </span>

                    {/* Bookmark Button */}
                    {onBookmarkToggle && isFront && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookmarkToggle(item);
                        }}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: isBookmarked ? '#ff4d2d' : 'rgba(255, 255, 255, 0.08)',
                          border: isBookmarked ? '1px solid #ff4d2d' : '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                          boxShadow: isBookmarked ? '0 0 14px rgba(255, 77, 45, 0.5)' : 'none'
                        }}
                        title="Save Verse to Vault"
                      >
                        <Bookmark size={14} fill={isBookmarked ? '#ffffff' : 'none'} />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Middle Block: Realm Title & Lore Description (Character artwork is displayed in the background) */}
                <div style={{ maxWidth: '580px', marginTop: '0.85rem', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                    <span 
                      style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: accentColor, 
                        boxShadow: `0 0 10px ${accentColor}`,
                        display: 'inline-block' 
                      }} 
                    />
                    <span 
                      style={{ 
                        fontSize: '0.76rem', 
                        color: '#ff856b', 
                        fontWeight: 700, 
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase'
                      }}
                    >
                      Featured Franchise Universe
                    </span>
                  </div>

                  <h3
                    style={{
                      margin: '0 0 0.45rem 0',
                      fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
                      fontWeight: 900,
                      color: '#ffffff',
                      letterSpacing: '-0.025em',
                      fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif",
                      lineHeight: 1.15
                    }}
                  >
                    {item.name} <span style={{ color: accentColor }}>Realm</span>
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.85)',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {item.tagline || item.description}
                  </p>
                </div>

                {/* 3. Bottom Row: Tag Chips (Like "Singing", "Photography" in Image 2) + CTA Action Buttons */}
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    gap: '1rem', 
                    flexWrap: 'wrap',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  {/* Franchise Tag Chips (Pills in Image 2) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    {item.popularFranchises && item.popularFranchises.slice(0, 3).map((fr, fIdx) => (
                      <span
                        key={fIdx}
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '0.28rem 0.75rem',
                          borderRadius: '9999px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#cbd5e1',
                          fontFamily: "'Inter', sans-serif"
                        }}
                      >
                        {fr}
                      </span>
                    ))}
                  </div>

                  {/* Interactive Action Buttons (Front Card Only) */}
                  {isFront && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {item.topTrailer && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onWatchTrailer && onWatchTrailer(item.topTrailer);
                          }}
                          style={{
                            padding: '0.5rem 1.05rem',
                            borderRadius: '9999px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.22)',
                            color: '#ffffff',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            transition: 'all 0.2s ease',
                            outline: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <Play size={13} fill="#ffffff" />
                          <span>Trailer</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCategory && onSelectCategory(item.id);
                          onNavigateTab && onNavigateTab('categories');
                        }}
                        style={{
                          padding: '0.52rem 1.25rem',
                          borderRadius: '9999px',
                          background: 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxShadow: '0 4px 18px rgba(255, 77, 45, 0.45)',
                          transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                          outline: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 77, 45, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 18px rgba(255, 77, 45, 0.45)';
                        }}
                      >
                        <span>Enter Realm</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── STACK CONTROLS & PAGINATION BAR (Bottom) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1.5rem',
          padding: '0.75rem 1.25rem',
          background: 'rgba(22, 8, 5, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 77, 45, 0.25)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'
        }}
      >
        {/* Left: Current Realm Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#ff4d2d', fontWeight: 800 }}>
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.4)' }}>/</span>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            {String(categories.length).padStart(2, '0')}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 700, marginLeft: '0.35rem' }}>
            {categories[activeIndex]?.name} Realm
          </span>
        </div>

        {/* Center: Realm Indicator Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {categories.map((cat, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectIndex(idx)}
                style={{
                  width: isActive ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: isActive ? '#ff4d2d' : 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  outline: 'none',
                  boxShadow: isActive ? '0 0 10px rgba(255, 77, 45, 0.6)' : 'none'
                }}
                title={cat.name}
              />
            );
          })}
        </div>

        {/* Right: Prev / Next / Pause Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {/* Pause / Play Toggle */}
          <button
            type="button"
            onClick={() => setIsPaused(prev => !prev)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: isPaused ? 'rgba(255, 255, 255, 0.5)' : '#ff4d2d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            title={isPaused ? 'Resume Auto-Play' : 'Pause Auto-Play'}
          >
            {isPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} />}
          </button>

          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 77, 45, 0.2)';
              e.currentTarget.style.borderColor = '#ff4d2d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
            title="Previous Card"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 77, 45, 0.2)',
              border: '1px solid rgba(255, 77, 45, 0.5)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ff4d2d';
              e.currentTarget.style.boxShadow = '0 0 14px rgba(255, 77, 45, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 77, 45, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            title="Next Card"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import IsometricFandomCard from './IsometricFandomCard';

/**
 * FandomCardSlider3D
 * 
 * Recreates the pure 3D Card Slider / Coverflow effect matching the reference design:
 * - Center card is active, flat (rotateY: 0deg), scaled up, full opacity, top z-index.
 * - Left cards are angled inward (positive rotateY), shifted left, scaled down, cascading depth.
 * - Right cards are angled inward (negative rotateY), shifted right, scaled down, cascading depth.
 * - Smooth cubic-bezier 3D transitions.
 * - Left/Right navigation controls, bottom pagination dots with category color glow.
 * - Touch swipe support and auto-rotation with hover pause.
 * - Direct click: clicking a side card brings it to center; clicking the center card enters the realm.
 */
export default function FandomCardSlider3D({
  categories = [],
  onSelectCategory,
  onNavigateTab
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const touchStartRef = useRef(0);
  const touchDeltaRef = useRef(0);
  const autoPlayTimerRef = useRef(null);

  const total = categories.length;

  // Window resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Slide navigation
  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setActiveIndex(prev => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setActiveIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  // Auto-slide effect
  useEffect(() => {
    if (isPaused || total <= 1) return;
    autoPlayTimerRef.current = setInterval(nextSlide, 4500);
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, total, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
    touchDeltaRef.current = 0;
  };

  const handleTouchMove = (e) => {
    touchDeltaRef.current = e.touches[0].clientX - touchStartRef.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaRef.current > 45) {
      prevSlide();
    } else if (touchDeltaRef.current < -45) {
      nextSlide();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  };

  const activeCategory = categories[activeIndex] || categories[0];
  const activeAccent = activeCategory?.accentColor || '#ff4d2d';

  return (
    <div 
      className="fv-slider-3d-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="3D Multiverse Fandom Realms Slider"
    >
      {/* 3D Perspective Stage */}
      <div className="fv-slider-3d-stage">
        {categories.map((cat, index) => {
          // Calculate circular distance from activeIndex (-3 to +3 for 7 items)
          let offset = index - activeIndex;
          const half = Math.floor(total / 2);
          if (offset > half) offset -= total;
          if (offset < -half) offset += total;

          const absOffset = Math.abs(offset);
          const sign = Math.sign(offset);

          // Calculate responsive parameters based on screen width
          let stepX = 240;
          let stepZ = 110;
          let maxVisible = 3;

          if (windowWidth < 640) {
            stepX = 110;
            stepZ = 60;
            maxVisible = 1;
          } else if (windowWidth < 1024) {
            stepX = 180;
            stepZ = 85;
            maxVisible = 2;
          }

          const isVisible = absOffset <= maxVisible;

          // 3D transforms matching the reference image:
          // Left cards: positive rotateY (angled toward center)
          // Right cards: negative rotateY (angled toward center)
          let translateX = 0;
          let translateZ = 0;
          let rotateY = 0;
          let scale = 1.05;
          let opacity = 1;
          let zIndex = 10;
          let filter = 'none';

          if (absOffset === 0) {
            translateX = 0;
            translateZ = 20;
            rotateY = 0;
            scale = 1.04;
            opacity = 1;
            zIndex = 10;
            filter = 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.85))';
          } else {
            // Inwards rotation (left cards rotate positive, right cards rotate negative)
            rotateY = -sign * (28 + absOffset * 6);
            translateX = sign * (absOffset * stepX);
            translateZ = -absOffset * stepZ;
            scale = Math.max(0.68, 1 - absOffset * 0.12);
            zIndex = 10 - absOffset;
            opacity = isVisible ? Math.max(0.35, 1 - absOffset * 0.28) : 0;
            filter = `brightness(${Math.max(0.55, 1 - absOffset * 0.2)})`;
          }

          const isCenter = absOffset === 0;

          return (
            <div
              key={cat.id}
              className={`fv-slider-3d-item ${isCenter ? 'active' : ''}`}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex,
                opacity,
                pointerEvents: isVisible ? 'auto' : 'none',
                filter
              }}
              onClick={() => {
                if (isCenter) {
                  onSelectCategory && onSelectCategory(cat.id);
                  onNavigateTab && onNavigateTab('categories');
                } else {
                  setActiveIndex(index);
                }
              }}
            >
              <IsometricFandomCard
                category={cat}
                charCount={cat.charCount}
                articleCount={cat.articleCount}
                mediaCount={cat.mediaCount}
                merchCount={cat.merchCount}
                disableTilt={!isCenter}
                onClick={() => {
                  if (isCenter) {
                    onSelectCategory && onSelectCategory(cat.id);
                    onNavigateTab && onNavigateTab('categories');
                  } else {
                    setActiveIndex(index);
                  }
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow Controls */}
      <button
        className="fv-slider-3d-nav fv-slider-3d-nav--prev"
        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
        aria-label="Previous Realm"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className="fv-slider-3d-nav fv-slider-3d-nav--next"
        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
        aria-label="Next Realm"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Indicators & Realm Status */}
      <div className="fv-slider-3d-controls">
        <div className="fv-slider-3d-dots">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              className={`fv-slider-3d-dot ${idx === activeIndex ? 'active' : ''}`}
              style={{
                '--dot-accent': cat.accentColor || '#ff4d2d',
                boxShadow: idx === activeIndex ? `0 0 14px ${cat.accentColor || '#ff4d2d'}` : undefined
              }}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to ${cat.name} Realm`}
            >
              <span className="fv-slider-3d-dot-inner" />
            </button>
          ))}
        </div>

        <div className="fv-slider-3d-caption">
          <span 
            className="fv-slider-3d-badge"
            style={{ 
              borderColor: `${activeAccent}66`,
              color: activeAccent,
              background: `color-mix(in srgb, ${activeAccent} 12%, transparent)`
            }}
          >
            <Sparkles size={13} style={{ display: 'inline', marginRight: '5px' }} />
            {activeCategory?.name} Realm • {activeIndex + 1} of {total}
          </span>
          <span className="fv-slider-3d-hint">
            (Click arrows or side cards to slide • Click center card to enter)
          </span>
        </div>
      </div>
    </div>
  );
}

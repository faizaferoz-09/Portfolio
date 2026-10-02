import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Calendar, Flame, Bell, Check, Film, Sparkles, 
  Clock, Tag, ArrowRight, Radio, ExternalLink, Bookmark,
  ChevronLeft, ChevronRight, Play, Pause, LayoutGrid, Layers, Eye
} from 'lucide-react';
import { UPCOMING_RELEASES_DATA } from '../js/data/upcomingReleasesData';
import { CATEGORIES_DATA } from '../js/data/categoriesData';

export default function UpcomingReleases({
  selectedCategory = 'all',
  onOpenMedia,
  onBookmarkToggle,
  isItemBookmarked,
  onShowToast
}) {
  const [reminders, setReminders] = useState(() => {
    try {
      const saved = localStorage.getItem('fandomverse_release_reminders');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeFilter, setActiveFilter] = useState('all'); // all, confirmed, teaser, production
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewMode, setViewMode] = useState('stack'); // 'stack' (3D Fanned Deck) or 'grid'
  const autoPlayRef = useRef(null);
  const touchStartRef = useRef(0);

  // Find category details
  const categoryInfo = CATEGORIES_DATA.find(c => c.id === selectedCategory);

  // Filter items by category
  const releases = useMemo(() => {
    let items = UPCOMING_RELEASES_DATA;
    if (selectedCategory && selectedCategory !== 'all') {
      items = items.filter(r => r.category === selectedCategory);
    }
    if (activeFilter === 'confirmed') {
      items = items.filter(r => r.status.toLowerCase().includes('confirmed') || r.status.toLowerCase().includes('live'));
    } else if (activeFilter === 'teaser') {
      items = items.filter(r => r.status.toLowerCase().includes('teaser') || r.status.toLowerCase().includes('trailer'));
    } else if (activeFilter === 'production') {
      items = items.filter(r => r.status.toLowerCase().includes('production') || r.status.toLowerCase().includes('announced'));
    }
    return items;
  }, [selectedCategory, activeFilter]);

  // Reset activeIndex when category or filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory, activeFilter]);

  // Next / Prev handlers
  const handleNext = () => {
    if (releases.length === 0) return;
    setActiveIndex(prev => (prev + 1) % releases.length);
  };

  const handlePrev = () => {
    if (releases.length === 0) return;
    setActiveIndex(prev => (prev - 1 + releases.length) % releases.length);
  };

  // Auto-play interval for 3D card carousel
  useEffect(() => {
    if (isPaused || viewMode !== 'stack' || releases.length <= 1) return;

    autoPlayRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % releases.length);
    }, 4500);

    return () => clearInterval(autoPlayRef.current);
  }, [isPaused, viewMode, releases.length, activeIndex]);

  // Toggle release reminder
  const handleToggleReminder = (item) => {
    setReminders(prev => {
      const next = { ...prev, [item.id]: !prev[item.id] };
      try {
        localStorage.setItem('fandomverse_release_reminders', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    if (!reminders[item.id]) {
      onShowToast?.(`🔔 Premiere alert activated for "${item.title}"!`);
    } else {
      onShowToast?.(`Reminder removed for "${item.title}".`);
    }
  };

  // Touch Swipe for mobile
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  const categoryName = categoryInfo ? categoryInfo.name : 'Multiverse';
  const accentColor = categoryInfo ? categoryInfo.accentColor : '#ff4d2d';

  return (
    <section 
      className="fv-upcoming-section" 
      style={{ 
        marginTop: '3.5rem', 
        marginBottom: '4rem',
        position: 'relative'
      }}
    >
      {/* ── 1. Section Header ── */}
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'flex-end', 
          justifyContent: 'space-between', 
          gap: '1.25rem', 
          marginBottom: '2rem' 
        }}
      >
        <div>
          <span 
            className="fv-section__tag" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              borderColor: 'rgba(255, 77, 45, 0.4)',
              background: 'rgba(255, 77, 45, 0.12)',
              color: '#ff4d2d',
              marginBottom: '0.5rem'
            }}
          >
            <Sparkles size={14} color="#ff4d2d" />
            CINEMATIC PREMIERES & TEASERS
          </span>
          <h2 className="fv-section__title" style={{ textAlign: 'left', margin: 0 }}>
            UPCOMING <span className="fv-grad">{categoryName.toUpperCase()} TEASERS</span>
          </h2>
          <p className="fv-section__desc" style={{ textAlign: 'left', margin: '0.4rem 0 0 0', maxWidth: '680px' }}>
            Immerse yourself in officially confirmed release dates, trailers, and next-gen teaser drops for <strong style={{ color: '#ffffff' }}>{categoryName}</strong>.
          </p>
        </div>

        {/* Action Controls (Filter Pills + View Mode Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* Quick Status Filter Pills */}
          <div className="filter-btn-group" style={{ margin: 0 }}>
            {[
              { id: 'all', label: `All (${releases.length})` },
              { id: 'teaser', label: 'Teasers Live' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'production', label: 'In Studio' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`filter-btn ${activeFilter === f.id ? 'active' : ''}`}
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle Button */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '9999px', padding: '3px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <button
              onClick={() => setViewMode('stack')}
              style={{
                background: viewMode === 'stack' ? '#ff4d2d' : 'transparent',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="3D Fanned Deck View"
            >
              <Layers size={13} />
              <span>3D Fan</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? '#ff4d2d' : 'transparent',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Grid Matrix View"
            >
              <LayoutGrid size={13} />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Empty State ── */}
      {releases.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <Calendar size={44} color="#ff4d2d" style={{ marginBottom: '0.85rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.4rem' }}>No Teasers in this Category Filter</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Select another category or switch filter to view drops.</p>
        </div>
      ) : viewMode === 'stack' ? (
        
        /* ── 3. 3D FANNED CARD DECK ANIMATION (Exact Reference Image Style) ── */
        <div
          className="fv-fanned-carousel-wrap"
          style={{
            position: 'relative',
            width: '100%',
            padding: '2.5rem 0 1rem 0',
            overflow: 'visible'
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ambient Background Glow Aura behind 3D Deck */}
          <div 
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '580px',
              height: '320px',
              background: 'radial-gradient(ellipse at center, rgba(255, 77, 45, 0.25) 0%, rgba(255, 77, 45, 0.05) 55%, transparent 75%)',
              filter: 'blur(45px)',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />

          {/* 3D Viewport Stage */}
          <div 
            style={{
              position: 'relative',
              width: '100%',
              height: '490px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '1400px',
              perspectiveOrigin: '50% 45%'
            }}
          >
            {releases.map((item, idx) => {
              const count = releases.length;
              // Calculate relative offset from activeIndex (-1 = Left, 0 = Center, +1 = Right)
              let offset = (idx - activeIndex) % count;
              if (offset < -Math.floor(count / 2)) offset += count;
              if (offset > Math.floor(count / 2)) offset -= count;

              const isCenter = offset === 0;
              const isLeft = offset === -1 || (count === 2 && offset === 1 && activeIndex === 1);
              const isRight = offset === 1 || (count === 2 && offset === -1 && activeIndex === 0);
              const isVisible = isCenter || isLeft || isRight;

              // Compute precise 3D Transform and Rotation matching user reference image
              let translateX = 0;
              let translateY = 0;
              let rotateZ = 0;
              let scale = 1;
              let zIndex = 1;
              let opacity = 0;
              let filter = 'none';

              if (isCenter) {
                translateX = 0;
                translateY = -8;
                rotateZ = 0;
                scale = 1.05;
                zIndex = 10;
                opacity = 1;
                filter = 'drop-shadow(0 20px 45px rgba(0, 0, 0, 0.85))';
              } else if (isLeft) {
                translateX = -180;
                translateY = 16;
                rotateZ = -9;
                scale = 0.88;
                zIndex = 5;
                opacity = 0.78;
                filter = 'brightness(0.72) drop-shadow(0 15px 35px rgba(0, 0, 0, 0.7))';
              } else if (isRight) {
                translateX = 180;
                translateY = 16;
                rotateZ = 9;
                scale = 0.88;
                zIndex = 5;
                opacity = 0.78;
                filter = 'brightness(0.72) drop-shadow(0 15px 35px rgba(0, 0, 0, 0.7))';
              } else {
                // Hidden cards behind the scene
                translateX = offset < 0 ? -320 : 320;
                translateY = 40;
                rotateZ = offset < 0 ? -15 : 15;
                scale = 0.7;
                zIndex = 1;
                opacity = 0;
              }

              const isReminded = !!reminders[item.id];

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isCenter) {
                      setActiveIndex(idx);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    width: '335px',
                    maxWidth: '88vw',
                    height: '445px',
                    borderRadius: '26px',
                    transform: `translateX(${translateX}px) translateY(${translateY}px) rotateZ(${rotateZ}deg) scale(${scale})`,
                    transformOrigin: '50% 85%',
                    zIndex: zIndex,
                    opacity: opacity,
                    filter: filter,
                    transition: 'all 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.15)',
                    cursor: isCenter ? 'default' : 'pointer',
                    background: isCenter 
                      ? 'linear-gradient(165deg, rgba(28, 11, 8, 0.92) 0%, rgba(14, 4, 3, 0.98) 100%)'
                      : 'linear-gradient(165deg, rgba(20, 8, 6, 0.85) 0%, rgba(10, 3, 2, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: isCenter 
                      ? '1.5px solid rgba(255, 77, 45, 0.55)' 
                      : '1px solid rgba(255, 255, 255, 0.14)',
                    boxShadow: isCenter 
                      ? '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 77, 45, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.25)' 
                      : '0 15px 35px rgba(0, 0, 0, 0.65)',
                    padding: '1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    pointerEvents: isVisible ? 'auto' : 'none'
                  }}
                >
                  {/* ── Signature Floating Glass Sparkle Disc Badge on Center Card ── */}
                  {isCenter && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-24px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 77, 45, 0.2) 60%, rgba(14, 4, 3, 0.85) 100%)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1.5px solid rgba(255, 255, 255, 0.6)',
                        boxShadow: '0 0 24px rgba(255, 77, 45, 0.6), 0 8px 20px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 25,
                        animation: 'fvBadgeFloat 3s ease-in-out infinite alternate'
                      }}
                      title="Featured Teaser Premiere"
                    >
                      <Sparkles size={22} color="#ffffff" fill="rgba(255, 255, 255, 0.85)" />
                    </div>
                  )}

                  {/* Top Artwork Image Box */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '215px',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      background: '#0a0302'
                    }}
                  >
                    <img
                      src={item.banner}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/img/hero-bg.jpg';
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: isCenter ? 'scale(1.02)' : 'scale(1)',
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />

                    {/* Dark gradient overlay on artwork */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(10, 3, 2, 0.85) 100%)',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Top Right Hype Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        background: 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)',
                        borderRadius: '999px',
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        boxShadow: '0 2px 10px rgba(255, 77, 45, 0.6)'
                      }}
                    >
                      <Flame size={11} fill="#ffffff" color="#ffffff" />
                      <span>{item.hypeScore}% Hype</span>
                    </div>

                    {/* Top Left Premiere Date */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        zIndex: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'rgba(10, 4, 3, 0.85)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 77, 45, 0.45)',
                        borderRadius: '999px',
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#ffffff'
                      }}
                    >
                      <Calendar size={11} color="#ff4d2d" />
                      <span>{item.releaseDate}</span>
                    </div>

                    {/* Play Overlay if video available and center */}
                    {item.videoUrl && onOpenMedia && isCenter && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenMedia({
                            id: item.id,
                            title: item.title,
                            videoUrl: item.videoUrl,
                            description: item.synopsis,
                            type: 'trailer',
                            category: item.category,
                            creator: item.studio
                          });
                        }}
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#ff4d2d',
                          boxShadow: '0 0 16px rgba(255, 77, 45, 0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 4,
                          transition: 'transform 0.2s ease'
                        }}
                        title="Play Teaser Trailer"
                      >
                        <Play size={16} fill="#ffffff" color="#ffffff" style={{ marginLeft: '2px' }} />
                      </div>
                    )}
                  </div>

                  {/* Bottom Text Content (Matching Reference Image) */}
                  <div style={{ padding: '0.85rem 0.4rem 0.2rem 0.4rem', textAlign: 'center' }}>
                    {/* Title */}
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        color: '#ffffff',
                        lineHeight: 1.25,
                        margin: '0 0 0.35rem 0',
                        fontFamily: "'Inter Tight', -apple-system, sans-serif",
                        letterSpacing: '-0.02em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    {/* Studio / Role Subtitle in Coral Flame Color */}
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#ff684a',
                        letterSpacing: '0.02em',
                        marginBottom: '0.65rem'
                      }}
                    >
                      {item.studio} • {item.format}
                    </div>

                    {/* Action Buttons Row on Center Card */}
                    {isCenter && (
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '0.5rem',
                          marginTop: '0.5rem'
                        }}
                      >
                        {item.videoUrl && onOpenMedia && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenMedia({
                                id: item.id,
                                title: item.title,
                                videoUrl: item.videoUrl,
                                description: item.synopsis,
                                type: 'trailer',
                                category: item.category,
                                creator: item.studio
                              });
                            }}
                            className="btn-cyber-primary"
                            style={{
                              padding: '0.45rem 1rem',
                              fontSize: '0.78rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              borderRadius: '9999px',
                              background: 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)',
                              boxShadow: '0 0 14px rgba(255, 77, 45, 0.5)'
                            }}
                          >
                            <Film size={13} color="#ffffff" />
                            <span>Watch Teaser</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleReminder(item);
                          }}
                          style={{
                            padding: '0.45rem 0.95rem',
                            fontSize: '0.78rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            borderRadius: '9999px',
                            background: isReminded ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.08)',
                            border: isReminded ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            cursor: 'pointer',
                            fontWeight: 700,
                            transition: 'all 0.2s ease'
                          }}
                          title={isReminded ? "Reminder is active" : "Set premiere alert"}
                        >
                          {isReminded ? (
                            <>
                              <Check size={13} color="#ffffff" />
                              <span>Alert Set</span>
                            </>
                          ) : (
                            <>
                              <Bell size={13} color="#ff684a" />
                              <span>Remind Me</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── 3D Controls Bar (Pagination, Arrows, Pause/Play) ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: '560px',
              margin: '1.25rem auto 0 auto',
              padding: '0.65rem 1.25rem',
              background: 'rgba(22, 8, 5, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 77, 45, 0.3)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Left Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 800 }}>
              <span style={{ color: '#ff4d2d' }}>{String(activeIndex + 1).padStart(2, '0')}</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>/</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{String(releases.length).padStart(2, '0')}</span>
            </div>

            {/* Center Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {releases.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  style={{
                    width: i === activeIndex ? '22px' : '7px',
                    height: '7px',
                    borderRadius: '9999px',
                    background: i === activeIndex ? '#ff4d2d' : 'rgba(255, 255, 255, 0.25)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.25s ease',
                    boxShadow: i === activeIndex ? '0 0 10px rgba(255, 77, 45, 0.8)' : 'none'
                  }}
                />
              ))}
            </div>

            {/* Right Arrows & Pause/Play */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setIsPaused(p => !p)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: isPaused ? 'rgba(255, 255, 255, 0.5)' : '#ff4d2d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={isPaused ? "Resume auto cycle" : "Pause auto cycle"}
              >
                {isPaused ? <Play size={11} fill="currentColor" /> : <Pause size={11} />}
              </button>

              <button
                type="button"
                onClick={handlePrev}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Previous teaser"
              >
                <ChevronLeft size={14} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 0 10px rgba(255, 77, 45, 0.5)'
                }}
                title="Next teaser"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

      ) : (

        /* ── 4. Grid Matrix View Mode ── */
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {releases.map(item => {
            const isReminded = !!reminders[item.id];
            return (
              <div 
                key={item.id} 
                className="content-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(180deg, rgba(28, 9, 6, 0.75) 0%, rgba(14, 4, 3, 0.92) 100%)',
                  border: '1px solid rgba(255, 77, 45, 0.22)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ height: '190px', position: 'relative' }}>
                  <img 
                    src={item.banner} 
                    alt={item.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/img/hero-bg.jpg';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    zIndex: 2,
                    background: 'rgba(10, 3, 2, 0.88)',
                    border: '1px solid rgba(255, 77, 45, 0.4)',
                    borderRadius: '999px',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <Calendar size={12} color="#ff4d2d" />
                    <span>{item.releaseDate}</span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 2,
                    background: 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)',
                    borderRadius: '999px',
                    padding: '0.2rem 0.55rem',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#ffffff'
                  }}>
                    <span>{item.hypeScore}% Hype</span>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#ff684a', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <span>{item.studio}</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{item.format}</span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.55, margin: '0 0 1rem 0' }}>
                    {item.synopsis}
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 77, 45, 0.15)' }}>
                    {item.videoUrl && onOpenMedia ? (
                      <button
                        onClick={() => onOpenMedia({
                          id: item.id,
                          title: item.title,
                          videoUrl: item.videoUrl,
                          description: item.synopsis,
                          type: 'trailer',
                          category: item.category,
                          creator: item.studio
                        })}
                        className="btn-cyber-outline"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Film size={13} color="#ff4d2d" />
                        <span>Teaser</span>
                      </button>
                    ) : <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Teaser Pending</span>}

                    <button
                      onClick={() => handleToggleReminder(item)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        borderRadius: '9999px',
                        background: isReminded ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.08)',
                        border: isReminded ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      {isReminded ? <Check size={13} /> : <Bell size={13} color="#ff684a" />}
                      <span>{isReminded ? 'Alert Set' : 'Remind Me'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

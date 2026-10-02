import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, Eye, X, Image as ImageIcon, Calendar, Flame, Layers, ShieldCheck, Zap } from 'lucide-react';
import { GALLERY_DATA } from '../js/data/galleryData';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImageModal, setActiveImageModal] = useState(null);
  const [rotatingIndex, setRotatingIndex] = useState(0);

  // Rotating animated marquee / ticker phrases
  const rotatingPhrases = [
    "Ultra-High-Definition Official Key Visuals & Concept Art",
    "Iconic Shonen Battles, RPG Universes & Cyberpunk Skylines",
    "Curated 4K Wallpapers, Character Dossiers & Fanverse Aesthetics",
    "Newest artworks automatically appear right at the top"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setRotatingIndex(prev => (prev + 1) % rotatingPhrases.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [rotatingPhrases.length]);

  // Categories list
  const categories = ['All', 'Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga'];

  // Automatically sort so newest items appear at the very TOP of the gallery
  const sortedGallery = useMemo(() => {
    return [...GALLERY_DATA].sort((a, b) => {
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });
  }, []);

  // Compute count of artworks per category
  const categoryCounts = useMemo(() => {
    const counts = { All: sortedGallery.length };
    sortedGallery.forEach(item => {
      const cat = item.category;
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [sortedGallery]);

  // Filter gallery items by selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return sortedGallery;
    return sortedGallery.filter(
      item => item.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory, sortedGallery]);

  return (
    <div className="fv-gallery-page container-custom" style={{ paddingBottom: '5rem', paddingTop: '1.5rem' }}>
      
      {/* ── 1. Impressive Animated Gallery Hero Banner ── */}
      <section 
        className="fv-gallery-hero-banner"
        style={{
          position: 'relative',
          padding: '2.5rem 1.5rem 2rem 1.5rem',
          borderRadius: '24px',
          background: 'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(255, 77, 45, 0.16) 0%, rgba(18, 4, 0, 0.7) 70%, transparent 100%)',
          border: '1px solid rgba(255, 77, 45, 0.25)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          marginBottom: '3rem',
          overflow: 'hidden'
        }}
      >
        {/* Subtle background ambient glow flares */}
        <div 
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '450px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(255, 77, 45, 0.35) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Eyebrow Glowing Pill Badge */}
          <div 
            className="fv-gallery-hero-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.45rem 1.25rem',
              borderRadius: '9999px',
              background: 'rgba(255, 77, 45, 0.15)',
              border: '1px solid rgba(255, 77, 45, 0.45)',
              color: '#ff856b',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem'
            }}
          >
            <Sparkles size={14} color="#ff4d2d" />
            <span>MULTIVERSE VISUAL VAULT • {sortedGallery.length} 4K ULTRA HD ARTWORKS</span>
          </div>

          {/* Grand Animated Kinetic Heading */}
          <h1 
            className="fv-section__title"
            style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              color: '#ffffff',
              letterSpacing: '-0.025em',
              margin: '0 0 1.2rem 0',
              fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif"
            }}
          >
            <span className="fv-gallery-title-line-1" style={{ marginRight: '0.35em' }}>
              ENTER THE
            </span>
            <span 
              className="fv-gallery-title-line-2 fv-grad"
              style={{
                fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 900,
                letterSpacing: '-0.025em'
              }}
            >
              CINEMATIC GALLERY
            </span>
          </h1>

          {/* Animated Cycling Ticker Box */}
          <div 
            className="fv-gallery-ticker-box"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              background: 'rgba(10, 6, 5, 0.65)',
              border: '1px solid rgba(255, 77, 45, 0.3)',
              borderRadius: '12px',
              padding: '0.6rem 1.4rem',
              marginBottom: '1.5rem',
              maxWidth: '720px',
              width: '100%',
              minHeight: '48px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}
          >
            <Flame size={18} color="#ff4d2d" style={{ flexShrink: 0 }} />
            <div 
              key={rotatingIndex} 
              className="fv-gallery-ticker-text"
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: 'clamp(0.85rem, 1.4vw, 1.02rem)',
                fontWeight: 500,
                letterSpacing: '0.01em',
                lineHeight: 1.4
              }}
            >
              {rotatingPhrases[rotatingIndex]}
            </div>
          </div>

          {/* Quick Metrics Stat Pills */}
          <div 
            className="fv-gallery-stats-row"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginTop: '0.5rem'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255, 255, 255, 0.06)', padding: '0.3rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: '#cbd5e1' }}>
              <ImageIcon size={13} color="#ff4d2d" />
              <span>{sortedGallery.length} Curated Visuals</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255, 255, 255, 0.06)', padding: '0.3rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: '#cbd5e1' }}>
              <Layers size={13} color="#ff4d2d" />
              <span>7 Fandom Realms</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255, 255, 255, 0.06)', padding: '0.3rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: '#cbd5e1' }}>
              <Zap size={13} color="#ff4d2d" />
              <span>4K UHD Quality</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255, 77, 45, 0.12)', padding: '0.3rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: '#ff856b', border: '1px solid rgba(255, 77, 45, 0.3)' }}>
              <ShieldCheck size={13} color="#ff4d2d" />
              <span>Auto-Sorted (Newest First)</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. Category Filter Bar (with Dynamic Visual Counts) ── */}
      <div 
        className="fv-gallery-category-bar"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          marginBottom: '2.5rem'
        }}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: isActive ? '#ff4d2d' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                border: isActive ? '1px solid #ff4d2d' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '9999px',
                padding: '0.5rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                outline: 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isActive ? '0 6px 20px rgba(255, 77, 45, 0.45)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'rgba(255, 77, 45, 0.45)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <span style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>{cat}</span>
              <span 
                style={{
                  fontSize: '0.72rem',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  background: isActive ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.12)',
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 3. Clean Responsive Gallery Grid ── */}
      {filteredItems.length === 0 ? (
        <div 
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <ImageIcon size={44} color="#ff4d2d" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h3 style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Visuals in this Category</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.95rem' }}>
            Check back soon as new artworks are constantly being added to the archive.
          </p>
        </div>
      ) : (
        <div 
          className="fv-gallery-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {filteredItems.map((item, index) => (
            <article 
              key={item.id}
              className="fv-gallery-card fv-card-stagger is-visible"
              onClick={() => setActiveImageModal(item)}
              style={{
                background: 'rgba(18, 12, 10, 0.88)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'rgba(255, 77, 45, 0.5)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 77, 45, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image Container with Hover Scale */}
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  background: '#0a0808'
                }}
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  loading={index < 4 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/img/placeholder.jpg';
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />

                {/* Category Badge (Top Left) */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                  <span 
                    style={{
                      background: 'rgba(10, 6, 5, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#ff856b',
                      border: '1px solid rgba(255, 77, 45, 0.4)',
                      borderRadius: '6px',
                      padding: '3px 9px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                {/* View Overlay on Hover */}
                <div 
                  className="fv-gallery-zoom-overlay"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(6px)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    zIndex: 2
                  }}
                >
                  <Eye size={15} />
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem 1.25rem 1.4rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                
                {/* Date / Status Tag */}
                {item.date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                    <Calendar size={12} />
                    <span>{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}

                {/* Title */}
                <h3 
                  className="fv-gallery-card-title"
                  style={{
                    fontSize: '1.12rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.35,
                    margin: '0 0 0.5rem 0',
                    transition: 'color 0.25s ease'
                  }}
                >
                  {item.title}
                </h3>

                {/* Short Description */}
                <p 
                  style={{
                    color: 'rgba(255, 255, 255, 0.65)',
                    fontSize: '0.85rem',
                    lineHeight: 1.55,
                    margin: 0
                  }}
                >
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── 4. Full-Screen Visual Lightbox Modal ── */}
      {activeImageModal && (
        <div 
          className="modal-overlay"
          onClick={() => setActiveImageModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8, 4, 3, 0.92)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}
        >
          <div 
            className="modal-content-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '960px',
              width: '100%',
              background: '#140804',
              border: '1px solid rgba(255, 77, 45, 0.35)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 77, 45, 0.15)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveImageModal(null)}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ff4d2d';
                e.currentTarget.style.borderColor = '#ff4d2d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <X size={18} />
            </button>

            {/* High-Res Image Display */}
            <div style={{ position: 'relative', width: '100%', maxHeight: '68vh', overflow: 'hidden', background: '#000' }}>
              <img 
                src={activeImageModal.image} 
                alt={activeImageModal.title}
                onError={(e) => {
                  e.currentTarget.src = '/assets/img/placeholder.jpg';
                }}
                style={{
                  width: '100%',
                  maxHeight: '68vh',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </div>

            {/* Modal Detail Body */}
            <div style={{ padding: '1.75rem 2rem', background: '#140804' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span 
                  style={{
                    background: 'rgba(255, 77, 45, 0.15)',
                    color: '#ff856b',
                    border: '1px solid rgba(255, 77, 45, 0.4)',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}
                >
                  {activeImageModal.category}
                </span>

                {activeImageModal.date && (
                  <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>
                    Added on {new Date(activeImageModal.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 700, margin: '0 0 0.6rem 0' }}>
                {activeImageModal.title}
              </h2>

              <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                {activeImageModal.description}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

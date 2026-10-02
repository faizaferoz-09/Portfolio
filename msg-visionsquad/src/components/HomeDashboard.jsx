import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import HeroCinematic from './HeroCinematic';
import IsometricFandomCard from './IsometricFandomCard';
import FandomCardSlider3D from './FandomCardSlider3D';
import { CATEGORIES_DATA } from '../js/data/categoriesData';
import { CHARACTERS_DATA } from '../js/data/charactersData';
import { MEDIA_DATA } from '../js/data/mediaData';
import { ARTICLES_DATA } from '../js/data/articlesData';
import { MERCHANDISE_DATA } from '../js/data/merchandiseData';
import { initCinematicAnimations } from '../js/utils/motion';
import AnimatedCardStack from './AnimatedCardStack';
import { getCardHashtags } from '../js/utils/hashtags';
import { 
  Play, X, Sparkles, Film, Compass, Users, Star, ArrowRight, Check, 
  Bookmark, ShoppingBag, BookOpen, Flame, Eye, Tv, Gamepad2, Radio, 
  Tag, Clock, ShieldCheck, LayoutGrid, Layers, Crown
} from 'lucide-react';

/* ─── Reusable 3D Tilt Card Hook ───────────────────────────── */
function useTilt(strength = 15) {
  const ref  = useRef(null);
  const cur  = useRef({ x: 0, y: 0 });
  const tgt  = useRef({ x: 0, y: 0 });
  const raf  = useRef(null);

  const onMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    tgt.current.x = ((e.clientX - r.left) / r.width  - 0.5) * strength;
    tgt.current.y = ((e.clientY - r.top)  / r.height - 0.5) * -strength;
  }, [strength]);

  const onLeave = useCallback(() => {
    tgt.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      cur.current.x = lerp(cur.current.x, tgt.current.x, 0.1);
      cur.current.y = lerp(cur.current.y, tgt.current.y, 0.1);
      if (ref.current) {
        ref.current.style.transform =
          `perspective(900px) rotateY(${cur.current.x}deg) rotateX(${cur.current.y}deg) scale(1.03)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return { ref, onMove, onLeave };
}

/* ─── Dynamic 3D Fandom Card (Uses IsometricFandomCard) ─────── */
function DynamicFandomCard(props) {
  return <IsometricFandomCard {...props} />;
}

/* ─── Dynamic Universe Card ──────────────────────────────── */
function DynamicUniverseCard({ category, trailer, charCount, articleCount, onExplore, onWatchTrailer, onBookmarkToggle, isBookmarked }) {
  const accent = category.accentColor || '#8b5cf6';

  return (
    <div className="fv-universe-card" onClick={onExplore} style={{ '--u-color': accent }}>
      <div 
        className="fv-universe-card__img" 
        style={{ backgroundImage: `url(${trailer?.thumbnail || category.banner})` }} 
      />
      <div className="fv-universe-card__overlay" style={{ '--u-color': accent }} />

      {/* Bookmark Button */}
      {onBookmarkToggle && (
        <button
          onClick={(e) => { e.stopPropagation(); onBookmarkToggle(category); }}
          className={`content-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 5 }}
          title="Save Verse to Vault"
        >
          <Bookmark size={15} fill={isBookmarked ? '#ffffff' : 'none'} />
        </button>
      )}

      <div className="fv-universe-card__body">
        <span className="fv-universe-card__tag" style={{ color: accent, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={12} /> {category.name.toUpperCase()} VERSE
        </span>
        <h3 className="fv-universe-card__title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
          {category.name} Realm
        </h3>
        <p className="fv-universe-card__sub line-clamp-2" style={{ fontSize: '0.885rem', color: '#ffffff', lineHeight: 1.5, textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)' }}>
          {category.tagline || category.description}
        </p>

        {/* Dynamic Metric Tags */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.15)', color: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>
            {charCount} Characters
          </span>
          <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.15)', color: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>
            {articleCount} Articles
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {trailer && (
            <button 
              className="fv-universe-card__btn" 
              style={{ '--u-color': accent, background: accent, color: '#ffffff' }}
              onClick={(e) => { e.stopPropagation(); onWatchTrailer(); }}
            >
              <i className="fa-solid fa-play" style={{ fontSize: '0.65rem' }}></i> Trailer
            </button>
          )}
          <button 
            className="fv-universe-card__btn" 
            style={{ '--u-color': accent, background: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
            onClick={(e) => { e.stopPropagation(); onExplore(); }}
          >
            Enter Realm <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main HomeDashboard ─────────────────────────────────────── */
export default function HomeDashboard({
  onNavigateTab,
  onSelectCategory,
  onOpenCharacter,
  onOpenTrailer,
  onOpenArticle,
  onBookmarkToggle,
  isItemBookmarked,
  onAddToCart,
  onShowToast
}) {
  const [universeFilter, setUniverseFilter] = useState('all');
  const [verseViewMode, setVerseViewMode] = useState('stack'); // 'stack' (Image 2 style) or 'grid'
  const [activeUniverseTheme, setActiveUniverseTheme] = useState('anime');
  const [localTrailerModal, setLocalTrailerModal] = useState(null);
  const carouselRef = useRef(null);
  const dashboardRef = useRef(null);

  /* Cinematic ScrollTrigger Animations */
  useEffect(() => {
    const cleanup = initCinematicAnimations(dashboardRef.current || document);
    return () => cleanup && cleanup();
  }, [universeFilter]);

  /* Auto-scroll carousel */
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let id = setInterval(() => {
      el.scrollLeft += 1;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) el.scrollLeft = 0;
    }, 25);
    return () => clearInterval(id);
  }, []);

  const handleWatchTrailer = (trailerObj) => {
    if (onOpenTrailer) {
      onOpenTrailer(trailerObj);
    } else {
      setLocalTrailerModal(trailerObj);
    }
  };

  /* ── 1. Dynamic Counts for Categories ── */
  const dynamicCategories = useMemo(() => {
    return CATEGORIES_DATA.map(cat => {
      const charCount = CHARACTERS_DATA.filter(c => c.category.toLowerCase() === cat.id.toLowerCase()).length;
      const articleCount = ARTICLES_DATA.filter(a => a.category.toLowerCase() === cat.id.toLowerCase()).length;
      const mediaCount = MEDIA_DATA.filter(m => m.category.toLowerCase() === cat.id.toLowerCase()).length;
      const merchCount = MERCHANDISE_DATA.filter(m => m.category.toLowerCase() === cat.id.toLowerCase()).length;

      // Top trailer for this category
      const trailer = MEDIA_DATA.find(m => m.category.toLowerCase() === cat.id.toLowerCase() && m.type === 'trailer') ||
                      MEDIA_DATA.find(m => m.category.toLowerCase() === cat.id.toLowerCase());

      return {
        ...cat,
        charCount,
        articleCount,
        mediaCount,
        merchCount,
        topTrailer: trailer
      };
    });
  }, []);

  /* ── 2. Filtered Universes ── */
  const displayedUniverses = useMemo(() => {
    if (universeFilter === 'all') return dynamicCategories;
    return dynamicCategories.filter(u => u.id === universeFilter);
  }, [universeFilter, dynamicCategories]);

  /* ── 3. Character Collection Spotlight (8 Characters) ── */
  const displayedCharacters = useMemo(() => {
    return CHARACTERS_DATA.slice(0, 8);
  }, []);

  /* ── 4. Dynamic Trending Media ── */
  const trendingMedia = useMemo(() => {
    // Collect featured videos or high-view items
    return MEDIA_DATA.slice(0, 10);
  }, []);

  /* ── 5. Dynamic Lore Articles (Top 3) ── */
  const topArticles = useMemo(() => {
    return ARTICLES_DATA.slice(0, 3);
  }, []);

  /* ── 6. Dynamic Hot Merch Picks (Top 4) ── */
  const hotMerch = useMemo(() => {
    return MERCHANDISE_DATA.slice(0, 4);
  }, []);

  /* ── 7. Universe Themes for "Which Universe Belongs To You" ── */
  const currentActiveCategory = dynamicCategories.find(c => c.id === activeUniverseTheme) || dynamicCategories[0];
  
  // Real quotes from characters in that category
  const categoryQuotes = {
    anime: '"Don\'t worry, I\'m the strongest." — Gojo Satoru',
    gaming: '"I am Malenia, Blade of Miquella. And I have never known defeat."',
    movies: '"Everyone keeps telling me how my story is supposed to go. I\'mma do my own thing." — Miles Morales',
    'tv-shows': '"I\'m crazy, but not that crazy." — Jinx',
    'k-pop': '"Shining through the city with a little funk and soul." — BTS',
    comics: '"I am the vengeance. I am the night. I am Batman!"',
    manga: '"You have to keep moving forward, even if you are covered in blood." — Guts'
  };

  return (
    <>
      {/* 3D Cinematic Parallax Hero Canvas */}
      <HeroCinematic onNavigateTab={onNavigateTab} />

      <div ref={dashboardRef} className="fv-home">

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — EXPLORE FANDOMS (7 Dynamic 3D Isometric Cards — Image 2 Theme)
      ══════════════════════════════════════════════════════ */}
      <section className="fv-section fv-section--fandoms">
        {/* Background Cinematic Laser Ribbon / Light Streak (Matches Image 2) */}
        <div className="fv-laser-ribbon-wrap" aria-hidden="true">
          <svg className="fv-laser-ribbon-svg" viewBox="0 0 1600 360" preserveAspectRatio="none">
            <defs>
              <linearGradient id="laserGradAmbient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff4d2d" stopOpacity="0" />
                <stop offset="15%" stopColor="#ff4d2d" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#ff7a45" stopOpacity="0.85" />
                <stop offset="85%" stopColor="#ff3311" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ff4d2d" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="laserGradCore" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="25%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="75%" stopColor="#ffedd5" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <filter id="laserBeamGlow" x="-20%" y="-100%" width="140%" height="300%">
                <feGaussianBlur stdDeviation="16" result="blurWide" />
                <feGaussianBlur stdDeviation="6" result="blurTight" />
                <feMerge>
                  <feMergeNode in="blurWide" />
                  <feMergeNode in="blurTight" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Soft Ambient Glow Ribbon */}
            <path
              className="fv-laser-path-ambient"
              d="M -50 250 C 320 310, 540 140, 800 220 C 1060 300, 1280 100, 1650 170"
              fill="none"
              stroke="url(#laserGradAmbient)"
              strokeWidth="28"
              filter="url(#laserBeamGlow)"
            />
            {/* Core Piercing Laser Ray */}
            <path
              className="fv-laser-path-core"
              d="M -50 250 C 320 310, 540 140, 800 220 C 1060 300, 1280 100, 1650 170"
              fill="none"
              stroke="url(#laserGradCore)"
              strokeWidth="2.5"
              filter="url(#laserBeamGlow)"
            />
          </svg>
        </div>

        <div className="container-custom">
          <div className="fv-section__header">
            <span className="fv-section__tag">
              <i className="fa-solid fa-compass"></i> EXPLORE 7 FANDOM HUBS
            </span>
            <h2 className="fv-section__title">Pick Your <span className="fv-grad">Multiverse</span></h2>
            <p className="fv-section__desc" style={{ maxWidth: '740px', margin: '0.6rem auto 0 auto' }}>Dynamic 3D interactive hubs computed live across Anime, Gaming, Movies, TV, K-Pop, Comics, and Manga.</p>
          </div>

          <FandomCardSlider3D
            categories={dynamicCategories}
            onSelectCategory={onSelectCategory}
            onNavigateTab={onNavigateTab}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — FEATURED VERSES (Dynamic Cards & Switcher)
      ══════════════════════════════════════════════════════ */}
      <section className="fv-section fv-section--universes">
        <div className="container-custom">
          <div className="fv-section__header">
            <span className="fv-section__tag">
              <i className="fa-solid fa-star"></i> FEATURED WORLDS & CINEMATICS
            </span>
            <h2 className="fv-section__title">Featured <span className="fv-grad">Verses</span></h2>
            <p className="fv-section__desc" style={{ maxWidth: '740px', margin: '0.6rem auto 0 auto' }}>Explore lore archives, play verified official trailers in HD, and immerse in massive pop-culture franchises.</p>

            {/* Dynamic Category Switcher Pills & View Mode Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.75rem' }}>
              <div className="fv-pill-filter-bar" style={{ margin: 0 }}>
                <button
                  onClick={() => setUniverseFilter('all')}
                  className={`filter-btn ${universeFilter === 'all' ? 'active' : ''}`}
                >
                  All 7 Verses
                </button>
                {dynamicCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setUniverseFilter(cat.id)}
                    className={`filter-btn ${universeFilter === cat.id ? 'active' : ''}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* View Switcher: Stacked Cards Deck (Image 2) vs Grid View */}
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(22, 8, 5, 0.75)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 77, 45, 0.25)',
                  borderRadius: '9999px',
                  padding: '3px 4px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setVerseViewMode('stack')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.36rem 0.85rem',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: verseViewMode === 'stack' ? 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)' : 'transparent',
                    color: verseViewMode === 'stack' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                    boxShadow: verseViewMode === 'stack' ? '0 2px 10px rgba(255, 77, 45, 0.45)' : 'none',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  title="Animated Card Stack Deck (Image 2 Style)"
                >
                  <Layers size={13} />
                  <span>Card Stack</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVerseViewMode('grid')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.36rem 0.85rem',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: verseViewMode === 'grid' ? 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)' : 'transparent',
                    color: verseViewMode === 'grid' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                    boxShadow: verseViewMode === 'grid' ? '0 2px 10px rgba(255, 77, 45, 0.45)' : 'none',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  title="Traditional Multi-Card Grid"
                >
                  <LayoutGrid size={13} />
                  <span>Grid View</span>
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Rendering: Animated Card Stack (Default - Image 2) vs Grid */}
          {verseViewMode === 'stack' ? (
            <AnimatedCardStack
              categories={displayedUniverses}
              selectedCategoryFilter={universeFilter}
              onSelectCategory={(catId) => {
                onSelectCategory(catId);
                onNavigateTab('categories');
              }}
              onNavigateTab={onNavigateTab}
              onWatchTrailer={(trailer) => trailer && handleWatchTrailer(trailer)}
              onBookmarkToggle={onBookmarkToggle}
              isItemBookmarked={isItemBookmarked}
            />
          ) : (
            <div className="fv-universes-grid" style={{ gridTemplateColumns: displayedUniverses.length === 1 ? '1fr' : undefined }}>
              {displayedUniverses.map((cat) => (
                <DynamicUniverseCard 
                  key={cat.id} 
                  category={cat}
                  trailer={cat.topTrailer}
                  charCount={cat.charCount}
                  articleCount={cat.articleCount}
                  onExplore={() => { onSelectCategory(cat.id); onNavigateTab('categories'); }}
                  onWatchTrailer={() => cat.topTrailer && handleWatchTrailer(cat.topTrailer)}
                  onBookmarkToggle={onBookmarkToggle}
                  isBookmarked={isItemBookmarked?.(cat.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — CHARACTER HUB (Character Collection)
      ══════════════════════════════════════════════════════ */}
      <section className="fv-section fv-section--chars">
        <div className="container-custom">
          <div className="fv-char-hub-backdrop">
            {/* Section Header */}
            <div className="fv-section__header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="fv-section__tag">
                <Users size={14} /> CHARACTER COLLECTION
              </span>
              <h2 className="fv-section__title">
                CHARACTER <span className="fv-grad">HUB</span>
              </h2>
              <p className="fv-section__desc" style={{ maxWidth: '740px', margin: '0.6rem auto 0 auto' }}>
                Discover elite heroes, sorcerers, and warriors across all verses. Click any profile card to inspect their complete combat dossier!
              </p>
            </div>

            {/* 8 3D Character Shelf Podium Cards (Responsive 4-Column Showcase matching Image 2) */}
            <div className="fv-char-hub-grid">
              {displayedCharacters.map((c, i) => {
                return (
                  <div
                    key={c.id || i}
                    className="fv-char-card"
                    style={{ '--char-index': i }}
                    onClick={() => onOpenCharacter?.(c)}
                    title={`View ${c.name} (${c.series}) Dossier • PWR ${c.stats?.power || 95}`}
                  >
                    {/* Top Realm Pill Badge */}
                    <div className="fv-char-card__realm-badge">
                      <span className="fv-char-card__realm-dot" />
                      <span>{c.category?.toUpperCase() || 'VERSE'}</span>
                    </div>

                    {/* 3D Character Stage & Concentric Pedestal */}
                    <div className="fv-char-card__stage">
                      <div className="fv-char-card__stage-glow" />

                      {/* Concentric 3D Perspective Holographic Pedestal (Matches Image 2) */}
                      <div className="fv-char-card__pedestal" aria-hidden="true">
                        <div className="fv-char-card__pedestal-inner" />
                        <div className="fv-char-card__pedestal-core" />
                      </div>

                      {/* Floating Interactive Character Figure / Token */}
                      <div 
                        className="fv-char-card__avatar-wrap"
                        style={{ animationDelay: `${(i % 4) * 0.35}s` }}
                      >
                        <img 
                          src={c.image} 
                          alt={c.name} 
                          className="fv-char-card__avatar"
                          loading="lazy" 
                        />
                        <div className="fv-char-card__avatar-glow" />
                      </div>
                    </div>

                    {/* Character Dossier Info */}
                    <div className="fv-char-card__info">
                      <h3 className="fv-char-card__name">{c.name}</h3>
                      <span className="fv-char-card__series">{c.series}</span>

                      {/* Bottom Meta Row: Role & Crown Stat Badge (Matches Image 2) */}
                      <div className="fv-char-card__meta-row">
                        <span className="fv-char-card__role">
                          {c.role?.split('&')[0]?.split('/')[0]?.trim() || 'Elite Hero'}
                        </span>
                        
                        <div className="fv-char-card__crown-pill">
                          <Crown size={12} className="fv-char-card__crown-icon" />
                          <span>{c.stats?.power || 95}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explore Full Character Hub Action */}
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <button
                onClick={() => onNavigateTab('characters')}
                className="fv-char-hub-view-all-btn"
                title="Open full Character Hub"
              >
                <span>Explore Full Character Roster</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — TRENDING NOW (Dynamic Live Carousel)
      ══════════════════════════════════════════════════════ */}
      <section className="fv-section fv-section--trending">
        <div className="container-custom">
          <div className="fv-section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', textAlign: 'left', marginBottom: '1.5rem' }}>
            <div>
              <span className="fv-section__tag">
                <i className="fa-solid fa-fire" style={{ color: '#ff4d2d' }}></i> STREAMING ARCHIVES
              </span>
              <h2 className="fv-section__title" style={{ margin: 0 }}>Trending <span className="fv-grad">Trailers & OSTs</span></h2>
            </div>
            <button 
              onClick={() => onNavigateTab('media')} 
              className="fv-btn fv-btn--ghost"
              style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}
            >
              Explore Media Hub ({MEDIA_DATA.length}) <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* Full-width scrolling carousel mapped from MEDIA_DATA */}
        <div className="fv-carousel" ref={carouselRef}>
          {[...trendingMedia, ...trendingMedia].map((item, i) => {
            const isBookmarked = isItemBookmarked?.(item.id);

            return (
              <div 
                key={`${item.id}-${i}`} 
                className="fv-carousel__card" 
                onClick={() => handleWatchTrailer(item)}
                title={`Watch ${item.title}`}
              >
                <img src={item.thumbnail} alt={item.title} className="fv-carousel__img" />
                <div className="fv-carousel__overlay" />

                {/* Bookmark action */}
                {onBookmarkToggle && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onBookmarkToggle(item); }}
                    className={`content-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                    style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 5 }}
                    title="Bookmark Trailer"
                  >
                    <Bookmark size={14} fill={isBookmarked ? '#ffffff' : 'none'} />
                  </button>
                )}
                
                {/* Play Button Icon */}
                <div style={{
                  position: 'absolute',
                  top: '38%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 18px rgba(255, 77, 45, 0.5)',
                  color: '#fff',
                  transition: 'transform 0.3s ease',
                  zIndex: 2
                }}>
                  <Play size={18} fill="#ffffff" style={{ marginLeft: 2 }} />
                </div>

                <div className="fv-carousel__body">
                  <span className="fv-carousel__cat" style={{ textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800 }}>
                    {item.category} • {item.type}
                  </span>
                  <h4 className="fv-carousel__title line-clamp-1">{item.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                    <div className="fv-carousel__rating">
                      <Star size={12} fill="#ffb800" color="#ffb800" />
                      <span>{item.rating || 5.0}</span>
                    </div>
                    {item.views && (
                      <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                        {item.views}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5 — CHOOSE YOUR VERSE (Dynamic 7 Realms)
      ══════════════════════════════════════════════════════ */}
      <section
        className="fv-section fv-section--choose"
        style={{ 
          background: `radial-gradient(ellipse at 50% 50%, color-mix(in srgb, ${currentActiveCategory.accentColor} 18%, transparent) 0%, transparent 70%)` 
        }}
      >
        <div className="container-custom">
          <div className="fv-section__header">
            <h2 className="fv-choose__title">
              <i className="fa-solid fa-atom" style={{ marginRight: '0.5rem', color: '#ff4d2d' }}></i>
              Which Verse<br />Belongs to <span className="fv-grad">You?</span>
            </h2>
            <p className="fv-section__desc" style={{ maxWidth: '740px', margin: '0.6rem auto 0 auto' }}>Select your realm to activate its ambient theme, lore quote, and official trailer.</p>
          </div>

          <div className="fv-choose-grid">
            {dynamicCategories.map(cat => {
              const isSelected = activeUniverseTheme === cat.id;

              return (
                <button
                  key={cat.id}
                  className={`fv-choose-btn ${isSelected ? 'fv-choose-btn--active' : ''}`}
                  style={{ '--u-color': cat.accentColor }}
                  onClick={() => setActiveUniverseTheme(cat.id)}
                >
                  <i className={cat.id === 'anime' ? 'fa-solid fa-dragon' : cat.id === 'gaming' ? 'fa-solid fa-gamepad' : cat.id === 'movies' ? 'fa-solid fa-film' : cat.id === 'tv-shows' ? 'fa-solid fa-tv' : cat.id === 'k-pop' ? 'fa-solid fa-microphone-lines' : cat.id === 'comics' ? 'fa-solid fa-book-open' : 'fa-solid fa-book-bookmark'}></i>
                  <span>{cat.name} Realm</span>
                  {isSelected && (
                    <i className="fa-solid fa-check fv-choose-btn__check"></i>
                  )}
                </button>
              );
            })}
          </div>

          {currentActiveCategory && (
            <div className="fv-choose-result animate-fade-in" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <div
                className="fv-choose-result__badge"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.6rem', 
                  padding: '0.65rem 1.6rem', 
                  borderRadius: '999px', 
                  background: 'rgba(32, 16, 20, 0.85)', 
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1.5px solid rgba(255, 77, 45, 0.6)',
                  color: '#ffffff',
                  boxShadow: '0 8px 30px rgba(255, 77, 45, 0.35)'
                }}
              >
                <Sparkles size={16} style={{ color: '#ff4d2d' }} />
                <span>You belong to the <strong style={{ color: '#ff684a' }}>{currentActiveCategory.name} Realm</strong>!</span>
              </div>

              <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.05rem', maxWidth: '620px', margin: '1.25rem auto' }}>
                {categoryQuotes[currentActiveCategory.id] || `"${currentActiveCategory.tagline}"`}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <button
                  className="fv-btn fv-btn--primary"
                  onClick={() => { onSelectCategory(currentActiveCategory.id); onNavigateTab('categories'); }}
                >
                  Enter Your Verse <i className="fa-solid fa-arrow-right"></i>
                </button>
                {currentActiveCategory.topTrailer && (
                  <button
                    className="fv-btn fv-btn--ghost"
                    onClick={() => handleWatchTrailer(currentActiveCategory.topTrailer)}
                  >
                    <Play size={15} style={{ marginRight: 4 }} /> Watch Realm Trailer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 6 — FEATURED LORE & ARTICLES (Dynamic)
      ══════════════════════════════════════════════════════ */}
      <section className="fv-section" style={{ background: 'transparent', borderTop: '1px solid rgba(255, 77, 45, 0.15)', borderBottom: '1px solid rgba(255, 77, 45, 0.15)' }}>
        <div className="container-custom">
          <div className="fv-section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
            <div>
              <span className="fv-section__tag" style={{ border: '1px solid rgba(255, 77, 45, 0.4)', color: '#ff684a', background: 'rgba(255, 77, 45, 0.12)' }}>
                <BookOpen size={13} style={{ marginRight: 4 }} /> DEEP LORE & ESSAYS
              </span>
              <h2 className="fv-section__title" style={{ margin: 0 }}>Featured <span className="fv-grad">Discussions</span></h2>
            </div>
            <button 
              onClick={() => onNavigateTab('articles')} 
              className="fv-btn fv-btn--ghost"
              style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}
            >
              All Articles ({ARTICLES_DATA.length}) <ArrowRight size={14} style={{ marginLeft: 4 }} />
            </button>
          </div>

          <div className="content-grid-3">
            {topArticles.map(article => {
              const isBookmarked = isItemBookmarked?.(article.id);

              return (
                <div 
                  key={article.id} 
                  className="content-card" 
                  onClick={() => onOpenArticle?.(article)}
                  style={{ 
                    background: 'linear-gradient(180deg, rgba(26, 9, 6, 0.8) 0%, rgba(14, 4, 3, 0.92) 100%)', 
                    backdropFilter: 'blur(20px)', 
                    WebkitBackdropFilter: 'blur(20px)', 
                    borderRadius: '18px', 
                    overflow: 'hidden', 
                    border: '1px solid rgba(255, 77, 45, 0.22)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxShadow: '0 16px 40px -10px rgba(0, 0, 0, 0.75)',
                    cursor: 'pointer'
                  }}
                >
                  <div className="content-card-image-wrap" style={{ height: '200px', position: 'relative', background: 'rgba(18, 5, 4, 0.8)' }}>
                    <img src={article.image} alt={article.title} className="content-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(18, 5, 4, 0.85)', backdropFilter: 'blur(8px)', color: '#ff684a', border: '1px solid rgba(255, 77, 45, 0.35)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      {article.category}
                    </span>
                    {onBookmarkToggle && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onBookmarkToggle(article); }}
                        className={`content-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                        style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(18, 5, 4, 0.8)', border: '1px solid rgba(255, 77, 45, 0.3)', color: '#ffffff' }}
                        title="Bookmark Article"
                      >
                        <Bookmark size={14} fill={isBookmarked ? '#ffffff' : 'none'} />
                      </button>
                    )}
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '0.5rem' }}>
                      <Clock size={12} /> {article.readTime} • <Eye size={12} /> {article.views} views
                    </div>
                    <h3 
                      style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0', lineHeight: 1.4 }} 
                      className="line-clamp-2"
                    >
                      {article.title}
                    </h3>
                    <p style={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.65)', margin: '0 0 0.65rem 0', lineHeight: 1.5, flex: 1 }} className="line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Hashtags Tailored to Title & Heading */}
                    <div className="fv-card-hashtags-wrap">
                      {getCardHashtags(article).map((tag, idx) => (
                        <span key={idx} className="fv-card-hashtag-chip">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>By {article.author}</span>
                      <button 
                        onClick={() => onOpenArticle?.(article)}
                        style={{ background: 'none', border: 'none', color: '#ff4d2d', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        Read <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 7 — COLLECTOR'S MERCHANDISE DROPS (Dynamic)
      ══════════════════════════════════════════════════════ */}
      <section className="fv-section" style={{ paddingBottom: '5rem', background: 'transparent' }}>
        <div className="container-custom">
          <div className="fv-section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
            <div>
              <span className="fv-section__tag" style={{ border: '1px solid rgba(255, 77, 45, 0.4)', color: '#ff684a', background: 'rgba(255, 77, 45, 0.12)' }}>
                <ShoppingBag size={13} style={{ marginRight: 4 }} /> OFFICIAL STORE PICKS
              </span>
              <h2 className="fv-section__title" style={{ margin: 0 }}>Collectible <span className="fv-grad">Drops</span></h2>
            </div>
            <button 
              onClick={() => onNavigateTab('store')} 
              className="fv-btn fv-btn--ghost"
              style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}
            >
              Browse All Merch ({MERCHANDISE_DATA.length}) <ArrowRight size={14} style={{ marginLeft: 4 }} />
            </button>
          </div>

          <div className="content-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {hotMerch.map(item => (
              <div key={item.id} className="content-card" style={{ background: 'linear-gradient(180deg, rgba(26, 9, 6, 0.8) 0%, rgba(14, 4, 3, 0.92) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255, 77, 45, 0.22)', display: 'flex', flexDirection: 'column', boxShadow: '0 16px 40px -10px rgba(0, 0, 0, 0.75)' }}>
                <div style={{ height: '190px', position: 'relative', overflow: 'hidden', background: 'rgba(18, 5, 4, 0.8)' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {item.badge && (
                    <span style={{ position: 'absolute', top: 10, left: 10, background: 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)', color: '#fff', padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800 }}>
                      {item.badge}
                    </span>
                  )}
                </div>

                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.72rem', color: '#ff684a', fontWeight: 800, textTransform: 'uppercase' }}>
                    {item.category} • {item.type}
                  </span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0 0.5rem 0' }} className="line-clamp-1">
                    {item.name}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ff4d2d', fontFamily: 'var(--font-cyber)' }}>
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onAddToCart?.({ ...item, selectedVariant: item.sizes?.[0] || 'Standard' });
                        onShowToast?.(`Added "${item.name}" to cart!`);
                      }}
                      className="fv-btn fv-btn--primary"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem' }}
                    >
                      <ShoppingBag size={13} style={{ marginRight: 4 }} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div>

      {/* Local Video Modal Fallback */}
      {localTrailerModal && (
        <div className="modal-overlay" onClick={() => setLocalTrailerModal(null)}>
          <div className="modal-content-box" style={{ maxWidth: '850px', padding: '1.5rem', background: 'linear-gradient(180deg, rgba(24, 8, 6, 0.96) 0%, rgba(12, 3, 2, 0.98) 100%)', backdropFilter: 'blur(24px)', color: '#ffffff', borderRadius: '20px', border: '1px solid rgba(255, 77, 45, 0.3)', boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 77, 45, 0.15)' }} onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={() => setLocalTrailerModal(null)}
              style={{ background: 'rgba(255, 77, 45, 0.15)', border: '1px solid rgba(255, 77, 45, 0.3)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#ff684a', background: 'rgba(255, 77, 45, 0.15)', padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(255, 77, 45, 0.3)' }}>
                {localTrailerModal.category?.toUpperCase()} • {localTrailerModal.type?.toUpperCase()}
              </span>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-cyber)', color: '#ffffff', margin: '0.5rem 0 0 0', fontWeight: 800 }}>
                {localTrailerModal.title}
              </h3>
            </div>

            {/* 16:9 YouTube Iframe */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid rgba(255, 77, 45, 0.2)' }}>
              <iframe
                src={`${localTrailerModal.videoUrl}?autoplay=1`}
                title={localTrailerModal.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              {localTrailerModal.description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

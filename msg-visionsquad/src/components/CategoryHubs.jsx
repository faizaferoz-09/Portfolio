import React, { useState } from 'react';
import { 
  Sparkles, Gamepad2, Film, Tv, Mic2, BookOpen, 
  Layers, Filter, ArrowUpDown, Bookmark, Star, Eye, Clock, 
  ExternalLink, ShoppingBag, Calendar, User, Search, X
} from 'lucide-react';
import { CATEGORIES_DATA } from '../js/data/categoriesData';
import ThemeSelect from './ThemeSelect';
import { getCardHashtags } from '../js/utils/hashtags';
import UpcomingReleases from './UpcomingReleases';

export default function CategoryHubs({
  selectedCategory,
  onSelectCategory,
  allContent = [],
  onBookmarkToggle,
  isItemBookmarked,
  onOpenArticle,
  onOpenCharacter,
  onOpenMedia,
  onAddToCart,
  onShowToast,
  isSearch = false
}) {
  const [contentTypeFilter, setContentTypeFilter] = useState('all'); // all, article, character, media, event, merch
  const [activeSubTag, setActiveSubTag] = useState('all');
  const [sortBy, setSortBy] = useState('popular'); // popular, newest, alpha-asc, alpha-desc
  const [searchQuery, setSearchQuery] = useState('');

  // Map category icon
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles size={20} />;
      case 'Gamepad2': return <Gamepad2 size={20} />;
      case 'Film': return <Film size={20} />;
      case 'Tv': return <Tv size={20} />;
      case 'Mic2': return <Mic2 size={20} />;
      case 'BookOpen': return <BookOpen size={20} />;
      case 'Layers': return <Layers size={20} />;
      default: return <Sparkles size={20} />;
    }
  };

  const activeCategoryObj = CATEGORIES_DATA.find(c => c.id === selectedCategory);

  // Filter content by selected Category, Content Type, SubTag, and Search Query
  let filtered = allContent.filter(item => {
    // Exclude articles from category hub pages (Articles now have their own dedicated page)
    if (!isSearch && item.itemType === 'article') {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const title = (item.title || item.name || '').toLowerCase();
      const desc = (item.excerpt || item.description || item.biography || '').toLowerCase();
      const series = (item.series || item.category || '').toLowerCase();
      const tags = (item.tags || item.traits || []).join(' ').toLowerCase();
      if (!title.includes(q) && !desc.includes(q) && !series.includes(q) && !tags.includes(q)) {
        return false;
      }
    }
    // Category match (only if not in direct search mode)
    if (!isSearch && selectedCategory && selectedCategory !== 'all') {
      if (item.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
    }
    // Type match
    if (contentTypeFilter !== 'all') {
      if (item.itemType !== contentTypeFilter) {
        return false;
      }
    }
    // Subtag match
    if (!isSearch && activeSubTag !== 'all') {
      const tags = (item.tags || item.traits || []).map(t => t.toLowerCase());
      if (!tags.some(t => t.includes(activeSubTag.toLowerCase()))) {
        return false;
      }
    }
    return true;
  });

  // Sort content
  filtered.sort((a, b) => {
    const titleA = a.title || a.name || '';
    const titleB = b.title || b.name || '';
    if (sortBy === 'alpha-asc') return titleA.localeCompare(titleB);
    if (sortBy === 'alpha-desc') return titleB.localeCompare(titleA);
    if (sortBy === 'newest') {
      const dateA = new Date(a.date || a.bookmarkedAt || 0);
      const dateB = new Date(b.date || b.bookmarkedAt || 0);
      return dateB - dateA;
    }
    // Default: popularity / rating
    const rateA = Number(a.rating || 4.5);
    const rateB = Number(b.rating || 4.5);
    return rateB - rateA;
  });

  return (
    <div className={isSearch ? "" : "container-custom"} style={{ paddingBottom: '4rem' }}>
      {/* Category Tabs Selector Grid - Hidden in search mode to directly display filter and cards */}
      {!isSearch && (
        <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="fv-section__tag" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
            Multi-Fandom Hubs
          </span>
          <h2 className="fv-section__title">
            EXPLORE 7 <span className="fv-grad">FANDOM VERSES</span>
          </h2>
          <p className="fv-section__desc" style={{ maxWidth: '740px', margin: '0.6rem auto 0 auto' }}>
            Choose a verse below to immerse yourself in curated character dossiers, video trailers, live events, and officially licensed merchandise.
          </p>
        </div>

        <div className="category-tabs-bar">
          <button
            onClick={() => { onSelectCategory('all'); setActiveSubTag('all'); }}
            className={`category-tab-item ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            <Sparkles size={16} />
            <span>All Multiverses</span>
          </button>
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onSelectCategory(cat.id); setActiveSubTag('all'); }}
              className={`category-tab-item ${selectedCategory === cat.id ? 'active' : ''}`}
              style={{
                borderColor: selectedCategory === cat.id ? cat.accentColor : undefined,
                boxShadow: selectedCategory === cat.id ? `0 0 15px ${cat.accentColor}55` : undefined
              }}
            >
              {getCategoryIcon(cat.icon)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Category Banner Card when a specific category is selected */}
        {activeCategoryObj && (
          <div 
            key={activeCategoryObj.id}
            className="fv-cat-banner" 
            style={{ 
              '--cat-accent': activeCategoryObj.accentColor
            }}
          >
            {/* Ambient dynamic glow aura */}
            <div 
              className="fv-cat-banner__glow" 
              style={{ background: `radial-gradient(circle at 75% 50%, ${activeCategoryObj.accentColor}35, transparent 65%)` }} 
            />

            {/* 1. Cinematic Background Artwork with Slow Zoom & Pan Animation */}
            <div className="fv-cat-banner__img-container">
              <img 
                src={activeCategoryObj.banner} 
                alt={activeCategoryObj.name} 
                className="fv-cat-banner__img"
              />
              {/* Smart Directional Light Vignette: Deep on the left for text contrast, 100% transparent & bright on the right! */}
              <div className="fv-cat-banner__vignette" />
            </div>

            {/* 2. Top Laser Border Rim Light */}
            <div 
              className="fv-cat-banner__laser-rim" 
              style={{ background: `linear-gradient(90deg, transparent, ${activeCategoryObj.accentColor}, #ffffff, ${activeCategoryObj.accentColor}, transparent)` }} 
            />

            {/* 3. Foreground Content */}
            <div className="fv-cat-banner__content">
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ maxWidth: '650px' }}>
                  <span 
                    className="badge-neon" 
                    style={{ 
                      borderColor: activeCategoryObj.accentColor, 
                      color: '#ffffff', 
                      background: `${activeCategoryObj.accentColor}33`,
                      boxShadow: `0 0 12px ${activeCategoryObj.accentColor}44`,
                      fontWeight: 700
                    }}
                  >
                    {activeCategoryObj.name} Hub Verse
                  </span>
                  <h3 
                    style={{ 
                      fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)', 
                      fontFamily: "'Inter Tight', -apple-system, sans-serif", 
                      fontWeight: 900,
                      marginTop: '0.6rem',
                      lineHeight: 1.18,
                      color: '#ffffff',
                      textShadow: '0 2px 14px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    {activeCategoryObj.tagline}
                  </h3>
                  <p 
                    style={{ 
                      color: '#ffffff', 
                      fontSize: '1.05rem', 
                      lineHeight: 1.65, 
                      marginTop: '0.6rem', 
                      maxWidth: '600px',
                      textShadow: '0 2px 12px rgba(0, 0, 0, 0.95), 0 1px 3px rgba(0, 0, 0, 0.95)' 
                    }}
                  >
                    {activeCategoryObj.description}
                  </p>
                  {/* Popular Franchises */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginTop: '1.1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ff684a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Franchises:</span>
                    {activeCategoryObj.popularFranchises.map((f, i) => (
                      <span key={i} className="tag-chip" style={{ background: 'rgba(10, 4, 3, 0.75)', borderColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', backdropFilter: 'blur(8px)' }}>{f}</span>
                    ))}
                  </div>
                </div>

                {/* Sub-tag quick filters */}
                <div style={{ background: 'rgba(10, 4, 3, 0.82)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '1.25rem 1.4rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff', display: 'block', marginBottom: '0.6rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Filter by Fandom Sub-Genre:
                  </span>
                  <div className="tag-chips-wrap">
                    <button 
                      onClick={() => setActiveSubTag('all')} 
                      className={`tag-chip ${activeSubTag === 'all' ? 'border-cyan text-cyan' : ''}`}
                      style={{ cursor: 'pointer', background: activeSubTag === 'all' ? `${activeCategoryObj.accentColor}33` : 'rgba(255,255,255,0.06)', color: '#ffffff', fontWeight: 600, borderColor: activeSubTag === 'all' ? activeCategoryObj.accentColor : 'rgba(255,255,255,0.15)' }}
                    >
                      All Sub-Tags
                    </button>
                    {activeCategoryObj.subTags.map((tag, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveSubTag(tag)}
                        className={`tag-chip ${activeSubTag === tag ? 'border-cyan text-cyan' : ''}`}
                        style={{ cursor: 'pointer', background: activeSubTag === tag ? `${activeCategoryObj.accentColor}33` : 'rgba(255,255,255,0.06)', color: '#ffffff', fontWeight: 600, borderColor: activeSubTag === tag ? activeCategoryObj.accentColor : 'rgba(255,255,255,0.15)' }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Dynamic Upcoming Releases for Selected Category */}
      {!isSearch && (
        <UpcomingReleases
          selectedCategory={selectedCategory}
          onOpenMedia={onOpenMedia}
          onBookmarkToggle={onBookmarkToggle}
          isItemBookmarked={isItemBookmarked}
          onShowToast={onShowToast}
        />
      )}

      {/* Multi-level Filter, Search & Sort Bar in ONE SINGLE LINE */}
      <div className="filter-sort-bar">
        {/* 1. Content Type Filter (Left) */}
        <div className="fv-toolbar-filter-side">
          <div className="fv-toolbar-filter-label">
            <Filter size={15} color="#ff4d2d" />
            <span>Type:</span>
          </div>
          <div className="filter-btn-group">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'character', label: 'Characters' },
              { id: 'media', label: 'Videos & Audio' },
              { id: 'event', label: 'Events' },
              { id: 'merch', label: 'Merchandise' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setContentTypeFilter(type.id)}
                className={`filter-btn ${contentTypeFilter === type.id ? 'active' : ''}`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Category Live Search Bar (Center) */}
        <div className="fv-toolbar-search-wrap">
          <Search size={15} className="fv-toolbar-search-icon" />
          <input 
            type="text"
            placeholder={`Search ${activeCategoryObj ? activeCategoryObj.name : 'all'} items...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="fv-toolbar-search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="fv-toolbar-search-clear"
              title="Clear search"
              type="button"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* 3. Sort Dropdown (Right) */}
        <div className="fv-toolbar-sort-side">
          <span className="fv-toolbar-sort-label">
            <ArrowUpDown size={14} color="#ff4d2d" />
            Sort By:
          </span>
          <ThemeSelect 
            value={sortBy} 
            onChange={(val) => setSortBy(val)}
            options={[
              { value: 'popular', label: 'Popularity & Rating' },
              { value: 'newest', label: 'Newest First' },
              { value: 'alpha-asc', label: 'Alphabetical (A - Z)' },
              { value: 'alpha-desc', label: 'Alphabetical (Z - A)' }
            ]}
            minWidth="175px"
          />
        </div>
      </div>

      {/* Dynamic Content Cards Catalog */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Sparkles size={40} color="var(--neon-cyan)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Content Found in this Dimension</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try changing your selected category, content type filter, or search keywords.</p>
        </div>
      ) : (
        <div className="content-grid-3">
          {filtered.map((item) => {
            const isBookmarked = isItemBookmarked(item.id);

            return (
              <div key={item.id} className="content-card">
                {/* Thumbnail Image & Badges */}
                <div className="content-card-image-wrap">
                  <img
                    src={item.image || item.thumbnail || item.banner || '/assets/img/placeholder.jpg'}
                    alt={item.title || item.name}
                    className="content-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/img/hero-bg.jpg';
                    }}
                  />
                  <div className="content-card-badge">
                    <span className="badge-neon" style={{ background: 'rgba(7, 8, 20, 0.85)' }}>
                      {(item.category || 'General').toUpperCase()}
                    </span>
                  </div>

                  {/* Bookmark Toggle Button */}
                  <button
                    onClick={() => onBookmarkToggle(item)}
                    className={`content-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                    title={isBookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}
                  >
                    <Bookmark size={16} fill={isBookmarked ? '#ffffff' : 'none'} />
                  </button>
                </div>

                {/* Card Body */}
                <div className="content-card-body">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ textTransform: 'uppercase', fontWeight: 700, color: 'var(--neon-cyan)' }}>
                      {item.itemType || 'Content'}
                    </span>
                    {item.rating && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#ffd700' }}>
                        <Star size={12} fill="#ffd700" /> {item.rating}
                      </span>
                    )}
                  </div>

                  <h4 className="content-card-title line-clamp-1">
                    {item.title || item.name}
                  </h4>

                  <p className="content-card-desc line-clamp-2">
                    {item.excerpt || item.biography || item.description}
                  </p>

                  {/* Hashtags based on Title / Heading */}
                  <div className="fv-card-hashtags-wrap" style={{ marginBottom: '1.25rem' }}>
                    {getCardHashtags(item).map((t, idx) => (
                      <span key={idx} className="fv-card-hashtag-chip">{t}</span>
                    ))}
                  </div>

                  {/* Action Buttons based on content type */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {item.itemType === 'article' && (
                      <button 
                        onClick={() => onOpenArticle(item)}
                        className="btn-cyber-outline"
                        style={{ width: '100%' }}
                      >
                        <BookOpen size={14} /> Read Article
                      </button>
                    )}

                    {item.itemType === 'character' && (
                      <button 
                        onClick={() => onOpenCharacter(item)}
                        className="btn-cyber-outline"
                        style={{ width: '100%', borderColor: 'var(--neon-cyan)', color: 'var(--neon-cyan)' }}
                      >
                        <User size={14} /> Character Dossier & Stats
                      </button>
                    )}

                    {item.itemType === 'media' && (
                      <button 
                        onClick={() => onOpenMedia(item)}
                        className="btn-cyber-primary"
                        style={{ width: '100%', padding: '0.5rem' }}
                      >
                        <Film size={14} /> Play Media
                      </button>
                    )}

                    {item.itemType === 'event' && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--neon-amber)', fontWeight: 700 }}>
                          <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
                          {item.date}
                        </span>
                        <span className="badge-neon" style={{ fontSize: '0.7rem' }}>
                          {item.status}
                        </span>
                      </div>
                    )}

                    {item.itemType === 'merch' && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neon-pink)', fontFamily: 'var(--font-cyber)' }}>
                          ${item.price}
                        </span>
                        <button
                          onClick={() => onAddToCart(item)}
                          className="btn-cyber-primary"
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem' }}
                        >
                          <ShoppingBag size={14} /> Add to Cart
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

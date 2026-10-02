import React, { useState, useMemo } from 'react';
import { 
  Clock, Eye, Star, User, Bookmark, Share2, 
  ArrowRight, X, Sparkles, BookOpen, MessageSquare, Check,
  Search, Filter, ArrowUpDown, Flame, Newspaper, ChevronRight
} from 'lucide-react';
import { ARTICLES_DATA } from '../js/data/articlesData';
import { CATEGORIES_DATA } from '../js/data/categoriesData';
import { getCardHashtags } from '../js/utils/hashtags';
import ThemeSelect from './ThemeSelect';

export default function ArticlesSection({
  selectedCategory = 'all',
  onSelectCategory,
  onBookmarkToggle,
  isItemBookmarked,
  activeArticleModal,
  setActiveArticleModal,
  onOpenArticle
}) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'all');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTag, setSelectedTag] = useState('all');

  const handleOpenArticle = (art) => {
    if (onOpenArticle) {
      onOpenArticle(art);
    } else if (setActiveArticleModal) {
      setActiveArticleModal(art);
    }
  };

  // Sync category if parent changes it
  React.useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setSelectedTag('all');
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  // Filter and Sort articles
  const filteredArticles = useMemo(() => {
    let list = ARTICLES_DATA.filter(art => {
      if (activeCategory && activeCategory !== 'all') {
        if (art.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
      }
      if (selectedTag !== 'all') {
        const hasTag = (art.tags || []).some(t => t.toLowerCase() === selectedTag.toLowerCase());
        if (!hasTag) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const title = (art.title || '').toLowerCase();
        const excerpt = (art.excerpt || '').toLowerCase();
        const author = (art.author || '').toLowerCase();
        const category = (art.category || '').toLowerCase();
        const tags = (art.tags || []).join(' ').toLowerCase();
        if (!title.includes(q) && !excerpt.includes(q) && !author.includes(q) && !category.includes(q) && !tags.includes(q)) {
          return false;
        }
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'alpha-asc') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'alpha-desc') return (b.title || '').localeCompare(a.title || '');
      if (sortBy === 'popular') {
        const viewsA = typeof a.views === 'string' ? parseFloat(a.views) : 50;
        const viewsB = typeof b.views === 'string' ? parseFloat(b.views) : 50;
        return viewsB - viewsA;
      }
      // default: newest
      return new Date(b.date || 0) - new Date(a.date || 0);
    });

    return list;
  }, [activeCategory, selectedTag, searchQuery, sortBy]);

  // Featured Spotlight Article
  const spotlightArticle = useMemo(() => {
    if (filteredArticles.length > 0 && !searchQuery && selectedTag === 'all') {
      return filteredArticles[0];
    }
    return null;
  }, [filteredArticles, searchQuery, selectedTag]);

  const gridArticles = useMemo(() => {
    if (spotlightArticle && filteredArticles.length > 1) {
      return filteredArticles.slice(1);
    }
    return filteredArticles;
  }, [filteredArticles, spotlightArticle]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="container-custom" style={{ paddingBottom: '4rem' }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="fv-section__tag" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
          <Newspaper size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
          Editorial & Fandom Lore
        </span>
        <h2 className="fv-section__title">
          CHRONICLES & <span className="fv-grad">ARTICLES HUB</span>
        </h2>
        <p className="fv-section__desc" style={{ maxWidth: '740px', margin: '0.6rem auto 0 auto' }}>
          Explore dedicated long-form essays, industry scoops, animation production breakdowns, and deep cultural analysis across all fandom multiverses.
        </p>
      </div>

      {/* 7 Fandom Realm Tabs Bar */}
      <div className="category-tabs-bar" style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => handleCategoryChange('all')}
          className={`category-tab-item ${activeCategory === 'all' ? 'active' : ''}`}
        >
          <Sparkles size={16} />
          <span>All Realms ({ARTICLES_DATA.length})</span>
        </button>
        {CATEGORIES_DATA.map((cat) => {
          const count = ARTICLES_DATA.filter(a => a.category.toLowerCase() === cat.id.toLowerCase()).length;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`category-tab-item ${activeCategory === cat.id ? 'active' : ''}`}
              style={{
                borderColor: activeCategory === cat.id ? cat.accentColor : undefined,
                boxShadow: activeCategory === cat.id ? `0 0 15px ${cat.accentColor}55` : undefined
              }}
            >
              <i className={
                cat.id === 'anime' ? 'fa-solid fa-dragon' :
                cat.id === 'gaming' ? 'fa-solid fa-gamepad' :
                cat.id === 'movies' ? 'fa-solid fa-film' :
                cat.id === 'tv-shows' ? 'fa-solid fa-tv' :
                cat.id === 'k-pop' ? 'fa-solid fa-microphone-lines' :
                cat.id === 'comics' ? 'fa-solid fa-book-open' :
                'fa-solid fa-book-bookmark'
              }></i>
              <span>{cat.name} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Spotlight / Hero Article Banner */}
      {spotlightArticle && (
        <div 
          className="fv-article-spotlight"
          onClick={() => handleOpenArticle(spotlightArticle)}
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: '2.5rem',
            border: '1px solid rgba(255, 77, 45, 0.28)',
            background: 'linear-gradient(135deg, rgba(26, 8, 4, 0.95), rgba(12, 4, 2, 0.98))',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 77, 45, 0.12)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            {/* Image side */}
            <div 
              style={{ height: '100%', minHeight: '300px', maxHeight: '380px', position: 'relative', overflow: 'hidden' }}
            >
              <img 
                src={spotlightArticle.image} 
                alt={spotlightArticle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                className="fv-spotlight-img"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(12, 4, 2, 0.9))' }} />
              <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                <span className="badge-neon" style={{ background: 'rgba(7, 8, 20, 0.9)', borderColor: '#ff4d2d', color: '#ff856b' }}>
                  <Flame size={12} style={{ display: 'inline', marginRight: 4 }} /> FEATURED SPOTLIGHT
                </span>
              </div>
            </div>

            {/* Content side */}
            <div style={{ padding: '2rem 2.5rem 2rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span className="badge-neon" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  {spotlightArticle.category}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={13} /> {spotlightArticle.readTime}
                </span>
                <span>•</span>
                <span>{spotlightArticle.date}</span>
              </div>

              <h3 
                style={{ 
                  fontSize: 'clamp(1.4rem, 2.2vw, 1.85rem)', 
                  fontWeight: 800, 
                  color: '#ffffff', 
                  lineHeight: 1.25, 
                  marginBottom: '1rem'
                }}
              >
                {spotlightArticle.title}
              </h3>

              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.25rem' }} className="line-clamp-3">
                {spotlightArticle.excerpt}
              </p>

              {/* Spotlight Banner Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <img 
                    src={spotlightArticle.authorAvatar} 
                    alt={spotlightArticle.author} 
                    style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid #ff4d2d' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700 }}>{spotlightArticle.author}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{spotlightArticle.authorRole}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onBookmarkToggle && onBookmarkToggle(spotlightArticle); }}
                    className={`btn-cyber-outline ${isItemBookmarked && isItemBookmarked(spotlightArticle.id) ? 'active' : ''}`}
                    style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
                    title="Bookmark Article"
                  >
                    <Bookmark size={14} fill={isItemBookmarked && isItemBookmarked(spotlightArticle.id) ? '#ff4d2d' : 'none'} />
                  </button>
                  <button 
                    onClick={() => handleOpenArticle(spotlightArticle)}
                    className="fv-btn-pastel fv-btn-pastel--primary"
                    style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
                  >
                    <span>Read Full Chronicle</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Filter, Search & Sort Bar in ONE SINGLE LINE */}
      <div className="filter-sort-bar">
        {/* 1. Topic Filter Pills (Left) */}
        <div className="fv-toolbar-filter-side">
          <div className="filter-btn-group" style={{ margin: 0 }}>
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'Demon Slayer', label: 'Demon Slayer' },
              { id: 'Solo Leveling', label: 'Solo Leveling' },
              { id: 'Genshin Impact', label: 'Genshin' },
              { id: 'Cyberpunk', label: 'Cyberpunk' },
              { id: 'Spider-Verse', label: 'Spider-Verse' },
              { id: 'BTS', label: 'BTS' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTag(tab.id)}
                className={`filter-btn ${selectedTag === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Article Live Search Bar (Center) */}
        <div className="fv-toolbar-search-wrap">
          <Search size={15} className="fv-toolbar-search-icon" />
          <input 
            type="text"
            placeholder="Search articles, lore essays, authors..."
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
              { value: 'newest', label: 'Newest First' },
              { value: 'popular', label: 'Most Read & Popular' },
              { value: 'alpha-asc', label: 'Alphabetical (A - Z)' },
              { value: 'alpha-desc', label: 'Alphabetical (Z - A)' }
            ]}
            minWidth="175px"
          />
        </div>
      </div>

      {/* Articles Grid or Empty State */}
      {filteredArticles.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Sparkles size={40} color="#ff4d2d" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#ffffff' }}>No Articles Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your topic filter or search query.</p>
        </div>
      ) : (
      <div className="content-grid-3">
        {gridArticles.map((art) => {
          const isBookmarked = isItemBookmarked && isItemBookmarked(art.id);

          return (
            <div 
              key={art.id} 
              className="content-card"
              onClick={() => handleOpenArticle(art)}
              style={{ cursor: 'pointer' }}
            >
              {/* Image & Badges */}
              <div className="content-card-image-wrap">
                <img 
                  src={art.image} 
                  alt={art.title} 
                  className="content-card-img" 
                />
                <div className="content-card-badge">
                  <span className="badge-neon" style={{ background: 'rgba(7, 8, 20, 0.85)' }}>
                    {art.category.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onBookmarkToggle && onBookmarkToggle(art); }}
                  className={`content-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                  title="Bookmark Article"
                >
                  <Bookmark size={15} fill={isBookmarked ? '#ffffff' : 'none'} />
                </button>
              </div>

              {/* Card Body */}
              <div className="content-card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} /> {art.readTime}
                  </span>
                  <span>{art.date}</span>
                </div>

                <h3 className="content-card-title line-clamp-2">
                  {art.title}
                </h3>

                <p className="content-card-desc line-clamp-3">
                  {art.excerpt}
                </p>

                {/* Hashtags Tailored to Title & Heading */}
                <div className="fv-card-hashtags-wrap">
                  {getCardHashtags(art).map((tag, idx) => (
                    <span key={idx} className="fv-card-hashtag-chip">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author Info & Read CTA */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img 
                      src={art.authorAvatar} 
                      alt={art.author} 
                      style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 600 }}>
                      {art.author}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleOpenArticle(art)}
                    className="btn-cyber-outline"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    Read <ArrowRight size={12} />
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

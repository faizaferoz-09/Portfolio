import React, { useState, useMemo } from 'react';
import { 
  User, Shield, Zap, Flame, Award, Sparkles, 
  Bookmark, Star, Quote, Search, Filter, X, ArrowUpDown 
} from 'lucide-react';
import { CHARACTERS_DATA } from '../js/data/charactersData';
import ThemeSelect from './ThemeSelect';

export default function CharacterProfiles({
  selectedCategory,
  onBookmarkToggle,
  isItemBookmarked,
  activeCharModal,
  setActiveCharModal
}) {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedFranchise, setSelectedFranchise] = useState('all');
  const [sortBy, setSortBy] = useState('power');

  // Filter characters
  const categoryFiltered = useMemo(() => {
    return CHARACTERS_DATA.filter(char => {
      if (selectedCategory && selectedCategory !== 'all') {
        return char.category.toLowerCase() === selectedCategory.toLowerCase();
      }
      return true;
    });
  }, [selectedCategory]);

  // Extract unique franchises for category
  const franchises = useMemo(() => {
    return ['all', ...new Set(categoryFiltered.map(c => c.series))];
  }, [categoryFiltered]);

  // Count characters per franchise
  const franchiseCounts = useMemo(() => {
    const counts = { all: categoryFiltered.length };
    categoryFiltered.forEach(c => {
      counts[c.series] = (counts[c.series] || 0) + 1;
    });
    return counts;
  }, [categoryFiltered]);

  const displayCharacters = useMemo(() => {
    let list = categoryFiltered.filter(char => {
      if (selectedFranchise !== 'all' && char.series !== selectedFranchise) {
        return false;
      }
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        const matchName = char.name.toLowerCase().includes(q);
        const matchSeries = char.series.toLowerCase().includes(q);
        const matchTraits = (char.traits || []).some(t => t.toLowerCase().includes(q));
        const matchRole = (char.role || '').toLowerCase().includes(q);
        return matchName || matchSeries || matchTraits || matchRole;
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'agility') return (b.stats?.agility || 0) - (a.stats?.agility || 0);
      if (sortBy === 'intelligence') return (b.stats?.intelligence || 0) - (a.stats?.intelligence || 0);
      return (b.stats?.power || 0) - (a.stats?.power || 0);
    });

    return list;
  }, [categoryFiltered, selectedFranchise, searchFilter, sortBy]);

  return (
    <section className="container-custom" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="fv-section__tag" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
          Hall of Legends
        </span>
        <h2 className="fv-section__title">
          CHARACTER PROFILES & <span className="fv-grad">COMBAT STATS</span>
        </h2>
        <p className="fv-section__desc" style={{ maxWidth: '740px', margin: '0.6rem auto 0 auto' }}>
          Explore detailed dossiers, signature abilities, power levels, combat stats, and memorable quotes from iconic heroes, anti-heroes, and pop icons.
        </p>
      </div>

      {/* Franchise, Search & Sorting Toolbar in ONE SINGLE LINE */}
      <div className="filter-sort-bar">
        {/* 1. Franchise Filter (Left) */}
        <div className="fv-toolbar-filter-side">
          <span className="fv-toolbar-filter-label">
            <Filter size={15} color="#ff4d2d" />
            Franchise:
          </span>
          <ThemeSelect
            value={selectedFranchise}
            onChange={(val) => setSelectedFranchise(val)}
            options={franchises.map(f => ({
              value: f,
              label: f === 'all' ? 'All Franchises' : f,
              badge: franchiseCounts[f] ? `${franchiseCounts[f]}` : undefined
            }))}
            minWidth="175px"
          />
        </div>

        {/* 2. Universal Character Search Bar (Center) */}
        <div className="fv-toolbar-search-wrap">
          <Search size={15} className="fv-toolbar-search-icon" />
          <input 
            type="text"
            placeholder="Search hero, series, traits..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="fv-toolbar-search-input"
          />
          {searchFilter && (
            <button 
              onClick={() => setSearchFilter('')}
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
              { value: 'power', label: 'Combat Power (Highest)' },
              { value: 'name-asc', label: 'Name (A - Z)' },
              { value: 'name-desc', label: 'Name (Z - A)' },
              { value: 'agility', label: 'Agility & Speed' },
              { value: 'intelligence', label: 'Tactical Intelligence' }
            ]}
            minWidth="175px"
          />
        </div>
      </div>

      {/* Characters Grid */}
      <div className="content-grid-3">
        {displayCharacters.map((char) => {
          const isBookmarked = isItemBookmarked(char.id);

          return (
            <div key={char.id} className="content-card">
              {/* Header Image & Bookmark */}
              <div className="content-card-image-wrap" onClick={() => setActiveCharModal(char)} style={{ cursor: 'pointer', height: '220px' }}>
                <img 
                  src={char.image} 
                  alt={char.name} 
                  className="content-card-img" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/img/hero-bg.jpg';
                  }}
                />
                <div className="content-card-badge">
                  <span className="badge-neon" style={{ background: 'rgba(7, 8, 20, 0.85)' }}>
                    {char.category.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onBookmarkToggle(char); }}
                  className={`content-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                  title="Bookmark Character"
                >
                  <Bookmark size={15} fill={isBookmarked ? '#ffffff' : 'none'} />
                </button>
              </div>

              {/* Character Details Body */}
              <div className="content-card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', fontWeight: 700 }}>
                    {char.series}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {char.affiliation}
                  </span>
                </div>

                <h3 
                  className="content-card-title" 
                  onClick={() => setActiveCharModal(char)}
                  style={{ cursor: 'pointer', marginBottom: '0.2rem' }}
                >
                  {char.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontStyle: 'italic', display: 'block', marginBottom: '0.75rem' }}>
                  {char.role}
                </span>

                <p className="content-card-desc line-clamp-2">
                  {char.biography}
                </p>

                {/* Traits Chips */}
                <div className="tag-chips-wrap" style={{ marginBottom: '1rem' }}>
                  {char.traits.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="tag-chip">{t}</span>
                  ))}
                </div>

                {/* Interactive Combat Stats Bars */}
                <div className="char-stats-container">
                  <div className="stat-bar-row">
                    <div className="stat-label-wrap">
                      <span>Power Level</span>
                      <span style={{ color: 'var(--neon-pink)' }}>{char.stats.power}/100</span>
                    </div>
                    <div className="stat-progress-track">
                      <div className="stat-progress-fill" style={{ width: `${char.stats.power}%`, background: 'linear-gradient(90deg, #ff007f, #ff7700)' }} />
                    </div>
                  </div>

                  <div className="stat-bar-row">
                    <div className="stat-label-wrap">
                      <span>Agility / Speed</span>
                      <span style={{ color: 'var(--neon-cyan)' }}>{char.stats.agility}/100</span>
                    </div>
                    <div className="stat-progress-track">
                      <div className="stat-progress-fill" style={{ width: `${char.stats.agility}%`, background: 'linear-gradient(90deg, #00f3ff, #00bcff)' }} />
                    </div>
                  </div>

                  <div className="stat-bar-row">
                    <div className="stat-label-wrap">
                      <span>Intelligence</span>
                      <span style={{ color: 'var(--neon-purple)' }}>{char.stats.intelligence}/100</span>
                    </div>
                    <div className="stat-progress-track">
                      <div className="stat-progress-fill" style={{ width: `${char.stats.intelligence}%`, background: 'linear-gradient(90deg, #bc13fe, #9333ea)' }} />
                    </div>
                  </div>
                </div>

                {/* Quote Box */}
                {char.quote && (
                  <div className="quote-box">
                    "{char.quote}"
                  </div>
                )}

                {/* Modal View Button */}
                <button
                  onClick={() => setActiveCharModal(char)}
                  className="btn-cyber-outline"
                  style={{ width: '100%', marginTop: '1rem', padding: '0.45rem' }}
                >
                  <Sparkles size={14} /> View Full Character Dossier
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

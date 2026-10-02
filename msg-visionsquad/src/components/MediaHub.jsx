import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, 
  Film, Mic, Radio, Music, Eye, Bookmark, Sparkles, 
  ExternalLink, X, Search, Filter, ArrowUpDown 
} from 'lucide-react';
import { MEDIA_DATA } from '../js/data/mediaData';
import ThemeSelect from './ThemeSelect';

export default function MediaHub({
  onBookmarkToggle,
  isItemBookmarked,
  selectedCategory,
  activeTrailerModal,
  setActiveTrailerModal
}) {
  const [filterType, setFilterType] = useState('all'); // all, trailer, interview, podcast, audio
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(270);
  const audioRef = useRef(null);

  // Filter media
  let filteredMedia = MEDIA_DATA.filter(item => {
    if (selectedCategory && selectedCategory !== 'all') {
      if (item.category.toLowerCase() !== selectedCategory.toLowerCase() && item.category !== 'podcast') {
        return false;
      }
    }
    if (filterType !== 'all') {
      if (filterType === 'audio') {
        if (item.type !== 'audio' && item.type !== 'ost') return false;
      } else if (item.type !== filterType) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const title = (item.title || '').toLowerCase();
      const creator = (item.creator || '').toLowerCase();
      const category = (item.category || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      if (!title.includes(q) && !creator.includes(q) && !category.includes(q) && !desc.includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Sort media
  filteredMedia.sort((a, b) => {
    if (sortBy === 'alpha-asc') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'alpha-desc') return (b.title || '').localeCompare(a.title || '');
    if (sortBy === 'newest') return (b.year || 2026) - (a.year || 2026);
    // popular default
    const countA = typeof a.views === 'string' ? parseFloat(a.views) : 50;
    const countB = typeof b.views === 'string' ? parseFloat(b.views) : 50;
    return countB - countA;
  });

  const handlePlayAudio = (item) => {
    if (currentAudio?.id === item.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAudio(item);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  const formatAudioTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section className="container-custom" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="fv-section__tag" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
          Audio-Visual Matrix
        </span>
        <h2 className="fv-section__title">
          MULTIVERSE <span className="fv-grad">MEDIA HUB</span>
        </h2>
        <p className="fv-section__desc" style={{ maxWidth: '740px', margin: '0.6rem auto 0 auto' }}>
          Stream full-definition anime & gaming trailers, director interviews, weekly fandom podcasts, and high-fidelity cyberpunk soundtrack scores.
        </p>
      </div>

      {/* Cyber Audio Player Bar if Audio is Selected */}
      {currentAudio && (
        <div className="audio-player-bar animate-pulse-neon">
          <div className="audio-track-info">
            <img 
              src={currentAudio.thumbnail || '/assets/img/placeholder.jpg'} 
              alt={currentAudio.title}
              className="audio-thumb"
            />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
                {currentAudio.title}
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)' }}>
                {currentAudio.creator} • {currentAudio.category.toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ flex: 1, maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
            <div className="audio-controls">
              <button 
                onClick={() => setCurrentTime(Math.max(0, currentTime - 10))} 
                className="btn-cyber-outline" 
                style={{ padding: '0.3rem', width: 32, height: 32, borderRadius: '50%' }}
              >
                <SkipBack size={14} />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)} 
                className="play-circle-btn"
              >
                {isPlaying ? <Pause size={20} fill="#070814" /> : <Play size={20} fill="#070814" />}
              </button>
              <button 
                onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))} 
                className="btn-cyber-outline" 
                style={{ padding: '0.3rem', width: 32, height: 32, borderRadius: '50%' }}
              >
                <SkipForward size={14} />
              </button>
            </div>

            {/* Time progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatAudioTime(currentTime)}</span>
              <input 
                type="range" 
                min={0} 
                max={duration} 
                value={currentTime} 
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--neon-cyan)', height: '4px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatAudioTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input 
              type="range" 
              min={0} 
              max={1} 
              step={0.05} 
              value={isMuted ? 0 : volume} 
              onChange={(e) => { setVolume(Number(e.target.value)); setIsMuted(false); }}
              style={{ width: '70px', accentColor: 'var(--neon-purple)', height: '4px', cursor: 'pointer' }}
            />
          </div>
        </div>
      )}

      {/* Media Hub Filter, Search & Sort Bar in ONE SINGLE LINE */}
      <div className="filter-sort-bar">
        {/* 1. Format Filter Pills (Left) */}
        <div className="fv-toolbar-filter-side">
          <div className="filter-btn-group" style={{ margin: 0 }}>
            {[
              { id: 'all', label: 'All', icon: <Sparkles size={13} /> },
              { id: 'trailer', label: 'Trailers', icon: <Film size={13} /> },
              { id: 'interview', label: 'Interviews', icon: <Mic size={13} /> },
              { id: 'podcast', label: 'Podcasts', icon: <Radio size={13} /> },
              { id: 'audio', label: 'OST & Audio', icon: <Music size={13} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`filter-btn ${filterType === tab.id ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Media Live Search Bar (Center) */}
        <div className="fv-toolbar-search-wrap">
          <Search size={15} className="fv-toolbar-search-icon" />
          <input 
            type="text"
            placeholder="Search trailers, OSTs, podcasts..."
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
              { value: 'popular', label: 'Popularity & Views' },
              { value: 'newest', label: 'Newest Releases' },
              { value: 'alpha-asc', label: 'Alphabetical (A - Z)' },
              { value: 'alpha-desc', label: 'Alphabetical (Z - A)' }
            ]}
            minWidth="175px"
          />
        </div>
      </div>

      {/* Media Grid or Empty State */}
      {filteredMedia.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Sparkles size={40} color="#ff4d2d" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#ffffff' }}>No Streams Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your format filter or search keywords.</p>
        </div>
      ) : (
      <div className="content-grid-3">
        {filteredMedia.map((media) => {
          const isBookmarked = isItemBookmarked(media.id);
          const isCurrentlyPlayingThis = currentAudio?.id === media.id && isPlaying;

          return (
            <div key={media.id} className="content-card">
              {/* Media Thumbnail with Overlay Play Button */}
              <div className="content-card-image-wrap" style={{ cursor: 'pointer' }} onClick={() => {
                if (media.type === 'trailer' || media.type === 'interview') {
                  setActiveTrailerModal(media);
                } else {
                  handlePlayAudio(media);
                }
              }}>
                <img 
                  src={media.thumbnail} 
                  alt={media.title} 
                  className="content-card-img" 
                />
                
                {/* Play Badge Icon */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(7, 8, 20, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-fast)'
                }}>
                  <div className="play-circle-btn">
                    {isCurrentlyPlayingThis ? (
                      <Pause size={20} fill="#070814" />
                    ) : (
                      <Play size={20} fill="#070814" />
                    )}
                  </div>
                </div>

                <div className="content-card-badge">
                  <span className="badge-neon" style={{ background: 'rgba(7, 8, 20, 0.85)' }}>
                    {media.type.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onBookmarkToggle(media); }}
                  className={`content-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                  title="Bookmark Media"
                >
                  <Bookmark size={15} fill={isBookmarked ? '#ffffff' : 'none'} />
                </button>
              </div>

              {/* Media Body */}
              <div className="content-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--neon-cyan)', fontWeight: 700 }}>{media.category.toUpperCase()}</span>
                  <span>{media.duration} • {media.views} views</span>
                </div>

                <h4 className="content-card-title line-clamp-1" title={media.title}>
                  {media.title}
                </h4>

                <p className="content-card-desc line-clamp-2">
                  {media.description}
                </p>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {media.creator}
                  </span>
                  
                  {media.type === 'trailer' || media.type === 'interview' ? (
                    <button 
                      onClick={() => setActiveTrailerModal(media)}
                      className="btn-cyber-outline"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      <Film size={12} /> Watch Video
                    </button>
                  ) : (
                    <button 
                      onClick={() => handlePlayAudio(media)}
                      className="btn-cyber-outline"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderColor: 'var(--neon-cyan)', color: 'var(--neon-cyan)' }}
                    >
                      <Music size={12} /> {isCurrentlyPlayingThis ? 'Pause Track' : 'Play Track'}
                    </button>
                  )}
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

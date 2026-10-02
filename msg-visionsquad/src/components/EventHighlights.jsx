import React, { useState, useMemo } from 'react';
import { 
  Calendar, MapPin, Users, Ticket, Bell, 
  Check, Sparkles, Filter, ExternalLink, Bookmark,
  Search, X, ArrowUpDown 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EVENTS_DATA } from '../js/data/eventsData';
import ThemeSelect from './ThemeSelect';

export default function EventHighlights({
  selectedCategory,
  onBookmarkToggle,
  isItemBookmarked,
  onShowToast
}) {
  const [statusFilter, setStatusFilter] = useState('all'); // all, upcoming, past
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-asc');
  const [rsvpList, setRsvpList] = useState({});

  // Filter & Sort events
  const filteredEvents = useMemo(() => {
    let list = EVENTS_DATA.filter(evt => {
      if (selectedCategory && selectedCategory !== 'all') {
        if (evt.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }
      if (statusFilter !== 'all') {
        if (evt.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const title = (evt.title || '').toLowerCase();
        const loc = (evt.location || '').toLowerCase();
        const desc = (evt.description || '').toLowerCase();
        const cat = (evt.category || '').toLowerCase();
        if (!title.includes(q) && !loc.includes(q) && !desc.includes(q) && !cat.includes(q)) {
          return false;
        }
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'alpha-asc') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'alpha-desc') return (b.title || '').localeCompare(a.title || '');
      if (sortBy === 'date-desc') return new Date(b.date || 0) - new Date(a.date || 0);
      // default: date-asc (soonest upcoming)
      return new Date(a.date || 0) - new Date(b.date || 0);
    });

    return list;
  }, [selectedCategory, statusFilter, searchQuery, sortBy]);

  const handleRsvp = (event) => {
    const isRsvpd = rsvpList[event.id];
    setRsvpList(prev => ({ ...prev, [event.id]: !isRsvpd }));

    if (!isRsvpd) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
      onShowToast?.(`🎉 RSVP Confirmed for ${event.title}! Reminder set.`);
    } else {
      onShowToast?.(`Reminder removed for ${event.title}`);
    }
  };

  return (
    <section className="container-custom" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="fv-section__tag">MULTIVERSE CALENDAR</span>
        <h2 className="fv-section__title">
          2026 GLOBAL <span className="fv-grad">EVENTS & EXPOS</span>
        </h2>
        <p className="fv-section__desc" style={{ maxWidth: '740px', margin: '0.6rem auto 0 auto' }}>
          Discover upcoming anime expos, gaming championship showdowns, K-Pop stadium world tours, Comic-Con panels, and private fan watch parties.
        </p>
      </div>

      {/* Event Filter, Search & Sort Toolbar in ONE SINGLE LINE */}
      <div className="filter-sort-bar">
        {/* 1. Timeline Filter Pills (Left) */}
        <div className="fv-toolbar-filter-side">
          <div className="filter-btn-group" style={{ margin: 0 }}>
            {[
              { id: 'all', label: 'All Events' },
              { id: 'upcoming', label: 'Upcoming Expos' },
              { id: 'past', label: 'Past Gatherings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`filter-btn ${statusFilter === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Event Live Search Bar (Center) */}
        <div className="fv-toolbar-search-wrap">
          <Search size={15} className="fv-toolbar-search-icon" />
          <input 
            type="text"
            placeholder="Search events, cities, expos..."
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
              { value: 'date-asc', label: 'Soonest Date First' },
              { value: 'date-desc', label: 'Latest Date First' },
              { value: 'alpha-asc', label: 'Alphabetical (A - Z)' },
              { value: 'alpha-desc', label: 'Alphabetical (Z - A)' }
            ]}
            minWidth="175px"
          />
        </div>
      </div>

      {/* Events Grid or Empty State */}
      {filteredEvents.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Sparkles size={40} color="#ff4d2d" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#ffffff' }}>No Events Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try changing your timeline filter or search keywords.</p>
        </div>
      ) : (
      <div className="content-grid-3">
        {filteredEvents.map((evt) => {
          const isBookmarked = isItemBookmarked(evt.id);
          const isRsvpd = !!rsvpList[evt.id];

          return (
            <div key={evt.id} className="content-card">
              {/* Event Image */}
              <div className="content-card-image-wrap">
                <img 
                  src={evt.image} 
                  alt={evt.title} 
                  className="content-card-img" 
                />
                <div className="content-card-badge">
                  <span className="badge-neon" style={{ background: 'rgba(7, 8, 20, 0.85)' }}>
                    {evt.category.toUpperCase()} • {evt.type}
                  </span>
                </div>

                <div style={{ position: 'absolute', bottom: '0.6rem', left: '0.6rem', zIndex: 2 }}>
                  <span className={evt.status === 'upcoming' ? 'badge-neon' : 'tag-chip'} style={{ background: evt.status === 'upcoming' ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255,255,255,0.1)', color: evt.status === 'upcoming' ? 'var(--neon-emerald)' : '#94a3b8', borderColor: evt.status === 'upcoming' ? 'var(--neon-emerald)' : 'rgba(255,255,255,0.2)' }}>
                    ● {evt.status.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={() => onBookmarkToggle(evt)}
                  className={`content-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                  title="Bookmark Event"
                >
                  <Bookmark size={15} fill={isBookmarked ? '#ffffff' : 'none'} />
                </button>
              </div>

              {/* Event Body */}
              <div className="content-card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--neon-amber)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  <Calendar size={14} />
                  <span>{evt.date} {evt.time && `• ${evt.time}`}</span>
                </div>

                <h3 className="content-card-title line-clamp-2" title={evt.title}>
                  {evt.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  <MapPin size={14} color="var(--neon-cyan)" />
                  <span className="line-clamp-1">{evt.location}</span>
                </div>

                <p className="content-card-desc line-clamp-2">
                  {evt.description}
                </p>

                {/* Highlights */}
                {evt.highlights && (
                  <div style={{ background: 'rgba(8, 10, 24, 0.6)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.725rem', color: 'var(--neon-cyan)', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Key Highlights:</span>
                    <ul style={{ paddingLeft: '1.1rem', fontSize: '0.75rem', color: '#cbd5e1', margin: 0 }}>
                      {evt.highlights.slice(0, 2).map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Attendee / Pricing Footer */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Expected</span>
                    <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>{evt.attendees}</span>
                  </div>

                  {evt.status === 'upcoming' ? (
                    <button 
                      onClick={() => handleRsvp(evt)}
                      className={isRsvpd ? 'btn-cyber-primary' : 'btn-cyber-outline'}
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }}
                    >
                      {isRsvpd ? (
                        <>
                          <Check size={14} /> RSVP'd
                        </>
                      ) : (
                        <>
                          <Bell size={14} /> Remind Me
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="tag-chip">Archive Recap</span>
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

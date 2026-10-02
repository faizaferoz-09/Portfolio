import React, { useState, useEffect } from 'react';
import { 
  Bookmark, Trash2, Download, Edit3, Save, 
  FileText, Sparkles, Filter, ExternalLink, StickyNote, Check, Share2,
  Search, X, ArrowUpDown 
} from 'lucide-react';
import { 
  getBookmarks, removeBookmark, 
  getSessionNote, saveSessionNote, 
  exportBookmarksToFile 
} from '../js/utils/storage';
import ThemeSelect from './ThemeSelect';

export default function Bookmarks({
  bookmarks = [],
  onRemoveBookmark,
  onOpenArticle,
  onOpenCharacter,
  onOpenMedia,
  onShowToast
}) {
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [notesState, setNotesState] = useState({});
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [currentEditText, setCurrentEditText] = useState('');
  const [exportFormat, setExportFormat] = useState('markdown');

  // Load session notes on mount
  useEffect(() => {
    const loadedNotes = {};
    bookmarks.forEach(item => {
      const note = getSessionNote(item.id);
      if (note) loadedNotes[item.id] = note;
    });
    setNotesState(loadedNotes);
  }, [bookmarks]);

  const handleStartEditNote = (item) => {
    setEditingNoteId(item.id);
    setCurrentEditText(notesState[item.id] || '');
  };

  const handleSaveNote = (itemId) => {
    const saved = saveSessionNote(itemId, currentEditText);
    setNotesState(prev => ({
      ...prev,
      [itemId]: saved
    }));
    setEditingNoteId(null);
    onShowToast?.('📝 Personal note saved for this session (SessionStorage)!');
  };

  const handleExport = (format) => {
    const res = exportBookmarksToFile(format);
    if (res.success) {
      onShowToast?.(`✓ Exported ${res.count} bookmarks to ${res.filename}`);
    } else {
      onShowToast?.(res.message);
    }
  };

  const filteredBookmarks = bookmarks.filter(b => {
    if (selectedCatFilter !== 'all') {
      if (b.category?.toLowerCase() !== selectedCatFilter.toLowerCase()) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const title = (b.title || b.name || '').toLowerCase();
      const desc = (b.excerpt || b.description || b.biography || '').toLowerCase();
      const series = (b.series || b.category || '').toLowerCase();
      if (!title.includes(q) && !desc.includes(q) && !series.includes(q)) {
        return false;
      }
    }
    return true;
  });

  filteredBookmarks.sort((a, b) => {
    if (sortBy === 'alpha-asc') return (a.title || a.name || '').localeCompare(b.title || b.name || '');
    if (sortBy === 'alpha-desc') return (b.title || b.name || '').localeCompare(a.title || a.name || '');
    return new Date(b.bookmarkedAt || 0) - new Date(a.bookmarkedAt || 0);
  });

  return (
    <section className="container-custom" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="fv-section__tag">PERSONAL MULTIVERSE VAULT</span>
        <h2 className="fv-section__title">
          SAVED BOOKMARKS & <span className="fv-grad">SESSION NOTES</span>
        </h2>
        <p className="fv-section__desc" style={{ maxWidth: '740px', margin: '0.6rem auto 0 auto' }}>
          All bookmarked articles, characters, media clips, and events persist in your browser’s <strong>LocalStorage</strong>. 
          Attach personal session notes preserved in <strong>SessionStorage</strong>.
        </p>
      </div>

      {/* Toolbar: Category filter, Search, Sort & Export Actions in ONE SINGLE LINE */}
      <div className="filter-sort-bar">
        {/* 1. Filter by Category (Left) */}
        <div className="fv-toolbar-filter-side">
          <div className="filter-btn-group" style={{ margin: 0 }}>
            {['all', 'anime', 'gaming', 'movies', 'tv-shows', 'k-pop', 'comics', 'manga'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCatFilter(cat)}
                className={`filter-btn ${selectedCatFilter === cat ? 'active' : ''}`}
                style={{ textTransform: 'capitalize' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Live Search Bar (Center) */}
        <div className="fv-toolbar-search-wrap">
          <Search size={15} className="fv-toolbar-search-icon" />
          <input 
            type="text"
            placeholder="Search saved bookmarks..."
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

        {/* 3. Sort Dropdown & Export Buttons (Right) */}
        <div className="fv-toolbar-sort-side">
          <span className="fv-toolbar-sort-label">
            <ArrowUpDown size={14} color="#ff4d2d" />
            Sort:
          </span>
          <ThemeSelect 
            value={sortBy} 
            onChange={(val) => setSortBy(val)}
            options={[
              { value: 'newest', label: 'Newest' },
              { value: 'alpha-asc', label: 'Name (A - Z)' },
              { value: 'alpha-desc', label: 'Name (Z - A)' }
            ]}
            minWidth="135px"
          />
          <button
            onClick={() => handleExport('markdown')}
            className="btn-cyber-primary"
            style={{ padding: '0.42rem 0.75rem', fontSize: '0.76rem', whiteSpace: 'nowrap' }}
            disabled={bookmarks.length === 0}
            title="Export as Markdown file"
          >
            <Download size={13} /> .md
          </button>
          <button
            onClick={() => handleExport('json')}
            className="btn-cyber-outline"
            style={{ padding: '0.42rem 0.65rem', fontSize: '0.76rem', whiteSpace: 'nowrap' }}
            disabled={bookmarks.length === 0}
          >
            JSON
          </button>
        </div>
      </div>

      {/* Bookmarks Grid / Empty State */}
      {filteredBookmarks.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Bookmark size={48} color="var(--neon-purple)" style={{ marginBottom: '1rem', opacity: 0.7 }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Bookmarks in this Vault</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Click the bookmark ribbon icon on any card across the portal to save items here and attach personal notes.
          </p>
        </div>
      ) : (
        <div className="content-grid-3">
          {filteredBookmarks.map((item) => {
            const hasNote = !!notesState[item.id];
            const isEditing = editingNoteId === item.id;

            return (
              <div key={item.id} className="content-card">
                {/* Image */}
                <div className="content-card-image-wrap" style={{ height: '180px' }}>
                  <img 
                    src={item.image || item.thumbnail || item.banner || '/assets/img/placeholder.jpg'} 
                    alt={item.title || item.name} 
                    className="content-card-img" 
                  />
                  <div className="content-card-badge">
                    <span className="badge-neon" style={{ background: 'rgba(7, 8, 20, 0.85)' }}>
                      {(item.category || 'General').toUpperCase()}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onRemoveBookmark(item.id);
                      onShowToast?.(`Removed "${item.title || item.name}" from bookmarks.`);
                    }}
                    className="content-card-bookmark-btn"
                    style={{ background: '#ef4444', borderColor: '#ef4444' }}
                    title="Remove Bookmark"
                  >
                    <Trash2 size={14} color="#fff" />
                  </button>
                </div>

                {/* Body */}
                <div className="content-card-body">
                  <span style={{ fontSize: '0.725rem', color: 'var(--neon-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {item.itemType || 'Saved Item'}
                  </span>

                  <h4 className="content-card-title line-clamp-1" title={item.title || item.name}>
                    {item.title || item.name}
                  </h4>

                  <p className="content-card-desc line-clamp-2">
                    {item.excerpt || item.biography || item.description}
                  </p>

                  {/* Personal Session Note (SessionStorage) */}
                  <div className="bookmark-note-editor">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neon-purple)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <StickyNote size={12} /> Personal Session Note:
                      </span>
                      {!isEditing && (
                        <button
                          onClick={() => handleStartEditNote(item)}
                          style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <Edit3 size={12} /> {hasNote ? 'Edit' : 'Add Note'}
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div>
                        <textarea
                          rows={3}
                          value={currentEditText}
                          onChange={(e) => setCurrentEditText(e.target.value)}
                          placeholder="Type notes (preserved for this browser session)..."
                          className="note-input-field"
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '0.4rem' }}>
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="btn-cyber-outline"
                            style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNote(item.id)}
                            className="btn-cyber-primary"
                            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                          >
                            <Save size={12} /> Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.8rem', color: hasNote ? '#f1f5f9' : 'var(--text-muted)', fontStyle: hasNote ? 'normal' : 'italic', margin: 0 }}>
                        {hasNote ? notesState[item.id] : 'No session notes yet. Click Add Note.'}
                      </p>
                    )}
                  </div>

                  {/* Quick Action depending on item type */}
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    {item.itemType === 'article' && (
                      <button onClick={() => onOpenArticle(item)} className="btn-cyber-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                        Read Full Article →
                      </button>
                    )}
                    {item.itemType === 'character' && (
                      <button onClick={() => onOpenCharacter(item)} className="btn-cyber-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                        Open Character Dossier →
                      </button>
                    )}
                    {item.itemType === 'media' && (
                      <button onClick={() => onOpenMedia(item)} className="btn-cyber-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                        Play Video/OST →
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

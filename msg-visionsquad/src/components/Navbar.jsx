import React, { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { CATEGORIES_DATA } from '../js/data/categoriesData';

export default function Navbar({
  activeTab,
  selectedCategory,
  onNavigateTab,
  onSelectCategory,
  cartCount = 0,
  bookmarkCount = 0,
  onOpenCart,
  searchQuery = '',
  onSearchChange,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onShowToast
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);
  const megaMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Real-Time Digital Clock (updates every second: HH:MM:SS AM/PM)
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Live Multiverse Visitors Counter (fluctuates realistically)
  const [visitorCount, setVisitorCount] = useState(() => {
    try {
      const saved = localStorage.getItem('fv_visitor_count');
      return saved ? parseInt(saved, 10) : 1428;
    } catch {
      return 1428;
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = Math.max(1350, Math.min(1580, prev + delta));
        try {
          localStorage.setItem('fv_visitor_count', next.toString());
        } catch {
          // ignore
        }
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Sticky scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const go = (tab) => {
    onNavigateTab(tab);
    setMobileOpen(false);
    setProfileOpen(false);
    setMegaMenuOpen(false);
  };

  const goCategory = (catId) => {
    onSelectCategory(catId);
    onNavigateTab('categories');
    setMobileOpen(false);
    setProfileOpen(false);
    setMegaMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (activeTab !== 'categories' && activeTab !== 'characters' && activeTab !== 'home') {
      onNavigateTab('home');
    }
  };

  // Compute Breadcrumb Trail
  const breadcrumbs = React.useMemo(() => {
    const list = [
      {
        id: 'home',
        label: 'Home',
        icon: 'fa-house',
        onClick: () => go('home'),
        isCurrent: activeTab === 'home' && !searchQuery.trim()
      }
    ];

    if (searchQuery.trim()) {
      list.push({
        id: 'search',
        label: `"${searchQuery}"`,
        icon: 'fa-magnifying-glass',
        isCurrent: true
      });
      return list;
    }

    if (activeTab === 'home') {
      return list;
    }

    const tabConfig = {
      categories: { label: 'Categories', icon: 'fa-layer-group', tab: 'categories' },
      media: { label: 'Trailers & OSTs', icon: 'fa-clapperboard', tab: 'media' },
      characters: { label: 'Characters', icon: 'fa-users', tab: 'characters' },
      events: { label: 'Events', icon: 'fa-calendar-days', tab: 'events' },
      articles: { label: 'Articles', icon: 'fa-newspaper', tab: 'articles' },
      gallery: { label: 'Gallery', icon: 'fa-images', tab: 'gallery' },
      store: { label: 'Store', icon: 'fa-store', tab: 'store' },
      bookmarks: { label: 'Vault', icon: 'fa-bookmark', tab: 'bookmarks' },
      about: { label: 'About', icon: 'fa-circle-info', tab: 'about' },
      contact: { label: 'Contact', icon: 'fa-envelope', tab: 'contact' }
    };

    const currentTabInfo = tabConfig[activeTab] || { label: activeTab, icon: 'fa-compass', tab: activeTab };
    const activeCatObj = CATEGORIES_DATA.find(c => c.id === selectedCategory);

    if (selectedCategory && selectedCategory !== 'all' && activeCatObj && (activeTab === 'categories' || activeTab === 'characters' || activeTab === 'store')) {
      list.push({
        id: currentTabInfo.tab,
        label: currentTabInfo.label,
        icon: currentTabInfo.icon,
        onClick: () => {
          onSelectCategory('all');
          go(currentTabInfo.tab);
        },
        isCurrent: false
      });
      list.push({
        id: activeCatObj.id,
        label: activeCatObj.name,
        icon: 'fa-sparkles',
        isCurrent: true,
        accentColor: activeCatObj.accentColor
      });
    } else {
      list.push({
        id: currentTabInfo.tab,
        label: currentTabInfo.label,
        icon: currentTabInfo.icon,
        isCurrent: true
      });
    }

    return list;
  }, [activeTab, selectedCategory, searchQuery]);

  return (
    <header className={`fv-nav-root ${scrolled ? 'fv-nav-root--scrolled' : ''}`}>
      
      {/* ══════════════════════════════════════════════════════════════════
          TIER 1: MAIN NAVIGATION & SEARCH HEADER
          [Logo + Multiverse Telemetry] | [The ONE Main Search Bar] | [Account, Bookmarks, Cart]
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="fv-nav-main">
        <div className="fv-nav-main__container">
          
          {/* ── Left: Logo & Live Multiverse Telemetry Capsule ── */}
          <div className="fv-nav-brand-group">
            <div 
              className="fv-nav-logo" 
              onClick={() => go('home')} 
              title="FandomVerse Multiverse"
            >
              <img 
                src="/assets/img/fandomverse-logo.png" 
                alt="FandomVerse Logo" 
              />
            </div>

            {/* Telemetry Capsule (Live Server Status & Real-Time Clock) */}
            <div className="fv-nav-telemetry" title="Live Multiverse Server Status">
              {/* Multiverse Live Visitors */}
              <div className="fv-nav-telemetry__item">
                <span className="fv-nav-radar">
                  <span className="fv-nav-radar__ping"></span>
                  <span className="fv-nav-radar__core"></span>
                </span>
                <div className="fv-nav-telemetry__content">
                  <span className="fv-nav-telemetry__sub">MULTIVERSE</span>
                  <span className="fv-nav-telemetry__val">
                    <strong>{visitorCount.toLocaleString()}</strong> Live
                  </span>
                </div>
              </div>

              <div className="fv-nav-telemetry__divider"></div>

              {/* Digital Clock */}
              <div className="fv-nav-telemetry__item">
                <i className="fa-regular fa-clock fv-nav-telemetry__icon"></i>
                <div className="fv-nav-telemetry__content">
                  <span className="fv-nav-telemetry__sub">REAL-TIME</span>
                  <span className="fv-nav-telemetry__val fv-nav-telemetry__clock">{formattedTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Center: The ONE Main Search Bar ── */}
          <form 
            className="fv-nav-search" 
            onSubmit={handleSearchSubmit}
          >
            {/* Search Input Field */}
            <div className="fv-nav-search__field-wrap">
              <input
                ref={searchInputRef}
                type="text"
                className="fv-nav-search__input"
                placeholder="Search characters, anime, gaming, lore, trailers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="fv-nav-search__clear"
                  onClick={() => {
                    onSearchChange('');
                    searchInputRef.current?.focus();
                  }}
                  title="Clear text"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Fire-Orange Submit Button */}
            <button
              type="submit"
              className="fv-nav-search__submit"
              title="Search FandomVerse"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>

          {/* ── Right: User Actions (Account, Bookmarks Vault, Store Cart) ── */}
          <div className="fv-nav-actions">
            
            {/* 1. Account & Lists Button */}
            <div className="fv-nav-action-wrap" ref={profileRef}>
              <button
                type="button"
                className="fv-nav-action-btn fv-nav-action-btn--account"
                onClick={() => setProfileOpen(!profileOpen)}
                title={currentUser ? currentUser.username : "Sign In / Account"}
              >
                <div className="fv-nav-action-btn__icon-box">
                  <User size={19} color={currentUser ? "#ff4d2d" : "#ff856b"} className="fv-nav-action-btn__user-icon" />
                </div>
                <div className="fv-nav-action-btn__text">
                  <span className="fv-nav-action-btn__sub">
                    {currentUser ? `Hello, ${(currentUser.username || 'Fan').split(' ')[0]}` : 'Hello, Sign In'}
                  </span>
                  <span className="fv-nav-action-btn__main">
                    Account & Lists <i className="fa-solid fa-caret-down fv-nav-action-btn__caret"></i>
                  </span>
                </div>
              </button>

              {/* Profile Menu Dropdown */}
              {profileOpen && (
                <div className="fv-nav-dropdown-menu fv-nav-dropdown-menu--right">
                  {currentUser ? (
                    <>
                      <div className="fv-nav-drop-user-header">
                        <div className="fv-nav-drop-user-avatar">
                          <i className="fa-solid fa-user-astronaut"></i>
                        </div>
                        <div>
                          <div className="fv-nav-drop-user-name">{currentUser.username || 'Multiverse Voyager'}</div>
                          <div className="fv-nav-drop-user-email">{currentUser.email || 'fan@fanverse.io'}</div>
                        </div>
                      </div>

                      <div className="fv-nav-drop-sep" />

                      <button type="button" className="fv-nav-drop-item" onClick={() => go('bookmarks')}>
                        <i className="fa-solid fa-bookmark" style={{ color: '#ff4d2d' }}></i>
                        <span>Saved Bookmarks ({bookmarkCount})</span>
                      </button>

                      <button type="button" className="fv-nav-drop-item" onClick={() => go('store')}>
                        <i className="fa-solid fa-bag-shopping" style={{ color: '#f97316' }}></i>
                        <span>My Merch Orders</span>
                      </button>

                      <div className="fv-nav-drop-sep" />

                      <button 
                        type="button"
                        className="fv-nav-drop-item fv-nav-drop-item--danger" 
                        onClick={() => { onLogout?.(); setProfileOpen(false); }}
                      >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Log Out</span>
                      </button>
                    </>
                  ) : (
                    <div className="fv-nav-drop-guest">
                      <div className="fv-nav-drop-guest-title">Join the FandomVerse</div>
                      <p className="fv-nav-drop-guest-sub">Unlock custom vaults, multiverse bookmarks & exclusive merch discounts.</p>
                      <button
                        type="button"
                        className="fv-nav-drop-guest-btn"
                        onClick={() => { onOpenAuthModal?.(); setProfileOpen(false); }}
                      >
                        <i className="fa-solid fa-rocket"></i> Sign In / Register
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Bookmarks / Vault Button */}
            <button
              type="button"
              className={`fv-nav-action-btn fv-nav-action-btn--bookmarks ${activeTab === 'bookmarks' ? 'fv-nav-action-btn--active' : ''}`}
              onClick={() => go('bookmarks')}
              title="View Saved Bookmarks"
            >
              <div className="fv-nav-action-btn__icon-box">
                <i className="fa-solid fa-bookmark"></i>
                {bookmarkCount > 0 && (
                  <span className="fv-nav-badge fv-nav-badge--bookmark">
                    {bookmarkCount}
                  </span>
                )}
              </div>
              <div className="fv-nav-action-btn__text">
                <span className="fv-nav-action-btn__sub">Vault</span>
                <span className="fv-nav-action-btn__main">Bookmarks</span>
              </div>
            </button>

            {/* 3. Shopping Cart Button */}
            <button
              type="button"
              className="fv-nav-action-btn fv-nav-action-btn--cart"
              onClick={onOpenCart}
              title="Shopping Cart"
            >
              <div className="fv-nav-action-btn__icon-box">
                <i className="fa-solid fa-cart-shopping"></i>
                <span className="fv-nav-badge fv-nav-badge--cart">
                  {cartCount}
                </span>
              </div>
              <div className="fv-nav-action-btn__text">
                <span className="fv-nav-action-btn__sub">Store</span>
                <span className="fv-nav-action-btn__main">Cart</span>
              </div>
            </button>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              type="button"
              className="fv-nav-action-btn fv-nav-action-btn--hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              title="Open Navigation Menu"
            >
              <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          TIER 2: CLEAN STREAMLINED SUB-BAR
          [☰ All Verses ▾] | Home | Trailers & OSTs | Characters | Merch Store | About | Comic-Con 2026
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="fv-nav-sub">
        <div className="fv-nav-sub__container">
          
          {/* ☰ All Verses Main Category Hub / Mega Dropdown */}
          <div 
            className="fv-nav-mega-wrap" 
            ref={megaMenuRef}
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}
          >
            <button
              type="button"
              className={`fv-nav-mega-trigger ${megaMenuOpen || activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => {
                if (!megaMenuOpen) {
                  setMegaMenuOpen(true);
                } else {
                  go('categories');
                }
              }}
              title="Explore Categories"
            >
              <i className="fa-solid fa-bars"></i>
              <span>Category</span>
              <i className={`fa-solid fa-chevron-down fv-nav-mega-chevron ${megaMenuOpen ? 'open' : ''}`}></i>
            </button>

            {/* Consolidated 7 Realms Mega Menu Panel */}
            {megaMenuOpen && (
              <div className="fv-nav-mega-panel">
                <div className="fv-nav-mega-header">
                  <div className="fv-nav-mega-header__title">
                    <i className="fa-solid fa-compass" style={{ color: '#ff4d2d' }}></i>
                    <span>Explore Categories</span>
                  </div>
                  <span className="fv-nav-mega-header__badge">7 REALMS</span>
                </div>

                <div className="fv-nav-mega-grid">
                  {CATEGORIES_DATA.map((cat) => {
                    const isCatActive = activeTab === 'categories' && selectedCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`fv-nav-mega-card ${isCatActive ? 'active' : ''}`}
                        onClick={() => goCategory(cat.id)}
                      >
                        <div 
                          className="fv-nav-mega-card__icon"
                          style={{
                            background: isCatActive 
                              ? 'linear-gradient(135deg, #ff4d2d, #ff7a00)' 
                              : 'rgba(255, 77, 45, 0.12)'
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
                          } style={{ color: isCatActive ? '#ffffff' : '#ff684a' }}></i>
                        </div>
                        <div className="fv-nav-mega-card__info">
                          <span className="fv-nav-mega-card__name">{cat.name} Realm</span>
                          <span className="fv-nav-mega-card__stats">{cat.stats?.characters || 8}+ Dossiers • {cat.stats?.fans || '2M'} Fans</span>
                        </div>
                        <i className="fa-solid fa-angle-right fv-nav-mega-card__arrow"></i>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Quick Links */}
                <div className="fv-nav-mega-footer">
                  <button 
                    type="button"
                    className="fv-nav-mega-footer__link"
                    onClick={() => { onNavigateTab('characters'); setMegaMenuOpen(false); }}
                  >
                    <i className="fa-solid fa-user-astronaut"></i> All Characters
                  </button>
                  <span className="fv-nav-mega-footer__sep">•</span>
                  <button 
                    type="button"
                    className="fv-nav-mega-footer__link"
                    onClick={() => { onNavigateTab('store'); setMegaMenuOpen(false); }}
                  >
                    <i className="fa-solid fa-store"></i> Merch Store
                  </button>
                  <span className="fv-nav-mega-footer__sep">•</span>
                  <button 
                    type="button"
                    className="fv-nav-mega-footer__link"
                    onClick={() => { onNavigateTab('events'); setMegaMenuOpen(false); }}
                  >
                    <i className="fa-solid fa-calendar-days"></i> Events
                  </button>
                  <span className="fv-nav-mega-footer__sep">•</span>
                  <button 
                    type="button"
                    className="fv-nav-mega-footer__link"
                    onClick={() => { onNavigateTab('articles'); setMegaMenuOpen(false); }}
                  >
                    <i className="fa-solid fa-newspaper"></i> Articles
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Streamlined Primary Navigation Links */}
          <nav className="fv-nav-sub-links">
            <button
              type="button"
              className={`fv-nav-sub-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => go('home')}
            >
              <i className="fa-solid fa-house"></i> Home
            </button>

            <button
              type="button"
              className={`fv-nav-sub-link ${activeTab === 'media' ? 'active' : ''}`}
              onClick={() => go('media')}
            >
              <i className="fa-solid fa-clapperboard"></i> Trailers & OSTs
            </button>

            <button
              type="button"
              className={`fv-nav-sub-link ${activeTab === 'characters' ? 'active' : ''}`}
              onClick={() => go('characters')}
            >
              <i className="fa-solid fa-users"></i> Characters
            </button>

            <button
              type="button"
              className={`fv-nav-sub-link ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => go('events')}
            >
              <i className="fa-solid fa-calendar-days"></i> Events
            </button>

            <button
              type="button"
              className={`fv-nav-sub-link ${activeTab === 'articles' ? 'active' : ''}`}
              onClick={() => go('articles')}
            >
              <i className="fa-solid fa-newspaper"></i> Articles
            </button>

            <button
              type="button"
              className={`fv-nav-sub-link ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => go('gallery')}
            >
              <i className="fa-solid fa-images"></i> Gallery
            </button>

            <button
              type="button"
              className={`fv-nav-sub-link ${activeTab === 'store' ? 'active' : ''}`}
              onClick={() => go('store')}
            >
              <i className="fa-solid fa-store"></i> Merch Store
            </button>

            <button
              type="button"
              className={`fv-nav-sub-link ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => go('about')}
            >
              <i className="fa-solid fa-circle-info"></i> About
            </button>

            <button
              type="button"
              className={`fv-nav-sub-link ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => go('contact')}
            >
              <i className="fa-solid fa-envelope"></i> Contact
            </button>
          </nav>

          {/* Right: Minimized Breadcrumbs & Active Dimension Pill */}
          <div className="fv-nav-sub-trail" title="Active Multiverse Dimension">
            <span className="fv-nav-trail-pulse"></span>
            <div className="fv-nav-trail-crumbs">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <span key={crumb.id || idx} className="fv-nav-trail-node">
                    {idx > 0 && <i className="fa-solid fa-angle-right fv-nav-trail-sep"></i>}
                    {isLast ? (
                      <span 
                        className="fv-nav-trail-current" 
                        style={crumb.accentColor ? { color: crumb.accentColor } : {}}
                      >
                        <i className={`fa-solid ${crumb.icon}`} style={{ marginRight: 4, fontSize: '0.7rem' }}></i>
                        {crumb.label}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={crumb.onClick}
                        className="fv-nav-trail-btn"
                        title={`Navigate to ${crumb.label}`}
                      >
                        {crumb.label}
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE SLIDE-DOWN DRAWER MENU (Tablet & Mobile only)
      ═══════════════════════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="fv-nav-mobile-drawer">
          {/* Mobile Telemetry Status Bar */}
          <div className="fv-nav-mobile-telemetry">
            <div className="fv-nav-telemetry__item">
              <span className="fv-nav-radar">
                <span className="fv-nav-radar__ping"></span>
                <span className="fv-nav-radar__core"></span>
              </span>
              <div className="fv-nav-telemetry__content">
                <span className="fv-nav-telemetry__sub">MULTIVERSE</span>
                <span className="fv-nav-telemetry__val">
                  <strong>{visitorCount.toLocaleString()}</strong> Live
                </span>
              </div>
            </div>
            <div className="fv-nav-telemetry__item">
              <i className="fa-regular fa-clock fv-nav-telemetry__icon"></i>
              <div className="fv-nav-telemetry__content">
                <span className="fv-nav-telemetry__sub">REAL-TIME</span>
                <span className="fv-nav-telemetry__val">{formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Mobile Nav Links */}
          <button
            type="button"
            className={`fv-nav-mobile-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => go('home')}
          >
            <i className="fa-solid fa-house"></i> Home
          </button>

          {/* All Verses Accordion (7 Realms) */}
          <div className="fv-nav-mobile-group">
            <button
              type="button"
              className={`fv-nav-mobile-link fv-nav-mobile-link--has-sub ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setMobileCatOpen(!mobileCatOpen)}
            >
              <div className="fv-nav-mobile-link__title">
                <i className="fa-solid fa-layer-group" style={{ color: '#ff4d2d' }}></i>
                <span>Category (7 Realms)</span>
              </div>
              <i className={`fa-solid fa-chevron-down ${mobileCatOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {mobileCatOpen && (
              <div className="fv-nav-mobile-subitems">
                {CATEGORIES_DATA.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`fv-nav-mobile-sublink ${activeTab === 'categories' && selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => goCategory(cat.id)}
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
                    <span>{cat.name} Realm</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className={`fv-nav-mobile-link ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => go('media')}
          >
            <i className="fa-solid fa-clapperboard"></i> Trailers & OSTs
          </button>

          <button
            type="button"
            className={`fv-nav-mobile-link ${activeTab === 'characters' ? 'active' : ''}`}
            onClick={() => go('characters')}
          >
            <i className="fa-solid fa-users"></i> Characters
          </button>

          <button
            type="button"
            className={`fv-nav-mobile-link ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => go('events')}
          >
            <i className="fa-solid fa-calendar-days" style={{ color: '#ff4d2d' }}></i> Events
          </button>

          <button
            type="button"
            className={`fv-nav-mobile-link ${activeTab === 'articles' ? 'active' : ''}`}
            onClick={() => go('articles')}
          >
            <i className="fa-solid fa-newspaper" style={{ color: '#ff4d2d' }}></i> Articles
          </button>

          <button
            type="button"
            className={`fv-nav-mobile-link ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => go('gallery')}
          >
            <i className="fa-solid fa-images"></i> Gallery
          </button>

          <button
            type="button"
            className={`fv-nav-mobile-link ${activeTab === 'store' ? 'active' : ''}`}
            onClick={() => go('store')}
          >
            <i className="fa-solid fa-store"></i> Merch Store
          </button>

          <button
            type="button"
            className={`fv-nav-mobile-link ${activeTab === 'bookmarks' ? 'active' : ''}`}
            onClick={() => go('bookmarks')}
          >
            <i className="fa-solid fa-bookmark"></i> Bookmarks ({bookmarkCount})
          </button>

          <button
            type="button"
            className={`fv-nav-mobile-link ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => go('about')}
          >
            <i className="fa-solid fa-circle-info"></i> About
          </button>

          <button
            type="button"
            className={`fv-nav-mobile-link ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => go('contact')}
          >
            <i className="fa-solid fa-envelope"></i> Contact
          </button>

          {/* User Sign In / Profile on Mobile */}
          <div className="fv-nav-mobile-auth">
            {currentUser ? (
              <div className="fv-nav-mobile-user">
                <span>Signed in as <strong>{currentUser.username}</strong></span>
                <button type="button" className="fv-nav-mobile-logout-btn" onClick={() => { onLogout?.(); setMobileOpen(false); }}>
                  Log Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="fv-nav-mobile-login-btn"
                onClick={() => { onOpenAuthModal?.(); setMobileOpen(false); }}
              >
                <i className="fa-solid fa-rocket"></i> Sign In / Join Verse
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
}

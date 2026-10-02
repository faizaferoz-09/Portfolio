import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

// CSS Modular Imports
import './assets/css/index.css';
import './assets/css/hero.css';
import './assets/css/components.css';
import './assets/css/chatbot.css';
import './assets/css/intro.css';

// Motion & Background Canvas
import CinematicBackgroundCanvas from './components/CinematicBackgroundCanvas';
import NetflixLogoIntro from './components/NetflixLogoIntro';
import { animatePageTransition, initCinematicAnimations } from './js/utils/motion';

// Data Imports
import { CATEGORIES_DATA } from './js/data/categoriesData';
import { ARTICLES_DATA } from './js/data/articlesData';
import { CHARACTERS_DATA } from './js/data/charactersData';
import { EVENTS_DATA } from './js/data/eventsData';
import { MERCHANDISE_DATA } from './js/data/merchandiseData';
import { MEDIA_DATA } from './js/data/mediaData';

// Storage Helpers
import { 
  getBookmarks, toggleBookmark, isBookmarked, 
  getCartFromStorage, saveCartToStorage, 
  getStoredUser, saveStoredUser 
} from './js/utils/storage';

// Components
import Navbar from './components/Navbar';
import HomeDashboard from './components/HomeDashboard';
import CategoryHubs from './components/CategoryHubs';
import MediaHub from './components/MediaHub';
import ArticlesSection from './components/ArticlesSection';
import CharacterProfiles from './components/CharacterProfiles';
import EventHighlights from './components/EventHighlights';
import MerchandiseStore from './components/MerchandiseStore';
import Bookmarks from './components/Bookmarks';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import Gallery from './components/Gallery';
import ChatbotWidget from './components/ChatbotWidget';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import { X, Bookmark, Sparkles, Clock, Eye, ArrowRight, Share2 } from 'lucide-react';

export default function App() {
  // Theme locked to Fluxora Luxury Editorial Theme (#120400 + #ff4d2d)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    try {
      localStorage.setItem('fandomverse_theme', 'dark');
      localStorage.setItem('fandomverse_theme_v2', 'dark');
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Netflix-style Cinematic Logo Intro
  const [showIntro, setShowIntro] = useState(true);

  // Navigation State
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Bookmark States
  const [cartItems, setCartItems] = useState(() => getCartFromStorage());
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // User Auth State
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Modals for deep detail inspection
  const [activeArticleModal, setActiveArticleModal] = useState(null);
  const [activeCharModal, setActiveCharModal] = useState(null);
  const [activeTrailerModal, setActiveTrailerModal] = useState(null);

  // Toast Notification System
  const [toasts, setToasts] = useState([]);

  const showToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // Lock body scroll and listen for Escape key when any modal is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      activeArticleModal || 
      activeCharModal || 
      activeTrailerModal || 
      authModalOpen || 
      cartDrawerOpen
    );
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveArticleModal(null);
        setActiveCharModal(null);
        setActiveTrailerModal(null);
        setAuthModalOpen(false);
        setCartDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeArticleModal, activeCharModal, activeTrailerModal, authModalOpen, cartDrawerOpen]);

  // Sync Cart changes to LocalStorage
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  // Universal Cinematic Text & Content Scroll Observer (Website-wide)
  useEffect(() => {
    let animCleanup = null;
    let observer = null;

    // Run after DOM has painted new tab/content
    const timer = setTimeout(() => {
      // 1. Initialize GSAP cinematic physics scroll & entrance animations across all elements
      try {
        animCleanup = initCinematicAnimations(mainContentRef.current || document);
      } catch (e) {
        console.error('Motion animation init error:', e);
      }

      // 2. Fallback CSS intersection observer for scroll-reveal classes
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

      // 1. Section Eyebrows & Badges (Stagger 1)
      const tags = Array.from(document.querySelectorAll(
        '.fv-section__tag, .section-tag, .badge-neon:not(.content-card-badge .badge-neon)'
      ));
      tags.forEach(el => el.classList.add('fv-scroll-reveal', 'fv-stagger-1'));

      // 2. Section Titles & Main Headings (Stagger 2)
      const headings = Array.from(document.querySelectorAll(
        '.fv-section__title, .fv-choose__title, .section-header h2, .page-header h1, .page-header h2, h2:not(.fv-hero-kinetic-title)'
      )).filter(el => !el.closest('.fv-hero-fluxora'));
      headings.forEach(el => el.classList.add('fv-scroll-reveal', 'fv-stagger-2'));

      // 3. Section Descriptions & Subtitles (Stagger 3)
      const descs = Array.from(document.querySelectorAll(
        '.fv-section__desc, .section-header p, .fv-choose__desc, .page-header p'
      )).filter(el => !el.closest('.fv-hero-fluxora'));
      descs.forEach(el => el.classList.add('fv-scroll-reveal', 'fv-stagger-3'));

      // 4. Cards & Content Items (Sequential one-by-one stagger)
      const cards = Array.from(document.querySelectorAll(
        '.content-card, .article-card, .char-card, .event-card, .merch-card, .media-card, .fv-fandom-card, .fv-universe-card, .fv-trending-card, .fv-choose-card, .fv-gallery-card, .fv-char-card, .glass-panel'
      ));
      cards.forEach(el => el.classList.add('fv-card-stagger'));

      const allRevealables = [...tags, ...headings, ...descs, ...cards];
      allRevealables.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight + 20 && rect.bottom >= 0) {
          el.classList.add('is-visible');
        } else {
          observer.observe(el);
        }
      });
    }, 60);

    return () => {
      clearTimeout(timer);
      if (animCleanup) animCleanup();
      if (observer) observer.disconnect();
    };
  }, [activeTab, selectedCategory, searchQuery]);

  // Handle Cart Operations
  const handleAddToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showToast(`🛍️ Added "${item.name || item.title}" to cart!`);
  };

  const handleUpdateCartQty = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
    showToast('Item removed from cart');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Handle Bookmarks Toggle
  const handleBookmarkToggle = (item) => {
    const res = toggleBookmark(item);
    setBookmarks(res.list);
    if (res.bookmarked) {
      showToast(`🔖 Saved "${item.title || item.name}" to Bookmarks!`);
    } else {
      showToast(`Removed "${item.title || item.name}" from Bookmarks.`);
    }
  };

  const checkIsBookmarked = (itemId) => {
    return bookmarks.some(b => b.id === itemId);
  };

  // Handle User Auth
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    saveStoredUser(user);
    setActiveTab('home');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    showToast(`✨ Welcome to the Multiverse, ${user.username}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveStoredUser(null);
    showToast('Signed out of mock user session.');
  };

  // Unified content dataset for search and category aggregation
  const allUnifiedContent = useMemo(() => {
    const articles = ARTICLES_DATA.map(a => ({ ...a, itemType: 'article' }));
    const chars = CHARACTERS_DATA.map(c => ({ ...c, itemType: 'character' }));
    const media = MEDIA_DATA.map(m => ({ ...m, itemType: 'media' }));
    const events = EVENTS_DATA.map(e => ({ ...e, itemType: 'event' }));
    const merch = MERCHANDISE_DATA.map(m => ({ ...m, itemType: 'merch' }));

    return [...articles, ...chars, ...media, ...events, ...merch];
  }, []);

  // Filtered by live search query if user typed in navbar
  const searchFilteredContent = useMemo(() => {
    if (!searchQuery.trim()) return allUnifiedContent;
    const q = searchQuery.toLowerCase().trim();
    return allUnifiedContent.filter(item => {
      const title = (item.title || item.name || '').toLowerCase();
      const desc = (item.description || item.excerpt || item.biography || '').toLowerCase();
      const series = (item.series || item.author || item.creator || '').toLowerCase();
      const category = (item.category || '').toLowerCase();
      const tags = (item.tags || item.traits || []).map(t => t.toLowerCase()).join(' ');

      return title.includes(q) || desc.includes(q) || series.includes(q) || category.includes(q) || tags.includes(q);
    });
  }, [allUnifiedContent, searchQuery]);

  // Navigation Helper
  const handleNavigateTab = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setActiveTab('categories');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  const mainContentRef = useRef(null);

  // Trigger smooth cinematic page transition on activeTab change
  useEffect(() => {
    if (mainContentRef.current) {
      animatePageTransition(mainContentRef.current);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* ── Global Scroll-To-Top on Route/Page Navigation ── */}
      <ScrollToTop routeKey={`${activeTab}_${selectedCategory}`} />

      {/* ── Netflix-Style Cinematic Logo Intro Effect ── */}
      {showIntro && <NetflixLogoIntro onComplete={() => setShowIntro(false)} />}

      {/* ── 3D Cinematic Background Animation across entire website ── */}
      <CinematicBackgroundCanvas activeTab={activeTab} />

      {/* Global Fixed Navbar */}
      <Navbar
        activeTab={activeTab}
        selectedCategory={selectedCategory}
        onNavigateTab={handleNavigateTab}
        onSelectCategory={handleSelectCategory}
        cartCount={cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}
        bookmarkCount={bookmarks.length}
        onOpenCart={() => setCartDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onShowToast={showToast}
      />


      {/* Main Content Area */}
      <main ref={mainContentRef} style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {/* Search Results Mode if Search Input Active */}
        {searchQuery.trim() ? (
          <div className="container-custom" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="fv-section__tag">LIVE SEARCH FILTER</span>
                <h2 className="fv-section__title" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', marginTop: '0.4rem', textAlign: 'left' }}>
                  SEARCH RESULTS FOR <span className="fv-grad">"{searchQuery}"</span> ({searchFilteredContent.length} found)
                </h2>
              </div>
              <button 
                onClick={() => setSearchQuery('')}
                className="btn-cyber-outline"
              >
                Clear Search
              </button>
            </div>

            <CategoryHubs
              selectedCategory="all"
              onSelectCategory={handleSelectCategory}
              allContent={searchFilteredContent}
              isSearch={true}
              onBookmarkToggle={handleBookmarkToggle}
              isItemBookmarked={checkIsBookmarked}
              onOpenArticle={setActiveArticleModal}
              onOpenCharacter={setActiveCharModal}
              onOpenMedia={setActiveTrailerModal}
              onAddToCart={handleAddToCart}
            />
          </div>
        ) : (
          <>
            {/* HOME BENTO DASHBOARD VIEW (TechWiz 7 Reference UI) */}
            {activeTab === 'home' && (
              <HomeDashboard
                onNavigateTab={handleNavigateTab}
                onSelectCategory={handleSelectCategory}
                onOpenCharacter={setActiveCharModal}
                onOpenTrailer={setActiveTrailerModal}
                onOpenArticle={setActiveArticleModal}
                onBookmarkToggle={handleBookmarkToggle}
                isItemBookmarked={checkIsBookmarked}
                onAddToCart={handleAddToCart}
                onShowToast={showToast}
              />
            )}

            {/* CATEGORIES HUB VIEW */}
            {activeTab === 'categories' && (
              <div style={{ paddingTop: '1.5rem' }}>
                <CategoryHubs
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  allContent={allUnifiedContent}
                  onBookmarkToggle={handleBookmarkToggle}
                  isItemBookmarked={checkIsBookmarked}
                  onOpenArticle={setActiveArticleModal}
                  onOpenCharacter={setActiveCharModal}
                  onOpenMedia={setActiveTrailerModal}
                  onAddToCart={handleAddToCart}
                  onShowToast={showToast}
                />
              </div>
            )}

            {/* ARTICLES VIEW */}
            {activeTab === 'articles' && (
              <div style={{ paddingTop: '1.5rem' }}>
                <ArticlesSection
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onBookmarkToggle={handleBookmarkToggle}
                  isItemBookmarked={checkIsBookmarked}
                  activeArticleModal={activeArticleModal}
                  setActiveArticleModal={setActiveArticleModal}
                  onOpenArticle={setActiveArticleModal}
                />
              </div>
            )}

            {/* MEDIA HUB VIEW */}
            {activeTab === 'media' && (
              <div style={{ paddingTop: '1.5rem' }}>
                <MediaHub
                  onBookmarkToggle={handleBookmarkToggle}
                  isItemBookmarked={checkIsBookmarked}
                  selectedCategory={selectedCategory}
                  activeTrailerModal={activeTrailerModal}
                  setActiveTrailerModal={setActiveTrailerModal}
                />
              </div>
            )}

            {/* CHARACTER PROFILES VIEW */}
            {activeTab === 'characters' && (
              <div style={{ paddingTop: '1.5rem' }}>
                <CharacterProfiles
                  selectedCategory={selectedCategory}
                  onBookmarkToggle={handleBookmarkToggle}
                  isItemBookmarked={checkIsBookmarked}
                  activeCharModal={activeCharModal}
                  setActiveCharModal={setActiveCharModal}
                />
              </div>
            )}

            {/* EVENT HIGHLIGHTS VIEW */}
            {activeTab === 'events' && (
              <div style={{ paddingTop: '1.5rem' }}>
                <EventHighlights
                  selectedCategory={selectedCategory}
                  onBookmarkToggle={handleBookmarkToggle}
                  isItemBookmarked={checkIsBookmarked}
                  onShowToast={showToast}
                />
              </div>
            )}

            {/* MERCHANDISE STORE VIEW */}
            {activeTab === 'store' && (
              <div style={{ paddingTop: '1.5rem' }}>
                <MerchandiseStore
                  cartItems={cartItems}
                  onAddToCart={handleAddToCart}
                  onUpdateCartQty={handleUpdateCartQty}
                  onRemoveFromCart={handleRemoveFromCart}
                  onClearCart={handleClearCart}
                  cartDrawerOpen={cartDrawerOpen}
                  onCloseCart={() => setCartDrawerOpen(false)}
                  selectedCategory={selectedCategory}
                  onBookmarkToggle={handleBookmarkToggle}
                  isItemBookmarked={checkIsBookmarked}
                  onShowToast={showToast}
                />
              </div>
            )}

            {/* VISUAL GALLERY VIEW */}
            {activeTab === 'gallery' && (
              <div style={{ paddingTop: '1.5rem' }}>
                <Gallery />
              </div>
            )}

            {/* BOOKMARKS & SESSION NOTES VIEW */}
            {activeTab === 'bookmarks' && (
              <div style={{ paddingTop: '1.5rem' }}>
                <Bookmarks
                  bookmarks={bookmarks}
                  onRemoveBookmark={(id) => {
                    const res = toggleBookmark({ id });
                    setBookmarks(res.list);
                  }}
                  onOpenArticle={setActiveArticleModal}
                  onOpenCharacter={setActiveCharModal}
                  onOpenMedia={setActiveTrailerModal}
                  onShowToast={showToast}
                />
              </div>
            )}

            {/* ABOUT US VIEW */}
            {activeTab === 'about' && (
              <div style={{ paddingTop: '1.5rem' }}>
                <AboutUs />
              </div>
            )}

            {/* CONTACT US VIEW */}
            {activeTab === 'contact' && (
              <div style={{ paddingTop: '1.5rem' }}>
                <ContactUs onShowToast={showToast} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Global Merchandise Drawer Modal (Accessible from any tab via navbar cart icon) */}
      <MerchandiseStore
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onUpdateCartQty={handleUpdateCartQty}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        cartDrawerOpen={cartDrawerOpen}
        onCloseCart={() => setCartDrawerOpen(false)}
        selectedCategory={selectedCategory}
        onBookmarkToggle={handleBookmarkToggle}
        isItemBookmarked={checkIsBookmarked}
        onShowToast={showToast}
        drawerOnly={true}
      />

      {/* Floating AI Chatbot Widget (Present on all pages) */}
      <ChatbotWidget
        onNavigateTab={handleNavigateTab}
        onSelectCategory={handleSelectCategory}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

      {/* Dummy Login / Signup Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
      />

      {/* Snappy Toast Notifications Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast-item">
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Global Video Modal for all pages (Mounted via Portal directly to body) */}
      {activeTrailerModal && createPortal(
        <div className="modal-overlay" onClick={() => setActiveTrailerModal(null)}>
          <div className="modal-content-box" style={{ maxWidth: '850px', padding: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={() => setActiveTrailerModal(null)}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: '1rem' }}>
              <span className="badge-neon" style={{ marginBottom: '0.3rem' }}>
                {activeTrailerModal.category?.toUpperCase()} • {activeTrailerModal.type?.toUpperCase()}
              </span>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-cyber)', color: '#fff' }}>
                {activeTrailerModal.title}
              </h3>
            </div>

            {/* Responsive 16:9 Video Embed */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem' }}>
              <iframe
                src={`${activeTrailerModal.videoUrl}?autoplay=1`}
                title={activeTrailerModal.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {activeTrailerModal.description}
            </p>
          </div>
        </div>,
        document.body
      )}

      {/* Global Character Modal for all pages (Mounted via Portal directly to body) */}
      {activeCharModal && createPortal(
        <div className="modal-overlay" onClick={() => setActiveCharModal(null)}>
          <div className="modal-content-box" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveCharModal(null)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '180px', height: '220px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '2px solid var(--neon-cyan)' }}>
                <img 
                  src={activeCharModal.image} 
                  alt={activeCharModal.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '260px' }}>
                <span className="badge-neon" style={{ marginBottom: '0.5rem' }}>
                  {activeCharModal.category?.toUpperCase()} • {activeCharModal.series}
                </span>
                <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-cyber)', color: '#fff' }}>
                  {activeCharModal.name}
                </h2>
                <h4 style={{ fontSize: '1rem', color: 'var(--neon-purple)', marginBottom: '0.5rem' }}>
                  {activeCharModal.role}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  <strong>Affiliation:</strong> {activeCharModal.affiliation}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--neon-pink)' }}>
                  <strong>Signature Move:</strong> {activeCharModal.signatureMove}
                </p>
              </div>
            </div>

            {/* Biography */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--neon-cyan)', marginBottom: '0.4rem' }}>
                Biography & Lore:
              </h4>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {activeCharModal.biography}
              </p>
            </div>

            {/* Complete Combat Matrix */}
            {activeCharModal.stats && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(8, 10, 24, 0.75)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.75rem' }}>
                  Complete Combat & Ability Matrix
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {Object.entries(activeCharModal.stats).map(([statKey, statVal]) => (
                    <div key={statKey}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', textTransform: 'capitalize', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                        <span>{statKey}</span>
                        <span style={{ color: 'var(--neon-cyan)', fontWeight: 700 }}>{statVal}/100</span>
                      </div>
                      <div className="stat-progress-track">
                        <div className="stat-progress-fill" style={{ width: `${statVal}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traits */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {activeCharModal.traits?.map((t, idx) => (
                <span key={idx} className="tag-chip" style={{ borderColor: 'var(--neon-purple)', color: '#d86bfe' }}>
                  ★ {t}
                </span>
              ))}
            </div>

            {/* Quote */}
            {activeCharModal.quote && (
              <div className="quote-box" style={{ padding: '0.85rem', background: 'rgba(188, 19, 254, 0.1)', borderRadius: 'var(--radius-sm)' }}>
                "{activeCharModal.quote}"
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Global Article Modal for all pages (Mounted via Portal directly to body) */}
      {activeArticleModal && createPortal(
        <div className="modal-overlay" onClick={() => setActiveArticleModal(null)}>
          <div 
            className="modal-content-box" 
            style={{ 
              maxWidth: '860px', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '2.2rem 2.25rem' 
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close-btn" 
              onClick={() => setActiveArticleModal(null)}
              title="Close Article (Esc)"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Top Meta Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
              <span className="badge-neon" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {activeArticleModal.category}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>•</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {activeArticleModal.date}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>•</span>
              <span style={{ fontSize: '0.8rem', color: '#ff856b', fontWeight: 600 }}>
                {activeArticleModal.readTime}
              </span>
              {activeArticleModal.views && (
                <>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>•</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    👁️ {activeArticleModal.views} views
                  </span>
                </>
              )}
            </div>

            {/* Headline */}
            <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)', fontFamily: 'var(--font-cyber)', marginBottom: '1.25rem', lineHeight: 1.28, color: '#ffffff', letterSpacing: '0.02em' }}>
              {activeArticleModal.title}
            </h2>

            {/* Author Bar & Actions */}
            {activeArticleModal.author && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  {activeArticleModal.authorAvatar && (
                    <img 
                      src={activeArticleModal.authorAvatar} 
                      alt={activeArticleModal.author} 
                      style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #ff4d2d', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <h4 style={{ fontSize: '0.98rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>{activeArticleModal.author}</h4>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{activeArticleModal.authorRole || 'Senior Editorial Contributor'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button 
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast('🔗 Article link copied to clipboard!');
                    }}
                    className="btn-cyber-outline"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                    title="Share Article"
                  >
                    <span>Share</span>
                  </button>
                  <button 
                    onClick={() => handleBookmarkToggle(activeArticleModal)}
                    className={`btn-cyber-outline ${checkIsBookmarked(activeArticleModal.id) ? 'active' : ''}`}
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                  >
                    <Bookmark size={14} fill={checkIsBookmarked(activeArticleModal.id) ? '#ff4d2d' : 'none'} color={checkIsBookmarked(activeArticleModal.id) ? '#ff4d2d' : 'currentColor'} />
                    <span>{checkIsBookmarked(activeArticleModal.id) ? 'Saved' : 'Bookmark'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* High-Resolution Cover Image */}
            <div style={{ width: '100%', minHeight: '260px', maxHeight: '380px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1.75rem', border: '1px solid rgba(255,77,45,0.25)', boxShadow: '0 12px 30px rgba(0,0,0,0.6)' }}>
              <img 
                src={activeArticleModal.image} 
                alt={activeArticleModal.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Complete Rich Story Content */}
            <div style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              {typeof activeArticleModal.content === 'string' ? (
                activeArticleModal.content.split('\n\n').map((paragraph, pIdx) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h3 key={pIdx} style={{ fontSize: '1.25rem', color: '#ff684a', marginTop: '1.5rem', marginBottom: '0.6rem', fontWeight: 800 }}>
                        {trimmed.replace('### ', '')}
                      </h3>
                    );
                  }
                  return (
                    <p key={pIdx} style={{ marginBottom: '1.1rem' }}>
                      {trimmed}
                    </p>
                  );
                })
              ) : (
                <p>{activeArticleModal.excerpt}</p>
              )}
            </div>

            {/* Hashtags & Topic Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {(activeArticleModal.hashtags || activeArticleModal.tags || []).map((t, idx) => (
                <span key={idx} className="tag-chip" style={{ background: 'rgba(255, 77, 45, 0.1)', borderColor: 'rgba(255, 77, 45, 0.3)', color: '#ff856b' }}>
                  {t.startsWith('#') ? t : `#${t}`}
                </span>
              ))}
            </div>

            {/* Recommended Next Lore Articles */}
            <div style={{ background: 'rgba(18, 5, 4, 0.85)', padding: '1.4rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,77,45,0.25)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
              <h4 style={{ fontSize: '1rem', color: '#ff684a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                <Sparkles size={16} /> Recommended Next Reads & Fandom Lore
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {ARTICLES_DATA.filter(a => a.id !== activeArticleModal.id).slice(0, 3).map(rec => (
                  <div 
                    key={rec.id} 
                    onClick={() => setActiveArticleModal(rec)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.7rem 1rem', 
                      borderRadius: 'var(--radius-md)', 
                      background: 'rgba(255,255,255,0.03)', 
                      cursor: 'pointer', 
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 0.2s ease'
                    }}
                    className="fv-rec-article-item"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={rec.image} alt={rec.title} style={{ width: 42, height: 42, borderRadius: '6px', objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 600 }}>{rec.title}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#ff856b', whiteSpace: 'nowrap', fontWeight: 700, marginLeft: '0.5rem' }}>
                      {rec.category.toUpperCase()} →
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
      <Footer 
        onNavigateTab={handleNavigateTab} 
        onSelectCategory={handleSelectCategory} 
        onShowToast={showToast} 
      />
    </div>
  );
}

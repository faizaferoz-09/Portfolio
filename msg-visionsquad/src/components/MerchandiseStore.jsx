import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Star, Plus, Minus, Trash2, Tag, 
  Check, X, ShieldAlert, Sparkles, CreditCard, ArrowRight, Bookmark,
  Search, SlidersHorizontal, Eye, Flame, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MERCHANDISE_DATA } from '../js/data/merchandiseData';
import { calculateCartSummary } from '../js/cartLogic';
import ThemeSelect from './ThemeSelect';

const STORE_CATEGORIES = [
  { id: 'all',      label: 'All Items', icon: 'fa-infinity' },
  { id: 'anime',    label: 'Anime',     icon: 'fa-dragon' },
  { id: 'gaming',   label: 'Gaming',    icon: 'fa-gamepad' },
  { id: 'movies',   label: 'Movies',    icon: 'fa-film' },
  { id: 'tv-shows', label: 'TV Shows',  icon: 'fa-tv' },
  { id: 'k-pop',    label: 'K-Pop',     icon: 'fa-microphone-lines' },
  { id: 'comics',   label: 'Comics',    icon: 'fa-book-open' },
  { id: 'manga',    label: 'Manga',     icon: 'fa-book-bookmark' },
];

export default function MerchandiseStore({
  cartItems = [],
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  cartDrawerOpen,
  onCloseCart,
  selectedCategory: initialCategory = 'all',
  onBookmarkToggle,
  isItemBookmarked,
  onShowToast,
  drawerOnly = false
}) {
  const [activeCategory, setActiveCategory] = useState(
    initialCategory && initialCategory !== 'all' ? initialCategory.toLowerCase() : 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);

  // Sync if prop changes externally
  React.useEffect(() => {
    if (initialCategory && initialCategory !== 'all') {
      setActiveCategory(initialCategory.toLowerCase());
    }
  }, [initialCategory]);

  // Filter & Sort merchandise
  const filteredMerch = useMemo(() => {
    let list = [...MERCHANDISE_DATA];

    if (activeCategory !== 'all') {
      list = list.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [activeCategory, searchQuery, sortBy]);

  const cartSummary = calculateCartSummary(cartItems, activeCoupon);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const code = couponInput.trim().toUpperCase();
    setActiveCoupon(code);
    onShowToast?.(`Coupon "${code}" applied!`);
  };

  const handleOpenProduct = (product) => {
    setSelectedProductModal(product);
    setSelectedSize(product.sizes?.[0] || 'Standard');
  };

  const handleQuickAddToCart = (item) => {
    onAddToCart({ ...item, selectedVariant: item.sizes?.[0] || 'Standard' });
    setRecentlyAddedId(item.id);
    setTimeout(() => setRecentlyAddedId(null), 1800);
    onShowToast?.(`Added "${item.name}" to cart!`);
  };

  const handleSimulatedCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutModalOpen(true);
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  const handleConfirmMockOrder = () => {
    onClearCart();
    setCheckoutModalOpen(false);
    onCloseCart();
    onShowToast?.('🎉 Mock order processed successfully! Thank you for exploring the FandomVerse store.');
  };

  // If this instance is mounted strictly for the cart drawer
  if (drawerOnly) {
    return (
      <>
        {renderCartDrawer()}
        {renderCheckoutModal()}
      </>
    );
  }

  function renderCartDrawer() {
    if (!cartDrawerOpen) return null;
    return (
      <div className="cart-drawer-overlay" onClick={onCloseCart}>
        <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()} style={{ background: 'linear-gradient(180deg, #180603 0%, #0e0302 100%)', color: '#ffffff', borderLeft: '1px solid rgba(255, 77, 45, 0.3)' }}>
          {/* Drawer Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 77, 45, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255, 77, 45, 0.15)', border: '1px solid rgba(255, 77, 45, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4d2d' }}>
                <ShoppingBag size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-cyber)', color: '#ffffff', margin: 0, fontWeight: 800 }}>
                  TEMPORARY CART ({cartSummary.itemCount})
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>FandomVerse Simulation Basket</span>
              </div>
            </div>
            <button 
              onClick={onCloseCart} 
              style={{ background: 'rgba(36, 14, 10, 0.85)', border: '1px solid rgba(255, 77, 45, 0.3)', color: '#ffffff', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              title="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Items List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(255, 77, 45, 0.12)', border: '1px solid rgba(255, 77, 45, 0.3)', margin: '0 auto 1.25rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4d2d' }}>
                  <ShoppingBag size={32} />
                </div>
                <p style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 700, margin: '0 0 0.35rem 0' }}>Your temporary cart is empty</p>
                <p style={{ fontSize: '0.85rem', margin: 0, color: 'rgba(255, 255, 255, 0.65)' }}>Browse our official multiverse collectibles and add items!</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item-row" style={{ borderBottom: '1px solid rgba(255, 77, 45, 0.15)', padding: '0.85rem 0', display: 'flex', gap: '0.85rem' }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '68px', height: '68px', borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(255, 77, 45, 0.3)', flexShrink: 0 }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: 700, margin: 0 }} className="line-clamp-1">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => onRemoveFromCart(item.id)}
                        style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer', padding: '2px', transition: 'color 0.2s' }}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#ff4d2d', fontWeight: 800, fontFamily: 'var(--font-cyber)' }}>
                        ${item.price.toFixed(2)}
                      </span>
                      {item.selectedVariant && (
                        <span style={{ fontSize: '0.72rem', background: 'rgba(255, 77, 45, 0.15)', border: '1px solid rgba(255, 77, 45, 0.25)', color: '#ff7a00', padding: '1px 6px', borderRadius: '4px' }}>
                          {item.selectedVariant}
                        </span>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(26, 9, 6, 0.85)', padding: '2px 4px', borderRadius: '6px', border: '1px solid rgba(255, 77, 45, 0.25)' }}>
                        <button onClick={() => onUpdateCartQty(item.id, (item.quantity || 1) - 1)} className="cart-qty-btn" style={{ background: 'rgba(36, 14, 10, 0.9)', border: '1px solid rgba(255, 77, 45, 0.3)', borderRadius: '4px', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ffffff' }}>
                          <Minus size={11} />
                        </button>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0 0.4rem', color: '#ffffff' }}>
                          {item.quantity || 1}
                        </span>
                        <button onClick={() => onUpdateCartQty(item.id, (item.quantity || 1) + 1)} className="cart-qty-btn" style={{ background: 'rgba(36, 14, 10, 0.9)', border: '1px solid rgba(255, 77, 45, 0.3)', borderRadius: '4px', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ffffff' }}>
                          <Plus size={11} />
                        </button>
                      </div>

                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-cyber)' }}>
                        ${((item.price) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon Application Bar */}
          {cartItems.length > 0 && (
            <div style={{ padding: '0.85rem 0', borderTop: '1px solid rgba(255, 77, 45, 0.2)' }}>
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <input
                  type="text"
                  placeholder="Coupon: FANDOM10, CYBER20, ANIMEEXPO"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem 0.75rem', background: 'rgba(20, 7, 5, 0.85)', border: '1px solid rgba(255, 77, 45, 0.3)', borderRadius: '8px', color: '#ffffff', fontSize: '0.8rem', outline: 'none' }}
                />
                <button 
                  type="submit" 
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(255, 77, 45, 0.4)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  Apply
                </button>
              </form>
              {cartSummary.appliedCoupon && (
                <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                  <Check size={13} /> {cartSummary.appliedCoupon.label} (-${cartSummary.discountAmount.toFixed(2)})
                </span>
              )}
              {cartSummary.couponError && (
                <span style={{ fontSize: '0.75rem', color: '#f43f5e', display: 'block', fontWeight: 600 }}>
                  ✗ {cartSummary.couponError}
                </span>
              )}
            </div>
          )}

          {/* Price Calculations Summary */}
          {cartItems.length > 0 && (
            <div style={{ padding: '0.85rem 0 0 0', borderTop: '1px solid rgba(255, 77, 45, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.7)' }}>
                <span>Subtotal:</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>${cartSummary.subtotal.toFixed(2)}</span>
              </div>
              {cartSummary.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                  <span>Discount:</span>
                  <span>-${cartSummary.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.7)' }}>
                <span>Shipping ({cartSummary.shippingFee === 0 ? 'Free over $75' : 'Standard'}):</span>
                <span style={{ color: cartSummary.shippingFee === 0 ? '#10b981' : '#ffffff', fontWeight: 700 }}>
                  {cartSummary.shippingFee === 0 ? 'FREE' : `$${cartSummary.shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.7)' }}>
                <span>Estimated Tax (8%):</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>${cartSummary.tax.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.65rem', borderTop: '1px dashed rgba(255, 77, 45, 0.3)' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-cyber)' }}>
                  ESTIMATED TOTAL:
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ff4d2d', fontFamily: 'var(--font-cyber)' }}>
                  ${cartSummary.finalTotal.toFixed(2)}
                </span>
              </div>

              <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.85)', background: 'rgba(36, 14, 10, 0.75)', border: '1px solid rgba(255, 77, 45, 0.3)', padding: '4px 8px', borderRadius: '6px', textAlign: 'center', marginTop: '0.35rem' }}>
                * Interactive showcase simulation. No real credit card or backend charge is executed.
              </span>

              <button
                onClick={handleSimulatedCheckout}
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-cyber)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)',
                  border: 'none',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                  boxShadow: '0 4px 18px rgba(255, 77, 45, 0.45)',
                  transition: 'all 0.25s ease'
                }}
              >
                <CreditCard size={17} /> Proceed to Mock Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderCheckoutModal() {
    if (!checkoutModalOpen) return null;
    return (
      <div className="modal-overlay" onClick={() => setCheckoutModalOpen(false)}>
        <div className="modal-content-box" style={{ maxWidth: '520px', textAlign: 'center', background: 'linear-gradient(180deg, #1c0804 0%, #120402 100%)', color: '#ffffff', borderRadius: '20px', padding: '2.5rem 2rem', border: '1px solid rgba(255, 77, 45, 0.35)', boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 30px rgba(255, 77, 45, 0.2)' }} onClick={(e) => e.stopPropagation()}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255, 77, 45, 0.15)', border: '1px solid rgba(255, 77, 45, 0.3)', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4d2d' }}>
            <Sparkles size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-cyber)', color: '#ffffff', marginBottom: '0.4rem', fontWeight: 800 }}>
            SIMULATED CHECKOUT COMPLETE
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Your test order for <strong style={{ color: '#ffffff' }}>{cartSummary.itemCount} items</strong> totalling <strong style={{ color: '#ff4d2d' }}>${cartSummary.finalTotal.toFixed(2)}</strong> has been generated in the Multiverse simulator!
          </p>

          <div style={{ background: 'rgba(26, 9, 6, 0.85)', padding: '1rem', borderRadius: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem', border: '1px solid rgba(255, 77, 45, 0.25)' }}>
            <p style={{ margin: '0 0 0.35rem 0' }}><strong>Order Ref:</strong> FV-2026-{(Math.random()*1000000).toFixed(0)}</p>
            <p style={{ margin: '0 0 0.35rem 0' }}><strong>Status:</strong> Warp Express Dispatch (Simulation)</p>
            <p style={{ margin: '0 0 0.35rem 0' }}><strong>Items:</strong> {cartItems.map(i => `${i.name} (x${i.quantity || 1})`).join(', ')}</p>
            {cartSummary.appliedCoupon && (
              <p style={{ margin: '0.35rem 0 0 0', color: '#10b981', fontWeight: 600 }}>
                <strong>Discount Applied:</strong> {cartSummary.appliedCoupon.label} (-${cartSummary.discountAmount.toFixed(2)})
              </p>
            )}
          </div>

          <button
            onClick={handleConfirmMockOrder}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: 'var(--font-cyber)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)',
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
              boxShadow: '0 4px 18px rgba(255, 77, 45, 0.45)',
              transition: 'all 0.25s'
            }}
          >
            Clear Cart & Return to Multiverse
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="container-custom" style={{ paddingBottom: '4.5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="fv-section__tag">
          OFFICIAL FAN COLLECTIBLES & WEARABLES
        </span>
        <h2 className="fv-section__title">
          MULTIVERSE <span className="fv-grad">MERCHANDISE STORE</span>
        </h2>
        <p className="fv-section__desc" style={{ maxWidth: '740px', margin: '0.6rem auto 0 auto' }}>
          Discover authentic anime oversized streetwear, 1/7 scale resin master statues, concert lightsticks, limited manga sets, and cyberpunk collectibles.
        </p>

        {/* Disclaimer Banner in Soft Dark Reddish Amber */}
        <div style={{ maxWidth: '840px', margin: '1.25rem auto 0 auto', padding: '0.85rem 1.25rem', background: 'rgba(32, 12, 8, 0.8)', border: '1px solid rgba(255, 77, 45, 0.35)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255, 77, 45, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#ff4d2d' }}>
            <ShieldAlert size={19} />
          </div>
          <span style={{ fontSize: '0.88rem', color: '#ffffff', lineHeight: 1.5, textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)' }}>
            <strong style={{ color: '#ff4d2d' }}>Interactive Showcase Notice:</strong> This merchandise catalog includes full temporary shopping cart capabilities, quantity management, live coupon calculations, and checkout simulation. No financial payment backend is connected.
          </span>
        </div>
      </div>

      {/* Store Navigation Bar: Category Pills + Search + Sort in ONE SINGLE LINE */}
      <div className="filter-sort-bar">
        {/* 1. Category Filter Pills (Left) */}
        <div className="fv-toolbar-filter-side">
          <div className="filter-btn-group" style={{ margin: 0 }}>
            {STORE_CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              const count = cat.id === 'all' 
                ? MERCHANDISE_DATA.length 
                : MERCHANDISE_DATA.filter(m => m.category.toLowerCase() === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`filter-btn ${isActive ? 'active' : ''}`}
                  style={{ gap: '0.35rem' }}
                >
                  <i className={`fa-solid ${cat.icon}`} style={{ fontSize: '0.75rem', color: isActive ? '#ffffff' : '#ff4d2d' }}></i>
                  <span>{cat.label}</span>
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '1px 5px',
                    borderRadius: '999px',
                    background: isActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 77, 45, 0.15)',
                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 700
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Merch Live Search Bar (Center) */}
        <div className="fv-toolbar-search-wrap">
          <Search size={15} className="fv-toolbar-search-icon" />
          <input
            type="text"
            placeholder="Search merch, series..."
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
          <ThemeSelect
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            icon={<SlidersHorizontal size={14} color="#ff4d2d" />}
            options={[
              { value: 'featured', label: 'Featured Picks' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'rating', label: 'Top Rated (★ 5.0)' },
              { value: 'reviews', label: 'Most Reviewed' }
            ]}
            minWidth="180px"
          />
        </div>
      </div>

        {/* Catalog Result Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 77, 45, 0.15)', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)' }}>
          <span>
            Showing <strong style={{ color: '#ffffff' }}>{filteredMerch.length}</strong> collectible items
            {activeCategory !== 'all' && <span> in <strong style={{ color: '#ff4d2d' }}>{activeCategory.toUpperCase()}</strong></span>}
            {searchQuery && <span> matching "<strong style={{ color: '#ffffff' }}>{searchQuery}</strong>"</span>}
          </span>
          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
            <Sparkles size={13} /> Free shipping on orders over $75
          </span>
        </div>

      {/* Merch Cards Grid */}
      {filteredMerch.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'linear-gradient(180deg, rgba(26, 9, 6, 0.85) 0%, rgba(14, 4, 3, 0.95) 100%)', borderRadius: '16px', border: '1px solid rgba(255, 77, 45, 0.25)' }}>
          <ShoppingBag size={48} style={{ color: 'rgba(255, 77, 45, 0.4)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 800, margin: '0 0 0.5rem 0' }}>No matching items found</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Try clearing your search query or switching category filters.</p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(255, 77, 45, 0.45)'
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="content-grid-3">
          {filteredMerch.map((item) => {
            const isBookmarked = isItemBookmarked(item.id);
            const isJustAdded = recentlyAddedId === item.id;
            const discountPercent = item.originalPrice 
              ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) 
              : 0;

            return (
              <div 
                key={item.id} 
                className="content-card"
                style={{
                  background: 'linear-gradient(180deg, rgba(26, 9, 6, 0.85) 0%, rgba(14, 4, 3, 0.95) 100%)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 77, 45, 0.22)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                }}
              >
                {/* Product Image Wrap */}
                <div 
                  className="content-card-image-wrap" 
                  onClick={() => handleOpenProduct(item)} 
                  style={{ cursor: 'pointer', height: '240px', position: 'relative', overflow: 'hidden', background: '#120400' }}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="content-card-img" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                  
                  {/* Badge */}
                  {item.badge && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        background: 'linear-gradient(135deg, #ff4d2d 0%, #ea580c 100%)',
                        color: '#ffffff',
                        boxShadow: '0 4px 14px rgba(255, 77, 45, 0.45)'
                      }}>
                        <Flame size={12} /> {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Discount percentage tag */}
                  {discountPercent > 0 && (
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 2, background: 'rgba(239, 68, 68, 0.95)', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                      -{discountPercent}% OFF
                    </div>
                  )}

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onBookmarkToggle(item); }}
                    className={`content-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                    title="Save to Multiverse Vault"
                    style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}
                  >
                    <Bookmark size={15} fill={isBookmarked ? '#ffffff' : 'none'} />
                  </button>

                  {/* Quick View Overlay Hover hint */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(18, 4, 2, 0.45)',
                    backdropFilter: 'blur(3px)',
                    opacity: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.25s',
                    zIndex: 1
                  }}
                  className="quick-view-overlay"
                  >
                    <span style={{ background: 'rgba(20, 7, 5, 0.92)', color: '#ffffff', border: '1px solid rgba(255, 77, 45, 0.4)', padding: '0.45rem 0.95rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', boxShadow: '0 4px 15px rgba(0,0,0,0.4)' }}>
                      <Eye size={14} /> Quick View
                    </span>
                  </div>
                </div>

                {/* Product Body */}
                <div className="content-card-body" style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.45rem' }}>
                    <span style={{ color: '#ff7a00', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {item.category} • {item.type}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontWeight: 700 }}>
                      <Star size={12} fill="#f59e0b" color="#f59e0b" /> {item.rating} ({item.reviewsCount})
                    </span>
                  </div>

                  <h3 
                    className="content-card-title line-clamp-1" 
                    onClick={() => handleOpenProduct(item)}
                    style={{ cursor: 'pointer', fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.45rem 0', lineHeight: 1.4 }}
                    title={item.name}
                  >
                    {item.name}
                  </h3>

                  <p className="content-card-desc line-clamp-2" style={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.5, margin: '0 0 1rem 0', flex: 1 }}>
                    {item.description}
                  </p>

                  {/* Price & Add to Cart Action */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 77, 45, 0.15)' }}>
                    <div>
                      <span style={{ fontSize: '1.3rem', fontFamily: 'var(--font-cyber)', fontWeight: 900, color: '#ff4d2d' }}>
                        ${item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)', textDecoration: 'line-through', marginLeft: '0.5rem', fontWeight: 600 }}>
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => handleQuickAddToCart(item)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.55rem 1.05rem',
                        fontFamily: 'var(--font-cyber)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        color: '#ffffff',
                        background: isJustAdded 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                          : 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)',
                        border: 'none',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                        boxShadow: isJustAdded 
                          ? '0 4px 14px rgba(16, 185, 129, 0.4)' 
                          : '0 4px 16px rgba(255, 77, 45, 0.45)'
                      }}
                      title="Add to temporary shopping cart"
                    >
                      {isJustAdded ? (
                        <>
                          <Check size={14} /> Added!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductModal && (
        <div className="modal-overlay" onClick={() => setSelectedProductModal(null)}>
          <div 
            className="modal-content-box" 
            style={{ 
              maxWidth: '820px', 
              background: 'linear-gradient(180deg, #1c0804 0%, #120402 100%)', 
              borderRadius: '20px', 
              padding: '2rem', 
              border: '1.5px solid rgba(255, 77, 45, 0.35)', 
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 30px rgba(255, 77, 45, 0.15)',
              position: 'relative',
              color: '#ffffff'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close-btn" 
              onClick={() => setSelectedProductModal(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(36, 14, 10, 0.85)', border: '1px solid rgba(255, 77, 45, 0.3)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
              {/* Modal Image Box */}
              <div style={{ width: '300px', height: '320px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 77, 45, 0.25)', background: '#120400', flexShrink: 0 }}>
                <img 
                  src={selectedProductModal.image} 
                  alt={selectedProductModal.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Modal Information Body */}
              <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#ff7a00', background: 'rgba(255, 77, 45, 0.15)', padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(255, 77, 45, 0.3)' }}>
                    {selectedProductModal.category} • {selectedProductModal.type}
                  </span>
                  {selectedProductModal.badge && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', background: 'linear-gradient(135deg, #ff4d2d 0%, #ea580c 100%)', padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(255, 77, 45, 0.4)' }}>
                      {selectedProductModal.badge}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.45rem', fontFamily: 'var(--font-cyber)', color: '#ffffff', marginBottom: '0.6rem', fontWeight: 800, lineHeight: 1.3 }}>
                  {selectedProductModal.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.75rem', fontFamily: 'var(--font-cyber)', fontWeight: 900, color: '#ff4d2d' }}>
                      ${selectedProductModal.price.toFixed(2)}
                    </span>
                    {selectedProductModal.originalPrice && (
                      <span style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.4)', textDecoration: 'line-through', fontWeight: 600 }}>
                        ${selectedProductModal.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(36, 14, 10, 0.8)', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(255, 77, 45, 0.25)' }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" /> {selectedProductModal.rating} ({selectedProductModal.reviewsCount} Fan Reviews)
                  </div>
                </div>

                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {selectedProductModal.description}
                </p>

                {/* Size / Variant Options */}
                {selectedProductModal.sizes && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.5rem' }}>
                      Select Size / Edition:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {selectedProductModal.sizes.map((s, idx) => {
                        const isChosen = selectedSize === s;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedSize(s)}
                            style={{
                              padding: '0.4rem 0.85rem',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: isChosen ? 700 : 500,
                              border: isChosen ? '2px solid #ff4d2d' : '1px solid rgba(255, 77, 45, 0.25)',
                              background: isChosen ? 'rgba(255, 77, 45, 0.25)' : 'rgba(26, 9, 6, 0.8)',
                              color: isChosen ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                              transition: 'all 0.2s'
                            }}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Bullet Specifications */}
                {selectedProductModal.details && (
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    {selectedProductModal.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                )}

                {/* Add To Cart CTA Button */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      onAddToCart({ ...selectedProductModal, selectedVariant: selectedSize });
                      setSelectedProductModal(null);
                      onShowToast?.(`Added to cart: ${selectedProductModal.name} (${selectedSize})`);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.8rem 1.5rem',
                      fontFamily: 'var(--font-cyber)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: '#ffffff',
                      background: 'linear-gradient(135deg, #ff4d2d 0%, #f97316 100%)',
                      border: 'none',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                      boxShadow: '0 4px 18px rgba(255, 77, 45, 0.45)',
                      transition: 'all 0.25s'
                    }}
                  >
                    <ShoppingBag size={17} /> Add to Temporary Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {renderCartDrawer()}

      {/* Checkout Modal */}
      {renderCheckoutModal()}
    </section>
  );
}

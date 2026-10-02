import React, { useState } from 'react';
import { CATEGORIES_DATA } from '../js/data/categoriesData';
import { Sparkles, Send } from 'lucide-react';

export default function Footer({ onNavigateTab, onSelectCategory, onShowToast }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      onShowToast?.('⚠️ Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    onShowToast?.(`✨ Welcome to the Multiverse Dispatch, ${email}!`);
    setEmail('');
  };

  const portals = [
    { id: 'articles',   label: 'Articles & Lore' },
    { id: 'media',      label: 'Trailers & OSTs' },
    { id: 'characters', label: 'Character Hub' },
    { id: 'events',     label: 'Events & Expos' },
    { id: 'store',      label: 'Merch Collection' },
    { id: 'bookmarks',  label: 'Saved Vault' },
  ];

  return (
    <footer className="fv-footer">
      <div className="container-custom">
        {/* Top Newsletter & Multiverse Dispatch Card */}
        <div className="fv-footer__dispatch">
          <div className="fv-footer__dispatch-text">
            <span className="fv-section__tag" style={{ border: '1px solid rgba(255, 77, 45, 0.4)', color: '#ff684a', background: 'rgba(255, 77, 45, 0.12)' }}>
              <Sparkles size={13} style={{ marginRight: 4 }} /> MULTIVERSE DISPATCH
            </span>
            <h3 className="fv-footer__dispatch-title">
              Stay Connected Across Every <span className="fv-grad">Fandom</span>
            </h3>
            <p className="fv-footer__dispatch-sub">
              Weekly trailer releases, character power rankings, convention tickets, and exclusive pop-culture drops delivered to your inbox.
            </p>
          </div>

          <form className="fv-footer__dispatch-form" onSubmit={handleSubscribe} autoComplete="off">
            <div className="fv-footer__input-wrap">
              <i className="fa-solid fa-envelope fv-footer__input-icon"></i>
              <input
                type="email"
                placeholder="e.g. abc_fan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="fv-footer__input"
                autoComplete="off"
                name="fv_footer_email_custom"
              />
            </div>
            <button type="submit" className="fv-btn-pastel fv-btn-pastel--primary">
              <span>{subscribed ? 'Subscribed!' : 'Join Dispatch'}</span>
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* Main Footer Multi-Column Grid */}
        <div className="fv-footer__grid">
          {/* Brand Info */}
          <div className="fv-footer__col fv-footer__col--brand">
            <div className="fv-nav__logo cursor-pointer" onClick={() => onNavigateTab('home')} style={{ marginBottom: '1.25rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }} title="FandomVerse Home">
              <img 
                src="/assets/img/fandomverse-logo.png" 
                alt="FandomVerse Logo" 
                style={{ 
                  height: '48px', 
                  width: 'auto', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 16px rgba(255, 77, 45, 0.6))'
                }}
              />
            </div>
            <p className="fv-footer__desc">
              The premier next-generation pop culture verse unifying Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga in a single responsive web experience.
            </p>

            <div className="fv-footer__socials">
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="fv-social-link" title="YouTube Trailers">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="fv-social-link" title="Discord Community">
                <i className="fa-brands fa-discord"></i>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="fv-social-link" title="X / Twitter Updates">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="https://reddit.com" target="_blank" rel="noreferrer" className="fv-social-link" title="Reddit Discussions">
                <i className="fa-brands fa-reddit-alien"></i>
              </a>
              <a href="https://twitch.tv" target="_blank" rel="noreferrer" className="fv-social-link" title="Twitch Live Streams">
                <i className="fa-brands fa-twitch"></i>
              </a>
            </div>
          </div>

          {/* 7 Dynamic Fandom Hubs */}
          <div className="fv-footer__col">
            <h4 className="fv-footer__heading">7 Fandom Hubs</h4>
            <ul className="fv-footer__links">
              {CATEGORIES_DATA.map((cat) => (
                <li key={cat.id}>
                  <button
                    className="fv-footer__link"
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onNavigateTab('categories');
                    }}
                  >
                    <span className="fv-footer__dot" style={{ background: cat.accentColor || '#8b5cf6' }}></span>
                    <span>{cat.name} Realm</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals & Interactive Hubs */}
          <div className="fv-footer__col">
            <h4 className="fv-footer__heading">Portal Matrix</h4>
            <ul className="fv-footer__links">
              {portals.map((p) => (
                <li key={p.id}>
                  <button className="fv-footer__link" onClick={() => onNavigateTab(p.id)}>
                    <span>{p.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Spec & Quick Links */}
          <div className="fv-footer__col">
            <h4 className="fv-footer__heading">Multiverse Hub</h4>
            <div className="fv-footer__stats-box">
              <div className="fv-footer__stat">
                <span className="fv-footer__stat-num">7</span>
                <span className="fv-footer__stat-lbl">Active Realms</span>
              </div>
              <div className="fv-footer__stat">
                <span className="fv-footer__stat-num">35+</span>
                <span className="fv-footer__stat-lbl">Hero Dossiers</span>
              </div>
              <div className="fv-footer__stat">
                <span className="fv-footer__stat-num">100%</span>
                <span className="fv-footer__stat-lbl">Client-Side SPA</span>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button className="fv-footer__link" onClick={() => onNavigateTab('about')}>
                <i className="fa-solid fa-circle-info" style={{ color: '#ff684a' }}></i>
                <span>About FanVerse</span>
              </button>
              <button className="fv-footer__link" onClick={() => onNavigateTab('contact')}>
                <i className="fa-solid fa-paper-plane" style={{ color: '#ff4d2d' }}></i>
                <span>Contact & Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React, { useState } from 'react';
import { 
  User, Lock, Mail, Sparkles, X, Check, 
  Shield, CheckCircle2, Heart 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ThemeSelect from './ThemeSelect';
import { getRegisteredUsers, saveRegisteredUser } from '../js/utils/storage';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser
}) {
  const [tab, setTab] = useState('login'); // 'login' or 'signup'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [favoriteUniverse, setFavoriteUniverse] = useState('anime');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim()) {
      setErrorMsg('Please enter a valid username/handle.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    // ── Registration (Sign Up / Create Account) Flow ──
    if (tab === 'signup') {
      if (!email.trim()) {
        setErrorMsg('Please enter an email address.');
        return;
      }

      const newUser = {
        username: username.trim(),
        email: email.trim(),
        password: password,
        favoriteUniverse,
        joinedAt: new Date().toISOString()
      };

      saveRegisteredUser(newUser);

      // DO NOT log in directly and DO NOT redirect to home page yet.
      // Switch user to Sign In tab, ask user for login credentials, and show success message.
      setTab('login');
      setPassword(''); // Require user to enter password to log in
      setSuccessMsg(`🎉 Account created for "${username.trim()}"! Please sign in with your password to enter the Verse.`);
      return;
    }

    // ── Sign In (Log In) Flow ──
    const registeredUsers = getRegisteredUsers();
    const existingUser = registeredUsers.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    // Verify password if account exists in registry
    if (existingUser && existingUser.password && existingUser.password !== password) {
      setErrorMsg('Incorrect password. Please enter the correct password for this account.');
      return;
    }

    const userData = existingUser || {
      username: username.trim(),
      email: email.trim() || `${username.trim().toLowerCase()}@fandomverse.io`,
      favoriteUniverse,
      joinedAt: new Date().toISOString()
    };

    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.6 }
    });

    onLoginSuccess(userData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-box" 
        style={{ 
          maxWidth: '460px', 
          background: 'linear-gradient(135deg, rgba(22, 8, 5, 0.98) 0%, rgba(14, 4, 2, 0.99) 100%)',
          border: '1px solid rgba(255, 77, 45, 0.35)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 77, 45, 0.2)'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Header with Clean Default Profile Icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          {/* Default Profile Icon Holder (No Image) */}
          <div 
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(255, 77, 45, 0.12)',
              border: '1.5px solid rgba(255, 77, 45, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto',
              boxShadow: '0 0 20px rgba(255, 77, 45, 0.25)'
            }}
          >
            <User size={26} color="#ff4d2d" />
          </div>

          <span className="badge-neon" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>
            UI-Only Authentication Form
          </span>
          <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-cyber)', color: '#fff', margin: '0.2rem 0' }}>
            {tab === 'login' ? 'PORTAL SIGN IN' : 'JOIN THE FANDOM'}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--neon-amber)', margin: '0.2rem 0 0 0' }}>
            * Dummy login simulation — no credentials sent to any server.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`filter-btn ${tab === 'login' ? 'active' : ''}`}
            style={{ flex: 1 }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`filter-btn ${tab === 'signup' ? 'active' : ''}`}
            style={{ flex: 1 }}
          >
            Create Account
          </button>
        </div>

        {/* Success Banner when Account Created */}
        {successMsg && (
          <div 
            style={{ 
              padding: '0.65rem 0.85rem', 
              background: 'rgba(34, 197, 94, 0.15)', 
              border: '1px solid #22c55e', 
              borderRadius: '10px', 
              color: '#86efac', 
              fontSize: '0.82rem', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              lineHeight: 1.4
            }}
          >
            <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div 
            style={{ 
              padding: '0.55rem 0.85rem', 
              background: 'rgba(239, 68, 68, 0.2)', 
              border: '1px solid #ef4444', 
              borderRadius: '10px', 
              color: '#fca5a5', 
              fontSize: '0.8rem', 
              marginBottom: '1rem' 
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Fandom Handle / Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="e.g. ShadowHunterX"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="sort-select"
                style={{ width: '100%', paddingLeft: '2.2rem' }}
                autoComplete="off"
                name="fv_auth_user_custom"
              />
            </div>
          </div>

          {tab === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder="e.g. abc_xxx@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="sort-select"
                  style={{ width: '100%', paddingLeft: '2.2rem' }}
                  autoComplete="off"
                  name="fv_auth_email_custom"
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sort-select"
                style={{ width: '100%', paddingLeft: '2.2rem' }}
                autoComplete="new-password"
                name="fv_auth_pass_custom"
              />
            </div>
          </div>

          {tab === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>
                Primary Verse Interest
              </label>
              <ThemeSelect
                value={favoriteUniverse}
                onChange={(val) => setFavoriteUniverse(val)}
                options={[
                  { value: 'anime', label: 'Anime (Demon Slayer, JJK, Solo Leveling)' },
                  { value: 'gaming', label: 'Gaming (Genshin, Cyberpunk, Elden Ring)' },
                  { value: 'movies', label: 'Movies (Spider-Verse, Dune, Marvel)' },
                  { value: 'tv-shows', label: 'TV Shows (Arcane, Stranger Things)' },
                  { value: 'k-pop', label: 'K-Pop (BTS, BLACKPINK, Stray Kids)' },
                  { value: 'comics', label: 'Comics (Batman, Spider-Man, Sandman)' },
                  { value: 'manga', label: 'Manga (Berserk, One Piece, Vagabond)' }
                ]}
                width="100%"
                minWidth="100%"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn-cyber-primary" 
            style={{ 
              width: '100%', 
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Sparkles size={16} /> 
            <span>{tab === 'login' ? 'Simulate Sign In' : 'Complete Registration'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

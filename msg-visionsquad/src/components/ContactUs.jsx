import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  Clock, Globe, Compass, CheckCircle2, AlertCircle, Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ThemeSelect from './ThemeSelect';

export default function ContactUs({ onShowToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ submitted: false, error: '' });
  const [activeStudio, setActiveStudio] = useState('tokyo');

  const studios = {
    tokyo: {
      city: 'Tokyo, Japan',
      address: 'Akihabara Cyber Tower 12F, Chiyoda-ku, Tokyo 101-0021',
      coords: '35.6983° N, 139.7731° E',
      timezone: 'JST (UTC+9)',
      mapQuery: 'Akihabara, Tokyo, Japan'
    },
    la: {
      city: 'Los Angeles, USA',
      address: '777 Multiverse Blvd, Suite 400, Los Angeles, CA 90015',
      coords: '34.0407° N, 118.2468° W',
      timezone: 'PST (UTC-8)',
      mapQuery: 'Los Angeles Convention Center, CA'
    },
    seoul: {
      city: 'Seoul, South Korea',
      address: 'Gangnam K-Creative Center 8F, Gangnam-daero, Seoul 06241',
      coords: '37.4979° N, 127.0276° E',
      timezone: 'KST (UTC+9)',
      mapQuery: 'Gangnam Station, Seoul'
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ submitted: false, error: 'Please fill out all required fields.' });
      return;
    }

    // Client-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ submitted: false, error: 'Please enter a valid email address.' });
      return;
    }

    setStatus({ submitted: true, error: '' });
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    onShowToast?.('📬 Transmission sent! The FandomVerse team will respond shortly.');
  };

  return (
    <section className="container-custom" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="fv-section__tag">SIGNAL TRANSMITTER</span>
        <h2 className="fv-section__title">
          CONTACT THE <span className="fv-grad">FANDOMVERSE ARCHIVES</span>
        </h2>
        <p className="fv-section__desc" style={{ maxWidth: '740px', margin: '0.6rem auto 0 auto' }}>
          Have questions regarding upcoming fandom events, merchandise inquiries, article submissions, or platform feedback? Reach out to our global team.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Contact Form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Mail size={20} color="var(--neon-cyan)" />
            <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-cyber)', color: '#fff' }}>
              TRANSMIT A QUERY
            </h3>
          </div>

          {status.submitted ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <CheckCircle2 size={54} color="var(--neon-emerald)" className="animate-float" style={{ margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>Message Received!</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Thank you, <strong>{formData.name}</strong>. Our communications operative has logged your inquiry regarding <em>{formData.category}</em>.
              </p>
              <button 
                onClick={() => { setStatus({ submitted: false, error: '' }); setFormData({ name: '', email: '', category: 'General Inquiry', subject: '', message: '' }); }}
                className="btn-cyber-outline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {status.error && (
                <div style={{ padding: '0.65rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: 'var(--radius-md)', color: '#fca5a5', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} />
                  <span>{status.error}</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Kenji Ackerman"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="sort-select"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. abc_user@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="sort-select"
                  style={{ width: '100%' }}
                  autoComplete="off"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Fandom Department
                </label>
                <ThemeSelect
                  value={formData.category}
                  onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                  options={[
                    'General Inquiry',
                    'Editorial & Lore Submissions',
                    'Convention & Events Team',
                    'Merchandise & Collectibles',
                    'Bug Report / UI Feedback'
                  ]}
                  width="100%"
                  minWidth="100%"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Message Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Summary of your inquiry..."
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="sort-select"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Detailed Message *
                </label>
                <textarea
                  rows={4}
                  name="message"
                  placeholder="Write your transmission here..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="note-input-field"
                  style={{ width: '100%', height: '110px' }}
                />
              </div>

              <button type="submit" className="btn-cyber-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Send size={16} /> Transmit Query
              </button>
            </form>
          )}
        </div>

        {/* Global Hubs & Embedded Map */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={20} color="var(--neon-purple)" />
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-cyber)', color: '#fff' }}>
                GLOBAL STUDIOS & GPS
              </h3>
            </div>
          </div>

          {/* Studio Selector Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {Object.keys(studios).map((key) => (
              <button
                key={key}
                onClick={() => setActiveStudio(key)}
                className={`filter-btn ${activeStudio === key ? 'active' : ''}`}
                style={{ flex: 1, textTransform: 'capitalize', fontSize: '0.75rem' }}
              >
                {key} Studio
              </button>
            ))}
          </div>

          {/* Active Studio Information */}
          <div style={{ background: 'rgba(8, 10, 24, 0.75)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--neon-cyan)', marginBottom: '0.3rem' }}>
              {studios[activeStudio].city}
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
              {studios[activeStudio].address}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>📍 GPS: <strong style={{ color: 'var(--neon-pink)' }}>{studios[activeStudio].coords}</strong></span>
              <span>🕒 Timezone: <strong style={{ color: '#fff' }}>{studios[activeStudio].timezone}</strong></span>
            </div>
          </div>

          {/* Responsive Embedded Google Map */}
          <div style={{ flex: 1, minHeight: '260px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            <iframe
              title={`Google Map - ${studios[activeStudio].city}`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(studios[activeStudio].mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

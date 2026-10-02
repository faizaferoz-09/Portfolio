import React, { useState, useEffect } from 'react';
import { Clock, Users, ChevronRight, Compass, Sparkles } from 'lucide-react';
import { getFormattedClock, formatVisitorDigits } from '../js/utils/dateClock';
import { getVisitorCount, incrementVisitorCount } from '../js/utils/storage';

export default function VisitorClockBar({ activeTab, activeCategory, onNavigateTab, onSelectCategory }) {
  const [clockData, setClockData] = useState(getFormattedClock());
  const [visitorCount, setVisitorCount] = useState(getVisitorCount());

  // Increment visitor count on initial mount
  useEffect(() => {
    const updated = incrementVisitorCount();
    setVisitorCount(updated);
  }, []);

  // Update real-time digital clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setClockData(getFormattedClock());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const digits = formatVisitorDigits(visitorCount);

  return (
    <div className="container-custom" style={{ marginTop: '1.25rem' }}>
      <div className="live-visitor-bar">
        {/* Real-time Visitor Counter */}
        <div className="visitor-ticker">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
            <Users size={18} color="var(--neon-cyan)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Multiverse Visitors:
            </span>
          </div>
          <div className="visitor-digits" title="Simulated Live Visitors (LocalStorage)">
            {digits.map((digit, idx) => (
              <span key={idx} className="digit-box">{digit}</span>
            ))}
          </div>
        </div>

        {/* Breadcrumb Navigation Bar */}
        <div className="breadcrumb-bar" style={{ margin: 0 }}>
          <Compass size={16} color="var(--neon-purple)" />
          <button 
            onClick={() => onNavigateTab('home')} 
            className="breadcrumb-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            FandomVerse
          </button>
          <ChevronRight size={14} color="var(--text-muted)" />
          <span 
            className={activeCategory ? "breadcrumb-link" : "breadcrumb-current"}
            onClick={() => { if (activeCategory) onNavigateTab(activeTab); }}
            style={{ textTransform: 'capitalize', cursor: activeCategory ? 'pointer' : 'default' }}
          >
            {activeTab}
          </span>
          {activeCategory && (
            <>
              <ChevronRight size={14} color="var(--text-muted)" />
              <span className="breadcrumb-current" style={{ textTransform: 'capitalize' }}>
                {activeCategory} Hub
              </span>
            </>
          )}
        </div>

        {/* Real-Time Live Clock Widget */}
        <div className="clock-display" title="Live System Time">
          <Clock size={18} color="var(--neon-pink)" className="animate-pulse" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {clockData.dateString}
          </span>
          <span className="clock-badge font-cyber">
            {clockData.hours}:{clockData.minutes}:{clockData.seconds} {clockData.ampm}
          </span>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * ThemeSelect - Luxury Cyberpunk / Dark Fandom Themed Custom Dropdown
 * 
 * Replaces ugly native OS select boxes with a fully styled, glassmorphic,
 * animated dropdown that perfectly matches the FandomVerse dark theme.
 */
export default function ThemeSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  icon = null,
  minWidth = '220px',
  width = 'auto',
  style = {},
  buttonStyle = {},
  menuStyle = {},
  className = '',
  align = 'left',
  id = undefined
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Normalize options to { value, label } objects
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value !== undefined ? opt.value : opt.label,
        label: opt.label !== undefined ? opt.label : String(opt.value),
        badge: opt.badge,
        icon: opt.icon
      };
    }
    return { value: opt, label: String(opt) };
  });

  // Find currently selected option
  const selectedOption = normalizedOptions.find(opt => opt.value === value) || null;
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation & accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        const idx = normalizedOptions.findIndex(opt => opt.value === value);
        setFocusedIndex(idx >= 0 ? idx : 0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev + 1) % normalizedOptions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev - 1 + normalizedOptions.length) % normalizedOptions.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < normalizedOptions.length) {
        handleSelect(normalizedOptions[focusedIndex].value);
      }
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  // Scroll focused item into view when navigating via keyboard
  useEffect(() => {
    if (isOpen && listRef.current && focusedIndex >= 0) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div 
      ref={containerRef}
      id={id}
      className={`fv-theme-select-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        minWidth: minWidth,
        width: width,
        userSelect: 'none',
        zIndex: isOpen ? 100 : 1,
        ...style
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          padding: '0.55rem 1rem',
          background: isOpen 
            ? 'linear-gradient(135deg, rgba(38, 14, 10, 0.95) 0%, rgba(22, 7, 4, 0.95) 100%)' 
            : 'linear-gradient(135deg, rgba(28, 10, 7, 0.85) 0%, rgba(16, 5, 3, 0.9) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isOpen 
            ? '1px solid #ff4d2d' 
            : '1px solid rgba(255, 77, 45, 0.32)',
          borderRadius: '12px',
          color: '#ffffff',
          fontSize: '0.85rem',
          fontWeight: 600,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isOpen 
            ? '0 0 0 3px rgba(255, 77, 45, 0.2), 0 8px 25px rgba(0, 0, 0, 0.6)' 
            : '0 4px 16px rgba(0, 0, 0, 0.35)',
          transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          ...buttonStyle
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = 'rgba(255, 77, 45, 0.6)';
            e.currentTarget.style.boxShadow = '0 0 16px rgba(255, 77, 45, 0.22), 0 6px 20px rgba(0,0,0,0.4)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = 'rgba(255, 77, 45, 0.32)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.35)';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {icon && <span style={{ display: 'inline-flex', flexShrink: 0, color: '#ff4d2d' }}>{icon}</span>}
          <span style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            color: selectedOption ? '#ffffff' : 'rgba(255, 255, 255, 0.6)' 
          }}>
            {displayLabel}
          </span>
        </div>

        <ChevronDown 
          size={16} 
          style={{
            flexShrink: 0,
            color: isOpen ? '#ff4d2d' : 'rgba(255, 255, 255, 0.7)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease'
          }} 
        />
      </button>

      {/* Floating Glassmorphic Dropdown Menu */}
      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            [align === 'right' ? 'right' : 'left']: 0,
            minWidth: '100%',
            width: 'max-content',
            maxWidth: '360px',
            maxHeight: '300px',
            overflowY: 'auto',
            background: 'rgba(18, 5, 2, 0.96)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 77, 45, 0.45)',
            borderRadius: '14px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 77, 45, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
            padding: '0.4rem',
            zIndex: 99999,
            animation: 'fvDropdownFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 77, 45, 0.5) rgba(255, 255, 255, 0.05)',
            ...menuStyle
          }}
        >
          {/* Subtle Top Accent Highlight Line */}
          <div 
            style={{
              position: 'sticky',
              top: '-0.4rem',
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #ff4d2d, transparent)',
              marginBottom: '0.35rem',
              zIndex: 2
            }}
          />

          {normalizedOptions.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isFocused = idx === focusedIndex;

            return (
              <div
                key={String(opt.value) + idx}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                onMouseEnter={() => setFocusedIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  background: isSelected 
                    ? 'linear-gradient(90deg, rgba(255, 77, 45, 0.25) 0%, rgba(255, 77, 45, 0.08) 100%)' 
                    : isFocused 
                      ? 'rgba(255, 77, 45, 0.12)' 
                      : 'transparent',
                  color: isSelected 
                    ? '#ffffff' 
                    : isFocused 
                      ? '#ff9f87' 
                      : 'rgba(255, 255, 255, 0.82)',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 700 : 500,
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  transition: 'background 0.15s ease, color 0.15s ease',
                  borderLeft: isSelected ? '3px solid #ff4d2d' : '3px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {opt.icon && <span style={{ flexShrink: 0 }}>{opt.icon}</span>}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {opt.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                  {opt.badge && (
                    <span 
                      style={{
                        fontSize: '0.7rem',
                        padding: '1px 6px',
                        borderRadius: '9999px',
                        background: 'rgba(255, 77, 45, 0.2)',
                        color: '#ff856b',
                        fontWeight: 600
                      }}
                    >
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && (
                    <Check size={14} color="#ff4d2d" strokeWidth={2.6} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

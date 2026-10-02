import { useEffect, useLayoutEffect } from 'react';

/**
 * ScrollToTop Component
 * Global route & page navigation scroll manager.
 * Guarantees that navigating to any page, portal, or fandom realm
 * (even from the bottom/footer of the previous page) immediately starts at the top (scrollY = 0).
 */
export default function ScrollToTop({ routeKey }) {
  // Disable automatic browser scroll restoration so page transitions always start at the top
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Synchronously reset scroll before paint of the new page
  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    resetScroll();

    // Secondary rAF / microtask pass to ensure heavy DOM re-renders or layout shifts
    // do not preserve previous scroll offset
    const rafId = requestAnimationFrame(() => {
      resetScroll();
    });

    return () => cancelAnimationFrame(rafId);
  }, [routeKey]);

  return null;
}

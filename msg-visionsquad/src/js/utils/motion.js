import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes cinematic scroll-based animations, kinetic typography, 
 * and staggered card entrances throughout the site.
 */
export function initCinematicAnimations(scopeElement = document) {
  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  const ctx = gsap.context(() => {
    // ── 1. Kinetic Typography on Section Headings & Tags (Universal) ──
    const sectionTags = scopeElement.querySelectorAll(
      '.fv-section__tag, .section-tag, .badge-neon:not(.content-card-badge .badge-neon)'
    );
    sectionTags.forEach((tag) => {
      gsap.fromTo(tag, 
        { opacity: 0, y: 16, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: tag,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    const sectionTitles = scopeElement.querySelectorAll(
      '.fv-section__title, .fv-choose__title, .page-header h1, .page-header h2, .section-header h2, h1.fv-section__title'
    );
    sectionTitles.forEach((title) => {
      // Avoid re-animating hero title which has its own kinetic system
      if (title.closest('.fv-hero-fluxora')) return;
      gsap.fromTo(title,
        { 
          opacity: 0, 
          y: 26
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    const sectionDescs = scopeElement.querySelectorAll(
      '.fv-section__desc, .section-header p, .page-header p, .fv-choose__desc'
    );
    sectionDescs.forEach((desc) => {
      if (desc.closest('.fv-hero-fluxora')) return;
      gsap.fromTo(desc,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: desc,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // ── 2. Staggered Fandom Cards Entrance ──
    const fandomGrids = scopeElement.querySelectorAll('.fv-fandoms-grid');
    fandomGrids.forEach((grid) => {
      const cards = grid.querySelectorAll('.fv-fandom-card');
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, y: 35, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.07,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // ── 3. Staggered Featured Universe Cards Entrance ──
    const universeGrids = scopeElement.querySelectorAll('.fv-universes-grid');
    universeGrids.forEach((grid) => {
      const cards = grid.querySelectorAll('.fv-universe-card');
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, y: 45, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 82%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // ── 4. Character Profile Cards Grid Stagger ──
    const charGrids = scopeElement.querySelectorAll('.fv-char-hub-grid');
    charGrids.forEach((grid) => {
      const cards = grid.querySelectorAll('.fv-char-card');
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, y: 24, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // ── 5. Staggered Content Grids (Articles, Merch, Categories, Events, Gallery, Bookmarks) ──
    const contentGrids = scopeElement.querySelectorAll(
      '.content-grid-3, .content-grid-4, .fv-choose-grid, .gallery-grid, .fv-gallery-grid'
    );
    contentGrids.forEach((grid) => {
      const items = grid.children;
      if (items.length > 0) {
        gsap.fromTo(items,
          { opacity: 0, y: 30, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 92%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // ── 6. Glass Panels Entrance (About Us, Contact Us, System Cards) ──
    const glassPanels = scopeElement.querySelectorAll('.glass-panel:not(.fv-hero-glass)');
    glassPanels.forEach((panel) => {
      gsap.fromTo(panel,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 92%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // ── 6. Subtle Parallax on Universe Card Image Backgrounds ──
    const universeImages = scopeElement.querySelectorAll('.fv-universe-card__img');
    universeImages.forEach((img) => {
      gsap.to(img, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    });

    // Refresh ScrollTrigger calculations
    ScrollTrigger.refresh();
  }, scopeElement);

  // Return teardown function for React useEffect
  return () => ctx.revert();
}

/**
 * Cinematic Page / Tab Transition Handler
 */
export function animatePageTransition(targetElement) {
  if (!targetElement) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.fromTo(targetElement,
    { opacity: 0, y: 16 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.35, 
      ease: 'power2.out',
      clearProps: 'transform'
    }
  );
}

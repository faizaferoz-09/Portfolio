import React from 'react';
import { 
  ShieldCheck, Cpu, Flame, Users, Sparkles, 
  Code2, Heart, Award, Rocket, CheckCircle2, Globe,
  User
} from 'lucide-react';

export default function AboutUs() {
  const teamMembers = [
    {
      name: 'Faiza',
      role: 'Lead System Architect & Frontend Engineer',
      icon: User,
      fandom: 'Demon Slayer & Berserk',
      bio: 'Lifelong anime enthusiast and lead frontend engineer passionate about responsive micro-interactions, component architecture, and cinematic UI design.'
    },
    {
      name: 'Alaiha',
      role: 'UI/UX Visual Director & Sound Designer',
      icon: User,
      fandom: 'Genshin Impact & Arcane',
      bio: 'Crafting high-contrast cyberpunk dark aesthetics, glassmorphism systems, and immersive Web Audio integrations.'
    },
    {
      name: 'Bisma',
      role: 'Core Data Strategist & Bot AI Engineer',
      icon: User,
      fandom: 'Solo Leveling & K-Pop (BTS/NewJeans)',
      bio: 'Specializing in fast client-side JSON data structures, rule-based recommendation engines, and offline-first browser storage.'
    },
    {
      name: 'Ghaniya',
      role: 'Editorial Lead & Comic Lore Archivist',
      icon: User,
      fandom: 'Spider-Verse & Sandman',
      bio: 'Author and pop culture historian connecting fans with author interviews, visual analysis, and convention chronicles.'
    }
  ];

  const techStack = [
    { name: 'React.js 18', desc: 'Component SPA State & Virtual DOM', color: '#00f3ff' },
    { name: 'Vite 5', desc: 'Lightning Fast HMR & Production Bundler', color: '#bc13fe' },
    { name: 'CSS3 Glassmorphism', desc: 'Curated HSL Neon Design System', color: '#ff007f' },
    { name: 'HTML5 Web Audio API', desc: 'Cyberpunk OST & Trailer Streamer', color: '#ffb800' },
    { name: 'Browser LocalStorage', desc: 'Bookmarks & Simulated Visitor Ticker', color: '#00e676' },
    { name: 'SessionStorage Engine', desc: 'Session Notes per Bookmarked Content', color: '#38bdf8' }
  ];

  return (
    <section className="container-custom" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="fv-section__tag">MISSION & ORIGIN STORY</span>
        <h2 className="fv-section__title">
          ABOUT <span className="fv-grad">FANDOMVERSE</span>
        </h2>
        <p className="fv-section__desc" style={{ maxWidth: '740px', margin: '0.6rem auto 0 auto' }}>
          Built for the TechWiz 7 World Championship, FandomVerse solves the fragmentation of pop culture wikis by creating a singular, ultra-responsive entertainment hub.
        </p>
      </div>

      {/* Mission & Problem Statement Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'rgba(0, 243, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Rocket size={22} color="var(--neon-cyan)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-cyber)', color: '#fff' }}>
              THE CORE PROBLEM
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Fans today have their attention scattered across dozens of disconnected platforms: fandom wikis for character lore, YouTube for trailers, ticket sites for live events, Reddit for theories, and separate e-commerce sites for merchandise. Switching between tabs leads to fatigue and missed releases.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'rgba(188, 19, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} color="var(--neon-purple)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-cyber)', color: '#fff' }}>
              OUR UNIFIED SOLUTION
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            FandomVerse centralizes seven vibrant fandom categories into a unified Single Page Application (SPA). Powered entirely by pre-populated JSON data and responsive client-side persistence, visitors can search, bookmark, play OSTs, inspect combat stats, and plan convention roadmaps effortlessly.
          </p>
        </div>
      </div>

      {/* Interactive Tech Stack Showcase */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <span className="badge-neon">Architecture & Tech Stack</span>
          <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-cyber)', marginTop: '0.4rem' }}>
            ZERO-BACKEND LIGHTWEIGHT STACK
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {techStack.map((tech, idx) => (
            <div 
              key={idx} 
              className="glass-panel-subtle" 
              style={{ padding: '1.25rem', borderLeft: `3px solid ${tech.color}`, transition: 'var(--transition-normal)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <Code2 size={18} style={{ color: tech.color }} />
                <h4 style={{ fontSize: '1rem', color: '#fff', fontWeight: 700 }}>{tech.name}</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Showcase */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge-neon" style={{ borderColor: 'rgba(255, 77, 45, 0.4)', color: '#ff4d2d', background: 'rgba(255, 77, 45, 0.12)' }}>
            Creators & Developers
          </span>
          <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-cyber)', marginTop: '0.4rem', color: '#ffffff' }}>
            MEET THE <span className="fv-grad">FANDOMVERSE CORE TEAM</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '620px', margin: '0.4rem auto 0 auto' }}>
            The passionate all-women development and design team behind FandomVerse architecture.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '1.5rem',
          alignItems: 'stretch'
        }}>
          {teamMembers.map((member, idx) => {
            const IconComponent = member.icon;
            return (
              <div 
                key={idx} 
                className="content-card" 
                style={{ 
                  padding: '1.6rem', 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(180deg, rgba(28, 9, 6, 0.75) 0%, rgba(14, 4, 3, 0.92) 100%)',
                  border: '1px solid rgba(255, 77, 45, 0.22)',
                  borderRadius: '16px'
                }}
              >
                <div style={{ 
                  width: '92px', 
                  height: '92px', 
                  borderRadius: '50%', 
                  margin: '0 auto 1.1rem auto', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'radial-gradient(circle, rgba(255, 77, 45, 0.25) 0%, rgba(30, 10, 6, 0.9) 100%)',
                  border: '3px solid #ff4d2d', 
                  boxShadow: '0 0 22px rgba(255, 77, 45, 0.5)' 
                }}>
                  <IconComponent size={42} color="#ff684a" strokeWidth={2.2} />
                </div>

              <h4 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 800, marginBottom: '0.25rem' }}>
                {member.name}
              </h4>
              <span style={{ fontSize: '0.82rem', color: '#ff684a', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
                {member.role}
              </span>

              <div style={{ 
                background: 'rgba(255, 77, 45, 0.1)', 
                border: '1px solid rgba(255, 77, 45, 0.25)',
                padding: '0.45rem 0.75rem', 
                borderRadius: '8px', 
                marginBottom: '0.85rem', 
                fontSize: '0.75rem', 
                color: '#ffedd5',
                fontWeight: 600
              }}>
                ⭐ Favorite: {member.fandom}
              </div>

              <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.55, margin: 0, marginTop: 'auto' }}>
                {member.bio}
              </p>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}

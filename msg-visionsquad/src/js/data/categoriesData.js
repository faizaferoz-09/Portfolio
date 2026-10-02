/**
 * 7 Fandom Category Hubs Data
 * Categories: Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga
 * Authentic studio artwork banners and franchise metrics
 */

export const CATEGORIES_DATA = [
  {
    id: 'anime',
    name: 'Anime',
    slug: 'anime',
    icon: 'Sparkles',
    accentColor: '#8b5cf6',
    gradient: 'from-purple-500 via-pink-400 to-indigo-600',
    tagline: 'Infinite Worlds, Unstoppable Shonen & Timeless Masterpieces',
    description: 'Dive into the heart of Japanese animation — from epic shonen battles to transcendent slice-of-life, mecha wars, and supernatural thrillers.',
    banner: '/assets/img/anime/demon-slayer.jpg',
    popularFranchises: ['Demon Slayer', 'Jujutsu Kaisen', 'Solo Leveling', 'Attack on Titan', 'One Piece', 'Chainsaw Man', 'Bleach'],
    stats: { articles: 24, characters: 8, events: 5, merch: 12, fans: '2.4M' },
    subTags: ['Shonen', 'Seinen', 'Isekai', 'Dark Fantasy', 'Mecha', 'Studio MAPPA', 'Ufotable']
  },
  {
    id: 'gaming',
    name: 'Gaming',
    slug: 'gaming',
    icon: 'Gamepad2',
    accentColor: '#0284c7',
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
    tagline: 'Next-Gen Worlds, Esports Arenas & Legendary RPG Lore',
    description: 'Explore vast open worlds, competitive esports showdowns, indie gems, and cutting-edge gaming technology.',
    banner: '/assets/img/gaming/genshin.jpg',
    popularFranchises: ['Genshin Impact', 'Cyberpunk 2077', 'Elden Ring', 'Valorant', 'The Witcher', 'Final Fantasy', 'God of War'],
    stats: { articles: 19, characters: 7, events: 4, merch: 10, fans: '3.1M' },
    subTags: ['Action RPG', 'Open World', 'Esports', 'Soulslike', 'MMO', 'Cyberpunk', 'Gacha']
  },
  {
    id: 'movies',
    name: 'Movies',
    slug: 'movies',
    icon: 'Film',
    accentColor: '#db2777',
    gradient: 'from-pink-400 via-rose-500 to-purple-600',
    tagline: 'Cinematic Verses, Blockbusters & Visual Spectacles',
    description: 'Immerse yourself in Hollywood blockbusters, cinematic verses, visionary sci-fi epics, and award-winning international cinema.',
    banner: 'https://img.youtube.com/vi/TcMBFSGVi1c/hqdefault.jpg',
    popularFranchises: ['Spider-Verse', 'Marvel Cinematic Universe', 'The Batman', 'Deadpool & Wolverine', 'Dune', 'Oppenheimer', 'Star Wars'],
    stats: { articles: 18, characters: 6, events: 4, merch: 8, fans: '1.9M' },
    subTags: ['Sci-Fi', 'Superhero', 'Cinema', 'IMAX', 'Box Office', 'Directing', 'VFX']
  },
  {
    id: 'tv-shows',
    name: 'TV Shows',
    slug: 'tv-shows',
    icon: 'Tv',
    accentColor: '#d97706',
    gradient: 'from-amber-400 via-orange-400 to-rose-500',
    tagline: 'Binge-Worthy Dramas, Epic Sagas & Streaming Sensations',
    description: 'Follow complex storylines, gripping character arcs, and cultural phenomena across prestige television and streaming networks.',
    banner: 'https://img.youtube.com/vi/b9EkMc79ZSU/hqdefault.jpg',
    popularFranchises: ['Stranger Things', 'Arcane', 'House of the Dragon', 'The Last of Us', 'The Boys', 'Squid Game', 'Loki'],
    stats: { articles: 15, characters: 6, events: 3, merch: 7, fans: '1.7M' },
    subTags: ['Streaming', 'Fantasy', 'Dystopian', 'Animation', 'Mystery', 'HBO', 'Netflix']
  },
  {
    id: 'k-pop',
    name: 'K-Pop',
    slug: 'k-pop',
    icon: 'Mic2',
    accentColor: '#ec4899',
    gradient: 'from-pink-400 via-purple-400 to-rose-500',
    tagline: 'Chart-Topping Beats, Hypnotic Choreography & Global Fandoms',
    description: 'Celebrate the world-conquering phenomenon of Korean pop music, world tours, album comebacks, and dedicated fan armies.',
    banner: '/assets/img/kpop/bts-tour.jpg',
    popularFranchises: ['BTS', 'BLACKPINK', 'Stray Kids', 'NewJeans', 'TWICE', 'SEVENTEEN', 'aespa'],
    stats: { articles: 22, characters: 6, events: 6, merch: 14, fans: '4.2M' },
    subTags: ['Boy Groups', 'Girl Groups', 'World Tour', 'Comeback', 'Lightsticks', 'Choreography']
  },
  {
    id: 'comics',
    name: 'Comics',
    slug: 'comics',
    icon: 'BookOpen',
    accentColor: '#059669',
    gradient: 'from-emerald-400 via-teal-400 to-cyan-600',
    tagline: 'Legendary Panels, Multiverses & Graphic Masterworks',
    description: 'Explore timeless American comic books, Indie graphic novels, iconic superheroes, anti-heroes, and cosmic story arcs.',
    banner: 'https://img.youtube.com/vi/kmJLuwP3MbY/hqdefault.jpg',
    popularFranchises: ['Spider-Man', 'Batman', 'X-Men', 'The Sandman', 'Superman', 'Invincible', 'Spawn'],
    stats: { articles: 16, characters: 6, events: 4, merch: 9, fans: '1.5M' },
    subTags: ['DC Comics', 'Marvel Comics', 'Image Comics', 'Graphic Novels', 'Multiverse', 'Dark Knight']
  },
  {
    id: 'manga',
    name: 'Manga',
    slug: 'manga',
    icon: 'Layers',
    accentColor: '#7c3aed',
    gradient: 'from-sky-400 via-indigo-400 to-violet-600',
    tagline: 'Ink & Passion: Original Source Material & Raw Artistry',
    description: 'Read and uncover the original serialized manga chapters, legendary mangaka stories, weekly Shonen Jump rankings, and dark fantasy gems.',
    banner: 'https://img.youtube.com/vi/q15CRdE5Bv0/hqdefault.jpg',
    popularFranchises: ['Berserk', 'One Piece', 'Vagabond', 'Chainsaw Man', 'Jujutsu Kaisen', 'Vinland Saga'],
    stats: { articles: 20, characters: 6, events: 4, merch: 11, fans: '2.8M' },
    subTags: ['Shonen Jump', 'Seinen Masterpiece', 'Mangaka Lore', 'Serialized Chapters', 'Tankobon']
  }
];

export function getCategoryById(id) {
  if (!id) return null;
  return CATEGORIES_DATA.find(c => c.id.toLowerCase() === id.toLowerCase() || c.slug === id.toLowerCase()) || null;
}

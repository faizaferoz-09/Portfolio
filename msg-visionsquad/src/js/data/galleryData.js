/**
 * FandomVerse Gallery Dataset
 * ===========================
 * Simple frontend-based visual archive.
 * 
 * HOW TO ADD A NEW IMAGE:
 * Simply add a new object to this array with today's date (or add it at the top).
 * It will automatically show at the very TOP of the Gallery page!
 * 
 * Each item has:
 * - id: Unique string or number
 * - title: Visual / artwork title
 * - category: Anime | Gaming | Movies | TV Shows | K-Pop | Comics | Manga
 * - image: URL or local path to image
 * - description: Short 1-2 sentence description
 * - date: YYYY-MM-DD format (used to sort newest first automatically)
 */

export const GALLERY_DATA = [
  {
    id: 'gal-17',
    title: 'Batman: The Dark Knight Returns & Gotham Shadows',
    category: 'Comics',
    image: 'https://img.youtube.com/vi/kmJLuwP3MbY/hqdefault.jpg',
    description: 'Frank Miller’s iconic silhouette of the Caped Crusader against lightning-streaked skies over Gotham City.',
    date: '2026-09-26'
  },
  {
    id: 'gal-16',
    title: 'The Amazing Spider-Man: Classic Marvel Splash Art',
    category: 'Comics',
    image: 'https://img.youtube.com/vi/bgqGdIoa52s/hqdefault.jpg',
    description: 'Peter Parker soaring high above Times Square in legendary Todd McFarlane & modern comic dynamic aesthetic.',
    date: '2026-09-26'
  },
  {
    id: 'gal-15',
    title: 'Superman: Action Comics Golden Multiverse Legacy',
    category: 'Comics',
    image: 'https://img.youtube.com/vi/0vxOhd4qlnA/hqdefault.jpg',
    description: 'Kal-El standing proudly before the crystalline spires of the Arctic Fortress of Solitude under cosmic sunlight.',
    date: '2026-09-25'
  },
  {
    id: 'gal-14',
    title: 'Wolverine: Weapon X Berserker Unleashed',
    category: 'Comics',
    image: 'https://img.youtube.com/vi/73_1biulkYk/hqdefault.jpg',
    description: 'Logan deploying indestructible adamantium claws in signature Jim Lee & Claremont dynamic comic panel style.',
    date: '2026-09-24'
  },
  {
    id: 'gal-13',
    title: 'DC Comics: Absolute Batman & All-In Multiverse',
    category: 'Comics',
    image: 'https://img.youtube.com/vi/EXeTwQWrcwY/hqdefault.jpg',
    description: 'The monumental new Absolute Batman wielding battle axe and reinforced armor across Scott Snyder’s DC All-In era.',
    date: '2026-09-23'
  },
  {
    id: 'gal-12',
    title: 'Spider-Man: Multiverse Leap in Nueva York',
    category: 'Movies',
    image: 'https://img.youtube.com/vi/cqGjhVJWtEg/hqdefault.jpg',
    description: 'Miles Morales free-falling through the neon cyber-architecture of Earth-928 alongside Miguel O’Hara.',
    date: '2026-09-26'
  },
  {
    id: 'gal-11',
    title: 'Gojo Satoru: Infinite Void Domain Expansion',
    category: 'Anime',
    image: '/assets/img/anime/gojo.jpg',
    description: 'Special Grade Sorcerer Gojo Satoru unsealing the Six Eyes and deploying the boundless Limitless Void domain.',
    date: '2026-09-25'
  },
  {
    id: 'gal-10',
    title: 'Genshin Impact: Palais Mermonia & The Waters of Fontaine',
    category: 'Gaming',
    image: '/assets/img/gaming/genshin.jpg',
    description: 'Panoramic twilight view across the clockwork metropolis of Fontaine, the Nation of Hydro and Justice.',
    date: '2026-09-24'
  },
  {
    id: 'gal-09',
    title: 'Arcane: Neon Reflections of Zaun & Piltover',
    category: 'TV Shows',
    image: '/assets/img/tv/jinx.jpg',
    description: 'Jinx standing atop the Chemtech towers overlooking the dual cities of Piltover and the Undercity.',
    date: '2026-09-22'
  },
  {
    id: 'gal-08',
    title: 'Tanjiro Kamado: Hinokami Kagura Sun Halo',
    category: 'Anime',
    image: '/assets/img/anime/demon-slayer.jpg',
    description: 'Blazing Sun Breathing forms igniting the night sky in theatrical animation fidelity by studio Ufotable.',
    date: '2026-09-20'
  },
  {
    id: 'gal-07',
    title: 'Elden Ring: The Golden Erdtree of Leyndell',
    category: 'Gaming',
    image: '/assets/img/gaming/witcher4.jpg',
    description: 'The monumental Golden Erdtree casting its radiant amber canopy across the ruins of the Lands Between.',
    date: '2026-09-18'
  },
  {
    id: 'gal-06',
    title: 'The Batman: Vengeance in Rainy Gotham Alleyways',
    category: 'Movies',
    image: 'https://img.youtube.com/vi/mqqft2x_Aa4/hqdefault.jpg',
    description: 'The Dark Knight emerging from the crimson neon flares of Gotham Square, tracking the Riddler’s clues.',
    date: '2026-09-15'
  },
  {
    id: 'gal-05',
    title: 'Solo Leveling: Shadow Monarch Army Emerges',
    category: 'Anime',
    image: '/assets/img/anime/sung-jinwoo.jpg',
    description: 'Sung Jin-woo commanding his infinite legion of dark shadow knights and dragons with the command "Arise".',
    date: '2026-09-12'
  },
  {
    id: 'gal-04',
    title: 'Cyberpunk 2077: Night City Megabuilding Skyline',
    category: 'Gaming',
    image: '/assets/img/gaming/cyberpunk-night-city.jpg',
    description: 'High-speed hover-cars cruising above Watson district beneath holographic advertisements in Night City.',
    date: '2026-09-10'
  },
  {
    id: 'gal-03',
    title: 'Stranger Things: The Upside Down Rift',
    category: 'TV Shows',
    image: 'https://img.youtube.com/vi/b9EkMc79ZSU/hqdefault.jpg',
    description: 'Hawkins fractured as red lightning storms erupt from Vecna’s domain into the mortal world.',
    date: '2026-09-08'
  },
  {
    id: 'gal-02',
    title: 'BTS: Neon Galaxy Stadium Tour Odyssey',
    category: 'K-Pop',
    image: '/assets/img/kpop/bts-tour.jpg',
    description: 'A sea of purple lightsticks illuminating a sold-out 80,000 seat stadium arena under cosmic laser beams.',
    date: '2026-09-05'
  },
  {
    id: 'gal-01',
    title: 'Berserk: The Black Swordsman at Eclipse Dawn',
    category: 'Manga',
    image: '/assets/img/manga/guts.jpg',
    description: 'Guts wielding the colossal Dragon Slayer sword against supernatural apostles beneath a blood-red moon.',
    date: '2026-09-01'
  }
];

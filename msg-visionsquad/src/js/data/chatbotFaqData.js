/**
 * Chatbot FAQ and Rule-Based AI Dataset
 * Powers the pre-scripted intelligent assistant VerseBot
 */

export const CHATBOT_PROMPTS = [
  { id: 'p-anime', label: 'Recommend Top Anime', iconClass: 'fa-solid fa-fire', query: 'recommend anime' },
  { id: 'p-events', label: 'Upcoming Fandom Events', iconClass: 'fa-solid fa-calendar-days', query: 'upcoming events' },
  { id: 'p-merch', label: 'Hot Merch & Figurines', iconClass: 'fa-solid fa-bag-shopping', query: 'shop merch' },
  { id: 'p-bookmarks', label: 'Bookmarks & Notes Guide', iconClass: 'fa-solid fa-bookmark', query: 'how to bookmark' },
  { id: 'p-kpop', label: 'K-Pop World Tours & Idols', iconClass: 'fa-solid fa-microphone-lines', query: 'kpop guides' },
  { id: 'p-gaming', label: 'Top Gaming RPGs & Lore', iconClass: 'fa-solid fa-gamepad', query: 'gaming lore' },
  { id: 'p-about', label: 'What is FandomVerse?', iconClass: 'fa-solid fa-circle-info', query: 'what is fandomverse' }
];

export const CHATBOT_FAQS = [
  {
    keywords: ['hello', 'hi', 'hey', 'start', 'greet', 'morning', 'evening'],
    response: `Greetings, Traveler! Welcome to FandomVerse — your ultimate portal for all things Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga! How can I assist your adventure across the multiverse today?`,
    suggestedChips: ['Recommend Top Anime', 'Upcoming Fandom Events', 'Hot Merch & Figurines'],
    action: null
  },
  {
    keywords: ['anime', 'recommend anime', 'shonen', 'demon slayer', 'jujutsu', 'gojo', 'solo leveling', 'tanjiro'],
    response: `Looking for epic anime? We highly recommend:
1. Demon Slayer: Infinity Castle Arc (Unbelievable Ufotable animation)
2. Jujutsu Kaisen (Gojo Satoru & Shibuya Incidents)
3. Solo Leveling (Sung Jin-woo's breathtaking shadow monarch rise)
4. Attack on Titan & One Piece

Check out our full Character Profiles and Media Hub trailers in the Anime Hub!`,
    suggestedChips: ['View Anime Hub', 'Upcoming Anime Expo', 'Gojo Figurine'],
    action: { type: 'navigate_category', category: 'anime' }
  },
  {
    keywords: ['event', 'events', 'con', 'convention', 'expo', 'comic-con', 'gamescom', 'kcon', 'schedule'],
    response: `Here are the hottest upcoming events across the multiverse:
- Anime Expo 2026 (Los Angeles, Oct 15)
- Gamescom 2026 (Cologne, Oct 28)
- New York Comic Con 2026 (NYC, Oct 8)
- KCON Los Angeles 2026 (Crypto.com Arena, Oct 18)
- Berserk Memorial Exhibition (Tokyo, Oct 30)

You can explore full dates, schedules, and ticket info in the Events section!`,
    suggestedChips: ['Explore Events Section', 'Anime Expo Info', 'KCON 2026 Info'],
    action: { type: 'navigate_tab', tab: 'events' }
  },
  {
    keywords: ['merch', 'merchandise', 'shop', 'store', 'cart', 'buy', 'tshirt', 'figure', 'figurine', 'lightstick', 'hoodie'],
    response: `Welcome to the FandomVerse Merch Showcase!
Featured Items:
- Gojo Satoru 1/7 Scale LED Statue ($149.99)
- Cyber Akira Oversized Heavyweight Tee ($34.99)
- BTS Official ARMY Bomb Ver. 4 ($58.50)
- Berserk Deluxe Hardcover Box Set ($210.00)

Note: You can add items to your temporary cart, apply discount codes like FANDOM10, and calculate totals in real-time!`,
    suggestedChips: ['Open Merch Store', 'View Cart Drawer', 'Apply Coupon FANDOM10'],
    action: { type: 'navigate_tab', tab: 'store' }
  },
  {
    keywords: ['bookmark', 'bookmarks', 'save', 'note', 'notes', 'session', 'export'],
    response: `Bookmarking & Personal Notes System:
- Click the Bookmark button on any Article, Character, Media, or Event card.
- All bookmarks persist automatically in your browser's LocalStorage.
- Open the Bookmarks tab to write Personal Session Notes (stored in SessionStorage).
- Use the "Export Bookmarks" button to download your collection as Markdown or JSON!`,
    suggestedChips: ['View My Bookmarks', 'Export Bookmarks', 'Explore Articles'],
    action: { type: 'navigate_tab', tab: 'bookmarks' }
  },
  {
    keywords: ['kpop', 'k-pop', 'bts', 'blackpink', 'stray kids', 'newjeans', 'army', 'blink'],
    response: `Welcome to the K-Pop Hub! 
- Explore character/idol profiles for Jungkook, Jennie, Bang Chan, Hanni, and Taemin.
- Catch BTS 2026 Reunion Stadium Tour and KCON 2026 updates in Events.
- Check out official BTS Lightsticks and BLACKPINK Tour Bomber Jackets in Merch!`,
    suggestedChips: ['Go to K-Pop Hub', 'BTS World Tour Info', 'K-Pop Merch'],
    action: { type: 'navigate_category', category: 'k-pop' }
  },
  {
    keywords: ['game', 'gaming', 'genshin', 'cyberpunk', 'elden ring', 'kratos', 'witcher', 'rpg'],
    response: `Step into the Gaming Realm!
- Dive into our analysis of open-world storytelling from Teyvat to Night City.
- Character bios and stat cards for Raiden Shogun, Malenia, Geralt of Rivia, and V.
- Upcoming: Gamescom 2026 and League of Legends Worlds Finals!`,
    suggestedChips: ['Go to Gaming Hub', 'Genshin Impact Lore', 'Gamescom 2026'],
    action: { type: 'navigate_category', category: 'gaming' }
  },
  {
    keywords: ['movie', 'movies', 'film', 'spider-verse', 'spider-man', 'dune', 'batman', 'marvel'],
    response: `The Cinema Multiverse awaits!
- Read our deep breakdown on Spider-Man: Across the Spider-Verse visual language.
- Profiles for Miles Morales, Paul Atreides (Muad'Dib), and The Batman.
- Watch high-definition teaser trailers in the Media Hub!`,
    suggestedChips: ['Explore Movies Hub', 'Watch Trailers', 'Spider-Verse Art Article'],
    action: { type: 'navigate_category', category: 'movies' }
  },
  {
    keywords: ['comic', 'comics', 'dc', 'marvel', 'gotham', 'sandman', 'wolverine', 'invincible'],
    response: `Explore the Comic Book Pantheon!
- Discover profiles of Batman (Dark Knight), Peter Parker, Wolverine, and Morpheus (The Sandman).
- Upcoming: New York Comic Con 2026 and Eisner Awards Ceremony!`,
    suggestedChips: ['Go to Comics Hub', 'NYCC 2026 Info', 'Batman Profile'],
    action: { type: 'navigate_category', category: 'comics' }
  },
  {
    keywords: ['manga', 'berserk', 'guts', 'one piece', 'zoro', 'vagabond', 'chainsaw man', 'shonen jump'],
    response: `The Raw Ink of Manga!
- Masterpieces featured: Berserk, One Piece, Vagabond, and Chainsaw Man.
- Check out character stats for Guts, Roronoa Zoro, Miyamoto Musashi, and Denji.
- Explore Comiket 106 and the Kentaro Miura Memorial Tribute in Events!`,
    suggestedChips: ['Go to Manga Hub', 'Berserk Article', 'Manga Merch Set'],
    action: { type: 'navigate_category', category: 'manga' }
  },
  {
    keywords: ['about', 'fandomverse', 'who are you', 'team', 'mission', 'tech', 'stack'],
    response: `FandomVerse is a modern Single Page Application (SPA) designed to unify scattered fandom communities across Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga.
Built with React.js, Vite, Cyberpunk/Anime Glassmorphism design system, Web Audio API, and zero external backend overhead.`,
    suggestedChips: ['Learn About Us', 'Contact the Team', 'Explore Hubs'],
    action: { type: 'navigate_tab', tab: 'about' }
  },
  {
    keywords: ['contact', 'support', 'feedback', 'email', 'map', 'reach'],
    response: `Need to reach the FandomVerse headquarters?
You can message our team through the interactive Contact Us form, or locate our global studios in Tokyo, Seoul, and Los Angeles on the interactive map!`,
    suggestedChips: ['Go to Contact Us', 'Submit Query', 'About Team'],
    action: { type: 'navigate_tab', tab: 'contact' }
  }
];

export function findChatbotReply(userInput) {
  if (!userInput || !userInput.trim()) {
    return {
      text: "Please enter a message or choose a prompt chip above to get started!",
      suggestedChips: ['Recommend Top Anime', 'Upcoming Fandom Events', 'Hot Merch & Figurines'],
      action: null
    };
  }

  const query = userInput.toLowerCase().trim();

  for (const item of CHATBOT_FAQS) {
    const match = item.keywords.some(k => query.includes(k.toLowerCase()));
    if (match) {
      return {
        text: item.response,
        suggestedChips: item.suggestedChips || ['Recommend Top Anime', 'Upcoming Fandom Events', 'Hot Merch & Figurines'],
        action: item.action || null
      };
    }
  }

  // Fallback smart response
  return {
    text: `I searched the FandomVerse archives for "${userInput}". You can explore related articles, media, and character profiles across our 7 Category Hubs or use the Global Search Bar at the top of the page!`,
    suggestedChips: ['Recommend Top Anime', 'Upcoming Fandom Events', 'Hot Merch & Figurines', 'How to Bookmark?'],
    action: null
  };
}

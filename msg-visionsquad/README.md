# 🌌 FandomVerse - Portal for Fandom World
> **TechWiz 7 World Championship: Web Innovation Unleashed**  
> **Team:** [MSG-VISION SQUAD](https://aptechmetrostargate.com:106/) | **Mentor:** Mr. Asad Ali  
> **Live Portal:** [https://aptechmetrostargate.com:106/](https://aptechmetrostargate.com:106/)  
> *Software Requirements Specification (SRS) Version 1.0 Implementation*

---

## 👥 Team & Submission Details

| Team Name | Competition Track | Faculty / Mentor | Live Submission Link |
| :--- | :--- | :--- | :--- |
| **[MSG-VISION SQUAD](https://aptechmetrostargate.com:106/)** | Web Innovation Unleashed | Mr. Asad Ali | [https://aptechmetrostargate.com:106/](https://aptechmetrostargate.com:106/) |

---

## 🌟 Overview & Problem Definition
In the modern digital age, pop culture fans of **Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga** must constantly switch between dozens of fragmented websites—wikis for character bios, video platforms for trailers, ticketing sites for conventions, and online stores for merchandise. 

**FandomVerse** solves this problem by uniting these seven major fandom communities into a single, high-performance, visually stunning **Single Page Application (SPA)** with zero server-side database requirements.

---

## 🚀 Key Features & Implementation Matrix

### 1. 🎬 Ultra-Cinematic Hero Section
- **Animated Neon Particle & Starglow Canvas**: Interactive particle animation and cyber grid background.
- **Bold Glowing Headline**: *"WELCOME TO FANDOMVERSE"* with vibrant gradient text and neon pulse effects.
- **Trending Across The Multiverse**: Dynamic cards spotlighting top franchises (*Demon Slayer*, *Solo Leveling*, *Genshin Impact*, *Spider-Verse*) with rating badges.
- **Live Floating Widgets Bar**:
  - **Simulated Visitor Counter**: Live counter initialized and updated via `localStorage`.
  - **Real-Time Digital Clock**: Live clock with second-by-second updates and timezone detection in pure JS.
  - **Dynamic Breadcrumb Navigation**: Real-time trail for active tab and category hub context.

### 2. 🧩 7 Fandom Category Hubs
- **Universes**: **Anime**, **Gaming**, **Movies**, **TV Shows**, **K-Pop**, **Comics**, and **Manga**.
- **Interactive Selector Grid & Tabs**: Smooth hover state animations and franchise overviews.
- **Multi-Level Dynamic Filtering & Sorting**:
  - Filter by Content Type (*Articles*, *Characters*, *Videos & Audio*, *Events*, *Merchandise*).
  - Filter by Category Sub-Tags (*Shonen*, *Open World*, *Sci-Fi*, *Boy/Girl Groups*, *Seinen*, etc.).
  - Sort by *Popularity & Rating*, *Newest First*, and *Alphabetical (A-Z / Z-A)*.

### 3. 📰 Featured Articles & Deep Dives
- Long-form essays, animation studio breakdowns, and lore analysis.
- Read time, author avatar, publication dates, and category badges.
- Click-to-expand **Deep Reader Modal** with formatted text and related content recommendations.

### 4. 🧑‍🎤 35+ Character Profiles & Combat Stats
- At least **5+ profiles per category** across all 7 universes.
- Character dossiers including Name, Series, Role, Affiliation, Biography, Traits, and Quotes.
- **Interactive Combat Stat Bars** displaying Power Level, Agility/Speed, and Intelligence (0-100 scale).

### 5. 🎬 Media Hub & Cyber OST Player
- Embedded responsive video modal previews for official anime, gaming, and movie trailers.
- Built-in **Cyberpunk Audio Player** with track progress bar, play/pause controls, volume slider, and track timestamps.

### 6. 📅 21+ Event Highlights & Conventions
- Past and upcoming mega conventions (*Anime Expo*, *Gamescom*, *NYCC*, *KCON*, *Berserk Exhibition*).
- Interactive **"Remind Me / RSVP"** feature with celebratory confetti animations.

### 7. 🛍️ Merchandise Showcase & Temporary Shopping Cart
- Fan products (T-shirts, 1/7 scale LED statues, Lightsticks, Deluxe manga sets, Hoodies, Mugs).
- **Interactive Shopping Cart Drawer**:
  - Quantity adjusters, subtotal calculation, 8% tax calculation, and free shipping threshold ($75+).
  - Discount Coupon Code engine (`FANDOM10`, `CYBER20`, `ANIMEEXPO`, `FREEPOST`).
  - Simulated Checkout Modal with explicit non-commercial disclaimer.

### 8. 🔖 Content Bookmarking & Session Notes System
- One-click bookmark ribbon toggle on every card across all pages.
- Persistent saved items in **`localStorage`**.
- Editable **Personal Session Notes** stored in **`sessionStorage`**.
- **"Export Bookmarks"** utility downloading structured `.md`, `.json`, or `.csv` files.

### 9. 🤖 AI-Powered Chatbot Widget (VerseBot)
- Floating launcher button at bottom-right with neon pulsing ring.
- Rule-based AI engine with keyword matching and quick prompt chips (*"Recommend Anime"*, *"Upcoming Events"*, *"Shop Merch"*).
- Direct jump-action links that navigate users directly to relevant hubs.

### 10. ✉️ Contact Us & ℹ️ About Us
- **Contact Us**: Interactive validated inquiry form, global studio selector (Tokyo, Los Angeles, Seoul), GPS coordinates, and responsive dark-mode embedded Google Map.
- **About Us**: Project vision, team member bios, and interactive architecture stack pills.

### 11. 🔐 UI-Only Dummy Authentication
- Modal with tabs for "Sign In" and "Create Account".
- Avatar picker and preferred fandom universe selection.

---

## 🛠️ Project Structure
```
fandomverse/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── assets/
│       └── img/                    # All image assets
│           ├── logo.png
│           ├── hero-bg.jpg
│           ├── placeholder.jpg
│           ├── anime/
│           │   ├── demon-slayer.jpg
│           │   └── gojo.jpg
│           ├── gaming/
│           │   └── genshin.jpg
│           ├── merch/
│           │   ├── tshirt.jpg
│           │   └── figure.jpg
│           └── avatar.png
└── src/
    ├── assets/                     # Modular CSS
    │   └── css/
    │       ├── index.css
    │       ├── hero.css
    │       ├── components.css
    │       └── chatbot.css
    ├── js/                         # Logic, utilities and mock data
    │   ├── data/
    │   │   ├── categoriesData.js
    │   │   ├── articlesData.js
    │   │   ├── charactersData.js
    │   │   ├── eventsData.js
    │   │   ├── merchandiseData.js
    │   │   ├── mediaData.js
    │   │   └── chatbotFaqData.js
    │   ├── utils/
    │   │   ├── storage.js          # LocalStorage & SessionStorage helpers
    │   │   └── dateClock.js        # Real-time clock & visitor formatting
    │   └── cartLogic.js            # Shopping cart math & coupon engine
    ├── components/
    │   ├── Navbar.jsx
    │   ├── HeroCinematic.jsx
    │   ├── CategoryHubs.jsx
    │   ├── MediaHub.jsx
    │   ├── ArticlesSection.jsx
    │   ├── CharacterProfiles.jsx
    │   ├── EventHighlights.jsx
    │   ├── MerchandiseStore.jsx
    │   ├── Bookmarks.jsx
    │   ├── ChatbotWidget.jsx
    │   ├── VisitorClockBar.jsx
    │   ├── ContactUs.jsx
    │   ├── AboutUs.jsx
    │   └── AuthModal.jsx
    ├── App.jsx
    └── main.jsx
```

---

## 💻 Installation & Local Setup Instructions (MANDATORY)

### Prerequisites:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### Steps:
1. **Clone or navigate into the project directory**:
   ```bash
   cd "c:\Users\Laptronics.co\Documents\Fandom verse"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000/` (or `http://localhost:3001/`).

5. **Build for production (optional)**:
   ```bash
   npm run build
   ```

// ============================================================
//  SIMPLON BEAUTY — products.js
//  Products Database (60 Unique Products with Premium Images)
//  Categories: Hair Care, Skin Care, Makeup, Nail Care, Jewellery, Wedding Kit, Upcoming
// ============================================================

var productsData = [

  // ─── HAIR CARE (1-11) ───
  {
    id: 1, category: "Hair Care",
    title: "Keratin Repair Shampoo",
    description: "Salon-grade keratin formula that strengthens brittle hair, eliminates frizz and delivers silky mirror shine.",
    ingredients: "Water, Keratin Protein, Panthenol (Vitamin B5), Argan Oil, Hydrolyzed Silk, Citric Acid, Sodium Benzoate.",
    price: 18.99, oldPrice: 24.99, rating: 4.5, reviews: 128, badge: "Best Seller", stock: 48,
    image: "assets/img/keratin-shampoo.png",
    images: ["assets/img/keratin-shampoo.png"],
    reviewList: [{ name: "Aisha M.", stars: 5, img: "assets/img/keratin-shampoo.png", text: "Amazing shampoo!", date: "June 12, 2026" }]
  },
  {
    id: 2, category: "Hair Care",
    title: "Rose Hair Repair Serum",
    description: "Lightweight argan & rose oil serum that repairs split ends and adds brilliant shine in seconds.",
    ingredients: "Cyclopentasiloxane, Dimethicone, Argan Oil, Rosa Damascena Extract, Vitamin E, Fragrance.",
    price: 22.99, oldPrice: 29.99, rating: 4.7, reviews: 143, badge: "Best Seller", stock: 32,
    image: "assets/img/rose-serum.png",
    images: ["assets/img/rose-serum.png"],
    reviewList: []
  },
  {
    id: 3, category: "Hair Care",
    title: "Argan Oil Deep Hair Mask",
    description: "Intensive overnight repair mask with pure Moroccan argan oil for ultra-soft, frizz-free hair.",
    ingredients: "Argania Spinosa Kernel Oil, Shea Butter, Hydrolyzed Wheat Protein, Glycerin, Panthenol.",
    price: 26.99, oldPrice: 35.00, rating: 4.6, reviews: 119, badge: "Sale", stock: 24,
    image: "assets/img/argan-oil.png",
    images: ["assets/img/argan-oil.png"],
    reviewList: []
  },
  {
    id: 4, category: "Hair Care",
    title: "Biotin Hair Growth Vitamins",
    description: "Biotin & collagen supplements that promote thicker, longer, stronger hair growth from within.",
    ingredients: "Biotin 10,000mcg, Collagen Peptides, Folic Acid, Vitamin C, Zinc, Vitamin B12.",
    price: 21.99, oldPrice: null, rating: 4.3, reviews: 98, badge: null, stock: 60,
    image: "assets/img/hair-vitamins.png",
    images: ["assets/img/hair-vitamins.png"],
    reviewList: []
  },
  {
    id: 5, category: "Hair Care",
    title: "Scalp Revive Nourishing Oil",
    description: "Nourishing scalp treatment oil that strengthens roots, eliminates dandruff and promotes healthy growth.",
    ingredients: "Jojoba Oil, Tea Tree Oil, Peppermint Oil, Castor Oil, Niacinamide, Caffeine Extract.",
    price: 23.99, oldPrice: null, rating: 4.4, reviews: 76, badge: "New", stock: 40,
    image: "assets/img/nourishing-oil.png",
    images: ["assets/img/nourishing-oil.png"],
    reviewList: []
  },
  {
    id: 6, category: "Hair Care",
    title: "Professional Hair Color Cream",
    description: "Salon-quality permanent hair color cream with conditioning agents. Long-lasting 8-week color with brilliant shine.",
    ingredients: "Ammonia, Hydrogen Peroxide 6%, Keratin Complex, Panthenol, Argan Oil, Fragrance.",
    price: 19.99, oldPrice: 26.99, rating: 4.8, reviews: 267, badge: "Best Seller", stock: 55,
    image: "assets/img/hair-color-cream.png",
    images: ["assets/img/hair-color-cream.png"],
    colors: [
      { name: "Jet Black", hex: "#1a1a1a" }, { name: "Dark Brown", hex: "#3b1c0a" },
      { name: "Medium Brown", hex: "#6b3a2a" }, { name: "Auburn Red", hex: "#8b2500" }
    ],
    reviewList: []
  },
  {
    id: 7, category: "Hair Care",
    title: "Ombre Hair Color Kit",
    description: "Complete DIY ombre kit with developer, gloves & brush. Create salon-worthy gradient color at home.",
    ingredients: "Hair Lightener, 20 Vol Developer, Hydrolyzed Protein Conditioner, Protective Gloves.",
    price: 32.99, oldPrice: 44.99, rating: 4.6, reviews: 182, badge: "Sale", stock: 28,
    image: "assets/img/haircolor-kit.png",
    images: ["assets/img/haircolor-kit.png"],
    colors: [{ name: "Caramel Blonde", hex: "#c68642" }, { name: "Copper Rose", hex: "#b56269" }],
    reviewList: []
  },
  {
    id: 8, category: "Hair Care",
    title: "Anti-Hairfall Caffeine Treatment",
    description: "Intense daily scalp dropper targeting root revitalization and reducing hair breakage.",
    ingredients: "Caffeine, Biotin, Rosemary Extract, Zinc PCA, Panthenol.",
    price: 27.50, oldPrice: 34.00, rating: 4.5, reviews: 52, badge: "New", stock: 30,
    image: "assets/img/caffeine-mask.png",
    images: ["assets/img/caffeine-mask.png"],
    reviewList: []
  },
  {
    id: 9, category: "Hair Care",
    title: "Volume Boost Conditioner",
    description: "Lightweight conditioner infused with rice protein and vitamin E to add natural bounce.",
    ingredients: "Rice Amino Acids, Tocopheryl Acetate, Coconut Oil, Aloe Vera Leaf Juice.",
    price: 16.99, oldPrice: null, rating: 4.4, reviews: 39, badge: null, stock: 45,
    image: "assets/img/conditionar.png",
    images: ["assets/img/conditionar.png"],
    reviewList: []
  },
  {
    id: 10, category: "Hair Care",
    title: "Coconut Dry Hair Elixir",
    description: "Cold-pressed coconut oil blend designed to restore vital moisture and soft texture to damaged ends.",
    ingredients: "Cocos Nucifera Oil, Macadamia Seed Oil, Sunflower Seed Oil, Vitamin A.",
    price: 14.50, oldPrice: 19.99, rating: 4.7, reviews: 88, badge: "Sale", stock: 50,
    image: "assets/img/coconut-Elixir.png",
    images: ["assets/img/coconut-Elixir.png"],
    reviewList: []
  },
  {
    id: 11, category: "Hair Care",
    title: "Avocado Moisture Nourishing Spray",
    description: "Hydrating hair mist containing pure avocado extract that revitalizes dry locks and shields hair from sun damage.",
    ingredients: "Avocado Oil, Aloe Vera Extract, Jojoba Oil, Essential Fragrance.",
    price: 18.50, oldPrice: 24.00, rating: 4.6, reviews: 71, badge: "New", stock: 40,
    image: "assets/img/avocado-mist.png",
    images: ["assets/img/avocado-mist.png"],
    reviewList: []
  },

  // ─── SKIN CARE (12-22) ───
  {
    id: 12, category: "Skin Care",
    title: "Vitamin C Brightening Face Wash",
    description: "Antioxidant-rich face wash that brightens dull skin, fades dark spots and reveals a radiant glow.",
    ingredients: "Ascorbic Acid (Vitamin C), Niacinamide, Turmeric Extract, Aloe Vera, Glycerin, Licorice Root Extract.",
    price: 15.99, oldPrice: null, rating: 4.8, reviews: 96, badge: "New", stock: 70,
    image: "assets/img/facewash.png",
    images: ["assets/img/facewash.png"],
    reviewList: []
  },
  {
    id: 13, category: "Skin Care",
    title: "24K Rose Gold Face Serum",
    description: "Luxury anti-ageing serum with 24K gold flakes & hyaluronic acid for plump, glowing skin.",
    ingredients: "24K Gold Flakes, Hyaluronic Acid, Retinol 0.1%, Rosa Centifolia Extract, Vitamin E, Collagen Peptides.",
    price: 38.99, oldPrice: 55.00, rating: 4.8, reviews: 201, badge: "Best Seller", stock: 18,
    image: "assets/img/rose-gold-serum.png",
    images: ["assets/img/rose-gold-serum.png"],
    reviewList: []
  },
  {
    id: 14, category: "Skin Care",
    title: "Hydra Boost Day Moisturizer",
    description: "72-hour deep hydration cream with ceramides, aloe vera & niacinamide — suitable for all skin types.",
    ingredients: "Ceramide NP, Ceramide AP, Hyaluronic Acid, Niacinamide, Aloe Vera, Shea Butter, SPF 15.",
    price: 19.99, oldPrice: null, rating: 4.5, reviews: 158, badge: null, stock: 52,
    image: "assets/img/mosturizer.png",
    images: ["assets/img/mosturizer.png"],
    reviewList: []
  },
  {
    id: 15, category: "Skin Care",
    title: "Charcoal Detox Face Mask",
    description: "Deep pore cleansing charcoal mask that draws out blackheads, oil and impurities for clear skin.",
    ingredients: "Activated Charcoal, Kaolin Clay, Tea Tree Oil, Witch Hazel, Salicylic Acid, Aloe Vera.",
    price: 14.99, oldPrice: 19.99, rating: 4.4, reviews: 73, badge: "Sale", stock: 44,
    image: "assets/img/charcoal-mask.png",
    images: ["assets/img/charcoal-mask.png"],
    reviewList: []
  },
  {
    id: 16, category: "Skin Care",
    title: "SPF 50+ Invisible Sunscreen",
    description: "Lightweight broad-spectrum SPF 50 sunscreen with vitamin E — non-greasy, non-white-cast formula.",
    ingredients: "Zinc Oxide 10%, Titanium Dioxide 5%, Vitamin E, Niacinamide, Aloe Vera, Hyaluronic Acid.",
    price: 17.99, oldPrice: 22.99, rating: 4.9, reviews: 312, badge: "Best Seller", stock: 80,
    image: "assets/img/spf-50.png",
    images: ["assets/img/spf-50.png"],
    reviewList: []
  },
  {
    id: 17, category: "Skin Care",
    title: "Retinol Night Repair Cream",
    description: "Potent retinol night cream that reduces wrinkles, firms skin and visibly reverses signs of ageing overnight.",
    ingredients: "Retinol 0.3%, Peptide Complex, Hyaluronic Acid, Ceramide, Shea Butter, Vitamin C.",
    price: 44.99, oldPrice: 59.99, rating: 4.7, reviews: 145, badge: "Premium", stock: 22,
    image: "assets/img/body-cream.png",
    images: ["assets/img/body-cream.png"],
    reviewList: []
  },
  {
    id: 18, category: "Skin Care",
    title: "Bakuchiol Natural Alternative Serum",
    description: "Gentle plant-based retinol alternative that targets skin texture without redness or peeling.",
    ingredients: "Bakuchiol 1%, Olive Squalane, Centella Asiatica Extract, Green Tea Extract.",
    price: 29.99, oldPrice: 38.00, rating: 4.6, reviews: 88, badge: "New", stock: 35,
    image: "assets/img/serum.png",
    images: ["assets/img/serum.png"],
    reviewList: []
  },
  {
    id: 19, category: "Skin Care",
    title: "Rosewater Hydrating Toner Spray",
    description: "Pure steam-distilled rosewater that balances pH levels and locks in lightweight hydration.",
    ingredients: "Rosa Damascena Flower Water, Glycerin, Witch Hazel Extract, Sodium Hyaluronate.",
    price: 12.99, oldPrice: null, rating: 4.7, reviews: 112, badge: "Best Seller", stock: 64,
    image: "assets/img/toner-spray.png",
    images: ["assets/img/toner-spray.png"],
    reviewList: []
  },
  {
    id: 20, category: "Skin Care",
    title: "Tea Tree Spot Treatment Gel",
    description: "Fast-acting spot gel that calms acne bumps, blemishes, and sudden breakouts overnight.",
    ingredients: "Salicylic Acid 2%, Tea Tree Leaf Oil, Aloe Vera Extract, Allantoin.",
    price: 11.50, oldPrice: 14.99, rating: 4.3, reviews: 59, badge: "Sale", stock: 40,
    image: "assets/img/spot-gel.png",
    images: ["assets/img/spot-gel.png"],
    reviewList: []
  },
  {
    id: 21, category: "Skin Care",
    title: "Hyaluronic Intense Moisture Ampoule",
    description: "Highly concentrated multi-molecular weight hyaluronic serum that plumps skin with moisture.",
    ingredients: "Sodium Hyaluronate, Hydrolyzed Hyaluronic Acid, Niacinamide, Panthenol.",
    price: 34.00, oldPrice: null, rating: 4.8, reviews: 104, badge: "Premium", stock: 25,
    image: "assets/img/Hyaluronic-moisture.png",
    images: ["assets/img/Hyaluronic-moisture.png"],
    reviewList: []
  },
  {
    id: 22, category: "Skin Care",
    title: "Squalane Smoothing Cleansing Oil",
    description: "A nourishing cleansing oil designed to gently dissolve makeup and unclog pores while balancing hydration.",
    ingredients: "Squalane, Jojoba Seed Oil, Vitamin E, Sweet Almond Oil.",
    price: 26.00, oldPrice: 32.00, rating: 4.7, reviews: 63, badge: "New", stock: 40,
    image: "assets/img/cleansing-oil.png",
    images: ["assets/img/cleansing-oil.png"],
    reviewList: []
  },

  // ─── MAKE-UP (23-33) ───
  {
    id: 23, category: "Make-Up",
    title: "Pro 24-Shade Eyeshadow Palette",
    description: "Buildable 24-shade eyeshadow palette with matte, shimmer & glitter finishes for every look.",
    ingredients: "Mica, Talc, Magnesium Stearate, Nylon-12, Dimethicone, Iron Oxides, Ultramarines.",
    price: 49.99, oldPrice: 69.99, rating: 4.7, reviews: 214, badge: "Sale", stock: 35,
    image: "assets/img/eyeshadow-pallete.png",
    images: ["assets/img/eyeshadow-pallete.png"],
    reviewList: []
  },
  {
    id: 24, category: "Make-Up",
    title: "Velvet Full-Coverage Foundation",
    description: "Buildable full-coverage foundation with SPF 30 for a flawless, pore-minimizing all-day finish.",
    ingredients: "Water, Cyclopentasiloxane, Zinc Oxide, Titanium Dioxide, Dimethicone, Niacinamide, SPF 30.",
    price: 32.99, oldPrice: 42.99, rating: 4.8, reviews: 267, badge: "Best Seller", stock: 45,
    image: "assets/img/makeup-coverage.png",
    images: ["assets/img/makeup-coverage.png"],
    colors: [
      { name: "Ivory", hex: "#f5e6d0" }, { name: "Nude Beige", hex: "#d4a574" },
      { name: "Natural Tan", hex: "#c08b5c" }, { name: "Warm Caramel", hex: "#a0664a" }
    ],
    reviewList: []
  },
  {
    id: 25, category: "Make-Up",
    title: "Matte Velvet Lip Kit",
    description: "Long-wear matte lip liner + lipstick duo — 8 gorgeous shades with 12-hour stay power.",
    ingredients: "Trimethylsiloxyphenyl Dimethicone, Beeswax, Candelilla Wax, Vitamin E, Castor Oil, Iron Oxides.",
    price: 28.99, oldPrice: null, rating: 4.6, reviews: 110, badge: "New", stock: 62,
    image: "assets/img/lipstick-kit.png",
    images: ["assets/img/lipstick-kit.png"],
    colors: [
      { name: "Classic Red", hex: "#c0392b" }, { name: "Dusty Rose", hex: "#d4948c" },
      { name: "Berry Plum", hex: "#6c2d5a" }
    ],
    reviewList: []
  },
  {
    id: 26, category: "Make-Up",
    title: "Volumizing 3D Mascara",
    description: "Buildable volume mascara with curved brush for bold, clump-free, defined lashes all day.",
    ingredients: "Water, Carnauba Wax, Beeswax, Stearic Acid, Black Iron Oxide, Panthenol, Vitamin E.",
    price: 13.99, oldPrice: null, rating: 4.6, reviews: 189, badge: null, stock: 75,
    image: "assets/img/mascara.png",
    images: ["assets/img/mascara.png"],
    reviewList: []
  },
  {
    id: 27, category: "Make-Up",
    title: "Glow Highlighter Palette",
    description: "4-shade pressed powder highlighter palette for a lit-from-within radiant glow on cheeks and brow bones.",
    ingredients: "Mica, Boron Nitride, Dimethicone, Magnesium Myristate, Synthetic Fluorphlogopite, Silica.",
    price: 26.99, oldPrice: 35.00, rating: 4.7, reviews: 93, badge: "Sale", stock: 38,
    image: "assets/img/highlighter-pallete.png",
    images: ["assets/img/highlighter-pallete.png"],
    reviewList: []
  },
  {
    id: 28, category: "Make-Up",
    title: "Mineral Cheek Blush Powder",
    description: "Lightweight mineral pigment blush that adds a natural, warm rose flush to the cheeks.",
    ingredients: "Mica, Zinc Oxide, Iron Oxides, Rose Extract, Chamomile Oil.",
    price: 18.00, oldPrice: 22.00, rating: 4.5, reviews: 67, badge: null, stock: 45,
    image: "assets/img/blush-powder.png",
    images: ["assets/img/blush-powder.png"],
    reviewList: []
  },
  {
    id: 29, category: "Make-Up",
    title: "Liquid Precision Eyeliner",
    description: "Waterproof, smudge-free black liquid eyeliner with an ultra-fine felt tip for flawless wings.",
    ingredients: "Water, Acrylates Copolymer, Carbon Black, Propylene Glycol, Xanthan Gum.",
    price: 12.50, oldPrice: null, rating: 4.7, reviews: 142, badge: "Best Seller", stock: 80,
    image: "assets/img/eyeliner.png",
    images: ["assets/img/eyeliner.png"],
    reviewList: []
  },
  {
    id: 30, category: "Make-Up",
    title: "Silicone Pore-Blurring Primer",
    description: "Weightless mattifying primer gel that controls shine and preps skin for seamless foundation application.",
    ingredients: "Cyclopentasiloxane, Dimethicone Crosspolymer, Silica, Tocopheryl Acetate.",
    price: 24.99, oldPrice: 32.00, rating: 4.6, reviews: 75, badge: "New", stock: 30,
    image: "assets/img/primer1.png",
    images: ["assets/img/primer1.png"],
    reviewList: []
  },
  {
    id: 31, category: "Make-Up",
    title: "Luminous Setting Spray",
    description: "Micro-fine mist setting spray that locks in makeup for 16 hours with a radiant, dewy finish.",
    ingredients: "Water, Alcohol Denat., PVP, Niacinamide, Glycerin, Aloe Leaf Juice.",
    price: 21.00, oldPrice: null, rating: 4.5, reviews: 92, badge: null, stock: 50,
    image: "assets/img/setting-spray.png",
    images: ["assets/img/setting-spray.png"],
    reviewList: []
  },
  {
    id: 32, category: "Make-Up",
    title: "Pro Contour & Bronze Duo",
    description: "Easy-to-blend contour and warm bronzer cream set to sculpt and warm up skin tones.",
    ingredients: "Ethylhexyl Palmitate, Caprylic/Capric Triglyceride, Carnauba Wax, Silica, Iron Oxides.",
    price: 29.50, oldPrice: 38.00, rating: 4.6, reviews: 48, badge: "Sale", stock: 22,
    image: "assets/img/bronzer.png",
    images: ["assets/img/bronzer.png"],
    reviewList: []
  },
  {
    id: 33, category: "Make-Up",
    title: "Ultra Matte Lip Crayon",
    description: "Rich, saturated color payoff lipstick crayon with a lightweight, smudge-free velvet formula.",
    ingredients: "Synthetic Wax, Diisostearyl Malate, Titanium Dioxide, Iron Oxides.",
    price: 19.00, oldPrice: 25.00, rating: 4.4, reviews: 52, badge: "New", stock: 40,
    image: "assets/img/matte-crayon.png",
    images: ["assets/img/matte-crayon.png"],
    reviewList: []
  },

  // ─── NAIL CARE (34-44) ───
  {
    id: 34, category: "Nail Care",
    title: "Luxury Nail Polish Collection",
    description: "Set of 10 chip-free glossy nail polishes with 15-day wear formula and mirror shine finish.",
    ingredients: "Nitrocellulose, Tosylamide/Formaldehyde Resin, Ethyl Acetate, Butyl Acetate, Isopropyl Alcohol.",
    price: 12.99, oldPrice: null, rating: 4.6, reviews: 87, badge: null, stock: 90,
    image: "assets/img/nail-paint.png",
    images: ["assets/img/nail-paint.png"],
    colors: [
      { name: "Classic Red", hex: "#c0392b" }, { name: "Ballet Pink", hex: "#e8b4b8" },
      { name: "Nude Beige", hex: "#d4a574" }
    ],
    reviewList: []
  },
  {
    id: 35, category: "Nail Care",
    title: "Gel Nail Polish Starter Kit",
    description: "UV/LED gel nail polish starter set with base coat, top coat, and 6 long-lasting gel colours.",
    ingredients: "HEMA, Di-HEMA Trimethylhexyl Dicarbamate, Hydroxypropyl Methacrylate, Photoinitiator.",
    price: 34.99, oldPrice: 49.99, rating: 4.7, reviews: 154, badge: "Sale", stock: 26,
    image: "assets/img/starter-kit.png",
    images: ["assets/img/starter-kit.png"],
    reviewList: []
  },
  {
    id: 36, category: "Nail Care",
    title: "Glitter & Chrome Nail Set",
    description: "Dazzling glitter gel nail polish set with 8 holographic, chrome and glitter shades for galaxy-effect nails.",
    ingredients: "Nitrocellulose, Polyester Glitter, Aluminium Powder, Mica, Ethyl Acetate.",
    price: 16.99, oldPrice: null, rating: 4.5, reviews: 54, badge: "New", stock: 48,
    image: "assets/img/glitter-nails.png",
    images: ["assets/img/glitter-nails.png"],
    reviewList: []
  },
  {
    id: 37, category: "Nail Care",
    title: "Professional Nail Art Toolkit",
    description: "Complete nail art set with dotting tools, striping brushes, stamping plates, stamps and gel pens.",
    ingredients: "N/A – Non-consumable toolkit.",
    price: 24.99, oldPrice: 34.99, rating: 4.4, reviews: 63, badge: "Sale", stock: 30,
    image: "assets/img/nail-kit.png",
    images: ["assets/img/nail-kit.png"],
    reviewList: []
  },
  {
    id: 38, category: "Nail Care",
    title: "Cuticle Nourishing Almond Oil",
    description: "Nourishing oil dropper designed to soothe dry, damaged cuticles and strengthen nail roots.",
    ingredients: "Prunus Amygdalus Dulcis Oil, Vitamin E, Jojoba Oil, Essential Oils.",
    price: 9.99, oldPrice: null, rating: 4.8, reviews: 42, badge: "Best Seller", stock: 50,
    image: "assets/img/cuticle-oil.png",
    images: ["assets/img/cuticle-oil.png"],
    reviewList: []
  },
  {
    id: 39, category: "Nail Care",
    title: "Nail Strengthener & Base Coat",
    description: "Calcium-rich formula that reinforces weak nails, preventing peeling, splitting and cracking.",
    ingredients: "Ethyl Acetate, Butyl Acetate, Calcium Pantothenate, Hydrolyzed Wheat Protein.",
    price: 11.99, oldPrice: 15.00, rating: 4.6, reviews: 34, badge: "New", stock: 40,
    image: "assets/img/nail-straightner.png",
    images: ["assets/img/nail-straightner.png"],
    reviewList: []
  },
  {
    id: 40, category: "Nail Care",
    title: "Matte Finish Velvet Top Coat",
    description: "Instantly transforms any high-gloss nail polish color into a trendy, smooth matte velvet finish.",
    ingredients: "Ethyl Acetate, Silica, Nitrocellulose, Isopropyl Alcohol.",
    price: 10.50, oldPrice: null, rating: 4.5, reviews: 29, badge: null, stock: 55,
    image: "assets/img/matte-coat.png",
    images: ["assets/img/matte-coat.png"],
    reviewList: []
  },
  {
    id: 41, category: "Nail Care",
    title: "Rapid Dry Top Coat Spray",
    description: "Convenient quick-dry spray that sets nail polish in 60 seconds with brilliant glass shine.",
    ingredients: "Disiloxane, Ethylhexyl Palmitate, Fragrance.",
    price: 13.99, oldPrice: 18.00, rating: 4.4, reviews: 49, badge: "Sale", stock: 35,
    image: "assets/img/top-coat.png",
    images: ["assets/img/top-coat.png"],
    reviewList: []
  },
  {
    id: 42, category: "Nail Care",
    title: "Holographic Glitter Flakes set",
    description: "Premium nail art glitters set containing 6 pots of light-catching holographic flakes.",
    ingredients: "Polyethylene Terephthalate, Acrylic Copolymer, Glitter pigments.",
    price: 15.00, oldPrice: null, rating: 4.6, reviews: 23, badge: null, stock: 28,
    image: "assets/img/flakes-set.png",
    images: ["assets/img/flakes-set.png"],
    reviewList: []
  },
  {
    id: 43, category: "Nail Care",
    title: "Organic Acetone-Free Remover",
    description: "Gentle formulation that removes polish without drying skin or damaging natural nails.",
    ingredients: "Ethyl Lactate, Soybean Oil, Rosemary Extract, Vitamin E.",
    price: 8.99, oldPrice: 11.99, rating: 4.7, reviews: 92, badge: "Best Seller", stock: 80,
    image: "assets/img/nail-remover.png",
    images: ["assets/img/nail-remover.png"],
    reviewList: []
  },
  {
    id: 44, category: "Nail Care",
    title: "Hydrating Hand & Nail Cream",
    description: "Shea butter base moisturizer cream designed to heal cracks on hands and lock hydration in nails.",
    ingredients: "Water, Shea Butter, Glycerin, Macadamia Nut Oil, Urea.",
    price: 14.99, oldPrice: 18.00, rating: 4.8, reviews: 54, badge: "New", stock: 35,
    image: "assets/img/hand-cream.png",
    images: ["assets/img/hand-cream.png"],
    reviewList: []
  },

  // ─── JEWELLERY (45-51) ───
  {
    id: 45, category: "Jewellery",
    title: "Crystal Statement Earrings",
    description: "Sparkling Swarovski-inspired crystal drop earrings — the perfect statement piece for any occasion.",
    ingredients: "N/A – Jewellery item.",
    price: 34.99, oldPrice: null, rating: 4.9, reviews: 175, badge: "Premium", stock: 20,
    image: "assets/img/crystal-earrings.png",
    images: ["assets/img/crystal-earrings.png"],
    reviewList: []
  },
  {
    id: 46, category: "Jewellery",
    title: "18K Gold Layered Necklace",
    description: "Delicate 18K gold-plated layered chain necklace with minimalist charm — effortlessly chic.",
    ingredients: "N/A – Jewellery item.",
    price: 44.99, oldPrice: 59.99, rating: 4.7, reviews: 89, badge: "Sale", stock: 16,
    image: "assets/img/gold-necklace.png",
    images: ["assets/img/gold-necklace.png"],
    reviewList: []
  },
  {
    id: 47, category: "Jewellery",
    title: "Freshwater Pearl Bracelet",
    description: "Elegant freshwater pearl stretch bracelet with sterling silver beads — timeless beauty.",
    ingredients: "N/A – Jewellery item.",
    price: 29.99, oldPrice: 39.99, rating: 4.7, reviews: 66, badge: "Sale", stock: 22,
    image: "assets/img/bracelet.png",
    images: ["assets/img/bracelet.png"],
    reviewList: []
  },
  {
    id: 48, category: "Jewellery",
    title: "Rose Gold Stackable Ring Set",
    description: "Set of 5 stackable rose gold plated rings — minimalist, elegant and adjustable for any finger size.",
    ingredients: "N/A – Jewellery item.",
    price: 22.99, oldPrice: 29.99, rating: 4.8, reviews: 134, badge: "Sale", stock: 38,
    image: "assets/img/rings.png",
    images: ["assets/img/rings.png"],
    reviewList: []
  },
  {
    id: 49, category: "Jewellery",
    title: "Vintage Emerald Pendant Necklace",
    description: "Stunning simulated oval emerald necklace surrounded by micropave CZ stones in 14K yellow gold.",
    ingredients: "N/A – Jewellery item.",
    price: 55.00, oldPrice: 75.00, rating: 4.9, reviews: 45, badge: "Premium", stock: 10,
    image: "assets/img/necklace.png",
    images: ["assets/img/necklace.png"],
    reviewList: []
  },
  {
    id: 50, category: "Jewellery",
    title: "Hoop Earring Trio Set",
    description: "Three pairs of classic gold-plated hoop earrings in small, medium, and large sizing.",
    ingredients: "N/A – Jewellery item.",
    price: 19.99, oldPrice: null, rating: 4.6, reviews: 72, badge: "New", stock: 25,
    image: "assets/img/hoops.png",
    images: ["assets/img/hoops.png"],
    reviewList: []
  },
  {
    id: 51, category: "Jewellery",
    title: "Minimalist Silver Cuff Bracelet",
    description: "Slim, adjustable 925 sterling silver cuff featuring a polished mirror finish.",
    ingredients: "N/A – Jewellery item.",
    price: 38.00, oldPrice: 48.00, rating: 4.8, reviews: 54, badge: "Sale", stock: 14,
    image: "assets/img/silver-bracelet.png",
    images: ["assets/img/silver-bracelet.png"],
    reviewList: []
  },

  // ─── WEDDING KITS (52-56) ───
  {
    id: 52, category: "Wedding Kit",
    title: "Complete Bridal Beauty Kit",
    description: "All-in-one luxury bridal beauty collection — makeup, skincare & fragrance for your perfect wedding day.",
    ingredients: "Multiple products included. See individual product labels for ingredients.",
    price: 89.99, oldPrice: 119.99, rating: 5.0, reviews: 52, badge: "Exclusive", stock: 12,
    image: "assets/img/bridal kit.png",
    images: ["assets/img/bridal kit.png"],
    reviewList: []
  },
  {
    id: 53, category: "Wedding Kit",
    title: "Bridal Radiance Skincare Set",
    description: "Pre-wedding skincare prep bundle — cleanser, serum, mask & SPF 50 moisturizer for bridal glow.",
    ingredients: "Multiple skincare products included. All cruelty-free and dermatologist-tested.",
    price: 64.99, oldPrice: 84.99, rating: 4.9, reviews: 41, badge: "Exclusive", stock: 15,
    image: "assets/img/skin-care.png",
    images: ["assets/img/skin-care.png"],
    reviewList: []
  },
  {
    id: 54, category: "Wedding Kit",
    title: "Luxury Groom Grooming Essentials",
    description: "Curated collection of sandalwood beard oil, dynamic face wash, premium moisturizer and comb set.",
    ingredients: "Shaving cream, beard wash, sandlewood oil, multi-active face lotion.",
    price: 49.99, oldPrice: 65.00, rating: 4.8, reviews: 30, badge: "New", stock: 20,
    image: "assets/img/groom-essentials.png",
    images: ["assets/img/groom-essentials.png"],
    reviewList: []
  },
  {
    id: 55, category: "Wedding Kit",
    title: "Luxury Bridesmaids Lip Set",
    description: "Set of 6 matching velvet matte mini lipsticks in gorgeous rose hues, packaged in a custom gold gift box.",
    ingredients: "Dimethicone, Silica, Beeswax, Essential Oil Fragrances, Red Dye.",
    price: 36.00, oldPrice: 48.00, rating: 4.7, reviews: 33, badge: "Sale", stock: 18,
    image: "assets/img/lipstick-kit.png",
    images: ["assets/img/lipstick-kit.png"],
    reviewList: []
  },
  {
    id: 56, category: "Wedding Kit",
    title: "Bridal Scented Fragrance Set",
    description: "Luxury set of two rollerball perfume oils infused with fresh jasmine, vanilla and rose petals.",
    ingredients: "Jasmine Essential Oil, Vanilla Extract, Rosehip Oil, Botanical Alcohol.",
    price: 45.00, oldPrice: null, rating: 4.9, reviews: 26, badge: "Premium", stock: 10,
    image: "assets/img/perfume-set.png",
    images: ["assets/img/perfume-set.png"],
    reviewList: []
  },

  // ─── UPCOMING PRODUCTS (57-60) ───
  {
    id: 57, category: "Upcoming",
    title: "Collagen Lip Plumper Serum",
    description: "Coming soon! Next-gen collagen peptide lip serum that plumps, hydrates and defines lips naturally.",
    ingredients: "Details will be revealed at launch.",
    price: 29.99, oldPrice: null, rating: null, reviews: null, badge: "Coming Soon",
    stock: 0, image: "assets/img/lip-serum.png",
    images: ["assets/img/lip-serum.png"],
    upcoming: true, launchDate: "August 2026", reviewList: []
  },
  {
    id: 58, category: "Upcoming",
    title: "AI Skin Analysis Serum Kit",
    description: "Coming soon! Revolutionary personalised serum system tailored to your unique skin DNA profile.",
    ingredients: "Details will be revealed at launch.",
    price: 79.99, oldPrice: null, rating: null, reviews: null, badge: "Coming Soon",
    stock: 0, image: "assets/img/skin-serum.png",
    images: ["assets/img/skin-serum.png"],
    upcoming: true, launchDate: "September 2026", reviewList: []
  },
  {
    id: 59, category: "Upcoming",
    title: "Diamond-Infused Face Cream",
    description: "Coming soon! Ultra-luxury face cream infused with real diamond powder for the ultimate skin transformation.",
    ingredients: "Details will be revealed at launch.",
    price: 149.99, oldPrice: null, rating: null, reviews: null, badge: "Coming Soon",
    stock: 0, image: "assets/img/skin-cream.png",
    images: ["assets/img/skin-cream.png"],
    upcoming: true, launchDate: "October 2026", reviewList: []
  },
  {
    id: 60, category: "Upcoming",
    title: "Smart Hair Color Applicator",
    description: "Coming soon! App-controlled smart hair color device for perfect, mess-free salon colour at home.",
    ingredients: "Details will be revealed at launch.",
    price: 59.99, oldPrice: null, rating: null, reviews: null, badge: "Coming Soon",
    stock: 0, image: "assets/img/hair-color.png",
    images: ["assets/img/hair-color.png"],
    upcoming: true, launchDate: "November 2026", reviewList: []
  }
];

// ────────────────────────────────────────────────
//  BADGE COLORS
// ────────────────────────────────────────────────
var badgeColors = {
  'Best Seller': '#66714C', 'New': '#4caf87', 'Sale': '#e05c5c',
  'Premium': '#9c6db5', 'Exclusive': '#b8860b', 'Coming Soon': '#3a86ff'
};

// ────────────────────────────────────────────────
//  CART (LocalStorage)
// ────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('beautyCart')) || [];

function saveCart() { localStorage.setItem('beautyCart', JSON.stringify(cart)); }

function updateCartCount() {
  var total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = total;
    el.style.transform = 'scale(1.4)';
    setTimeout(() => el.style.transform = 'scale(1)', 300);
  });
}

function showToast(name) {
  var toast = document.getElementById('cartToast');
  if (!toast) return;
  toast.querySelector('span') && (toast.querySelector('span').textContent = `"${name}" added to cart!`);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function addToCart(productId, qty = 1) {
  var p = productsData.find(x => x.id === productId);
  if (!p || p.upcoming) return;
  var ex = cart.find(i => i.id === productId);
  if (ex) ex.qty += qty;
  else cart.push({ id: p.id, title: p.title, price: p.price, qty, image: p.image, category: p.category });
  saveCart();
  updateCartCount();
  showToast(p.title);
  var btn = document.querySelector(`[data-id="${productId}"].add-to-cart-btn`);
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
    btn.classList.add('added');
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-bag-shopping"></i> Add to Cart';
      btn.classList.remove('added');
    }, 2000);
  }
}

// ────────────────────────────────────────────────
//  WISHLIST (LocalStorage)
// ────────────────────────────────────────────────
let wishlist = JSON.parse(localStorage.getItem('beautyWishlist')) || [];

function saveWishlist() { localStorage.setItem('beautyWishlist', JSON.stringify(wishlist)); }

function updateWishlistCount() {
  document.querySelectorAll('#wishlistCount').forEach(el => el.textContent = wishlist.length);
}

function toggleWishlistProduct(productId) {
  var p = productsData.find(x => x.id === productId);
  if (!p) return;
  var idx = wishlist.findIndex(i => i.id === productId);
  if (idx > -1) wishlist.splice(idx, 1);
  else wishlist.push({ id: p.id, title: p.title, price: p.price, image: p.image });
  saveWishlist();
  updateWishlistCount();
}

function isWishlisted(productId) {
  return wishlist.some(i => i.id === productId);
}

// ────────────────────────────────────────────────
//  STARS
// ────────────────────────────────────────────────
function renderStars(rating) {
  if (!rating) return '';
  let s = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) s += '<i class="fa-solid fa-star"></i>';
    else if (i - rating < 1) s += '<i class="fa-solid fa-star-half-stroke"></i>';
    else s += '<i class="fa-regular fa-star"></i>';
  }
  return s;
}

// ────────────────────────────────────────────────
//  COLOR SWATCHES
// ────────────────────────────────────────────────
function renderColorSwatches(colors, productId) {
  if (!colors || !colors.length) return '';
  var dots = colors.map((c, i) =>
    `<span class="color-dot" style="background:${c.hex}" title="${c.name}"
      data-pid="${productId}" data-cname="${c.name}" data-chex="${c.hex}"
      onclick="selectColor(this)">${i === 0 ? '<i class="fa-solid fa-check color-check"></i>' : ''}</span>`
  ).join('');
  return `<div class="color-swatches">
    <span class="color-dropper-icon"><i class="fa-solid fa-eye-dropper"></i></span>
    <div class="swatch-dots">${dots}</div>
    <span class="selected-color-name" id="color-label-${productId}" style="background:${colors[0].hex}">${colors[0].name}</span>
  </div>`;
}

function selectColor(el) {
  var pid = el.getAttribute('data-pid');
  var name = el.getAttribute('data-cname');
  var hex = el.getAttribute('data-chex');
  el.closest('.swatch-dots').querySelectorAll('.color-dot').forEach(d => d.innerHTML = '');
  el.innerHTML = '<i class="fa-solid fa-check color-check"></i>';
  var label = document.getElementById(`color-label-${pid}`);
  if (label) { label.textContent = name; label.style.background = hex; }
}

// ────────────────────────────────────────────────
//  RENDER PRODUCT CARDS
// ────────────────────────────────────────────────
function renderProducts(list, containerId = 'productContainer') {
  var container = document.getElementById(containerId);
  var noResults = document.getElementById('noResults');
  var resultsTxt = document.getElementById('resultsText');
  if (!container) return;
  container.innerHTML = '';

  if (noResults) noResults.style.display = list.length === 0 ? 'flex' : 'none';
  if (resultsTxt) resultsTxt.textContent = list.length === 0 ? '0 products found' : `Showing ${list.length} product${list.length > 1 ? 's' : ''}`;

  list.forEach((p, idx) => {
    var card = document.createElement('div');
    card.className = `product-card${p.upcoming ? ' upcoming-card' : ''}`;
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', `${(idx % 4) * 80}`);

    var starsHtml = p.rating
      ? `<div class="product-stars">${renderStars(p.rating)}<span class="review-count">(${p.reviews})</span></div>`
      : `<div class="product-stars upcoming-text"><i class="fa-solid fa-clock"></i> Launching ${p.launchDate}</div>`;

    var actionBtn = p.upcoming
      ? `<button class="add-to-cart-btn notify-btn" onclick="notifyMe(${p.id})"><i class="fa-solid fa-bell"></i> Notify Me</button>`
      : `<button class="add-to-cart-btn" data-id="${p.id}" onclick="addToCart(${p.id})"><i class="fa-solid fa-bag-shopping"></i> Add to Cart</button>`;

    var isWL = isWishlisted(p.id);

    card.innerHTML = `
      ${p.badge ? `<span class="product-badge" style="background:${badgeColors[p.badge] || '#66714C'}">${p.badge}</span>` : ''}
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <div class="product-overlay">
          <button class="overlay-btn" onclick="openQuickView(${p.id})" title="Quick View"><i class="fa-solid fa-eye"></i></button>
          <button class="overlay-btn${isWL ? ' wished' : ''}" onclick="handleWishlistToggle(this,${p.id})" title="Wishlist">
            <i class="fa-${isWL ? 'solid' : 'regular'} fa-heart"></i>
          </button>
        </div>
        ${p.upcoming ? '<div class="upcoming-label"><i class="fa-solid fa-rocket"></i> Coming Soon</div>' : ''}
      </div>
      <div class="product-body">
        <span class="product-cat-tag">${p.category}</span>
        <h3><a href="product-detail.html?id=${p.id}" style="color:inherit;text-decoration:none;">${p.title}</a></h3>
        <p>${p.description.substring(0, 90)}...</p>
        ${renderColorSwatches(p.colors, p.id)}
        ${starsHtml}
        <div class="product-price-row">
          <h4 class="product-price">${p.upcoming ? 'Est. ' : ''}$${p.price.toFixed(2)}</h4>
          ${p.oldPrice ? `<span class="old-price">$${p.oldPrice.toFixed(2)}</span>` : ''}
          ${p.oldPrice ? `<span class="discount-pct">${Math.round((1 - p.price / p.oldPrice) * 100)}% OFF</span>` : ''}
        </div>
        ${actionBtn}
      </div>`;
    container.appendChild(card);
  });
}

function handleWishlistToggle(btn, productId) {
  toggleWishlistProduct(productId);
  var isWL = isWishlisted(productId);
  btn.classList.toggle('wished', isWL);
  btn.querySelector('i').className = `fa-${isWL ? 'solid' : 'regular'} fa-heart`;
}

function notifyMe(id) {
  var p = productsData.find(x => x.id === id);
  var toast = document.getElementById('cartToast');
  if (toast) {
    toast.querySelector('span').textContent = `You'll be notified when "${p.title}" launches!`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

// ────────────────────────────────────────────────
//  QUICK VIEW MODAL
// ────────────────────────────────────────────────
function openQuickView(productId) {
  var p = productsData.find(x => x.id === productId);
  if (!p) return;
  var modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('#qvImg').src = p.image;
  modal.querySelector('#qvCat').textContent = p.category;
  modal.querySelector('#qvTitle').textContent = p.title;
  modal.querySelector('#qvStars').innerHTML = renderStars(p.rating) + (p.reviews ? ` (${p.reviews})` : '');
  modal.querySelector('#qvPrice').textContent = `$${p.price.toFixed(2)}`;
  modal.querySelector('#qvDesc').textContent = p.description;
  modal.querySelector('#qvAddCart').setAttribute('onclick', `addToCart(${p.id}); closeQuickView();`);
  modal.querySelector('#qvDetail').href = `product-detail.html?id=${p.id}`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  var modal = document.getElementById('quickViewModal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}

// ────────────────────────────────────────────────
//  FILTER, SEARCH, SORT
// ────────────────────────────────────────────────
let activeCategory = 'All';
let maxPrice = 999;
let sortBy = 'default';

function filterProducts() {
  var q = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  var px = parseFloat(document.getElementById('priceRange')?.value || 999);
  var sb = document.getElementById('sortSelect')?.value || 'default';

  let list = [...productsData];
  if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory);
  if (q) list = list.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
  list = list.filter(p => p.price <= px);

  if (sb === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (sb === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (sb === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sb === 'name') list.sort((a, b) => a.title.localeCompare(b.title));

  renderProducts(list);
  if (typeof AOS !== 'undefined') AOS.refresh();
}

// ────────────────────────────────────────────────
//  INIT (Products Page)
// ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateWishlistCount();

  /* Only run on products page */
  if (!document.getElementById('productContainer')) return;

  var urlParams = new URLSearchParams(window.location.search);
  var catParam = urlParams.get('cat');
  if (catParam) activeCategory = catParam;

  renderProducts(productsData);

  /* Category filter buttons */
  var filterBtns = document.querySelectorAll('[data-category]');
  filterBtns.forEach(btn => {
    if (btn.getAttribute('data-category') === activeCategory) {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      filterProducts();
    });
  });

  if (catParam) filterProducts();

  /* Search */
  document.getElementById('searchInput')?.addEventListener('input', filterProducts);

  /* Price range */
  var priceRange = document.getElementById('priceRange');
  var priceLabel = document.getElementById('priceLabel');
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      if (priceLabel) priceLabel.textContent = `$${priceRange.value}`;
      filterProducts();
    });
  }

  /* Sort */
  document.getElementById('sortSelect')?.addEventListener('change', filterProducts);
});



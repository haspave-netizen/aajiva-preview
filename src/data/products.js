// Real products from aajiva.com (Oct 2026). Names & prices as listed on the store.
// model: which procedural 3D builder renders the piece.
export const PRODUCTS = [
  // ── Central Counter — bestsellers ──
  {
    id: 'papillon',
    name: 'Papillon Sapphire Butterfly Necklace & Earring Set',
    price: 3870, mrp: 4300,
    category: 'set', model: 'set', gem: 'sapphire',
    zone: 'central',
    blurb: 'Butterfly wings in sapphire blue, made for days that turn into evenings.',
  },
  {
    id: 'blossom',
    name: 'Blossom Bridal Floral Necklace & Earring Set',
    price: 3329, mrp: 3699,
    category: 'set', model: 'set', gem: 'pearl',
    zone: 'central',
    blurb: 'A floral spray of petals and pearl — festive without trying too hard.',
  },
  {
    id: 'meadow',
    name: 'Meadow Emerald & Citrine Halo Necklace & Earring Set',
    price: 2699, mrp: 2999,
    category: 'set', model: 'set', gem: 'emerald',
    zone: 'central',
    blurb: 'Emerald green with a warm citrine halo. Meadow, distilled into silver.',
  },
  {
    id: 'azura',
    name: 'Azura Sapphire Butterfly Necklace & Earring Set',
    price: 3149, mrp: 3499,
    category: 'set', model: 'set', gem: 'sapphire',
    zone: 'central',
    blurb: 'A second take on the butterfly — deeper blue, softer lines.',
  },
  // ── Necklace Gallery ──
  {
    id: 'flower-halo',
    name: 'Flower Halo Solitaire Pendant Necklace',
    price: 4815, mrp: 5500,
    category: 'necklace', model: 'pendant', gem: 'diamond',
    zone: 'gallery',
    blurb: 'One solitaire, ringed by petals. The necklace that goes with everything.',
  },
  {
    id: 'pearl-floating',
    name: 'Single Pearl Floating Necklace',
    price: 2780, mrp: 2999,
    category: 'necklace', model: 'pearl-necklace', gem: 'pearl',
    zone: 'gallery',
    blurb: 'A single pearl suspended on a fine chain — quiet, certain, yours.',
  },
  {
    id: 'ruby-heart',
    name: 'Ruby Heart Pendant Necklace',
    price: 4016, mrp: 5999,
    category: 'necklace', model: 'heart-pendant', gem: 'ruby',
    zone: 'gallery',
    blurb: 'A small ruby heart. Not loud about it — just there, every day.',
  },
  // ── Ring Bar ──
  {
    id: 'open-solitaire',
    name: 'Open Solitaire Pavé Ring',
    price: 711, mrp: 1030,
    category: 'ring', model: 'ring', gem: 'diamond',
    zone: 'rings',
    blurb: 'An open band with a single pavé-set stone. Light on the finger.',
  },
  {
    id: 'tapered-wrap',
    name: 'Tapered Pavé Wrap Ring',
    price: 1329, mrp: 1843,
    category: 'ring', model: 'wrap-ring', gem: 'diamond',
    zone: 'rings',
    blurb: 'A band that wraps and tapers, scattered with pavé sparkle.',
  },
  {
    id: 'double-infinity',
    name: 'Double Infinity Pavé Ring',
    price: 1273, mrp: 1648,
    category: 'ring', model: 'infinity-ring', gem: 'diamond',
    zone: 'rings',
    blurb: 'Two infinity loops, one ring. A small promise you wear daily.',
  },
  // ── The Women's Edit ──
  {
    id: 'baguette-eternity',
    name: 'Baguette & Round Bezel Eternity Ring',
    price: 855, mrp: 1509,
    category: 'ring', model: 'eternity-ring', gem: 'diamond',
    zone: 'edits',
    blurb: 'Baguettes and rounds, set all the way around. No occasion needed.',
  },
  {
    id: 'princess-halo',
    name: 'Princess Cut Halo Ring',
    price: 1236, mrp: 1600,
    category: 'ring', model: 'halo-ring', gem: 'diamond',
    zone: 'edits',
    blurb: 'A princess-cut centre framed by a bright halo of silver and stone.',
  },
  // ── The Men's Edit ──
  {
    id: 'onyx-bar',
    name: "Onyx Cord Bar-Link Men's Bracelet",
    price: 9655, mrp: 10728,
    category: 'bracelet', model: 'onyx-bracelet', gem: 'onyx',
    zone: 'edits',
    blurb: 'Black onyx on cord with a silver bar. Understated, individual.',
  },
  {
    id: 'titan-chain',
    name: "Titan Chunky Chain Link Men's Bracelet",
    price: 11322, mrp: null,
    category: 'bracelet', model: 'chain-bracelet', gem: null,
    zone: 'edits',
    blurb: 'A chunky silver chain with real weight. Worn, not kept.',
  },
  // ── Gifting Lounge ──
  {
    id: 'emerald-isle',
    name: 'Emerald Isle Round Halo Necklace & Earring Set',
    price: 2659, mrp: 2799,
    category: 'set', model: 'set', gem: 'emerald',
    zone: 'gifting',
    blurb: 'A round emerald halo set, boxed and ready to give.',
  },
  {
    id: 'verde',
    name: 'Verde Emerald Star Blossom Necklace & Earring Set',
    price: 2849, mrp: 2999,
    category: 'set', model: 'set', gem: 'citrine',
    zone: 'gifting',
    blurb: 'Star-cut blossoms in warm green and gold-toned sparkle.',
  },
];

export const productById = (id) => PRODUCTS.find((p) => p.id === id);

export const formatINR = (n) =>
  '₹' + n.toLocaleString('en-IN');

export const ZONES = [
  {
    id: 'entrance',
    name: 'Entrance',
    tagline: 'The boutique, from the street',
    blurb: 'Glass doors, a brushed-silver sign, and warm light. Step in.',
    view: { pos: [0, 1.7, 11.2], look: [0, 1.9, 4.5] },
  },
  {
    id: 'central',
    name: 'Central Counter',
    tagline: 'Bestsellers, under glass',
    blurb: 'The pieces everyone reaches for first — butterfly sets, halos, florals — on sage velvet trays.',
    view: { pos: [0, 1.9, 4.4], look: [0, 1.0, -0.6] },
  },
  {
    id: 'rings',
    name: 'Ring Bar',
    tagline: 'Try them on, in your head',
    blurb: 'Solitaires, wraps and infinities on individual stands. Pick one up.',
    view: { pos: [-4.4, 1.7, -2.0], look: [-8.6, 1.25, -2.0] },
  },
  {
    id: 'gallery',
    name: 'Necklace Gallery',
    tagline: 'Pendants at eye level',
    blurb: 'Solitaire halos, a floating pearl, a ruby heart — displayed on busts like a real atelier.',
    view: { pos: [0, 1.8, -3.0], look: [0, 1.45, -7.0] },
  },
  {
    id: 'edits',
    name: 'The Edits',
    tagline: 'For her · For him',
    blurb: 'Two alcoves: eternity and halo rings for her, onyx and chunky chain for him.',
    view: { pos: [3.0, 1.8, 0.3], look: [6.9, 1.05, 0.3] },
  },
  {
    id: 'gifting',
    name: 'Gifting Lounge',
    tagline: 'Boxed and ready',
    blurb: 'Sets chosen for giving — emerald halos and star blossoms, already on gift stands.',
    view: { pos: [-2.4, 1.8, 5.6], look: [-5.6, 1.0, 3.4] },
  },
];

export const zoneById = (id) => ZONES.find((z) => z.id === id);

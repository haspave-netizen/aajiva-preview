// Zone layout + camera views for the 3D boutique.
// Product content comes from src/data/catalog.js (the full 239-product
// aajiva.com feed). Per-zone product counts are derived live from data —
// never hardcoded here.

export const ZONES = [
  {
    id: 'entrance',
    name: 'Entrance',
    short: 'Entrance',
    tagline: 'The boutique, from the street',
    blurb: 'Glass doors, a brushed-gold sign, and warm light. Step in.',
    view: { pos: [0, 1.7, 11.2], look: [0, 1.9, 4.5] },
    // half of the storefront facade width the camera must keep in frame
    frameHalfWidth: 4.4,
  },
  {
    id: 'central',
    name: 'Central Counter',
    short: 'Counter',
    tagline: 'Bestsellers, under glass',
    blurb: 'The pieces everyone reaches for first — the biggest offers in the store, on velvet trays.',
    view: { pos: [0, 1.9, 4.4], look: [0, 1.0, -0.6] },
    frameHalfWidth: 2.6,
  },
  {
    id: 'rings',
    name: 'Ring Bar',
    short: 'Rings',
    tagline: 'Rings & toe rings, up close',
    blurb: 'Rings and toe rings from the real aajiva.com catalogue, framed on the bar wall. Tap any frame to pick it up.',
    view: { pos: [-4.4, 1.7, -2.0], look: [-8.6, 1.25, -2.0] },
    frameHalfWidth: 1.9,
  },
  {
    id: 'gallery',
    name: 'Necklace Gallery',
    short: 'Gallery',
    tagline: 'Pendants & earrings at eye level',
    blurb: 'Pendants and earrings from the real catalogue, displayed like a gallery wall. Tap any frame to pick it up.',
    view: { pos: [0, 1.8, -3.0], look: [0, 1.45, -7.0] },
    frameHalfWidth: 3.4,
  },
  {
    id: 'edits',
    name: 'The Edits',
    short: 'Edits',
    tagline: 'Bracelets · Anklets',
    blurb: 'Bracelets and anklets from the real catalogue — one wall for her, one for him. Tap any frame to pick it up.',
    view: { pos: [3.0, 1.8, 0.3], look: [6.9, 1.05, 0.3] },
    frameHalfWidth: 2.4,
  },
  {
    id: 'gifting',
    name: 'Gifting Lounge',
    short: 'Gifting',
    tagline: 'Sets & silver rakhis',
    blurb: 'Sets and silver rakhis chosen for giving — tap any frame to pick one up.',
    view: { pos: [-2.4, 1.8, 5.6], look: [-5.6, 1.0, 3.4] },
    frameHalfWidth: 1.8,
  },
];

export const zoneById = (id) => ZONES.find((z) => z.id === id);

// Rebuilds src/data/catalog.json from aajiva.com's public product feed.
// Slim FACTUAL fields only: id, title, handle, type, price, compareAt,
// available, collections/gender tags, image CDN urls. Body copy (body_html,
// descriptions) is intentionally NOT copied — blurbs stay short original lines.
// Run: node scripts/import-catalog.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const FEED = 'https://aajiva.com/products.json?limit=250';
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outPath = resolve(root, 'src/data/catalog.json');

const res = await fetch(FEED, { headers: { 'User-Agent': 'aajiva-boutique-preview/1.0' } });
if (!res.ok) throw new Error(`feed fetch failed: ${res.status} ${res.statusText}`);
const { products } = await res.json();
if (!Array.isArray(products) || products.length === 0) {
  throw new Error('feed returned no products');
}

const num = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
};

const items = products.map((p) => {
  const v = p.variants?.[0] || {};
  const collections = (p.tags || [])
    .filter((t) => t.startsWith('collection:'))
    .map((t) => t.slice('collection:'.length));
  const genderTag = (p.tags || []).find((t) => t.startsWith('gender:'));
  return {
    id: String(p.id),
    title: p.title,
    handle: p.handle,
    type: p.product_type || 'Other',
    price: num(v.price),
    compareAt: num(v.compare_at_price),
    available: v.available !== false,
    collections,
    gender: genderTag ? genderTag.slice('gender:'.length) : null,
    images: (p.images || []).map((i) => i.src).filter(Boolean),
  };
});

// hard validation — every product must have images (per the 2026-10-15 audit)
const missing = items.filter((p) => p.images.length === 0 || p.price == null);
if (missing.length > 0) {
  console.warn(`WARN: ${missing.length} products missing images/price:`);
  for (const m of missing.slice(0, 10)) console.warn('  -', m.handle);
}

const perType = {};
for (const p of items) perType[p.type] = (perType[p.type] || 0) + 1;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(
  outPath,
  JSON.stringify(
    {
      meta: {
        generatedAt: new Date().toISOString(),
        source: FEED,
        count: items.length,
        perType,
      },
      products: items,
    },
    null,
    1
  )
);
console.log(`catalog.json written: ${items.length} products`);
console.log(JSON.stringify(perType, null, 1));
if (missing.length > 0) console.log(`missing images/price: ${missing.length}`);

// Shelf paging shared by every zone display.
// Each zone shows SHELF_SIZE products per shelf page; the counter reads
// like "Bracelets · shelf 2 of 9 · 70 pieces".
export const SHELF_SIZE = 8;

export function shelfCount(total) {
  return Math.max(1, Math.ceil(total / SHELF_SIZE));
}

export function shelfSlice(products, shelf) {
  const start = Math.max(0, shelf) * SHELF_SIZE;
  return products.slice(start, start + SHELF_SIZE);
}

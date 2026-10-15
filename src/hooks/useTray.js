import { useEffect, useState } from 'react';

// Tray state. v2 key — the catalog ids replaced the old 16 procedural
// product ids, so the old v1 tray (keyed by those ids) is retired.
const KEY = 'aajiva-tray-v2';

export function useTray() {
  const [tray, setTray] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(tray));
    } catch { /* private mode */ }
  }, [tray]);

  const add = (id) => setTray((t) => ({ ...t, [id]: (t[id] || 0) + 1 }));
  const remove = (id) =>
    setTray((t) => {
      const next = { ...t };
      delete next[id];
      return next;
    });
  const setQty = (id, qty) =>
    setTray((t) => (qty <= 0 ? Object.fromEntries(Object.entries(t).filter(([k]) => k !== id)) : { ...t, [id]: qty }));

  const count = Object.values(tray).reduce((a, b) => a + b, 0);
  return { tray, add, remove, setQty, count };
}

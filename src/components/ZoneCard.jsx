import { useEffect, useState } from 'react';
import { zoneById } from '../data/products';
import { zoneProducts } from '../data/catalog';
import { shelfCount } from '../data/shelves';

/* Zone header: real product count per zone + DOM shelf pager.
 * Desktop/tablet: full card. Phones: compact collapsed header — tap to expand,
 * so the card never eats a third of the 3D view. */
export default function ZoneCard({ zoneId, isPhone, shelf, onShelf, zoneLabel }) {
  const zone = zoneById(zoneId);
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [zoneId]); // re-collapse when the zone changes
  if (!zone) return null;

  const total = zoneId === 'entrance' ? 0 : zoneProducts(zoneId).length;
  const shelves = shelfCount(total);
  const pager =
    total > 0 ? (
      <div className="flex items-center justify-between gap-2 mt-2">
        <button
          onClick={(e) => { e.stopPropagation(); onShelf((shelf + shelves - 1) % shelves); }}
          disabled={shelves <= 1}
          aria-label="Previous shelf"
          className="rounded-full w-10 h-10 flex items-center justify-center bg-charcoal-900 text-ivory-50 disabled:opacity-30 disabled:cursor-default text-lg"
        >
          ‹
        </button>
        <span className="text-[11px] font-semibold text-charcoal-700 text-center leading-tight">
          {zoneLabel}
          <br />
          <span className="text-charcoal-700/60">
            shelf {shelf + 1} of {shelves} · {total} pieces
          </span>
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onShelf((shelf + 1) % shelves); }}
          disabled={shelves <= 1}
          aria-label="Next shelf"
          className="rounded-full w-10 h-10 flex items-center justify-center bg-charcoal-900 text-ivory-50 disabled:opacity-30 disabled:cursor-default text-lg"
        >
          ›
        </button>
      </div>
    ) : null;

  if (!isPhone) {
    return (
      <div className="absolute top-4 left-4 md:right-auto md:max-w-xs z-20 animate-fade-up pointer-events-none">
        <div className="rounded-2xl bg-ivory-50/90 backdrop-blur-md border border-silver-300/60 shadow-lg px-5 py-4">
          <p className="text-[10px] tracking-[0.35em] uppercase text-sage-600 font-bold">{zone.tagline}</p>
          <h2 className="font-display text-2xl text-charcoal-900 mt-1">{zone.name}</h2>
          <p className="text-[13px] text-charcoal-700 mt-1 leading-relaxed">{zone.blurb}</p>
          {pager}
          <p className="text-[11px] text-charcoal-700/60 mt-2">✦ Tap a frame to pick it up</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute left-3 right-3 z-20 animate-fade-up"
      style={{ top: 'calc(0.75rem + env(safe-area-inset-top))' }}
    >
      <div className="rounded-2xl bg-ivory-50/92 backdrop-blur-md border border-silver-300/60 shadow-lg px-4 py-2.5">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full text-left"
        >
          <span className="flex items-center justify-between gap-2">
            <span className="min-w-0">
              <span className="block text-[9px] tracking-[0.3em] uppercase text-sage-600 font-bold truncate">
                {zone.tagline}
              </span>
              <span className="block font-display text-lg text-charcoal-900 leading-tight truncate">
                {zone.name}
              </span>
            </span>
            <span aria-hidden className="text-sage-600 text-xs shrink-0">{open ? '▲' : '▼'}</span>
          </span>
          {open && (
            <span className="block pt-1.5 max-h-[30dvh] overflow-y-auto thin-scroll">
              <span className="block text-[13px] text-charcoal-700 leading-relaxed">{zone.blurb}</span>
              <span className="block text-[11px] text-charcoal-700/60 mt-1.5">✦ Tap a frame to pick it up</span>
            </span>
          )}
        </button>
        {pager}
      </div>
    </div>
  );
}

// Full catalogue — searchable photo grid of ALL products.
// Opened from the nav ("All pieces"), and reused as the no-WebGL fallback
// content so low-end devices still get the whole shop.
import { useMemo, useState } from 'react';
import {
  CATALOG, TYPE_ORDER, typeCount, imgUrl, deepLink, formatINR,
  discountPct, blurbFor, TYPE_LABELS,
} from '../data/catalog';

function ProductCard({ product, onPick, onAdd, addedTick }) {
  return (
    <div className="rounded-2xl bg-night-900 border border-gold-500/15 overflow-hidden flex flex-col">
      <button
        onClick={() => onPick(product)}
        className="relative block w-full aspect-[3/4] bg-night-800 overflow-hidden"
        aria-label={`View ${product.title}`}
      >
        <img
          src={imgUrl(product.images[0], 400)}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {discountPct(product) > 0 && (
          <span className="absolute top-2 left-2 rounded-full bg-gold-400 text-night-950 text-[10px] font-extrabold px-2.5 py-1">
            {discountPct(product)}% OFF
          </span>
        )}
      </button>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-[9px] tracking-[0.25em] uppercase text-gold-300 font-bold">
          {TYPE_LABELS[product.type]} · 925 Silver
        </p>
        <p className="text-[12px] font-semibold text-ivory-50 leading-snug line-clamp-2 flex-1">
          {product.title}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg text-ivory-50">{formatINR(product.price)}</span>
          {product.compareAt && (
            <span className="text-ivory-400/60 line-through text-xs">{formatINR(product.compareAt)}</span>
          )}
        </div>
        <div className="mt-1.5 flex gap-2">
          <button
            onClick={() => onAdd(product.id)}
            className={`flex-1 rounded-full min-h-[40px] text-[11px] font-bold tracking-[0.12em] uppercase transition-colors ${
              addedTick === product.id
                ? 'bg-gold-400 text-night-950'
                : 'bg-night-700 text-ivory-50 hover:bg-night-800'
            }`}
          >
            {addedTick === product.id ? '✓ Added' : 'Add to tray'}
          </button>
          <a
            href={deepLink(product.handle)}
            target="_blank"
            rel="noreferrer"
            aria-label="Buy on aajiva.com"
            className="rounded-full min-w-[40px] min-h-[40px] px-3 flex items-center justify-center bg-night-700 text-ivory-50 text-sm font-bold hover:bg-night-800"
          >
            →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CatalogueView({ onClose, onPick, onAdd, showClose = true, inline = false }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [addedTick, setAddedTick] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATALOG.filter(
      (p) =>
        (type === 'All' || p.type === type) &&
        (!q || p.title.toLowerCase().includes(q))
    );
  }, [query, type]);

  const handleAdd = (id) => {
    onAdd(id);
    setAddedTick(id);
    setTimeout(() => setAddedTick((cur) => (cur === id ? null : cur)), 1400);
  };

  return (
    <div className={inline ? '' : 'absolute inset-0 z-30 bg-night-950 flex flex-col animate-fade-in'}>
      {inline ? (
        /* section header for the inline catalogue */
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold-300 font-bold">
            Search the full collection
          </p>
          <h2 className="section-title font-display text-ivory-50 mt-3">ALL PIECES</h2>
          <div className="gold-rule mt-6" />
        </div>
      ) : null}
      {/* header */}
      <div
        className={`shrink-0 bg-night-900/95 backdrop-blur border-b border-gold-500/15 ${
          inline ? '' : ''
        }`}
        style={inline ? undefined : { paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              {!inline && (
                <p className="text-[10px] tracking-[0.35em] uppercase text-gold-300 font-bold">
                  Aajiva · 925 Sterling Silver
                </p>
              )}
              {!inline && <h2 className="font-display text-2xl text-ivory-50">All pieces</h2>}
              {inline && (
                <p className="text-[12px] text-ivory-200/60">
                  Every piece, one list — {CATALOG.length} in all.
                </p>
              )}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                aria-label="Close catalogue"
                className="w-11 h-11 rounded-full bg-night-700 hover:bg-night-800 text-ivory-50 text-xl flex items-center justify-center shrink-0"
              >
                ×
              </button>
            )}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the collection…"
            className="mt-3 w-full rounded-full bg-night-800 border border-gold-500/25 px-5 py-3 text-sm text-ivory-50 placeholder:text-ivory-200/35 outline-none focus:border-gold-400"
          />
          <div className="mt-3 flex gap-2 overflow-x-auto thin-scroll pb-1 -mx-1 px-1">
            {['All', ...TYPE_ORDER].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-shrink-0 rounded-full px-4 min-h-[40px] text-[12px] font-semibold whitespace-nowrap transition-colors ${
                  type === t
                    ? 'bg-gold-400 text-night-950'
                    : 'bg-night-800 border border-gold-500/20 text-ivory-200/70 hover:border-gold-400/50'
                }`}
              >
                {t === 'All' ? `All · ${CATALOG.length}` : `${t} · ${typeCount(t)}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* grid */}
      <div className={inline ? '' : 'flex-1 overflow-y-auto thin-scroll'}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <p className="text-[12px] text-ivory-200/50 mb-3">
            {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
            {type !== 'All' ? ` in ${type}` : ''}
            {query.trim() ? ` matching “${query.trim()}”` : ''}
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-2xl text-ivory-200/80">Nothing found</p>
              <p className="text-sm text-ivory-200/50 mt-1">Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onPick={onPick} onAdd={handleAdd} addedTick={addedTick} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

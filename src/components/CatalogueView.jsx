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
    <div className="rounded-2xl bg-white border border-silver-300/60 shadow-sm overflow-hidden flex flex-col">
      <button
        onClick={() => onPick(product)}
        className="relative block w-full aspect-[3/4] bg-ivory-200 overflow-hidden"
        aria-label={`View ${product.title}`}
      >
        <img
          src={imgUrl(product.images[0], 400)}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {discountPct(product) > 0 && (
          <span className="absolute top-2 left-2 rounded-full bg-charcoal-900/90 text-ivory-50 text-[10px] font-bold px-2.5 py-1">
            −{discountPct(product)}%
          </span>
        )}
      </button>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-[9px] tracking-[0.25em] uppercase text-sage-600 font-bold">
          {TYPE_LABELS[product.type]} · 925 Silver
        </p>
        <p className="text-[12px] font-semibold text-charcoal-900 leading-snug line-clamp-2 flex-1">
          {product.title}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg text-charcoal-900">{formatINR(product.price)}</span>
          {product.compareAt && (
            <span className="text-silver-500 line-through text-xs">{formatINR(product.compareAt)}</span>
          )}
        </div>
        <div className="mt-1.5 flex gap-2">
          <button
            onClick={() => onAdd(product.id)}
            className={`flex-1 rounded-full min-h-[40px] text-[11px] font-bold tracking-[0.12em] uppercase transition-colors ${
              addedTick === product.id
                ? 'bg-sage-600 text-ivory-50'
                : 'bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800'
            }`}
          >
            {addedTick === product.id ? '✓ Added' : 'Add to tray'}
          </button>
          <a
            href={deepLink(product.handle)}
            target="_blank"
            rel="noreferrer"
            aria-label="Buy on aajiva.com"
            className="rounded-full min-w-[40px] min-h-[40px] px-3 flex items-center justify-center bg-ivory-200 text-charcoal-800 text-sm font-bold hover:bg-ivory-300"
          >
            →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CatalogueView({ onClose, onPick, onAdd, showClose = true }) {
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
    <div className="absolute inset-0 z-30 bg-ivory-100 flex flex-col animate-fade-in">
      {/* header */}
      <div
        className="shrink-0 bg-ivory-50/95 backdrop-blur border-b border-silver-300/60"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] tracking-[0.35em] uppercase text-sage-600 font-bold">
                Aajiva · 925 Sterling Silver
              </p>
              <h2 className="font-display text-2xl text-charcoal-900">All pieces</h2>
            </div>
            {showClose && (
              <button
                onClick={onClose}
                aria-label="Close catalogue"
                className="w-11 h-11 rounded-full bg-ivory-200 hover:bg-ivory-300 text-charcoal-800 text-xl flex items-center justify-center shrink-0"
              >
                ×
              </button>
            )}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the collection…"
            className="mt-3 w-full rounded-full bg-white border border-silver-300/70 px-5 py-3 text-sm text-charcoal-900 placeholder:text-charcoal-700/40 outline-none focus:border-sage-600"
          />
          <div className="mt-3 flex gap-2 overflow-x-auto thin-scroll pb-1 -mx-1 px-1">
            {['All', ...TYPE_ORDER].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-shrink-0 rounded-full px-4 min-h-[40px] text-[12px] font-semibold whitespace-nowrap transition-colors ${
                  type === t
                    ? 'bg-charcoal-900 text-ivory-50'
                    : 'bg-white border border-silver-300/70 text-charcoal-700 hover:bg-ivory-200'
                }`}
              >
                {t === 'All' ? `All · ${CATALOG.length}` : `${t} · ${typeCount(t)}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* grid */}
      <div className="flex-1 overflow-y-auto thin-scroll">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <p className="text-[12px] text-charcoal-700/60 mb-3">
            {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
            {type !== 'All' ? ` in ${type}` : ''}
            {query.trim() ? ` matching “${query.trim()}”` : ''}
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-2xl text-charcoal-700">Nothing found</p>
              <p className="text-sm text-charcoal-700/60 mt-1">Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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

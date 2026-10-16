import { useState } from 'react';
import { imgUrl, formatINR, discountPct, TYPE_LABELS } from '../data/catalog';

/* Shared dark tall product card: photo, name, price/MRP/badge, Add to tray.
 * Tap the photo → onPick(product) opens the pick-up view. */
export default function ProductCard({ product, onPick, onAdd, imgWidth = 600 }) {
  const [added, setAdded] = useState(false);
  const pct = discountPct(product);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="group flex flex-col rounded-2xl bg-night-900 border border-gold-500/15 overflow-hidden">
      <button
        onClick={() => onPick(product)}
        aria-label={`View ${product.title}`}
        className="relative block w-full aspect-[3/4] overflow-hidden bg-night-800 cursor-pointer"
      >
        <img
          src={imgUrl(product.images[0], imgWidth)}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night-950/60 via-transparent to-transparent pointer-events-none" />
        {pct > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-gold-400 text-night-950 text-[10px] font-extrabold px-2.5 py-1 tracking-wide">
            {pct}% OFF
          </span>
        )}
      </button>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-300 font-bold">
          {TYPE_LABELS[product.type] || product.type}
        </p>
        <p className="text-[14px] font-semibold text-ivory-50 leading-snug line-clamp-2 flex-1">
          {product.title}
        </p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-display text-xl text-ivory-50">{formatINR(product.price)}</span>
          {product.compareAt && (
            <span className="text-ivory-400/60 line-through text-[13px]">{formatINR(product.compareAt)}</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          className={`mt-2 rounded-full min-h-[44px] text-[11px] font-bold tracking-[0.18em] uppercase transition-colors ${
            added
              ? 'bg-gold-400 text-night-950'
              : 'border border-gold-500/40 text-gold-200 hover:bg-gold-400 hover:text-night-950'
          }`}
        >
          {added ? '✓ Added' : 'Add to tray'}
        </button>
      </div>
    </div>
  );
}

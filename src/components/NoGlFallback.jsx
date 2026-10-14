import { useState } from 'react';
import { PRODUCTS, ZONES, zoneById, formatINR } from '../data/products';
import { MODEL_LABELS } from '../three/models';

/*
 * Graceful no-WebGL fallback: a simple DOM "browse the pieces" list per zone,
 * wired to the same tray logic. Shown when WebGL is unsupported or the GPU
 * context was lost (with a "Try 3D again" retry). Also helps low-end phones.
 */
export default function NoGlFallback({ zoneId, onRetry, add }) {
  const zone = zoneById(zoneId) || ZONES[0];
  const pieces = PRODUCTS.filter((p) => p.zone === zone.id);
  const [addedId, setAddedId] = useState(null);

  const handleAdd = (id) => {
    add(id);
    setAddedId(id);
    setTimeout(() => setAddedId((cur) => (cur === id ? null : cur)), 1500);
  };

  return (
    <div className="absolute inset-0 z-[15] bg-ivory-100 overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 pt-24 pb-48">
        <div className="rounded-2xl bg-white border border-silver-300/70 shadow-md p-5 text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-sage-600 font-bold">
            3D view unavailable
          </p>
          <p className="font-display text-xl text-charcoal-900 mt-1">
            Your device couldn't start the 3D view
          </p>
          <p className="text-[13px] text-charcoal-700/70 mt-1 leading-relaxed">
            Nothing is broken — browse every piece below and add to your tray as usual.
          </p>
          <button
            onClick={onRetry}
            className="mt-3 rounded-full bg-charcoal-900 text-ivory-50 px-6 min-h-[44px] text-xs font-bold tracking-[0.2em] uppercase hover:bg-charcoal-800 transition-colors"
          >
            Try 3D again
          </button>
        </div>

        <h2 className="font-display text-2xl text-charcoal-900 mt-6">{zone.name}</h2>
        <p className="text-[12px] text-charcoal-700/60">{zone.tagline}</p>

        <div className="mt-4 space-y-3">
          {pieces.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-ivory-50 border border-silver-300/60 p-4 shadow-sm"
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-sage-600 font-bold">
                {MODEL_LABELS[p.model]} · 925 Sterling Silver
              </p>
              <p className="text-[14px] font-semibold text-charcoal-900 mt-1 leading-snug">
                {p.name}
              </p>
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-xl text-charcoal-900">
                    {formatINR(p.price)}
                  </span>
                  {p.mrp && (
                    <span className="text-silver-500 line-through text-sm">
                      {formatINR(p.mrp)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleAdd(p.id)}
                  className={`rounded-full px-5 min-h-[44px] text-xs font-bold tracking-[0.15em] uppercase transition-colors ${
                    addedId === p.id
                      ? 'bg-sage-600 text-ivory-50'
                      : 'bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800'
                  }`}
                >
                  {addedId === p.id ? '✓ Added' : 'Add to tray'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

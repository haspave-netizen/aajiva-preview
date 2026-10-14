import { zoneById } from '../data/products';

export default function ZoneCard({ zoneId }) {
  const zone = zoneById(zoneId);
  if (!zone) return null;
  return (
    <div className="absolute top-4 left-4 right-4 md:right-auto md:max-w-xs z-20 animate-fade-up pointer-events-none">
      <div className="rounded-2xl bg-ivory-50/90 backdrop-blur-md border border-silver-300/60 shadow-lg px-5 py-4">
        <p className="text-[10px] tracking-[0.35em] uppercase text-sage-600 font-bold">{zone.tagline}</p>
        <h2 className="font-display text-2xl text-charcoal-900 mt-1">{zone.name}</h2>
        <p className="text-[13px] text-charcoal-700 mt-1 leading-relaxed">{zone.blurb}</p>
        <p className="text-[11px] text-charcoal-700/60 mt-2">✦ Tap a piece to pick it up</p>
      </div>
    </div>
  );
}

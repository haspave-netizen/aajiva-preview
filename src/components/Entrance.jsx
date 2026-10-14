export default function Entrance({ onEnter }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between py-10 entrance-tight animate-fade-in"
      style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}
    >
      {/* top: welcome */}
      <div className="text-center px-6 w-full">
        <p className="text-[10px] min-[400px]:text-[11px] tracking-[0.3em] min-[400px]:tracking-[0.45em] uppercase text-charcoal-700/80 font-semibold">
          925 Sterling Silver · Skin-Safe
        </p>
        <h1 className="font-display entrance-title text-charcoal-900 mt-3">
          AAJIVA
        </h1>
        <p className="font-serif-alt italic entrance-tagline text-charcoal-700 mt-2">
          Silver for every day — a way of living
        </p>
      </div>
      {/* bottom: CTA */}
      <div
        className="pointer-events-auto flex flex-col items-center gap-3 px-6"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <button
          onClick={onEnter}
          className="group relative rounded-full bg-charcoal-900 text-ivory-50 pl-8 pr-6 min-h-[52px] py-4 text-sm font-bold tracking-[0.25em] uppercase shadow-2xl hover:bg-charcoal-800 transition-colors"
        >
          <span className="absolute inset-0 rounded-full bg-silver-400/30 animate-door-glow" />
          <span className="relative">Step inside →</span>
        </button>
        <p className="text-[11px] text-charcoal-700/70 tracking-wide">
          A 3D walk-in boutique · tap pieces to explore
        </p>
      </div>
    </div>
  );
}

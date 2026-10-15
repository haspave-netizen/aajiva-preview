// No-WebGL fallback: the 3D shop is unavailable, but the whole boutique
// is still browsable as the real-photo catalogue grid. Includes a
// "Try 3D again" retry for GPU context loss.
import CatalogueView from './CatalogueView';

export default function NoGlFallback({ onRetry, onPick, add }) {
  return (
    <div className="absolute inset-0 z-[15] bg-ivory-100 overflow-hidden flex flex-col">
      <div
        className="shrink-0 bg-charcoal-900 text-ivory-50 text-center px-4 pb-3"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <p className="text-[10px] tracking-[0.3em] uppercase text-silver-300 font-bold">
          3D view unavailable
        </p>
        <p className="text-[13px] mt-0.5 text-ivory-50/85">
          Your device couldn't start the 3D view — browse every real piece below.
        </p>
        <button
          onClick={onRetry}
          className="mt-2 rounded-full bg-ivory-50 text-charcoal-900 px-5 min-h-[40px] text-[11px] font-bold tracking-[0.2em] uppercase"
        >
          Try 3D again
        </button>
      </div>
      <div className="flex-1 min-h-0 relative">
        <CatalogueView showClose={false} onPick={onPick} onAdd={add} />
      </div>
    </div>
  );
}

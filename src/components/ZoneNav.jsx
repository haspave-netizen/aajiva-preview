import { ZONES } from '../data/products';

const ICONS = {
  entrance: '⌂',
  central: '◆',
  rings: '◎',
  gallery: '♡',
  edits: '✦',
  gifting: '❀',
};

/* Zone chips scroll in their own flex-1 lane; the "All pieces" and Tray
 * buttons are fixed siblings outside the scroll area, so they can never
 * be scrolled off-screen. */
export default function ZoneNav({ zoneId, onZone, trayCount, onTrayOpen, onCatalogueOpen }) {
  return (
    <nav
      className="absolute bottom-0 inset-x-0 z-20"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto max-w-3xl px-3 pb-3">
        <div className="rounded-2xl bg-ivory-50/90 backdrop-blur-md border border-silver-300/60 shadow-xl p-2 flex items-center gap-2">
          <div className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto thin-scroll">
            {ZONES.map((z) => (
              <button
                key={z.id}
                onClick={() => onZone(z.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 min-h-[44px] text-[12px] font-semibold transition-colors ${
                  zoneId === z.id
                    ? 'bg-charcoal-900 text-ivory-50'
                    : 'text-charcoal-700 hover:bg-ivory-200'
                }`}
              >
                <span aria-hidden>{ICONS[z.id]}</span>
                {/* short labels on very small screens, full names from 400px up */}
                <span className="min-[400px]:hidden">{z.short}</span>
                <span className="hidden min-[400px]:inline">{z.name}</span>
              </button>
            ))}
          </div>
          <button
            onClick={onCatalogueOpen}
            aria-label="Open the full catalogue"
            className="shrink-0 flex items-center gap-1.5 rounded-xl px-3 min-h-[44px] text-[12px] font-bold text-charcoal-800 bg-ivory-200 hover:bg-ivory-300 transition-colors"
          >
            <span aria-hidden>▦</span>
            <span className="hidden min-[400px]:inline">All pieces</span>
          </button>
          <button
            onClick={onTrayOpen}
            className="shrink-0 relative flex items-center gap-1.5 rounded-xl px-4 min-h-[44px] text-[12px] font-bold bg-sage-600 text-ivory-50 hover:bg-sage-800 transition-colors"
          >
            Tray
            {trayCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-charcoal-900 text-ivory-50 text-[10px] flex items-center justify-center">
                {trayCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

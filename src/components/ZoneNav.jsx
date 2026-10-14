import { ZONES } from '../data/products';

const ICONS = {
  entrance: '⌂',
  central: '◆',
  rings: '◎',
  gallery: '♡',
  edits: '✦',
  gifting: '❀',
};

export default function ZoneNav({ zoneId, onZone, trayCount, onTrayOpen }) {
  return (
    <nav className="absolute bottom-0 inset-x-0 z-20">
      <div className="mx-auto max-w-3xl px-3 pb-3">
        <div className="rounded-2xl bg-ivory-50/90 backdrop-blur-md border border-silver-300/60 shadow-xl px-2 py-2 flex items-center gap-1 overflow-x-auto thin-scroll">
          {ZONES.map((z) => (
            <button
              key={z.id}
              onClick={() => onZone(z.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition-colors ${
                zoneId === z.id
                  ? 'bg-charcoal-900 text-ivory-50'
                  : 'text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              <span aria-hidden>{ICONS[z.id]}</span>
              {z.name}
            </button>
          ))}
          <button
            onClick={onTrayOpen}
            className="ml-auto flex-shrink-0 relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold bg-sage-600 text-ivory-50 hover:bg-sage-800 transition-colors"
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

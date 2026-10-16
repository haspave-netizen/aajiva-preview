import { CATALOG } from '../data/catalog';

const LINKS = [
  ['Bestsellers', 'bestsellers'],
  ['Rings', 'rings'],
  ['Earrings', 'earrings'],
  ['Pendants', 'pendants'],
  ['Bracelets', 'bracelets'],
  ['Anklets', 'anklets'],
  ['Sets', 'sets'],
  ['Rakhi', 'rakhi'],
];

export default function TopBar({ trayCount, onTrayOpen }) {
  return (
    <header
      className="sticky top-0 z-40 bg-night-950/85 backdrop-blur-md border-b border-gold-500/15"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-3 h-16">
          <a href="#top" className="font-display text-2xl tracking-[0.28em] text-gold-200 shrink-0">
            AAJIVA
          </a>
          {/* desktop links */}
          <nav className="hidden md:flex items-center gap-6 mx-auto" aria-label="Collections">
            {LINKS.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-[12px] tracking-[0.18em] uppercase text-ivory-200/70 hover:text-gold-300 transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 md:ml-0 ml-auto">
            <a
              href="#all-pieces"
              className="rounded-full border border-gold-500/40 text-gold-200 text-[11px] font-bold tracking-[0.14em] uppercase px-4 min-h-[40px] flex items-center hover:bg-gold-400 hover:text-night-950 hover:border-gold-400 transition-colors"
            >
              All {CATALOG.length} pieces
            </a>
            <button
              onClick={onTrayOpen}
              className="relative rounded-full bg-gold-400 text-night-950 text-[11px] font-extrabold tracking-[0.14em] uppercase px-5 min-h-[40px] hover:bg-gold-300 transition-colors"
            >
              Tray
              {trayCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-6 h-6 px-1.5 rounded-full bg-ivory-50 text-night-950 text-[11px] font-extrabold flex items-center justify-center border border-gold-500/40">
                  {trayCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {/* mobile: scrollable category row */}
        <nav className="md:hidden flex gap-5 overflow-x-auto thin-scroll pb-3 -mt-1" aria-label="Collections">
          {LINKS.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="flex-shrink-0 text-[11px] tracking-[0.18em] uppercase text-ivory-200/70 hover:text-gold-300 py-2"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

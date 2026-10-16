import { productById, formatINR, imgUrl, deepLink, TYPE_LABELS } from '../data/catalog';

export default function TrayDrawer({ open, onClose, tray, setQty, remove, total }) {
  if (!open) return null;
  const items = Object.entries(tray)
    .map(([id, qty]) => ({ product: productById(id), qty }))
    .filter((x) => x.product);

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 bg-night-950/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-night-900 border-l border-gold-500/20 shadow-2xl flex flex-col animate-fade-up">
        <div className="p-5 border-b border-gold-500/15 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-ivory-50">Your Tray</h2>
            <p className="text-[12px] text-ivory-200/50">Pieces you're considering</p>
          </div>
          <button onClick={onClose} aria-label="Close tray" className="w-11 h-11 rounded-full bg-night-700 hover:bg-night-800 text-ivory-50 text-xl flex items-center justify-center">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto thin-scroll p-5 space-y-4">
          {items.length === 0 && (
            <div className="text-center pt-16">
              <p className="font-display text-4xl text-gold-500/60">◇</p>
              <p className="mt-3 text-ivory-50">Your tray is empty.</p>
              <p className="text-[13px] text-ivory-200/50 mt-1">Tap any piece to pick it up.</p>
            </div>
          )}
          {items.map(({ product, qty }) => (
            <div key={product.id} className="rounded-xl bg-night-800 border border-gold-500/15 p-4 flex gap-3">
              <img
                src={imgUrl(product.images[0], 120)}
                alt=""
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-night-700"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] tracking-[0.2em] uppercase text-gold-300 font-bold">
                  {TYPE_LABELS[product.type] || product.type}
                </p>
                <p className="text-[13px] font-semibold text-ivory-50 leading-snug">{product.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQty(product.id, qty - 1)} aria-label="Decrease quantity" className="w-10 h-10 rounded-full bg-night-700 hover:bg-night-800 text-ivory-50 font-bold text-lg">−</button>
                    <span className="text-sm font-bold w-5 text-center text-ivory-50">{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} aria-label="Increase quantity" className="w-10 h-10 rounded-full bg-night-700 hover:bg-night-800 text-ivory-50 font-bold text-lg">+</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg text-ivory-50">{formatINR(product.price * qty)}</span>
                    <button onClick={() => remove(product.id)} aria-label="Remove" className="text-ivory-200/40 hover:text-ivory-50 text-lg">×</button>
                  </div>
                </div>
                <a
                  href={deepLink(product.handle)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-1.5 text-[11px] font-semibold text-gold-300 underline underline-offset-4"
                >
                  Buy on aajiva.com →
                </a>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div
            className="p-5 border-t border-gold-500/15 space-y-3"
            style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-ivory-200/70">Tray total</span>
              <span className="font-display text-2xl text-gold-200">{formatINR(total)}</span>
            </div>
            <a
              href="https://aajiva.com"
              target="_blank"
              rel="noreferrer"
              className="block text-center rounded-full bg-gold-400 text-night-950 py-4 text-sm font-bold tracking-[0.25em] uppercase hover:bg-gold-300"
            >
              Checkout on aajiva.com →
            </a>
            <p className="text-[11px] text-center text-ivory-200/40">
              This preview doesn't take payments — checkout happens on aajiva.com.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

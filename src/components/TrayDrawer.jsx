import { PRODUCTS, productById, formatINR } from '../data/products';
import { MODEL_LABELS } from '../three/models';

export default function TrayDrawer({ open, onClose, tray, setQty, remove, total }) {
  if (!open) return null;
  const items = Object.entries(tray)
    .map(([id, qty]) => ({ product: productById(id), qty }))
    .filter((x) => x.product);

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 bg-charcoal-900/45 animate-fade-in" onClick={onClose} />
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-ivory-50 shadow-2xl flex flex-col animate-fade-up">
        <div className="p-5 border-b border-silver-300/60 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-charcoal-900">Your Tray</h2>
            <p className="text-[12px] text-charcoal-700/70">Pieces you're considering</p>
          </div>
          <button onClick={onClose} aria-label="Close tray" className="w-9 h-9 rounded-full bg-ivory-200 hover:bg-ivory-300 text-charcoal-800 text-lg">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto thin-scroll p-5 space-y-4">
          {items.length === 0 && (
            <div className="text-center pt-16">
              <p className="font-display text-4xl text-silver-400">◇</p>
              <p className="mt-3 text-charcoal-700">Your tray is empty.</p>
              <p className="text-[13px] text-charcoal-700/60 mt-1">Tap any piece in the boutique to pick it up.</p>
            </div>
          )}
          {items.map(({ product, qty }) => (
            <div key={product.id} className="rounded-xl bg-white border border-silver-300/60 p-4 flex gap-3">
              <div className="w-12 h-12 rounded-lg bg-sage-200 flex items-center justify-center font-display text-xl text-sage-800 flex-shrink-0">
                ◆
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] tracking-[0.2em] uppercase text-sage-600 font-bold">{MODEL_LABELS[product.model]}</p>
                <p className="text-[13px] font-semibold text-charcoal-900 leading-snug">{product.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQty(product.id, qty - 1)} className="w-7 h-7 rounded-full bg-ivory-200 hover:bg-ivory-300 font-bold">−</button>
                    <span className="text-sm font-bold w-5 text-center">{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} className="w-7 h-7 rounded-full bg-ivory-200 hover:bg-ivory-300 font-bold">+</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg">{formatINR(product.price * qty)}</span>
                    <button onClick={() => remove(product.id)} aria-label="Remove" className="text-silver-500 hover:text-charcoal-800 text-lg">×</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-silver-300/60 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-charcoal-700">Tray total</span>
              <span className="font-display text-2xl text-charcoal-900">{formatINR(total)}</span>
            </div>
            <a
              href="https://aajiva.com"
              target="_blank"
              rel="noreferrer"
              className="block text-center rounded-full bg-charcoal-900 text-ivory-50 py-4 text-sm font-bold tracking-[0.25em] uppercase hover:bg-charcoal-800"
            >
              Checkout on aajiva.com →
            </a>
            <p className="text-[11px] text-center text-charcoal-700/60">
              This preview doesn't take payments — checkout happens on aajiva.com.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

// Pick-up view — the REAL product photo on a soft studio backdrop with a
// realistic shadow. Drag gives a subtle physical tilt that springs back;
// pinch/wheel zooms the photo. Flipping price-tag, Add to tray and a
// "buy on aajiva.com" deep link stay.
import { useRef, useState, useCallback } from 'react';
import {
  imgUrl, deepLink, formatINR, discountPct, blurbFor, TYPE_LABELS,
} from '../data/catalog';

function PhotoStage({ product }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(1);
  const wrapRef = useRef(null);
  const tiltRef = useRef(null);
  const drag = useRef(null); // {startX,startY,tiltX,tiltY} or null
  const pinch = useRef(null); // {startDist, startZoom} or null
  const raf = useRef(0);

  const count = Math.max(product.images.length, 1);
  const src = imgUrl(product.images[active] || product.images[0], 1200);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const applyTilt = useCallback((tx, ty) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (tiltRef.current) {
        tiltRef.current.style.transform = `rotateX(${ty}deg) rotateY(${tx}deg) scale(${zoomRef.current})`;
      }
    });
  }, []);

  const springBack = useCallback(() => {
    if (!tiltRef.current) return;
    tiltRef.current.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.9, 0.25, 1.2)';
    tiltRef.current.style.transform = `rotateX(0deg) rotateY(0deg) scale(${zoomRef.current})`;
    setTimeout(() => {
      if (tiltRef.current) tiltRef.current.style.transition = '';
    }, 480);
  }, []);

  const pointers = useRef(new Map());

  const onPointerDown = (e) => {
    wrapRef.current?.setPointerCapture?.(e.pointerId);pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      const r = wrapRef.current.getBoundingClientRect();
      drag.current = {
        id: e.pointerId,
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        w: r.width,
        h: r.height,
      };
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = {
        startDist: Math.hypot(a.x - b.x, a.y - b.y),
        startZoom: zoomRef.current,
      };
      drag.current = null;
    }
  };

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current.startDist > 0) {
        const z = Math.min(3.5, Math.max(1, pinch.current.startZoom * (d / pinch.current.startDist)));
        setZoom(z);
      }
      return;
    }
    if (drag.current && drag.current.id === e.pointerId) {
      const dx = (e.clientX - drag.current.cx) / (drag.current.w / 2);
      const dy = (e.clientY - drag.current.cy) / (drag.current.h / 2);
      const tx = Math.max(-14, Math.min(14, dx * 14));
      const ty = Math.max(-14, Math.min(14, -dy * 14));
      if (tiltRef.current) tiltRef.current.style.transition = '';
      applyTilt(tx, ty);
    }
  };

  const endPointer = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) {
      drag.current = null;
      springBack();
    }
  };

  const onWheel = (e) => {
    e.preventDefault();
    const z = Math.min(3.5, Math.max(1, zoomRef.current - e.deltaY * 0.002));
    setZoom(z);
  };

  return (
    <div className="flex flex-col h-full">
      {/* studio stage */}
      <div
        ref={wrapRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onWheel={onWheel}
        className="relative flex-1 min-h-0 overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 30%, #fbf8f1 0%, #f1e9d8 55%, #e2d5ba 100%)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10" style={{ perspective: '900px' }}>
          <div ref={tiltRef} className="relative" style={{ transformStyle: 'preserve-3d', maxHeight: '100%' }}>
            <img
              key={src}
              src={src}
              alt={product.title}
              draggable={false}
              className="max-h-[42dvh] md:max-h-[60dvh] w-auto max-w-full rounded-lg animate-fade-in"
              style={{
                boxShadow:
                  '0 30px 60px -18px rgba(43,37,28,0.45), 0 12px 24px -12px rgba(43,37,28,0.35)',
              }}
            />
          </div>
        </div>
        {/* thumbnail strip */}
        {count > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2 px-4">
            {product.images.map((im, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActive(i); }}
                aria-label={`Photo ${i + 1}`}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 bg-white transition-colors ${
                  i === active ? 'border-charcoal-900' : 'border-white/70'
                }`}
              >
                <img src={imgUrl(im, 120)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="shrink-0 text-center py-2 text-[11px] tracking-[0.2em] uppercase text-charcoal-700/60 bg-transparent">
        Drag to tilt · {count > 1 ? 'Tap thumbnails · ' : ''}Pinch or scroll to zoom
      </p>
    </div>
  );
}

export default function PickupView({ product, onClose, onAdd, isDesktop }) {
  const [flipped, setFlipped] = useState(false);
  const [added, setAdded] = useState(false);
  const pct = discountPct(product);

  const handleAdd = () => {
    onAdd(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col md:flex-row animate-fade-in bg-ivory-100">
      {/* photo — fixed half-screen canvas on phones, flexible on desktop */}
      <div className="pickup-canvas relative shrink-0 md:h-auto md:min-h-0 md:flex-1 bg-ivory-100">
        <PhotoStage product={product} />
        <button
          onClick={onClose}
          aria-label="Back to the shop"
          className="absolute left-4 rounded-full bg-charcoal-900/85 text-ivory-50 w-11 h-11 flex items-center justify-center text-lg hover:bg-charcoal-800 z-10"
          style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
        >
          ←
        </button>
      </div>

      {/* details sheet — scrollable, Add-to-tray pinned at the bottom */}
      <div className="flex-1 min-h-0 md:max-w-md bg-ivory-50 border-t md:border-t-0 md:border-l border-silver-300/60 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto thin-scroll p-5 md:p-8">
          <p className="text-[11px] tracking-[0.35em] uppercase text-sage-600 font-bold">
            {TYPE_LABELS[product.type] || product.type} · 925 Sterling Silver
          </p>
          <h2 className="font-display text-xl min-[400px]:text-2xl md:text-3xl text-charcoal-900 mt-2 leading-snug">
            {product.title}
          </h2>
          <p className="font-serif-alt italic text-charcoal-700 mt-2">{blurbFor(product)}</p>

          <div className={`flip-scene mt-4 md:mt-5 ${flipped ? 'flipped' : ''}`}>
            <div className="flip-inner relative min-h-40 md:min-h-44">
              {/* front: price */}
              <div className="flip-face rounded-2xl bg-white border border-silver-300/70 p-4 min-[400px]:p-5 shadow-md">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-display text-2xl min-[400px]:text-3xl text-charcoal-900">{formatINR(product.price)}</span>
                  {product.compareAt && (
                    <span className="text-silver-500 line-through text-base min-[400px]:text-lg">{formatINR(product.compareAt)}</span>
                  )}
                  {pct > 0 && (
                    <span className="rounded-full bg-sage-600 text-ivory-50 text-[11px] font-bold px-2.5 py-1">
                      Save {pct}%
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-charcoal-700/70 mt-1">Skin-safe · made for everyday wear</p>
                <button
                  onClick={() => setFlipped(true)}
                  className="mt-3 text-[12px] font-bold tracking-[0.2em] uppercase text-sage-600 underline underline-offset-4"
                >
                  Flip the tag ↻
                </button>
              </div>
              {/* back: details */}
              <div className="flip-face flip-back absolute inset-0 rounded-2xl bg-charcoal-900 text-ivory-50 p-4 min-[400px]:p-5 shadow-md">
                <p className="font-display text-lg tracking-[0.2em]">925</p>
                <ul className="text-[13px] mt-2 space-y-1 text-ivory-50/85">
                  <li>· Genuine 925 sterling silver</li>
                  <li>· Skin-safe, nickel-conscious finish</li>
                  <li>· Designed for daily wear</li>
                  <li>· Gift-ready Aajiva packaging</li>
                </ul>
                <button
                  onClick={() => setFlipped(false)}
                  className="mt-3 text-[12px] font-bold tracking-[0.2em] uppercase text-silver-300 underline underline-offset-4"
                >
                  Flip back ↻
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* sticky action bar */}
        <div
          className="shrink-0 p-5 pt-3 md:p-8 md:pt-2 bg-ivory-50 border-t border-silver-300/40 flex flex-col gap-3"
          style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={handleAdd}
            className={`rounded-full min-h-[52px] py-4 text-sm font-bold tracking-[0.25em] uppercase transition-colors ${
              added ? 'bg-sage-600 text-ivory-50' : 'bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800'
            }`}
          >
            {added ? '✓ On your tray' : 'Add to tray'}
          </button>
          <a
            href={deepLink(product.handle)}
            target="_blank"
            rel="noreferrer"
            className="text-center rounded-full border border-charcoal-900/25 py-3 text-[12px] font-bold tracking-[0.12em] uppercase text-charcoal-800 hover:bg-ivory-200"
          >
            View / buy on aajiva.com →
          </a>
        </div>
      </div>
    </div>
  );
}

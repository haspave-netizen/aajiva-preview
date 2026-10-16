import { useEffect, useRef, useState } from 'react';
import {
  CATALOG, imgUrl, formatINR, discountPct, TYPE_SLUG,
} from '../data/catalog';
import { useRevealGroup } from '../hooks/useReveal';
import ProductCard from './ProductCard';

/* The reel's "3D moment": one featured product presented as a large
 * cinematic visual — wide crop, dark gradient backdrop, soft glow
 * under it, slight scroll parallax. Then the category grid, first 8
 * shown with a "View all N" expander. */
function FeaturedVisual({ product }) {
  const ref = useRef(null);
  const pct = discountPct(product);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const img = el.querySelector('.featured-img');
    if (!img) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const center = r.top + r.height / 2;
        const shift = ((vh / 2 - center) / vh) * 70;
        img.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(1.18)`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [product.id]);

  return (
    <div
      ref={ref}
      className="featured-frame relative rounded-3xl overflow-hidden h-[44dvh] md:h-[60dvh]"
      style={{
        background:
          'radial-gradient(90% 70% at 50% 100%, rgba(212,175,95,0.14) 0%, transparent 60%), linear-gradient(to bottom, #1a1714, #0c0b09)',
      }}
    >
      <img
        src={imgUrl(product.images[0], 1200)}
        alt={product.title}
        loading="lazy"
        className="featured-img absolute inset-0 w-full h-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night-950/90 via-transparent to-night-950/20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 p-5 md:p-8 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-300 font-bold">
            Featured piece · 925 Silver
          </p>
          <p className="text-lg md:text-2xl font-semibold text-ivory-50 leading-snug mt-1 line-clamp-2">
            {product.title}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-xl md:text-3xl text-gold-200">{formatINR(product.price)}</p>
          {pct > 0 && (
            <p className="text-[11px] font-bold text-gold-300 tracking-wide mt-0.5">{pct}% OFF</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CategorySection({ types, title, line, onPick, onAdd }) {
  const items = CATALOG.filter((p) => types.includes(p.type));
  const featured = [...items].sort((a, b) => b.price - a.price)[0] || null;
  const [expanded, setExpanded] = useState(false);
  const groupRef = useRevealGroup();
  const gridRef = useRevealGroup();
  const shown = expanded ? items : items.slice(0, 8);
  const slug = TYPE_SLUG[types[0]];

  return (
    <section id={slug} className="relative py-14 md:py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div ref={groupRef}>
          <p className="reveal text-[11px] tracking-[0.35em] uppercase text-gold-300 font-bold">
            {items.length} pieces · 925 Sterling Silver
          </p>
          <h2 className="reveal section-title font-display text-ivory-50 mt-3 uppercase">
            {title}
          </h2>
          <p className="reveal font-serif-alt italic text-xl md:text-2xl text-ivory-200/60 mt-2">
            {line}
          </p>
          <div className="reveal gold-rule mt-6 mb-8" />
        </div>

        {featured && (
          <button
            onClick={() => onPick(featured)}
            aria-label={`View ${featured.title}`}
            className="reveal block w-full text-left cursor-pointer mb-8 md:mb-10"
          >
            <FeaturedVisual product={featured} />
          </button>
        )}

        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {shown.map((p, i) => (
            <div key={p.id} className="reveal" style={{ '--reveal-delay': `${(i % 4) * 70}ms` }}>
              <ProductCard product={p} onPick={onPick} onAdd={onAdd} />
            </div>
          ))}
        </div>

        {items.length > 8 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="rounded-full border border-gold-500/40 text-gold-200 px-8 min-h-[48px] text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gold-400 hover:text-night-950 hover:border-gold-400 transition-colors"
            >
              {expanded ? 'Show fewer' : `View all ${items.length} pieces`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

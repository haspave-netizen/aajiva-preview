import { bestsellers } from '../data/catalog';
import { useRevealGroup } from '../hooks/useReveal';
import ProductCard from './ProductCard';

export default function Bestsellers({ onPick, onAdd }) {
  const items = bestsellers(24);
  const groupRef = useRevealGroup();

  return (
    <section id="bestsellers" className="relative py-16 md:py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div ref={groupRef}>
          <p className="reveal text-[11px] tracking-[0.35em] uppercase text-gold-300 font-bold">
            The pieces everyone reaches for
          </p>
          <h2 className="reveal section-title font-display text-ivory-50 mt-3">MOST LOVED</h2>
          <div className="reveal gold-rule mt-6 mb-8" />
        </div>
        <div className="snap-row pb-2">
          {items.map((p) => (
            <div key={p.id} className="w-[68vw] sm:w-[44vw] md:w-[300px]">
              <ProductCard product={p} onPick={onPick} onAdd={onAdd} />
            </div>
          ))}
        </div>
        <p className="md:hidden text-center mt-4 text-[11px] tracking-[0.2em] uppercase text-ivory-200/40">
          Swipe for more →
        </p>
      </div>
    </section>
  );
}

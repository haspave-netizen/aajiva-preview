import { useEffect, useRef } from 'react';
import { heroPicks, imgUrl, formatINR, CATALOG } from '../data/catalog';
import { useReveal } from '../hooks/useReveal';

/* Hero — near-black stage, gold glow, glowing pill, giant serif headline,
 * CTA pair, and a row of tall vertical product panels with a slow scroll
 * parallax (transform only, disabled under prefers-reduced-motion). */
export default function Hero({ onPick }) {
  const picks = heroPicks();
  const rowRef = useRef(null);
  const revealRef = useReveal();

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const row = rowRef.current;
    if (!row) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        row.querySelectorAll('.hero-panel-inner').forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const center = r.top + r.height / 2;
          const shift = ((vh / 2 - center) / vh) * (i % 2 === 0 ? 26 : -26);
          el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(1.12)`;
        });
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="top" className="relative overflow-hidden">
      {/* gold radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none animate-glow-pulse"
        style={{
          background:
            'radial-gradient(60% 42% at 50% 18%, rgba(212,175,95,0.16) 0%, rgba(212,175,95,0.05) 45%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0c0b09)' }}
      />

      <div ref={revealRef} className="reveal relative max-w-7xl mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-10 text-center">
        <span className="inline-flex items-center rounded-full border border-gold-400/50 bg-gold-400/10 px-5 py-2 text-[11px] font-bold tracking-[0.3em] uppercase text-gold-200 animate-glow-pulse">
          925 Sterling Silver · Skin-Safe
        </span>
        <h1 className="hero-title font-display text-ivory-50 mt-6">
          YOUR SILVER
          <br />
          <span className="text-gold-300">ERA STARTS HERE</span>
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-[15px] md:text-lg text-ivory-200/70 leading-relaxed">
          Real silver, made for every day — {CATALOG.length} pieces from aajiva.com,
          each one genuine 925 sterling.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#bestsellers"
            className="rounded-full bg-gold-400 text-night-950 px-8 min-h-[52px] inline-flex items-center text-[12px] font-extrabold tracking-[0.22em] uppercase hover:bg-gold-300 transition-colors"
          >
            Explore the collection
          </a>
          <a
            href="#all-pieces"
            className="rounded-full border border-ivory-200/25 text-ivory-50 px-8 min-h-[52px] inline-flex items-center text-[12px] font-bold tracking-[0.22em] uppercase hover:border-gold-300 hover:text-gold-200 transition-colors"
          >
            All {CATALOG.length} pieces
          </a>
        </div>
      </div>

      {/* tall vertical panels */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div ref={rowRef} className="hero-row">
          {picks.map((p, i) => (
            <button
              key={p.id}
              onClick={() => onPick(p)}
              aria-label={`View ${p.title}`}
              className="hero-panel relative w-[62vw] sm:w-[40vw] md:w-auto h-[46dvh] md:h-[52dvh] rounded-2xl overflow-hidden border border-gold-500/25 text-left cursor-pointer group"
            >
              <div className="hero-panel-inner absolute inset-0 will-change-transform">
                <img
                  src={imgUrl(p.images[0], 800)}
                  alt={p.title}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-night-950/85 via-night-950/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 p-4 md:p-5">
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold-300 font-bold">925 Silver</p>
                <p className="text-[14px] md:text-[15px] font-semibold text-ivory-50 leading-snug line-clamp-2 mt-1">
                  {p.title}
                </p>
                <p className="font-display text-lg text-gold-200 mt-1">{formatINR(p.price)}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="md:hidden text-center mt-4 text-[11px] tracking-[0.2em] uppercase text-ivory-200/40">
          Swipe for more →
        </p>
      </div>
    </section>
  );
}

import { useReveal } from '../hooks/useReveal';

/* Closing CTA in giant type, like the reel's "LET US PLAN YOUR SPACE." */
export default function FooterCta() {
  const ref = useReveal();

  return (
    <footer className="relative overflow-hidden border-t border-gold-500/15">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 100%, rgba(212,175,95,0.14) 0%, transparent 65%)',
        }}
      />
      <div ref={ref} className="reveal relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase text-gold-300 font-bold">
          925 Sterling Silver · Skin-Safe
        </p>
        <h2 className="hero-title font-display text-ivory-50 mt-5">
          YOUR SILVER
          <br />
          <span className="text-gold-300">ERA STARTS HERE</span>
        </h2>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://aajiva.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-gold-400 text-night-950 px-10 min-h-[54px] inline-flex items-center text-[12px] font-extrabold tracking-[0.22em] uppercase hover:bg-gold-300 transition-colors"
          >
            Shop on aajiva.com →
          </a>
          <a
            href="https://instagram.com/aajivaa"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ivory-200/25 text-ivory-50 px-8 min-h-[54px] inline-flex items-center text-[12px] font-bold tracking-[0.22em] uppercase hover:border-gold-300 hover:text-gold-200 transition-colors"
          >
            @aajivaa
          </a>
        </div>
        <p className="mt-10 text-[12px] text-ivory-200/40">
          Concept preview — checkout happens on aajiva.com.
        </p>
      </div>
    </footer>
  );
}

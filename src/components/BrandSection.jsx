import { imgUrl, featuredForType, CATALOG } from '../data/catalog';
import { useReveal } from '../hooks/useReveal';

/* Brand story — dark panel, serif headline, the name's real meaning. */
export default function BrandSection() {
  const panel = featuredForType('Sets') || CATALOG[0];
  const ref = useReveal();

  return (
    <section className="relative py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div
          ref={ref}
          className="reveal relative rounded-3xl overflow-hidden border border-gold-500/20"
          style={{ background: 'linear-gradient(135deg, #1a1714 0%, #0c0b09 60%)' }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(55% 60% at 85% 20%, rgba(212,175,95,0.14) 0%, transparent 60%)',
            }}
          />
          <div className="relative grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-14 items-center">
            <div>
              <p className="text-[11px] tracking-[0.35em] uppercase text-gold-300 font-bold">
                The name means a way of living
              </p>
              <h2 className="section-title font-display text-ivory-50 mt-4">
                AAJIVA —<br />A WAY OF LIVING
              </h2>
              <div className="gold-rule mt-6 mb-6 max-w-xs" />
              <p className="text-[15px] md:text-base text-ivory-200/75 leading-relaxed">
                Aajiva works only in genuine 925 sterling silver — never plated,
                never costume. Every piece is skin-safe and built for daily wear,
                not locked away for occasions.
              </p>
              <p className="text-[15px] md:text-base text-ivory-200/75 leading-relaxed mt-4">
                Real metal, real value: silver you can wear every single day,
                from morning errands to evenings out.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-gold-500/25 h-[40dvh] md:h-[52dvh]">
              <img
                src={imgUrl(panel.images[0], 900)}
                alt={panel.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night-950/50 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

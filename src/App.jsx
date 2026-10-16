// Aajiva — dark premium cinematic boutique. A single scrolling page:
// hero, trust strip, bestsellers, 8 category sections each led by a
// featured cinematic visual, brand story, full catalogue, giant footer CTA.
import { useCallback, useMemo, useState } from 'react';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import Bestsellers from './components/Bestsellers';
import CategorySection from './components/CategorySection';
import BrandSection from './components/BrandSection';
import FooterCta from './components/FooterCta';
import CatalogueView from './components/CatalogueView';
import PickupView from './components/PickupView';
import TrayDrawer from './components/TrayDrawer';
import { useTray } from './hooks/useTray';
import { useRevealGroup } from './hooks/useReveal';
import { productById, CATEGORY_LINES } from './data/catalog';

/* Section roster — nav order. Rings folds in Toe Rings (both live at #rings). */
const SECTIONS = [
  { types: ['Rings', 'Toe Rings'], title: 'Rings', line: CATEGORY_LINES.Rings },
  { types: ['Earrings'], title: 'Earrings', line: CATEGORY_LINES.Earrings },
  { types: ['Pendants'], title: 'Pendants', line: CATEGORY_LINES.Pendants },
  { types: ['Bracelets'], title: 'Bracelets', line: CATEGORY_LINES.Bracelets },
  { types: ['Anklets'], title: 'Anklets', line: CATEGORY_LINES.Anklets },
  { types: ['Sets'], title: 'Sets', line: CATEGORY_LINES.Sets },
  { types: ['Silver Rakhi'], title: 'Silver Rakhis', line: CATEGORY_LINES['Silver Rakhi'] },
];

function TrustStrip() {
  const ref = useRevealGroup();
  const items = [
    '925 sterling silver',
    'Skin-safe, everyday wear',
    '239 real pieces',
    'Prices as on aajiva.com',
  ];
  return (
    <div className="border-y border-gold-500/15 bg-night-900/40">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-4 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6"
      >
        {items.map((t, i) => (
          <p
            key={t}
            className={`reveal text-[11px] tracking-[0.28em] uppercase text-ivory-200/60 text-center ${
              i % 2 === 1 ? 'md:border-l border-gold-500/15' : ''
            } ${i > 1 ? 'md:border-l border-gold-500/15' : ''}`}
            style={{ '--reveal-delay': `${i * 80}ms` }}
          >
            {t}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [picked, setPicked] = useState(null);
  const [trayOpen, setTrayOpen] = useState(false);
  const { tray, add, remove, setQty, count } = useTray();

  const handlePick = useCallback((product) => setPicked(product), []);

  const total = useMemo(
    () =>
      Object.entries(tray).reduce(
        (sum, [id, qty]) => sum + (productById(id)?.price || 0) * qty,
        0
      ),
    [tray]
  );

  return (
    <div className="min-h-[100dvh] w-full bg-night-950 text-ivory-50 overflow-x-hidden">
      <TopBar trayCount={count} onTrayOpen={() => setTrayOpen(true)} />

      <main>
        <Hero onPick={handlePick} />
        <TrustStrip />
        <Bestsellers onPick={handlePick} onAdd={add} />

        {SECTIONS.map((s) => (
          <CategorySection
            key={s.title}
            types={s.types}
            title={s.title}
            line={s.line}
            onPick={handlePick}
            onAdd={add}
          />
        ))}

        <BrandSection />

        {/* full catalogue — an inline section, not an overlay */}
        <section id="all-pieces" className="relative py-16 md:py-24 scroll-mt-20">
          <CatalogueView onPick={handlePick} onAdd={add} showClose={false} inline />
        </section>

        <FooterCta />
      </main>

      {picked && <PickupView product={picked} onClose={() => setPicked(null)} onAdd={add} />}

      <TrayDrawer
        open={trayOpen}
        onClose={() => setTrayOpen(false)}
        tray={tray}
        setQty={setQty}
        remove={remove}
        total={total}
      />
    </div>
  );
}

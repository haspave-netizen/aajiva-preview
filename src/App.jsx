import { useCallback, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import BoutiqueScene from './three/BoutiqueScene';
import Entrance from './components/Entrance';
import ZoneNav from './components/ZoneNav';
import ZoneCard from './components/ZoneCard';
import PickupView from './components/PickupView';
import TrayDrawer from './components/TrayDrawer';
import Footer from './components/Footer';
import { useTray } from './hooks/useTray';
import { useViewport } from './hooks/useViewport';
import { productById } from './data/products';

export default function App() {
  const [entered, setEntered] = useState(false);
  const [zoneId, setZoneId] = useState('central');
  const [picked, setPicked] = useState(null);
  const [trayOpen, setTrayOpen] = useState(false);
  const { tray, add, remove, setQty, count } = useTray();

  const vp = useViewport();
  const isDesktop = vp.isDesktop;
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const onMotion = (e) => setReducedMotion(e.matches);
    mq?.addEventListener?.('change', onMotion);
    return () => mq?.removeEventListener?.('change', onMotion);
  }, []);

  const handlePick = useCallback((product) => setPicked(product), []);

  const total = Object.entries(tray).reduce(
    (sum, [id, qty]) => sum + (productById(id)?.price || 0) * qty,
    0
  );

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-ivory-100 select-none">
      {/* main 3D boutique */}
      <Canvas
        className="!absolute !inset-0"
        dpr={[1, isDesktop ? 1.75 : 1.25]}
        shadows={isDesktop}
        frameloop={picked ? 'never' : 'always'}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 55, near: 0.1, far: 80, position: [0, 1.7, 11.2] }}
      >
        <BoutiqueScene
          zoneId={zoneId}
          entered={entered}
          onPick={handlePick}
          isDesktop={isDesktop}
          reducedMotion={reducedMotion}
        />
      </Canvas>

      {!entered && <Entrance onEnter={() => { setEntered(true); setZoneId('central'); }} />}

      {entered && !picked && (
        <>
          <ZoneCard zoneId={zoneId} isPhone={vp.isPhone} />
          <ZoneNav
            zoneId={zoneId}
            onZone={setZoneId}
            trayCount={count}
            onTrayOpen={() => setTrayOpen(true)}
          />
          <Footer />
        </>
      )}

      {picked && (
        <PickupView
          product={picked}
          onClose={() => setPicked(null)}
          onAdd={add}
          isDesktop={isDesktop}
          reducedMotion={reducedMotion}
        />
      )}

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

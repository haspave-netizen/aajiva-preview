import { useEffect, useState } from 'react';

/*
 * Live viewport tracking — width, height, aspect, orientation — not just a
 * single >=768 boolean. Orientation changes and mobile toolbar show/hide
 * both fire resize, so the 3D camera can re-frame on every change.
 */
function read() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const h = typeof window !== 'undefined' ? window.innerHeight : 800;
  const aspect = w / Math.max(h, 1);
  return {
    w,
    h,
    aspect,
    isPortrait: aspect < 1,
    isLandscape: aspect >= 1,
    // landscape phones and other short viewports
    isShort: h < 520,
    isSmallPhone: w < 400,
    isPhone: w < 768,
    isTablet: w >= 768 && w < 1024,
    isDesktop: w >= 1024,
  };
}

export function useViewport() {
  const [vp, setVp] = useState(read);
  useEffect(() => {
    const onChange = () => setVp(read());
    window.addEventListener('resize', onChange);
    window.addEventListener('orientationchange', onChange);
    return () => {
      window.removeEventListener('resize', onChange);
      window.removeEventListener('orientationchange', onChange);
    };
  }, []);
  return vp;
}

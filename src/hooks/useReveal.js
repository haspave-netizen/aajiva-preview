import { useEffect, useRef } from 'react';

/* Adds .visible to the element when it enters the viewport (once).
 * Reduced-motion users get everything revealed immediately via CSS. */
export function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px', ...options }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

/* Hook for a group of children that should reveal with a stagger:
 * returns a ref; children carry class "reveal" and optional
 * style={{ '--reveal-delay': '80ms' }}. */
export function useRevealGroup() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = root.querySelectorAll('.reveal');
    if (typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -4% 0px' }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return ref;
}

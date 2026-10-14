import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

/* Feature-detect WebGL before ever mounting a Canvas. */
export function webglSupported() {
  try {
    if (typeof document === 'undefined') return true;
    const c = document.createElement('canvas');
    return !!(
      c.getContext('webgl2') ||
      c.getContext('webgl') ||
      c.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

/*
 * Mount inside a <Canvas>. Handles GPU context loss:
 *  - preventDefault() on 'webglcontextlost' so the browser is allowed to restore
 *  - notifies the app, which shows a retry state + DOM fallback instead of a dead page
 * three.js re-initialises its GL state itself on 'webglcontextrestored'.
 */
export function ContextGuard({ onLost, onRestored, glRef }) {
  const { gl } = useThree();

  useEffect(() => {
    if (glRef) glRef.current = gl;
    const canvas = gl.domElement;
    const onLostEvt = (e) => {
      e.preventDefault();
      onLost?.();
    };
    const onRestoredEvt = () => onRestored?.();
    canvas.addEventListener('webglcontextlost', onLostEvt);
    canvas.addEventListener('webglcontextrestored', onRestoredEvt);
    return () => {
      canvas.removeEventListener('webglcontextlost', onLostEvt);
      canvas.removeEventListener('webglcontextrestored', onRestoredEvt);
    };
  }, [gl, glRef, onLost, onRestored]);

  return null;
}

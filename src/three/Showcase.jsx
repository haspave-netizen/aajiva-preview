// Real-photo product showcases: framed panels on walls and photo cards
// lying on the counters, replacing the procedural jewellery meshes.
// Textures load from the Shopify CDN at display width; a module-level cache
// shares textures between shelves and disposes when unreferenced.
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { imgUrl } from '../data/catalog';
import { brushedTexture } from './textures';

const loader = new THREE.TextureLoader();
loader.setCrossOrigin('anonymous');

const texCache = new Map(); // url -> { tex, refs }

function acquire(url) {
  let entry = texCache.get(url);
  if (!entry) {
    const tex = loader.load(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    entry = { tex, refs: 0 };
    texCache.set(url, entry);
  }
  entry.refs += 1;
  return entry.tex;
}

function release(url) {
  const entry = texCache.get(url);
  if (!entry) return;
  entry.refs -= 1;
  if (entry.refs <= 0) {
    entry.tex.dispose();
    texCache.delete(url);
  }
}

/* Load display-width photos for the given shelf products.
 * Returns { textures: Map<productId, Texture>, ready: boolean }. */
export function useShelfTextures(products) {
  const urls = useMemo(
    () => products.map((p) => imgUrl(p.images[0], 600)),
    [products]
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    const texs = new Map();
    for (const url of urls) {
      const tex = acquire(url);
      // resolve when the underlying image has decoded
      if (tex.image && tex.image.complete && tex.image.naturalWidth > 0) continue;
      texs.set(url, tex);
    }
    if (texs.size === 0) {
      setReady(true);
      return () => { urls.forEach(release); };
    }
    const checks = [...texs.keys()].map(
      (url) =>
        new Promise((resolve) => {
          const iv = setInterval(() => {
            const t = texCache.get(url)?.tex;
            if (!t || (t.image && t.image.complete)) {
              clearInterval(iv);
              resolve();
            }
          }, 60);
          setTimeout(() => { clearInterval(iv); resolve(); }, 8000);
        })
    );
    Promise.all(checks).then(() => { if (!cancelled) setReady(true); });
    return () => {
      cancelled = true;
      urls.forEach(release);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls.join('|')]);

  return useMemo(() => {
    const map = new Map();
    products.forEach((p, i) => {
      const entry = texCache.get(urls[i]);
      if (entry) map.set(p.id, entry.tex);
    });
    return { textures: map, ready };
  }, [products, urls, ready]);
}

let brushedGold = null;
function goldMaterial() {
  if (!brushedGold) {
    const map = brushedTexture('#a8854c');
    brushedGold = new THREE.MeshStandardMaterial({
      map,
      color: '#d8b98a',
      metalness: 0.9,
      roughness: 0.38,
    });
  }
  return brushedGold;
}

function Clickable({ product, onPick, children, position, rotation }) {
  const ref = useRef();
  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onPick(product); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {children}
    </group>
  );
}

/* Wall frame: brushed-gold frame around a real product photo. */
export function PhotoFrame({ product, tex, w = 0.62, h = 0.85, position, rotation, onPick }) {
  const gold = goldMaterial();
  const photo = tex ? (
    <mesh position={[0, 0, 0.036]}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={tex} roughness={0.55} metalness={0} />
    </mesh>
  ) : (
    <mesh position={[0, 0, 0.036]}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial color="#23252b" roughness={0.9} />
    </mesh>
  );
  return (
    <Clickable product={product} onPick={onPick} position={position} rotation={rotation}>
      {/* frame body */}
      <mesh>
        <boxGeometry args={[w + 0.09, h + 0.09, 0.07]} />
        <primitive object={gold} attach="material" />
      </mesh>
      {/* inner bevel */}
      <mesh position={[0, 0, 0.012]}>
        <boxGeometry args={[w + 0.025, h + 0.025, 0.05]} />
        <meshStandardMaterial color="#1c1d22" roughness={0.5} metalness={0.6} />
      </mesh>
      {photo}
    </Clickable>
  );
}

/* Photo card lying on a counter tray, slightly tilted up toward the visitor. */
export function TrayCard({ product, tex, position, onPick }) {
  const w = 0.5, h = 0.68;
  return (
    <Clickable
      product={product}
      onPick={onPick}
      position={position}
      rotation={[-Math.PI / 2 + 0.22, 0, 0]}
    >
      <mesh>
        <boxGeometry args={[w + 0.05, h + 0.05, 0.025]} />
        <primitive object={goldMaterial()} attach="material" />
      </mesh>
      {tex ? (
        <mesh position={[0, 0, 0.016]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={tex} roughness={0.55} metalness={0} />
        </mesh>
      ) : (
        <mesh position={[0, 0, 0.016]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial color="#23252b" roughness={0.9} />
        </mesh>
      )}
    </Clickable>
  );
}

/* Display slots per zone. type: 'frame' = wall panel, 'card' = tray card. */
export const ZONE_DISPLAYS = {
  central: [
    { type: 'card', pos: [-1.62, 1.06, -0.28] },
    { type: 'card', pos: [-0.68, 1.06, 0.28] },
    { type: 'card', pos: [0.68, 1.06, -0.28] },
    { type: 'card', pos: [1.62, 1.06, 0.28] },
    { type: 'frame', pos: [-1.5, 1.75, -1.35], ry: 0 },
    { type: 'frame', pos: [-0.5, 1.75, -1.35], ry: 0 },
    { type: 'frame', pos: [0.5, 1.75, -1.35], ry: 0 },
    { type: 'frame', pos: [1.5, 1.75, -1.35], ry: 0 },
  ],
  rings: [
    { type: 'frame', pos: [-9.24, 1.5, -3.5], ry: Math.PI / 2 },
    { type: 'frame', pos: [-9.24, 1.5, -2.5], ry: Math.PI / 2 },
    { type: 'frame', pos: [-9.24, 1.5, -1.5], ry: Math.PI / 2 },
    { type: 'frame', pos: [-9.24, 1.5, -0.5], ry: Math.PI / 2 },
    { type: 'frame', pos: [-9.24, 2.45, -3.5], ry: Math.PI / 2 },
    { type: 'frame', pos: [-9.24, 2.45, -2.5], ry: Math.PI / 2 },
    { type: 'frame', pos: [-9.24, 2.45, -1.5], ry: Math.PI / 2 },
    { type: 'frame', pos: [-9.24, 2.45, -0.5], ry: Math.PI / 2 },
  ],
  gallery: [
    { type: 'frame', pos: [-3.3, 2.05, -7.4], ry: 0 },
    { type: 'frame', pos: [-1.1, 2.05, -7.4], ry: 0 },
    { type: 'frame', pos: [1.1, 2.05, -7.4], ry: 0 },
    { type: 'frame', pos: [3.3, 2.05, -7.4], ry: 0 },
    { type: 'frame', pos: [-3.3, 3.0, -7.4], ry: 0 },
    { type: 'frame', pos: [-1.1, 3.0, -7.4], ry: 0 },
    { type: 'frame', pos: [1.1, 3.0, -7.4], ry: 0 },
    { type: 'frame', pos: [3.3, 3.0, -7.4], ry: 0 },
  ],
  edits: [
    { type: 'frame', pos: [7.52, 1.6, -1.7], ry: -Math.PI / 2 },
    { type: 'frame', pos: [7.52, 1.6, -0.9], ry: -Math.PI / 2 },
    { type: 'frame', pos: [7.52, 2.55, -1.7], ry: -Math.PI / 2 },
    { type: 'frame', pos: [7.52, 2.55, -0.9], ry: -Math.PI / 2 },
    { type: 'frame', pos: [7.52, 1.6, 1.1], ry: -Math.PI / 2 },
    { type: 'frame', pos: [7.52, 1.6, 1.9], ry: -Math.PI / 2 },
    { type: 'frame', pos: [7.52, 2.55, 1.1], ry: -Math.PI / 2 },
    { type: 'frame', pos: [7.52, 2.55, 1.9], ry: -Math.PI / 2 },
  ],
  gifting: [
    { type: 'frame', pos: [-8.0, 1.35, 1.55], ry: 1.0 },
    { type: 'frame', pos: [-7.35, 1.35, 2.3], ry: 1.0 },
    { type: 'frame', pos: [-6.7, 1.35, 3.05], ry: 1.0 },
    { type: 'frame', pos: [-6.05, 1.35, 3.8], ry: 1.0 },
    { type: 'frame', pos: [-8.0, 2.3, 1.55], ry: 1.0 },
    { type: 'frame', pos: [-7.35, 2.3, 2.3], ry: 1.0 },
    { type: 'frame', pos: [-6.7, 2.3, 3.05], ry: 1.0 },
    { type: 'frame', pos: [-6.05, 2.3, 3.8], ry: 1.0 },
  ],
};

/* Backing boards so frames don't float in air. */
function Backings() {
  return (
    <group>
      {/* ring bar board */}
      <mesh position={[-9.32, 1.95, -2]}>
        <boxGeometry args={[0.12, 2.3, 4.4]} />
        <meshStandardMaterial color="#2e2a24" roughness={0.55} />
      </mesh>
      {/* edits boards — women's / men's */}
      <mesh position={[7.62, 2.05, -1.3]}>
        <boxGeometry args={[0.12, 2.3, 1.9]} />
        <meshStandardMaterial color="#efe7d5" roughness={0.8} />
      </mesh>
      <mesh position={[7.62, 2.05, 1.5]}>
        <boxGeometry args={[0.12, 2.3, 1.9]} />
        <meshStandardMaterial color="#2b2d33" roughness={0.6} />
      </mesh>
      {/* gifting backdrop wall */}
      <mesh position={[-7.05, 1.6, 2.65]} rotation={[0, 1.0, 0]}>
        <boxGeometry args={[3.6, 2.5, 0.15]} />
        <meshStandardMaterial color="#3a3630" roughness={0.7} />
      </mesh>
    </group>
  );
}

/*
 * Renders the active zone's current shelf page as photo showcases.
 * Products beyond the shelf page are not rendered; shelf textures are
 * lazy-loaded and released on shelf change.
 */
export function ZoneShowcases({ zoneId, shelfProducts, onPick }) {
  const slots = ZONE_DISPLAYS[zoneId] || [];
  const { textures } = useShelfTextures(shelfProducts);

  return (
    <group>
      <Backings />
      {shelfProducts.map((p, i) => {
        const slot = slots[i];
        if (!slot) return null;
        const tex = textures.get(p.id);
        if (slot.type === 'card') {
          return (
            <TrayCard key={p.id} product={p} tex={tex} position={slot.pos} onPick={onPick} />
          );
        }
        return (
          <PhotoFrame
            key={p.id}
            product={p}
            tex={tex}
            position={slot.pos}
            rotation={[0, slot.ry || 0, 0]}
            onPick={onPick}
          />
        );
      })}
    </group>
  );
}

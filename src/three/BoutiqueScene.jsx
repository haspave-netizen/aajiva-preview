import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three-stdlib';
import { ZONES, PRODUCTS } from '../data/products';
import { JewelryModel } from './models';
import { silverMaterial, velvetMaterial, glassMaterial } from './materials';

/* Local environment lighting — RoomEnvironment via PMREM (no external HDR fetch). */
function LocalEnv() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const env = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromScene(env, 0.04);
    scene.environment = rt.texture;
    return () => {
      scene.environment = null;
      rt.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/* Smooth camera fly-between zone viewpoints. */
function CameraRig({ zoneId, entered, reducedMotion }) {
  const { camera } = useThree();
  const cur = useRef({ pos: new THREE.Vector3(0, 1.7, 11.2), look: new THREE.Vector3(0, 1.9, 4.5) });
  const view = useMemo(() => {
    const z = ZONES.find((x) => x.id === (entered ? zoneId : 'entrance'));
    return z ? z.view : ZONES[0].view;
  }, [zoneId, entered]);

  useEffect(() => {
    if (reducedMotion) {
      cur.current.pos.set(...view.pos);
      cur.current.look.set(...view.look);
    }
  }, [view, reducedMotion]);

  useFrame((_, dt) => {
    if (reducedMotion) {
      camera.position.set(...view.pos);
      camera.lookAt(...view.look);
      return;
    }
    const k = 2.4;
    cur.current.pos.x = THREE.MathUtils.damp(cur.current.pos.x, view.pos[0], k, dt);
    cur.current.pos.y = THREE.MathUtils.damp(cur.current.pos.y, view.pos[1], k, dt);
    cur.current.pos.z = THREE.MathUtils.damp(cur.current.pos.z, view.pos[2], k, dt);
    cur.current.look.x = THREE.MathUtils.damp(cur.current.look.x, view.look[0], k, dt);
    cur.current.look.y = THREE.MathUtils.damp(cur.current.look.y, view.look[1], k, dt);
    cur.current.look.z = THREE.MathUtils.damp(cur.current.look.z, view.look[2], k, dt);
    camera.position.copy(cur.current.pos);
    camera.lookAt(cur.current.look);
  });
  return null;
}

/* Spot with an explicit in-scene target so it actually aims. */
function Spot({ position, target, ...props }) {
  const tgt = useMemo(() => new THREE.Object3D(), []);
  return (
    <>
      <primitive object={tgt} position={target} />
      <spotLight position={position} target={tgt} {...props} />
    </>
  );
}

/* Storefront sign drawn locally on a canvas texture. */
function SignTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 200;
    const g = c.getContext('2d');
    g.fillStyle = '#1f2126';
    g.fillRect(0, 0, 1024, 200);
    g.strokeStyle = '#8a8f98';
    g.lineWidth = 4;
    g.strokeRect(14, 14, 996, 172);
    g.fillStyle = '#e8eaee';
    g.font = '600 96px Georgia, serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    // letterspaced
    const text = 'A A J I V A';
    g.fillText(text, 512, 104);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function Facade() {
  const sign = SignTexture();
  const silver = useMemo(silverMaterial, []);
  const glass = useMemo(glassMaterial, []);
  return (
    <group position={[0, 0, 7]}>
      {/* sign board */}
      <mesh position={[0, 3.35, 0]} material={silver}>
        <boxGeometry args={[8.4, 1.5, 0.25]} />
      </mesh>
      <mesh position={[0, 3.35, 0.14]}>
        <planeGeometry args={[7.8, 1.2]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {/* pillars */}
      {[-4.1, 4.1].map((x) => (
        <mesh key={x} position={[x, 1.6, 0]} material={silver}>
          <boxGeometry args={[0.5, 3.4, 0.5]} />
        </mesh>
      ))}
      {/* lintel */}
      <mesh position={[0, 2.75, 0]}>
        <boxGeometry args={[7.7, 0.22, 0.4]} />
        <meshStandardMaterial color="#efe7d5" roughness={0.8} />
      </mesh>
      {/* glass door + sidelights */}
      <mesh position={[0, 1.32, 0]} material={glass}>
        <planeGeometry args={[7.2, 2.55]} />
      </mesh>
      <mesh position={[0, 1.32, 0]}>
        <boxGeometry args={[0.12, 2.55, 0.08]} />
        <meshStandardMaterial color="#2b2d33" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* warm glow spilling from inside */}
      <pointLight position={[0, 2.2, 5.6]} color="#ffd9a8" intensity={18} distance={10} />
    </group>
  );
}

function Room({ isDesktop }) {
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow={isDesktop}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#dccdaa" roughness={0.75} />
      </mesh>
      {/* rug under central counter */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[7, 4]} />
        <meshStandardMaterial color="#cfd6c6" roughness={0.95} />
      </mesh>
      {/* walls */}
      <mesh position={[0, 2.2, -7.5]}>
        <planeGeometry args={[20, 4.4]} />
        <meshStandardMaterial color="#f0e9d8" roughness={0.9} />
      </mesh>
      <mesh position={[-10, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[16, 4.4]} />
        <meshStandardMaterial color="#efe7d5" roughness={0.9} />
      </mesh>
      <mesh position={[10, 2.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[16, 4.4]} />
        <meshStandardMaterial color="#efe7d5" roughness={0.9} />
      </mesh>
      {/* ceiling hint */}
      <mesh position={[0, 4.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#f6f1e7" roughness={1} />
      </mesh>
    </group>
  );
}

function CentralCounter({ isDesktop }) {
  const silver = useMemo(silverMaterial, []);
  const velvet = useMemo(velvetMaterial, []);
  const glass = useMemo(glassMaterial, []);
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow={isDesktop}>
        <boxGeometry args={[4.6, 0.9, 1.7]} />
        <meshStandardMaterial color="#2b2d33" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* silver trim */}
      <mesh position={[0, 0.92, 0]} material={silver}>
        <boxGeometry args={[4.7, 0.05, 1.8]} />
      </mesh>
      {/* glass case */}
      <mesh position={[0, 1.35, 0]} material={glass}>
        <boxGeometry args={[4.5, 0.85, 1.6]} />
      </mesh>
      {/* velvet trays */}
      {[-1.15, 1.15].map((x) => (
        <mesh key={x} position={[x, 1.0, 0]} material={velvet} receiveShadow={isDesktop}>
          <boxGeometry args={[1.95, 0.06, 1.15]} />
        </mesh>
      ))}
    </group>
  );
}

function RingBar({ isDesktop }) {
  const stands = [-3.2, -2.0, -0.8];
  return (
    <group>
      <mesh position={[-9.4, 1.5, -2]}>
        <boxGeometry args={[0.25, 2.6, 5.2]} />
        <meshStandardMaterial color="#2b2d33" roughness={0.6} />
      </mesh>
      {stands.map((z) => (
        <group key={z} position={[-9.1, 0.9, z]}>
          <mesh position={[0, 0.25, 0]} castShadow={isDesktop}>
            <cylinderGeometry args={[0.09, 0.13, 0.5, 16]} />
            <meshStandardMaterial color="#e8eaee" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.03, 16]} />
            <meshStandardMaterial color="#9aa78d" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function GalleryBusts({ isDesktop }) {
  return (
    <group>
      {[-2.2, 0, 2.2].map((x) => (
        <group key={x} position={[x, 0, -6.7]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.16, 0.2, 1.0, 16]} />
            <meshStandardMaterial color="#e8eaee" roughness={0.35} metalness={0.85} />
          </mesh>
          <mesh position={[0, 1.18, 0]} castShadow={isDesktop}>
            <cylinderGeometry args={[0.11, 0.16, 0.5, 16]} />
            <meshStandardMaterial color="#e6d9c4" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.52, 0]}>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color="#e6d9c4" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function EditAlcoves({ isDesktop }) {
  return (
    <group>
      {/* women's — ivory pedestal */}
      <mesh position={[6.5, 0.55, -2]} castShadow={isDesktop}>
        <boxGeometry args={[1.6, 1.1, 1.6]} />
        <meshStandardMaterial color="#f0e9d8" roughness={0.8} />
      </mesh>
      {/* men's — charcoal pedestal */}
      <mesh position={[6.5, 0.55, 2.5]} castShadow={isDesktop}>
        <boxGeometry args={[1.6, 1.1, 1.6]} />
        <meshStandardMaterial color="#2b2d33" roughness={0.6} />
      </mesh>
      {/* bracelet display rods */}
      {[2.0, 3.0].map((z) => (
        <mesh key={z} position={[6.5, 1.35, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.5, 12]} />
          <meshStandardMaterial color="#8a8f98" roughness={0.3} metalness={0.9} />
        </mesh>
      ))}
      {/* ring stands, women's */}
      {[-2.5, -1.5].map((z) => (
        <mesh key={z} position={[6.5, 1.2, z]}>
          <cylinderGeometry args={[0.14, 0.17, 0.18, 16]} />
          <meshStandardMaterial color="#9aa78d" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function GiftingLounge({ isDesktop }) {
  return (
    <group position={[-5.6, 0, 3.4]}>
      <mesh position={[0, 0.5, 0]} castShadow={isDesktop}>
        <cylinderGeometry args={[1.15, 1.15, 0.08, 32]} />
        <meshStandardMaterial color="#8a8f98" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.1, 0.16, 0.5, 16]} />
        <meshStandardMaterial color="#2b2d33" roughness={0.6} />
      </mesh>
      {/* gift boxes */}
      {[
        { p: [-0.55, 0.68, -0.5], s: 0.34, c: '#f3ddd6' },
        { p: [0.55, 0.66, -0.55], s: 0.3, c: '#cfd6c6' },
        { p: [0.1, 0.62, 0.6], s: 0.26, c: '#f6f1e7' },
      ].map((b, i) => (
        <group key={i} position={b.p}>
          <mesh>
            <boxGeometry args={[b.s, b.s * 0.7, b.s]} />
            <meshStandardMaterial color={b.c} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[b.s * 0.18, b.s * 0.72, b.s + 0.005]} />
            <meshStandardMaterial color="#8a8f98" roughness={0.4} metalness={0.7} />
          </mesh>
        </group>
      ))}
      {/* small stands for the two gift sets */}
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} position={[x, 0.6, 0.15]}>
          <cylinderGeometry args={[0.12, 0.15, 0.12, 16]} />
          <meshStandardMaterial color="#9aa78d" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/* Where each product sits in the boutique. */
const SPOTS = {
  papillon: { pos: [-1.62, 1.28, 0], scale: 0.5, ry: 0 },
  azura: { pos: [-0.68, 1.28, 0], scale: 0.5, ry: 0 },
  blossom: { pos: [0.68, 1.28, 0], scale: 0.5, ry: 0 },
  meadow: { pos: [1.62, 1.28, 0], scale: 0.5, ry: 0 },
  'open-solitaire': { pos: [-9.1, 1.62, -3.2], scale: 0.72, ry: Math.PI / 2 },
  'tapered-wrap': { pos: [-9.1, 1.62, -2.0], scale: 0.72, ry: Math.PI / 2 },
  'double-infinity': { pos: [-9.1, 1.62, -0.8], scale: 0.72, ry: Math.PI / 2 },
  'flower-halo': { pos: [-2.2, 1.62, -6.45], scale: 0.55, ry: 0 },
  'pearl-floating': { pos: [0, 1.62, -6.45], scale: 0.55, ry: 0 },
  'ruby-heart': { pos: [2.2, 1.62, -6.45], scale: 0.55, ry: 0 },
  'baguette-eternity': { pos: [6.5, 1.5, -2.5], scale: 0.75, ry: 0 },
  'princess-halo': { pos: [6.5, 1.5, -1.5], scale: 0.75, ry: 0 },
  'onyx-bar': { pos: [6.5, 1.35, 2.0], scale: 0.8, ry: 0, rx: 0 },
  'titan-chain': { pos: [6.5, 1.35, 3.0], scale: 0.8, ry: 0 },
  'emerald-isle': { pos: [-5.92, 1.42, 3.55], scale: 0.48, ry: 0 },
  verde: { pos: [-5.28, 1.42, 3.55], scale: 0.48, ry: 0 },
};

function ClickablePiece({ product, onPick }) {
  const spot = SPOTS[product.id];
  const ref = useRef();
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  useFrame(({ clock }) => {
    if (!ref.current || reduced) return;
    ref.current.position.y = spot.pos[1] + Math.sin(clock.elapsedTime * 1.2 + spot.pos[0]) * 0.02;
    ref.current.rotation.y = spot.ry + Math.sin(clock.elapsedTime * 0.5) * 0.25;
  });
  return (
    <group
      ref={ref}
      position={spot.pos}
      onClick={(e) => { e.stopPropagation(); onPick(product); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <JewelryModel model={product.model} gem={product.gem} scale={spot.scale} />
    </group>
  );
}

export default function BoutiqueScene({ zoneId, entered, onPick, isDesktop, reducedMotion }) {
  return (
    <>
      <LocalEnv />
      <CameraRig zoneId={zoneId} entered={entered} reducedMotion={reducedMotion} />
      {/* lighting — boutique warmth */}
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#fff6e8', '#8a7a5e', 0.35]} />
      <Spot position={[0, 4.2, 0]} target={[0, 1, 0]} angle={0.7} penumbra={0.6} intensity={isDesktop ? 90 : 45} color="#ffe8c4" castShadow={isDesktop} shadow-mapSize={[1024, 1024]} />
      <Spot position={[-7, 4, -2]} target={[-9, 1, -2]} angle={0.6} penumbra={0.7} intensity={isDesktop ? 50 : 25} color="#ffe0b8" />
      <Spot position={[0, 4, -5]} target={[0, 1.3, -6.8]} angle={0.6} penumbra={0.7} intensity={isDesktop ? 50 : 25} color="#ffe0b8" />
      <Spot position={[5.5, 4, 0.3]} target={[6.5, 1, 0.3]} angle={0.55} penumbra={0.7} intensity={isDesktop ? 60 : 30} color="#ffe8c4" />
      <pointLight position={[-5.6, 2.6, 3.4]} color="#ffd9a8" intensity={isDesktop ? 22 : 12} distance={9} />
      <pointLight position={[0, 2.4, 8.6]} color="#ffd9a8" intensity={isDesktop ? 16 : 9} distance={8} />

      <Room isDesktop={isDesktop} />
      <Facade />
      <CentralCounter isDesktop={isDesktop} />
      <RingBar isDesktop={isDesktop} />
      <GalleryBusts isDesktop={isDesktop} />
      <EditAlcoves isDesktop={isDesktop} />
      <GiftingLounge isDesktop={isDesktop} />

      {PRODUCTS.map((p) => (
        <ClickablePiece key={p.id} product={p} onPick={onPick} />
      ))}
    </>
  );
}

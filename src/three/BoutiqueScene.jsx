// Aajiva 3D boutique — photorealistic presentation of the REAL aajiva.com
// catalogue. Products appear as framed real-photo showcases on walls and
// photo cards on the counters; the procedural jewellery meshes are gone.
// Scene realism: marble floor, plaster walls, walnut counters, velvet weave,
// brushed-gold frames, ACES tone mapping, soft shadows, warm boutique light.
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three-stdlib';
import { ZONES } from '../data/products';
import { zoneFraming } from './cameraFit';
import { ZoneShowcases } from './Showcase';
import { glassMaterial } from './materials';
import { marbleTexture, plasterTexture, woodTexture, velvetTexture } from './textures';

/* Local environment lighting — RoomEnvironment via PMREM (no external HDR fetch). */
function LocalEnv() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const env = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromScene(env, 0.04);
    scene.environment = rt.texture;
    // keep the environment from flattening the warm boutique light
    if ('environmentIntensity' in scene) scene.environmentIntensity = 0.5;
    return () => {
      scene.environment = null;
      rt.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/* Smooth camera fly-between zone viewpoints — aspect-aware so portrait
 * phones keep the whole zone subject in frame. On desktop the computed
 * distance never exceeds the authored one, so desktop framing is untouched. */
function CameraRig({ zoneId, entered, reducedMotion }) {
  const { camera, size } = useThree();
  const cur = useRefSafe();
  const target = useRefSafe();
  const lastSize = useMemo(() => ({ w: 0, h: 0 }), []);
  const zone = useMemo(
    () => ZONES.find((x) => x.id === (entered ? zoneId : 'entrance')) || ZONES[0],
    [zoneId, entered]
  );
  const view = zone.view;

  useEffect(() => {
    const w = size.width, h = size.height;
    const aspect = w / Math.max(h, 1);
    const shortLandscape = aspect >= 1 && h < 520;
    const { fov, needDist } = zoneFraming(zone, aspect, shortLandscape);

    const pos = new THREE.Vector3(...view.pos);
    const look = new THREE.Vector3(...view.look);
    const dir = pos.clone().sub(look);
    const authoredDist = dir.length();
    dir.normalize();
    // only ever pull the camera BACK, never push it closer than authored
    const dist = Math.max(authoredDist, needDist);
    const adjPos = look.clone().add(dir.multiplyScalar(dist));

    target.current.pos.copy(adjPos);
    target.current.look.copy(look);

    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    const sizeChanged = lastSize.w !== w || lastSize.h !== h;
    lastSize.w = w; lastSize.h = h;
    if (reducedMotion || sizeChanged) {
      // snap on rotation/resize so no stale frame lingers (main canvas may be
      // frameloop='never' while the pick-up view is open)
      cur.current.pos.copy(adjPos);
      cur.current.look.copy(look);
      camera.position.copy(adjPos);
      camera.lookAt(look);
    }
  }, [view, zone, size.width, size.height, reducedMotion, camera, cur, target, lastSize]);

  useFrame((_, dt) => {
    if (reducedMotion) return;
    const k = 2.4;
    const c = cur.current, t = target.current;
    c.pos.x = THREE.MathUtils.damp(c.pos.x, t.pos.x, k, dt);
    c.pos.y = THREE.MathUtils.damp(c.pos.y, t.pos.y, k, dt);
    c.pos.z = THREE.MathUtils.damp(c.pos.z, t.pos.z, k, dt);
    c.look.x = THREE.MathUtils.damp(c.look.x, t.look.x, k, dt);
    c.look.y = THREE.MathUtils.damp(c.look.y, t.look.y, k, dt);
    c.look.z = THREE.MathUtils.damp(c.look.z, t.look.z, k, dt);
    camera.position.copy(c.pos);
    camera.lookAt(c.look);
  });
  return null;
}

// small helper: refs pre-filled with camera home values
function useRefSafe() {
  return useRef({ pos: new THREE.Vector3(0, 1.7, 11.2), look: new THREE.Vector3(0, 1.9, 4.5) });
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
    g.fillStyle = '#20211f';
    g.fillRect(0, 0, 1024, 200);
    g.strokeStyle = '#b28f54';
    g.lineWidth = 4;
    g.strokeRect(14, 14, 996, 172);
    g.fillStyle = '#f2e8cf';
    g.font = '600 96px Georgia, serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('A A J I V A', 512, 104);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function Facade() {
  const sign = SignTexture();
  const glass = useMemo(glassMaterial, []);
  return (
    <group position={[0, 0, 7]}>
      {/* sign board */}
      <mesh position={[0, 3.35, 0]}>
        <boxGeometry args={[8.4, 1.5, 0.25]} />
        <meshStandardMaterial color="#23211e" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, 3.35, 0.14]}>
        <planeGeometry args={[7.8, 1.2]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {/* pillars */}
      {[-4.1, 4.1].map((x) => (
        <mesh key={x} position={[x, 1.6, 0]}>
          <boxGeometry args={[0.5, 3.4, 0.5]} />
          <meshStandardMaterial color="#2c2a26" roughness={0.35} metalness={0.8} />
        </mesh>
      ))}
      {/* lintel */}
      <mesh position={[0, 2.75, 0]}>
        <boxGeometry args={[7.7, 0.22, 0.4]} />
        <meshStandardMaterial color="#e8dfc9" roughness={0.8} />
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
  const marble = useMemo(marbleTexture, []);
  const plaster = useMemo(plasterTexture, []);
  return (
    <group>
      {/* marble floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow={isDesktop}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial map={marble} roughness={0.28} metalness={0.05} envMapIntensity={0.7} />
      </mesh>
      {/* rug under central counter */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <planeGeometry args={[7, 4]} />
        <meshStandardMaterial color="#b9b3a3" roughness={0.98} />
      </mesh>
      {/* plaster walls */}
      <mesh position={[0, 2.2, -7.5]}>
        <planeGeometry args={[20, 4.4]} />
        <meshStandardMaterial map={plaster} roughness={0.92} />
      </mesh>
      <mesh position={[-10, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[16, 4.4]} />
        <meshStandardMaterial map={plaster} roughness={0.92} />
      </mesh>
      <mesh position={[10, 2.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[16, 4.4]} />
        <meshStandardMaterial map={plaster} roughness={0.92} />
      </mesh>
      {/* ceiling */}
      <mesh position={[0, 4.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#efe9da" roughness={1} />
      </mesh>
    </group>
  );
}

/* Hanging pendant lamps with warm emissive shades + real point glow. */
function Pendants({ isDesktop }) {
  const xs = [-2.2, 0, 2.2];
  return (
    <group>
      {xs.map((x) => (
        <group key={x} position={[x, 0, 0]}>
          {/* cord */}
          <mesh position={[0, 3.85, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 1.1, 8]} />
            <meshStandardMaterial color="#1c1a17" roughness={0.6} />
          </mesh>
          {/* shade — cone with warm emissive inside */}
          <mesh position={[0, 3.15, 0]}>
            <cylinderGeometry args={[0.09, 0.34, 0.34, 24, 1, true]} />
            <meshStandardMaterial color="#2e2b25" roughness={0.4} metalness={0.7} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 3.02, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color="#ffca7e" toneMapped={false} />
          </mesh>
          <pointLight
            position={[0, 2.9, 0]}
            color="#ffc98f"
            intensity={isDesktop ? 9 : 5}
            distance={6.5}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}

function CentralCounter({ isDesktop }) {
  const wood = useMemo(woodTexture, []);
  const velvetA = useMemo(() => velvetTexture('#8f9484'), []);
  const velvetB = useMemo(() => velvetTexture('#7d8471'), []);
  const glass = useMemo(glassMaterial, []);
  return (
    <group>
      {/* walnut counter body */}
      <mesh position={[0, 0.45, 0]} castShadow={isDesktop}>
        <boxGeometry args={[4.6, 0.9, 1.7]} />
        <meshStandardMaterial map={wood} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* brass trim */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[4.7, 0.05, 1.8]} />
        <meshStandardMaterial color="#a8854c" roughness={0.38} metalness={0.9} />
      </mesh>
      {/* glass case */}
      <mesh position={[0, 1.35, 0]} material={glass}>
        <boxGeometry args={[4.5, 0.85, 1.6]} />
      </mesh>
      {/* velvet trays */}
      <mesh position={[-1.15, 1.0, 0]} receiveShadow={isDesktop}>
        <boxGeometry args={[1.95, 0.06, 1.15]} />
        <meshStandardMaterial map={velvetA} roughness={0.98} />
      </mesh>
      <mesh position={[1.15, 1.0, 0]} receiveShadow={isDesktop}>
        <boxGeometry args={[1.95, 0.06, 1.15]} />
        <meshStandardMaterial map={velvetB} roughness={0.98} />
      </mesh>
    </group>
  );
}

function RingBar({ isDesktop }) {
  const stands = [-3.2, -2.0, -0.8];
  return (
    <group>
      {stands.map((z) => (
        <group key={z} position={[-9.1, 0.9, z]}>
          <mesh position={[0, 0.25, 0]} castShadow={isDesktop}>
            <cylinderGeometry args={[0.09, 0.13, 0.5, 16]} />
            <meshStandardMaterial color="#c8ccd4" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.03, 16]} />
            <meshStandardMaterial color="#6f6a5e" roughness={0.95} />
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
            <meshStandardMaterial color="#c8ccd4" roughness={0.35} metalness={0.85} />
          </mesh>
          <mesh position={[0, 1.18, 0]} castShadow={isDesktop}>
            <cylinderGeometry args={[0.11, 0.16, 0.5, 16]} />
            <meshStandardMaterial color="#d9cbb2" roughness={0.75} />
          </mesh>
          <mesh position={[0, 1.52, 0]}>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color="#d9cbb2" roughness={0.75} />
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
        <meshStandardMaterial color="#e6dcc6" roughness={0.85} />
      </mesh>
      {/* men's — charcoal pedestal */}
      <mesh position={[6.5, 0.55, 2.5]} castShadow={isDesktop}>
        <boxGeometry args={[1.6, 1.1, 1.6]} />
        <meshStandardMaterial color="#26262b" roughness={0.55} />
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
          <meshStandardMaterial color="#6f6a5e" roughness={0.95} />
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
        <meshStandardMaterial color="#26262b" roughness={0.6} />
      </mesh>
      {/* gift boxes */}
      {[
        { p: [-0.55, 0.68, -0.5], s: 0.34, c: '#e8cfc6' },
        { p: [0.55, 0.66, -0.55], s: 0.3, c: '#b9c0ac' },
        { p: [0.1, 0.62, 0.6], s: 0.26, c: '#efe8d8' },
      ].map((b, i) => (
        <group key={i} position={b.p}>
          <mesh>
            <boxGeometry args={[b.s, b.s * 0.7, b.s]} />
            <meshStandardMaterial color={b.c} roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[b.s * 0.18, b.s * 0.72, b.s + 0.005]} />
            <meshStandardMaterial color="#8a8f98" roughness={0.4} metalness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function BoutiqueScene({ zoneId, shelfProducts, onPick, isDesktop, reducedMotion }) {
  return (
    <>
      <LocalEnv />
      <CameraRig zoneId={zoneId} entered reducedMotion={reducedMotion} />
      {/* subtle depth fog */}
      <fog attach="fog" args={['#e9e0cb', 15, 32]} />
      {/* lighting — warm boutique */}
      <ambientLight intensity={0.38} />
      <hemisphereLight args={['#fff3e2', '#7a6c54', 0.32]} />
      <Spot position={[0, 4.2, 0]} target={[0, 1, 0]} angle={0.7} penumbra={0.65} intensity={isDesktop ? 110 : 55} color="#ffe2b8" castShadow={isDesktop} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
      <Spot position={[-7, 4, -2]} target={[-9, 1.4, -2]} angle={0.6} penumbra={0.7} intensity={isDesktop ? 60 : 30} color="#ffdcb0" />
      <Spot position={[0, 4, -5]} target={[0, 1.6, -6.8]} angle={0.6} penumbra={0.7} intensity={isDesktop ? 60 : 30} color="#ffdcb0" />
      <Spot position={[5.5, 4, 0.3]} target={[7, 1.6, 0.3]} angle={0.55} penumbra={0.7} intensity={isDesktop ? 70 : 35} color="#ffe2b8" />
      <pointLight position={[-5.6, 2.6, 3.4]} color="#ffd3a0" intensity={isDesktop ? 22 : 12} distance={9} />
      <pointLight position={[0, 2.4, 8.6]} color="#ffd3a0" intensity={isDesktop ? 16 : 9} distance={8} />

      <Room isDesktop={isDesktop} />
      <Facade />
      <Pendants isDesktop={isDesktop} />
      <CentralCounter isDesktop={isDesktop} />
      <RingBar isDesktop={isDesktop} />
      <GalleryBusts isDesktop={isDesktop} />
      <EditAlcoves isDesktop={isDesktop} />
      <GiftingLounge isDesktop={isDesktop} />

      <ZoneShowcases zoneId={zoneId} shelfProducts={shelfProducts} onPick={onPick} />
    </>
  );
}

import { useMemo } from 'react';
import * as THREE from 'three';
import { silverMaterial, gemMaterial, pearlMaterial, GEM_COLORS } from './materials';

/* ── Procedural jewellery models. Distinct geometry per category. ── */

function useMats(gem) {
  return useMemo(
    () => ({ silver: silverMaterial(), gem: gemMaterial(gem), pearl: pearlMaterial() }),
    [gem]
  );
}

const GemOcta = ({ r, mats, position }) => (
  <mesh position={position} material={mats.gem}>
    <octahedronGeometry args={[r, 0]} />
  </mesh>
);

/* Simple band + centre stone. */
function RingModel({ gem, mats }) {
  return (
    <group>
      <mesh material={mats.silver} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.16, 0.028, 16, 48]} />
      </mesh>
      {/* setting */}
      <mesh position={[0, 0.19, 0]} material={mats.silver}>
        <cylinderGeometry args={[0.035, 0.045, 0.05, 12]} />
      </mesh>
      <GemOcta r={0.055} mats={mats} position={[0, 0.245, 0]} />
    </group>
  );
}

/* Band studded all around with small stones. */
function EternityRingModel({ gem, mats }) {
  const stones = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      arr.push([Math.cos(a) * 0.16, Math.sin(a) * 0.16, 0]);
    }
    return arr;
  }, []);
  return (
    <group>
      <mesh material={mats.silver}>
        <torusGeometry args={[0.16, 0.024, 16, 48]} />
      </mesh>
      {stones.map((p, i) => (
        <mesh key={i} position={p} material={mats.gem}>
          <octahedronGeometry args={[i % 2 === 0 ? 0.032 : 0.024, 0]} />
        </mesh>
      ))}
    </group>
  );
}

/* Centre stone framed by a halo of small stones. */
function HaloRingModel({ gem, mats }) {
  const halo = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      arr.push([Math.cos(a) * 0.075, 0.245, Math.sin(a) * 0.075]);
    }
    return arr;
  }, []);
  return (
    <group>
      <mesh material={mats.silver}>
        <torusGeometry args={[0.16, 0.028, 16, 48]} />
      </mesh>
      <mesh position={[0, 0.2, 0]} material={mats.silver}>
        <cylinderGeometry args={[0.05, 0.06, 0.05, 12]} />
      </mesh>
      <GemOcta r={0.06} mats={mats} position={[0, 0.26, 0]} />
      {halo.map((p, i) => (
        <mesh key={i} position={p} material={mats.gem}>
          <octahedronGeometry args={[0.018, 0]} />
        </mesh>
      ))}
    </group>
  );
}

/* Tapered wrap: band that overlaps with pavé scatter. */
function WrapRingModel({ gem, mats }) {
  const scatter = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 1.15;
      arr.push([Math.cos(a) * 0.16, Math.sin(a) * 0.16, 0.02]);
    }
    return arr;
  }, []);
  return (
    <group>
      <mesh material={mats.silver} rotation={[0, 0, 0.18]}>
        <torusGeometry args={[0.16, 0.026, 16, 48, Math.PI * 1.7]} />
      </mesh>
      <mesh material={mats.silver} rotation={[0, 0, -0.15]} position={[0.02, 0.02, 0.012]}>
        <torusGeometry args={[0.145, 0.02, 14, 48, Math.PI * 1.2]} />
      </mesh>
      {scatter.map((p, i) => (
        <mesh key={i} position={p} material={mats.gem}>
          <octahedronGeometry args={[0.016, 0]} />
        </mesh>
      ))}
    </group>
  );
}

/* Two interlocked loops on a band. */
function InfinityRingModel({ gem, mats }) {
  return (
    <group>
      <mesh material={mats.silver}>
        <torusGeometry args={[0.16, 0.028, 16, 48]} />
      </mesh>
      <group position={[0, 0.21, 0]}>
        <mesh material={mats.silver} position={[-0.045, 0, 0]} rotation={[0, 0.5, 0]}>
          <torusGeometry args={[0.05, 0.016, 12, 32]} />
        </mesh>
        <mesh material={mats.silver} position={[0.045, 0, 0]} rotation={[0, -0.5, 0]}>
          <torusGeometry args={[0.05, 0.016, 12, 32]} />
        </mesh>
        <GemOcta r={0.03} mats={mats} position={[0, 0.045, 0]} />
      </group>
    </group>
  );
}

/* Chain loop + halo pendant. */
function PendantModel({ gem, mats }) {
  const halo = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      arr.push([Math.cos(a) * 0.08, Math.sin(a) * 0.08, 0]);
    }
    return arr;
  }, []);
  return (
    <group>
      {/* chain */}
      <mesh material={mats.silver} position={[0, 0.32, 0]}>
        <torusGeometry args={[0.3, 0.008, 8, 64]} />
      </mesh>
      {/* bail + pendant */}
      <mesh position={[0, 0.0, 0]} material={mats.silver}>
        <torusGeometry args={[0.02, 0.008, 8, 20]} />
      </mesh>
      <group position={[0, -0.12, 0]}>
        <GemOcta r={0.06} mats={mats} position={[0, 0, 0]} />
        {halo.map((p, i) => (
          <mesh key={i} position={p} material={mats.gem}>
            <octahedronGeometry args={[0.018, 0]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* Strand of pearls on a fine loop. */
function PearlNecklaceModel({ mats }) {
  const pearls = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      arr.push([Math.cos(a) * 0.3, 0.32 + Math.sin(a) * 0.3 * 1.15, 0]);
    }
    return arr;
  }, []);
  const pendant = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      arr.push([Math.cos(a) * 0.3, 0.32 + Math.sin(a) * 0.3 * 1.15, 0]);
    }
    return arr;
  }, []);
  return (
    <group>
      {pendant.map((p, i) => (
        <mesh key={i} position={p} material={mats.silver}>
          <sphereGeometry args={[0.008, 8, 8]} />
        </mesh>
      ))}
      {pearls.map((p, i) => (
        <mesh key={'pl' + i} position={p} material={mats.pearl}>
          <sphereGeometry args={[i === 12 ? 0.045 : 0.028, 16, 16]} />
        </mesh>
      ))}
    </group>
  );
}

function heartGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(-0.9, 0.1, -0.55, 0.75, 0, 0.32);
  s.bezierCurveTo(0.55, 0.75, 0.9, 0.1, 0, -0.5);
  return new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2 });
}

/* Heart pendant on chain. */
function HeartPendantModel({ gem, mats }) {
  const geo = useMemo(heartGeometry, []);
  return (
    <group>
      <mesh material={mats.silver} position={[0, 0.32, 0]}>
        <torusGeometry args={[0.3, 0.008, 8, 64]} />
      </mesh>
      <mesh position={[0, -0.1, -0.11]} material={mats.gem} geometry={geo} scale={0.32} />
      <mesh position={[0, 0.02, 0]} material={mats.silver}>
        <torusGeometry args={[0.018, 0.007, 8, 20]} />
      </mesh>
    </group>
  );
}

/* Pair of hook drops. */
function EarringsModel({ gem, mats, scale = 1 }) {
  const one = (x) => (
    <group position={[x, 0, 0]}>
      <mesh material={mats.silver}>
        <torusGeometry args={[0.05, 0.008, 8, 24, Math.PI * 1.4]} />
      </mesh>
      <mesh position={[0.035, -0.06, 0]} material={mats.silver}>
        <cylinderGeometry args={[0.006, 0.006, 0.05, 8]} />
      </mesh>
      <group position={[0.035, -0.14, 0]}>
        <GemOcta r={0.05} mats={mats} position={[0, 0, 0]} />
        <mesh position={[0, -0.07, 0]} material={mats.silver}>
          <coneGeometry args={[0.02, 0.04, 12]} />
        </mesh>
        <GemOcta r={0.028} mats={mats} position={[0, -0.1, 0]} />
      </group>
    </group>
  );
  return (
    <group scale={scale}>
      {one(-0.11)}
      {one(0.11)}
    </group>
  );
}

/* Necklace + earring pair, as sold. */
function SetModel({ gem, mats }) {
  return (
    <group>
      <group position={[-0.28, 0.05, 0]} scale={0.75}>
        <PendantModel gem={gem} mats={mats} />
      </group>
      <group position={[0.3, 0.05, 0]}>
        <EarringsModel gem={gem} mats={mats} scale={0.9} />
      </group>
    </group>
  );
}

/* Cord + silver bar + onyx beads. */
function OnyxBraceletModel({ gem, mats }) {
  const beads = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * 0.25 + (i / 8) * Math.PI * 1.5;
      arr.push([Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0]);
    }
    return arr;
  }, []);
  return (
    <group>
      <mesh material={new THREE.MeshStandardMaterial({ color: '#26262b', roughness: 0.9 })}>
        <torusGeometry args={[0.3, 0.014, 8, 64]} />
      </mesh>
      {beads.map((p, i) => (
        <mesh key={i} position={p} material={mats.gem}>
          <sphereGeometry args={[0.035, 14, 14]} />
        </mesh>
      ))}
      <mesh position={[0, -0.3, 0]} material={mats.silver}>
        <boxGeometry args={[0.16, 0.045, 0.03]} />
      </mesh>
    </group>
  );
}

/* Chunky interlocked links. */
function ChainBraceletModel({ gem, mats }) {
  const links = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      arr.push({ p: [Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0], rot: a });
    }
    return arr;
  }, []);
  return (
    <group>
      {links.map((l, i) => (
        <mesh
          key={i}
          position={l.p}
          rotation={[0, 0, l.rot + Math.PI / 2]}
          material={mats.silver}
        >
          <torusGeometry args={[0.075, 0.024, 10, 24]} />
        </mesh>
      ))}
    </group>
  );
}

/* Dispatcher — TRUE distinct geometry per model key. */
export function JewelryModel({ model, gem = 'diamond', scale = 1 }) {
  const mats = useMats(gem);
  return (
    <group scale={scale}>
      {model === 'ring' && <RingModel gem={gem} mats={mats} />}
      {model === 'eternity-ring' && <EternityRingModel gem={gem} mats={mats} />}
      {model === 'halo-ring' && <HaloRingModel gem={gem} mats={mats} />}
      {model === 'wrap-ring' && <WrapRingModel gem={gem} mats={mats} />}
      {model === 'infinity-ring' && <InfinityRingModel gem={gem} mats={mats} />}
      {model === 'pendant' && <PendantModel gem={gem} mats={mats} />}
      {model === 'pearl-necklace' && <PearlNecklaceModel mats={mats} />}
      {model === 'heart-pendant' && <HeartPendantModel gem={gem} mats={mats} />}
      {model === 'onyx-bracelet' && <OnyxBraceletModel gem={gem} mats={mats} />}
      {model === 'chain-bracelet' && <ChainBraceletModel gem={gem} mats={mats} />}
      {model === 'set' && <SetModel gem={gem} mats={mats} />}
    </group>
  );
}

/* Friendly label for the category tag. */
export const MODEL_LABELS = {
  ring: 'Ring',
  'eternity-ring': 'Ring',
  'halo-ring': 'Ring',
  'wrap-ring': 'Ring',
  'infinity-ring': 'Ring',
  pendant: 'Pendant',
  'pearl-necklace': 'Necklace',
  'heart-pendant': 'Pendant',
  'onyx-bracelet': 'Bracelet',
  'chain-bracelet': 'Bracelet',
  set: 'Set',
};

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RoomEnvironment } from 'three-stdlib';
import { JewelryModel, MODEL_LABELS } from '../three/models';
import { formatINR } from '../data/products';

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

/* Gentle turntable until the visitor grabs it. */
function Turntable({ children, auto }) {
  const ref = useRef();
  const [grabbed, setGrabbed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    return undefined;
  }, []);
  useFrame((_, dt) => {
    if (ref.current && auto && !grabbed) ref.current.rotation.y += dt * 0.7;
  });
  return (
    <group
      ref={ref}
      onPointerDown={() => setGrabbed(true)}
    >
      {children}
    </group>
  );
}

function Scene({ product, isDesktop, reducedMotion }) {
  return (
    <>
      <LocalEnv />
      <color attach="background" args={['#f6f1e7']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[2.5, 4, 3]} angle={0.6} penumbra={0.7} intensity={isDesktop ? 70 : 35} color="#ffe8c4" />
      <pointLight position={[-2.5, 1.5, 2.5]} color="#ffd9a8" intensity={isDesktop ? 14 : 8} distance={10} />
      {/* velvet stand */}
      <mesh position={[0, -0.85, 0]} receiveShadow={isDesktop}>
        <cylinderGeometry args={[1.1, 1.25, 0.35, 40]} />
        <meshStandardMaterial color="#9aa78d" roughness={0.95} />
      </mesh>
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 0.25, 32]} />
        <meshStandardMaterial color="#c9ced6" roughness={0.25} metalness={0.9} />
      </mesh>
      <Turntable auto={!reducedMotion}>
        <group position={[0, 0.15, 0]}>
          <JewelryModel model={product.model} gem={product.gem} scale={2.6} />
        </group>
      </Turntable>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        autoRotate={false}
        minDistance={1.6}
        maxDistance={7}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI - 0.6}
        target={[0, 0.1, 0]}
      />
    </>
  );
}

export default function PickupView({ product, onClose, onAdd, isDesktop, reducedMotion }) {
  const [flipped, setFlipped] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col md:flex-row animate-fade-in">
      {/* 3D */}
      <div className="relative flex-1 min-h-[46%] md:min-h-0 bg-ivory-100">
        <Canvas
          dpr={[1, isDesktop ? 1.75 : 1.25]}
          shadows={isDesktop}
          gl={{ antialias: true }}
          camera={{ fov: 42, near: 0.1, far: 40, position: [0, 0.7, 4.2] }}
        >
          <Scene product={product} isDesktop={isDesktop} reducedMotion={reducedMotion} />
        </Canvas>
        <button
          onClick={onClose}
          aria-label="Back to the shop"
          className="absolute top-4 left-4 rounded-full bg-charcoal-900/85 text-ivory-50 w-10 h-10 flex items-center justify-center text-lg hover:bg-charcoal-800"
        >
          ←
        </button>
        <p className="absolute bottom-3 inset-x-0 text-center text-[11px] tracking-[0.2em] uppercase text-charcoal-700/60">
          Drag to turn · Scroll to zoom
        </p>
      </div>

      {/* price tag card */}
      <div className="flex-1 md:max-w-md bg-ivory-50 border-t md:border-t-0 md:border-l border-silver-300/60 p-6 md:p-8 flex flex-col overflow-y-auto thin-scroll">
        <p className="text-[11px] tracking-[0.35em] uppercase text-sage-600 font-bold">
          {MODEL_LABELS[product.model]} · 925 Sterling Silver
        </p>
        <h2 className="font-display text-2xl md:text-3xl text-charcoal-900 mt-2 leading-snug">
          {product.name}
        </h2>
        <p className="font-serif-alt italic text-charcoal-700 mt-2">{product.blurb}</p>

        <div className={`flip-scene mt-5 ${flipped ? 'flipped' : ''}`}>
          <div className="flip-inner relative min-h-44">
            {/* front: price */}
            <div className="flip-face rounded-2xl bg-white border border-silver-300/70 p-5 shadow-md">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl text-charcoal-900">{formatINR(product.price)}</span>
                {product.mrp && (
                  <span className="text-silver-500 line-through text-lg">{formatINR(product.mrp)}</span>
                )}
              </div>
              <p className="text-[12px] text-charcoal-700/70 mt-1">Skin-safe · made for everyday wear</p>
              <button
                onClick={() => setFlipped(true)}
                className="mt-3 text-[12px] font-bold tracking-[0.2em] uppercase text-sage-600 underline underline-offset-4"
              >
                Flip the tag ↻
              </button>
            </div>
            {/* back: details */}
            <div className="flip-face flip-back absolute inset-0 rounded-2xl bg-charcoal-900 text-ivory-50 p-5 shadow-md">
              <p className="font-display text-lg tracking-[0.2em]">925</p>
              <ul className="text-[13px] mt-2 space-y-1 text-ivory-50/85">
                <li>· Genuine 925 sterling silver</li>
                <li>· Skin-safe, nickel-conscious finish</li>
                <li>· Designed for daily wear</li>
                <li>· Gift-ready Aajiva packaging</li>
              </ul>
              <button
                onClick={() => setFlipped(false)}
                className="mt-3 text-[12px] font-bold tracking-[0.2em] uppercase text-silver-300 underline underline-offset-4"
              >
                Flip back ↻
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 flex flex-col gap-3">
          <button
            onClick={handleAdd}
            className={`rounded-full py-4 text-sm font-bold tracking-[0.25em] uppercase transition-colors ${
              added ? 'bg-sage-600 text-ivory-50' : 'bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800'
            }`}
          >
            {added ? '✓ On your tray' : 'Add to tray'}
          </button>
          <a
            href="https://aajiva.com/shop"
            target="_blank"
            rel="noreferrer"
            className="text-center text-[12px] font-semibold text-charcoal-700 underline underline-offset-4"
          >
            See it on aajiva.com →
          </a>
        </div>
      </div>
    </div>
  );
}

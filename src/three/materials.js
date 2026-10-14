import * as THREE from 'three';

// Shared PBR materials — created once, reused everywhere.
export const GEM_COLORS = {
  sapphire: { color: '#1e3fae', emissive: '#0a1a5e', sparkle: 1.0 },
  emerald: { color: '#0e7a4f', emissive: '#063d28', sparkle: 1.0 },
  citrine: { color: '#e0a92e', emissive: '#6e4a08', sparkle: 0.9 },
  ruby: { color: '#b3123a', emissive: '#4d0518', sparkle: 1.0 },
  diamond: { color: '#eef2f7', emissive: '#5a6472', sparkle: 1.2 },
  pearl: { color: '#f4ecdd', emissive: '#8f8471', sparkle: 0.2 },
  onyx: { color: '#17171b', emissive: '#000000', sparkle: 0.1 },
};

export function silverMaterial() {
  return new THREE.MeshStandardMaterial({
    color: '#d7dbe2',
    metalness: 1.0,
    roughness: 0.16,
  });
}

export function gemMaterial(kind = 'diamond') {
  const g = GEM_COLORS[kind] || GEM_COLORS.diamond;
  return new THREE.MeshPhysicalMaterial({
    color: g.color,
    emissive: g.emissive,
    emissiveIntensity: 0.35,
    metalness: 0.1,
    roughness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
  });
}

export function pearlMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: '#f4ecdd',
    metalness: 0.05,
    roughness: 0.32,
    clearcoat: 0.8,
    clearcoatRoughness: 0.25,
    iridescence: 0.35,
  });
}

export function velvetMaterial() {
  return new THREE.MeshStandardMaterial({ color: '#9aa78d', roughness: 0.95, metalness: 0 });
}

export function glassMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0,
    roughness: 0.02,
    transmission: 0, // keep cheap; opacity-based glass
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

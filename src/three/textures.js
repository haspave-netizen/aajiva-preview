// Procedural photoreal-ish textures drawn at runtime on canvas.
// Marble floor, plaster walls, walnut wood, velvet weave, brushed metal.
// They replace the flat solid colours that read as "cartoon".
import * as THREE from 'three';

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function toTexture(c, { srgb = true, repeat = [1, 1] } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 4;
  return t;
}

let rndState = 123456789;
const rnd = () => {
  rndState = (rndState * 1664525 + 1013904223) >>> 0;
  return rndState / 4294967296;
};

/* Carrara-ish marble: warm ivory base with grey/gold veins. */
export function marbleTexture() {
  const [c, g] = makeCanvas(1024, 1024);
  g.fillStyle = '#e7dfcf'; g.fillRect(0, 0, 1024, 1024);
  // soft tonal patches
  for (let i = 0; i < 40; i++) {
    const x = rnd() * 1024, y = rnd() * 1024, r = 60 + rnd() * 200;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    const tint = rnd() > 0.5 ? '214,203,182' : '233,226,212';
    gr.addColorStop(0, `rgba(${tint},0.35)`);
    gr.addColorStop(1, `rgba(${tint},0)`);
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // veins
  for (let i = 0; i < 26; i++) {
    let x = rnd() * 1024, y = rnd() * 1024;
    g.strokeStyle = `rgba(120,112,96,${0.10 + rnd() * 0.14})`;
    g.lineWidth = 0.6 + rnd() * 1.8;
    g.beginPath(); g.moveTo(x, y);
    const steps = 8 + Math.floor(rnd() * 10);
    for (let s = 0; s < steps; s++) {
      x += (rnd() - 0.5) * 220; y += (rnd() - 0.5) * 220;
      g.quadraticCurveTo(x + (rnd() - 0.5) * 90, y + (rnd() - 0.5) * 90, x, y);
    }
    g.stroke();
  }
  // fine grain
  const img = g.getImageData(0, 0, 1024, 1024);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * 9;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  return toTexture(c, { repeat: [3, 2.4] });
}

/* Subtle limewash plaster for walls. */
export function plasterTexture(base = '#ece4d2') {
  const [c, g] = makeCanvas(512, 512);
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 60; i++) {
    const x = rnd() * 512, y = rnd() * 512, r = 30 + rnd() * 90;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    const up = rnd() > 0.5;
    gr.addColorStop(0, up ? 'rgba(255,252,244,0.10)' : 'rgba(150,138,118,0.08)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const img = g.getImageData(0, 0, 512, 512);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * 7;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  return toTexture(c, { repeat: [4, 1] });
}

/* Dark walnut counter fronts. */
export function woodTexture() {
  const [c, g] = makeCanvas(512, 512);
  g.fillStyle = '#3a2c20'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 90; i++) {
    const y = rnd() * 512;
    g.strokeStyle = `rgba(${20 + rnd() * 40},${14 + rnd() * 26},${8 + rnd() * 16},${0.25 + rnd() * 0.4})`;
    g.lineWidth = 0.6 + rnd() * 2.2;
    g.beginPath(); g.moveTo(-10, y);
    for (let x = 0; x <= 522; x += 60) {
      g.quadraticCurveTo(x + 30, y + (rnd() - 0.5) * 14, x + 60, y + (rnd() - 0.5) * 8);
    }
    g.stroke();
  }
  // plank seams
  for (let y = 0; y < 512; y += 128) {
    g.strokeStyle = 'rgba(12,8,5,0.7)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke();
  }
  return toTexture(c, { repeat: [2, 1] });
}

/* Velvet tray — base colour + weave speckle so it never reads flat. */
export function velvetTexture(hex) {
  const [c, g] = makeCanvas(256, 256);
  g.fillStyle = hex; g.fillRect(0, 0, 256, 256);
  const img = g.getImageData(0, 0, 256, 256);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const px = (i / 4) % 256, py = Math.floor(i / 4 / 256);
    const weave = ((px + py) % 2 === 0 ? 1 : -1) * 5;
    const n = (rnd() - 0.5) * 12 + weave;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  return toTexture(c, { repeat: [2, 2] });
}

/* Brushed metal — fine horizontal streaks for the gold frames. */
export function brushedTexture(base = '#a8854c') {
  const [c, g] = makeCanvas(256, 64);
  g.fillStyle = base; g.fillRect(0, 0, 256, 64);
  for (let i = 0; i < 400; i++) {
    const y = rnd() * 64;
    g.strokeStyle = rnd() > 0.5 ? 'rgba(255,240,214,0.25)' : 'rgba(60,42,20,0.28)';
    g.lineWidth = 0.6;
    const x = rnd() * 256, len = 30 + rnd() * 120;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + len, y); g.stroke();
  }
  return toTexture(c, { repeat: [1, 1] });
}

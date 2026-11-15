import sharp from "sharp";
import fs from "node:fs";
import potrace from "potrace";
const { W, H } = JSON.parse(fs.readFileSync("dims.json"));
const cls = fs.readFileSync("cls.bin");
const N = W * H;
const raw = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 1 } });

// 1. Water: clean the mask, keep only what connects to the sea and the river
const wm = Buffer.alloc(N);
for (let p = 0; p < N; p++) wm[p] = cls[p] === 1 ? 255 : 0;
const wSoft = await raw(wm).blur(4).extractChannel(0).raw().toBuffer();
// opening: erode (threshold high) to cut thin links to inland ponds
const wErode = Buffer.alloc(N);
for (let p = 0; p < N; p++) wErode[p] = wSoft[p] > 150 ? 1 : 0;
const keep = Buffer.alloc(N);
const seeds = [[100, 600], [400, 1100], [600, 900], [1126, 676], [1600, 560], [1990, 240], [1400, 620]];
const stack = [];
for (const [x, y] of seeds) { const p = y * W + x; if (wErode[p]) { keep[p] = 1; stack.push(p); } else console.log("seed not water", x, y); }
while (stack.length) {
  const p = stack.pop(); const x = p % W, y = (p / W) | 0;
  for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < H - 1 ? p + W : -1]) {
    if (q >= 0 && wErode[q] && !keep[q]) { keep[q] = 1; stack.push(q); }
  }
}
// grow back (dilate) inside the soft mask
const kb = Buffer.alloc(N); for (let p = 0; p < N; p++) kb[p] = keep[p] ? 255 : 0;
const grown = await raw(kb).blur(5).extractChannel(0).raw().toBuffer();
const water = Buffer.alloc(N);
for (let p = 0; p < N; p++) water[p] = grown[p] > 40 && wSoft[p] > 100 ? 1 : 0;

// 2. Land classes: smooth by blurring one-hot masks and taking the strongest
const landCls = [0, 2, 3, 4];
const soft = {};
for (const k of landCls) {
  const m = Buffer.alloc(N);
  for (let p = 0; p < N; p++) m[p] = (cls[p] === k || (k === 0 && cls[p] === 1 && !water[p])) ? 255 : 0;
  soft[k] = await raw(m).blur(k === 4 ? 2.5 : 7).extractChannel(0).raw().toBuffer();
}
const final = Buffer.alloc(N);
for (let p = 0; p < N; p++) {
  if (water[p]) { final[p] = 1; continue; }
  let best = 0, bv = -1;
  for (const k of landCls) { const v = soft[k][p] * (k === 4 ? 1.6 : k === 0 ? 0.85 : 1); if (v > bv) { bv = v; best = k; } }
  final[p] = best;
}

// 3. Trace each class
const trace = (mask, color, opts = {}) => new Promise((res, rej) => {
  const png = sharp(mask, { raw: { width: W, height: H, channels: 1 } }).png();
  png.toBuffer().then((buf) => {
    const t = new potrace.Potrace({ turdSize: 60, optTolerance: 0.8, alphaMax: 1.2, threshold: 128, blackOnWhite: true, ...opts });
    t.loadImage(buf, (err) => (err ? rej(err) : res(t.getPathTag(color))));
  });
});
const layer = async (k, color, opts) => {
  const m = Buffer.alloc(N);
  for (let p = 0; p < N; p++) m[p] = final[p] === k ? 0 : 255;
  const soft2 = await raw(m).blur(1.5).extractChannel(0).raw().toBuffer();
  return trace(soft2, color, opts);
};
const palette = { land: "#e9e2cc", veg: "#cdd8b1", dense: "#a3bf96", urban: "#ecd3b6", sand: "#f6ebcb", water: "#9cc6c8" };
const parts = [
  `<rect width="${W}" height="${H}" fill="${palette.veg}"/>`,
  await layer(3, palette.urban),
  await layer(2, palette.dense),
  await layer(4, palette.sand, { turdSize: 25 }),
  (await layer(1, palette.water, { turdSize: 120 })).replace('stroke="none"', 'stroke="#7fb0b4" stroke-width="2.5" stroke-linejoin="round"'),
];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${parts.join("")}</svg>`;
fs.writeFileSync("mandovi-map.svg", svg); // copy to scripts/map/ when happy
console.log("svg bytes", svg.length);
await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile("mandovi-map-preview.jpg");

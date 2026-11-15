import sharp from "sharp";
import fs from "node:fs";
const z = 14;
const lon2x = (lon) => ((lon + 180) / 360) * 2 ** z;
const lat2y = (lat) => { const r = (lat * Math.PI) / 180; return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z; };
// Mandovi: Aguada headland (west) to Divar/Chorao (east)
const W = 73.755, E = 73.905, N = 15.555, S = 15.455;
const x0 = Math.floor(lon2x(W)), x1 = Math.floor(lon2x(E)), y0 = Math.floor(lat2y(N)), y1 = Math.floor(lat2y(S));
console.log({ x0, x1, y0, y1, tiles: (x1 - x0 + 1) * (y1 - y0 + 1) });
const comps = [];
for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
  const f = `t_${z}_${x}_${y}.jpg`;
  if (!fs.existsSync(f)) {
    const r = await fetch(`https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/${z}/${y}/${x}.jpg`);
    fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
  }
  comps.push({ input: f, left: (x - x0) * 256, top: (y - y0) * 256 });
}
const width = (x1 - x0 + 1) * 256, height = (y1 - y0 + 1) * 256;
await sharp({ create: { width, height, channels: 3, background: "#000" } }).composite(comps).jpeg({ quality: 82 }).toFile("mandovi-z14.jpg");
// pixel positions of landmarks in the stitched image
const px = (lat, lon) => [Math.round((lon2x(lon) - x0) * 256), Math.round((lat2y(lat) - y0) * 256)];
const marks = { panjimJetty: px(15.4995, 73.8285), reisMagos: px(15.4975, 73.8095), miramar: px(15.4815, 73.807), aguada: px(15.4925, 73.773), chorao: px(15.5345, 73.8745), divar: px(15.523, 73.892) };
console.log(width, height, JSON.stringify(marks));

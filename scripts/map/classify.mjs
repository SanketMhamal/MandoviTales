import sharp from "sharp";
const src = "mandovi-z14.jpg";
const { data: c, info } = await sharp(src).blur(2).raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
// texture: |lum(blur 1.5) - lum(blur 6)| blurred
const l1 = (await sharp(src).greyscale().blur(1.5).extractChannel(0).raw().toBuffer());
const l2 = (await sharp(src).greyscale().blur(6).extractChannel(0).raw().toBuffer());
const tex0 = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) tex0[i] = Math.min(255, Math.abs(l1[i] - l2[i]) * 12);
const tex = await sharp(tex0, { raw: { width: W, height: H, channels: 1 } }).blur(6).extractChannel(0).raw().toBuffer();
const cls = Buffer.alloc(W * H); // 0 land-veg 1 water 2 dense green 3 urban/bare 4 sand
for (let p = 0; p < W * H; p++) {
  const r = c[p * 3], g = c[p * 3 + 1], b = c[p * 3 + 2], s = r + g + b, t = tex[p];
  if (b - r >= 10 && b >= g - 4 && s < 215 && t < 60) cls[p] = 1;
  else if (s > 270 && g >= r - 6 && b < g) cls[p] = 4;
  else if (r >= g - 3 && s > 200) cls[p] = 3;
  else if (g - r >= 19 && s < 185) cls[p] = 2;
  else cls[p] = 0;
}
const pal = [[196, 208, 168], [120, 170, 178], [128, 160, 112], [222, 196, 168], [240, 226, 190]];
const out = Buffer.alloc(W * H * 3);
for (let p = 0; p < W * H; p++) { const q = pal[cls[p]]; out.set(q, p * 3); }
await sharp(out, { raw: { width: W, height: H, channels: 3 } }).jpeg().toFile("classes.jpg");
const texImg = await sharp(tex, { raw: { width: W, height: H, channels: 1 } }).jpeg().toFile("tex.jpg");
import fs from "node:fs"; fs.writeFileSync("cls.bin", cls); fs.writeFileSync("dims.json", JSON.stringify({ W, H }));
console.log("ok");

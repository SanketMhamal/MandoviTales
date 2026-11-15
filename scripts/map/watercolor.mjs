import sharp from "sharp";
import fs from "node:fs";
const src = fs.readFileSync("../../scripts/map/mandovi-map.svg", "utf8");
const d = (fill) => src.match(new RegExp(`<path[^>]*fill="${fill.replace("(", "\(").replace(")", "\)")}"[^>]*/>`))[0].match(/ d="([^"]+)"/)[1];
const urban = d("#ecd3b6"), dense = d("#a3bf96"), sand = d("#f6ebcb"), water = d("#9cc6c8");
const W = 2048, H = 1280;
let rnd = 7; const R = () => ((rnd = (rnd * 16807) % 2147483647) / 2147483647);
const bloomCols = ["#e9b98f", "#b9d3a4", "#a9d0d6", "#f0d79b", "#d9b3a6"];
const blooms = Array.from({ length: 26 }, () => `<circle cx="${(R() * W) | 0}" cy="${(R() * H) | 0}" r="${(60 + R() * 170) | 0}" fill="${bloomCols[(R() * bloomCols.length) | 0]}"/>`).join("");

// A watercolour wash: wobbly edge, soft body, pigment pooled at the rim, granulation inside.
const wash = (id, seed, rough = 14, gran = 0.55) => `
<filter id="${id}" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="${seed}" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="${rough}" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feGaussianBlur in="d" stdDeviation="1.1" result="soft"/>
  <feGaussianBlur in="d" stdDeviation="7" result="inner"/>
  <feComposite in="soft" in2="inner" operator="arithmetic" k1="0" k2="1.35" k3="-0.45" k4="0" result="rim"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="${seed + 3}" result="g"/>
  <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -${gran} ${gran * 0.9}" result="grain"/>
  <feComposite in="grain" in2="rim" operator="in" result="grainIn"/>
  <feBlend in="rim" in2="grainIn" mode="multiply"/>
</filter>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
${wash("wl", 2, 26, 0.2)}${wash("wu", 5, 18, 0.22)}${wash("wd", 9, 14, 0.25)}${wash("ws", 13, 8, 0.12)}${wash("ww", 17, 12, 0.2)}${wash("wd2", 21, 34, 0.2)}${wash("wb", 25, 60, 0.15)}
<filter id="ink" x="-2%" y="-2%" width="104%" height="104%">
  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="paper" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="8" result="f"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="1" result="c"/>
  <feColorMatrix in="f" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.32  0 0 0 -0.12 0.09" result="fine"/>
  <feColorMatrix in="c" type="matrix" values="0 0 0 0 0.6  0 0 0 0 0.52  0 0 0 0 0.4  0 0 0 -0.22 0.13" result="blot"/>
  <feMerge><feMergeNode in="blot"/><feMergeNode in="fine"/></feMerge>
</filter>
<pattern id="ripples" width="90" height="56" patternUnits="userSpaceOnUse">
  <path d="M8 16q8-7 16 0t16 0M52 42q8-7 16 0t16 0" fill="none" stroke="#2c4a4f" stroke-opacity=".28" stroke-width="1.5" stroke-linecap="round"/>
</pattern>
</defs>
<rect width="${W}" height="${H}" fill="#f7f1e3"/>
<g opacity=".5"><rect x="-40" y="-40" width="${W + 80}" height="${H + 80}" fill="#dfe3bd" filter="url(#wl)"/></g>
<g opacity=".35" filter="url(#wb)">${blooms}</g>
<g opacity=".35" filter="url(#wd2)"><path d="${dense}" fill="#a9c08d" transform="translate(6 4)"/></g>
<g opacity=".55" filter="url(#wu)"><path d="${urban}" fill="#efc9a0"/></g>
<g opacity=".6" filter="url(#wd)"><path d="${dense}" fill="#8cb47c"/></g>
<g opacity=".85" filter="url(#ws)"><path d="${sand}" fill="#f7e6b8"/></g>
<g opacity=".8" filter="url(#ww)"><path d="${water}" fill="#9fcfd2" fill-rule="evenodd"/></g>
<g opacity=".22" filter="url(#wd2)"><path d="${water}" fill="#4f98a2" fill-rule="evenodd" transform="translate(-4 3) scale(1)"/></g>
<path d="${water}" fill="url(#ripples)" fill-rule="evenodd"/>
<g filter="url(#ink)"><path d="${water}" fill="none" stroke="#22383c" stroke-width="1.8" stroke-linejoin="round" stroke-opacity=".7"/></g>
<rect width="${W}" height="${H}" filter="url(#paper)" style="mix-blend-mode:multiply"/>
</svg>`;
fs.writeFileSync("watercolor.svg", svg);
const t = Date.now();
await sharp(Buffer.from(svg), { density: 108 }).resize(3072, 1920).webp({ quality: 82 }).toFile("../../public/images/mandovi-watercolour.webp");
await sharp("../../public/images/mandovi-watercolour.webp").resize(640, 400).webp({ quality: 78 }).toFile("../../public/images/mandovi-watercolour-640.webp");
await sharp("../../public/images/mandovi-watercolour.webp").extract({ left: 1100, top: 700, width: 1400, height: 900 }).jpeg().toFile("wc-crop.jpg");
await sharp("../../public/images/mandovi-watercolour.webp").resize(1600).jpeg().toFile("wc-full.jpg");
console.log("ms", Date.now() - t, fs.statSync("../../public/images/mandovi-watercolour.webp").size);

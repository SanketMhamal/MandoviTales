// After `next build` (static export): Next writes some route prefetch files in nested folders,
// e.g. out/cruises/__next.cruises/__PAGE__.txt, but the browser asks for the dotted name,
// out/cruises/__next.cruises.__PAGE__.txt. Copy each one to the name that is requested,
// so static hosts (Cloudflare Pages) serve them instead of a 404. Runs as `postbuild`.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
let copied = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".txt")) flatten(full);
  }
}

function flatten(file) {
  const parts = path.relative(OUT, file).split(path.sep);
  const at = parts.findIndex((p, i) => i < parts.length - 1 && p.startsWith("__next."));
  if (at === -1) return;
  const dotted = path.join(OUT, ...parts.slice(0, at), parts.slice(at).join("."));
  if (!fs.existsSync(dotted)) {
    fs.copyFileSync(file, dotted);
    copied++;
  }
}

if (fs.existsSync(OUT)) {
  walk(OUT);
  console.log(`flatten-prefetch: ${copied} prefetch files copied to their requested names`);
}

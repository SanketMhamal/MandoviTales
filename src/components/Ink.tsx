/**
 * Ink-and-wash illustrations of Goa, drawn for Mandovi Tales: pen lines with a hand wobble over
 * loose watercolour washes that sit slightly off the lines. Original drawings in the spirit of
 * Goan cartoon illustration. Filters live in <InkDefs /> (mounted once in the layout).
 */

type Props = { className?: string };

const INK = "#1f2427";

/** Shared SVG filters: a hand wobble for lines, a bleeding edge for washes. */
export function InkDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="ink-wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ink-wash" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="6" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.9" result="soft" />
          <feGaussianBlur in="d" stdDeviation="5" result="inner" />
          <feComposite in="soft" in2="inner" operator="arithmetic" k1="0" k2="1.3" k3="-0.45" k4="0" />
        </filter>
      </defs>
    </svg>
  );
}

/** Washes (behind) and lines (on top), each with its filter. */
function Art({ viewBox, className, label, wash, lines }: { viewBox: string; className?: string; label: string; wash: React.ReactNode; lines: React.ReactNode }) {
  return (
    <svg className={`ink ${className ?? ""}`} viewBox={viewBox} role="img" aria-label={label}>
      <g className="ink__wash" filter="url(#ink-wash)" opacity=".88">
        {wash}
      </g>
      <g className="ink__lines" filter="url(#ink-wobble)" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {lines}
      </g>
    </svg>
  );
}

/** A caricature head: round, big nose, dot eye. `f` faces right (1) or left (-1). */
function Head({ x, y, f = 1, hat, hair, lady }: { x: number; y: number; f?: 1 | -1; hat?: boolean; hair?: boolean; lady?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="8.5" fill="#f6dcc4" />
      <ellipse cx={x + 7.5 * f} cy={y + 1.5} rx="4.6" ry="3.6" fill="#f2c7a8" />
      <circle cx={x + 2.4 * f} cy={y - 2.5} r="1.1" fill={INK} stroke="none" />
      {!lady && <path d={`M${x + 3 * f} ${y + 5.5} q${3 * f} 2 ${6 * f} 0`} />}
      {hat && <path d={`M${x - 11} ${y - 6} h22 M${x - 7} ${y - 6} q1 -9 7 -9 q6 0 7 9`} fill="#f4e3b8" />}
      {hair && <path d={`M${x - 8} ${y - 2} q-1 -9 8 -9 q8 0 8 6`} />}
      {lady && <path d={`M${x - 8.5} ${y - 1} q-2 -12 9 -10 q9 1 7 9 M${x - 8.5} ${y - 1} q-4 10 -1 16`} fill="#3a2a22" />}
    </g>
  );
}

const Waves = ({ y, x1, x2, step = 22 }: { y: number; x1: number; x2: number; step?: number }) => (
  <path d={`M${x1} ${y} ${Array.from({ length: Math.ceil((x2 - x1) / step) }, () => `q${step / 4} -5 ${step / 2} 0 t${step / 2} 0`).join(" ")}`} />
);

/* ─── Band boat ─────────────────────────────────────────────────────────── */
export function InkBandBoat({ className }: Props) {
  return (
    <Art
      className={className}
      viewBox="0 0 420 250"
      label="Ink drawing of a river cruise boat with a band and dancers on deck"
      wash={
        <>
          <path d="M10 196 C 120 186, 300 206, 410 194 L410 240 L10 240 Z" fill="#9ccfd3" />
          <path d="M34 152 L392 152 L362 198 L62 198 Z" fill="#fbf6ea" />
          <path d="M40 166 L386 166 L380 175 L46 175 Z" fill="#d5714c" />
          <path d="M84 104 L338 104 L338 152 L84 152 Z" fill="#f7efdc" />
          <path d="M76 104 q21 -15 42 0 q21 -15 42 0 q21 -15 42 0 q21 -15 42 0 q21 -15 42 0 q21 -15 42 0 L338 112 L76 112 Z" fill="#e88f6a" />
          <path d="M298 70 h26 l-3 34 h-20 Z" fill="#d5714c" />
          <path d="M128 40 l26 9 -26 9 Z" fill="#f2c14e" />
          <path d="M150 116 q12 18 0 34 q-14 -10 0 -34" fill="#3f8f8a" />
          <path d="M226 116 l14 34 h-28 Z" fill="#e7b04b" />
        </>
      }
      lines={
        <>
          {/* hull and decks */}
          <path d="M30 152 L394 152 L362 198 L62 198 Z" />
          <path d="M40 166 L386 166 M46 175 L380 175" strokeWidth="1.4" />
          {[90, 130, 170, 210, 250, 290, 330].map((x) => (
            <circle key={x} cx={x} cy="186" r="4" />
          ))}
          <path d="M84 152 V106 M338 152 V106" />
          <path d="M76 106 q21 -15 42 0 t42 0 t42 0 t42 0 t42 0 t42 0" />
          <path d="M84 140 H338 M100 140 V152 M120 140 V152 M140 140 V152 M160 140 V152 M180 140 V152 M200 140 V152 M220 140 V152 M240 140 V152 M260 140 V152 M280 140 V152 M300 140 V152 M320 140 V152" strokeWidth="1.3" />
          {/* funnel and smoke */}
          <path d="M298 70 h26 l-3 36 h-20 Z" />
          <path d="M306 62 q-8 -10 2 -16 q10 -6 4 -16 M318 58 q10 -8 2 -16" strokeWidth="1.5" />
          {/* flag */}
          <path d="M128 106 V36 M128 40 l26 9 -26 9" />
          {/* guitarist */}
          <Head x={110} y={118} f={1} hat />
          <path d="M100 140 q10 -14 22 0" />
          <path d="M142 116 q12 18 0 34 q-14 -10 0 -34 M146 124 l20 -16" />
          {/* dancer, arms up */}
          <Head x={192} y={116} f={-1} lady />
          <path d="M182 140 q10 -16 20 0 M184 128 l-12 -20 M200 128 l12 -20" />
          {/* trumpeter */}
          <Head x={262} y={118} f={1} hair />
          <path d="M252 140 q10 -14 22 0 M270 126 h20 l8 -6 v14 l-8 -6" />
          {/* waving man */}
          <Head x={318} y={120} f={-1} hat />
          <path d="M308 140 q10 -12 20 0 M326 130 l10 -18 M332 108 l4 -4 M338 112 l5 -2" />
          {/* water */}
          <Waves y={206} x1={14} x2={406} step={26} />
          <Waves y={222} x1={60} x2={360} step={30} />
          {/* gulls */}
          <path d="M44 60 q6 -7 12 0 q6 -7 12 0 M70 36 q5 -6 10 0 q5 -6 10 0 M366 46 q6 -7 12 0 q6 -7 12 0" strokeWidth="1.6" />
        </>
      }
    />
  );
}

/* ─── Goan house with balcão ────────────────────────────────────────────── */
export function InkGoanHouse({ className }: Props) {
  return (
    <Art
      className={className}
      viewBox="0 0 380 270"
      label="Ink drawing of a Goan house with a porch, an old man reading and a cat on the wall"
      wash={
        <>
          <path d="M70 112 H300 V232 H70 Z" fill="#f2c45f" />
          <path d="M52 114 L185 58 L318 114 Z" fill="#d06a45" />
          <path d="M150 168 H220 V232 H150 Z" fill="#f8f1e2" />
          {[92, 248].map((x) => (
            <path key={x} d={`M${x} 140 h30 v56 h-30 Z`} fill="#7fb6c0" />
          ))}
          <path d="M20 232 C 120 226, 260 238, 370 230 L370 262 L20 262 Z" fill="#c9b48a" />
          <path d="M318 214 h48 v18 h-48 Z" fill="#efe3c8" />
          <path d="M30 236 q8 -40 4 -110" stroke="#8a6a44" strokeWidth="6" fill="none" />
          <path d="M34 128 q-30 -10 -32 10 M34 128 q30 -16 36 6 M34 128 q-10 -30 -28 -26 M34 128 q12 -32 32 -24" stroke="#6f9e5b" strokeWidth="9" fill="none" />
        </>
      }
      lines={
        <>
          {/* roof with tiles */}
          <path d="M48 114 L185 56 L322 114 Z" />
          {[0, 1, 2, 3].map((r) => (
            <path key={r} d={`M${70 + r * 16} ${104 - r * 9} L${300 - r * 16} ${104 - r * 9}`} strokeWidth="1.2" />
          ))}
          <path d="M100 114 l8 -6 M130 114 l8 -6 M160 114 l8 -6 M190 114 l8 -6 M220 114 l8 -6 M250 114 l8 -6 M280 114 l8 -6" strokeWidth="1.1" />
          {/* walls and trim */}
          <path d="M70 114 V232 H300 V114 M70 124 H300 M70 224 H300" />
          {/* arched windows with shell panes */}
          {[92, 248].map((x) => (
            <g key={x}>
              <path d={`M${x} 196 V150 q15 -20 30 0 V196 Z`} />
              <path d={`M${x + 15} 196 V136 M${x} 166 H${x + 30} M${x} 181 H${x + 30}`} strokeWidth="1.2" />
              <path d={`M${x - 4} 198 h38`} />
            </g>
          ))}
          {/* balcão: porch with seats and pillars */}
          <path d="M146 232 V166 H224 V232 M140 166 H230 M146 166 q39 -26 78 0" />
          <path d="M146 210 H168 M202 210 H224 M152 210 V232 M218 210 V232" />
          <path d="M160 232 h50 l6 10 h-62 Z" />
          {/* old man reading on the seat */}
          <Head x={162} y={190} f={1} hat />
          <path d="M154 210 q8 -12 18 0 M168 198 l14 -4 l4 14 l-14 4 Z" />
          <path d="M172 200 l10 -2 M173 204 l10 -2" strokeWidth="1" />
          {/* door */}
          <path d="M180 232 V184 q5 -8 10 0 V232" strokeWidth="1.4" />
          {/* low wall and cat */}
          <path d="M316 232 V214 H368 V232" />
          <path d="M336 214 q-2 -14 8 -16 l2 -6 4 6 q6 0 6 6 l4 -6 2 7 q4 6 -2 9 M356 210 q10 -2 8 -14" />
          <circle cx="347" cy="202" r="0.8" fill={INK} />
          {/* palm */}
          <path d="M30 236 q8 -40 4 -110 M24 232 q10 -40 6 -100" strokeWidth="1.4" />
          <path d="M34 128 q-30 -10 -32 10 M34 128 q30 -16 36 6 M34 128 q-10 -30 -28 -26 M34 128 q12 -32 32 -24 M34 128 q2 -34 -6 -40" />
          <circle cx="30" cy="134" r="4" />
          <circle cx="38" cy="136" r="4" />
          {/* ground */}
          <path d="M14 238 C 120 230, 260 242, 372 234" />
          <path d="M240 250 q4 -8 8 0 M100 252 q4 -6 8 0" strokeWidth="1.2" />
        </>
      }
    />
  );
}

/* ─── Church on its steps ───────────────────────────────────────────────── */
export function InkChurch({ className }: Props) {
  return (
    <Art
      className={className}
      viewBox="0 0 300 300"
      label="Ink drawing of a white church with twin towers above a zig-zag staircase"
      wash={
        <>
          <path d="M20 60 C 80 40, 220 40, 280 70 L280 180 L20 180 Z" fill="#bfdde2" />
          <path d="M80 92 H220 V196 H80 Z" fill="#fbf7ee" />
          <path d="M70 196 H230 L262 270 H38 Z" fill="#f1e2c4" />
          <path d="M138 140 h24 v56 h-24 Z" fill="#7fb6c0" />
          <path d="M146 26 h8 v12 h-8 Z" fill="#e7b04b" />
        </>
      }
      lines={
        <>
          {/* towers */}
          <path d="M80 196 V92 H112 V196 M188 196 V92 H220 V196" />
          <path d="M80 92 q16 -22 32 0 M188 92 q16 -22 32 0 M96 70 V58 M91 63 h10 M204 70 V58 M199 63 h10" />
          <path d="M88 116 h16 v18 h-16 Z M196 116 h16 v18 h-16 Z M88 150 h16 v18 h-16 Z M196 150 h16 v18 h-16 Z" strokeWidth="1.3" />
          {/* central gable and bell */}
          <path d="M112 196 V100 L150 54 L188 100 V196" />
          <path d="M150 26 V20 M146 23 h8 M142 42 h16 M144 42 q6 -16 12 0" />
          <circle cx="150" cy="84" r="9" />
          <path d="M146 84 q4 -6 8 0" strokeWidth="1.2" />
          <path d="M136 196 V146 q14 -18 28 0 V196" />
          <path d="M80 108 H220 M80 180 H220" strokeWidth="1.2" />
          {/* zig-zag stairs */}
          <path d="M70 196 H230 M76 208 H224 M60 222 H120 M180 222 H240 M52 236 H128 M172 236 H248 M44 250 H136 M164 250 H256 M38 266 H262" />
          <path d="M120 222 L136 250 M180 222 L164 250" strokeWidth="1.3" />
          {/* little figures on the steps */}
          <Head x={60} y={212} f={1} lady />
          <path d="M52 230 q8 -12 16 0" />
          <Head x={238} y={226} f={-1} hat />
          <path d="M230 244 q8 -12 16 0" />
          {/* palms */}
          <path d="M22 266 q6 -40 0 -80 M22 186 q-16 -6 -20 6 M22 186 q16 -10 22 2 M22 186 q-4 -18 -16 -16 M22 186 q8 -16 20 -12" />
          <path d="M280 266 q-6 -36 2 -70 M282 196 q-16 -6 -20 6 M282 196 q16 -10 18 2 M282 196 q-4 -18 -14 -16" />
          {/* gulls */}
          <path d="M40 40 q5 -6 10 0 q5 -6 10 0 M232 30 q6 -7 12 0 q6 -7 12 0" strokeWidth="1.5" />
        </>
      }
    />
  );
}

/* ─── Fisherman in a canoe ──────────────────────────────────────────────── */
export function InkFisherman({ className }: Props) {
  return (
    <Art
      className={className}
      viewBox="0 0 320 170"
      label="Ink drawing of a fisherman paddling a canoe with a crow on the bow"
      wash={
        <>
          <path d="M6 118 C 90 108, 230 128, 314 114 L314 166 L6 166 Z" fill="#9ccfd3" />
          <path d="M40 110 Q160 150 280 104 L270 120 Q160 160 52 124 Z" fill="#7a4e32" />
          <path d="M140 74 q16 -10 30 0 l4 34 h-38 Z" fill="#e0805b" />
          <path d="M260 88 q8 -8 16 -2 l8 2 -8 4 q-6 8 -16 2 Z" fill="#2b2b2b" />
        </>
      }
      lines={
        <>
          <path d="M36 108 Q160 152 284 102 M48 122 Q160 162 272 118 M36 108 L48 122 M284 102 L272 118" />
          {/* fisherman */}
          <Head x={160} y={64} f={1} hat />
          <path d="M140 108 q-2 -30 20 -34 q22 4 18 34" />
          <path d="M150 86 l40 -10 M190 76 l30 -54 M214 30 l14 6" />
          <path d="M120 140 L208 18" strokeWidth="2.4" />
          <path d="M112 152 q6 -14 16 -10 q-2 12 -16 10" />
          {/* crow on the bow */}
          <path d="M258 92 q8 -10 18 -4 l8 2 -8 4 q-6 8 -18 0 Z M262 94 l-10 4 M266 98 v6 M272 98 v6" />
          <circle cx="273" cy="88" r="0.9" fill={INK} />
          {/* nets */}
          <path d="M70 116 l20 6 M78 112 l12 12 M86 110 l2 14" strokeWidth="1.1" />
          <Waves y={138} x1={8} x2={312} step={24} />
          <Waves y={156} x1={40} x2={290} step={28} />
        </>
      }
    />
  );
}

/* ─── Small doodles ─────────────────────────────────────────────────────── */
export function InkPalm({ className }: Props) {
  return (
    <Art
      className={className}
      viewBox="0 0 160 260"
      label="Ink drawing of a coconut palm"
      wash={
        <>
          <path d="M70 252 q12 -90 4 -170" stroke="#9a7650" strokeWidth="10" fill="none" />
          <path d="M76 82 q-50 -14 -64 22 M76 82 q56 -20 70 18 M76 82 q-20 -48 -58 -44 M76 82 q22 -52 62 -40 M76 82 q4 -56 -14 -70" stroke="#79a865" strokeWidth="14" fill="none" />
        </>
      }
      lines={
        <>
          <path d="M66 252 q12 -90 4 -170 M78 252 q12 -90 2 -170" />
          {[110, 140, 170, 200, 230].map((y) => (
            <path key={y} d={`M${68 + (252 - y) / 30} ${y} q6 4 12 0`} strokeWidth="1.2" />
          ))}
          <path d="M76 82 q-50 -14 -64 22 M76 82 q56 -20 70 18 M76 82 q-20 -48 -58 -44 M76 82 q22 -52 62 -40 M76 82 q4 -56 -14 -70" />
          <path d="M40 80 l-4 10 M28 88 l-4 10 M106 78 l4 10 M120 84 l4 10 M50 52 l-8 6 M100 50 l8 6" strokeWidth="1.1" />
          <circle cx="70" cy="90" r="6" />
          <circle cx="82" cy="92" r="6" />
          <path d="M20 254 q60 -10 120 0" />
        </>
      }
    />
  );
}

export function InkFish({ className }: Props) {
  return (
    <Art
      className={className}
      viewBox="0 0 120 60"
      label="Ink doodle of a fish"
      wash={<path d="M14 30 q30 -26 70 0 q-40 26 -70 0 Z M84 30 l22 -14 v28 Z" fill="#7fb6c0" />}
      lines={
        <>
          <path d="M12 30 q32 -26 72 0 q-40 26 -72 0 Z M84 30 l22 -14 v28 Z" />
          <circle cx="28" cy="27" r="2" />
          <path d="M44 22 q4 8 0 16 M54 22 q4 8 0 16" strokeWidth="1.1" />
        </>
      }
    />
  );
}

export function InkCrab({ className }: Props) {
  return (
    <Art
      className={className}
      viewBox="0 0 140 90"
      label="Ink doodle of a crab"
      wash={<path d="M36 52 q34 -30 68 0 q-34 20 -68 0 Z M24 30 q-10 -12 4 -18 q10 4 2 16 Z M116 30 q10 -12 -4 -18 q-10 4 -2 16 Z" fill="#e0805b" />}
      lines={
        <>
          <path d="M34 52 q36 -32 72 0 q-36 22 -72 0 Z" />
          <path d="M52 36 v-10 M88 36 v-10" />
          <circle cx="52" cy="24" r="2.4" />
          <circle cx="88" cy="24" r="2.4" />
          <path d="M40 46 q-14 -6 -14 -18 M100 46 q14 -6 14 -18 M24 30 q-10 -12 4 -18 q10 4 2 16 M116 30 q10 -12 -4 -18 q-10 4 -2 16" />
          <path d="M40 58 l-14 10 M46 62 l-10 14 M100 58 l14 10 M94 62 l10 14" />
        </>
      }
    />
  );
}

export function InkSun({ className }: Props) {
  return (
    <Art
      className={className}
      viewBox="0 0 140 140"
      label="Ink drawing of the sun"
      wash={<circle cx="70" cy="70" r="34" fill="#f4c25a" />}
      lines={
        <>
          <circle cx="70" cy="70" r="30" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r1 = 40;
            const r2 = i % 2 ? 54 : 62;
            // rounded so the server and the browser print the same numbers
            const p = (v: number) => v.toFixed(2);
            return <path key={i} d={`M${p(70 + Math.cos(a) * r1)} ${p(70 + Math.sin(a) * r1)} L${p(70 + Math.cos(a) * r2)} ${p(70 + Math.sin(a) * r2)}`} />;
          })}
          <path d="M58 64 q4 -4 8 0 M74 64 q4 -4 8 0 M60 80 q10 8 20 0" strokeWidth="1.5" />
        </>
      }
    />
  );
}

export function InkGulls({ className }: Props) {
  return (
    <Art
      className={className}
      viewBox="0 0 160 70"
      label="Ink doodle of gulls"
      wash={null}
      lines={<path d="M10 40 q10 -12 20 0 q10 -12 20 0 M70 20 q8 -10 16 0 q8 -10 16 0 M110 50 q7 -9 14 0 q7 -9 14 0" />}
    />
  );
}

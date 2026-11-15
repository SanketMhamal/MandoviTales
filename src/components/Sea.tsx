/** Shared sea pieces: the boat silhouette and layered, looping waves. */

export function Boat({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 64" width="120" height="64" aria-hidden="true" focusable="false">
      {/* flag */}
      <path d="M62 4v14" stroke="currentColor" strokeWidth="1.6" />
      <path className="boat__flag" d="M62 4l12 4-12 4z" fill="var(--accent, #a84b23)" />
      {/* funnel */}
      <path d="M68 18h9l-1.5 10H69.5z" fill="var(--accent, #a84b23)" />
      {/* upper deck */}
      <path d="M38 28h50v9H38z" fill="currentColor" />
      <g fill="var(--boat-window, #f5efe4)">
        <rect x="43" y="31" width="5" height="3" rx="1" />
        <rect x="52" y="31" width="5" height="3" rx="1" />
        <rect x="61" y="31" width="5" height="3" rx="1" />
        <rect x="70" y="31" width="5" height="3" rx="1" />
        <rect x="79" y="31" width="5" height="3" rx="1" />
      </g>
      {/* lower deck */}
      <path d="M24 37h76v9H24z" fill="currentColor" opacity=".85" />
      <g fill="var(--boat-window, #f5efe4)">
        <rect x="30" y="40" width="6" height="3" rx="1" />
        <rect x="40" y="40" width="6" height="3" rx="1" />
        <rect x="50" y="40" width="6" height="3" rx="1" />
        <rect x="60" y="40" width="6" height="3" rx="1" />
        <rect x="70" y="40" width="6" height="3" rx="1" />
        <rect x="80" y="40" width="6" height="3" rx="1" />
        <rect x="90" y="40" width="6" height="3" rx="1" />
      </g>
      {/* hull */}
      <path d="M8 46h108l-10 14H20z" fill="currentColor" />
      <path d="M14 50h98" stroke="var(--accent, #a84b23)" strokeWidth="2" />
    </svg>
  );
}

const WAVE = "M0 20 Q 50 0 100 20 T 200 20 T 300 20 T 400 20 T 500 20 T 600 20 T 700 20 T 800 20 V 40 H 0 Z";

/** Three wave bands drifting at different speeds. The SVG is twice the width and slides by half. */
export function Waves({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <div className={`waves ${className ?? ""}`} data-flip={flip || undefined} aria-hidden="true">
      {[1, 2, 3].map((layer) => (
        <svg key={layer} className={`waves__layer waves__layer--${layer}`} viewBox="0 0 800 40" preserveAspectRatio="none">
          <path d={WAVE} />
        </svg>
      ))}
    </div>
  );
}

"use client";

import { useId, useMemo, useState } from "react";
import { site } from "@/content";
import { formatPrice, packageMessage, whatsappLink } from "@/lib/format";
import { WhatsAppIcon } from "./icons";

function todayIso() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function readableDate(iso: string) {
  if (!iso) return "a date to be confirmed";
  return new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${iso}T12:00:00`));
}

function Stepper({ id, name, label, value, min, max, onChange }: { id: string; name: string; label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="stepper">
        <button type="button" aria-label={`Fewer ${label.toLowerCase()}`} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          name={name}
          autoComplete="off"
          value={draft ?? value}
          onChange={(e) => {
            setDraft(e.target.value);
            const n = parseInt(e.target.value, 10);
            if (!Number.isNaN(n)) onChange(clamp(n));
          }}
          onBlur={() => setDraft(null)}
        />
        <button type="button" aria-label={`More ${label.toLowerCase()}`} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>
          +
        </button>
      </div>
    </div>
  );
}

export function Enquiry({ defaultSlug }: { defaultSlug?: string }) {
  const e = site.enquiry;
  const uid = useId();
  const [slug, setSlug] = useState(defaultSlug ?? site.packages[0].slug);
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const pkg = site.packages.find((p) => p.slug === slug) ?? site.packages[0];
  const total = pkg.price !== null ? pkg.price * adults + Math.round(pkg.price / 2) * children : null;

  const guests = [
    `${adults} ${adults === 1 ? "adult" : "adults"}`,
    children > 0 ? `${children} ${children === 1 ? "child" : "children"}` : null,
  ]
    .filter(Boolean)
    .join(" and ");

  const href = useMemo(
    () => whatsappLink(packageMessage(pkg.name, readableDate(date), guests)),
    [pkg.name, date, guests],
  );

  return (
    <form
      className="enquiry"
      onSubmit={(ev) => {
        ev.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      <div className="enquiry__fields">
        <div className="field field--wide">
          <label htmlFor={`${uid}-pkg`}>{e.packageLabel}</label>
          <select id={`${uid}-pkg`} name="cruise" autoComplete="off" value={slug} onChange={(ev) => setSlug(ev.target.value)}>
            {site.packages.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name} · {p.departs}
              </option>
            ))}
          </select>
        </div>
        <div className="field field--wide">
          <label htmlFor={`${uid}-date`}>{e.dateLabel}</label>
          <input id={`${uid}-date`} name="date" type="date" onFocus={(ev) => (ev.currentTarget.min = todayIso())} value={date} onChange={(ev) => setDate(ev.target.value)} autoComplete="off" />
        </div>
        <Stepper id={`${uid}-adults`} name="adults" label={e.adultsLabel} value={adults} min={1} max={120} onChange={setAdults} />
        <Stepper id={`${uid}-children`} name="children" label={e.childrenLabel} value={children} min={0} max={60} onChange={setChildren} />
      </div>

      <div className="enquiry__summary">
        <p className="enquiry__label">{e.estimateLabel}</p>
        <p className="enquiry__total" aria-live="polite">
          {total !== null ? formatPrice(total) : pkg.priceNote}
        </p>
        <p className="enquiry__note">{e.estimateNote}</p>
        <button type="submit" className="btn btn--primary btn--block">
          <WhatsAppIcon />
          {e.submit}
        </button>
      </div>
    </form>
  );
}

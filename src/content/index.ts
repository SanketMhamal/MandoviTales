import { site as raw } from "./site";

export type { CruisePackage, Photo, PackageCategory } from "./site";

/**
 * Small typographic clean-ups applied to every string in the content file,
 * so editors can type plainly:
 *  - keeps numbers with their units on one line: 6:00 pm, 2 hours, 30 guests, ₹25,000
 *  - straight apostrophes inside words become ’
 *  - three dots become an ellipsis
 */
function typeset(text: string): string {
  if (/^https?:\/\//.test(text)) return text;
  return text
    .replace(/(\d) (am|pm|hours?|minutes?|guests?|km|adults?|children)\b/g, "$1 $2")
    .replace(/₹ (\d)/g, "₹$1")
    .replace(/(\w)'(\w)/g, "$1’$2")
    .replace(/\.\.\./g, "…");
}

function deepTypeset<T>(value: T): T {
  if (typeof value === "string") return typeset(value) as T;
  if (Array.isArray(value)) return value.map(deepTypeset) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deepTypeset(v)])) as T;
  }
  return value;
}

export const site = deepTypeset(raw);

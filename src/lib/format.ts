import { site } from "@/content";

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** 1800 → "₹1,800" (Indian digit grouping: 25000 → "₹25,000", 150000 → "₹1,50,000"). */
export function formatPrice(amount: number) {
  return rupees.format(amount);
}

/** Opens a WhatsApp chat with the business, message pre-filled. */
export function whatsappLink(message: string = site.booking.generalMessage) {
  return `https://wa.me/${site.booking.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function packageMessage(name: string, date: string, guests: string) {
  return site.booking.packageMessage
    .replace("{package}", name)
    .replace("{date}", date)
    .replace("{guests}", guests);
}

export function getPackage(slug: string) {
  return site.packages.find((p) => p.slug === slug);
}

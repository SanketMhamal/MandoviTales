/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MANDOVI TALES — SITE CONTENT
 *  Edit this one file to change any text, price, photo or contact on the site.
 *  Save it and every page updates. No need to touch the components.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Typing tips (they keep the typography clean):
 *    • Use real apostrophes and quotes:  ’  “ ”     (not ' and ")
 *    • Ranges use an en dash:            9:30 am – 4:00 pm
 *    • Prices are plain numbers:         price: 600   (the site adds ₹ and commas)
 *
 *  Photos:
 *    • `image: "stand-in/f96460762"` is a temporary stock photo in /public/images.
 *    • Replace it with the Cloudinary public ID of the client’s photo, e.g.
 *      `image: "mandovi-tales/sunset-deck"`. See CLOUDINARY.md.
 */

export type Photo = {
  /** Cloudinary public ID, or a "stand-in/…" key while the real photo is pending. */
  image: string;
  /** Describe what’s in the photo for screen readers and search engines. */
  alt: string;
};

export type PackageCategory = "evening" | "day" | "private";

export type CruisePackage = {
  /** Used in the web address: /packages/sunset-cruise */
  slug: string;
  name: string;
  category: PackageCategory;
  /** One line shown on the card. */
  summary: string;
  /** A short paragraph for the package page. */
  description: string;
  duration: string;
  departs: string;
  /** When guests should be at the jetty. */
  boarding: string;
  /** Which days it runs. */
  days: string;
  /** Price per adult in rupees. Use null for “on request”. */
  price: number | null;
  priceNote: string;
  /** Optional small label on the card, e.g. "Most booked". */
  badge?: string;
  includes: string[];
  itinerary: { time: string; title: string; detail: string }[];
  goodToKnow: string[];
  cover: Photo;
  gallery: Photo[];
};

export const site = {
  /* ── Brand ─────────────────────────────────────────────────────────────── */
  brand: {
    name: "Mandovi Tales",
    tagline: "River cruises from Panjim, Goa",
    /** Used for search engines and link previews. */
    description:
      "Sunset, dinner, dolphin and backwater cruises on the Mandovi river, departing daily from Panjim jetty. See every package and book on WhatsApp.",
    /** Full site address once it is live, e.g. https://mandovitales.com */
    url: "https://mandovitales.com",
  },

  /* ── Booking (WhatsApp) ────────────────────────────────────────────────── */
  booking: {
    /**
     * WhatsApp number in international format: country code + number,
     * digits only. No +, spaces or dashes.  India example: 919876543210
     * TODO: replace with the client’s real WhatsApp Business number.
     */
    whatsappNumber: "910000000000",
    /** Label on the main booking buttons. */
    cta: "Book on WhatsApp",
    /** Pre-filled message for general enquiries. */
    generalMessage: "Hi Mandovi Tales, I’d like to know more about your cruises.",
    /**
     * Pre-filled message when someone books a package.
     * {package}, {date} and {guests} are filled in automatically.
     */
    packageMessage:
      "Hi Mandovi Tales, I’d like to book the {package} on {date} for {guests}. Is it available?",
    /** Shown next to the booking buttons. */
    reassurance: "Replies within the hour, 9 am – 9 pm. Pay at the jetty or by UPI.",
  },

  /* ── Navigation ────────────────────────────────────────────────────────── */
  nav: [
    { label: "Cruises", href: "/#cruises" },
    { label: "On board", href: "/#on-board" },
    { label: "The route", href: "/#route" },
    { label: "Visit", href: "/#visit" },
    { label: "FAQ", href: "/#faq" },
  ],

  /* ── Hero (top of the home page) ───────────────────────────────────────── */
  hero: {
    eyebrow: "Panjim · Goa",
    title: "River cruises on the Mandovi, from sunset to supper.",
    lede:
      "Five ways to see Goa from the water, every day of the season. Pick a cruise, send us a WhatsApp, and we’ll keep a seat on deck for you.",
    fact: "Daily from Panjim jetty · from ₹600",
    primaryCta: "See the cruises",
    photo: {
      image: "stand-in/f96460762",
      alt: "The sun setting over the Mandovi river, with a boat crossing the light",
    } satisfies Photo,
    scrollCue: "Scroll",
  },

  /* ── Statement (big words that light up as you scroll) ─────────────────── */
  statement: {
    /** Wrap the word(s) to colour in the accent with *asterisks*. */
    text: "Twenty minutes downriver the Mandovi meets the sea, the band strikes up, and the sky over Reis Magos turns *pink*.",
  },

  /* ── Moving strip of places and moments ────────────────────────────────── */
  marquee: [
    "Sunset at Reis Magos",
    "Dolphins off Aguada",
    "Fish curry rice",
    "Dekhni on deck",
    "Mangroves of Chorao",
    "Panjim by night",
  ],

  /* ── An evening on the river (photo story, one chapter at a time) ──────── */
  chapters: {
    title: "An evening on the Sunset Cruise",
    items: [
      {
        time: "5:30 pm",
        title: "Boarding at Panjim jetty",
        text: "Find a seat by the rail with a welcome drink while the river turns gold.",
        photo: { image: "stand-in/f64185538", alt: "A boat crossing the wide Mandovi river at Panjim" },
      },
      {
        time: "6:00 pm",
        title: "Downriver to the sea",
        text: "Past the old secretariat and the Betim ferries, with the hills of Porvorim to the north.",
        photo: { image: "stand-in/f150084598", alt: "The wide Mandovi river seen from the Porvorim hills" },
      },
      {
        time: "6:20 pm",
        title: "Sunset at the river mouth",
        text: "The engine slows off Reis Magos, the band plays, and the troupe takes the deck.",
        photo: { image: "stand-in/f105192704", alt: "Pink and orange sky over Goa at sunset, palms in silhouette" },
      },
      {
        time: "7:00 pm",
        title: "Panjim by night",
        text: "Back upriver as the city lights come on along the water.",
        photo: { image: "stand-in/f126506020", alt: "Lit boats reflected on the dark Mandovi river at night" },
      },
    ],
  },

  /* ── Cruises section ───────────────────────────────────────────────────── */
  cruisesSection: {
    title: "Cruises and prices",
    intro:
      "Every cruise leaves from the same jetty in Panjim. Prices are per adult and include taxes; children aged 5 to 12 pay half.",
    filters: [
      { id: "all", label: "All cruises" },
      { id: "evening", label: "Sunset & evening" },
      { id: "day", label: "Daytime" },
      { id: "private", label: "Private" },
    ],
    cardCta: "View cruise",
  },

  /* ── The packages ──────────────────────────────────────────────────────── */
  packages: [
    {
      slug: "sunset-cruise",
      name: "Sunset Cruise",
      category: "evening",
      summary: "An hour on the open deck as the sun drops behind Reis Magos.",
      description:
        "Our most-booked cruise. We push off as the light turns gold, run downriver past the Reis Magos fort towards the sea, and turn for home as the sky goes pink. A live band plays Konkani songs and our troupe dances the dekhni and fugdi on deck.",
      duration: "1 hour",
      departs: "6:00 pm",
      boarding: "5:30 pm",
      days: "Every day",
      price: 600,
      priceNote: "per adult",
      badge: "Most booked",
      includes: [
        "Open upper deck and covered lower deck",
        "Live Konkani music and folk dance",
        "Welcome drink",
        "Life jackets for every guest",
      ],
      itinerary: [
        { time: "5:30 pm", title: "Boarding at Panjim jetty", detail: "Find your seat and a welcome drink." },
        { time: "6:00 pm", title: "Cast off", detail: "Downriver past the Panjim waterfront and the old secretariat." },
        { time: "6:20 pm", title: "Reis Magos and the river mouth", detail: "The sun sets over the Arabian Sea while the band plays." },
        { time: "7:00 pm", title: "Back at the jetty", detail: "Stay on deck for the city lights as we dock." },
      ],
      goodToKnow: [
        "The upper deck fills first. Board by 5:30 pm for a seat by the rail.",
        "Cruises run in light rain. In heavy weather we reschedule or refund in full.",
      ],
      cover: { image: "stand-in/f105192704", alt: "Pink and orange sky over Goa at sunset, palms in silhouette" },
      gallery: [
        { image: "stand-in/f150084598", alt: "The wide Mandovi river seen from the Porvorim hills" },
        { image: "stand-in/f107825770", alt: "Dancers in bright Goan dress performing a folk dance" },
      ],
    },
    {
      slug: "dinner-cruise",
      name: "Dinner Cruise",
      category: "evening",
      summary: "Two hours on the night river with a Goan buffet and live band.",
      description:
        "The river after dark, with Panjim lit up on one bank and Betim on the other. Dinner is a Goan buffet: fish curry rice, prawn balchão, chicken xacuti, a vegetarian table and bebinca to finish. The band takes requests once dessert is out.",
      duration: "2 hours",
      departs: "8:00 pm",
      boarding: "7:30 pm",
      days: "Every day",
      price: 1800,
      priceNote: "per adult",
      includes: [
        "Goan buffet dinner with vegetarian options",
        "Welcome drink and soft drinks",
        "Live band and a folk-dance show",
        "Bar on board (drinks charged separately)",
      ],
      itinerary: [
        { time: "7:30 pm", title: "Boarding", detail: "Welcome drink on the upper deck." },
        { time: "8:00 pm", title: "Cast off", detail: "Slow run along the lit waterfront." },
        { time: "8:30 pm", title: "Dinner is served", detail: "Goan buffet on the lower deck; the dance troupe performs." },
        { time: "9:30 pm", title: "Music on deck", detail: "The band plays requests on the way home." },
        { time: "10:00 pm", title: "Back at the jetty", detail: "" },
      ],
      goodToKnow: [
        "Tell us about allergies or a Jain menu when you book.",
        "Smart-casual. Flat shoes are easier on deck.",
      ],
      cover: { image: "stand-in/f126506020", alt: "Lit boats reflected on the dark Mandovi river at night" },
      gallery: [
        { image: "stand-in/f81578993", alt: "A Goan fish curry thali with rice, mackerel and sides" },
        { image: "stand-in/f99912532", alt: "A bowl of Goan prawn curry" },
      ],
    },
    {
      slug: "dolphin-cruise",
      name: "Dolphin Cruise",
      category: "day",
      summary: "A morning run to the river mouth to look for humpback dolphins.",
      description:
        "Indo-Pacific humpback dolphins feed where the Mandovi meets the sea, and early morning is the best time to see them. We head out past Miramar to the Aguada headland, cut the engine and wait. Most mornings they come close.",
      duration: "2 hours",
      departs: "8:30 am",
      boarding: "8:15 am",
      days: "Every day, October to May",
      price: 900,
      priceNote: "per adult",
      includes: [
        "Covered boat with a naturalist guide",
        "Views of Fort Aguada and its lighthouse",
        "Tea, coffee and biscuits",
        "Life jackets for every guest",
      ],
      itinerary: [
        { time: "8:15 am", title: "Boarding", detail: "Tea and a short safety talk." },
        { time: "8:30 am", title: "Downriver to the sea", detail: "Past Miramar beach and Reis Magos." },
        { time: "9:00 am", title: "Dolphin watch", detail: "Engine off near Aguada; the guide points out what we see." },
        { time: "10:30 am", title: "Back at the jetty", detail: "" },
      ],
      goodToKnow: [
        "Dolphins are wild. If none show, your next morning cruise is free.",
        "Bring a cap and sunscreen; the boat is shaded but the sea is bright.",
      ],
      cover: { image: "stand-in/f53428483", alt: "The green Aguada headland seen from the sea" },
      gallery: [
        { image: "stand-in/f88710219", alt: "The old lighthouse on Fort Aguada" },
        { image: "stand-in/f95250912", alt: "A river mouth meeting the sea on the Goan coast" },
      ],
    },
    {
      slug: "backwater-cruise",
      name: "Backwater Day Cruise",
      category: "day",
      summary: "A full day upriver through mangroves, islands and a spice farm.",
      description:
        "Upriver the Mandovi narrows into mangrove creeks. We stop at Chorao island for the Salim Ali bird sanctuary, lunch at a spice farm, and drift back through the village ferries of Divar in the afternoon.",
      duration: "6½ hours",
      departs: "9:30 am",
      boarding: "9:15 am",
      days: "Tuesday, Thursday and Saturday",
      price: 2400,
      priceNote: "per adult",
      includes: [
        "Guided walk at the Salim Ali bird sanctuary",
        "Goan lunch at a spice farm",
        "Fresh fruit, tea and water all day",
        "Naturalist guide on board",
      ],
      itinerary: [
        { time: "9:15 am", title: "Boarding", detail: "Breakfast snacks on board." },
        { time: "10:00 am", title: "Mangrove creeks of Chorao", detail: "Herons, kingfishers and, with luck, a crocodile." },
        { time: "11:00 am", title: "Salim Ali bird sanctuary", detail: "An hour’s walk on the boardwalk with the guide." },
        { time: "1:00 pm", title: "Spice farm lunch", detail: "Tour of the farm and a Goan thali." },
        { time: "3:00 pm", title: "Divar island", detail: "Past the village ferries and old chapels." },
        { time: "4:00 pm", title: "Back at the jetty", detail: "" },
      ],
      goodToKnow: [
        "Closed-toe shoes for the boardwalk.",
        "Binoculars are on board to borrow.",
      ],
      cover: { image: "stand-in/f31036758", alt: "Still backwater with mangroves at the water’s edge" },
      gallery: [
        { image: "stand-in/f96460765", alt: "A fisherman paddling a canoe on the Mandovi" },
        { image: "stand-in/f57513652", alt: "A wide green stretch of a Goan river" },
      ],
    },
    {
      slug: "private-charter",
      name: "Private Charter",
      category: "private",
      summary: "The whole boat for birthdays, proposals, office outings and weddings.",
      description:
        "Take one of our boats for yourselves, for two hours or the whole evening. We plan the route, the food and the music with you, decorate the deck, and can arrange a photographer.",
      duration: "2 hours or more",
      departs: "Any time you choose",
      boarding: "30 minutes before",
      days: "Every day, on request",
      price: null,
      priceNote: "from ₹25,000 for up to 30 guests",
      includes: [
        "The whole boat and crew",
        "A menu planned with you",
        "Decoration and a sound system",
        "Photographer on request",
      ],
      itinerary: [
        { time: "You choose", title: "Plan it with us", detail: "Tell us the occasion, the numbers and the time on WhatsApp." },
        { time: "On the day", title: "Board at Panjim jetty", detail: "The boat is dressed and ready 30 minutes before." },
        { time: "On the river", title: "Your route, your music", detail: "Sunset, the night lights, or upriver to the islands." },
      ],
      goodToKnow: [
        "Book at least a week ahead for weekends in December.",
        "Boats seat 30, 60 or 120 guests.",
      ],
      cover: { image: "stand-in/f64185538", alt: "A boat crossing the wide Mandovi river at Panjim" },
      gallery: [
        { image: "stand-in/f49814193", alt: "A small boat on a quiet river lined with trees" },
        { image: "stand-in/f150084598", alt: "The wide Mandovi river seen from the Porvorim hills" },
      ],
    },
  ] satisfies CruisePackage[] as CruisePackage[],

  /* ── On board section ──────────────────────────────────────────────────── */
  onBoard: {
    title: "On board",
    intro: "Every evening cruise carries a live band and our own folk troupe. The kitchen is Goan.",
    items: [
      {
        title: "Music and dance",
        text: "Konkani songs and the dekhni, fugdi and corridinho, danced on deck by our troupe of eight.",
        photo: { image: "stand-in/f107825770", alt: "Dancers in bright Goan dress performing a folk dance" },
      },
      {
        title: "Goan food",
        text: "Fish curry rice, prawn balchão and bebinca, cooked the morning of your cruise.",
        photo: { image: "stand-in/f81578993", alt: "A Goan fish curry thali with rice, mackerel and sides" },
      },
      {
        title: "Two decks",
        text: "An open upper deck for the view and a covered lower deck for the shade or the rain.",
        photo: { image: "stand-in/f64185538", alt: "A boat crossing the wide Mandovi river at Panjim" },
      },
    ],
  },

  /* ── The route section ─────────────────────────────────────────────────── */
  route: {
    title: "What you’ll see on the river",
    intro: "Panjim to the sea is twenty minutes downriver; the islands are an hour up.",
    stops: [
      {
        name: "Panjim waterfront",
        text: "The old Portuguese quarter, the secretariat and the church steps.",
        photo: { image: "stand-in/f110120425", alt: "The white church of Our Lady of the Immaculate Conception, Panjim" },
      },
      {
        name: "Reis Magos",
        text: "The red-walled fort on the Betim bank, built in 1551.",
        photo: { image: "stand-in/f150084598", alt: "The wide Mandovi river seen from the Porvorim hills" },
      },
      {
        name: "Fort Aguada",
        text: "The lighthouse at the river mouth, where the dolphins feed.",
        photo: { image: "stand-in/f88710219", alt: "The old lighthouse on Fort Aguada" },
      },
      {
        name: "Chorao and Divar",
        text: "Mangrove islands upriver, home to the Salim Ali bird sanctuary.",
        photo: { image: "stand-in/f96460765", alt: "A fisherman paddling a canoe on the Mandovi" },
      },
    ],
  },

  /* ── Enquiry composer (builds a WhatsApp message) ──────────────────────── */
  enquiry: {
    title: "Plan your cruise",
    intro: "Choose a cruise, a date and how many of you are coming. We’ll open WhatsApp with the message written.",
    packageLabel: "Cruise",
    dateLabel: "Date",
    adultsLabel: "Adults",
    childrenLabel: "Children (5–12)",
    submit: "Send on WhatsApp",
    estimateLabel: "Estimated total",
    estimateNote: "Pay at the jetty or by UPI. We confirm every booking on WhatsApp.",
  },

  /* ── Visit section ─────────────────────────────────────────────────────── */
  visit: {
    title: "Getting to the jetty",
    place: "Panjim jetty",
    address: "D. B. Marg, Panjim, Goa",
    /** Google Maps link for the “Get directions” button. */
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Santa+Monica+Jetty+Panaji+Goa",
    mapsCta: "Get directions",
    details: [
      { label: "Season", value: "October to May; sunset and dinner cruises run all year" },
      { label: "Parking", value: "Paid parking beside the jetty" },
      { label: "From Calangute", value: "About 30 minutes by taxi" },
      { label: "Accessibility", value: "Lower deck has step-free boarding; tell us when you book" },
    ],
    photo: { image: "stand-in/f57513652", alt: "A wide green stretch of a Goan river" },
  },

  /* ── FAQ ───────────────────────────────────────────────────────────────── */
  faq: {
    title: "Questions, answered",
    items: [
      {
        q: "How do I book?",
        a: "Tap any “Book on WhatsApp” button. Your message is written for you; send it and we’ll confirm your seats, usually within the hour.",
      },
      {
        q: "How do I pay?",
        a: "Pay at the jetty in cash or by card, or by UPI when we confirm. For private charters we take a 30% advance.",
      },
      {
        q: "Can I cancel?",
        a: "Free cancellation up to 24 hours before departure. After that we can move you to another day.",
      },
      {
        q: "What happens if it rains?",
        a: "We sail in light rain; the lower deck is covered. If the port closes the river, we refund in full or rebook you.",
      },
      {
        q: "Are children welcome?",
        a: "Yes. Under-fives sail free, ages 5 to 12 pay half, and we carry child-size life jackets.",
      },
      {
        q: "Is there a bar on board?",
        a: "On the dinner cruise and private charters, yes. Drinks are paid for separately.",
      },
    ],
  },

  /* ── Closing band ──────────────────────────────────────────────────────── */
  closing: {
    title: "Tonight’s sunset leaves at 6:00 pm.",
    text: "Send us a message and we’ll hold your seats.",
  },

  /* ── Footer ────────────────────────────────────────────────────────────── */
  footer: {
    note: "Mandovi Tales runs river cruises on the Mandovi from Panjim, Goa.",
    links: [
      { label: "Instagram", href: "https://instagram.com/" },
      { label: "Google reviews", href: "https://www.google.com/maps" },
    ],
    /** Remove this line once all stand-in photos are replaced with the client’s own. */
    credits:
      "Stand-in photographs: Wikimedia Commons, by Vyacheslav Argenberg, Klaus Nahr, Frederick Noronha, Nikhilb239, Manuel D’Cruz, Joegoauk Goa, Vijay Tiwari, Sanjay Gorivale, Sailko, Santoshsellathurai and goanfishcurryrice; CC BY and CC BY-SA.",
  },
};

export type Site = typeof site;

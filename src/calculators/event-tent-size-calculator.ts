import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eventTentSizeCalculator: CalculatorDefinition = {
  slug: "event-tent-size-calculator",
  title: "Event Tent Size Calculator",
  description: "Determine tent size needed for an outdoor event.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["event tent","tent size","outdoor event tent"],
  variants: [{
    id: "standard",
    name: "Event Tent Size",
    description: "Determine tent size needed for an outdoor event.",
    fields: [
      { name: "guests", label: "Guest Count", type: "number", min: 10, max: 1000, defaultValue: 100 },
      { name: "sqftPerGuest", label: "Sq Ft per Guest", type: "number", min: 8, max: 25, defaultValue: 12 },
      { name: "hasDance", label: "Dance Floor", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
      const guests = inputs.guests as number;
      const sqft = inputs.sqftPerGuest as number;
      const dance = inputs.hasDance as string;
      if (!guests || !sqft) return null;
      const base = guests * sqft;
      const danceArea = dance === "1" ? guests * 3 : 0;
      const total = base + danceArea;
      return {
        primary: { label: "Tent Size Needed", value: formatNumber(total) + " sq ft" },
        details: [
          { label: "Seating Area", value: formatNumber(base) + " sq ft" },
          { label: "Dance Floor", value: formatNumber(danceArea) + " sq ft" },
          { label: "Suggested Tent", value: Math.ceil(total / 100) * 100 + " sq ft" },
        ],
      };
  },
  }],
  relatedSlugs: ["event-catering-calculator","event-parking-calculator"],
  faq: [
    { question: "How much tent space per guest?", answer: "Allow 10 to 12 square feet per guest for seated events." },
    { question: "What size tent for 100 guests?", answer: "A 30x40 tent (1,200 sq ft) fits about 100 seated guests." },
  ],
  formula: "Total Sq Ft = (Guests x Sq Ft per Guest) + Dance Area",
};

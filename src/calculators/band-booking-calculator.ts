import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bandBookingCalculator: CalculatorDefinition = {
  slug: "band-booking-calculator",
  title: "Band Booking Calculator",
  description: "Estimate the cost of booking a live band for an event based on band size, event duration, and type.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["band booking cost", "live band price", "wedding band cost"],
  variants: [{
    id: "standard",
    name: "Band Booking",
    description: "Estimate the cost of booking a live band for an event based on band size, event duration, and type",
    fields: [
      { name: "bandSize", label: "Band Members", type: "number", min: 1, max: 20, defaultValue: 5 },
      { name: "hours", label: "Performance Hours", type: "number", min: 1, max: 8, defaultValue: 4 },
      { name: "eventType", label: "Event Type", type: "select", options: [{value:"wedding",label:"Wedding"},{value:"corporate",label:"Corporate Event"},{value:"private",label:"Private Party"},{value:"festival",label:"Festival/Public"}], defaultValue: "wedding" },
      { name: "genre", label: "Genre", type: "select", options: [{value:"cover",label:"Cover Band"},{value:"jazz",label:"Jazz/Classical"},{value:"rock",label:"Rock/Pop"},{value:"dj",label:"DJ + Live Musician"}], defaultValue: "cover" },
    ],
    calculate: (inputs) => {
      const members = inputs.bandSize as number;
      const hours = inputs.hours as number;
      const event = inputs.eventType as string;
      const genre = inputs.genre as string;
      if (!members || !hours) return null;
      const perMemberHour = 100;
      const eventMult: Record<string, number> = { wedding: 1.5, corporate: 1.3, private: 1.0, festival: 0.9 };
      const genreMult: Record<string, number> = { cover: 1.0, jazz: 1.2, rock: 1.0, dj: 0.8 };
      const base = members * hours * perMemberHour;
      const total = Math.round(base * (eventMult[event] || 1.0) * (genreMult[genre] || 1.0));
      const perHour = Math.round(total / hours);
      const deposit = Math.round(total * 0.25);
      return {
        primary: { label: "Estimated Total", value: "$" + formatNumber(total) },
        details: [
          { label: "Cost per Hour", value: "$" + formatNumber(perHour) },
          { label: "Typical Deposit", value: "$" + formatNumber(deposit) + " (25%)" },
          { label: "Band Size", value: members + " members" },
        ],
      };
    },
  }],
  relatedSlugs: ["recording-studio-cost-calculator", "music-lesson-cost-calculator"],
  faq: [
    { question: "How much does it cost to hire a band?", answer: "A typical 4-5 piece cover band costs $2,000-$5,000 for a 3-4 hour event. Wedding bands often charge a premium over other event types." },
    { question: "How far in advance should I book a band?", answer: "Popular bands should be booked 6-12 months in advance for weddings and major events. Corporate events typically need 2-3 months lead time." },
  ],
  formula: "Total = Band Members x Hours x Rate per Member Hour x Event Multiplier x Genre Multiplier",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const djPricingCalculator: CalculatorDefinition = {
  slug: "dj-pricing-calculator",
  title: "DJ Pricing Calculator",
  description: "Estimate DJ event pricing based on event type, duration, and equipment needs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["DJ pricing", "DJ event cost", "DJ hire cost"],
  variants: [{
    id: "standard",
    name: "DJ Pricing",
    description: "Estimate DJ event pricing based on event type, duration, and equipment needs",
    fields: [
      { name: "eventHours", label: "Event Duration", type: "number", suffix: "hours", min: 1, max: 12, defaultValue: 4 },
      { name: "eventType", label: "Event Type", type: "select", options: [{value:"party",label:"Private Party"},{value:"corporate",label:"Corporate Event"},{value:"wedding",label:"Wedding"}], defaultValue: "party" },
      { name: "equipment", label: "Equipment Level", type: "select", options: [{value:"basic",label:"Basic (Speakers Only)"},{value:"standard",label:"Standard (Sound + Lights)"},{value:"premium",label:"Premium (Full Production)"}], defaultValue: "standard" },
    ],
    calculate: (inputs) => {
      const hours = inputs.eventHours as number;
      const eventType = inputs.eventType as string;
      const equip = inputs.equipment as string;
      if (!hours || hours <= 0) return null;
      const baseRates: Record<string, number> = { party: 150, corporate: 200, wedding: 250 };
      const equipMod: Record<string, number> = { basic: 1.0, standard: 1.3, premium: 1.8 };
      const hourlyRate = (baseRates[eventType] || 150) * (equipMod[equip] || 1.3);
      const setupFee = 100;
      const travelFee = 75;
      const total = (hourlyRate * hours) + setupFee + travelFee;
      return {
        primary: { label: "Total DJ Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Performance Fee", value: "$" + formatNumber(Math.round(hourlyRate * hours)) },
          { label: "Effective Hourly Rate", value: "$" + formatNumber(Math.round(hourlyRate)) + "/hr" },
          { label: "Setup and Travel", value: "$" + formatNumber(setupFee + travelFee) },
        ],
      };
    },
  }],
  relatedSlugs: ["photographer-pricing-calculator", "concert-budget-calculator"],
  faq: [
    { question: "How much does a DJ cost for a party?", answer: "DJs typically charge $300 to $1,000 for a private party, $500 to $2,000 for corporate events, and $1,000 to $3,000 for weddings, depending on duration and equipment." },
    { question: "What should I look for when hiring a DJ?", answer: "Look for experience with your event type, good reviews, proper equipment, a backup plan for equipment failure, and willingness to take song requests." },
  ],
  formula: "Total = (Base Rate x Equipment Multiplier x Hours) + Setup Fee + Travel Fee",
};

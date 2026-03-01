import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petSittingRateCalculator: CalculatorDefinition = {
  slug: "pet-sitting-rate-calculator",
  title: "Pet Sitting Rate Calculator",
  description: "Calculate fair pet sitting rates based on number of pets, services needed, and visit duration.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pet sitting rates", "pet sitter cost", "dog sitting price"],
  variants: [{
    id: "standard",
    name: "Pet Sitting Rate",
    description: "Calculate fair pet sitting rates based on number of pets, services needed, and visit duration",
    fields: [
      { name: "pets", label: "Number of Pets", type: "number", min: 1, max: 10, defaultValue: 1 },
      { name: "serviceType", label: "Service Type", type: "select", options: [{value:"drop_in",label:"Drop-in Visit (30 min)"},{value:"walk",label:"Dog Walk (60 min)"},{value:"daycare",label:"Full Day Care"},{value:"overnight",label:"Overnight Stay"}], defaultValue: "drop_in" },
      { name: "days", label: "Number of Days", type: "number", min: 1, max: 30, defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const pets = inputs.pets as number;
      const service = inputs.serviceType as string;
      const days = inputs.days as number;
      if (!pets || !days || pets <= 0 || days <= 0) return null;
      const baseRate: Record<string, number> = { drop_in: 20, walk: 25, daycare: 40, overnight: 65 };
      const additionalPetRate = 5;
      const perVisit = (baseRate[service] || 20) + (pets - 1) * additionalPetRate;
      const total = perVisit * days;
      const tipSuggestion = total * 0.15;
      return {
        primary: { label: "Total Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Rate per Visit", value: "$" + formatNumber(Math.round(perVisit)) },
          { label: "Number of Days", value: String(days) },
          { label: "Suggested Tip (15%)", value: "$" + formatNumber(Math.round(tipSuggestion)) },
        ],
      };
    },
  }],
  relatedSlugs: ["dog-food-cost-calculator", "pet-emergency-fund-calculator"],
  faq: [
    { question: "How much should I pay a pet sitter?", answer: "Drop-in visits typically cost $15-$25, dog walks $20-$35, day care $30-$50, and overnight stays $50-$85." },
    { question: "Should I tip a pet sitter?", answer: "Tipping 15-20% is customary for pet sitting services, especially during holidays or for exceptional care." },
  ],
  formula: "Total = (Base Rate + Additional Pet Fee) x Number of Days",
};

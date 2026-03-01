import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyFormulaAmountCalculator: CalculatorDefinition = {
  slug: "baby-formula-amount-calculator",
  title: "Baby Formula Amount Calculator",
  description: "Calculate the recommended daily formula amount for an infant based on age and weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["baby formula amount", "how much formula", "infant formula calculator"],
  variants: [{
    id: "standard",
    name: "Baby Formula Amount",
    description: "Calculate the recommended daily formula amount for an infant based on age and weight",
    fields: [
      { name: "ageMonths", label: "Baby Age", type: "number", suffix: "months", min: 0, max: 12, defaultValue: 3 },
      { name: "weightLbs", label: "Baby Weight", type: "number", suffix: "lbs", min: 4, max: 30, step: 0.5, defaultValue: 12 },
      { name: "feedingsPerDay", label: "Feedings Per Day", type: "number", min: 4, max: 12, defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const age = inputs.ageMonths as number;
      const weight = inputs.weightLbs as number;
      const feedings = inputs.feedingsPerDay as number;
      if (!weight || weight <= 0 || !feedings || feedings <= 0) return null;
      const ozPerLb = age <= 1 ? 2.5 : age <= 3 ? 2.5 : age <= 6 ? 2.5 : 2.0;
      const totalOz = Math.min(32, weight * ozPerLb);
      const perFeeding = totalOz / feedings;
      const scoopsPerDay = Math.ceil(totalOz / 2);
      return {
        primary: { label: "Daily Formula Amount", value: formatNumber(Math.round(totalOz * 10) / 10) + " oz" },
        details: [
          { label: "Per Feeding", value: formatNumber(Math.round(perFeeding * 10) / 10) + " oz" },
          { label: "Number of Feedings", value: formatNumber(feedings) + " per day" },
          { label: "Approx. Scoops Per Day", value: formatNumber(scoopsPerDay) + " scoops" },
        ],
      };
    },
  }],
  relatedSlugs: ["baby-milk-intake-calculator", "birth-weight-percentile-calculator"],
  faq: [
    { question: "How much formula does a newborn need per day?", answer: "Newborns typically need about 2 to 2.5 ounces of formula per pound of body weight per day, up to about 32 ounces. A 7-pound newborn would need roughly 17 to 18 ounces daily." },
    { question: "When should formula amounts be adjusted?", answer: "Formula amounts should be adjusted as the baby grows. Pediatricians recommend following hunger cues rather than strict schedules, and increasing amounts gradually as the baby gains weight." },
  ],
  formula: "Daily Formula (oz) = Baby Weight (lbs) x 2.5 oz/lb (max 32 oz); Per Feeding = Daily Total / Number of Feedings",
};

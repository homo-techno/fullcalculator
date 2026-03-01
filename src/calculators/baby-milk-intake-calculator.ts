import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyMilkIntakeCalculator: CalculatorDefinition = {
  slug: "baby-milk-intake-calculator",
  title: "Baby Milk Intake Calculator",
  description: "Estimate the daily breast milk or formula intake needs for an infant based on age and weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["baby milk intake", "infant milk needs", "breastmilk amount calculator"],
  variants: [{
    id: "standard",
    name: "Baby Milk Intake",
    description: "Estimate the daily breast milk or formula intake needs for an infant based on age and weight",
    fields: [
      { name: "ageMonths", label: "Baby Age", type: "number", suffix: "months", min: 0, max: 12, defaultValue: 4 },
      { name: "weightKg", label: "Baby Weight", type: "number", suffix: "kg", min: 2, max: 15, step: 0.1, defaultValue: 6 },
      { name: "feedType", label: "Feed Type", type: "select", options: [{value:"breast",label:"Breast Milk"},{value:"formula",label:"Formula"},{value:"mixed",label:"Mixed Feeding"}], defaultValue: "breast" },
    ],
    calculate: (inputs) => {
      const age = inputs.ageMonths as number;
      const weight = inputs.weightKg as number;
      const feedType = inputs.feedType as string;
      if (!weight || weight <= 0) return null;
      const mlPerKg = age <= 1 ? 150 : age <= 3 ? 150 : age <= 6 ? 120 : 100;
      const dailyMl = weight * mlPerKg;
      const dailyOz = dailyMl / 29.5735;
      const feedsPerDay = age <= 1 ? 10 : age <= 3 ? 8 : age <= 6 ? 6 : 5;
      const perFeedMl = dailyMl / feedsPerDay;
      const perFeedOz = dailyOz / feedsPerDay;
      return {
        primary: { label: "Daily Milk Intake", value: formatNumber(Math.round(dailyMl)) + " mL (" + formatNumber(Math.round(dailyOz)) + " oz)" },
        details: [
          { label: "Per Feeding", value: formatNumber(Math.round(perFeedMl)) + " mL (" + formatNumber(Math.round(perFeedOz * 10) / 10) + " oz)" },
          { label: "Suggested Feedings Per Day", value: formatNumber(feedsPerDay) },
          { label: "Feed Type", value: feedType === "breast" ? "Breast Milk" : feedType === "formula" ? "Formula" : "Mixed" },
        ],
      };
    },
  }],
  relatedSlugs: ["baby-formula-amount-calculator", "exclusive-pumping-calculator"],
  faq: [
    { question: "How much milk does a breastfed baby need per day?", answer: "Breastfed babies typically consume about 750 to 900 mL (25 to 30 oz) of milk per day between 1 and 6 months of age. Intake is relatively stable during this period." },
    { question: "Is there a difference in intake between breast milk and formula?", answer: "Formula-fed babies may consume slightly more volume because formula is digested more slowly than breast milk. Breast milk intake tends to remain more consistent over time." },
  ],
  formula: "Daily Intake (mL) = Baby Weight (kg) x mL per kg (based on age); Per Feeding = Daily Total / Feedings Per Day",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waxingCostCalculator: CalculatorDefinition = {
  slug: "waxing-cost-calculator",
  title: "Waxing Cost Calculator",
  description: "Calculate waxing service pricing for various body areas.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["waxing cost","wax service price","body waxing cost"],
  variants: [{
    id: "standard",
    name: "Waxing Cost",
    description: "Calculate waxing service pricing for various body areas.",
    fields: [
      { name: "area", label: "Body Area", type: "select", options: [{ value: "15", label: "Eyebrow" }, { value: "25", label: "Upper Lip" }, { value: "50", label: "Underarm" }, { value: "65", label: "Half Leg" }, { value: "90", label: "Full Leg" }, { value: "70", label: "Brazilian" }] },
      { name: "additionalAreas", label: "Additional Areas ($)", type: "number", min: 0, max: 300, defaultValue: 0 },
      { name: "frequency", label: "Visits Per Year", type: "number", min: 1, max: 24, defaultValue: 8 },
      { name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const area = parseInt(inputs.area as string);
    const additionalAreas = inputs.additionalAreas as number;
    const frequency = inputs.frequency as number;
    const tip = inputs.tip as number;
    const perVisit = area + additionalAreas;
    const tipAmount = perVisit * (tip / 100);
    const totalPerVisit = perVisit + tipAmount;
    const annualCost = totalPerVisit * frequency;
    return {
      primary: { label: "Annual Waxing Cost", value: "$" + formatNumber(annualCost) },
      details: [
        { label: "Cost Per Visit", value: "$" + formatNumber(totalPerVisit) },
        { label: "Tip Per Visit", value: "$" + formatNumber(tipAmount) },
        { label: "Monthly Average", value: "$" + formatNumber(annualCost / 12) }
      ]
    };
  },
  }],
  relatedSlugs: ["laser-hair-removal-calculator","spa-day-cost-calculator"],
  faq: [
    { question: "How much does a Brazilian wax cost?", answer: "Brazilian waxing typically costs $50 to $80 per session." },
    { question: "How often should you get waxed?", answer: "Every 4 to 6 weeks is recommended for most body areas." },
    { question: "Is waxing cheaper than laser hair removal?", answer: "Per session waxing is cheaper, but laser saves money long term." },
  ],
  formula: "Annual = (Area Cost + Additional Areas) x (1 + Tip%) x Frequency",
};

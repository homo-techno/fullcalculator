import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kombuchaBrewingCalculator: CalculatorDefinition = {
  slug: "kombucha-brewing-calculator",
  title: "Kombucha Brewing Calculator",
  description: "Calculate ingredients for a batch of kombucha.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["kombucha brewing","kombucha recipe calculator"],
  variants: [{
    id: "standard",
    name: "Kombucha Brewing",
    description: "Calculate ingredients for a batch of kombucha.",
    fields: [
      { name: "batchSize", label: "Batch Size (gallons)", type: "number", min: 0.5, max: 20, defaultValue: 1 },
      { name: "teaType", label: "Tea Type", type: "select", options: [{ value: "1", label: "Black Tea" }, { value: "2", label: "Green Tea" }, { value: "3", label: "Mixed" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const gal = inputs.batchSize as number;
      const tea = inputs.teaType as number;
      if (!gal || !tea) return null;
      const waterCups = Math.round(gal * 16);
      const sugarCups = Math.round(gal * 1 * 10) / 10;
      const teaBags = Math.round(gal * 8);
      const starterOz = Math.round(gal * 16);
      const fermentDays = tea === 2 ? "5 to 7" : "7 to 14";
      return {
        primary: { label: "Sugar", value: formatNumber(sugarCups) + " cups" },
        details: [
          { label: "Water", value: formatNumber(waterCups) + " cups" },
          { label: "Tea Bags", value: formatNumber(teaBags) },
          { label: "Starter Liquid", value: formatNumber(starterOz) + " oz" },
          { label: "Ferment Time", value: fermentDays + " days" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How much sugar does kombucha need?", answer: "Use about 1 cup of sugar per gallon. The SCOBY consumes most of it." },
    { question: "How long does kombucha take to ferment?", answer: "First fermentation takes 7 to 14 days at room temperature." },
  ],
  formula: "Sugar = 1 cup per gallon; Tea Bags = 8 per gallon",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fertilizerApplicationRateCalculator: CalculatorDefinition = {
  slug: "fertilizer-application-rate-calculator",
  title: "Fertilizer Application Rate Calculator",
  description: "Determine the correct amount of fertilizer product to apply based on soil test recommendations, nutrient content, and field size.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["fertilizer application rate","npk calculator","fertilizer amount calculator"],
  variants: [{
    id: "standard",
    name: "Fertilizer Application Rate",
    description: "Determine the correct amount of fertilizer product to apply based on soil test recommendations, nutrient content, and field size.",
    fields: [
      { name: "targetN", label: "Target Nitrogen (lb/acre)", type: "number", min: 0, max: 300, defaultValue: 150 },
      { name: "fertilizerN", label: "Fertilizer N Content (%)", type: "number", min: 1, max: 82, defaultValue: 46 },
      { name: "acres", label: "Field Size (acres)", type: "number", min: 0.1, max: 50000, defaultValue: 100 },
      { name: "applicationPasses", label: "Number of Applications", type: "number", min: 1, max: 5, defaultValue: 2 },
      { name: "costPerTon", label: "Fertilizer Cost ($/ton)", type: "number", min: 100, max: 3000, defaultValue: 650 },
    ],
    calculate: (inputs) => {
      const tn = inputs.targetN as number;
      const fn = inputs.fertilizerN as number;
      const ac = inputs.acres as number;
      const ap = inputs.applicationPasses as number;
      const cpt = inputs.costPerTon as number;
      if (!tn || !fn || !ac || !ap || !cpt) return null;
      const productPerAcre = Math.round(tn / (fn / 100) * 100) / 100;
      const perApplication = Math.round(productPerAcre / ap * 100) / 100;
      const totalProduct = Math.round(productPerAcre * ac);
      const totalTons = Math.round(totalProduct / 2000 * 100) / 100;
      const totalCost = Math.round(totalTons * cpt * 100) / 100;
      const costPerAcre = Math.round(totalCost / ac * 100) / 100;
      return {
        primary: { label: "Product Per Acre", value: formatNumber(productPerAcre) + " lb/acre" },
        details: [
          { label: "Per Application", value: formatNumber(perApplication) + " lb/acre" },
          { label: "Total Product Needed", value: formatNumber(totalProduct) + " lb" },
          { label: "Total Tons", value: formatNumber(totalTons) },
          { label: "Total Cost", value: "$" + formatNumber(totalCost) },
          { label: "Cost Per Acre", value: "$" + formatNumber(costPerAcre) },
        ],
      };
  },
  }],
  relatedSlugs: ["crop-yield-calculator","soil-ph-amendment-calculator"],
  faq: [
    { question: "How do I determine how much fertilizer to apply?", answer: "Start with a soil test to know current nutrient levels. Subtract available nutrients from crop requirements. Divide the nutrient needed by the fertilizer analysis percentage to get product rate." },
    { question: "What does 46-0-0 mean on fertilizer?", answer: "The three numbers represent the percentages of nitrogen (N), phosphorus (P2O5), and potassium (K2O). So 46-0-0 (urea) contains 46% nitrogen and no phosphorus or potassium." },
  ],
  formula: "Product Rate (lb/acre) = Target Nutrient / (Fertilizer % / 100); Total Product = Rate x Acres; Cost = Total Product / 2000 x Cost Per Ton",
};

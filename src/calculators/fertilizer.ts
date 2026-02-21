import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fertilizerCalculator: CalculatorDefinition = {
  slug: "fertilizer-calculator",
  title: "Fertilizer Calculator",
  description: "Free fertilizer calculator. Calculate how much lawn fertilizer you need based on area, nitrogen rate, and bag NPK analysis.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fertilizer calculator", "lawn fertilizer calculator", "how much fertilizer", "NPK calculator", "nitrogen rate calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Fertilizer Needed",
      description: "Calculate bags of fertilizer for your lawn",
      fields: [
        { name: "area", label: "Lawn Area (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "nRate", label: "Desired N Rate (lbs N per 1,000 sq ft)", type: "number", placeholder: "e.g. 1", defaultValue: 1, step: 0.25 },
        { name: "bagNPercent", label: "Bag N Percentage (%)", type: "number", placeholder: "e.g. 29" },
        { name: "bagWeight", label: "Bag Weight (lbs)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const nRate = (inputs.nRate as number) || 1;
        const bagNPercent = inputs.bagNPercent as number;
        const bagWeight = (inputs.bagWeight as number) || 50;
        if (!area || !bagNPercent) return null;

        // Total nitrogen needed
        const totalNNeeded = (area / 1000) * nRate;
        // Nitrogen per bag
        const nPerBag = bagWeight * (bagNPercent / 100);
        // Bags needed
        const bagsExact = totalNNeeded / nPerBag;
        const bags = Math.ceil(bagsExact);
        // Total product weight
        const totalProductLbs = totalNNeeded / (bagNPercent / 100);
        // Coverage per bag at this rate
        const coveragePerBag = (nPerBag / nRate) * 1000;

        return {
          primary: { label: "Bags of Fertilizer", value: `${bags} bag${bags !== 1 ? "s" : ""}` },
          details: [
            { label: "Lawn area", value: `${formatNumber(area)} sq ft` },
            { label: "Application rate", value: `${nRate} lb N per 1,000 sq ft` },
            { label: "Total nitrogen needed", value: `${formatNumber(totalNNeeded, 2)} lbs` },
            { label: "Nitrogen per bag", value: `${formatNumber(nPerBag, 2)} lbs N` },
            { label: "Bags (exact)", value: formatNumber(bagsExact, 2) },
            { label: "Total product needed", value: `${formatNumber(totalProductLbs, 1)} lbs` },
            { label: "Coverage per bag", value: `${formatNumber(coveragePerBag, 0)} sq ft` },
          ],
          note: "Standard application rate is 1 lb of nitrogen per 1,000 sq ft. Never exceed 1.5 lbs N per 1,000 sq ft in a single application to avoid burning the lawn.",
        };
      },
    },
  ],
  relatedSlugs: ["grass-seed-calculator", "lawn-calculator", "topsoil-calculator"],
  faq: [
    { question: "How much fertilizer do I need per 1,000 sq ft?", answer: "The standard rate is 1 lb of actual nitrogen per 1,000 sq ft. For a 29-0-4 fertilizer in a 50-lb bag, you would apply about 3.4 lbs of product per 1,000 sq ft to deliver 1 lb of nitrogen." },
    { question: "What do the NPK numbers mean?", answer: "NPK stands for Nitrogen-Phosphorus-Potassium. A 29-0-4 fertilizer contains 29% nitrogen, 0% phosphorus, and 4% potassium by weight. Nitrogen promotes leaf growth, phosphorus supports roots, and potassium improves overall health." },
    { question: "How often should I fertilize my lawn?", answer: "Most lawns benefit from 3-5 fertilizer applications per year. Apply in early spring, late spring, summer, and fall. Cool-season grasses prefer heavier fall feeding; warm-season grasses prefer summer feeding." },
  ],
  formula: "Bags = (Area / 1,000 x N Rate) / (Bag Weight x N% / 100)",
};

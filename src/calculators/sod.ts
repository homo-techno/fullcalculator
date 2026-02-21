import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sodCalculator: CalculatorDefinition = {
  slug: "sod-calculator",
  title: "Sod Calculator",
  description: "Free sod calculator. Calculate how many rolls or pallets of sod you need for your lawn based on area in square feet.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sod calculator", "how much sod do I need", "sod rolls calculator", "sod pallet calculator", "lawn sod estimator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Sod Needed",
      description: "Calculate rolls and pallets of sod for your lawn",
      fields: [
        { name: "area", label: "Lawn Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        if (!area) return null;

        const rollSize = 10; // sq ft per roll (2' x 5')
        const palletCoverage = 450; // sq ft per pallet
        const wasteMultiplier = 1.05; // 5% waste
        const areaWithWaste = area * wasteMultiplier;
        const rolls = Math.ceil(areaWithWaste / rollSize);
        const pallets = areaWithWaste / palletCoverage;
        const palletsRounded = Math.ceil(pallets);

        return {
          primary: { label: "Sod Rolls Needed", value: `${rolls} rolls` },
          details: [
            { label: "Lawn area", value: `${formatNumber(area)} sq ft` },
            { label: "Area with 5% waste", value: `${formatNumber(areaWithWaste, 0)} sq ft` },
            { label: "Rolls (10 sq ft each)", value: `${rolls}` },
            { label: "Pallets needed", value: `${palletsRounded} (${formatNumber(pallets, 1)} exact)` },
            { label: "Pallet coverage", value: "~450 sq ft each" },
            { label: "Roll dimensions", value: "2 ft x 5 ft" },
          ],
          note: "Standard sod rolls are 2 ft x 5 ft (10 sq ft). A pallet covers approximately 450 sq ft (45 rolls). Includes 5% waste for cutting and fitting.",
        };
      },
    },
  ],
  relatedSlugs: ["grass-seed-calculator", "topsoil-calculator", "lawn-calculator"],
  faq: [
    { question: "How many rolls of sod do I need?", answer: "Divide your lawn area in square feet by 10 (each roll covers 10 sq ft), then add 5% for waste. For example, a 2,000 sq ft lawn needs approximately 210 rolls." },
    { question: "How much does a pallet of sod cover?", answer: "A standard pallet of sod covers approximately 450 square feet. It contains about 45 rolls of sod, each measuring 2 ft x 5 ft." },
    { question: "When is the best time to lay sod?", answer: "The best time to lay sod is during the cooler months of spring or early fall. Avoid laying sod during extreme heat or freezing temperatures. Water immediately after installation." },
  ],
  formula: "Rolls = (Area x 1.05) / 10 | Pallets = (Area x 1.05) / 450",
};

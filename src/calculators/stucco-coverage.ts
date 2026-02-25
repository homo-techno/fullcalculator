import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stuccoCoverageCalculator: CalculatorDefinition = {
  slug: "stucco-coverage-calculator",
  title: "Stucco Coverage Calculator",
  description: "Free stucco calculator. Estimate how many bags of stucco mix you need, plus lath, scratch coat, and finish coat materials for your project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["stucco calculator", "stucco coverage", "how much stucco do I need", "stucco mix calculator", "stucco wall calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Stucco Coverage",
      description: "Estimate stucco materials for walls and exteriors",
      fields: [
        { name: "wallArea", label: "Total Wall Area (sq ft)", type: "number", placeholder: "e.g. 1200" },
        { name: "windowDoorArea", label: "Window/Door Area to Subtract (sq ft)", type: "number", placeholder: "e.g. 150", defaultValue: 0 },
        { name: "coats", label: "Number of Coats", type: "select", options: [{ label: "3-Coat System (standard)", value: "3" }, { label: "2-Coat System", value: "2" }, { label: "1-Coat (repair/patch)", value: "1" }], defaultValue: "3" },
        { name: "costPerBag", label: "Cost per 80 lb Bag (optional)", type: "number", placeholder: "e.g. 12", prefix: "$" },
      ],
      calculate: (inputs) => {
        const wallArea = inputs.wallArea as number;
        const windowDoorArea = (inputs.windowDoorArea as number) || 0;
        const coats = parseInt((inputs.coats as string) || "3");
        const costPerBag = inputs.costPerBag as number;
        if (!wallArea) return null;

        const netArea = wallArea - windowDoorArea;
        if (netArea <= 0) return null;

        // One 80-lb bag of stucco covers approximately 25 sq ft at 3/8" thick per coat
        const sqFtPerBag = 25;
        const bagsPerCoat = Math.ceil(netArea / sqFtPerBag);
        const totalBags = Math.ceil(bagsPerCoat * coats * 1.10);

        // Metal lath: sold in 2.5 lb/sq yd sheets (27 sq ft), with 6" overlap
        const lathSheets = Math.ceil(netArea / 24);

        // Stucco nails: approximately 1 lb per 50 sq ft
        const nailLbs = Math.ceil(netArea / 50);

        const details: { label: string; value: string }[] = [
          { label: "Net Wall Area", value: `${formatNumber(netArea)} sq ft` },
          { label: "Coat System", value: `${coats}-coat` },
          { label: "Bags per Coat", value: formatNumber(bagsPerCoat) },
          { label: "Total Bags (80 lb) with 10% Waste", value: formatNumber(totalBags) },
          { label: "Metal Lath Sheets (27 sq ft)", value: formatNumber(lathSheets) },
          { label: "Stucco Nails", value: `${formatNumber(nailLbs)} lbs` },
          { label: "Total Weight", value: `${formatNumber(totalBags * 80)} lbs` },
        ];

        if (costPerBag) {
          const stuccoCost = totalBags * costPerBag;
          const lathCost = lathSheets * 8;
          const totalCost = stuccoCost + lathCost;
          details.push({ label: "Stucco Mix Cost", value: `$${formatNumber(stuccoCost, 2)}` });
          details.push({ label: "Estimated Lath Cost", value: `$${formatNumber(lathCost, 2)}` });
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
        }

        return {
          primary: { label: "Stucco Bags Needed", value: `${formatNumber(totalBags)} bags (80 lb)` },
          details,
          note: "Based on 80 lb bags covering ~25 sq ft per coat at 3/8\" thickness. Standard 3-coat system includes scratch coat, brown coat, and finish coat. Includes 10% waste factor.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "paint-calculator", "siding-calculator"],
  faq: [
    { question: "How much area does one bag of stucco cover?", answer: "One 80-pound bag of stucco mix covers approximately 25 square feet at 3/8-inch thickness per coat. A standard 3-coat system requires 3 times the material." },
    { question: "What is a 3-coat stucco system?", answer: "The 3-coat system consists of a scratch coat (3/8\"), a brown/leveling coat (3/8\"), and a finish coat (1/8\"). It provides the most durable and long-lasting stucco application." },
    { question: "How thick should stucco be?", answer: "A standard 3-coat stucco system totals about 7/8 inch thick: scratch coat (3/8\"), brown coat (3/8\"), and finish coat (1/8\"). Minimum total thickness is typically 7/8 inch per building codes." },
  ],
  formula: "Total Bags = (Net Area / 25 sq ft per bag) x Number of Coats x 1.10 waste factor",
};

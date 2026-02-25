import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fenceCostCalculator: CalculatorDefinition = {
  slug: "fence-cost-calculator",
  title: "Fence Cost Calculator",
  description: "Free fence cost calculator. Estimate the total cost of fence installation by material, length, and height including posts, gates, and labor.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fence cost calculator", "fence installation cost", "how much does a fence cost", "fence price estimator", "privacy fence cost"],
  variants: [
    {
      id: "fence",
      name: "Fence Installation",
      fields: [
        { name: "length", label: "Total Fence Length (feet)", type: "number", placeholder: "e.g. 200" },
        { name: "height", label: "Fence Height (feet)", type: "select", options: [
          { label: "4 feet", value: "4" },
          { label: "6 feet (standard privacy)", value: "6" },
          { label: "8 feet (tall privacy)", value: "8" },
        ], defaultValue: "6" },
        { name: "material", label: "Fence Material", type: "select", options: [
          { label: "Wood (cedar) - $12-25/ft", value: "18" },
          { label: "Wood (pine/pressure treated) - $8-18/ft", value: "13" },
          { label: "Vinyl/PVC - $20-40/ft", value: "30" },
          { label: "Chain link - $8-15/ft", value: "11" },
          { label: "Aluminum - $20-35/ft", value: "27" },
          { label: "Wrought iron - $25-50/ft", value: "37" },
          { label: "Composite - $25-45/ft", value: "35" },
        ], defaultValue: "18" },
        { name: "gates", label: "Number of Gates", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "installation", label: "Installation", type: "select", options: [
          { label: "DIY", value: "0" },
          { label: "Professional ($5-15/ft labor)", value: "10" },
        ], defaultValue: "10" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const height = parseInt(inputs.height as string) || 6;
        const materialCost = parseFloat(inputs.material as string) || 18;
        const gates = (inputs.gates as number) || 0;
        const laborPerFt = parseInt(inputs.installation as string) || 0;
        if (!length) return null;
        const heightFactor = height / 6; // 6ft is baseline
        const materialTotal = length * materialCost * heightFactor;
        const posts = Math.ceil(length / 8) + 1; // post every 8 feet
        const postCost = posts * 25;
        const gateCost = gates * 250 * heightFactor;
        const laborTotal = laborPerFt * length;
        const concrete = posts * 12; // concrete for post holes
        const totalCost = materialTotal + postCost + gateCost + laborTotal + concrete;
        return {
          primary: { label: "Estimated Fence Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Material cost", value: `$${formatNumber(materialTotal)}` },
            { label: "Posts needed", value: `${posts}` },
            { label: "Post & concrete cost", value: `$${formatNumber(postCost + concrete)}` },
            { label: "Gate cost", value: gates > 0 ? `$${formatNumber(gateCost)}` : "No gates" },
            { label: "Labor cost", value: laborPerFt > 0 ? `$${formatNumber(laborTotal)}` : "DIY" },
            { label: "Cost per linear foot", value: `$${formatNumber(totalCost / length)}` },
            { label: "Fence length", value: `${length} ft` },
            { label: "Fence height", value: `${height} ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["deck-cost-calculator", "patio-cost-calculator", "landscaping-cost-calculator"],
  faq: [
    { question: "How much does a fence cost?", answer: "Wood (cedar): $15-$30/ft installed. Vinyl: $25-$50/ft. Chain link: $10-$25/ft. Aluminum: $25-$45/ft. A typical 200-foot privacy fence costs $3,000-$8,000 for wood, $5,000-$12,000 for vinyl. Gates add $200-$600 each." },
  ],
  formula: "Total = (Length × Material/ft × Height Factor) + Posts + Gates + Labor + Concrete",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gutterCostCalculator: CalculatorDefinition = {
  slug: "gutter-cost-calculator",
  title: "Gutter Installation Cost Calculator",
  description: "Free gutter installation cost calculator. Estimate the cost of new gutters, downspouts, and gutter guards by material and linear footage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gutter cost calculator", "gutter installation cost", "seamless gutter cost", "gutter guard cost", "how much do gutters cost"],
  variants: [
    {
      id: "gutters",
      name: "Gutter Installation",
      fields: [
        { name: "linearFeet", label: "Total Gutter Length (linear feet)", type: "number", placeholder: "e.g. 150" },
        { name: "material", label: "Gutter Material", type: "select", options: [
          { label: "Aluminum (seamless) - $6-12/ft", value: "9" },
          { label: "Vinyl - $3-6/ft", value: "4.5" },
          { label: "Steel - $8-15/ft", value: "11" },
          { label: "Copper - $20-40/ft", value: "30" },
          { label: "Zinc - $15-25/ft", value: "20" },
        ], defaultValue: "9" },
        { name: "gutterSize", label: "Gutter Size", type: "select", options: [
          { label: "5-inch (standard residential)", value: "1.0" },
          { label: "6-inch (high capacity)", value: "1.2" },
        ], defaultValue: "1.0" },
        { name: "stories", label: "Number of Stories", type: "select", options: [
          { label: "1 story", value: "1.0" },
          { label: "2 stories (+15%)", value: "1.15" },
          { label: "3 stories (+30%)", value: "1.3" },
        ], defaultValue: "1.0" },
        { name: "guards", label: "Gutter Guards", type: "select", options: [
          { label: "No gutter guards", value: "0" },
          { label: "Screen guards ($1-3/ft)", value: "2" },
          { label: "Micro-mesh ($5-10/ft)", value: "7.5" },
          { label: "Surface tension ($8-15/ft)", value: "12" },
        ], defaultValue: "0" },
        { name: "downspouts", label: "Number of Downspouts", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
      ],
      calculate: (inputs) => {
        const linearFeet = inputs.linearFeet as number;
        const materialCost = parseFloat(inputs.material as string) || 9;
        const sizeFactor = parseFloat(inputs.gutterSize as string) || 1.0;
        const storyFactor = parseFloat(inputs.stories as string) || 1.0;
        const guardCost = parseFloat(inputs.guards as string) || 0;
        const downspouts = (inputs.downspouts as number) || 4;
        if (!linearFeet) return null;
        const gutterCost = linearFeet * materialCost * sizeFactor * storyFactor;
        const guardTotal = guardCost * linearFeet;
        const downspoutCost = downspouts * 75; // avg $75 per downspout installed
        const corners = Math.ceil(linearFeet / 40) * 15; // estimated corners
        const removal = linearFeet * 1.5; // old gutter removal
        const totalCost = gutterCost + guardTotal + downspoutCost + corners + removal;
        return {
          primary: { label: "Estimated Gutter Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Gutter cost (installed)", value: `$${formatNumber(gutterCost)}` },
            { label: "Gutter guards", value: guardCost > 0 ? `$${formatNumber(guardTotal)}` : "None" },
            { label: "Downspouts", value: `${downspouts} × $75 = $${formatNumber(downspoutCost)}` },
            { label: "Corners & end caps", value: `$${formatNumber(corners)}` },
            { label: "Old gutter removal", value: `$${formatNumber(removal)}` },
            { label: "Linear feet", value: `${linearFeet} ft` },
            { label: "Cost per linear foot", value: `$${formatNumber(totalCost / linearFeet)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roof-replacement-cost-calculator", "siding-cost-calculator", "landscaping-cost-calculator"],
  faq: [
    { question: "How much do gutters cost to install?", answer: "Vinyl: $3-$6/ft. Aluminum (seamless): $6-$12/ft. Steel: $8-$15/ft. Copper: $20-$40/ft. A typical home with 150 linear feet costs $900-$1,800 (aluminum). Gutter guards add $1-$15/ft. Most homes need 4-8 downspouts at $50-$100 each." },
  ],
  formula: "Total = (Linear Ft × Material × Size Factor × Story Factor) + Guards + Downspouts + Corners + Removal",
};

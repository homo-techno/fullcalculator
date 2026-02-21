import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wireLengthCalculator: CalculatorDefinition = {
  slug: "wire-length-calculator",
  title: "Wire Length Calculator",
  description: "Free wire length calculator. Calculate total wire needed for electrical runs based on outlets, distance from panel, and slack allowance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wire", "length", "electrical", "cable", "outlets", "wiring", "rolls", "calculator"],
  variants: [
    {
      id: "convert",
      name: "Calculate Wire Length",
      fields: [
        { name: "outlets", label: "Number of Outlets/Fixtures", type: "number", placeholder: "e.g. 10" },
        { name: "avgDistance", label: "Avg Distance from Panel (feet)", type: "number", placeholder: "e.g. 50" },
        { name: "slackPercent", label: "Additional Slack (%)", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const outlets = inputs.outlets as number;
        const avgDistance = inputs.avgDistance as number;
        const slackPercent = (inputs.slackPercent as number) || 0;
        if (!outlets || !avgDistance) return null;
        // Each outlet needs a run from panel and back (×2 for hot and neutral, but wire sold as cable)
        // Standard practice: distance from panel to outlet per run
        const baseLength = outlets * avgDistance;
        const slackMultiplier = 1 + slackPercent / 100;
        const totalWithSlack = baseLength * slackMultiplier;
        // Add 1 foot per connection for stripping/termination
        const connectionAllowance = outlets * 1;
        const grandTotal = totalWithSlack + connectionAllowance;
        // Number of 250ft rolls
        const rollSize = 250;
        const rollsNeeded = Math.ceil(grandTotal / rollSize);
        const totalWireFromRolls = rollsNeeded * rollSize;
        const waste = totalWireFromRolls - grandTotal;
        return {
          primary: { label: "Total Wire Needed", value: `${formatNumber(grandTotal, 1)} feet` },
          details: [
            { label: "Number of Outlets/Fixtures", value: formatNumber(outlets, 0) },
            { label: "Avg Distance from Panel", value: `${formatNumber(avgDistance, 1)} feet` },
            { label: "Base Wire Length", value: `${formatNumber(baseLength, 1)} feet` },
            { label: "Slack Added", value: `${formatNumber(slackPercent, 1)}% (${formatNumber(totalWithSlack - baseLength, 1)} feet)` },
            { label: "Connection Allowance", value: `${formatNumber(connectionAllowance, 0)} feet (1 ft per outlet)` },
            { label: "Total Wire Needed", value: `${formatNumber(grandTotal, 1)} feet` },
            { label: "250ft Rolls Needed", value: formatNumber(rollsNeeded, 0) },
            { label: "Total Wire from Rolls", value: `${formatNumber(totalWireFromRolls, 0)} feet` },
            { label: "Estimated Waste", value: `${formatNumber(waste, 1)} feet` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["timber-volume-calculator", "fabric-converter"],
  faq: [
    { question: "How much extra wire should I buy?", answer: "A 10-15% slack allowance is standard to account for routing around obstacles, through walls, and for termination. Add 1 foot per connection point." },
    { question: "How many feet are in a standard roll of wire?", answer: "Residential electrical wire is commonly sold in 250-foot rolls (boxes). Larger 1,000-foot spools are also available for bigger projects." },
  ],
  formula: "Total = (outlets × avg distance × (1 + slack%/100)) + (outlets × 1 ft connection). Rolls = ceil(total / 250).",
};

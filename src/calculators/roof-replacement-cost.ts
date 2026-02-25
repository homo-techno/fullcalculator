import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roofReplacementCostCalculator: CalculatorDefinition = {
  slug: "roof-replacement-cost-calculator",
  title: "Roof Replacement Cost Calculator",
  description: "Free roof replacement cost calculator. Estimate the cost of a new roof based on size, material, pitch, and labor in your area.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["roof replacement cost", "new roof cost", "roof cost calculator", "roofing cost estimator", "how much for a new roof"],
  variants: [
    {
      id: "replacement",
      name: "Roof Replacement",
      fields: [
        { name: "sqft", label: "Roof Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "material", label: "Roofing Material", type: "select", options: [
          { label: "Asphalt 3-tab shingles ($1-2/sq ft)", value: "1.5" },
          { label: "Architectural shingles ($2-4/sq ft)", value: "3" },
          { label: "Metal roofing ($5-12/sq ft)", value: "8.5" },
          { label: "Clay/concrete tile ($6-15/sq ft)", value: "10" },
          { label: "Slate ($10-30/sq ft)", value: "20" },
          { label: "Wood shake ($5-10/sq ft)", value: "7.5" },
        ], defaultValue: "3" },
        { name: "pitch", label: "Roof Pitch", type: "select", options: [
          { label: "Low (2/12 - 4/12)", value: "1.0" },
          { label: "Medium (5/12 - 7/12)", value: "1.1" },
          { label: "Steep (8/12 - 12/12)", value: "1.3" },
          { label: "Very steep (12/12+)", value: "1.5" },
        ], defaultValue: "1.1" },
        { name: "layers", label: "Existing Roof Layers", type: "select", options: [
          { label: "1 layer (tear-off required)", value: "1" },
          { label: "2 layers (more tear-off)", value: "1.3" },
          { label: "New construction (no tear-off)", value: "0" },
        ], defaultValue: "1" },
        { name: "extras", label: "Additional Work", type: "select", options: [
          { label: "None", value: "0" },
          { label: "Minor decking repair ($500-$1,500)", value: "1000" },
          { label: "Major decking repair ($2,000-$5,000)", value: "3500" },
          { label: "Add skylights ($500-$2,000 each)", value: "1500" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const materialCost = parseFloat(inputs.material as string) || 3;
        const pitchFactor = parseFloat(inputs.pitch as string) || 1.1;
        const tearOffFactor = parseFloat(inputs.layers as string);
        const extras = parseInt(inputs.extras as string) || 0;
        if (!sqft) return null;
        const squares = sqft / 100; // roofing measured in "squares" (100 sq ft)
        const materialTotal = sqft * materialCost;
        const underlayment = sqft * 0.50;
        const tearOff = tearOffFactor > 0 ? sqft * 0.75 * tearOffFactor : 0;
        const labor = sqft * 2.5 * pitchFactor;
        const flashing = squares * 50;
        const dumpster = 400;
        const permits = 300;
        const totalCost = materialTotal + underlayment + tearOff + labor + flashing + dumpster + permits + extras;
        return {
          primary: { label: "Estimated Roof Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Roof size", value: `${formatNumber(sqft, 0)} sq ft (${formatNumber(squares, 1)} squares)` },
            { label: "Material cost", value: `$${formatNumber(materialTotal)}` },
            { label: "Underlayment", value: `$${formatNumber(underlayment)}` },
            { label: "Tear-off/disposal", value: tearOff > 0 ? `$${formatNumber(tearOff + dumpster)}` : "N/A (new construction)" },
            { label: "Labor", value: `$${formatNumber(labor)}` },
            { label: "Flashing & trim", value: `$${formatNumber(flashing)}` },
            { label: "Permits", value: `$${permits}` },
            { label: "Cost per sq ft", value: `$${formatNumber(totalCost / sqft)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["siding-cost-calculator", "gutter-cost-calculator", "square-footage-calculator"],
  faq: [
    { question: "How much does a new roof cost?", answer: "Asphalt shingles: $5,000-$12,000 for a typical home. Architectural shingles: $8,000-$18,000. Metal: $15,000-$30,000. Tile: $20,000-$45,000. Slate: $25,000-$75,000. Steep roofs and multiple tear-off layers add 10-50% to the cost." },
  ],
  formula: "Total = (Sq Ft × Material + Underlayment + Tear-off + Labor × Pitch Factor + Flashing) + Permits + Extras",
};

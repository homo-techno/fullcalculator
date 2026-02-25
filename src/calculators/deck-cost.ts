import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deckCostCalculator: CalculatorDefinition = {
  slug: "deck-cost-calculator",
  title: "Deck Cost Calculator",
  description: "Free deck cost calculator. Estimate the cost of building a new deck including materials, railing, stairs, and labor.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["deck cost calculator", "deck building cost", "how much does a deck cost", "deck price estimator", "composite deck cost"],
  variants: [
    {
      id: "build",
      name: "Deck Build Cost",
      fields: [
        { name: "sqft", label: "Deck Size (sq ft)", type: "number", placeholder: "e.g. 300" },
        { name: "material", label: "Decking Material", type: "select", options: [
          { label: "Pressure treated wood ($2-5/sq ft)", value: "3.5" },
          { label: "Cedar ($4-8/sq ft)", value: "6" },
          { label: "Redwood ($5-10/sq ft)", value: "7.5" },
          { label: "Composite ($6-12/sq ft)", value: "9" },
          { label: "PVC/Vinyl ($7-14/sq ft)", value: "10" },
          { label: "Exotic hardwood ($8-16/sq ft)", value: "12" },
        ], defaultValue: "3.5" },
        { name: "height", label: "Deck Height", type: "select", options: [
          { label: "Ground level (0-2 ft)", value: "1.0" },
          { label: "Low (2-4 ft)", value: "1.15" },
          { label: "Medium (4-8 ft)", value: "1.3" },
          { label: "High (8+ ft)", value: "1.5" },
        ], defaultValue: "1.0" },
        { name: "railing", label: "Railing", type: "select", options: [
          { label: "No railing", value: "0" },
          { label: "Wood railing ($20-35/ft)", value: "27" },
          { label: "Composite railing ($30-60/ft)", value: "45" },
          { label: "Metal/cable railing ($50-120/ft)", value: "80" },
        ], defaultValue: "27" },
        { name: "stairs", label: "Stairs", type: "select", options: [
          { label: "No stairs", value: "0" },
          { label: "Short (3-5 steps)", value: "500" },
          { label: "Medium (6-10 steps)", value: "1200" },
          { label: "Long (11+ steps)", value: "2500" },
        ], defaultValue: "500" },
        { name: "installation", label: "Installation", type: "select", options: [
          { label: "DIY", value: "0" },
          { label: "Professional ($15-35/sq ft)", value: "25" },
        ], defaultValue: "25" },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const materialCost = parseFloat(inputs.material as string) || 3.5;
        const heightFactor = parseFloat(inputs.height as string) || 1.0;
        const railingCost = parseInt(inputs.railing as string) || 0;
        const stairCost = parseInt(inputs.stairs as string) || 0;
        const laborCost = parseInt(inputs.installation as string) || 0;
        if (!sqft) return null;
        const deckPerimeter = Math.sqrt(sqft) * 4; // approximate
        const deckingMaterial = sqft * materialCost;
        const framing = sqft * 4; // joists, beams, posts
        const hardware = sqft * 1.5; // screws, bolts, hangers
        const concrete = Math.ceil(sqft / 64) * 35; // footings
        const railingTotal = railingCost * deckPerimeter * 0.75; // ~75% of perimeter
        const laborTotal = laborCost * sqft;
        const permits = 250;
        const subtotal = (deckingMaterial + framing + hardware + concrete) * heightFactor;
        const totalCost = subtotal + railingTotal + stairCost + laborTotal + permits;
        return {
          primary: { label: "Estimated Deck Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Decking material", value: `$${formatNumber(deckingMaterial)}` },
            { label: "Framing & structure", value: `$${formatNumber(framing * heightFactor)}` },
            { label: "Hardware & concrete", value: `$${formatNumber((hardware + concrete) * heightFactor)}` },
            { label: "Railing", value: railingCost > 0 ? `$${formatNumber(railingTotal)}` : "None" },
            { label: "Stairs", value: stairCost > 0 ? `$${formatNumber(stairCost)}` : "None" },
            { label: "Labor", value: laborCost > 0 ? `$${formatNumber(laborTotal)}` : "DIY" },
            { label: "Permits", value: `$${permits}` },
            { label: "Cost per sq ft", value: `$${formatNumber(totalCost / sqft)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["patio-cost-calculator", "fence-cost-calculator", "square-footage-calculator"],
  faq: [
    { question: "How much does it cost to build a deck?", answer: "Pressure treated wood: $15-$25/sq ft installed. Cedar: $25-$40/sq ft. Composite: $30-$60/sq ft. A typical 300 sq ft deck costs $4,500-$7,500 (wood) or $9,000-$18,000 (composite). Railing, stairs, and elevation add to the cost." },
  ],
  formula: "Total = (Material + Framing + Hardware) × Height Factor + Railing + Stairs + Labor + Permits",
};

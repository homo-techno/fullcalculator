import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const patioCostCalculator: CalculatorDefinition = {
  slug: "patio-cost-calculator",
  title: "Patio Cost Calculator",
  description: "Free patio cost calculator. Estimate the cost of building a patio with concrete, pavers, flagstone, or stamped concrete.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["patio cost calculator", "paver patio cost", "concrete patio cost", "patio installation cost", "how much does a patio cost"],
  variants: [
    {
      id: "patio",
      name: "Patio Installation",
      fields: [
        { name: "sqft", label: "Patio Size (sq ft)", type: "number", placeholder: "e.g. 250" },
        { name: "material", label: "Patio Material", type: "select", options: [
          { label: "Poured concrete ($6-12/sq ft)", value: "9" },
          { label: "Stamped concrete ($10-18/sq ft)", value: "14" },
          { label: "Concrete pavers ($10-20/sq ft)", value: "15" },
          { label: "Brick pavers ($12-25/sq ft)", value: "18" },
          { label: "Natural flagstone ($15-30/sq ft)", value: "22" },
          { label: "Travertine ($15-35/sq ft)", value: "25" },
          { label: "Gravel/crushed stone ($1-5/sq ft)", value: "3" },
        ], defaultValue: "15" },
        { name: "grading", label: "Site Preparation", type: "select", options: [
          { label: "Level ground (minimal prep)", value: "1" },
          { label: "Some grading needed ($2-5/sq ft)", value: "3.5" },
          { label: "Major grading/excavation ($5-10/sq ft)", value: "7.5" },
        ], defaultValue: "1" },
        { name: "edging", label: "Edging / Border", type: "select", options: [
          { label: "No edging", value: "0" },
          { label: "Concrete edging ($5-10/ft)", value: "7" },
          { label: "Stone border ($10-20/ft)", value: "15" },
        ], defaultValue: "0" },
        { name: "installation", label: "Installation", type: "select", options: [
          { label: "DIY", value: "0" },
          { label: "Professional ($6-12/sq ft labor)", value: "9" },
        ], defaultValue: "9" },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const materialCost = parseFloat(inputs.material as string) || 15;
        const gradingCost = parseFloat(inputs.grading as string) || 1;
        const edgingCost = parseInt(inputs.edging as string) || 0;
        const laborCost = parseInt(inputs.installation as string) || 0;
        if (!sqft) return null;
        const materialTotal = sqft * materialCost;
        const gradingTotal = sqft * gradingCost;
        const base = sqft * 2; // gravel base material
        const perimeter = Math.sqrt(sqft) * 4;
        const edgingTotal = edgingCost * perimeter;
        const laborTotal = laborCost * sqft;
        const totalCost = materialTotal + gradingTotal + base + edgingTotal + laborTotal;
        return {
          primary: { label: "Estimated Patio Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Material cost", value: `$${formatNumber(materialTotal)}` },
            { label: "Site preparation", value: `$${formatNumber(gradingTotal)}` },
            { label: "Base material (gravel)", value: `$${formatNumber(base)}` },
            { label: "Edging/border", value: edgingCost > 0 ? `$${formatNumber(edgingTotal)}` : "None" },
            { label: "Labor", value: laborCost > 0 ? `$${formatNumber(laborTotal)}` : "DIY" },
            { label: "Patio area", value: `${sqft} sq ft` },
            { label: "Cost per sq ft", value: `$${formatNumber(totalCost / sqft)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["deck-cost-calculator", "concrete-calculator", "driveway-cost-calculator"],
  faq: [
    { question: "How much does a patio cost?", answer: "Concrete: $6-$15/sq ft. Stamped concrete: $10-$20/sq ft. Pavers: $12-$25/sq ft. Flagstone: $15-$35/sq ft. A 250 sq ft paver patio costs $3,000-$7,000 installed. Add more for grading, drainage, edging, and sealing." },
  ],
  formula: "Total = (Sq Ft × Material/SqFt) + Site Prep + Base + Edging + Labor",
};

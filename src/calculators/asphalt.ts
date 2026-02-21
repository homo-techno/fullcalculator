import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const asphaltCalculator: CalculatorDefinition = {
  slug: "asphalt-calculator",
  title: "Asphalt Calculator",
  description: "Free asphalt calculator. Calculate how many tons of asphalt you need for driveways, parking lots, and paving projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["asphalt calculator", "how much asphalt do I need", "asphalt tonnage calculator", "driveway asphalt calculator", "blacktop calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Asphalt Needed",
      description: "Calculate tons of asphalt for your paving project",
      fields: [
        { name: "area", label: "Area (sq ft)", type: "number", placeholder: "e.g. 1000" },
        { name: "thickness", label: "Thickness (inches)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "costPerTon", label: "Cost per Ton (optional)", type: "number", placeholder: "e.g. 100", prefix: "$" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const thickness = (inputs.thickness as number) || 3;
        const costPerTon = inputs.costPerTon as number;
        if (!area) return null;

        // Asphalt weighs approximately 145 lbs per cubic foot
        const cubicFeet = area * (thickness / 12);
        const weightLbs = cubicFeet * 145;
        const tons = weightLbs / 2000;
        const tonsWithWaste = tons * 1.05;
        const cubicYards = cubicFeet / 27;

        const details: { label: string; value: string }[] = [
          { label: "Area", value: `${formatNumber(area)} sq ft` },
          { label: "Thickness", value: `${thickness} inches` },
          { label: "Tons (exact)", value: formatNumber(tons, 2) },
          { label: "Tons with 5% waste", value: formatNumber(tonsWithWaste, 2) },
          { label: "Weight", value: `${formatNumber(weightLbs, 0)} lbs` },
          { label: "Cubic feet", value: formatNumber(cubicFeet, 1) },
          { label: "Cubic yards", value: formatNumber(cubicYards, 2) },
        ];

        if (costPerTon) {
          const totalCost = tonsWithWaste * costPerTon;
          details.push({ label: "Estimated cost", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Cost per sq ft", value: `$${formatNumber(totalCost / area, 2)}` });
        }

        return {
          primary: { label: "Asphalt Needed", value: `${formatNumber(tonsWithWaste, 2)} tons` },
          details,
          note: "Based on asphalt density of 145 lbs per cubic foot. Standard residential driveway thickness is 2-3 inches. Commercial applications require 3-4 inches. Includes 5% waste factor.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "gravel-calculator", "square-footage-calculator"],
  faq: [
    { question: "How do I calculate tons of asphalt needed?", answer: "Multiply the area (sq ft) by thickness (inches), divide by 12 to get cubic feet, multiply by 145 (lbs per cu ft for asphalt), then divide by 2,000 to get tons. Add 5-10% for waste." },
    { question: "How thick should a residential driveway be?", answer: "A standard residential asphalt driveway should be 2-3 inches thick over a 6-8 inch compacted gravel base. For heavier traffic or commercial use, 3-4 inches of asphalt is recommended." },
    { question: "How much does asphalt cost per ton?", answer: "Hot mix asphalt typically costs $80-$150 per ton depending on location and quantity. A standard residential driveway (600-800 sq ft) requires approximately 3-5 tons at 2-3 inches thick." },
  ],
  formula: "Tons = Area (sq ft) x Thickness (in) / 12 x 145 / 2,000",
};

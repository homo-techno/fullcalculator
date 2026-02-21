import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deckStainCalculator: CalculatorDefinition = {
  slug: "deck-stain-calculator",
  title: "Deck Stain Calculator",
  description: "Free deck stain calculator. Calculate how many gallons of deck stain or sealer you need based on deck area, stain type, and number of coats.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["deck stain calculator", "how much deck stain", "deck sealer calculator", "deck stain coverage", "deck stain gallons"],
  variants: [
    {
      id: "calc",
      name: "Calculate Deck Stain Needed",
      description: "Calculate gallons of stain for your deck",
      fields: [
        { name: "area", label: "Deck Area (sq ft)", type: "number", placeholder: "e.g. 300" },
        { name: "stainType", label: "Stain Type", type: "select", options: [
          { label: "Transparent / Clear Sealer", value: "transparent" },
          { label: "Semi-Transparent", value: "semi" },
          { label: "Solid / Opaque", value: "solid" },
        ], defaultValue: "semi" },
        { name: "coats", label: "Number of Coats", type: "select", options: [
          { label: "1 coat", value: "1" },
          { label: "2 coats (recommended)", value: "2" },
        ], defaultValue: "2" },
        { name: "railings", label: "Include Railings?", type: "select", options: [
          { label: "No railings", value: "0" },
          { label: "Yes - add 20%", value: "20" },
          { label: "Yes - add 40% (spindle railings)", value: "40" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const stainType = inputs.stainType as string;
        const coats = parseInt(inputs.coats as string) || 2;
        const railingPercent = parseInt(inputs.railings as string) || 0;
        if (!area || !stainType) return null;

        let coveragePerGallon: number, typeName: string;
        switch (stainType) {
          case "transparent":
            coveragePerGallon = 200;
            typeName = "Transparent / Clear";
            break;
          case "semi":
            coveragePerGallon = 300;
            typeName = "Semi-Transparent";
            break;
          case "solid":
            coveragePerGallon = 400;
            typeName = "Solid / Opaque";
            break;
          default:
            coveragePerGallon = 300;
            typeName = "Semi-Transparent";
        }

        const totalArea = area * (1 + railingPercent / 100);
        const totalCoverage = totalArea * coats;
        const gallons = totalCoverage / coveragePerGallon;
        const gallonsRounded = Math.ceil(gallons);

        return {
          primary: { label: "Deck Stain Needed", value: `${gallonsRounded} gallon${gallonsRounded > 1 ? "s" : ""}` },
          details: [
            { label: "Deck floor area", value: `${formatNumber(area)} sq ft` },
            { label: "Total area with railings", value: `${formatNumber(totalArea, 0)} sq ft` },
            { label: "Stain type", value: typeName },
            { label: "Coverage per gallon", value: `~${coveragePerGallon} sq ft` },
            { label: "Number of coats", value: `${coats}` },
            { label: "Total coverage needed", value: `${formatNumber(totalCoverage, 0)} sq ft` },
            { label: "Exact gallons", value: formatNumber(gallons, 2) },
          ],
          note: "Transparent stains absorb more into wood (~200 sq ft/gal). Solid stains sit on the surface (~400 sq ft/gal). Rough or weathered wood absorbs more stain. Two coats are recommended for best protection.",
        };
      },
    },
  ],
  relatedSlugs: ["deck-calculator", "paint-calculator", "square-footage-calculator"],
  faq: [
    { question: "How much deck stain do I need?", answer: "Divide your deck area by the stain's coverage rate: transparent stains cover ~200 sq ft/gal, semi-transparent ~300 sq ft/gal, and solid stains ~400 sq ft/gal. Multiply by number of coats. Add 20-40% for railings." },
    { question: "Should I use 1 or 2 coats of deck stain?", answer: "Two coats are recommended for most deck stains, especially transparent and semi-transparent types. The first coat penetrates the wood, and the second coat provides additional color and protection. Always follow the manufacturer's directions." },
    { question: "How often should I restain my deck?", answer: "Transparent stains last 1-2 years. Semi-transparent stains last 2-3 years. Solid stains last 3-5 years. Decks in direct sun or harsh climates may need more frequent staining." },
  ],
  formula: "Gallons = (Deck Area x (1 + Railing %) x Coats) / Coverage per Gallon",
};

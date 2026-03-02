import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const miniaturePaintingCostCalculator: CalculatorDefinition = {
  slug: "miniature-painting-cost-calculator",
  title: "Miniature Painting Cost Calculator",
  description: "Estimate paint, brush, and supply costs for miniature painting projects based on number of minis and detail level.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["miniature painting cost","mini painting supplies","warhammer paint","model painting budget"],
  variants: [{
    id: "standard",
    name: "Miniature Painting Cost",
    description: "Estimate paint, brush, and supply costs for miniature painting projects based on number of minis and detail level.",
    fields: [
      { name: "numMinis", label: "Number of Miniatures", type: "number", min: 1, max: 500, defaultValue: 10 },
      { name: "miniSize", label: "Miniature Scale", type: "select", options: [{ value: "1", label: "28mm (Standard)" }, { value: "2", label: "32mm (Heroic)" }, { value: "3", label: "54mm (Large)" }, { value: "4", label: "75mm+ (Display)" }], defaultValue: "1" },
      { name: "detailLevel", label: "Detail Level", type: "select", options: [{ value: "1", label: "Tabletop (3 colors)" }, { value: "2", label: "Good (5-8 colors)" }, { value: "3", label: "High (10+ colors)" }, { value: "4", label: "Competition" }], defaultValue: "2" },
      { name: "paintBrand", label: "Paint Brand Tier", type: "select", options: [{ value: "1", label: "Budget ($2-3/bottle)" }, { value: "2", label: "Standard ($4-5/bottle)" }, { value: "3", label: "Premium ($6-8/bottle)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const numMinis = inputs.numMinis as number;
    const miniSize = parseInt(inputs.miniSize as string);
    const detail = parseInt(inputs.detailLevel as string);
    const brand = parseInt(inputs.paintBrand as string);
    const colorsNeeded = { 1: 3, 2: 7, 3: 12, 4: 18 };
    const paintPrice = { 1: 2.5, 2: 4.5, 3: 7 };
    const sizeMultiplier = { 1: 1, 2: 1.2, 3: 2, 4: 3 };
    const colors = colorsNeeded[detail] || 7;
    const pricePerBottle = paintPrice[brand] || 4.5;
    const sizeMult = sizeMultiplier[miniSize] || 1;
    const paintCost = colors * pricePerBottle;
    const mlPerMini = 0.3 * sizeMult;
    const bottleMl = 17;
    const bottlesConsumed = Math.ceil((numMinis * mlPerMini * colors) / (bottleMl * colors)) ;
    const brushCost = detail >= 3 ? 25 : 12;
    const primerCost = Math.ceil(numMinis / 20) * 12;
    const totalCost = paintCost + brushCost + primerCost;
    return {
      primary: { label: "Paint Set Cost", value: "$" + formatNumber(Math.round(paintCost * 100) / 100) },
      details: [
        { label: "Colors Needed", value: formatNumber(colors) },
        { label: "Brush Cost", value: "$" + formatNumber(brushCost) },
        { label: "Primer Cost", value: "$" + formatNumber(primerCost) },
        { label: "Total Startup Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["model-railroad-scale-calculator","leather-working-cost-calculator"],
  faq: [
    { question: "How much paint do I need for miniatures?", answer: "A standard 17ml bottle of miniature paint covers approximately 50 to 60 standard 28mm miniatures with a single thin coat of one color." },
    { question: "What paints are best for beginners?", answer: "Citadel, Vallejo, and Army Painter are popular choices. Vallejo offers the best value while Citadel has the widest hobby support." },
    { question: "Do I need to prime miniatures?", answer: "Yes, priming provides a surface for paint to adhere to. Spray primer is fastest; brush-on primer works for small batches." },
  ],
  formula: "Paint Set Cost = Number of Colors x Price Per Bottle
Primer Cost = ceil(Minis / 20) x Spray Can Price
Total Startup = Paint + Brushes + Primer",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woodStainCoverageCalculator: CalculatorDefinition = {
  slug: "wood-stain-coverage-calculator",
  title: "Wood Stain Coverage Calculator",
  description: "Free wood stain coverage calculator. Estimate how much stain, finish, or sealant you need based on surface area and product coverage rate.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wood stain calculator", "stain coverage calculator", "finish coverage", "polyurethane coverage", "wood finish estimator"],
  variants: [
    {
      id: "stain-coverage",
      name: "Stain/Finish Coverage",
      description: "Calculate amount of stain or finish needed",
      fields: [
        { name: "surfaceArea", label: "Total Surface Area (sq ft)", type: "number", placeholder: "e.g. 100" },
        {
          name: "finishType",
          label: "Finish Type",
          type: "select",
          options: [
            { label: "Oil-Based Stain (250 sq ft/qt)", value: "250" },
            { label: "Water-Based Stain (200 sq ft/qt)", value: "200" },
            { label: "Gel Stain (150 sq ft/qt)", value: "150" },
            { label: "Polyurethane (125 sq ft/qt)", value: "125" },
            { label: "Lacquer (200 sq ft/qt)", value: "200" },
            { label: "Danish Oil (200 sq ft/qt)", value: "200" },
            { label: "Tung Oil (150 sq ft/qt)", value: "150" },
            { label: "Sanding Sealer (200 sq ft/qt)", value: "200" },
          ],
        },
        { name: "numCoats", label: "Number of Coats", type: "number", placeholder: "e.g. 2" },
        {
          name: "woodPorosity",
          label: "Wood Porosity",
          type: "select",
          options: [
            { label: "Low (maple, cherry)", value: "1.0" },
            { label: "Medium (walnut, pine)", value: "1.15" },
            { label: "High (oak, ash, mahogany)", value: "1.3" },
          ],
        },
      ],
      calculate: (inputs) => {
        const surfaceArea = inputs.surfaceArea as number;
        const coverageRate = parseFloat(inputs.finishType as string);
        const numCoats = inputs.numCoats as number;
        const porosityFactor = parseFloat(inputs.woodPorosity as string);
        if (!surfaceArea || !coverageRate || !numCoats) return null;
        const adjustedCoverage = coverageRate / (porosityFactor || 1);
        const totalArea = surfaceArea * numCoats;
        const quartsNeeded = totalArea / adjustedCoverage;
        const gallonsNeeded = quartsNeeded / 4;
        const pintsNeeded = quartsNeeded * 2;
        const roundedQuarts = Math.ceil(quartsNeeded);
        const roundedGallons = Math.ceil(gallonsNeeded);
        const cost8oz = Math.ceil(quartsNeeded * 4);
        return {
          primary: { label: "Amount Needed", value: `${formatNumber(quartsNeeded, 1)} quarts` },
          details: [
            { label: "Gallons Needed", value: formatNumber(gallonsNeeded, 2) },
            { label: "Purchase (quarts)", value: formatNumber(roundedQuarts, 0) },
            { label: "Purchase (gallons)", value: formatNumber(roundedGallons, 0) },
            { label: "Total Coverage Area", value: `${formatNumber(totalArea, 0)} sq ft` },
            { label: "Adjusted Coverage Rate", value: `${formatNumber(adjustedCoverage, 0)} sq ft/qt` },
            { label: "Number of Coats", value: formatNumber(numCoats, 0) },
            { label: "Surface Area", value: `${formatNumber(surfaceArea, 0)} sq ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["veneer-coverage-calculator", "sandpaper-grit-calculator", "board-footage-calculator"],
  faq: [
    { question: "How many coats of stain should I apply?", answer: "One coat is usually sufficient for stain. Additional coats deepen the color but increase drying time. For topcoats like polyurethane, 2-3 coats are standard." },
    { question: "Does wood species affect coverage?", answer: "Yes. Porous woods like oak absorb more finish per coat than dense woods like maple. The calculator adjusts coverage rate based on wood porosity." },
  ],
  formula: "Quarts Needed = (Surface Area x Coats) / (Coverage Rate / Porosity Factor)",
};

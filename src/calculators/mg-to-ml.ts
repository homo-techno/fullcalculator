import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mgToMlConverter: CalculatorDefinition = {
  slug: "mg-to-ml-converter",
  title: "Milligrams to Milliliters Converter",
  description: "Free mg to mL converter. Convert milligrams to milliliters using substance density. Works for water, medications, and common liquids.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["mg to ml", "milligrams to milliliters", "mg to ml converter", "mg ml conversion", "medication dosage converter"],
  variants: [
    {
      id: "convert",
      name: "Convert mg to mL",
      fields: [
        { name: "value", label: "Milligrams (mg)", type: "number", placeholder: "e.g. 500" },
        { name: "density", label: "Substance", type: "select", options: [
          { label: "Water (1.0 g/mL)", value: "1.0" },
          { label: "Milk (1.03 g/mL)", value: "1.03" },
          { label: "Honey (1.42 g/mL)", value: "1.42" },
          { label: "Olive Oil (0.92 g/mL)", value: "0.92" },
          { label: "Ethanol (0.789 g/mL)", value: "0.789" },
          { label: "Mercury (13.6 g/mL)", value: "13.6" },
          { label: "Custom Density", value: "custom" },
        ], defaultValue: "1.0" },
        { name: "customDensity", label: "Custom Density (g/mL)", type: "number", placeholder: "e.g. 1.05" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const densityStr = inputs.density as string;
        const customDensity = inputs.customDensity as number;
        if (value === undefined) return null;
        const density = densityStr === "custom" ? (customDensity || 1) : parseFloat(densityStr);
        const ml = value / (density * 1000);
        return {
          primary: { label: `${formatNumber(value)} mg`, value: `${formatNumber(ml, 6)} mL` },
          details: [
            { label: "Milliliters (mL)", value: formatNumber(ml, 6) },
            { label: "Liters (L)", value: formatNumber(ml / 1000, 9) },
            { label: "Teaspoons", value: formatNumber(ml / 4.929, 6) },
            { label: "Tablespoons", value: formatNumber(ml / 14.787, 6) },
            { label: "Density Used (g/mL)", value: formatNumber(density, 3) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "mcg-to-mg-converter", "drops-to-ml-converter"],
  faq: [
    { question: "How do I convert mg to mL?", answer: "Divide milligrams by (density in g/mL × 1000). For water (density = 1 g/mL): mL = mg ÷ 1000. So 500 mg of water = 0.5 mL. For other substances, you need to know the density." },
    { question: "Is 1 mg equal to 1 mL?", answer: "No. Milligrams measure mass and milliliters measure volume. For water, 1000 mg = 1 mL. The relationship depends on the substance's density." },
  ],
  formula: "mL = mg ÷ (density × 1000) | For water: 1 mL = 1000 mg | density of water = 1.0 g/mL",
};

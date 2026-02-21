import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

// All conversion factors to millilitres (mL)
const toMl: Record<string, number> = {
  "cups": 236.588,       // 1 US cup = 236.588 mL
  "tbsp": 14.787,        // 1 US tablespoon = 14.787 mL
  "tsp": 4.929,          // 1 US teaspoon = 4.929 mL
  "mL": 1,
  "fl oz": 29.5735,      // 1 US fluid ounce = 29.5735 mL
  "L": 1000,             // 1 litre = 1000 mL
};

const unitLabels: Record<string, string> = {
  "cups": "Cups (US)",
  "tbsp": "Tablespoons (US)",
  "tsp": "Teaspoons (US)",
  "mL": "Millilitres (mL)",
  "fl oz": "Fluid Ounces (US)",
  "L": "Litres (L)",
};

const unitOptions = Object.keys(toMl).map((u) => ({ label: unitLabels[u], value: u }));

export const cookingWeightConverter: CalculatorDefinition = {
  slug: "cooking-weight-converter",
  title: "Cooking Weight Converter",
  description: "Free cooking volume converter. Convert between cups, tablespoons, teaspoons, mL, fluid ounces, and litres for recipes.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["cooking", "volume", "cups", "tablespoons", "teaspoons", "fluid ounces", "recipe", "converter"],
  variants: [
    {
      id: "convert",
      name: "Convert",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 2" },
        { name: "from", label: "From", type: "select", options: unitOptions },
        { name: "to", label: "To", type: "select", options: unitOptions },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "cups";
        const to = (inputs.to as string) || "mL";
        if (!val) return null;
        const baseMl = val * toMl[from];
        const result = baseMl / toMl[to];
        return {
          primary: { label: `${formatNumber(val, 4)} ${from}`, value: `${formatNumber(result, 4)} ${to}` },
          details: [
            { label: "Base value (mL)", value: formatNumber(baseMl, 4) },
            { label: "Cups", value: formatNumber(baseMl / toMl["cups"], 4) },
            { label: "Tablespoons", value: formatNumber(baseMl / toMl["tbsp"], 2) },
            { label: "Teaspoons", value: formatNumber(baseMl / toMl["tsp"], 2) },
            { label: "Fluid Ounces", value: formatNumber(baseMl / toMl["fl oz"], 4) },
            { label: "Litres", value: formatNumber(baseMl / toMl["L"], 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["density-unit-converter", "paper-size-converter"],
  faq: [
    { question: "How many tablespoons in a cup?", answer: "There are 16 US tablespoons in 1 US cup." },
    { question: "How many teaspoons in a tablespoon?", answer: "There are 3 teaspoons in 1 tablespoon." },
    { question: "How many mL in a cup?", answer: "One US cup equals approximately 236.6 mL." },
  ],
  formula: "All conversions via millilitres. 1 cup = 236.588 mL. 1 tbsp = 14.787 mL. 1 tsp = 4.929 mL. 1 fl oz = 29.5735 mL.",
};

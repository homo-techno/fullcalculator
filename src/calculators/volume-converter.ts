import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const volUnits: Record<string, number> = {
  l: 1, ml: 0.001, gal_us: 3.78541, gal_uk: 4.54609,
  qt: 0.946353, pt: 0.473176, cup: 0.236588, floz: 0.0295735,
  tbsp: 0.0147868, tsp: 0.00492892, m3: 1000, cm3: 0.001,
};
const unitLabels: Record<string, string> = {
  l: "Liters", ml: "Milliliters", gal_us: "US Gallons", gal_uk: "UK Gallons",
  qt: "Quarts", pt: "Pints", cup: "Cups", floz: "Fluid Ounces",
  tbsp: "Tablespoons", tsp: "Teaspoons", m3: "Cubic Meters", cm3: "Cubic Centimeters",
};

export const volumeConverter: CalculatorDefinition = {
  slug: "volume-converter",
  title: "Volume Converter",
  description: "Free volume converter. Convert between liters, gallons, cups, fluid ounces, milliliters, and more.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["volume converter", "liters to gallons", "gallons to liters", "ml to oz", "cups to ml"],
  variants: [
    {
      id: "convert",
      name: "Convert Volume",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 5" },
        {
          name: "from", label: "From", type: "select",
          options: Object.entries(unitLabels).map(([v, l]) => ({ label: l, value: v })),
        },
        {
          name: "to", label: "To", type: "select",
          options: Object.entries(unitLabels).map(([v, l]) => ({ label: l, value: v })),
        },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "gal_us";
        const to = (inputs.to as string) || "l";
        if (!val) return null;
        const liters = val * (volUnits[from] || 1);
        const result = liters / (volUnits[to] || 1);
        return {
          primary: { label: `${val} ${unitLabels[from] || from}`, value: `${formatNumber(result, 6)} ${unitLabels[to] || to}` },
          details: [
            { label: "Liters", value: formatNumber(liters, 6) },
            { label: "US Gallons", value: formatNumber(liters / volUnits.gal_us, 6) },
            { label: "Milliliters", value: formatNumber(liters * 1000, 4) },
            { label: "Fluid Ounces", value: formatNumber(liters / volUnits.floz, 4) },
            { label: "Cups", value: formatNumber(liters / volUnits.cup, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cooking-converter", "unit-converter", "volume-calculator"],
  faq: [{ question: "How many liters in a gallon?", answer: "1 US gallon = 3.78541 liters. 1 UK gallon = 4.54609 liters. 1 liter = 33.814 US fl oz = 4.227 US cups." }],
  formula: "1 US gal = 3.785 L = 128 fl oz | 1 L = 1000 mL",
};

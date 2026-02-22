import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const btuToWattsConverter: CalculatorDefinition = {
  slug: "btu-to-watts-converter",
  title: "BTU to Watts Converter",
  description: "Free BTU to watts converter. Convert BTU/hr to watts and kilowatts instantly. Includes tons of cooling and horsepower equivalents.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["btu to watts", "btu to kw", "btu converter", "btu to kilowatts", "hvac watt converter", "cooling capacity converter"],
  variants: [
    {
      id: "convert",
      name: "Convert BTU/hr to Watts",
      fields: [
        { name: "value", label: "BTU/hr", type: "number", placeholder: "e.g. 12000" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const watts = value / 3.41214;
        return {
          primary: { label: `${formatNumber(value)} BTU/hr`, value: `${formatNumber(watts, 2)} W` },
          details: [
            { label: "Watts (W)", value: formatNumber(watts, 2) },
            { label: "Kilowatts (kW)", value: formatNumber(watts / 1000, 4) },
            { label: "Horsepower (HP)", value: formatNumber(watts / 745.7, 4) },
            { label: "Tons of Cooling", value: formatNumber(value / 12000, 4) },
            { label: "BTU/min", value: formatNumber(value / 60, 4) },
            { label: "Calories/hr", value: formatNumber(value * 252.164, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["watts-to-btu-converter", "kw-to-hp-converter", "energy-calculator"],
  faq: [
    { question: "How do I convert BTU to watts?", answer: "Divide BTU/hr by 3.41214 to get watts. For example, 12,000 BTU/hr = 3,517 watts = 3.517 kW. This equals 1 ton of cooling capacity." },
    { question: "How many BTU do I need for my room?", answer: "A general rule is 20 BTU per square foot. A 200 sq ft room needs about 4,000 BTU, a 300 sq ft room about 6,000 BTU, and a 500 sq ft room about 10,000 BTU. Adjust for insulation, climate, and sun exposure." },
  ],
  formula: "Watts = BTU/hr \u00f7 3.41214 | 1 BTU/hr = 0.29307 W | 12,000 BTU/hr = 1 ton = 3,517 W",
};

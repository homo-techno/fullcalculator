import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nauticalMileConverterCalculator: CalculatorDefinition = {
  slug: "nautical-mile-converter-calculator",
  title: "Nautical Mile Converter Calculator",
  description: "Convert nautical miles to kilometers and statute miles.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["nautical","mile","kilometer","conversion"],
  variants: [{
    id: "standard",
    name: "Nautical Mile Converter",
    description: "Convert nautical miles to kilometers and statute miles.",
    fields: [
      { name: "nauticalMiles", label: "Nautical Miles", type: "number", min: 0, max: 100000, defaultValue: 100 },
    ],
    calculate: (inputs) => {
    const nauticalMiles = inputs.nauticalMiles as number;
    const km = nauticalMiles * 1.852;
    const statuteMiles = nauticalMiles * 1.15078;
    const meters = km * 1000;
    return {
      primary: { label: "Kilometers", value: formatNumber(km) + " km" },
      details: [
        { label: "Statute Miles", value: formatNumber(statuteMiles) + " mi" },
        { label: "Meters", value: formatNumber(meters) + " m" },
        { label: "Nautical Miles", value: formatNumber(nauticalMiles) + " NM" }
      ]
    };
  },
  }],
  relatedSlugs: ["chart-distance-calculator","light-year-distance-calculator"],
  faq: [
    { question: "How long is a nautical mile?", answer: "One nautical mile equals 1.852 kilometers or 1.15078 statute miles." },
    { question: "Why do sailors use nautical miles?", answer: "A nautical mile equals one minute of latitude on a chart." },
  ],
  formula: "Kilometers = NM x 1.852; Statute Miles = NM x 1.15078",
};

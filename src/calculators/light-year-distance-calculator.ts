import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lightYearDistanceCalculator: CalculatorDefinition = {
  slug: "light-year-distance-calculator",
  title: "Light Year Distance Calculator",
  description: "Convert light years to kilometers and other distance units.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["light","year","distance","astronomy"],
  variants: [{
    id: "standard",
    name: "Light Year Distance",
    description: "Convert light years to kilometers and other distance units.",
    fields: [
      { name: "lightYears", label: "Light Years", type: "number", min: 0.001, max: 100000, defaultValue: 4.24 },
    ],
    calculate: (inputs) => {
    const lightYears = inputs.lightYears as number;
    const km = lightYears * 9.461e12;
    const au = lightYears * 63241.1;
    const parsecs = lightYears / 3.2616;
    return {
      primary: { label: "Distance in km", value: formatNumber(km) + " km" },
      details: [
        { label: "Astronomical Units", value: formatNumber(au) + " AU" },
        { label: "Parsecs", value: formatNumber(parsecs) + " pc" },
        { label: "Light Years", value: formatNumber(lightYears) + " ly" }
      ]
    };
  },
  }],
  relatedSlugs: ["star-magnitude-calculator","orbital-velocity-calculator"],
  faq: [
    { question: "How far is one light year?", answer: "One light year is about 9.461 trillion kilometers." },
    { question: "What is the nearest star?", answer: "Proxima Centauri is about 4.24 light years from Earth." },
  ],
  formula: "km = Light Years x 9.461 x 10^12; AU = Light Years x 63241.1",
};

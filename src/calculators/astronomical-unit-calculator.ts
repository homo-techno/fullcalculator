import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const astronomicalUnitCalculator: CalculatorDefinition = {
  slug: "astronomical-unit-calculator",
  title: "Astronomical Unit Calculator",
  description: "Free astronomical unit calculator. Convert between AU and km instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["astronomical unit calculator", "AU to km", "converter"],
  variants: [
    {
      id: "forward",
      name: "AU to km",
      description: "Convert AU to km",
      fields: [
        {
          name: "value",
          label: "Value in AU",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "AU",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 149597870.7;
        return {
          primary: { label: "km", value: formatNumber(r) + " km" },
          details: [
            { label: "Input", value: formatNumber(v) + " AU" },
            { label: "Factor", value: "1 AU = 149597870.7 km" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert AU to km?", answer: "Multiply by 149597870.7. Example: 10 AU = 1495978707 km." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "km = AU x 149597870.7",
};

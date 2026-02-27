import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nauticalMileToKmCalculator: CalculatorDefinition = {
  slug: "nautical-mile-to-km-calculator",
  title: "Nautical Mile to KM Calculator",
  description: "Free nautical mile to km calculator. Convert between nmi and km instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["nautical mile to km calculator", "nmi to km", "converter"],
  variants: [
    {
      id: "forward",
      name: "nmi to km",
      description: "Convert nmi to km",
      fields: [
        {
          name: "value",
          label: "Value in nmi",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "nmi",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 1.852;
        return {
          primary: { label: "km", value: formatNumber(r) + " km" },
          details: [
            { label: "Input", value: formatNumber(v) + " nmi" },
            { label: "Factor", value: "1 nmi = 1.852 km" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert nmi to km?", answer: "Multiply by 1.852. Example: 10 nmi = 18.52 km." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "km = nmi x 1.852",
};

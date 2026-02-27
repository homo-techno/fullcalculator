import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const leagueToKmCalculator: CalculatorDefinition = {
  slug: "league-to-km-calculator",
  title: "League to KM Calculator",
  description: "Free league to km calculator. Convert between league and km instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["league to km calculator", "league to km", "converter"],
  variants: [
    {
      id: "forward",
      name: "league to km",
      description: "Convert league to km",
      fields: [
        {
          name: "value",
          label: "Value in league",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "league",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 4.828;
        return {
          primary: { label: "km", value: formatNumber(r) + " km" },
          details: [
            { label: "Input", value: formatNumber(v) + " league" },
            { label: "Factor", value: "1 league = 4.828 km" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert league to km?", answer: "Multiply by 4.828. Example: 10 league = 48.28 km." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "km = league x 4.828",
};

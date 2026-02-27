import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const handToCmCalculator: CalculatorDefinition = {
  slug: "hand-to-cm-calculator",
  title: "Hand to CM Calculator",
  description: "Free hand to cm calculator. Convert between hands and cm instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["hand to cm calculator", "hands to cm", "converter"],
  variants: [
    {
      id: "forward",
      name: "hands to cm",
      description: "Convert hands to cm",
      fields: [
        {
          name: "value",
          label: "Value in hands",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "hands",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 10.16;
        return {
          primary: { label: "cm", value: formatNumber(r) + " cm" },
          details: [
            { label: "Input", value: formatNumber(v) + " hands" },
            { label: "Factor", value: "1 hands = 10.16 cm" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert hands to cm?", answer: "Multiply by 10.16. Example: 10 hands = 101.6 cm." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "cm = hands x 10.16",
};

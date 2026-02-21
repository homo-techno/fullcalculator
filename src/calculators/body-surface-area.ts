import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bodySurfaceAreaCalculator: CalculatorDefinition = {
  slug: "body-surface-area-calculator",
  title: "Body Surface Area Calculator",
  description:
    "Free body surface area (BSA) calculator using the DuBois formula. Estimate BSA from height and weight for clinical dosing.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["body surface area", "BSA", "DuBois formula", "clinical dosing"],
  variants: [
    {
      id: "dubois",
      name: "DuBois Formula",
      fields: [
        {
          name: "height",
          label: "Height (cm)",
          type: "number",
          placeholder: "e.g. 170",
        },
        {
          name: "weight",
          label: "Weight (kg)",
          type: "number",
          placeholder: "e.g. 70",
        },
      ],
      calculate: (inputs) => {
        const height = inputs.height as number;
        const weight = inputs.weight as number;
        if (!height || !weight) return null;

        const bsa = 0.007184 * Math.pow(height, 0.725) * Math.pow(weight, 0.425);

        return {
          primary: {
            label: "Body Surface Area",
            value: `${formatNumber(bsa, 2)} m\u00B2`,
          },
          details: [
            { label: "Height", value: `${formatNumber(height, 1)} cm` },
            { label: "Weight", value: `${formatNumber(weight, 1)} kg` },
            { label: "Formula", value: "DuBois: 0.007184 \u00D7 H^0.725 \u00D7 W^0.425" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bmi-percentile-calculator", "body-water-calculator"],
  faq: [
    {
      question: "What is body surface area used for?",
      answer:
        "Body surface area (BSA) is used in medicine to calculate drug dosages, especially chemotherapy, and to assess metabolic mass more accurately than body weight alone.",
    },
    {
      question: "What is the DuBois formula?",
      answer:
        "The DuBois formula is BSA = 0.007184 \u00D7 height(cm)^0.725 \u00D7 weight(kg)^0.425. It was developed in 1916 and remains one of the most widely used BSA formulas.",
    },
  ],
  formula:
    "BSA (m\u00B2) = 0.007184 \u00D7 height(cm)^0.725 \u00D7 weight(kg)^0.425",
};

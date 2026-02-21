import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const idealWeightCalculator: CalculatorDefinition = {
  slug: "ideal-weight-calculator",
  title: "Ideal Weight Calculator",
  description: "Free ideal weight calculator. Find your ideal body weight using multiple medical formulas (Devine, Robinson, Miller, Hamwi).",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["ideal weight calculator", "ideal body weight", "healthy weight calculator", "IBW calculator"],
  variants: [
    {
      id: "ideal",
      name: "Ideal Body Weight",
      description: "Calculate ideal weight based on height and gender",
      fields: [
        { name: "gender", label: "Gender", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }], defaultValue: "male" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 175", suffix: "cm", min: 130, max: 230 },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const cm = inputs.height as number;
        if (!cm) return null;
        const inches = cm / 2.54;
        const over5ft = Math.max(0, inches - 60);
        let devine: number, robinson: number, miller: number, hamwi: number;
        if (gender === "male") {
          devine = 50 + 2.3 * over5ft;
          robinson = 52 + 1.9 * over5ft;
          miller = 56.2 + 1.41 * over5ft;
          hamwi = 48 + 2.7 * over5ft;
        } else {
          devine = 45.5 + 2.3 * over5ft;
          robinson = 49 + 1.7 * over5ft;
          miller = 53.1 + 1.36 * over5ft;
          hamwi = 45.5 + 2.2 * over5ft;
        }
        const avg = (devine + robinson + miller + hamwi) / 4;
        return {
          primary: { label: "Ideal Weight (average)", value: `${formatNumber(avg, 1)} kg`, suffix: `(${formatNumber(avg * 2.205, 0)} lbs)` },
          details: [
            { label: "Devine formula", value: `${formatNumber(devine, 1)} kg` },
            { label: "Robinson formula", value: `${formatNumber(robinson, 1)} kg` },
            { label: "Miller formula", value: `${formatNumber(miller, 1)} kg` },
            { label: "Hamwi formula", value: `${formatNumber(hamwi, 1)} kg` },
          ],
          note: "These are estimates based on height and gender. Ideal weight varies by body composition, age, and ethnicity.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "calorie-calculator"],
  faq: [
    { question: "How is ideal weight calculated?", answer: "Multiple medical formulas estimate ideal weight from height. The Devine formula (most common) for men: 50 + 2.3 kg per inch over 5 feet. For women: 45.5 + 2.3 kg per inch over 5 feet." },
  ],
  formula: "Devine: IBW(male) = 50 + 2.3(inches over 60) | IBW(female) = 45.5 + 2.3(inches over 60)",
};

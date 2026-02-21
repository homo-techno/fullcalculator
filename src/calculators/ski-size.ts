import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const skiSizeCalculator: CalculatorDefinition = {
  slug: "ski-size-calculator",
  title: "Ski Size Calculator",
  description: "Free ski size calculator. Find the right ski length based on your height, weight, and ability level for alpine skiing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ski size calculator", "ski length calculator", "what size skis do I need", "ski size chart", "alpine ski sizing"],
  variants: [
    {
      id: "calc",
      name: "Calculate Ski Length",
      fields: [
        { name: "height", label: "Your Height", type: "number", placeholder: "e.g. 175", suffix: "cm" },
        { name: "weight", label: "Your Weight", type: "number", placeholder: "e.g. 75", suffix: "kg" },
        { name: "ability", label: "Ability Level", type: "select", options: [
          { label: "Beginner", value: "beginner" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Advanced / Expert", value: "advanced" },
        ], defaultValue: "intermediate" },
      ],
      calculate: (inputs) => {
        const height = inputs.height as number;
        const weight = inputs.weight as number;
        const ability = inputs.ability as string;
        if (!height || !weight) return null;

        let minLength: number;
        let maxLength: number;
        let abilityDesc: string;

        if (ability === "beginner") {
          minLength = height - 25;
          maxLength = height - 15;
          abilityDesc = "Beginner — shorter skis are easier to turn and control";
        } else if (ability === "intermediate") {
          minLength = height - 15;
          maxLength = height - 5;
          abilityDesc = "Intermediate — moderate length for balance of control and speed";
        } else {
          minLength = height - 5;
          maxLength = height + 5;
          abilityDesc = "Advanced — longer skis for speed and stability at high speeds";
        }

        // Weight adjustment: heavier riders go longer, lighter go shorter
        const bmi = weight / ((height / 100) * (height / 100));
        let weightAdj = 0;
        if (bmi < 20) weightAdj = -3;
        else if (bmi > 27) weightAdj = 3;

        minLength += weightAdj;
        maxLength += weightAdj;

        const recommended = Math.round((minLength + maxLength) / 2);

        return {
          primary: { label: "Recommended Ski Length", value: `${recommended} cm` },
          details: [
            { label: "Ski Length Range", value: `${Math.round(minLength)}–${Math.round(maxLength)} cm` },
            { label: "Ability Level", value: abilityDesc },
            { label: "Your Height", value: `${height} cm` },
            { label: "Your Weight", value: `${weight} kg` },
            { label: "Your BMI", value: formatNumber(bmi, 1) },
            { label: "Weight Adjustment", value: `${weightAdj >= 0 ? "+" : ""}${weightAdj} cm` },
          ],
          note: "Ski sizing is a guideline. Terrain preferences, ski width, and personal style also matter. Consult a ski shop for the best fit.",
        };
      },
    },
  ],
  relatedSlugs: ["snowboard-size-calculator", "bike-size-calculator", "helmet-size-calculator"],
  faq: [
    { question: "How do I choose ski length?", answer: "Beginners should choose skis about 15–25 cm shorter than their height. Intermediate skiers should subtract 5–15 cm. Advanced skiers use skis close to their height or slightly longer." },
    { question: "Does weight affect ski size?", answer: "Yes. Heavier skiers need longer, stiffer skis for proper support. Lighter skiers benefit from shorter, softer skis that flex more easily." },
    { question: "Should I size up or down?", answer: "Size down for more control, easier turns, and a forgiving ride (good for beginners). Size up for more stability at speed and better float in powder (good for advanced skiers)." },
  ],
  formula: "Beginner: height − 20cm (±5) | Intermediate: height − 10cm (±5) | Advanced: height (±5) | Adjusted for weight/BMI",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bodyRecompCalculator: CalculatorDefinition = {
  slug: "body-recomp-calculator",
  title: "Body Recomposition Calculator",
  description: "Free body recomposition calculator. Estimate optimal calorie and protein targets for simultaneously losing fat and gaining muscle.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["body recomposition", "recomp calculator", "lose fat gain muscle", "body recomp"],
  variants: [
    {
      id: "standard",
      name: "Standard",
      description: "Calculate recomp calorie targets",
      fields: [
        { name: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 80", min: 30, max: 300 },
        { name: "height", label: "Height (cm)", type: "number", placeholder: "e.g. 175", min: 100, max: 250 },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 28", min: 15, max: 80 },
        { name: "bodyFat", label: "Body Fat %", type: "number", placeholder: "e.g. 20", suffix: "%", min: 3, max: 60 },
        { name: "sex", label: "Sex", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
        { name: "activity", label: "Activity Level", type: "select", options: [{ label: "Sedentary", value: "1.2" }, { label: "Light (1-3 days/week)", value: "1.375" }, { label: "Moderate (3-5 days/week)", value: "1.55" }, { label: "Very active (6-7 days/week)", value: "1.725" }, { label: "Extra active (athlete)", value: "1.9" }] },
      ],
      calculate: (inputs) => {
        const w = inputs.weight as number, h = inputs.height as number;
        const age = inputs.age as number, bf = inputs.bodyFat as number;
        const sex = (inputs.sex as string) || "male";
        const af = parseFloat((inputs.activity as string) || "1.55");
        if (!w || !h || !age || !bf) return null;
        const bmr = sex === "male" ? 10 * w + 6.25 * h - 5 * age + 5 : 10 * w + 6.25 * h - 5 * age - 161;
        const tdee = bmr * af;
        const lbm = w * (1 - bf / 100);
        const trainCals = Math.round(tdee * 1.1);
        const restCals = Math.round(tdee * 0.85);
        const protein = Math.round(lbm * 2.2);
        const avg = Math.round((trainCals * 4 + restCals * 3) / 7);
        return { primary: { label: "Weekly Avg Calories", value: formatNumber(avg, 0) + " cal/day" }, details: [{ label: "Training day", value: formatNumber(trainCals, 0) + " cal" }, { label: "Rest day", value: formatNumber(restCals, 0) + " cal" }, { label: "TDEE", value: formatNumber(tdee, 0) + " cal/day" }, { label: "Lean body mass", value: formatNumber(lbm, 1) + " kg" }, { label: "Protein target", value: protein + " g/day" }] };
      },
    },
  ],
  relatedSlugs: ["tdee-calculator", "macro-calculator", "calorie-deficit-calculator"],
  faq: [{ question: "What is body recomposition?", answer: "Body recomposition is the process of simultaneously losing fat and gaining muscle by cycling calories around maintenance while maintaining high protein intake." }, { question: "Who benefits most from recomp?", answer: "Beginners, those returning from a training break, and people with higher body fat benefit most. Advanced lean lifters may find separate bulk/cut phases more efficient." }],
  formula: "Training day = TDEE x 1.1 | Rest day = TDEE x 0.85 | Protein = 2.2 g/kg LBM",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bulkingCalculator: CalculatorDefinition = {
  slug: "bulking-calculator",
  title: "Bulking Calorie Calculator",
  description: "Free bulking calorie calculator. Calculate your optimal caloric surplus, protein, carb, and fat targets for lean muscle gain.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bulking calculator", "calorie surplus", "muscle gain calories", "lean bulk", "bulking diet"],
  variants: [
    {
      id: "metric",
      name: "Metric (kg/cm)",
      description: "Calculate bulking targets using metric units",
      fields: [
        { name: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 75", min: 30, max: 300 },
        { name: "height", label: "Height (cm)", type: "number", placeholder: "e.g. 178", min: 100, max: 250 },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 25", min: 15, max: 80 },
        { name: "sex", label: "Sex", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
        { name: "activity", label: "Activity Level", type: "select", options: [{ label: "Sedentary", value: "1.2" }, { label: "Light (1-3 days/week)", value: "1.375" }, { label: "Moderate (3-5 days/week)", value: "1.55" }, { label: "Very active (6-7 days/week)", value: "1.725" }, { label: "Extra active (athlete)", value: "1.9" }] },
        { name: "bulkType", label: "Bulk Type", type: "select", options: [{ label: "Lean Bulk (+250 cal)", value: "250" }, { label: "Moderate Bulk (+400 cal)", value: "400" }, { label: "Aggressive Bulk (+500 cal)", value: "500" }] },
      ],
      calculate: (inputs) => {
        const w = inputs.weight as number, h = inputs.height as number;
        const age = inputs.age as number;
        const sex = (inputs.sex as string) || "male";
        const af = parseFloat((inputs.activity as string) || "1.55");
        const surplus = parseFloat((inputs.bulkType as string) || "250");
        if (!w || !h || !age) return null;
        const bmr = sex === "male" ? 10 * w + 6.25 * h - 5 * age + 5 : 10 * w + 6.25 * h - 5 * age - 161;
        const tdee = bmr * af;
        const bulkCals = Math.round(tdee + surplus);
        const proteinG = Math.round(w * 2.0);
        const fatG = Math.round((bulkCals * 0.25) / 9);
        const carbG = Math.round((bulkCals - proteinG * 4 - fatG * 9) / 4);
        return { primary: { label: "Bulking Calories", value: formatNumber(bulkCals, 0) + " cal/day" }, details: [{ label: "TDEE (maintenance)", value: formatNumber(tdee, 0) + " cal/day" }, { label: "Surplus", value: "+" + surplus + " cal/day" }, { label: "Protein", value: proteinG + " g/day" }, { label: "Fat", value: fatG + " g/day" }, { label: "Carbs", value: carbG + " g/day" }, { label: "Weekly weight gain", value: "~" + formatNumber(surplus * 7 / 7700, 2) + " kg" }] };
      },
    },
    {
      id: "imperial",
      name: "Imperial (lbs/in)",
      description: "Calculate bulking targets using imperial units",
      fields: [
        { name: "weight", label: "Weight (lbs)", type: "number", placeholder: "e.g. 165", min: 60, max: 600 },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 70", min: 40, max: 96 },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 25", min: 15, max: 80 },
        { name: "sex", label: "Sex", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
        { name: "activity", label: "Activity Level", type: "select", options: [{ label: "Sedentary", value: "1.2" }, { label: "Light (1-3 days/week)", value: "1.375" }, { label: "Moderate (3-5 days/week)", value: "1.55" }, { label: "Very active (6-7 days/week)", value: "1.725" }, { label: "Extra active (athlete)", value: "1.9" }] },
        { name: "bulkType", label: "Bulk Type", type: "select", options: [{ label: "Lean Bulk (+250 cal)", value: "250" }, { label: "Moderate Bulk (+400 cal)", value: "400" }, { label: "Aggressive Bulk (+500 cal)", value: "500" }] },
      ],
      calculate: (inputs) => {
        const wLbs = inputs.weight as number, hIn = inputs.height as number;
        const age = inputs.age as number;
        const sex = (inputs.sex as string) || "male";
        const af = parseFloat((inputs.activity as string) || "1.55");
        const surplus = parseFloat((inputs.bulkType as string) || "250");
        if (!wLbs || !hIn || !age) return null;
        const w = wLbs * 0.453592, h = hIn * 2.54;
        const bmr = sex === "male" ? 10 * w + 6.25 * h - 5 * age + 5 : 10 * w + 6.25 * h - 5 * age - 161;
        const tdee = bmr * af;
        const bulkCals = Math.round(tdee + surplus);
        const proteinG = Math.round(wLbs * 0.9);
        const fatG = Math.round((bulkCals * 0.25) / 9);
        const carbG = Math.round((bulkCals - proteinG * 4 - fatG * 9) / 4);
        return { primary: { label: "Bulking Calories", value: formatNumber(bulkCals, 0) + " cal/day" }, details: [{ label: "TDEE (maintenance)", value: formatNumber(tdee, 0) + " cal/day" }, { label: "Surplus", value: "+" + surplus + " cal/day" }, { label: "Protein", value: proteinG + " g/day" }, { label: "Fat", value: fatG + " g/day" }, { label: "Carbs", value: carbG + " g/day" }, { label: "Weekly weight gain", value: "~" + formatNumber(surplus * 7 / 3500, 2) + " lbs" }] };
      },
    },
  ],
  relatedSlugs: ["tdee-calculator", "macro-calculator", "protein-intake-calculator"],
  faq: [{ question: "What is a lean bulk?", answer: "A lean bulk is a controlled caloric surplus of about 200-300 calories above TDEE to maximize muscle gain while minimizing fat gain." }, { question: "How much weight should I gain per week?", answer: "Beginners: 0.25-0.5 kg/week. Intermediate: 0.1-0.25 kg/week. Gaining faster typically means excess fat gain." }, { question: "How much protein for bulking?", answer: "Aim for 1.6-2.2 g of protein per kg bodyweight (0.7-1 g per lb). Since you are in a surplus, the lower end is often sufficient." }],
  formula: "Bulking Calories = TDEE + Surplus (250-500 cal) | Protein = 2.0 g/kg",
};

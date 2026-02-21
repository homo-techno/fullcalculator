import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sodiumIntakeCalculator: CalculatorDefinition = {
  slug: "sodium-intake-calculator",
  title: "Sodium Intake Calculator",
  description:
    "Free sodium intake calculator. Check if your daily sodium consumption is within the recommended limit of 2,300mg. See your risk assessment and tips to reduce sodium.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "sodium intake calculator",
    "salt intake calculator",
    "daily sodium limit",
    "sodium calculator",
    "how much sodium per day",
  ],
  variants: [
    {
      id: "calc",
      name: "Check Sodium Intake",
      description: "Is your daily sodium intake within limits?",
      fields: [
        { name: "sodium", label: "Daily Sodium Intake", type: "number", placeholder: "e.g. 3400", suffix: "mg" },
      ],
      calculate: (inputs) => {
        const sodium = inputs.sodium as number;
        if (!sodium && sodium !== 0) return null;

        const limit = 2300;
        const idealLimit = 1500;
        const pctOfLimit = (sodium / limit) * 100;
        const excessMg = Math.max(0, sodium - limit);
        const saltEquiv = sodium / 400;

        let risk: string;
        if (sodium <= idealLimit) {
          risk = "Excellent! Your intake is at the ideal level for heart health.";
        } else if (sodium <= limit) {
          risk = "Acceptable. Within the general guideline of 2,300 mg/day, but above the ideal of 1,500 mg.";
        } else if (sodium <= 3400) {
          risk = "Over the limit. You are consuming more sodium than recommended. This is the average American intake.";
        } else {
          risk = "High risk. Significantly over the recommended limit. This increases risk of high blood pressure and heart disease.";
        }

        return {
          primary: { label: "Sodium Assessment", value: sodium <= limit ? "Within Limit" : "Over Limit" },
          details: [
            { label: "Your Intake", value: `${formatNumber(sodium, 0)} mg` },
            { label: "General Limit", value: `${formatNumber(limit, 0)} mg/day` },
            { label: "Ideal Limit (AHA)", value: `${formatNumber(idealLimit, 0)} mg/day` },
            { label: "% of Limit", value: `${formatNumber(pctOfLimit, 0)}%` },
            { label: "Excess", value: excessMg > 0 ? `${formatNumber(excessMg, 0)} mg over` : "None" },
            { label: "Salt Equivalent", value: `~${formatNumber(saltEquiv, 1)} tsp table salt` },
            { label: "Risk Assessment", value: risk },
          ],
          note: "About 70% of sodium in the American diet comes from processed and restaurant foods, not the salt shaker. Read nutrition labels and cook at home to reduce sodium.",
        };
      },
    },
  ],
  relatedSlugs: ["sugar-intake-calculator", "calorie-calculator", "blood-pressure-calculator"],
  faq: [
    {
      question: "How much sodium should I eat per day?",
      answer:
        "The general recommendation is less than 2,300 mg/day (about 1 teaspoon of salt). The American Heart Association recommends an ideal limit of 1,500 mg/day for most adults. The average American consumes about 3,400 mg/day.",
    },
    {
      question: "What are the dangers of too much sodium?",
      answer:
        "Excess sodium raises blood pressure, which increases the risk of heart disease, stroke, and kidney disease. It can also cause water retention, bloating, and calcium loss from bones. Reducing sodium is especially important for people with hypertension.",
    },
    {
      question: "How can I reduce my sodium intake?",
      answer:
        "Cook at home more often, read nutrition labels, choose low-sodium products, rinse canned foods, use herbs/spices instead of salt, limit processed meats and cheese, and ask for sauces on the side at restaurants. Potassium-rich foods (bananas, potatoes) can help counteract sodium.",
    },
  ],
  formula:
    "Recommended limit: < 2,300 mg/day | Ideal (AHA): < 1,500 mg/day | 1 tsp salt ≈ 2,300 mg sodium",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogBiteCompensationCalculator: CalculatorDefinition = {
  slug: "dog-bite-compensation-calculator",
  title: "Dog Bite Compensation Calculator",
  description: "Free dog bite injury compensation estimator. Calculate potential damages for medical treatment, scarring, and trauma.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dog bite compensation calculator", "dog bite settlement calculator", "animal bite claim estimator"],
  variants: [{
    id: "standard",
    name: "Dog Bite Compensation",
    description: "Free dog bite injury compensation estimator",
    fields: [
      { name: "medicalCosts", label: "Medical Treatment Costs", type: "number", prefix: "$", min: 0 },
      { name: "lostWages", label: "Lost Wages", type: "number", prefix: "$", min: 0, defaultValue: 0 },
      { name: "severity", label: "Injury Severity", type: "select", options: [{ label: "Minor (puncture, stitches) - 2x", value: "2" }, { label: "Moderate (surgery, scarring) - 3x", value: "3" }, { label: "Severe (disfigurement, nerve damage) - 5x", value: "5" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
      const medical = inputs.medicalCosts as number;
      const wages = (inputs.lostWages as number) || 0;
      const mult = parseFloat(inputs.severity as string);
      if (!medical || medical <= 0) return null;
      const economic = medical + wages;
      const pain = medical * mult;
      const total = economic + pain;
      return {
        primary: { label: "Estimated Compensation", value: "$" + formatNumber(total) },
        details: [
          { label: "Medical costs", value: "$" + formatNumber(medical) },
          { label: "Lost wages", value: "$" + formatNumber(wages) },
          { label: "Pain & suffering (" + mult + "x)", value: "$" + formatNumber(pain) },
        ],
        note: "Most states have strict liability for dog bites. Average dog bite claim in the US: ~$64,555 (2023). Consult a personal injury attorney.",
      };
    },
  }],
  relatedSlugs: ["personal-injury-calculator", "car-accident-settlement-calculator"],
  faq: [
    { question: "How much is a dog bite claim worth?", answer: "Depends on medical costs, scarring, and severity. Average US dog bite insurance claim: ~$64,555. Severe cases with surgery/disfigurement can exceed $200,000." },
    { question: "Is the dog owner liable?", answer: "Most states have strict liability — the owner is responsible regardless of prior behavior. Some states follow a \"one bite\" rule requiring prior knowledge of aggression." },
  ],
  formula: "Compensation = Medical + Wages + (Medical × Severity Multiplier)",
};

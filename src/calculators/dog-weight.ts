import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogWeightCalculator: CalculatorDefinition = {
  slug: "dog-weight-calculator",
  title: "Dog Weight Calculator",
  description:
    "Free dog weight calculator. Predict your puppy's adult weight based on current weight, age, and breed size. Works for small, medium, large, and giant breed dogs.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "dog weight calculator",
    "puppy weight calculator",
    "puppy adult weight predictor",
    "how big will my puppy get",
    "dog size calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Predict Adult Weight",
      description: "Estimate your puppy's adult weight",
      fields: [
        { name: "currentWeight", label: "Current Weight", type: "number", placeholder: "e.g. 10", suffix: "lbs" },
        { name: "ageWeeks", label: "Current Age", type: "number", placeholder: "e.g. 12", suffix: "weeks" },
        {
          name: "breedSize",
          label: "Breed Size",
          type: "select",
          options: [
            { label: "Toy (adult < 12 lbs)", value: "toy" },
            { label: "Small (adult 12-25 lbs)", value: "small" },
            { label: "Medium (adult 25-50 lbs)", value: "medium" },
            { label: "Large (adult 50-100 lbs)", value: "large" },
            { label: "Giant (adult 100+ lbs)", value: "giant" },
          ],
          defaultValue: "medium",
        },
      ],
      calculate: (inputs) => {
        const currentWeight = inputs.currentWeight as number;
        const ageWeeks = inputs.ageWeeks as number;
        const breedSize = inputs.breedSize as string;
        if (!currentWeight || !ageWeeks) return null;

        let adultWeight: number;
        let growthComplete: number;
        let maturityMonths: number;
        let method: string;

        if (breedSize === "toy" || breedSize === "small") {
          if (ageWeeks <= 12) {
            adultWeight = currentWeight * (52 / ageWeeks);
            method = "weight at age × (52 / age in weeks)";
          } else {
            adultWeight = currentWeight / (ageWeeks / 52);
            method = "projected from growth curve";
          }
          growthComplete = ageWeeks >= 40 ? 95 : (ageWeeks / 40) * 95;
          maturityMonths = 10;
        } else if (breedSize === "medium") {
          if (ageWeeks >= 14) {
            adultWeight = currentWeight * 2.5;
            method = "weight at 14+ weeks × 2.5";
          } else {
            adultWeight = currentWeight * (52 / ageWeeks);
            method = "weight at age × (52 / age in weeks)";
          }
          growthComplete = ageWeeks >= 52 ? 95 : (ageWeeks / 52) * 95;
          maturityMonths = 12;
        } else if (breedSize === "large") {
          if (ageWeeks >= 20) {
            adultWeight = currentWeight * 2.2;
            method = "weight at 20+ weeks × 2.2";
          } else {
            adultWeight = currentWeight * (72 / ageWeeks);
            method = "weight at age × (72 / age in weeks)";
          }
          growthComplete = ageWeeks >= 72 ? 95 : (ageWeeks / 72) * 95;
          maturityMonths = 16;
        } else {
          if (ageWeeks >= 20) {
            adultWeight = currentWeight * 2.5;
            method = "weight at 20+ weeks × 2.5";
          } else {
            adultWeight = currentWeight * (84 / ageWeeks);
            method = "weight at age × (84 / age in weeks)";
          }
          growthComplete = ageWeeks >= 84 ? 95 : (ageWeeks / 84) * 95;
          maturityMonths = 20;
        }

        const weightToGain = Math.max(0, adultWeight - currentWeight);

        return {
          primary: { label: "Predicted Adult Weight", value: `${formatNumber(adultWeight, 0)} lbs` },
          details: [
            { label: "Current Weight", value: `${formatNumber(currentWeight, 1)} lbs` },
            { label: "Age", value: `${ageWeeks} weeks (${formatNumber(ageWeeks / 4.33, 1)} months)` },
            { label: "Weight to Gain", value: `~${formatNumber(weightToGain, 0)} lbs` },
            { label: "Growth Complete", value: `~${formatNumber(Math.min(growthComplete, 100), 0)}%` },
            { label: "Full Maturity", value: `~${maturityMonths} months` },
            { label: "Method", value: method },
          ],
          note: "This is an estimate. Actual adult weight depends on genetics, nutrition, spay/neuter status, and individual variation. Predictions are more accurate after 14 weeks for small breeds and 20 weeks for large breeds.",
        };
      },
    },
  ],
  relatedSlugs: ["dog-years-calculator", "pet-food-calculator", "bmi-calculator"],
  faq: [
    {
      question: "How can I predict my puppy's adult weight?",
      answer:
        "The best methods depend on breed size. For small breeds, multiply the weight at 6 weeks by 4, or at 12 weeks by 2. For medium breeds, multiply weight at 14 weeks by 2.5. For large breeds, multiply weight at 20 weeks by 2.2. These are estimates with typical accuracy of plus or minus 10-20%.",
    },
    {
      question: "When do puppies stop growing?",
      answer:
        "Small breeds typically reach adult size by 10-12 months. Medium breeds by 12-14 months. Large breeds by 14-18 months. Giant breeds may not reach full size until 18-24 months. Growth plates close at different ages depending on breed size.",
    },
    {
      question: "Why is knowing my dog's adult weight important?",
      answer:
        "Knowing estimated adult size helps you choose the right food (puppy formulas differ by expected adult size), select appropriate crate and gear sizes, plan for exercise needs, and prepare your living space. It also helps your vet monitor healthy growth.",
    },
  ],
  formula:
    "Small breeds: adult ≈ weight(6wk) × 4 | Medium breeds: adult ≈ weight(14wk) × 2.5 | Large breeds: adult ≈ weight(20wk) × 2.2 | Giant breeds: adult ≈ weight(20wk) × 2.5",
};

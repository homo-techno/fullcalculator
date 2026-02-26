import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const puppyWeightCalculator: CalculatorDefinition = {
  slug: "puppy-weight-calculator",
  title: "Puppy Adult Weight Predictor",
  description:
    "Free online puppy weight calculator. Predict your puppy's adult weight based on current weight, age, and breed size to plan nutrition and supplies.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "puppy weight calculator",
    "puppy adult weight predictor",
    "how big will my puppy get",
    "puppy growth calculator",
    "dog weight estimator",
  ],
  variants: [
    {
      id: "predict",
      name: "Predict Adult Weight",
      description: "Estimate your puppy's adult weight",
      fields: [
        { name: "currentWeight", label: "Current Weight", type: "number", placeholder: "e.g. 15", suffix: "lbs" },
        { name: "ageWeeks", label: "Current Age (weeks)", type: "number", placeholder: "e.g. 16" },
        {
          name: "breedSize",
          label: "Expected Breed Size",
          type: "select",
          options: [
            { label: "Toy (under 10 lbs adult)", value: "toy" },
            { label: "Small (10-25 lbs adult)", value: "small" },
            { label: "Medium (25-50 lbs adult)", value: "medium" },
            { label: "Large (50-80 lbs adult)", value: "large" },
            { label: "Giant (80+ lbs adult)", value: "giant" },
          ],
          defaultValue: "medium",
        },
      ],
      calculate: (inputs) => {
        const currentWeight = parseFloat(inputs.currentWeight as string) || 0;
        const ageWeeks = parseFloat(inputs.ageWeeks as string) || 0;
        const breedSize = inputs.breedSize as string;
        if (!currentWeight || !ageWeeks) return null;

        // Growth completion percentages vary by breed size
        // Smaller breeds mature faster than larger breeds
        let maturityWeeks: number;
        let growthCurveExponent: number;
        switch (breedSize) {
          case "toy":
            maturityWeeks = 40;
            growthCurveExponent = 0.85;
            break;
          case "small":
            maturityWeeks = 48;
            growthCurveExponent = 0.80;
            break;
          case "medium":
            maturityWeeks = 60;
            growthCurveExponent = 0.75;
            break;
          case "large":
            maturityWeeks = 78;
            growthCurveExponent = 0.70;
            break;
          case "giant":
            maturityWeeks = 104;
            growthCurveExponent = 0.65;
            break;
          default:
            maturityWeeks = 60;
            growthCurveExponent = 0.75;
        }

        // Estimate growth completion percentage
        const growthPct = Math.min(Math.pow(ageWeeks / maturityWeeks, growthCurveExponent), 1.0);
        const predictedAdult = currentWeight / growthPct;
        const remainingGrowth = predictedAdult - currentWeight;
        const remainingWeeks = Math.max(maturityWeeks - ageWeeks, 0);

        // Weight ranges (approximate +/- 15%)
        const lowEstimate = predictedAdult * 0.85;
        const highEstimate = predictedAdult * 1.15;

        return {
          primary: { label: "Predicted Adult Weight", value: `${formatNumber(predictedAdult)} lbs` },
          details: [
            { label: "Weight range", value: `${formatNumber(lowEstimate)} - ${formatNumber(highEstimate)} lbs` },
            { label: "Current weight", value: `${formatNumber(currentWeight)} lbs` },
            { label: "Growth complete", value: `${formatNumber(growthPct * 100)}%` },
            { label: "Remaining growth", value: `${formatNumber(remainingGrowth)} lbs` },
            { label: "Weeks to maturity", value: formatNumber(remainingWeeks) },
            { label: "Predicted adult (kg)", value: `${formatNumber(predictedAdult * 0.4536)} kg` },
          ],
          note: ageWeeks < 8
            ? "Predictions are less accurate for very young puppies. Recheck at 12-16 weeks for a better estimate."
            : "Predictions improve as puppies grow. Genetics, nutrition, and health all affect final size.",
        };
      },
    },
  ],
  relatedSlugs: ["dog-food-calculator", "pet-insurance-calculator", "chocolate-toxicity-calculator"],
  faq: [
    {
      question: "How can I predict my puppy's adult weight?",
      answer:
        "The most common method divides the puppy's current weight by their estimated growth completion percentage. Growth rate varies by breed size: toy breeds reach adult weight by 9-10 months, while giant breeds may not fully mature until 18-24 months.",
    },
    {
      question: "At what age is a dog fully grown?",
      answer:
        "Toy and small breeds are usually fully grown by 9-12 months. Medium breeds reach full size around 12-15 months. Large breeds take 15-18 months, and giant breeds (Great Danes, Mastiffs) may continue growing until 18-24 months.",
    },
  ],
  formula: "Predicted Adult Weight = Current Weight / Growth Completion Percentage",
};

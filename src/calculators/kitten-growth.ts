import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kittenGrowthCalculator: CalculatorDefinition = {
  slug: "kitten-growth-calculator",
  title: "Kitten Growth Chart Calculator",
  description:
    "Free kitten growth calculator. Track your kitten's weight milestones and predict adult size based on current age, weight, and breed.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "kitten growth calculator",
    "kitten weight chart",
    "how big will my kitten get",
    "kitten growth milestones",
    "kitten weight by age",
  ],
  variants: [
    {
      id: "kittenGrowth",
      name: "Growth & Weight Prediction",
      fields: [
        {
          name: "currentWeight",
          label: "Current Weight (lbs)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0.1,
          max: 20,
          step: 0.1,
        },
        {
          name: "ageWeeks",
          label: "Current Age (weeks)",
          type: "number",
          placeholder: "e.g. 12",
          min: 1,
          max: 78,
        },
        {
          name: "breed",
          label: "Breed Size",
          type: "select",
          options: [
            { label: "Small (Singapura, Munchkin) - 4-8 lbs adult", value: "small" },
            { label: "Medium (Domestic Shorthair, Siamese) - 8-12 lbs adult", value: "medium" },
            { label: "Large (Maine Coon, Ragdoll) - 12-20+ lbs adult", value: "large" },
          ],
        },
      ],
      calculate: (inputs) => {
        const currentWeight = inputs.currentWeight as number;
        const ageWeeks = inputs.ageWeeks as number;
        const breed = (inputs.breed as string) || "medium";
        if (!currentWeight || !ageWeeks || currentWeight <= 0 || ageWeeks < 1) return null;

        // Kitten growth percentages by week (average domestic cat)
        // Most cats reach adult weight by 12-18 months (52-78 weeks)
        const maturityWeeks: Record<string, number> = { small: 52, medium: 65, large: 78 };
        const adultWeights: Record<string, { min: number; max: number }> = {
          small: { min: 4, max: 8 },
          medium: { min: 8, max: 12 },
          large: { min: 12, max: 20 },
        };

        // Growth completion curve
        const matWeeks = maturityWeeks[breed] || 65;
        let growthPercent: number;
        if (ageWeeks <= 8) {
          growthPercent = (ageWeeks / matWeeks) * 0.3; // rapid early growth
        } else if (ageWeeks <= 26) {
          growthPercent = 0.3 * (8 / matWeeks) + ((ageWeeks - 8) / (matWeeks - 8)) * 0.45;
        } else {
          growthPercent = Math.min(1, 0.3 * (8 / matWeeks) + 0.45 + ((ageWeeks - 26) / (matWeeks - 26)) * 0.25);
        }
        growthPercent = Math.min(1, growthPercent);

        const predictedAdult = growthPercent > 0.05 ? currentWeight / growthPercent : currentWeight * 4;
        const predictedKg = predictedAdult * 0.453592;
        const remaining = Math.max(0, predictedAdult - currentWeight);
        const range = adultWeights[breed] || adultWeights.medium;

        // Weight milestones (typical domestic cat)
        const milestones = [
          { age: "Birth", weight: "3-4 oz" },
          { age: "1 week", weight: "5-8 oz" },
          { age: "4 weeks", weight: "0.75-1 lb" },
          { age: "8 weeks", weight: "1.5-2 lbs" },
          { age: "12 weeks", weight: "2.5-4 lbs" },
          { age: "6 months", weight: "5-7 lbs" },
          { age: "12 months", weight: "8-12 lbs" },
        ];

        // Find closest milestone
        let currentMilestone = "Beyond standard milestones";
        if (ageWeeks <= 1) currentMilestone = "Neonatal (eyes closed, nursing)";
        else if (ageWeeks <= 4) currentMilestone = "Early development (eyes open, starting to walk)";
        else if (ageWeeks <= 8) currentMilestone = "Socialization period (weaning, litter training)";
        else if (ageWeeks <= 16) currentMilestone = "Active growth (ready for adoption at 8-12 weeks)";
        else if (ageWeeks <= 26) currentMilestone = "Adolescent (spay/neuter recommended)";
        else if (ageWeeks <= 52) currentMilestone = "Junior (approaching adult size)";
        else currentMilestone = "Adult (growth slowing/complete)";

        return {
          primary: {
            label: "Predicted Adult Weight",
            value: formatNumber(predictedAdult, 1) + " lbs",
          },
          details: [
            { label: "Adult Weight (kg)", value: formatNumber(predictedKg, 1) + " kg" },
            { label: "Growth Progress", value: formatNumber(growthPercent * 100, 0) + "% of adult weight" },
            { label: "Remaining Growth", value: formatNumber(remaining, 1) + " lbs" },
            { label: "Breed Range (adult)", value: range.min + " - " + range.max + " lbs" },
            { label: "Maturity Age", value: formatNumber(matWeeks / 4.3, 0) + " months" },
            { label: "Current Stage", value: currentMilestone },
            {
              label: "Feeding",
              value: ageWeeks < 8
                ? "Kitten formula or nursing"
                : ageWeeks < 52
                ? "Kitten food, 3-4 meals/day"
                : "Transition to adult food, 2 meals/day",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cat-age-calculator", "cat-calorie-calculator", "cat-food-amount-calculator"],
  faq: [
    {
      question: "How fast do kittens grow?",
      answer:
        "Kittens gain about 1 pound per month for the first 6 months. A healthy kitten typically weighs about 3-4 oz at birth, 1.5-2 lbs at 8 weeks, and 5-7 lbs at 6 months. Most domestic cats reach adult size between 12-18 months, while large breeds like Maine Coons may grow until 3-4 years.",
    },
    {
      question: "How big will my kitten get?",
      answer:
        "A domestic shorthair typically reaches 8-12 lbs. You can estimate adult weight by doubling the weight at 16 weeks, or multiplying the weight at 8 weeks by 3-4. Large breed kittens (Maine Coon, Ragdoll) can reach 15-25 lbs. Genetics, nutrition, and spay/neuter status all influence final size.",
    },
    {
      question: "When should I switch from kitten to adult food?",
      answer:
        "Most cats should transition to adult food at 12 months of age. Large breeds (Maine Coon, Norwegian Forest Cat) benefit from staying on kitten food until 18-24 months due to their prolonged growth period. Transition gradually over 7-10 days by mixing increasing amounts of adult food.",
    },
  ],
  formula:
    "Predicted adult weight = current weight / growth completion %. Typical growth: 1 lb/month for first 6 months. Adult weight at 12-18 months. Small breeds: 4-8 lbs, Medium: 8-12 lbs, Large: 12-20+ lbs.",
};

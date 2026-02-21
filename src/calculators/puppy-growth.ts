import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const puppyGrowthCalculator: CalculatorDefinition = {
  slug: "puppy-growth-calculator",
  title: "Puppy Growth Chart Calculator",
  description:
    "Free puppy growth calculator. Predict your puppy's adult weight and track growth milestones based on current age, weight, and breed size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "puppy growth calculator",
    "puppy weight calculator",
    "how big will my puppy get",
    "puppy growth chart",
    "puppy adult weight predictor",
  ],
  variants: [
    {
      id: "predictAdult",
      name: "Predict Adult Weight",
      fields: [
        {
          name: "currentWeight",
          label: "Current Weight (lbs)",
          type: "number",
          placeholder: "e.g. 15",
          min: 0.5,
          max: 100,
          step: 0.5,
        },
        {
          name: "ageWeeks",
          label: "Current Age (weeks)",
          type: "number",
          placeholder: "e.g. 16",
          min: 4,
          max: 78,
        },
        {
          name: "breedSize",
          label: "Expected Breed Size",
          type: "select",
          options: [
            { label: "Toy (adult under 12 lbs)", value: "toy" },
            { label: "Small (adult 12-25 lbs)", value: "small" },
            { label: "Medium (adult 25-50 lbs)", value: "medium" },
            { label: "Large (adult 50-100 lbs)", value: "large" },
            { label: "Giant (adult 100+ lbs)", value: "giant" },
          ],
        },
      ],
      calculate: (inputs) => {
        const currentWeight = inputs.currentWeight as number;
        const ageWeeks = inputs.ageWeeks as number;
        const breedSize = (inputs.breedSize as string) || "medium";
        if (!currentWeight || !ageWeeks || currentWeight <= 0 || ageWeeks < 4) return null;

        // Growth completion percentage by age and breed size
        // Toy/Small breeds mature faster, Giant breeds slower
        const growthCurves: Record<string, { maturityWeeks: number; getPercent: (weeks: number) => number }> = {
          toy: {
            maturityWeeks: 40,
            getPercent: (w) => Math.min(1, w < 12 ? w / 40 * 0.5 : 0.5 + ((w - 12) / 28) * 0.5),
          },
          small: {
            maturityWeeks: 48,
            getPercent: (w) => Math.min(1, w < 14 ? w / 48 * 0.45 : 0.45 + ((w - 14) / 34) * 0.55),
          },
          medium: {
            maturityWeeks: 60,
            getPercent: (w) => Math.min(1, w < 16 ? w / 60 * 0.4 : 0.4 + ((w - 16) / 44) * 0.6),
          },
          large: {
            maturityWeeks: 72,
            getPercent: (w) => Math.min(1, w < 20 ? w / 72 * 0.35 : 0.35 + ((w - 20) / 52) * 0.65),
          },
          giant: {
            maturityWeeks: 90,
            getPercent: (w) => Math.min(1, w < 24 ? w / 90 * 0.3 : 0.3 + ((w - 24) / 66) * 0.7),
          },
        };

        const curve = growthCurves[breedSize] || growthCurves.medium;
        const currentPercent = curve.getPercent(ageWeeks);
        const predictedAdultWeight = currentPercent > 0 ? currentWeight / currentPercent : currentWeight * 3;
        const predictedAdultKg = predictedAdultWeight * 0.453592;

        const remainingGrowth = predictedAdultWeight - currentWeight;
        const weeksToMaturity = Math.max(0, curve.maturityWeeks - ageWeeks);

        // Growth phase
        let phase = "";
        if (ageWeeks <= 12) phase = "Rapid Growth (neonatal/socialization)";
        else if (ageWeeks <= 26) phase = "Steady Growth";
        else if (currentPercent < 0.95) phase = "Slowing Growth";
        else phase = "Near Adult Size";

        // Milestones
        const halfWeightWeek = breedSize === "toy" ? 10 : breedSize === "small" ? 12 : breedSize === "medium" ? 16 : breedSize === "large" ? 20 : 24;

        return {
          primary: {
            label: "Predicted Adult Weight",
            value: formatNumber(predictedAdultWeight, 1) + " lbs",
          },
          details: [
            { label: "Adult Weight (kg)", value: formatNumber(predictedAdultKg, 1) + " kg" },
            { label: "Current Growth", value: formatNumber(currentPercent * 100, 0) + "% of adult weight" },
            { label: "Remaining Growth", value: formatNumber(remainingGrowth, 1) + " lbs to gain" },
            { label: "Growth Phase", value: phase },
            { label: "Est. Maturity Age", value: formatNumber(curve.maturityWeeks / 4.3, 0) + " months" },
            { label: "Weeks to Full Size", value: formatNumber(weeksToMaturity, 0) + " weeks" },
            { label: "50% Weight Milestone", value: "~" + halfWeightWeek + " weeks old" },
            {
              label: "Note",
              value: "Predictions are estimates. Mixed breeds and individual variation can affect final size.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dog-years-calculator", "dog-weight-calculator", "dog-calorie-calculator"],
  faq: [
    {
      question: "How can I predict my puppy's adult weight?",
      answer:
        "The most common method is to divide your puppy's current weight by their growth completion percentage for their age and breed size. For example, a medium-breed puppy at 16 weeks is typically about 40% of adult weight. A 20-lb puppy at 16 weeks might grow to about 50 lbs. Paw size, parent weight, and breed standards also provide clues.",
    },
    {
      question: "When do puppies stop growing?",
      answer:
        "Small and toy breeds typically reach adult size by 9-10 months. Medium breeds finish growing around 12-14 months. Large breeds may grow until 14-18 months, and giant breeds (Great Dane, Mastiff) can continue growing until 18-24 months. Height is usually reached before full weight/muscle.",
    },
    {
      question: "Is my puppy growing at a normal rate?",
      answer:
        "Puppies generally double their birth weight by 1 week, and reach half their adult weight between 10-24 weeks depending on breed size. If your puppy is significantly above or below the expected growth curve, consult your veterinarian. Rapid growth in large breeds can lead to orthopedic problems.",
    },
  ],
  formula:
    "Predicted adult weight = current weight / growth completion percentage. Growth completion varies by breed size and age. Toy: mature ~40 weeks. Small: ~48 weeks. Medium: ~60 weeks. Large: ~72 weeks. Giant: ~90 weeks.",
};

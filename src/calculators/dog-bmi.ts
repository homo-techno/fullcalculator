import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogBmiCalculator: CalculatorDefinition = {
  slug: "dog-bmi-calculator",
  title: "Dog BMI & Body Condition Calculator",
  description:
    "Free dog BMI calculator. Assess your dog's body condition score, ideal weight range, and weight management plan based on breed and measurements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog bmi calculator",
    "dog body condition score",
    "is my dog overweight",
    "dog ideal weight",
    "dog weight chart",
  ],
  variants: [
    {
      id: "dogBCS",
      name: "Body Condition Score",
      description: "Assess your dog's body condition on a 1-9 scale",
      fields: [
        {
          name: "currentWeight",
          label: "Current Weight (lbs)",
          type: "number",
          placeholder: "e.g. 65",
          min: 1,
          max: 250,
          step: 0.5,
        },
        {
          name: "breedSize",
          label: "Breed Size Category",
          type: "select",
          options: [
            { label: "Toy (Chihuahua, Yorkie) - 2-6 lbs ideal", value: "toy" },
            { label: "Small (Beagle, Pug) - 10-25 lbs ideal", value: "small" },
            { label: "Medium (Border Collie, Bulldog) - 30-50 lbs ideal", value: "medium" },
            { label: "Large (Lab, Golden, GSD) - 55-80 lbs ideal", value: "large" },
            { label: "Giant (Great Dane, Mastiff) - 100-180 lbs ideal", value: "giant" },
          ],
        },
        {
          name: "ribsFeel",
          label: "Can you feel the ribs?",
          type: "select",
          options: [
            { label: "Ribs clearly visible, very prominent", value: "1" },
            { label: "Ribs easily felt with slight fat cover", value: "2" },
            { label: "Ribs felt with slight pressure, not visible", value: "3" },
            { label: "Ribs hard to feel, significant fat layer", value: "4" },
            { label: "Cannot feel ribs at all", value: "5" },
          ],
        },
        {
          name: "waistVisible",
          label: "Waist visible from above?",
          type: "select",
          options: [
            { label: "Very pronounced waist and abdominal tuck", value: "1" },
            { label: "Clear waist visible from above", value: "2" },
            { label: "Slight waist visible", value: "3" },
            { label: "No waist, barrel-shaped", value: "4" },
            { label: "Widest at abdomen, sagging fat", value: "5" },
          ],
        },
      ],
      calculate: (inputs) => {
        const currentWeight = inputs.currentWeight as number;
        const breedSize = (inputs.breedSize as string) || "medium";
        const ribsFeel = parseInt((inputs.ribsFeel as string) || "3");
        const waistVisible = parseInt((inputs.waistVisible as string) || "3");
        if (!currentWeight || currentWeight <= 0) return null;

        // Calculate BCS (1-9 scale) from rib and waist assessment
        // Score maps: 1=emaciated, 2-3=underweight, 4-5=ideal, 6-7=overweight, 8-9=obese
        const avgScore = (ribsFeel + waistVisible) / 2;
        let bcs: number;
        if (avgScore <= 1.25) bcs = 1;
        else if (avgScore <= 1.75) bcs = 2;
        else if (avgScore <= 2.25) bcs = 3;
        else if (avgScore <= 2.75) bcs = 4;
        else if (avgScore <= 3.25) bcs = 5;
        else if (avgScore <= 3.75) bcs = 6;
        else if (avgScore <= 4.25) bcs = 7;
        else if (avgScore <= 4.75) bcs = 8;
        else bcs = 9;

        // Each BCS point above 5 = ~10% overweight, below 5 = ~10% underweight
        const deviation = (bcs - 5) * 10; // percentage over/under
        const idealWeight = currentWeight / (1 + deviation / 100);
        const weightDiff = currentWeight - idealWeight;

        let condition = "";
        let recommendation = "";
        if (bcs <= 2) {
          condition = "Underweight";
          recommendation = "Consult vet immediately. Increase calories by 20-30%. Rule out illness.";
        } else if (bcs <= 3) {
          condition = "Slightly Underweight";
          recommendation = "Gradually increase food by 10-15% over 2-4 weeks.";
        } else if (bcs <= 5) {
          condition = "Ideal Weight";
          recommendation = "Maintain current diet and exercise routine.";
        } else if (bcs <= 6) {
          condition = "Slightly Overweight";
          recommendation = "Reduce food by 10-15%. Increase exercise. Eliminate high-calorie treats.";
        } else if (bcs <= 7) {
          condition = "Overweight";
          recommendation = "Reduce calories by 20%. Structured weight loss with vet guidance.";
        } else {
          condition = "Obese";
          recommendation = "Veterinary weight loss plan needed. Reduce calories by 25-30% under vet supervision.";
        }

        // Ideal weight ranges by breed size
        const idealRanges: Record<string, string> = {
          toy: "2-6 lbs",
          small: "10-25 lbs",
          medium: "30-50 lbs",
          large: "55-80 lbs",
          giant: "100-180 lbs",
        };

        // Health risks
        const healthRisks =
          bcs >= 7
            ? "Increased risk: joint disease, diabetes, heart disease, cancer, reduced lifespan (up to 2 years shorter)."
            : bcs <= 2
            ? "Risks: muscle wasting, weakened immune system, organ damage."
            : "Low weight-related health risk at this condition.";

        return {
          primary: {
            label: "Body Condition Score",
            value: bcs + "/9 - " + condition,
          },
          details: [
            { label: "Current Weight", value: formatNumber(currentWeight, 1) + " lbs" },
            { label: "Estimated Ideal Weight", value: formatNumber(idealWeight, 1) + " lbs" },
            {
              label: "Weight Difference",
              value:
                weightDiff > 0
                  ? formatNumber(weightDiff, 1) + " lbs over ideal"
                  : weightDiff < 0
                  ? formatNumber(Math.abs(weightDiff), 1) + " lbs under ideal"
                  : "At ideal weight",
            },
            { label: "Breed Size Range", value: idealRanges[breedSize] || "Varies" },
            { label: "Recommendation", value: recommendation },
            { label: "Health Risks", value: healthRisks },
            {
              label: "Target Calories",
              value: bcs > 5
                ? formatNumber(70 * Math.pow(idealWeight * 0.453592, 0.75) * 1.2, 0) + " kcal/day for weight loss"
                : formatNumber(70 * Math.pow(currentWeight * 0.453592, 0.75) * 1.6, 0) + " kcal/day maintenance",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dog-calorie-calculator", "dog-weight-calculator", "dog-food-amount-calculator"],
  faq: [
    {
      question: "What is a dog body condition score?",
      answer:
        "Body Condition Score (BCS) is a 1-9 scale used by veterinarians to assess a dog's fat and muscle. Scores 1-3 indicate underweight, 4-5 is ideal, 6-7 is overweight, and 8-9 is obese. It's assessed by feeling the ribs, looking at the waist from above, and checking the abdominal tuck from the side.",
    },
    {
      question: "How do I know if my dog is overweight?",
      answer:
        "An ideal-weight dog has ribs you can feel with slight pressure but not see, a visible waist when viewed from above, and an abdominal tuck when viewed from the side. If you can't easily feel the ribs, there's no waist, or the belly sags, your dog is likely overweight. Over 50% of dogs in the US are overweight or obese.",
    },
    {
      question: "How can I help my dog lose weight?",
      answer:
        "Consult your vet first. Generally, reduce daily calories by 15-25%, measure food precisely (don't estimate), limit treats to less than 10% of calories, switch to low-calorie treats (carrots, green beans), increase exercise gradually, and weigh your dog every 2 weeks. Aim for 1-2% body weight loss per week.",
    },
  ],
  formula:
    "BCS on 1-9 scale: assessed from rib palpation and waist visibility. Each BCS point above 5 ≈ 10% overweight. Ideal weight = current weight / (1 + (BCS - 5) x 10%). Weight loss calories = RER x 1.0-1.2 (using ideal weight).",
};

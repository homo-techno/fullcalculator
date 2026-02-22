import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogWalkingCalorieCalculator: CalculatorDefinition = {
  slug: "dog-walking-calorie-calculator",
  title: "Dog Walking Calorie Burn Calculator",
  description:
    "Free dog walking calorie burn calculator. Estimate calories burned by both you and your dog during walks based on duration, pace, and body weights.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog walking calorie burn",
    "calories burned walking dog",
    "dog walk exercise calculator",
    "how many calories walking dog",
    "dog walk fitness",
  ],
  variants: [
    {
      id: "walkingCalories",
      name: "Walking Calorie Burn",
      fields: [
        {
          name: "humanWeight",
          label: "Your Weight (lbs)",
          type: "number",
          placeholder: "e.g. 160",
          min: 50,
          max: 400,
          step: 1,
        },
        {
          name: "dogWeight",
          label: "Dog's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
          max: 250,
          step: 1,
        },
        {
          name: "durationMin",
          label: "Walk Duration (minutes)",
          type: "number",
          placeholder: "e.g. 30",
          min: 5,
          max: 240,
          step: 5,
        },
        {
          name: "pace",
          label: "Walking Pace",
          type: "select",
          options: [
            { label: "Leisurely (2 mph / sniffing stroll)", value: "leisurely" },
            { label: "Moderate (3 mph / brisk walk)", value: "moderate" },
            { label: "Fast (4 mph / power walk)", value: "fast" },
            { label: "Jogging (5 mph)", value: "jog" },
          ],
        },
        {
          name: "terrain",
          label: "Terrain",
          type: "select",
          options: [
            { label: "Flat / Pavement", value: "flat" },
            { label: "Mixed / Grass", value: "mixed" },
            { label: "Hilly / Trail", value: "hilly" },
          ],
        },
      ],
      calculate: (inputs) => {
        const humanWeight = inputs.humanWeight as number;
        const dogWeight = inputs.dogWeight as number;
        const durationMin = inputs.durationMin as number;
        const pace = (inputs.pace as string) || "moderate";
        const terrain = (inputs.terrain as string) || "flat";
        if (!humanWeight || !dogWeight || !durationMin) return null;

        // MET values for human walking
        const humanMets: Record<string, number> = {
          leisurely: 2.5,
          moderate: 3.5,
          fast: 4.5,
          jog: 7.0,
        };

        // Terrain multiplier
        const terrainMult: Record<string, number> = {
          flat: 1.0,
          mixed: 1.15,
          hilly: 1.35,
        };

        // Human calories: (MET x 3.5 x weight_kg / 200) x minutes
        const humanWeightKg = humanWeight * 0.453592;
        const humanCals = ((humanMets[pace] * 3.5 * humanWeightKg) / 200) * durationMin * terrainMult[terrain];

        // Dog calories: roughly 0.8 kcal per lb per mile; dogs cover ~1.5-2x distance
        const speedMph: Record<string, number> = {
          leisurely: 2.0,
          moderate: 3.0,
          fast: 4.0,
          jog: 5.0,
        };
        const humanMiles = (speedMph[pace] * durationMin) / 60;
        const dogMiles = humanMiles * 1.5; // dogs zig-zag and cover more ground
        const dogCalsPerMile = 0.8 * dogWeight;
        const dogCals = dogCalsPerMile * dogMiles * terrainMult[terrain];

        return {
          primary: {
            label: "Your Calories Burned",
            value: formatNumber(humanCals, 0) + " kcal",
          },
          details: [
            { label: "Dog's Calories Burned", value: formatNumber(dogCals, 0) + " kcal" },
            { label: "Walk Duration", value: formatNumber(durationMin, 0) + " minutes" },
            { label: "Your Distance", value: formatNumber(humanMiles, 1) + " miles" },
            { label: "Dog's Est. Distance", value: formatNumber(dogMiles, 1) + " miles (they cover ~1.5x more)" },
            { label: "Your Weight", value: formatNumber(humanWeight, 0) + " lbs" },
            { label: "Dog's Weight", value: formatNumber(dogWeight, 0) + " lbs" },
            {
              label: "Weekly Impact (daily walks)",
              value: "You: ~" + formatNumber(humanCals * 7, 0) + " kcal/week | Dog: ~" + formatNumber(dogCals * 7, 0) + " kcal/week",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dog-calorie-calculator", "dog-exercise-needs-calculator", "walking-calorie-calculator"],
  faq: [
    {
      question: "How many calories do you burn walking a dog?",
      answer:
        "A 160-lb person burns approximately 200-300 calories per hour walking a dog at a moderate pace. Walking a dog tends to burn slightly more than solo walking because of the stop-and-go nature, pulling, and varied pace changes that increase overall effort.",
    },
    {
      question: "How many calories does a dog burn on a walk?",
      answer:
        "Dogs burn roughly 0.8 calories per pound per mile walked. A 50-lb dog walking 2 miles burns about 80 calories. However, dogs typically cover 1.5-2x more distance than their owners due to zig-zagging and exploring, so actual burn is higher.",
    },
    {
      question: "How long should I walk my dog each day?",
      answer:
        "Most dogs need at least 30 minutes to 2 hours of walking per day, depending on breed, age, and health. High-energy breeds may need 1-2 hours, while senior or small dogs may be content with 20-30 minutes. Always watch for signs of fatigue or overheating.",
    },
  ],
  formula:
    "Human Calories = (MET x 3.5 x weight_kg / 200) x minutes x terrain factor. MET values: leisurely 2.5, moderate 3.5, fast 4.5, jog 7.0. Terrain: flat 1.0, mixed 1.15, hilly 1.35. Dog Calories = 0.8 kcal/lb/mile x estimated dog distance. Dog distance ~ 1.5x human distance.",
};

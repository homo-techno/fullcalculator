import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogRawFoodCalculator: CalculatorDefinition = {
  slug: "dog-raw-food-calculator",
  title: "Dog Raw Food Diet Calculator",
  description:
    "Free dog raw food diet calculator. Calculate the correct daily raw food portions for your dog based on weight, age, activity level, and body condition.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog raw food calculator",
    "raw diet for dogs",
    "BARF diet calculator",
    "raw feeding guide dogs",
    "how much raw food for dog",
  ],
  variants: [
    {
      id: "rawFoodAmount",
      name: "Daily Raw Food Amount",
      fields: [
        {
          name: "weight",
          label: "Dog's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
          max: 250,
          step: 1,
        },
        {
          name: "lifeStage",
          label: "Life Stage",
          type: "select",
          options: [
            { label: "Puppy (2-6 months)", value: "puppy_young" },
            { label: "Puppy (6-12 months)", value: "puppy_older" },
            { label: "Adult (1-7 years)", value: "adult" },
            { label: "Senior (7+ years)", value: "senior" },
          ],
        },
        {
          name: "activity",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Low (couch potato)", value: "low" },
            { label: "Moderate (daily walks)", value: "moderate" },
            { label: "High (active / sporting)", value: "high" },
            { label: "Working Dog", value: "working" },
          ],
        },
        {
          name: "goal",
          label: "Weight Goal",
          type: "select",
          options: [
            { label: "Maintain Weight", value: "maintain" },
            { label: "Lose Weight", value: "lose" },
            { label: "Gain Weight", value: "gain" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const lifeStage = (inputs.lifeStage as string) || "adult";
        const activity = (inputs.activity as string) || "moderate";
        const goal = (inputs.goal as string) || "maintain";
        if (!weight || weight <= 0) return null;

        // Base percentage of body weight per day
        const basePercent: Record<string, number> = {
          puppy_young: 8,
          puppy_older: 6,
          adult: 2.5,
          senior: 2.0,
        };

        // Activity adjustment
        const activityMult: Record<string, number> = {
          low: 0.85,
          moderate: 1.0,
          high: 1.2,
          working: 1.4,
        };

        // Goal adjustment
        const goalMult: Record<string, number> = {
          maintain: 1.0,
          lose: 0.85,
          gain: 1.15,
        };

        const percent = basePercent[lifeStage] * activityMult[activity] * goalMult[goal];
        const dailyOz = (weight * 16 * percent) / 100;
        const dailyLbs = dailyOz / 16;
        const dailyGrams = dailyLbs * 453.592;

        // BARF model breakdown (80/10/10 simplified)
        const muscleOz = dailyOz * 0.80;
        const boneOz = dailyOz * 0.10;
        const organOz = dailyOz * 0.10;

        return {
          primary: {
            label: "Daily Raw Food",
            value: formatNumber(dailyOz, 1) + " oz",
          },
          details: [
            { label: "Daily Amount (lbs)", value: formatNumber(dailyLbs, 2) + " lbs" },
            { label: "Daily Amount (grams)", value: formatNumber(dailyGrams, 0) + " g" },
            { label: "% of Body Weight", value: formatNumber(percent, 1) + "%" },
            { label: "Muscle Meat (80%)", value: formatNumber(muscleOz, 1) + " oz" },
            { label: "Raw Bone (10%)", value: formatNumber(boneOz, 1) + " oz" },
            { label: "Organ Meat (10%)", value: formatNumber(organOz, 1) + " oz" },
            { label: "Meals Per Day", value: lifeStage.startsWith("puppy") ? "3-4" : "2" },
            {
              label: "Note",
              value: "Consult a veterinary nutritionist to ensure a balanced raw diet. Add supplements as recommended.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dog-food-amount-calculator", "dog-calorie-calculator", "dog-water-intake-calculator"],
  faq: [
    {
      question: "How much raw food should I feed my dog?",
      answer:
        "Adult dogs typically need 2-3% of their body weight in raw food per day. Puppies need 5-8% depending on age. Active dogs and working dogs may need up to 3.5-4%. Always adjust based on your dog's body condition over time.",
    },
    {
      question: "What is the 80/10/10 raw feeding ratio?",
      answer:
        "The 80/10/10 ratio is a common guideline for raw feeding: 80% muscle meat (including fat), 10% raw meaty bones (for calcium), and 10% organ meat (with half being liver). Some models also add vegetables and fruit at 5-10%.",
    },
    {
      question: "Is a raw food diet safe for dogs?",
      answer:
        "Raw feeding is controversial. Proponents cite benefits like shinier coats and better digestion. Critics and many veterinary organizations warn about bacterial contamination, nutritional imbalances, and bone hazards. If you choose raw feeding, work with a veterinary nutritionist to ensure complete and balanced nutrition.",
    },
  ],
  formula:
    "Daily Raw Food (oz) = (Dog Weight x 16 oz x feeding percentage) / 100. Feeding % based on life stage: puppy young 8%, puppy older 6%, adult 2.5%, senior 2.0%. Adjusted by activity (low 0.85, moderate 1.0, high 1.2, working 1.4) and weight goal (lose 0.85, maintain 1.0, gain 1.15). 80/10/10 split: 80% muscle meat, 10% bone, 10% organ.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petCalorieBurnCalculator: CalculatorDefinition = {
  slug: "pet-calorie-burn-calculator",
  title: "Pet Calorie Burn Calculator",
  description:
    "Free pet calorie burn calculator. Estimate how many calories your dog or cat burns during various activities like walking, running, playing, and swimming.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pet calorie burn",
    "dog calorie calculator",
    "cat calories burned",
    "pet exercise calories",
    "dog activity calories",
  ],
  variants: [
    {
      id: "calorie-burn",
      name: "Pet Calorie Burn",
      description: "Estimate calories burned during pet activities",
      fields: [
        {
          name: "petType",
          label: "Pet Type",
          type: "select",
          options: [
            { label: "Dog", value: "dog" },
            { label: "Cat", value: "cat" },
          ],
          defaultValue: "dog",
        },
        {
          name: "petWeight",
          label: "Pet Weight",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "lbs",
          min: 3,
          max: 200,
        },
        {
          name: "activity",
          label: "Activity Type",
          type: "select",
          options: [
            { label: "Walking (leisurely)", value: "walk" },
            { label: "Brisk Walking / Trotting", value: "brisk" },
            { label: "Running / Sprinting", value: "run" },
            { label: "Playing (fetch, chase)", value: "play" },
            { label: "Swimming", value: "swim" },
            { label: "Resting / Sleeping", value: "rest" },
          ],
          defaultValue: "walk",
        },
        {
          name: "duration",
          label: "Duration",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "minutes",
          min: 5,
          max: 240,
        },
      ],
      calculate: (inputs) => {
        const petType = inputs.petType as string;
        const petWeight = inputs.petWeight as number;
        const activity = inputs.activity as string;
        const duration = inputs.duration as number;
        if (!petWeight || !duration) return null;

        const weightKg = petWeight * 0.4536;

        // MET-like values for pet activities (calories per kg per hour)
        let metValue: number;
        if (petType === "dog") {
          switch (activity) {
            case "walk": metValue = 3.5; break;
            case "brisk": metValue = 5.5; break;
            case "run": metValue = 10; break;
            case "play": metValue = 7; break;
            case "swim": metValue = 8.5; break;
            case "rest": metValue = 1.0; break;
            default: metValue = 3.5;
          }
        } else {
          // Cats have different metabolic rates
          switch (activity) {
            case "walk": metValue = 3.0; break;
            case "brisk": metValue = 5.0; break;
            case "run": metValue = 9.0; break;
            case "play": metValue = 6.0; break;
            case "swim": metValue = 7.0; break;
            case "rest": metValue = 1.2; break;
            default: metValue = 3.0;
          }
        }

        const caloriesBurned = Math.round(metValue * weightKg * (duration / 60));

        // Resting Energy Requirement (RER) for context
        const rer = Math.round(70 * Math.pow(weightKg, 0.75));

        // Daily calorie needs estimate
        const activityFactor = petType === "dog" ? 1.6 : 1.4;
        const dailyCalories = Math.round(rer * activityFactor);

        const percentOfDaily = Math.round((caloriesBurned / dailyCalories) * 100);

        // Treat equivalent (average small treat ~5 cal for cats, ~20 cal for dogs)
        const treatCalories = petType === "dog" ? 20 : 5;
        const treatEquivalent = Math.round(caloriesBurned / treatCalories);

        return {
          primary: {
            label: "Calories Burned",
            value: `${formatNumber(caloriesBurned)} calories`,
          },
          details: [
            { label: "Activity Duration", value: `${duration} minutes` },
            { label: "Percent of Daily Needs", value: `${percentOfDaily}%` },
            { label: "Daily Calorie Needs (est.)", value: `${formatNumber(dailyCalories)} cal` },
            { label: "Resting Energy Requirement", value: `${formatNumber(rer)} cal` },
            { label: "Treat Equivalent", value: `~${treatEquivalent} small treats` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "cat-water-intake-calculator"],
  faq: [
    {
      question: "How many calories does a dog burn walking?",
      answer:
        "A dog burns approximately 3.5 calories per kilogram of body weight per hour of walking. So a 30 lb (13.6 kg) dog would burn about 48 calories in 60 minutes of leisurely walking. Running and swimming burn significantly more.",
    },
    {
      question: "How much exercise does a dog need daily?",
      answer:
        "Most dogs need 30 minutes to 2 hours of exercise per day, depending on breed, age, and health. High-energy breeds like Border Collies may need 2+ hours, while smaller or older dogs may be satisfied with 30 minutes of moderate activity.",
    },
    {
      question: "How do I know if my pet is overweight?",
      answer:
        "You should be able to feel your pet's ribs without pressing hard. When viewed from above, there should be a visible waist behind the ribs. From the side, the belly should tuck up. If you cannot feel ribs or see a waist, consult your vet about a weight management plan.",
    },
  ],
  formula:
    "Calories Burned = MET Value x Weight (kg) x Duration (hours) | RER = 70 x Weight(kg)^0.75",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogExerciseCalculator: CalculatorDefinition = {
  slug: "dog-exercise-calculator",
  title: "Dog Exercise Calculator",
  description: "Calculate daily exercise needs for your dog based on breed size, age, and energy level.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["dog exercise needs", "dog activity calculator", "dog walk time"],
  variants: [{
    id: "standard",
    name: "Dog Exercise",
    description: "Calculate daily exercise needs for your dog based on breed size, age, and energy level",
    fields: [
      { name: "breedSize", label: "Breed Size", type: "select", options: [{value:"toy",label:"Toy (under 10 lbs)"},{value:"small",label:"Small (10-25 lbs)"},{value:"medium",label:"Medium (25-60 lbs)"},{value:"large",label:"Large (60-100 lbs)"},{value:"giant",label:"Giant (100+ lbs)"}], defaultValue: "medium" },
      { name: "age", label: "Dog Age", type: "number", suffix: "years", min: 0.5, max: 20, defaultValue: 3 },
      { name: "energyLevel", label: "Energy Level", type: "select", options: [{value:"low",label:"Low (calm breeds)"},{value:"moderate",label:"Moderate"},{value:"high",label:"High (working breeds)"}], defaultValue: "moderate" },
    ],
    calculate: (inputs) => {
      const size = inputs.breedSize as string;
      const age = inputs.age as number;
      const energy = inputs.energyLevel as string;
      if (!age || age <= 0) return null;
      const baseMinutes: Record<string, number> = { toy: 30, small: 45, medium: 60, large: 75, giant: 45 };
      const energyMult: Record<string, number> = { low: 0.7, moderate: 1.0, high: 1.5 };
      const ageFactor = age < 1 ? 0.5 : age < 2 ? 1.2 : age < 8 ? 1.0 : 0.6;
      const dailyMinutes = Math.round((baseMinutes[size] || 60) * (energyMult[energy] || 1.0) * ageFactor);
      const walks = Math.ceil(dailyMinutes / 30);
      const weeklyHours = (dailyMinutes * 7) / 60;
      return {
        primary: { label: "Daily Exercise Needed", value: dailyMinutes + " minutes" },
        details: [
          { label: "Recommended Walks", value: walks + " per day" },
          { label: "Minutes per Walk", value: Math.round(dailyMinutes / walks) + " minutes" },
          { label: "Weekly Total", value: weeklyHours.toFixed(1) + " hours" },
        ],
      };
    },
  }],
  relatedSlugs: ["dog-age-calculator", "dog-food-cost-calculator"],
  faq: [
    { question: "How much exercise does my dog need?", answer: "Most adult dogs need 30-90 minutes of exercise daily. High-energy breeds may need 2 or more hours." },
    { question: "Can I over-exercise my dog?", answer: "Yes. Puppies and senior dogs are especially susceptible. Watch for excessive panting, limping, or reluctance to continue." },
  ],
  formula: "Daily Minutes = Base Minutes x Energy Multiplier x Age Factor",
};

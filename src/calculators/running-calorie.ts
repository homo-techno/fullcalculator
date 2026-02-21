import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const runningCalorieCalculator: CalculatorDefinition = {
  slug: "running-calorie-calculator",
  title: "Running Calorie Calculator",
  description:
    "Free running calorie calculator. Estimate how many calories you burn running based on weight, distance, and time. See your pace, speed, and calorie burn rate.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "running calorie calculator",
    "calories burned running",
    "jogging calorie calculator",
    "running calories per mile",
    "run calorie burn",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Calories Burned",
      description: "Estimate calories burned while running",
      fields: [
        { name: "weight", label: "Weight", type: "number", placeholder: "e.g. 170", suffix: "lbs" },
        { name: "distance", label: "Distance", type: "number", placeholder: "e.g. 3", suffix: "miles" },
        { name: "minutes", label: "Time", type: "number", placeholder: "e.g. 30", suffix: "minutes" },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const distance = inputs.distance as number;
        const minutes = inputs.minutes as number;
        if (!weight || !distance) return null;

        const weightKg = weight * 0.453592;
        const distanceKm = distance * 1.60934;
        const calories = weightKg * distanceKm * 1.036;
        const caloriesPerMile = calories / distance;

        const details: { label: string; value: string }[] = [
          { label: "Distance", value: `${formatNumber(distance, 1)} mi (${formatNumber(distanceKm, 1)} km)` },
          { label: "Calories/Mile", value: formatNumber(caloriesPerMile, 0) },
        ];

        if (minutes && minutes > 0) {
          const paceMinPerMile = minutes / distance;
          const paceMin = Math.floor(paceMinPerMile);
          const paceSec = Math.round((paceMinPerMile - paceMin) * 60);
          const speedMph = distance / (minutes / 60);

          details.push(
            { label: "Pace", value: `${paceMin}:${paceSec.toString().padStart(2, "0")} /mile` },
            { label: "Speed", value: `${formatNumber(speedMph, 1)} mph` },
            { label: "Cal/Minute", value: formatNumber(calories / minutes, 1) },
          );
        }

        return {
          primary: { label: "Calories Burned", value: formatNumber(calories, 0) },
          details,
          note: "This estimate uses the general running calorie formula. Actual burn varies with terrain, wind, fitness level, and running efficiency.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "pace-calculator", "walking-calorie-calculator", "exercise-calorie-calculator"],
  faq: [
    {
      question: "How many calories does running burn per mile?",
      answer:
        "A general rule of thumb is about 100 calories per mile for a 155-lb person. More precisely, you burn roughly 0.75 calories per pound per mile, so a 200-lb person burns about 150 calories per mile.",
    },
    {
      question: "Does running faster burn more calories?",
      answer:
        "Running faster burns more calories per minute but roughly the same calories per mile. The total calorie burn for a given distance is primarily determined by your weight and the distance, not the speed.",
    },
    {
      question: "Is running better than walking for burning calories?",
      answer:
        "Running burns more calories per unit of time because of higher intensity. However, per mile, running burns only slightly more than walking. Running at 6 mph burns about 10-20% more calories per mile than walking the same distance.",
    },
  ],
  formula:
    "Calories ≈ Weight (kg) × Distance (km) × 1.036 | Pace = Time / Distance | Speed = Distance / Time",
};

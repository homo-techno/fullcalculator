import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vo2maxCalculator: CalculatorDefinition = {
  slug: "vo2-max-calculator",
  title: "VO2 Max Calculator",
  description: "Free VO2 Max calculator. Estimate your maximal oxygen uptake and cardiovascular fitness level using common field tests.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["vo2 max calculator", "vo2max calculator", "cardiovascular fitness", "aerobic capacity", "fitness level calculator"],
  variants: [
    {
      id: "cooper",
      name: "Cooper Test (12-minute run)",
      description: "Estimate VO2max from distance covered in 12 minutes of running",
      fields: [
        { name: "distance", label: "Distance in 12 min (meters)", type: "number", placeholder: "e.g. 2400" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
      ],
      calculate: (inputs) => {
        const dist = inputs.distance as number;
        const age = inputs.age as number;
        const gender = inputs.gender as string;
        if (!dist) return null;
        const vo2 = (dist - 504.9) / 44.73;
        let fitness: string;
        const isMale = gender === "male";
        const a = age || 30;
        if (a < 30) {
          fitness = vo2 >= (isMale ? 52 : 45) ? "Excellent" : vo2 >= (isMale ? 43 : 38) ? "Good" : vo2 >= (isMale ? 36 : 31) ? "Average" : "Below Average";
        } else if (a < 40) {
          fitness = vo2 >= (isMale ? 48 : 42) ? "Excellent" : vo2 >= (isMale ? 40 : 34) ? "Good" : vo2 >= (isMale ? 33 : 28) ? "Average" : "Below Average";
        } else {
          fitness = vo2 >= (isMale ? 44 : 38) ? "Excellent" : vo2 >= (isMale ? 37 : 31) ? "Good" : vo2 >= (isMale ? 30 : 25) ? "Average" : "Below Average";
        }
        return {
          primary: { label: "VO2 Max", value: `${formatNumber(vo2, 1)} mL/kg/min` },
          details: [
            { label: "Fitness level", value: fitness },
            { label: "Distance", value: `${dist} meters (${formatNumber(dist / 1609.34, 2)} miles)` },
          ],
          note: "The Cooper test estimates VO2max from a 12-minute all-out run. Run as far as possible in 12 minutes on a flat surface.",
        };
      },
    },
    {
      id: "rockport",
      name: "Rockport Walk Test",
      description: "Estimate VO2max from a 1-mile walk (less intense than Cooper test)",
      fields: [
        { name: "minutes", label: "Walk Time (minutes)", type: "number", placeholder: "e.g. 14" },
        { name: "heartRate", label: "Heart Rate After Walk (bpm)", type: "number", placeholder: "e.g. 140" },
        { name: "weight", label: "Weight (lbs)", type: "number", placeholder: "e.g. 160" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 35" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "1" }, { label: "Female", value: "0" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const time = inputs.minutes as number;
        const hr = inputs.heartRate as number;
        const weight = inputs.weight as number;
        const age = inputs.age as number;
        const genderVal = parseInt(inputs.gender as string);
        if (!time || !hr || !weight || !age) return null;
        const weightKg = weight * 0.4536;
        const vo2 = 132.853 - 0.0769 * weightKg * 2.205 - 0.3877 * age + 6.315 * genderVal - 3.2649 * time - 0.1565 * hr;
        return {
          primary: { label: "VO2 Max", value: `${formatNumber(vo2, 1)} mL/kg/min` },
          details: [
            { label: "Walk time", value: `${formatNumber(time, 1)} min` },
            { label: "Heart rate", value: `${hr} bpm` },
          ],
          note: "Walk 1 mile as fast as possible (no running). Record your time and heart rate immediately after finishing.",
        };
      },
    },
  ],
  relatedSlugs: ["heart-rate-calculator", "calorie-calculator", "pace-calculator"],
  faq: [
    { question: "What is VO2 Max?", answer: "VO2 Max is the maximum rate of oxygen your body can use during exercise, measured in mL/kg/min. It's the gold standard for cardiovascular fitness. Higher = fitter. Elite athletes: 70-85+. Average adult: 30-40." },
  ],
  formula: "Cooper: VO2max = (distance_m - 504.9) / 44.73 | Rockport: VO2max = 132.853 - 0.0769w - 0.3877a + 6.315g - 3.2649t - 0.1565hr",
};

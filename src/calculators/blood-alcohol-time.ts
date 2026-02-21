import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bloodAlcoholTimeCalculator: CalculatorDefinition = {
  slug: "blood-alcohol-time-calculator",
  title: "Blood Alcohol Elimination Time Calculator",
  description:
    "Free blood alcohol elimination time calculator. Estimate how long it takes for your body to metabolize alcohol and return to 0.00% BAC.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "blood alcohol time",
    "alcohol elimination",
    "BAC time",
    "sober up time",
    "alcohol metabolism",
    "how long to sober up",
    "alcohol elimination rate",
  ],
  variants: [
    {
      id: "from-bac",
      name: "Time from Known BAC",
      description: "Calculate elimination time from a known BAC level",
      fields: [
        {
          name: "currentBac",
          label: "Current/Estimated BAC",
          type: "number",
          placeholder: "e.g. 0.08",
          suffix: "%",
          min: 0.01,
          max: 0.5,
          step: 0.01,
        },
        {
          name: "eliminationRate",
          label: "Metabolism Rate",
          type: "select",
          options: [
            { label: "Slow (0.012%/hr)", value: "0.012" },
            { label: "Average (0.015%/hr)", value: "0.015" },
            { label: "Fast (0.020%/hr)", value: "0.020" },
          ],
        },
      ],
      calculate: (inputs) => {
        const bac = inputs.currentBac as number;
        const rateStr = inputs.eliminationRate as string;
        if (!bac || !rateStr) return null;
        const rate = parseFloat(rateStr);

        const hoursToZero = bac / rate;
        const hours = Math.floor(hoursToZero);
        const minutes = Math.round((hoursToZero - hours) * 60);

        const hoursToLegal = Math.max(0, (bac - 0.08) / rate);
        const legalHrs = Math.floor(hoursToLegal);
        const legalMin = Math.round((hoursToLegal - legalHrs) * 60);

        // BAC at various time points
        const bacAt1h = Math.max(0, bac - rate * 1);
        const bacAt2h = Math.max(0, bac - rate * 2);
        const bacAt4h = Math.max(0, bac - rate * 4);

        return {
          primary: { label: "Time to 0.00% BAC", value: `${hours}h ${minutes}m` },
          details: [
            { label: "Starting BAC", value: `${formatNumber(bac, 3)}%` },
            { label: "Time to 0.00%", value: `${hours} hours ${minutes} minutes` },
            { label: "Time to 0.08% (US legal limit)", value: hoursToLegal > 0 ? `${legalHrs}h ${legalMin}m` : "Already below 0.08%" },
            { label: "BAC in 1 hour", value: `${formatNumber(bacAt1h, 3)}%` },
            { label: "BAC in 2 hours", value: `${formatNumber(bacAt2h, 3)}%` },
            { label: "BAC in 4 hours", value: `${formatNumber(bacAt4h, 3)}%` },
            { label: "Elimination rate", value: `${rate}%/hour` },
          ],
          note: "Alcohol elimination follows zero-order kinetics at a relatively constant rate. The average rate is ~0.015%/hour, but varies by individual, genetics, liver health, food intake, and other factors. NEVER rely on this calculator to determine if you are safe to drive. When in doubt, do not drive.",
        };
      },
    },
    {
      id: "from-drinks",
      name: "Estimate from Drinks Consumed",
      description: "Estimate BAC and elimination time from number of drinks",
      fields: [
        {
          name: "drinks",
          label: "Number of Standard Drinks",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          max: 30,
          step: 0.5,
        },
        {
          name: "weight",
          label: "Body Weight",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
          min: 30,
          max: 250,
        },
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "drinkingTime",
          label: "Hours Since First Drink",
          type: "number",
          placeholder: "e.g. 2",
          suffix: "hours",
          min: 0,
          max: 24,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const drinks = inputs.drinks as number;
        const weightKg = inputs.weight as number;
        const sex = inputs.sex as string;
        const elapsed = inputs.drinkingTime as number;
        if (!drinks || !weightKg || !sex) return null;
        const elapsedTime = elapsed || 0;

        // Widmark formula: BAC = (alcohol consumed in grams / (body weight in grams × r)) × 100
        // Standard drink = 14g alcohol, r = 0.68 (male), 0.55 (female)
        const r = sex === "male" ? 0.68 : 0.55;
        const alcoholGrams = drinks * 14;
        const peakBac = (alcoholGrams / (weightKg * 1000 * r)) * 100;
        const eliminationRate = 0.015;
        const currentBac = Math.max(0, peakBac - (eliminationRate * elapsedTime));

        const hoursToZero = currentBac / eliminationRate;
        const hours = Math.floor(hoursToZero);
        const minutes = Math.round((hoursToZero - hours) * 60);

        let impairment: string;
        if (currentBac < 0.02) impairment = "Minimal effects";
        else if (currentBac < 0.05) impairment = "Mild impairment — relaxation, lowered inhibitions";
        else if (currentBac < 0.08) impairment = "Reduced coordination, impaired judgment";
        else if (currentBac < 0.15) impairment = "Significant impairment — legally intoxicated";
        else if (currentBac < 0.25) impairment = "Severe impairment — vomiting possible";
        else if (currentBac < 0.35) impairment = "Life-threatening — seek medical attention";
        else impairment = "Potentially fatal — call emergency services";

        return {
          primary: { label: "Estimated Current BAC", value: `${formatNumber(currentBac, 3)}%` },
          details: [
            { label: "Estimated peak BAC", value: `${formatNumber(peakBac, 3)}%` },
            { label: "Current estimated BAC", value: `${formatNumber(currentBac, 3)}%` },
            { label: "Impairment level", value: impairment },
            { label: "Time until 0.00%", value: `${hours}h ${minutes}m from now` },
            { label: "Standard drinks", value: String(drinks) },
            { label: "Time elapsed", value: `${elapsedTime} hours` },
          ],
          note: "This is a rough estimate using the Widmark formula. Actual BAC depends on many factors including food intake, drink speed, tolerance, medications, and liver function. This calculator should NEVER be used to determine fitness to drive. When in doubt, use a ride service or designated driver.",
        };
      },
    },
  ],
  relatedSlugs: ["bac-calculator", "alcohol-calorie-calculator", "hydration-calculator"],
  faq: [
    {
      question: "How fast does the body eliminate alcohol?",
      answer:
        "The average person eliminates alcohol at about 0.015% BAC per hour (roughly one standard drink per hour). This rate is relatively constant regardless of BAC level, as alcohol follows zero-order kinetics.",
    },
    {
      question: "Can anything speed up alcohol metabolism?",
      answer:
        "No. Coffee, cold showers, food, and exercise do NOT speed up alcohol elimination. Only time reduces BAC. The liver metabolizes alcohol at a fixed rate. Food eaten before drinking can slow absorption but not speed elimination.",
    },
    {
      question: "What is a standard drink?",
      answer:
        "One standard drink contains about 14 grams of pure alcohol: 12 oz regular beer (5%), 5 oz wine (12%), or 1.5 oz distilled spirits (40%/80 proof).",
    },
    {
      question: "What is the legal BAC limit?",
      answer:
        "In the US, the legal limit for driving is 0.08% BAC (0.04% for commercial drivers). Many countries have lower limits (0.05% or even 0.00%). Impairment begins well before reaching the legal limit.",
    },
  ],
  formula:
    "Widmark Formula: BAC = (Alcohol in grams / (Body weight in grams x r)) x 100 | r = 0.68 (male), 0.55 (female) | Standard drink = 14g alcohol | Elimination rate: ~0.015% BAC/hour (zero-order kinetics)",
};

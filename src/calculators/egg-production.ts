import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eggProductionCalculator: CalculatorDefinition = {
  slug: "egg-production-calculator",
  title: "Egg Production Calculator",
  description:
    "Free egg production calculator. Estimate weekly, monthly, and yearly egg yields based on flock size, breed, and season.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "egg production calculator",
    "how many eggs will my chickens lay",
    "chicken egg calculator",
    "backyard chicken eggs",
    "egg yield calculator",
  ],
  variants: [
    {
      id: "eggCalc",
      name: "Egg Production Estimate",
      fields: [
        {
          name: "henCount",
          label: "Number of Laying Hens",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 10000,
        },
        {
          name: "breed",
          label: "Breed Type",
          type: "select",
          options: [
            { label: "High Production (Leghorn, ISA Brown, Sex Link)", value: "high" },
            { label: "Good Production (Rhode Island Red, Plymouth Rock)", value: "good" },
            { label: "Moderate (Orpington, Wyandotte, Australorp)", value: "moderate" },
            { label: "Low/Ornamental (Silkie, Polish, Bantam)", value: "low" },
          ],
        },
        {
          name: "henAge",
          label: "Hen Age",
          type: "select",
          options: [
            { label: "Pullet (just started laying)", value: "pullet" },
            { label: "Year 1 (peak production)", value: "year1" },
            { label: "Year 2", value: "year2" },
            { label: "Year 3+", value: "year3plus" },
          ],
        },
        {
          name: "season",
          label: "Current Season",
          type: "select",
          options: [
            { label: "Spring/Summer (long days)", value: "spring_summer" },
            { label: "Fall (shortening days)", value: "fall" },
            { label: "Winter (short days, no light)", value: "winter_nolight" },
            { label: "Winter (supplemental light)", value: "winter_light" },
          ],
        },
      ],
      calculate: (inputs) => {
        const henCount = inputs.henCount as number;
        const breed = (inputs.breed as string) || "good";
        const henAge = (inputs.henAge as string) || "year1";
        const season = (inputs.season as string) || "spring_summer";
        if (!henCount || henCount <= 0) return null;

        // Eggs per hen per year at peak (year 1)
        const breedEggs: Record<string, number> = {
          high: 300,
          good: 260,
          moderate: 200,
          low: 120,
        };

        // Age adjustment (production declines ~15-20% per year after year 1)
        const ageFactors: Record<string, number> = {
          pullet: 0.7, // ramping up
          year1: 1.0,
          year2: 0.82,
          year3plus: 0.65,
        };

        // Season adjustment
        const seasonFactors: Record<string, number> = {
          spring_summer: 1.0,
          fall: 0.75,
          winter_nolight: 0.3,
          winter_light: 0.7,
        };

        const basePerYear = breedEggs[breed] || 260;
        const ageFactor = ageFactors[henAge] || 1.0;
        const seasonFactor = seasonFactors[season] || 1.0;

        const adjustedPerYear = basePerYear * ageFactor;
        const eggsPerHenPerDay = (adjustedPerYear / 365) * seasonFactor;
        const dailyTotal = eggsPerHenPerDay * henCount;
        const weeklyTotal = dailyTotal * 7;
        const monthlyTotal = dailyTotal * 30;
        const yearlyTotal = adjustedPerYear * henCount * 0.8; // 0.8 for molt/seasonal average

        // Dozen calculation
        const dozenPerWeek = weeklyTotal / 12;
        const dozenPerMonth = monthlyTotal / 12;

        // Feed cost estimate (6 lbs feed per dozen eggs at ~$0.40/lb)
        const feedCostPerDozen = 6 * 0.4;
        const monthlyCost = dozenPerMonth * feedCostPerDozen;

        return {
          primary: {
            label: "Expected Eggs/Week",
            value: formatNumber(weeklyTotal, 1) + " eggs",
          },
          details: [
            { label: "Eggs Per Day", value: formatNumber(dailyTotal, 1) },
            { label: "Eggs Per Month", value: formatNumber(monthlyTotal, 0) },
            { label: "Dozen Per Week", value: formatNumber(dozenPerWeek, 1) },
            { label: "Dozen Per Month", value: formatNumber(dozenPerMonth, 1) },
            { label: "Yearly Estimate", value: formatNumber(yearlyTotal, 0) + " eggs" },
            { label: "Breed Potential", value: basePerYear + " eggs/year per hen (peak)" },
            { label: "Est. Feed Cost/Dozen", value: "$" + formatNumber(feedCostPerDozen, 2) },
            { label: "Monthly Feed Cost", value: "$" + formatNumber(monthlyCost, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["chicken-coop-size-calculator", "livestock-water-calculator", "pet-food-calculator"],
  faq: [
    {
      question: "How many eggs does a chicken lay per day?",
      answer:
        "A healthy laying hen produces about 1 egg every 25-27 hours, so roughly 5-6 eggs per week at peak production. High-production breeds like Leghorns can lay nearly daily (280-320 eggs/year), while ornamental breeds may only lay 2-3 eggs per week.",
    },
    {
      question: "Why do chickens stop laying in winter?",
      answer:
        "Chickens need 14-16 hours of light daily to maintain egg production. In winter, shorter days signal their bodies to slow or stop laying. You can maintain production by adding supplemental light (a simple LED timer) in the coop to extend 'daylight' to 14-16 hours total.",
    },
    {
      question: "At what age do chickens start laying?",
      answer:
        "Most chicken breeds begin laying between 18-24 weeks (4.5-6 months) of age. Production breeds like Leghorns may start as early as 16-18 weeks, while larger or ornamental breeds may not start until 24-28 weeks. Early eggs are typically smaller.",
    },
  ],
  formula:
    "Eggs/day per hen = (breed annual potential x age factor) / 365 x season factor. Total daily = eggs per hen x number of hens. Breed potential: high 300, good 260, moderate 200, low 120 eggs/year. Age factor: year 1 = 1.0, year 2 = 0.82, year 3+ = 0.65.",
};

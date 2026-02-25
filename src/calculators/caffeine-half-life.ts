import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const caffeineHalfLifeCalculator: CalculatorDefinition = {
  slug: "caffeine-half-life",
  title: "Caffeine Half-Life Calculator",
  description: "Calculate how long caffeine stays in your system. Find out how much caffeine remains at bedtime based on when you had your last coffee.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["caffeine", "half life", "coffee calculator", "caffeine metabolism", "sleep", "how long caffeine lasts"],
  variants: [
    {
      id: "calc",
      name: "Calculate Caffeine Remaining",
      fields: [
        {
          name: "drink",
          label: "Beverage Type",
          type: "select",
          options: [
            { label: "Coffee (8oz) - 95mg", value: "95" },
            { label: "Espresso (1 shot) - 63mg", value: "63" },
            { label: "Double Espresso - 126mg", value: "126" },
            { label: "Energy Drink (8oz) - 80mg", value: "80" },
            { label: "Black Tea (8oz) - 47mg", value: "47" },
            { label: "Green Tea (8oz) - 28mg", value: "28" },
            { label: "Cola (12oz) - 34mg", value: "34" },
            { label: "Pre-Workout - 200mg", value: "200" },
          ],
        },
        { name: "cups", label: "Number of Servings", type: "number", placeholder: "e.g. 2", min: 1, max: 20, defaultValue: 1 },
        { name: "hoursSinceDrink", label: "Hours Since Consumed", type: "number", placeholder: "e.g. 3", min: 0, max: 24, step: 0.5, defaultValue: 0 },
        { name: "bedtimeIn", label: "Hours Until Bedtime", type: "number", placeholder: "e.g. 8", min: 0, max: 24, step: 0.5 },
      ],
      calculate: (inputs) => {
        const mgPerServing = Number(inputs.drink) || 95;
        const cups = Number(inputs.cups) || 1;
        const hoursSince = Number(inputs.hoursSinceDrink) || 0;
        const bedtimeIn = Number(inputs.bedtimeIn);
        if (bedtimeIn === undefined || bedtimeIn === null) return null;

        const totalMg = mgPerServing * cups;
        const halfLife = 5; // average caffeine half-life in hours
        const remainingNow = totalMg * Math.pow(0.5, hoursSince / halfLife);
        const remainingAtBedtime = totalMg * Math.pow(0.5, (hoursSince + bedtimeIn) / halfLife);
        const hoursTo25mg = halfLife * Math.log2(totalMg / 25);
        const hoursToHalf = halfLife;

        let sleepImpact: string;
        if (remainingAtBedtime < 25) sleepImpact = "Minimal - should not affect sleep";
        else if (remainingAtBedtime < 50) sleepImpact = "Low - may mildly affect sensitive individuals";
        else if (remainingAtBedtime < 100) sleepImpact = "Moderate - may delay sleep onset";
        else sleepImpact = "High - likely to significantly disrupt sleep";

        return {
          primary: { label: "Caffeine at Bedtime", value: formatNumber(Math.round(remainingAtBedtime)) + " mg" },
          details: [
            { label: "Total Caffeine Consumed", value: formatNumber(totalMg) + " mg" },
            { label: "Remaining Right Now", value: formatNumber(Math.round(remainingNow)) + " mg" },
            { label: "At Bedtime", value: formatNumber(Math.round(remainingAtBedtime)) + " mg" },
            { label: "Sleep Impact", value: sleepImpact },
            { label: "Half-Life", value: halfLife + " hours" },
            { label: "Hours Until < 25mg", value: formatNumber(Math.round(hoursTo25mg * 10) / 10) + " hours" },
          ],
          note: "Average caffeine half-life is 5 hours but varies from 1.5 to 9 hours based on genetics, age, and liver function.",
        };
      },
    },
  ],
  relatedSlugs: ["screen-time-calculator", "water-bottle-refill-calculator", "how-many-days-until-calculator"],
  faq: [
    { question: "What is caffeine half-life?", answer: "Half-life is the time it takes for your body to eliminate half the caffeine. The average is about 5 hours, meaning 100mg becomes 50mg after 5 hours." },
    { question: "How much caffeine is safe per day?", answer: "The FDA recommends up to 400mg per day for healthy adults, roughly 4 cups of coffee. Pregnant women should limit to 200mg." },
  ],
  formula: "Remaining Caffeine = Initial Amount x (0.5 ^ (hours elapsed / half-life))",
};

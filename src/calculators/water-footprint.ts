import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterFootprintCalculator: CalculatorDefinition = {
  slug: "water-footprint-calculator",
  title: "Water Footprint Calculator",
  description:
    "Free water footprint calculator. Estimate your daily and annual water usage from showers, laundry, diet, and household activities.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "water footprint",
    "water usage",
    "water conservation",
    "water consumption",
    "virtual water",
    "water waste",
  ],
  variants: [
    {
      id: "daily",
      name: "Daily Water Usage",
      fields: [
        {
          name: "showerMin",
          label: "Shower Minutes per Day",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "flushes",
          label: "Toilet Flushes per Day",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "laundryLoads",
          label: "Laundry Loads per Week",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "dishwasher",
          label: "Dishwasher Loads per Week",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "diet",
          label: "Diet Type",
          type: "select",
          options: [
            { label: "Vegan", value: "vegan" },
            { label: "Vegetarian", value: "vegetarian" },
            { label: "Average (some meat)", value: "average" },
            { label: "Heavy meat eater", value: "heavy" },
          ],
        },
      ],
      calculate: (inputs) => {
        const showerMin = (inputs.showerMin as number) || 0;
        const flushes = (inputs.flushes as number) || 0;
        const laundryLoads = (inputs.laundryLoads as number) || 0;
        const dishwasher = (inputs.dishwasher as number) || 0;
        const diet = (inputs.diet as string) || "average";
        if (!showerMin && !flushes && !laundryLoads && !dishwasher) return null;

        const showerGalPerMin = 2.1;
        const flushGal = 1.6;
        const laundryGal = 30;
        const dishwasherGal = 6;

        const dietWaterGalPerDay: Record<string, number> = {
          vegan: 600,
          vegetarian: 750,
          average: 1000,
          heavy: 1500,
        };

        const dailyDirectGal =
          showerMin * showerGalPerMin +
          flushes * flushGal +
          (laundryLoads * laundryGal) / 7 +
          (dishwasher * dishwasherGal) / 7;

        const dailyVirtualGal = dietWaterGalPerDay[diet] || 1000;
        const totalDailyGal = dailyDirectGal + dailyVirtualGal;
        const annualGal = totalDailyGal * 365;

        return {
          primary: {
            label: "Total Daily Water Footprint",
            value: formatNumber(totalDailyGal, 0) + " gallons",
          },
          details: [
            { label: "Direct Daily Usage", value: formatNumber(dailyDirectGal, 1) + " gal" },
            { label: "Virtual Water (diet)", value: formatNumber(dailyVirtualGal, 0) + " gal/day" },
            { label: "Annual Footprint", value: formatNumber(annualGal, 0) + " gal" },
            { label: "Annual (liters)", value: formatNumber(annualGal * 3.785, 0) + " L" },
            { label: "Shower Water/Day", value: formatNumber(showerMin * showerGalPerMin, 1) + " gal" },
          ],
          note: "Virtual water includes the water used to produce your food. A meat-heavy diet requires significantly more water than a plant-based one.",
        };
      },
    },
  ],
  relatedSlugs: ["water-flow-rate-calculator", "water-intake-calculator"],
  faq: [
    {
      question: "What is a water footprint?",
      answer:
        "A water footprint measures the total volume of freshwater used to produce goods and services consumed by an individual. It includes direct use (showers, washing) and virtual water (water used in food and goods production).",
    },
    {
      question: "How can I reduce my water footprint?",
      answer:
        "Take shorter showers, fix leaks, use efficient appliances, eat less meat, and choose products with lower water footprints. Reducing meat consumption has the biggest single impact.",
    },
  ],
  formula:
    "Daily Footprint = (Shower min x 2.1 gal) + (Flushes x 1.6 gal) + (Laundry gal / 7) + (Dishwasher gal / 7) + Diet virtual water.",
};

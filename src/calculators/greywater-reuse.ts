import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const greywaterReuseCalculator: CalculatorDefinition = {
  slug: "greywater-reuse-calculator",
  title: "Greywater Reuse Calculator",
  description:
    "Free greywater reuse calculator. Estimate how much water you can reclaim from showers, laundry, and sinks for irrigation and non-potable use.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "greywater reuse",
    "grey water",
    "water recycling",
    "greywater irrigation",
    "water reuse",
    "greywater system",
  ],
  variants: [
    {
      id: "reuse",
      name: "Greywater Potential",
      fields: [
        {
          name: "occupants",
          label: "Number of Household Members",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "showerMin",
          label: "Average Shower (minutes/person/day)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "laundryLoads",
          label: "Laundry Loads per Week",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "source",
          label: "Greywater Sources",
          type: "select",
          options: [
            { label: "Shower Only", value: "shower" },
            { label: "Shower + Laundry", value: "shower_laundry" },
            { label: "Shower + Laundry + Sinks", value: "all" },
          ],
        },
        {
          name: "waterRate",
          label: "Water Rate ($/1000 gallons)",
          type: "number",
          placeholder: "e.g. 5",
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const occupants = inputs.occupants as number;
        const showerMin = (inputs.showerMin as number) || 0;
        const laundryLoads = (inputs.laundryLoads as number) || 0;
        const source = (inputs.source as string) || "shower_laundry";
        const waterRate = (inputs.waterRate as number) || 5;
        if (!occupants) return null;

        const showerGalPerMin = 2.1;
        const laundryGalPerLoad = 30;
        const sinkGalPerPersonPerDay = 5;

        let dailyGreywater = 0;

        // Shower greywater
        const showerDaily = occupants * showerMin * showerGalPerMin;
        dailyGreywater += showerDaily;

        // Laundry greywater
        const laundryDaily = (laundryLoads * laundryGalPerLoad) / 7;
        if (source === "shower_laundry" || source === "all") {
          dailyGreywater += laundryDaily;
        }

        // Sink greywater
        const sinkDaily = occupants * sinkGalPerPersonPerDay;
        if (source === "all") {
          dailyGreywater += sinkDaily;
        }

        const annualGreywater = dailyGreywater * 365;
        const annualSavings = (annualGreywater / 1000) * waterRate;
        const monthlyGreywater = dailyGreywater * 30;

        // Irrigation potential (1 gallon per 2 sq ft of garden per week in summer)
        const gardenAreaSupported = (dailyGreywater * 7) * 2;

        return {
          primary: {
            label: "Daily Greywater Available",
            value: formatNumber(dailyGreywater, 0) + " gallons",
          },
          details: [
            { label: "Monthly Volume", value: formatNumber(monthlyGreywater, 0) + " gallons" },
            { label: "Annual Volume", value: formatNumber(annualGreywater, 0) + " gallons" },
            { label: "Shower Contribution", value: formatNumber(showerDaily, 1) + " gal/day" },
            { label: "Laundry Contribution", value: formatNumber(laundryDaily, 1) + " gal/day" },
            { label: "Annual Water Bill Savings", value: "$" + formatNumber(annualSavings, 2) },
            { label: "Garden Area Supported", value: formatNumber(gardenAreaSupported, 0) + " sq ft" },
          ],
          note: "Greywater must be used within 24 hours to prevent bacterial growth. Use biodegradable soaps and avoid greywater from kitchen sinks or dishwashers due to grease and food particles.",
        };
      },
    },
  ],
  relatedSlugs: ["rainwater-harvest-calculator", "water-footprint-calculator"],
  faq: [
    {
      question: "What is greywater?",
      answer:
        "Greywater is gently used household water from showers, bathtubs, bathroom sinks, and washing machines. It does not include water from toilets (blackwater), kitchen sinks, or dishwashers.",
    },
    {
      question: "Is greywater safe for irrigation?",
      answer:
        "Greywater is safe for irrigating non-edible plants and can be used for fruit trees and some vegetables when applied to soil (not leaves). Use biodegradable, plant-friendly soaps and apply within 24 hours of collection.",
    },
  ],
  formula:
    "Daily Greywater = (Occupants x Shower min x 2.1 gal) + (Laundry loads x 30 gal / 7) + (Sink gal if applicable). Annual = Daily x 365.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterHeaterCalculator: CalculatorDefinition = {
  slug: "water-heater-calculator",
  title: "Water Heater Size Calculator",
  description:
    "Free water heater size calculator. Find the right tank size based on household size and number of bathrooms.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["water heater", "tank size", "gallon", "hot water", "household"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "people",
          label: "Number of People",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "bathrooms",
          label: "Number of Bathrooms",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const people = inputs.people as number;
        const bathrooms = inputs.bathrooms as number;
        if (!people || !bathrooms) return null;

        let minGallons: number;
        let maxGallons: number;
        let recommendation: string;

        if (people <= 2) {
          minGallons = 30;
          maxGallons = 40;
          recommendation = "Small tank (30-40 gallons)";
        } else if (people <= 4) {
          minGallons = 40;
          maxGallons = 50;
          recommendation = "Medium tank (40-50 gallons)";
        } else {
          minGallons = 50;
          maxGallons = 80;
          recommendation = "Large tank (50-80 gallons)";
        }

        // Adjust up if many bathrooms relative to people
        if (bathrooms >= 3 && maxGallons < 50) {
          maxGallons = 50;
          recommendation = "Medium-large tank (40-50 gallons) due to multiple bathrooms";
        }

        const dailyUsage = people * 20; // ~20 gallons per person per day

        return {
          primary: {
            label: "Recommended Tank Size",
            value: recommendation,
          },
          details: [
            { label: "Minimum Tank Size", value: formatNumber(minGallons, 0) + " gallons" },
            { label: "Maximum Tank Size", value: formatNumber(maxGallons, 0) + " gallons" },
            { label: "Estimated Daily Usage", value: formatNumber(dailyUsage, 0) + " gallons" },
            { label: "Household Size", value: String(people) + " people" },
            { label: "Bathrooms", value: String(bathrooms) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electricity-usage-calculator", "btu-calculator"],
  faq: [
    {
      question: "How do I choose a water heater size?",
      answer:
        "Base it on household size: 1-2 people need 30-40 gallons, 3-4 people need 40-50 gallons, and 5+ people need 50-80 gallons.",
    },
    {
      question: "How much hot water does a person use daily?",
      answer:
        "The average person uses about 20 gallons of hot water per day for showers, dishes, and laundry.",
    },
  ],
  formula:
    "1-2 people: 30-40 gal. 3-4 people: 40-50 gal. 5+ people: 50-80 gal. Adjust for extra bathrooms.",
};

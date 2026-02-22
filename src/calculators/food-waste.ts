import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const foodWasteCalculator: CalculatorDefinition = {
  slug: "food-waste-calculator",
  title: "Food Waste Cost Calculator",
  description:
    "Free food waste cost calculator. Estimate the financial and environmental cost of household food waste and savings from reducing it.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "food waste",
    "food waste cost",
    "food loss",
    "wasted food",
    "food waste reduction",
    "food waste environmental impact",
  ],
  variants: [
    {
      id: "household",
      name: "Household Food Waste",
      fields: [
        {
          name: "weeklyGrocery",
          label: "Weekly Grocery Spending ($)",
          type: "number",
          placeholder: "e.g. 150",
        },
        {
          name: "wastePercent",
          label: "Estimated Waste Level",
          type: "select",
          options: [
            { label: "Minimal (5%)", value: "0.05" },
            { label: "Below Average (10%)", value: "0.10" },
            { label: "Average (15%)", value: "0.15" },
            { label: "Above Average (25%)", value: "0.25" },
            { label: "High (35%)", value: "0.35" },
          ],
        },
        {
          name: "householdSize",
          label: "Household Size",
          type: "number",
          placeholder: "e.g. 3",
          defaultValue: 3,
        },
      ],
      calculate: (inputs) => {
        const weeklyGrocery = inputs.weeklyGrocery as number;
        const wastePercent = parseFloat((inputs.wastePercent as string) || "0.15");
        const householdSize = (inputs.householdSize as number) || 3;
        if (!weeklyGrocery) return null;

        const weeklyWasteDollars = weeklyGrocery * wastePercent;
        const annualWasteDollars = weeklyWasteDollars * 52;
        const perPerson = annualWasteDollars / householdSize;

        // Average food waste weight: ~$1 = 0.5 lbs of food
        const annualWasteLbs = annualWasteDollars * 0.5;
        const annualWasteKg = annualWasteLbs * 0.4536;

        // CO2 from food waste in landfill (3.8 kg CO2e per kg food waste)
        const co2Kg = annualWasteKg * 3.8;
        const co2Tons = co2Kg / 1000;

        // Water wasted (food production uses significant water)
        const waterGallons = annualWasteLbs * 50; // avg gallons per lb of food produced

        // Savings if reduced by half
        const savingsIfHalved = annualWasteDollars * 0.5;

        return {
          primary: {
            label: "Annual Food Waste Cost",
            value: "$" + formatNumber(annualWasteDollars, 0),
          },
          details: [
            { label: "Weekly Wasted", value: "$" + formatNumber(weeklyWasteDollars, 2) },
            { label: "Per Person/Year", value: "$" + formatNumber(perPerson, 0) },
            { label: "Food Wasted/Year", value: formatNumber(annualWasteLbs, 0) + " lbs" },
            { label: "CO2 from Waste", value: formatNumber(co2Tons, 3) + " metric tons" },
            { label: "Water Embedded in Waste", value: formatNumber(waterGallons, 0) + " gal" },
            { label: "Savings if Halved", value: "$" + formatNumber(savingsIfHalved, 0) + "/yr" },
          ],
          note: "The average American household wastes about $1,500 worth of food annually. Meal planning, proper storage, and using leftovers can dramatically reduce waste.",
        };
      },
    },
  ],
  relatedSlugs: ["composting-rate-calculator", "carbon-footprint-calculator"],
  faq: [
    {
      question: "How much food does the average household waste?",
      answer:
        "The average American household wastes about 30-40% of the food it purchases, amounting to roughly $1,500 per year. Globally, about one-third of all food produced is lost or wasted.",
    },
    {
      question: "What are the best ways to reduce food waste?",
      answer:
        "Plan meals before shopping, buy only what you need, store food properly, use FIFO (first in, first out), repurpose leftovers, understand expiration dates vs best-by dates, and compost unavoidable scraps.",
    },
  ],
  formula:
    "Annual Waste Cost = Weekly Grocery x Waste % x 52. Food Weight = Cost x 0.5 lbs/$. CO2 = Weight (kg) x 3.8 kg CO2e/kg. Water = Weight (lbs) x 50 gal/lb.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterUsageCalculator: CalculatorDefinition = {
  slug: "water-usage-calculator",
  title: "Water Usage Calculator",
  description: "Estimate household water consumption and monthly cost based on daily usage patterns.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["water usage calculator","water bill estimator","household water consumption"],
  variants: [{
    id: "standard",
    name: "Water Usage",
    description: "Estimate household water consumption and monthly cost based on daily usage patterns.",
    fields: [
      { name: "showerMinutes", label: "Shower Minutes Per Day", type: "number", min: 0, max: 120, defaultValue: 15 },
      { name: "toiletFlushes", label: "Toilet Flushes Per Day", type: "number", min: 0, max: 50, defaultValue: 10 },
      { name: "laundryLoads", label: "Laundry Loads Per Week", type: "number", min: 0, max: 30, defaultValue: 5 },
      { name: "waterRate", label: "Water Rate (per 1000 gallons)", type: "number", prefix: "$", min: 1, max: 50, defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const shower = inputs.showerMinutes as number;
      const flushes = inputs.toiletFlushes as number;
      const laundry = inputs.laundryLoads as number;
      const rate = inputs.waterRate as number;
      const showerGallons = shower * 2.5 * 30;
      const toiletGallons = flushes * 1.6 * 30;
      const laundryGallons = laundry * 30 * 4.3;
      const otherGallons = 50 * 30;
      const totalGallons = showerGallons + toiletGallons + laundryGallons + otherGallons;
      const monthlyCost = (totalGallons / 1000) * rate;
      return {
        primary: { label: "Monthly Water Usage", value: formatNumber(Math.round(totalGallons)) + " gallons" },
        details: [
          { label: "Monthly Water Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
          { label: "Shower Usage", value: formatNumber(Math.round(showerGallons)) + " gal/month" },
          { label: "Toilet Usage", value: formatNumber(Math.round(toiletGallons)) + " gal/month" },
          { label: "Laundry Usage", value: formatNumber(Math.round(laundryGallons)) + " gal/month" },
        ],
      };
    },
  }],
  relatedSlugs: ["rainwater-harvesting-calculator","electricity-cost-calculator"],
  faq: [
    { question: "How much water does the average American household use?", answer: "The average American household uses about 300 gallons of water per day, or roughly 9,000 gallons per month. Indoor use accounts for about 70% of total consumption." },
    { question: "What are the best ways to reduce water usage?", answer: "Install low-flow showerheads and faucets, fix leaks promptly, use efficient appliances, take shorter showers, and water lawns during cooler parts of the day to reduce evaporation." },
  ],
  formula: "Monthly Usage = (Shower GPM x Minutes x 30) + (Flushes x GPF x 30) + (Laundry Loads x Gallons x 4.3) + Other; Cost = Total Gallons / 1000 x Rate",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backpackingCost: CalculatorDefinition = {
  slug: "backpacking-cost",
  title: "Backpacking Cost Calculator",
  description:
    "Free online backpacking cost calculator. Estimate daily backpacking trip costs by country and travel style to plan your budget.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "backpacking",
    "travel budget",
    "backpacker cost",
    "daily travel cost",
    "budget travel",
  ],
  variants: [
    {
      id: "daily-cost",
      name: "Daily Backpacking Cost",
      fields: [
        {
          name: "country",
          label: "Destination Region",
          type: "select",
          options: [
            { label: "Southeast Asia", value: "sea" },
            { label: "South America", value: "sa" },
            { label: "Eastern Europe", value: "ee" },
            { label: "Western Europe", value: "we" },
            { label: "Central America", value: "ca" },
            { label: "India/Nepal", value: "india" },
            { label: "East Africa", value: "africa" },
            { label: "Australia/NZ", value: "aunz" },
            { label: "Japan/Korea", value: "japkor" },
            { label: "North America", value: "na" },
          ],
        },
        {
          name: "style",
          label: "Travel Style",
          type: "select",
          options: [
            { label: "Shoestring Budget", value: "shoestring" },
            { label: "Budget", value: "budget" },
            { label: "Mid-Range", value: "midrange" },
          ],
        },
        {
          name: "days",
          label: "Number of Days",
          type: "number",
          placeholder: "e.g. 30",
        },
      ],
      calculate: (inputs) => {
        const days = parseFloat(inputs.days as string) || 0;
        const country = inputs.country as string;
        const style = inputs.style as string;

        // Average daily costs in USD by region (shoestring/budget/midrange)
        const costs: Record<string, number[]> = {
          sea: [15, 30, 60],
          sa: [20, 40, 75],
          ee: [25, 45, 80],
          we: [40, 70, 120],
          ca: [20, 35, 65],
          india: [10, 25, 50],
          africa: [25, 45, 80],
          aunz: [45, 75, 130],
          japkor: [35, 60, 110],
          na: [40, 70, 120],
        };

        const styleIndex = style === "shoestring" ? 0 : style === "budget" ? 1 : 2;
        const dailyCost = (costs[country] || costs.sea)[styleIndex];
        const totalCost = dailyCost * days;

        // Breakdown estimates
        const accommodation = dailyCost * 0.35;
        const food = dailyCost * 0.30;
        const transport = dailyCost * 0.20;
        const activities = dailyCost * 0.15;

        return {
          primary: { label: "Total Trip Cost", value: "$" + formatNumber(totalCost, 2) },
          details: [
            { label: "Daily Budget", value: "$" + formatNumber(dailyCost, 2) },
            { label: "Accommodation/day", value: "$" + formatNumber(accommodation, 2) },
            { label: "Food/day", value: "$" + formatNumber(food, 2) },
            { label: "Transport/day", value: "$" + formatNumber(transport, 2) },
            { label: "Activities/day", value: "$" + formatNumber(activities, 2) },
            { label: "Trip Duration", value: formatNumber(days) + " days" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["travel-budget-daily", "camping-checklist-cost", "beach-vacation-cost"],
  faq: [
    {
      question: "How much does backpacking cost per day?",
      answer:
        "Daily backpacking costs vary greatly by region. Southeast Asia averages $15-60/day, Western Europe $40-120/day, and South America $20-75/day depending on your travel style.",
    },
    {
      question: "What is the cheapest region for backpacking?",
      answer:
        "India/Nepal and Southeast Asia are generally the cheapest regions, where a shoestring backpacker can spend as little as $10-15 per day including accommodation, food, and local transport.",
    },
    {
      question: "How can I reduce backpacking costs?",
      answer:
        "Stay in hostels or use Couchsurfing, eat local street food, use public transport, travel during off-season, and cook your own meals when possible.",
    },
  ],
  formula:
    "Total Cost = Daily Budget x Number of Days\nDaily Budget breakdown: 35% accommodation, 30% food, 20% transport, 15% activities",
};

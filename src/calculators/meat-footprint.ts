import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const meatFootprintCalculator: CalculatorDefinition = {
  slug: "meat-footprint-calculator",
  title: "Meat Consumption Carbon Footprint Calculator",
  description:
    "Free meat carbon footprint calculator. Estimate the CO2 emissions from your weekly meat and dairy consumption.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "meat carbon footprint",
    "food emissions",
    "beef carbon",
    "meat environmental impact",
    "diet carbon footprint",
    "livestock emissions",
  ],
  variants: [
    {
      id: "weekly",
      name: "Weekly Meat Consumption",
      fields: [
        {
          name: "beef",
          label: "Beef (servings per week)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "pork",
          label: "Pork (servings per week)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "chicken",
          label: "Chicken (servings per week)",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "fish",
          label: "Fish (servings per week)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "dairy",
          label: "Dairy (servings per week)",
          type: "number",
          placeholder: "e.g. 7",
        },
        {
          name: "servingSize",
          label: "Average Serving Size",
          type: "select",
          options: [
            { label: "Small (100g / 3.5 oz)", value: "100" },
            { label: "Medium (150g / 5.3 oz)", value: "150" },
            { label: "Large (200g / 7 oz)", value: "200" },
          ],
        },
      ],
      calculate: (inputs) => {
        const beef = (inputs.beef as number) || 0;
        const pork = (inputs.pork as number) || 0;
        const chicken = (inputs.chicken as number) || 0;
        const fish = (inputs.fish as number) || 0;
        const dairy = (inputs.dairy as number) || 0;
        const servingG = parseFloat((inputs.servingSize as string) || "150");
        if (!beef && !pork && !chicken && !fish && !dairy) return null;

        // kg CO2e per kg of product
        const co2PerKg: Record<string, number> = {
          beef: 27.0,
          pork: 12.1,
          chicken: 6.9,
          fish: 6.1,
          dairy: 3.2,
        };

        const servingKg = servingG / 1000;
        const weeklyBeefCO2 = beef * servingKg * co2PerKg.beef;
        const weeklyPorkCO2 = pork * servingKg * co2PerKg.pork;
        const weeklyChickenCO2 = chicken * servingKg * co2PerKg.chicken;
        const weeklyFishCO2 = fish * servingKg * co2PerKg.fish;
        const weeklyDairyCO2 = dairy * servingKg * co2PerKg.dairy;

        const weeklyCO2 = weeklyBeefCO2 + weeklyPorkCO2 + weeklyChickenCO2 + weeklyFishCO2 + weeklyDairyCO2;
        const annualCO2 = weeklyCO2 * 52;
        const annualTons = annualCO2 / 1000;
        const treesNeeded = Math.ceil(annualCO2 / 21);

        return {
          primary: {
            label: "Annual Food CO2",
            value: formatNumber(annualTons, 2) + " metric tons",
          },
          details: [
            { label: "Weekly CO2", value: formatNumber(weeklyCO2, 2) + " kg" },
            { label: "Beef Contribution", value: formatNumber(weeklyBeefCO2 * 52, 1) + " kg/yr" },
            { label: "Pork Contribution", value: formatNumber(weeklyPorkCO2 * 52, 1) + " kg/yr" },
            { label: "Chicken Contribution", value: formatNumber(weeklyChickenCO2 * 52, 1) + " kg/yr" },
            { label: "Fish Contribution", value: formatNumber(weeklyFishCO2 * 52, 1) + " kg/yr" },
            { label: "Dairy Contribution", value: formatNumber(weeklyDairyCO2 * 52, 1) + " kg/yr" },
            { label: "Trees Needed to Offset", value: formatNumber(treesNeeded, 0) },
          ],
          note: "Beef produces roughly 4x more emissions than chicken per serving. Reducing beef intake is one of the most impactful dietary changes for the environment.",
        };
      },
    },
  ],
  relatedSlugs: ["carbon-footprint-calculator", "calorie-calculator"],
  faq: [
    {
      question: "Why does beef have such a high carbon footprint?",
      answer:
        "Beef production requires large amounts of land, water, and feed. Cattle also produce methane through digestion (enteric fermentation), a greenhouse gas 28x more potent than CO2 over 100 years.",
    },
    {
      question: "How much CO2 can I save by going vegetarian?",
      answer:
        "Switching from a heavy meat diet to vegetarian can save approximately 0.5-0.8 metric tons of CO2 per year. Going fully vegan saves even more, up to 1.5 tons annually.",
    },
  ],
  formula:
    "Annual CO2 = Sum of (servings/week x serving size in kg x CO2e per kg) x 52 weeks. CO2e factors: Beef 27 kg, Pork 12.1 kg, Chicken 6.9 kg, Fish 6.1 kg, Dairy 3.2 kg per kg product.",
};

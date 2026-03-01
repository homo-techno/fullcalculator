import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dishwasherVsHandWashCalculator: CalculatorDefinition = {
  slug: "dishwasher-vs-hand-wash-calculator",
  title: "Dishwasher vs Hand Wash Calculator",
  description: "Compare the water and energy cost of using a dishwasher versus washing dishes by hand.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dishwasher vs hand wash", "dish washing cost", "dishwasher savings"],
  variants: [{
    id: "standard",
    name: "Dishwasher vs Hand Wash",
    description: "Compare the water and energy cost of using a dishwasher versus washing dishes by hand",
    fields: [
      { name: "loadsPerWeek", label: "Dish Loads per Week", type: "number", min: 1, max: 21, defaultValue: 7 },
      { name: "dishwasherType", label: "Dishwasher Type", type: "select", options: [{value:"standard",label:"Standard"},{value:"energy-star",label:"Energy Star"},{value:"old",label:"Older Model (10+ years)"}], defaultValue: "energy-star" },
      { name: "electricRate", label: "Electric Rate", type: "number", suffix: "cents/kWh", min: 5, max: 50, defaultValue: 13 },
      { name: "waterRate", label: "Water Rate", type: "number", suffix: "per 1000 gal", min: 1, max: 30, defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const loads = inputs.loadsPerWeek as number;
      const type = inputs.dishwasherType as string;
      const elecRate = inputs.electricRate as number;
      const waterRate = inputs.waterRate as number;
      if (!loads || !elecRate || !waterRate) return null;
      const dwWater: Record<string, number> = { standard: 6, "energy-star": 3.5, old: 10 };
      const dwKwh: Record<string, number> = { standard: 1.2, "energy-star": 0.9, old: 1.8 };
      const handWater = 27;
      const handKwh = 2.5;
      const monthlyLoads = loads * 4.33;
      const dwWaterCost = monthlyLoads * (dwWater[type] || 6) / 1000 * waterRate;
      const dwElecCost = monthlyLoads * (dwKwh[type] || 1.2) * (elecRate / 100);
      const hwWaterCost = monthlyLoads * handWater / 1000 * waterRate;
      const hwElecCost = monthlyLoads * handKwh * (elecRate / 100);
      const dwTotal = Math.round((dwWaterCost + dwElecCost) * 100) / 100;
      const hwTotal = Math.round((hwWaterCost + hwElecCost) * 100) / 100;
      const savings = Math.round((hwTotal - dwTotal) * 12);
      const winner = dwTotal < hwTotal ? "Dishwasher wins" : "Hand washing wins";
      return {
        primary: { label: "Winner", value: winner },
        details: [
          { label: "Dishwasher Monthly Cost", value: "$" + dwTotal.toFixed(2) },
          { label: "Hand Wash Monthly Cost", value: "$" + hwTotal.toFixed(2) },
          { label: "Annual Savings", value: "$" + formatNumber(Math.abs(savings)) },
        ],
      };
    },
  }],
  relatedSlugs: ["shower-water-usage-calculator", "laundry-schedule-calculator"],
  faq: [
    { question: "Is a dishwasher cheaper than hand washing?", answer: "Energy Star dishwashers use about 3.5 gallons per load versus 27 gallons for hand washing, making them significantly cheaper in most cases." },
    { question: "How much water does hand washing dishes use?", answer: "Hand washing a full load of dishes with running water uses about 27 gallons. Using a filled basin can reduce this to 8-10 gallons." },
  ],
  formula: "Monthly Cost = (Water per Load x Loads x Water Rate) + (kWh per Load x Loads x Electric Rate)",
};

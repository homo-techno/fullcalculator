import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const runningShoeMileageCalculator: CalculatorDefinition = {
  slug: "running-shoe-mileage-calculator",
  title: "Running Shoe Mileage Calculator",
  description: "Track running shoe wear and estimate remaining lifespan based on weekly mileage and shoe type.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["running shoe mileage","shoe replacement","shoe lifespan","running shoe tracker"],
  variants: [{
    id: "standard",
    name: "Running Shoe Mileage",
    description: "Track running shoe wear and estimate remaining lifespan based on weekly mileage and shoe type.",
    fields: [
      { name: "weeklyMiles", label: "Weekly Mileage", type: "number", min: 1, max: 150, defaultValue: 25 },
      { name: "currentMiles", label: "Current Miles on Shoes", type: "number", min: 0, max: 1000, defaultValue: 150 },
      { name: "shoeType", label: "Shoe Type", type: "select", options: [{ value: "350", label: "Lightweight Racing" }, { value: "450", label: "Standard Training" }, { value: "550", label: "Max Cushion / Trail" }], defaultValue: "450" },
      { name: "terrain", label: "Primary Terrain", type: "select", options: [{ value: "1", label: "Road" }, { value: "0.85", label: "Trail" }, { value: "1.1", label: "Treadmill" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const weeklyMiles = inputs.weeklyMiles as number;
    const currentMiles = inputs.currentMiles as number;
    const maxMiles = parseInt(inputs.shoeType as string);
    const terrainFactor = parseFloat(inputs.terrain as string);
    const adjustedMax = Math.round(maxMiles * terrainFactor);
    const remaining = Math.max(adjustedMax - currentMiles, 0);
    const weeksLeft = weeklyMiles > 0 ? Math.round(remaining / weeklyMiles) : 0;
    const wearPercent = Math.min(Math.round((currentMiles / adjustedMax) * 100), 100);
    return {
      primary: { label: "Remaining Shoe Life", value: formatNumber(remaining) + " miles" },
      details: [
        { label: "Weeks Until Replacement", value: formatNumber(weeksLeft) },
        { label: "Wear Percentage", value: formatNumber(wearPercent) + "%" },
        { label: "Adjusted Max Lifespan", value: formatNumber(adjustedMax) + " miles" }
      ]
    };
  },
  }],
  relatedSlugs: ["swim-pace-calculator","triathlon-transition-time-calculator"],
  faq: [
    { question: "How long do running shoes last?", answer: "Most running shoes last 300 to 500 miles. Lightweight racing shoes may wear out closer to 200 to 350 miles." },
    { question: "How do I know when to replace running shoes?", answer: "Replace shoes when you notice reduced cushioning, visible sole wear, or new aches and pains during runs." },
    { question: "Do trail shoes last longer?", answer: "Trail shoes often have more durable outsoles but the rough terrain can reduce overall lifespan compared to road running." },
  ],
  formula: "Remaining Miles = (Max Lifespan x Terrain Factor) - Current Miles; Weeks Left = Remaining / Weekly Mileage",
};

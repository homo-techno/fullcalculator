import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const saunaCostCalculator: CalculatorDefinition = {
  slug: "sauna-cost-calculator",
  title: "Sauna Cost Calculator",
  description: "Estimate the cost to install a home sauna including the unit, electrical work, and finishing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sauna cost", "home sauna cost", "sauna installation cost"],
  variants: [{
    id: "standard",
    name: "Sauna Cost",
    description: "Estimate the cost to install a home sauna including the unit, electrical work, and finishing",
    fields: [
      { name: "type", label: "Sauna Type", type: "select", options: [{value:"prefab",label:"Prefab Kit"},{value:"custom",label:"Custom Built"},{value:"infrared",label:"Infrared"}], defaultValue: "prefab" },
      { name: "size", label: "Capacity", type: "select", options: [{value:"2",label:"2 Person"},{value:"4",label:"4 Person"},{value:"6",label:"6 Person"}], defaultValue: "4" },
      { name: "location", label: "Location", type: "select", options: [{value:"indoor",label:"Indoor"},{value:"outdoor",label:"Outdoor"}], defaultValue: "indoor" },
    ],
    calculate: (inputs) => {
      const type = inputs.type as string;
      const size = parseInt(inputs.size as string) || 4;
      const location = inputs.location as string;
      const baseCost: Record<string, number> = { prefab: 3000, custom: 8000, infrared: 2000 };
      const sizeMultiplier: Record<number, number> = { 2: 0.7, 4: 1.0, 6: 1.4 };
      const unitCost = (baseCost[type] || 3000) * (sizeMultiplier[size] || 1.0);
      const electrical = type === "infrared" ? 500 : 1500;
      const ventilation = 600;
      const finishing = location === "indoor" ? 1200 : 800;
      const delivery = 300;
      const total = unitCost + electrical + ventilation + finishing + delivery;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Sauna Unit", value: "$" + formatNumber(unitCost) },
          { label: "Electrical Work", value: "$" + formatNumber(electrical) },
          { label: "Ventilation", value: "$" + formatNumber(ventilation) },
          { label: "Finishing and Prep", value: "$" + formatNumber(finishing) },
          { label: "Delivery", value: "$" + formatNumber(delivery) },
        ],
      };
    },
  }],
  relatedSlugs: ["sunroom-cost-calculator", "porch-cost-calculator"],
  faq: [
    { question: "How much does a home sauna cost?", answer: "An infrared sauna kit starts at $1,500 to $3,000. A prefab traditional sauna costs $3,000 to $6,000. Custom-built saunas range from $6,000 to $15,000 or more." },
    { question: "Is a home sauna worth it?", answer: "A home sauna can provide health benefits including stress relief, muscle recovery, and improved circulation. It can also increase your home value by $5,000 to $10,000." },
  ],
  formula: "Total = Unit Cost x Size Multiplier + Electrical + Ventilation + Finishing + Delivery",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carTintCostCalculator: CalculatorDefinition = {
  slug: "car-tint-cost-calculator",
  title: "Car Tint Cost Calculator",
  description: "Estimate window tinting costs for your vehicle based on number of windows, tint type, and vehicle size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car tint cost", "window tinting price", "auto tint cost"],
  variants: [{
    id: "standard",
    name: "Car Tint Cost",
    description: "Estimate window tinting costs for your vehicle based on number of windows, tint type, and vehicle size",
    fields: [
      { name: "vehicleType", label: "Vehicle Type", type: "select", options: [{value:"sedan",label:"Sedan"},{value:"suv",label:"SUV/Truck"},{value:"coupe",label:"Coupe"}], defaultValue: "sedan" },
      { name: "tintType", label: "Tint Type", type: "select", options: [{value:"dyed",label:"Dyed Film"},{value:"carbon",label:"Carbon Film"},{value:"ceramic",label:"Ceramic Film"}], defaultValue: "dyed" },
      { name: "windows", label: "Number of Windows", type: "number", min: 2, max: 10, defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const vehicle = inputs.vehicleType as string;
      const tint = inputs.tintType as string;
      const windows = inputs.windows as number;
      if (!windows || windows <= 0) return null;
      const sizeMult: Record<string, number> = { sedan: 1.0, suv: 1.3, coupe: 0.85 };
      const tintRate: Record<string, number> = { dyed: 40, carbon: 70, ceramic: 110 };
      const perWindow = (tintRate[tint] || 40) * (sizeMult[vehicle] || 1.0);
      const total = perWindow * windows;
      return {
        primary: { label: "Estimated Tint Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Cost per Window", value: "$" + formatNumber(Math.round(perWindow)) },
          { label: "Number of Windows", value: String(windows) },
          { label: "Tint Type", value: tint.charAt(0).toUpperCase() + tint.slice(1) },
        ],
      };
    },
  }],
  relatedSlugs: ["car-wrap-cost-calculator", "car-shipping-cost-calculator"],
  faq: [
    { question: "How much does car window tinting cost?", answer: "Basic dyed film costs $150-$300, carbon film $250-$500, and ceramic film $400-$800 for a full vehicle." },
    { question: "Which car tint is best?", answer: "Ceramic film offers the best heat rejection and UV protection but costs the most. Carbon film is a good mid-range option." },
  ],
  formula: "Total = Cost per Window x Number of Windows (adjusted by vehicle size and film type)",
};

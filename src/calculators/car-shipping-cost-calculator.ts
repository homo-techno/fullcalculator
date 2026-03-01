import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carShippingCostCalculator: CalculatorDefinition = {
  slug: "car-shipping-cost-calculator",
  title: "Car Shipping Cost Calculator",
  description: "Calculate the estimated cost of shipping a vehicle based on distance, transport type, and vehicle size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car shipping cost", "auto transport cost", "vehicle shipping price"],
  variants: [{
    id: "standard",
    name: "Car Shipping Cost",
    description: "Calculate the estimated cost of shipping a vehicle based on distance, transport type, and vehicle size",
    fields: [
      { name: "distance", label: "Shipping Distance", type: "number", suffix: "miles", min: 50, max: 5000, defaultValue: 1000 },
      { name: "vehicleType", label: "Vehicle Type", type: "select", options: [{value:"sedan",label:"Sedan"},{value:"suv",label:"SUV/Truck"},{value:"luxury",label:"Luxury/Exotic"}], defaultValue: "sedan" },
      { name: "transport", label: "Transport Type", type: "select", options: [{value:"open",label:"Open Carrier"},{value:"enclosed",label:"Enclosed Carrier"}], defaultValue: "open" },
    ],
    calculate: (inputs) => {
      const dist = inputs.distance as number;
      const vehicle = inputs.vehicleType as string;
      const transport = inputs.transport as string;
      if (!dist || dist <= 0) return null;
      const baseRate = dist < 500 ? 1.0 : dist < 1500 ? 0.75 : 0.58;
      const vehicleMult: Record<string, number> = { sedan: 1.0, suv: 1.25, luxury: 1.5 };
      const transportMult: Record<string, number> = { open: 1.0, enclosed: 1.6 };
      const base = dist * baseRate;
      const total = base * (vehicleMult[vehicle] || 1.0) * (transportMult[transport] || 1.0);
      const perMile = total / dist;
      return {
        primary: { label: "Estimated Shipping Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Distance", value: formatNumber(dist) + " miles" },
          { label: "Cost per Mile", value: "$" + perMile.toFixed(2) },
          { label: "Transport Type", value: transport === "enclosed" ? "Enclosed" : "Open" },
        ],
      };
    },
  }],
  relatedSlugs: ["car-wrap-cost-calculator", "car-depreciation-schedule-calculator"],
  faq: [
    { question: "How much does it cost to ship a car?", answer: "Shipping a sedan on an open carrier costs roughly $500-$1,200 for distances under 1,500 miles." },
    { question: "Is enclosed car shipping worth it?", answer: "Enclosed shipping costs 40-60% more but protects from weather and road debris. It is recommended for luxury or classic cars." },
  ],
  formula: "Cost = Distance x Base Rate x Vehicle Multiplier x Transport Multiplier",
};

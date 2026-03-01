import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carportCostCalculator: CalculatorDefinition = {
  slug: "carport-cost-calculator",
  title: "Carport Cost Calculator",
  description: "Estimate the cost of building a carport including materials, foundation, and installation.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["carport cost", "carport building cost", "metal carport cost"],
  variants: [{
    id: "standard",
    name: "Carport Cost",
    description: "Estimate the cost of building a carport including materials, foundation, and installation",
    fields: [
      { name: "cars", label: "Number of Cars", type: "select", options: [{value:"1",label:"1 Car"},{value:"2",label:"2 Cars"},{value:"3",label:"3 Cars"}], defaultValue: "2" },
      { name: "material", label: "Material", type: "select", options: [{value:"metal",label:"Metal/Steel"},{value:"wood",label:"Wood"},{value:"aluminum",label:"Aluminum"}], defaultValue: "metal" },
      { name: "attached", label: "Attached to House?", type: "select", options: [{value:"yes",label:"Yes"},{value:"no",label:"Freestanding"}], defaultValue: "no" },
    ],
    calculate: (inputs) => {
      const cars = parseInt(inputs.cars as string) || 2;
      const mat = inputs.material as string;
      const attached = inputs.attached as string;
      const sqft = cars * 12 * 20;
      const matRate: Record<string, number> = { metal: 15, wood: 25, aluminum: 30 };
      const rate = matRate[mat] || 20;
      const base = sqft * rate;
      const attachMod = attached === "yes" ? 0.8 : 1.0;
      const foundation = sqft * 8;
      const total = base * attachMod + foundation;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Size", value: sqft + " sq ft (" + cars + " car)" },
          { label: "Structure", value: "$" + formatNumber(base * attachMod) },
          { label: "Foundation", value: "$" + formatNumber(foundation) },
        ],
      };
    },
  }],
  relatedSlugs: ["garage-door-cost-calculator", "driveway-cost-calculator"],
  faq: [
    { question: "How much does a carport cost?", answer: "A basic metal carport costs $3,000-$6,000 for a single car and $6,000-$12,000 for two cars." },
    { question: "Is a carport cheaper than a garage?", answer: "Yes, carports typically cost 50-70% less than an enclosed garage of the same size." },
  ],
  formula: "Total = (Sq Ft x Material Rate x Attachment Modifier) + Foundation",
};

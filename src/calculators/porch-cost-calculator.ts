import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const porchCostCalculator: CalculatorDefinition = {
  slug: "porch-cost-calculator",
  title: "Porch Cost Calculator",
  description: "Calculate the cost to build or renovate a front or back porch including materials and labor.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["porch cost", "porch building cost", "front porch cost"],
  variants: [{
    id: "standard",
    name: "Porch Cost",
    description: "Calculate the cost to build or renovate a front or back porch including materials and labor",
    fields: [
      { name: "sqft", label: "Porch Area", type: "number", suffix: "sq ft", min: 20, max: 800, defaultValue: 150 },
      { name: "type", label: "Porch Type", type: "select", options: [{value:"open",label:"Open Porch"},{value:"covered",label:"Covered Porch"},{value:"wraparound",label:"Wraparound"}], defaultValue: "covered" },
      { name: "material", label: "Decking Material", type: "select", options: [{value:"wood",label:"Pressure-Treated Wood"},{value:"composite",label:"Composite"},{value:"pvc",label:"PVC"}], defaultValue: "wood" },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const type = inputs.type as string;
      const mat = inputs.material as string;
      if (!sqft || sqft <= 0) return null;
      const typeRate: Record<string, number> = { open: 30, covered: 60, wraparound: 50 };
      const matRate: Record<string, number> = { wood: 15, composite: 30, pvc: 35 };
      const labor = sqft * (typeRate[type] || 50);
      const materials = sqft * (matRate[mat] || 20);
      const railing = Math.sqrt(sqft) * 4 * 25;
      const total = labor + materials + railing;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Labor", value: "$" + formatNumber(labor) },
          { label: "Decking material", value: "$" + formatNumber(materials) },
          { label: "Railing estimate", value: "$" + formatNumber(railing) },
        ],
      };
    },
  }],
  relatedSlugs: ["deck-cost-calculator", "screened-porch-calculator"],
  faq: [
    { question: "How much does a porch cost?", answer: "An open porch costs $15-30 per sq ft while a covered porch costs $40-80 per sq ft depending on materials." },
    { question: "What is the best porch material?", answer: "Composite decking is durable and low-maintenance but costs more. Pressure-treated wood is the most affordable option." },
  ],
  formula: "Total = Labor + Materials + Railing",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const powerOfAttorneyCostCalculator: CalculatorDefinition = {
  slug: "power-of-attorney-cost-calculator",
  title: "Power of Attorney Cost Calculator",
  description: "Estimate the legal costs for establishing a power of attorney document based on type and preparation method.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["power of attorney cost", "POA cost", "legal power of attorney fees"],
  variants: [{
    id: "standard",
    name: "Power of Attorney Cost",
    description: "Estimate the legal costs for establishing a power of attorney document based on type and preparation method",
    fields: [
      { name: "poaType", label: "Type of POA", type: "select", options: [{value:"financial",label:"Financial POA"},{value:"healthcare",label:"Healthcare POA"},{value:"both",label:"Both Financial and Healthcare"},{value:"durable",label:"Durable POA"}], defaultValue: "both" },
      { name: "prepMethod", label: "Preparation Method", type: "select", options: [{value:"online",label:"Online Legal Service"},{value:"attorney",label:"Attorney Prepared"},{value:"selfFile",label:"Self-Prepared with Notary"}], defaultValue: "attorney" },
      { name: "state", label: "Notary and Filing Complexity", type: "select", options: [{value:"low",label:"Low Cost State"},{value:"medium",label:"Medium Cost State"},{value:"high",label:"High Cost State"}], defaultValue: "medium" },
    ],
    calculate: (inputs) => {
      const poaType = inputs.poaType as string;
      const method = inputs.prepMethod as string;
      const costLevel = inputs.state as string;
      const typeCosts: Record<string, number> = { financial: 1, healthcare: 1, both: 1.6, durable: 1.2 };
      const methodCosts: Record<string, number> = { online: 150, attorney: 500, selfFile: 50 };
      const stateMod: Record<string, number> = { low: 0.8, medium: 1.0, high: 1.3 };
      const baseCost = (methodCosts[method] || 500) * (typeCosts[poaType] || 1) * (stateMod[costLevel] || 1);
      const notaryFee = 25;
      const totalCost = baseCost + notaryFee;
      return {
        primary: { label: "Estimated POA Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Legal Preparation Fee", value: "$" + formatNumber(Math.round(baseCost)) },
          { label: "Notary Fee", value: "$" + formatNumber(notaryFee) },
          { label: "Preparation Method", value: method === "attorney" ? "Attorney" : method === "online" ? "Online Service" : "Self-Prepared" },
        ],
      };
    },
  }],
  relatedSlugs: ["estate-tax-calculator", "prenup-cost-calculator"],
  faq: [
    { question: "How much does a power of attorney cost?", answer: "A power of attorney can cost anywhere from $50 for a self-prepared document to $500 or more when prepared by an attorney, depending on complexity." },
    { question: "What is the difference between a regular and durable POA?", answer: "A regular POA becomes invalid if you become incapacitated, while a durable POA remains in effect even if you lose the ability to make decisions for yourself." },
  ],
  formula: "Total Cost = Base Preparation Fee x Type Multiplier x State Modifier + Notary Fee",
};

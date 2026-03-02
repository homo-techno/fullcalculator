import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const firewoodBtuCalculator: CalculatorDefinition = {
  slug: "firewood-btu-calculator",
  title: "Firewood BTU Calculator",
  description: "Estimate BTU output by wood type and volume.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["firewood btu","wood heat output"],
  variants: [{
    id: "standard",
    name: "Firewood BTU",
    description: "Estimate BTU output by wood type and volume.",
    fields: [
      { name: "woodType", label: "Wood Type", type: "select", options: [{ value: "20", label: "Oak (20M BTU/cord)" }, { value: "18", label: "Maple (18M BTU/cord)" }, { value: "15", label: "Pine (15M BTU/cord)" }, { value: "17", label: "Birch (17M BTU/cord)" }], defaultValue: "20" },
      { name: "cords", label: "Number of Cords", type: "number", min: 0.25, max: 50, defaultValue: 2 },
      { name: "efficiency", label: "Stove Efficiency (%)", type: "number", min: 30, max: 95, defaultValue: 75 },
    ],
    calculate: (inputs) => {
      const btuPerCord = Number(inputs.woodType as number);
      const c = inputs.cords as number;
      const eff = inputs.efficiency as number;
      const totalBtu = btuPerCord * 1000000 * c;
      const usable = totalBtu * (eff / 100);
      return {
        primary: { label: "Usable BTU", value: formatNumber(Math.round(usable)) },
        details: [
          { label: "Gross BTU", value: formatNumber(Math.round(totalBtu)) },
          { label: "Heat Lost", value: formatNumber(Math.round(totalBtu - usable)) + " BTU" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "Which wood produces the most heat?", answer: "Hardwoods like oak and hickory produce the most BTU per cord." },
    { question: "What is a cord of wood?", answer: "A cord is a stack of wood measuring 4 by 4 by 8 feet." },
  ],
  formula: "Usable BTU = BTU/cord x Cords x Efficiency/100",
};

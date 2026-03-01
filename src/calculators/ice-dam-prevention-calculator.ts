import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const iceDamPreventionCalculator: CalculatorDefinition = {
  slug: "ice-dam-prevention-calculator",
  title: "Ice Dam Prevention Calculator",
  description: "Estimate the cost and materials needed to prevent ice dams on your roof.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ice dam prevention", "ice dam cost", "roof ice prevention"],
  variants: [{
    id: "standard",
    name: "Ice Dam Prevention",
    description: "Estimate the cost and materials needed to prevent ice dams on your roof",
    fields: [
      { name: "roofEdge", label: "Roof Edge Length", type: "number", suffix: "feet", min: 10, max: 500, defaultValue: 80 },
      { name: "method", label: "Prevention Method", type: "select", options: [{value:"cables",label:"Heat Cables"},{value:"membrane",label:"Ice/Water Shield Membrane"},{value:"ventilation",label:"Improved Ventilation"},{value:"all",label:"All Methods"}], defaultValue: "cables" },
      { name: "stories", label: "Number of Stories", type: "select", options: [{value:"1",label:"1 Story"},{value:"2",label:"2 Stories"},{value:"3",label:"3 Stories"}], defaultValue: "2" },
    ],
    calculate: (inputs) => {
      const edge = inputs.roofEdge as number;
      const method = inputs.method as string;
      const stories = parseInt(inputs.stories as string);
      if (!edge || edge <= 0) return null;
      const cableCost = edge * 8;
      const membraneCost = edge * 3 * 15;
      const ventCost = 1500;
      const storyMult = 1 + (stories - 1) * 0.25;
      let total = 0;
      if (method === "cables") total = cableCost;
      else if (method === "membrane") total = membraneCost;
      else if (method === "ventilation") total = ventCost;
      else total = cableCost + membraneCost + ventCost;
      total = Math.round(total * storyMult);
      const annualEnergy = method === "cables" || method === "all" ? Math.round(edge * 0.5 * 4 * 0.12 * 120) : 0;
      return {
        primary: { label: "Prevention Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Roof Edge", value: formatNumber(edge) + " ft" },
          { label: "Annual Energy Cost", value: annualEnergy > 0 ? "$" + formatNumber(annualEnergy) : "N/A" },
          { label: "Height Factor", value: storyMult.toFixed(2) + "x" },
        ],
      };
    },
  }],
  relatedSlugs: ["snow-load-roof-calculator", "winter-heating-cost-calculator"],
  faq: [
    { question: "How do you prevent ice dams?", answer: "The most effective prevention combines proper attic insulation, adequate ventilation, and heat cables along the roof edge and gutters." },
    { question: "How much do heat cables cost?", answer: "Heat cables typically cost $5-$12 per linear foot installed, plus ongoing electricity costs of $30-$100 per season." },
  ],
  formula: "Cost = Method Base Cost x Roof Edge Length x Story Multiplier",
};

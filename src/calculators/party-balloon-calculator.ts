import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const partyBalloonCalculator: CalculatorDefinition = {
  slug: "party-balloon-calculator",
  title: "Party Balloon Calculator",
  description: "Calculate balloons needed for event decoration.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["party balloons","balloon count","decoration balloons"],
  variants: [{
    id: "standard",
    name: "Party Balloon",
    description: "Calculate balloons needed for event decoration.",
    fields: [
      { name: "tables", label: "Number of Tables", type: "number", min: 0, max: 100, defaultValue: 10 },
      { name: "balloonsPerTable", label: "Balloons per Table", type: "number", min: 1, max: 20, defaultValue: 5 },
      { name: "archBalloons", label: "Arch Balloons", type: "number", min: 0, max: 500, defaultValue: 100 },
      { name: "costPer", label: "Cost per Balloon ($)", type: "number", min: 0, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const tables = inputs.tables as number;
      const perTable = inputs.balloonsPerTable as number;
      const arch = inputs.archBalloons as number;
      const cost = inputs.costPer as number;
      const tableBalloons = tables * perTable;
      const total = tableBalloons + arch;
      const totalCost = total * cost;
      return {
        primary: { label: "Total Balloons", value: formatNumber(total) },
        details: [
          { label: "Table Balloons", value: formatNumber(tableBalloons) },
          { label: "Arch Balloons", value: formatNumber(arch) },
          { label: "Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        ],
      };
  },
  }],
  relatedSlugs: ["event-tent-size-calculator","event-catering-calculator"],
  faq: [
    { question: "How many balloons for a balloon arch?", answer: "A standard arch needs 80 to 120 balloons depending on size." },
    { question: "How many balloons per table?", answer: "Use 3 to 5 balloons per table centerpiece cluster." },
  ],
  formula: "Total = (Tables x Balloons per Table) + Arch Balloons",
};

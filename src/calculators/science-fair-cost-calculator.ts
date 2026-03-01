import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const scienceFairCostCalculator: CalculatorDefinition = {
  slug: "science-fair-cost-calculator",
  title: "Science Fair Project Cost Calculator",
  description: "Estimate the budget for a science fair project based on category, complexity, and display needs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["science fair budget", "science project cost", "school project expenses"],
  variants: [{
    id: "standard",
    name: "Science Fair Project Cost",
    description: "Estimate the budget for a science fair project based on category, complexity, and display needs",
    fields: [
      { name: "category", label: "Project Category", type: "select", options: [{value:"biology",label:"Biology/Life Science"},{value:"chemistry",label:"Chemistry"},{value:"physics",label:"Physics/Engineering"},{value:"earth",label:"Earth/Environmental"}], defaultValue: "biology" },
      { name: "complexity", label: "Project Complexity", type: "select", options: [{value:"basic",label:"Basic (Elementary)"},{value:"intermediate",label:"Intermediate (Middle School)"},{value:"advanced",label:"Advanced (High School)"}], defaultValue: "intermediate" },
      { name: "displayBoard", label: "Display Board Type", type: "select", options: [{value:"basic",label:"Basic Tri-Fold"},{value:"printed",label:"Printed Poster"},{value:"premium",label:"Premium Display"}], defaultValue: "basic" },
    ],
    calculate: (inputs) => {
      const category = inputs.category as string;
      const complexity = inputs.complexity as string;
      const display = inputs.displayBoard as string;
      const materialCost: Record<string, number> = { biology: 20, chemistry: 35, physics: 30, earth: 15 };
      const complexityMult: Record<string, number> = { basic: 1.0, intermediate: 1.8, advanced: 3.0 };
      const displayCost: Record<string, number> = { basic: 10, printed: 35, premium: 60 };
      const materials = (materialCost[category] || 20) * (complexityMult[complexity] || 1.8);
      const displayTotal = displayCost[display] || 10;
      const supplies = 15;
      const total = materials + displayTotal + supplies;
      return {
        primary: { label: "Estimated Project Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Materials", value: "$" + formatNumber(Math.round(materials)) },
          { label: "Display Board", value: "$" + formatNumber(Math.round(displayTotal)) },
          { label: "General Supplies", value: "$" + formatNumber(supplies) },
        ],
      };
    },
  }],
  relatedSlugs: ["reading-level-calculator", "extracurricular-cost-calculator"],
  faq: [
    { question: "How much does a science fair project cost?", answer: "Simple projects cost $15-$30. Intermediate projects average $40-$80. Advanced projects can cost $100 or more." },
    { question: "How can I save money on a science fair project?", answer: "Use household items when possible, borrow equipment, check for school supply grants, and use a basic tri-fold display board." },
  ],
  formula: "Total Cost = Material Cost x Complexity Factor + Display Board + General Supplies",
};

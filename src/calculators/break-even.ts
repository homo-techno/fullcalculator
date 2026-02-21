import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breakEvenCalculator: CalculatorDefinition = {
  slug: "break-even-calculator",
  title: "Break Even Calculator",
  description: "Free break even calculator. Find when your business becomes profitable. Calculate break even point in units and revenue.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["break even calculator", "break even point", "break even analysis", "BEP calculator", "breakeven calculator"],
  variants: [
    {
      id: "units",
      name: "Break Even Point",
      fields: [
        { name: "fixedCosts", label: "Fixed Costs (per period)", type: "number", placeholder: "e.g. 10000", prefix: "$" },
        { name: "pricePerUnit", label: "Selling Price per Unit", type: "number", placeholder: "e.g. 50", prefix: "$" },
        { name: "costPerUnit", label: "Variable Cost per Unit", type: "number", placeholder: "e.g. 30", prefix: "$" },
      ],
      calculate: (inputs) => {
        const fixed = inputs.fixedCosts as number;
        const price = inputs.pricePerUnit as number;
        const variable = (inputs.costPerUnit as number) || 0;
        if (!fixed || !price || price <= variable) return null;
        const contribution = price - variable;
        const bepUnits = fixed / contribution;
        const bepRevenue = bepUnits * price;
        const marginPct = (contribution / price) * 100;
        return {
          primary: { label: "Break Even Point", value: `${Math.ceil(bepUnits)} units` },
          details: [
            { label: "Break even revenue", value: `$${formatNumber(bepRevenue)}` },
            { label: "Contribution margin/unit", value: `$${formatNumber(contribution)}` },
            { label: "Contribution margin %", value: `${formatNumber(marginPct)}%` },
            { label: "Units to profit $10k", value: `${Math.ceil((fixed + 10000) / contribution)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["margin-calculator", "roi-calculator", "percentage-calculator"],
  faq: [
    { question: "What is break even point?", answer: "The break even point is when total revenue equals total costs (zero profit). BEP (units) = Fixed Costs / (Price - Variable Cost per Unit). Below BEP you lose money; above BEP you profit." },
  ],
  formula: "BEP (units) = Fixed Costs / (Price - Variable Cost) | BEP ($) = BEP units × Price",
};

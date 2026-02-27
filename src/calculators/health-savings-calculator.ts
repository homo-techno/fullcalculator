import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const healthSavingsCalculator: CalculatorDefinition = {
  slug: "health-savings-calculator",
  title: "Health Savings Calculator",
  description: "Free health savings calculator. Estimate medical and healthcare costs.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["health savings calculator", "medical cost", "healthcare calculator"],
  variants: [{
    id: "standard",
    name: "Health Savings",
    description: "Estimate healthcare costs",
    fields: [
      { name: "baseCost", label: "Base Cost", type: "number", placeholder: "e.g. 500", prefix: "$", min: 0 },
      { name: "insurance", label: "Insurance Coverage", type: "number", placeholder: "e.g. 80", suffix: "%", min: 0, max: 100, defaultValue: 80 },
      { name: "visits", label: "Number of Visits", type: "number", placeholder: "e.g. 1", min: 1, max: 100 },
    ],
    calculate: (inputs)=>{const base=inputs.baseCost as number;const ins=(inputs.insurance as number)/100;const visits=inputs.visits as number||1;if(!base)return null;const covered=base*ins;const oop=base-covered;const total=oop*visits;return{primary:{label:"Out of Pocket",value:"$"+formatNumber(total)},details:[{label:"Per visit cost",value:"$"+formatNumber(base)},{label:"Insurance covers",value:"$"+formatNumber(covered)},{label:"Your cost per visit",value:"$"+formatNumber(oop)},{label:"Annual total",value:"$"+formatNumber(total)}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How much does health savings cost?", answer: "Costs vary significantly by location, provider, and insurance. This provides average estimates for planning." },
    { question: "Will my insurance cover this?", answer: "Coverage depends on your specific plan, deductible status, and whether the provider is in-network. Contact your insurer for details." },
  ],
  formula: "Out of Pocket = Base Cost x (1 - Insurance Coverage) x Visits",
};

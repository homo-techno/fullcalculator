import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const earthquakeInsuranceCalculator: CalculatorDefinition = {
  slug: "earthquake-insurance-calculator",
  title: "Earthquake Insurance Calculator",
  description: "Free earthquake insurance calculator. Estimate insurance premiums and coverage needs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["earthquake insurance calculator", "insurance calculator", "premium estimator"],
  variants: [{
    id: "standard",
    name: "Earthquake Insurance",
    description: "Insurance cost estimation",
    fields: [
      { name: "coverage", label: "Coverage Amount", type: "number", placeholder: "e.g. 250000", prefix: "$", min: 0 },
      { name: "age", label: "Age", type: "number", placeholder: "e.g. 35", min: 18, max: 100 },
      { name: "deductible", label: "Deductible", type: "select", defaultValue: "1000", options: [{label:"$500",value:"500"},{label:"$1000",value:"1000"},{label:"$2500",value:"2500"},{label:"$5000",value:"5000"}] },
    ],
    calculate: (inputs)=>{const cov=inputs.coverage as number;const age=inputs.age as number;const ded=parseFloat(inputs.deductible as string)||1000;if(!cov||!age)return null;const baseRate=cov*0.005;const ageFactor=1+Math.max(0,(age-30)*0.02);const dedDiscount=1-(ded-500)/10000;const annual=baseRate*ageFactor*dedDiscount;const monthly=annual/12;return{primary:{label:"Monthly Premium",value:"$"+formatNumber(monthly)},details:[{label:"Annual premium",value:"$"+formatNumber(annual)},{label:"Coverage",value:"$"+formatNumber(cov)},{label:"Deductible",value:"$"+formatNumber(ded)},{label:"Age factor",value:formatNumber(ageFactor)+"x"}]};},
  }],
  relatedSlugs: ["compound-interest-calculator"],
  faq: [
    { question: "How much insurance do I need?", answer: "Coverage needs depend on your assets, income, dependents, and risk exposure. This calculator provides general estimates." },
    { question: "How can I lower my premium?", answer: "Higher deductibles, bundling policies, maintaining good credit, and shopping around can reduce premiums." },
  ],
  formula: "Premium = Coverage x Base Rate x Age Factor x Deductible Discount",
};

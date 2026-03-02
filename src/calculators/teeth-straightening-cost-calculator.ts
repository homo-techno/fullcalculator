import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const teethStraighteningCostCalculator: CalculatorDefinition = {
  slug: "teeth-straightening-cost-calculator",
  title: "Teeth Straightening Cost Calculator",
  description: "Compare aligner and braces costs for teeth straightening.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["teeth straightening cost","braces cost","aligner cost","invisalign cost"],
  variants: [{
    id: "standard",
    name: "Teeth Straightening Cost",
    description: "Compare aligner and braces costs for teeth straightening.",
    fields: [
      { name: "method", label: "Treatment Method", type: "select", options: [{ value: "5000", label: "Metal Braces" }, { value: "6000", label: "Ceramic Braces" }, { value: "5500", label: "Clear Aligners" }, { value: "7000", label: "Lingual Braces" }] },
      { name: "duration", label: "Treatment Duration (months)", type: "number", min: 6, max: 36, defaultValue: 18 },
      { name: "insurance", label: "Insurance Coverage ($)", type: "number", min: 0, max: 3000, defaultValue: 1500 },
      { name: "retainerCost", label: "Retainer Cost ($)", type: "number", min: 100, max: 1000, defaultValue: 300 },
    ],
    calculate: (inputs) => {
    const method = parseInt(inputs.method as string);
    const duration = inputs.duration as number;
    const insurance = inputs.insurance as number;
    const retainerCost = inputs.retainerCost as number;
    const totalTreatment = method + retainerCost;
    const outOfPocket = Math.max(totalTreatment - insurance, 0);
    const monthlyCost = outOfPocket / duration;
    return {
      primary: { label: "Out of Pocket Cost", value: "$" + formatNumber(outOfPocket) },
      details: [
        { label: "Total Treatment Cost", value: "$" + formatNumber(totalTreatment) },
        { label: "Insurance Coverage", value: "$" + formatNumber(insurance) },
        { label: "Monthly Payment", value: "$" + formatNumber(monthlyCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["cosmetic-surgery-cost-calculator","botox-cost-calculator"],
  faq: [
    { question: "How much do braces cost?", answer: "Metal braces cost $3000 to $7000. Clear aligners cost $3000 to $8000." },
    { question: "Are clear aligners cheaper than braces?", answer: "They are similar in cost, though complex cases may cost more with aligners." },
    { question: "Does insurance cover teeth straightening?", answer: "Many dental plans cover $1000 to $2000 for orthodontic treatment." },
  ],
  formula: "Out of Pocket = (Treatment Cost + Retainer) - Insurance Coverage",
};

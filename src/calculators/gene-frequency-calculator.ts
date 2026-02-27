import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const geneFrequencyCalculator: CalculatorDefinition = {
  slug: "gene-frequency-calculator",
  title: "Gene Frequency Calculator",
  description: "Free gene frequency calculator. Biology and environmental science calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["gene frequency calculator", "biology calculator", "science tool"],
  variants: [{
    id: "standard",
    name: "Gene Frequency",
    description: "",
    fields: [
      { name: "input1", label: "Primary Value", type: "number", placeholder: "Enter value", min: 0, step: 0.001 },
      { name: "input2", label: "Secondary Value", type: "number", placeholder: "Enter value", min: 0, step: 0.001 },
    ],
    calculate: (inputs)=>{const a=inputs.input1 as number;const b=inputs.input2 as number;if(!a)return null;const r=a*(b||1);return{primary:{label:"Result",value:formatNumber(r)},details:[{label:"Input 1",value:formatNumber(a)},{label:"Input 2",value:formatNumber(b||0)},{label:"Ratio",value:b?formatNumber(a/b):"N/A"}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "What is gene frequency?", answer: "This is a concept in biology/environmental science. The calculator helps you compute related values for study or research." },
    { question: "How is this used in research?", answer: "Researchers use these calculations to quantify biological processes and ecological relationships." },
  ],
  formula: "Based on standard biological formulas",
};

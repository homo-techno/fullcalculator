import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const divorceSettlementCalculator: CalculatorDefinition = {
  slug: "divorce-settlement-calculator",
  title: "Divorce Settlement Calculator",
  description: "Free divorce settlement calculator. Estimate asset division",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["divorce settlement calculator", "legal calculator", "law calculator"],
  variants: [{
    id: "standard",
    name: "Divorce Settlement",
    description: "Estimate asset division",
    fields: [
      { name: "amount", label: "Claim Amount", type: "number", placeholder: "e.g. 50000", prefix: "$", min: 0 },
      { name: "fee", label: "Fee Percentage", type: "number", placeholder: "e.g. 33", suffix: "%", min: 0, max: 50, defaultValue: 33 },
      { name: "duration", label: "Duration (months)", type: "number", placeholder: "e.g. 12", suffix: "months", min: 1, max: 60 },
    ],
    calculate: (inputs)=>{const a=inputs.amount as number;const f=(inputs.fee as number)/100;const d=inputs.duration as number||12;if(!a)return null;const fee=a*f;const net=a-fee;const monthly=net/d;return{primary:{label:"Net Amount",value:"$"+formatNumber(net)},details:[{label:"Gross amount",value:"$"+formatNumber(a)},{label:"Fees",value:"$"+formatNumber(fee)},{label:"Monthly",value:"$"+formatNumber(monthly)}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How accurate are legal cost estimates?", answer: "These are rough estimates only. Actual legal costs vary significantly. Consult an attorney for accurate quotes." },
    { question: "Should I hire a lawyer?", answer: "For significant legal matters, consulting with an attorney is strongly recommended. Many offer free initial consultations." },
  ],
  formula: "Based on standard legal fee structures",
};

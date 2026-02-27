import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const childCustodyCalculator: CalculatorDefinition = {
  slug: "child-custody-calculator",
  title: "Child Custody Calculator",
  description: "Free child custody calculator. Calculate custody time percentages",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["child custody calculator", "legal calculator", "law calculator"],
  variants: [{
    id: "standard",
    name: "Child Custody",
    description: "Calculate custody time percentages",
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

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lawsuitSettlementCalculator: CalculatorDefinition = {
  slug: "lawsuit-settlement-calculator",
  title: "Lawsuit Settlement Calculator",
  description: "Free lawsuit settlement calculator. Estimate potential settlement value",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["lawsuit settlement calculator", "legal calculator", "law calculator"],
  variants: [{
    id: "standard",
    name: "Lawsuit Settlement",
    description: "Estimate potential settlement value",
    fields: [
      { name: "medicalBills", label: "Medical Bills", type: "number", placeholder: "e.g. 25000", prefix: "$", min: 0 },
      { name: "lostWages", label: "Lost Wages", type: "number", placeholder: "e.g. 15000", prefix: "$", min: 0 },
      { name: "painMultiplier", label: "Pain Multiplier", type: "select", defaultValue: "3", options: [{label:"Minor (1.5x)",value:"1.5"},{label:"Moderate (3x)",value:"3"},{label:"Severe (5x)",value:"5"},{label:"Very Severe (7x)",value:"7"}] },
      { name: "attorneyFee", label: "Attorney Fee", type: "number", placeholder: "e.g. 33", suffix: "%", min: 0, max: 50, defaultValue: 33 },
    ],
    calculate: (inputs)=>{const med=inputs.medicalBills as number||0;const wages=inputs.lostWages as number||0;const mult=parseFloat(inputs.painMultiplier as string)||3;const fee=(inputs.attorneyFee as number)/100;if(!med&&!wages)return null;const specials=med+wages;const painDamage=specials*mult;const total=specials+painDamage;const attyFee=total*fee;const netSettlement=total-attyFee;return{primary:{label:"Estimated Settlement",value:"$"+formatNumber(total)},details:[{label:"Special damages",value:"$"+formatNumber(specials)},{label:"Pain & suffering",value:"$"+formatNumber(painDamage)},{label:"Attorney fee",value:"$"+formatNumber(attyFee)},{label:"Your net",value:"$"+formatNumber(netSettlement)}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How accurate are legal cost estimates?", answer: "These are rough estimates only. Actual legal costs vary significantly. Consult an attorney for accurate quotes." },
    { question: "Should I hire a lawyer?", answer: "For significant legal matters, consulting with an attorney is strongly recommended. Many offer free initial consultations." },
  ],
  formula: "Based on standard legal fee structures",
};

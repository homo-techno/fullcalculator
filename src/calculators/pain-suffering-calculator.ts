import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const painSufferingCalculator: CalculatorDefinition = {
  slug: "pain-suffering-calculator",
  title: "Pain and Suffering Multiplier Calculator",
  description: "Free pain and suffering damages calculator. Estimate non-economic damages using the insurance multiplier method.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pain and suffering calculator", "pain suffering multiplier", "non-economic damages calculator"],
  variants: [{
    id: "standard",
    name: "Pain and Suffering Multiplier",
    description: "Free pain and suffering damages calculator",
    fields: [
      { name: "medicalBills", label: "Total Medical Bills", type: "number", prefix: "$", min: 0 },
      { name: "multiplier", label: "Severity Multiplier", type: "select", options: [{ label: "1.5x - Minor soft tissue", value: "1.5" }, { label: "2x - Moderate injury", value: "2" }, { label: "3x - Significant injury", value: "3" }, { label: "4x - Severe injury", value: "4" }, { label: "5x - Permanent/life-altering", value: "5" }], defaultValue: "3" },
    ],
    calculate: (inputs) => {
      const bills = inputs.medicalBills as number;
      const mult = parseFloat(inputs.multiplier as string);
      if (!bills || bills <= 0) return null;
      const painDamages = bills * mult;
      const total = bills + painDamages;
      return {
        primary: { label: "Pain & Suffering Value", value: "$" + formatNumber(painDamages) },
        details: [
          { label: "Medical bills (special damages)", value: "$" + formatNumber(bills) },
          { label: "Multiplier applied", value: mult + "x" },
          { label: "Total estimated claim", value: "$" + formatNumber(total) },
        ],
        note: "The multiplier method is one approach used by insurance adjusters. Per diem (daily rate) is another common method. Consult an attorney for your specific case.",
      };
    },
  }],
  relatedSlugs: ["personal-injury-calculator", "car-accident-settlement-calculator"],
  faq: [
    { question: "What is the pain and suffering multiplier?", answer: "Insurance companies multiply your medical bills by 1.5 to 5 to estimate non-economic damages. Higher multipliers apply to more severe, permanent injuries." },
    { question: "What factors increase the multiplier?", answer: "Permanent disability, disfigurement, chronic pain, impact on daily activities, and clear liability by the other party." },
  ],
  formula: "Pain & Suffering = Medical Bills × Severity Multiplier (1.5 to 5)",
};

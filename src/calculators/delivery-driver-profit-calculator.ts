import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deliveryDriverProfitCalculator: CalculatorDefinition = {
  slug: "delivery-driver-profit-calculator",
  title: "Delivery Driver Profit Calculator",
  description: "Free delivery driver profit calculator. Calculate delivery driver profit quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["delivery driver earnings"],
  variants: [{
    id: "standard",
    name: "Delivery Driver Profit",
    description: "",
    fields: [
      { name: "deliveries", label: "Deliveries/Day", type: "number", min: 1 },
      { name: "avgPay", label: "Avg Pay/Delivery ($)", type: "number", defaultValue: 7 },
      { name: "gasCost", label: "Gas/Day ($)", type: "number", defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Daily Profit", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate delivery driver profit?", answer: "Enter values and get instant results." },
    { question: "Why use this delivery driver profit calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};

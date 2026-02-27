import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stakingRewardCalculator: CalculatorDefinition = {
  slug: "staking-reward-calculator",
  title: "Staking Reward Calculator",
  description: "Free staking reward calculator. Calculate staking reward quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["staking rewards calculator"],
  variants: [{
    id: "standard",
    name: "Staking Reward",
    description: "",
    fields: [
      { name: "amount", label: "Staked Amount ($)", type: "number", min: 1 },
      { name: "apy", label: "APY %", type: "number", min: 0.1 },
      { name: "days", label: "Days", type: "number", defaultValue: 365 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Reward ($)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate staking reward?", answer: "Enter values and get instant results." },
    { question: "Why use this staking reward calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};

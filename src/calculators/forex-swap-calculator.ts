import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const forexSwapCalculator: CalculatorDefinition = {
  slug: "forex-swap-calculator",
  title: "Forex Swap Calculator",
  description: "Calculate overnight swap or rollover fees for holding a forex position.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["forex swap calculator", "rollover fee", "overnight interest forex"],
  variants: [{
    id: "standard",
    name: "Forex Swap",
    description: "Calculate overnight swap or rollover fees for holding a forex position",
    fields: [
      { name: "positionSize", label: "Position Size (units)", type: "number", min: 100, max: 10000000, defaultValue: 100000 },
      { name: "swapRate", label: "Swap Rate (points)", type: "number", min: -100, max: 100, step: 0.01, defaultValue: -0.5 },
      { name: "nights", label: "Number of Nights", type: "number", min: 1, max: 365, defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const size = inputs.positionSize as number;
      const swapRate = inputs.swapRate as number;
      const nights = inputs.nights as number;
      if (!size || size <= 0 || !nights) return null;
      const dailySwap = (swapRate * size) / 100000;
      const totalSwap = dailySwap * nights;
      const wednesdayTriple = nights >= 7 ? Math.floor(nights / 7) * dailySwap * 2 : 0;
      const adjustedTotal = totalSwap + wednesdayTriple;
      return {
        primary: { label: "Total Swap Cost", value: "$" + formatNumber(adjustedTotal, 2) },
        details: [
          { label: "Daily Swap", value: "$" + formatNumber(dailySwap, 2) },
          { label: "Nights Held", value: formatNumber(nights) },
          { label: "Wednesday Triple Swaps", value: "$" + formatNumber(wednesdayTriple, 2) },
          { label: "Monthly Estimate", value: "$" + formatNumber(dailySwap * 30 + dailySwap * 8, 2) },
        ],
      };
    },
  }],
  relatedSlugs: ["forex-margin-calculator", "forex-profit-loss-calculator"],
  faq: [
    { question: "What is a forex swap?", answer: "A swap is the interest rate differential charged or credited for holding a forex position overnight, based on the two currencies interest rates." },
    { question: "Why is the Wednesday swap tripled?", answer: "Wednesday swaps are tripled to account for the weekend settlement period since forex trades settle two days later." },
  ],
  formula: "Daily Swap = (Swap Rate x Position Size) / 100,000; Total = Daily x Nights + Wednesday Adjustments",
};

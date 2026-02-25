import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carWashSavingsCalculator: CalculatorDefinition = {
  slug: "car-wash-savings-calculator",
  title: "Car Wash vs DIY Savings",
  description: "Free car wash vs DIY savings calculator. Compare the cost of professional car washes versus washing your car at home.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car wash savings", "DIY car wash cost", "car wash vs home wash", "car wash comparison", "car wash budget"],
  variants: [
    {
      id: "compare",
      name: "Car Wash vs DIY Cost",
      description: "Compare professional car wash vs DIY washing costs",
      fields: [
        { name: "proWashCost", label: "Professional Wash Cost", type: "number", placeholder: "e.g. 25", prefix: "$" },
        { name: "washesPerMonth", label: "Washes per Month", type: "number", placeholder: "e.g. 2" },
        { name: "diySoapCost", label: "DIY Soap Cost (per wash)", type: "number", placeholder: "e.g. 2", prefix: "$" },
        { name: "diyWaterCost", label: "DIY Water Cost (per wash)", type: "number", placeholder: "e.g. 1", prefix: "$" },
        { name: "diySuppliesCost", label: "Annual DIY Supplies (towels, etc.)", type: "number", placeholder: "e.g. 50", prefix: "$" },
      ],
      calculate: (inputs) => {
        const proCost = (inputs.proWashCost as number) || 0;
        const washes = (inputs.washesPerMonth as number) || 0;
        const soap = (inputs.diySoapCost as number) || 0;
        const water = (inputs.diyWaterCost as number) || 0;
        const supplies = (inputs.diySuppliesCost as number) || 0;

        const monthlyPro = proCost * washes;
        const annualPro = monthlyPro * 12;
        const monthlyDIY = (soap + water) * washes + supplies / 12;
        const annualDIY = monthlyDIY * 12;
        const annualSavings = annualPro - annualDIY;

        return {
          primary: { label: "Annual Savings (DIY)", value: `$${formatNumber(annualSavings)}` },
          details: [
            { label: "Monthly pro wash cost", value: `$${formatNumber(monthlyPro)}` },
            { label: "Monthly DIY cost", value: `$${formatNumber(monthlyDIY)}` },
            { label: "Annual pro wash cost", value: `$${formatNumber(annualPro)}` },
            { label: "Annual DIY cost", value: `$${formatNumber(annualDIY)}` },
            { label: "Monthly savings", value: `$${formatNumber(annualSavings / 12)}` },
          ],
        };
      },
    },
    {
      id: "subscription",
      name: "Wash Subscription Value",
      description: "Determine if a car wash subscription is worth it",
      fields: [
        { name: "subscriptionCost", label: "Monthly Subscription", type: "number", placeholder: "e.g. 30", prefix: "$" },
        { name: "singleWashCost", label: "Single Wash Price", type: "number", placeholder: "e.g. 15", prefix: "$" },
        { name: "washesPerMonth", label: "Expected Washes/Month", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const sub = inputs.subscriptionCost as number;
        const single = inputs.singleWashCost as number;
        const washes = inputs.washesPerMonth as number;
        if (!sub || !single || !washes) return null;

        const payPerWash = single * washes;
        const savings = payPerWash - sub;
        const breakEven = Math.ceil(sub / single);
        const effectiveCost = sub / washes;

        return {
          primary: { label: "Monthly Savings", value: `$${formatNumber(savings)}` },
          details: [
            { label: "Pay-per-wash cost", value: `$${formatNumber(payPerWash)}` },
            { label: "Subscription cost", value: `$${formatNumber(sub)}` },
            { label: "Break-even washes", value: `${breakEven} washes` },
            { label: "Effective cost per wash", value: `$${formatNumber(effectiveCost)}` },
            { label: "Worth it?", value: savings > 0 ? "Yes" : "No" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fuel-cost-calculator", "car-total-cost-calculator"],
  faq: [
    { question: "Is it cheaper to wash your car at home?", answer: "Generally yes. A DIY wash costs $2-5 per wash while professional washes cost $10-30+. However, professional detailing can protect your paint better and save time." },
    { question: "How often should I wash my car?", answer: "Every 2 weeks is a good baseline. Wash more frequently if you drive in salty conditions, dusty areas, or park under trees. Regular washing protects your car's paint and finish." },
  ],
  formula: "Annual Savings = (Pro Wash Cost × Washes × 12) - ((DIY Soap + Water) × Washes × 12 + Annual Supplies)",
};

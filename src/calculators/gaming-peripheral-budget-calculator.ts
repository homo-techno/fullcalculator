import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gamingPeripheralBudgetCalculator: CalculatorDefinition = {
  slug: "gaming-peripheral-budget-calculator",
  title: "Gaming Peripheral Budget Calculator",
  description: "Plan your gaming peripheral upgrade budget across keyboard, mouse, headset, mousepad, and extras with tier-based pricing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["gaming peripheral cost","gaming gear budget","keyboard mouse budget","gaming accessories cost"],
  variants: [{
    id: "standard",
    name: "Gaming Peripheral Budget",
    description: "Plan your gaming peripheral upgrade budget across keyboard, mouse, headset, mousepad, and extras with tier-based pricing.",
    fields: [
      { name: "keyboardTier", label: "Keyboard Tier", type: "select", options: [{ value: "1", label: "Budget membrane ($20)" }, { value: "2", label: "Entry mechanical ($50)" }, { value: "3", label: "Mid mechanical ($100)" }, { value: "4", label: "Premium mechanical ($180)" }, { value: "5", label: "Enthusiast custom ($300)" }], defaultValue: "3" },
      { name: "mouseTier", label: "Mouse Tier", type: "select", options: [{ value: "1", label: "Budget ($15)" }, { value: "2", label: "Mid-range ($40)" }, { value: "3", label: "Premium ($70)" }, { value: "4", label: "Ultra-light/wireless ($130)" }], defaultValue: "3" },
      { name: "headsetTier", label: "Headset Tier", type: "select", options: [{ value: "1", label: "Budget ($25)" }, { value: "2", label: "Mid-range ($60)" }, { value: "3", label: "Premium ($120)" }, { value: "4", label: "Audiophile ($250)" }], defaultValue: "2" },
      { name: "extras", label: "Extra Accessories Budget ($)", type: "number", min: 0, max: 500, defaultValue: 40 },
    ],
    calculate: (inputs) => {
    const kbTier = parseInt(inputs.keyboardTier as string);
    const mouseTier = parseInt(inputs.mouseTier as string);
    const headsetTier = parseInt(inputs.headsetTier as string);
    const extras = inputs.extras as number;
    const kbPrices = { 1: 20, 2: 50, 3: 100, 4: 180, 5: 300 };
    const mousePrices = { 1: 15, 2: 40, 3: 70, 4: 130 };
    const headsetPrices = { 1: 25, 2: 60, 3: 120, 4: 250 };
    const kbCost = kbPrices[kbTier] || 100;
    const mouseCost = mousePrices[mouseTier] || 70;
    const headsetCost = headsetPrices[headsetTier] || 60;
    const mousepadCost = mouseTier >= 3 ? 30 : 15;
    const totalCost = kbCost + mouseCost + headsetCost + mousepadCost + extras;
    return {
      primary: { label: "Total Peripheral Budget", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Keyboard", value: "$" + formatNumber(kbCost) },
        { label: "Mouse", value: "$" + formatNumber(mouseCost) },
        { label: "Headset", value: "$" + formatNumber(headsetCost) },
        { label: "Mousepad + Extras", value: "$" + formatNumber(mousepadCost + extras) }
      ]
    };
  },
  }],
  relatedSlugs: ["gaming-desk-setup-cost-calculator","gaming-pc-build-budget-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total = Keyboard + Mouse + Headset + Mousepad + Extras; Mousepad = $30 (premium) or $15 (standard)",
};

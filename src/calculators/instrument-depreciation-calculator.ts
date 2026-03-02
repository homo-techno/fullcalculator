import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const instrumentDepreciationCalculator: CalculatorDefinition = {
  slug: "instrument-depreciation-calculator",
  title: "Instrument Depreciation Calculator",
  description: "Estimate how much a musical instrument depreciates over time based on type and condition.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["instrument","depreciation","value","resale","musical instrument"],
  variants: [{
    id: "standard",
    name: "Instrument Depreciation",
    description: "Estimate how much a musical instrument depreciates over time based on type and condition.",
    fields: [
      { name: "purchasePrice", label: "Purchase Price ($)", type: "number", min: 50, max: 200000, defaultValue: 1500 },
      { name: "yearsOwned", label: "Years Owned", type: "number", min: 0, max: 50, defaultValue: 5 },
      { name: "instrumentType", label: "Instrument Type", type: "select", options: [{ value: "1", label: "Electric Guitar/Bass" }, { value: "2", label: "Acoustic Guitar" }, { value: "3", label: "Piano/Keyboard" }, { value: "4", label: "Drums" }, { value: "5", label: "Vintage/Collectible" }], defaultValue: "1" },
      { name: "condition", label: "Current Condition", type: "select", options: [{ value: "1", label: "Excellent" }, { value: "0.85", label: "Good" }, { value: "0.7", label: "Fair" }, { value: "0.5", label: "Poor" }], defaultValue: "0.85" },
    ],
    calculate: (inputs) => {
    const purchasePrice = inputs.purchasePrice as number;
    const yearsOwned = inputs.yearsOwned as number;
    const instrumentType = inputs.instrumentType as number;
    const condition = inputs.condition as number;
    const depRates = { 1: 0.07, 2: 0.05, 3: 0.08, 4: 0.09, 5: -0.03 };
    const annualRate = depRates[instrumentType] || 0.07;
    let currentValue;
    if (annualRate < 0) {
      currentValue = purchasePrice * Math.pow(1 + Math.abs(annualRate), yearsOwned) * condition;
    } else {
      currentValue = purchasePrice * Math.pow(1 - annualRate, yearsOwned) * condition;
    }
    const totalDepreciation = purchasePrice - currentValue;
    const percentLost = (totalDepreciation / purchasePrice) * 100;
    const typeLabels = { 1: "Electric Guitar/Bass", 2: "Acoustic Guitar", 3: "Piano/Keyboard", 4: "Drums", 5: "Vintage/Collectible" };
    return {
      primary: { label: "Current Estimated Value", value: "$" + formatNumber(currentValue) },
      details: [
        { label: "Original Price", value: "$" + formatNumber(purchasePrice) },
        { label: "Total Change", value: "$" + formatNumber(Math.abs(totalDepreciation)) + (totalDepreciation < 0 ? " (Gain)" : " (Loss)") },
        { label: "Percentage Change", value: formatNumber(Math.abs(percentLost)) + "%" },
        { label: "Instrument Type", value: typeLabels[instrumentType] }
      ]
    };
  },
  }],
  relatedSlugs: ["vinyl-record-value-calculator","guitar-string-gauge-calculator","concert-ticket-value-calculator"],
  faq: [
    { question: "Do musical instruments lose value?", answer: "Most instruments depreciate 5-10% annually, but vintage and high-end instruments can appreciate significantly." },
    { question: "Which instruments hold their value best?", answer: "Acoustic guitars and vintage instruments tend to hold value best. Quality brand-name instruments depreciate less." },
    { question: "When does an instrument become vintage?", answer: "Generally instruments over 20-30 years old are considered vintage, and those over 50 years may be called antique." },
  ],
  formula: "Current Value = Purchase Price x (1 - Depreciation Rate)^Years x Condition Factor",
};

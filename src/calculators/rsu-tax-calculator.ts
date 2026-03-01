import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rsuTaxCalculator: CalculatorDefinition = {
  slug: "rsu-tax-calculator",
  title: "RSU Tax Calculator",
  description: "Calculate the tax impact and net value of restricted stock units at vesting.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["RSU tax calculator", "restricted stock unit tax", "RSU vesting value"],
  variants: [{
    id: "standard",
    name: "RSU Tax",
    description: "Calculate the tax impact and net value of restricted stock units at vesting",
    fields: [
      { name: "shares", label: "RSU Shares Vesting", type: "number", suffix: "shares", min: 1, max: 100000, defaultValue: 500 },
      { name: "vestPrice", label: "Price at Vesting", type: "number", suffix: "$", min: 1, max: 5000, defaultValue: 100 },
      { name: "taxRate", label: "Combined Tax Rate", type: "number", suffix: "%", min: 10, max: 55, defaultValue: 37 },
      { name: "sellPrice", label: "Planned Sell Price", type: "number", suffix: "$", min: 1, max: 5000, defaultValue: 120 },
    ],
    calculate: (inputs) => {
      const shares = inputs.shares as number;
      const vestPrice = inputs.vestPrice as number;
      const taxRate = inputs.taxRate as number;
      const sellPrice = inputs.sellPrice as number;
      if (!shares || !vestPrice) return null;
      const grossValue = shares * vestPrice;
      const taxAtVest = grossValue * (taxRate / 100);
      const netAtVest = grossValue - taxAtVest;
      const sharesWithheld = Math.ceil(shares * (taxRate / 100));
      const sharesRemaining = shares - sharesWithheld;
      const additionalGain = (sellPrice - vestPrice) * sharesRemaining;
      const capGainsTax = additionalGain > 0 ? additionalGain * 0.20 : 0;
      const totalNet = netAtVest + additionalGain - capGainsTax;
      return {
        primary: { label: "Net Value at Vesting", value: "$" + formatNumber(netAtVest) },
        details: [
          { label: "Gross Value", value: "$" + formatNumber(grossValue) },
          { label: "Tax Withholding at Vesting", value: "$" + formatNumber(taxAtVest) },
          { label: "Shares Withheld for Tax", value: formatNumber(sharesWithheld) },
          { label: "Shares Remaining", value: formatNumber(sharesRemaining) },
          { label: "Additional Gain if Sold at $" + formatNumber(sellPrice), value: "$" + formatNumber(additionalGain) },
          { label: "Total Net Value (after all taxes)", value: "$" + formatNumber(totalNet) },
        ],
      };
    },
  }],
  relatedSlugs: ["stock-option-calculator", "espp-calculator"],
  faq: [
    { question: "How are RSUs taxed?", answer: "RSUs are taxed as ordinary income at vesting based on the fair market value. Your employer typically withholds shares to cover taxes. Any additional gain after vesting is taxed as capital gains." },
    { question: "Should I sell RSUs immediately at vesting?", answer: "Many financial advisors recommend selling RSUs at vesting and diversifying, since holding concentrates risk in your employer stock. However, the decision depends on your financial situation and outlook for the stock." },
  ],
  formula: "Net Value = (Shares x Vest Price) - (Gross Value x Tax Rate); Additional Gain = (Sell Price - Vest Price) x Remaining Shares",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rsuTaxCalc: CalculatorDefinition = {
  slug: "rsu-tax-calc",
  title: "RSU Tax Calculator",
  description: "Free online RSU (Restricted Stock Unit) tax calculator. Estimate taxes on vested RSUs including federal, state, and capital gains on subsequent sales.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["RSU", "restricted stock unit", "RSU tax", "stock vesting", "equity compensation", "RSU calculator", "stock compensation"],
  variants: [
    {
      id: "vesting-tax",
      name: "RSU Vesting Tax",
      fields: [
        {
          name: "sharesVesting",
          label: "Number of Shares Vesting",
          type: "number",
          placeholder: "e.g. 500",
          min: 0,
        },
        {
          name: "vestingPrice",
          label: "Stock Price at Vesting ($)",
          type: "number",
          placeholder: "e.g. 150",
          min: 0,
        },
        {
          name: "federalRate",
          label: "Federal Tax Bracket",
          type: "select",
          options: [
            { label: "22% ($44,726 - $95,375)", value: "22" },
            { label: "24% ($95,376 - $182,100)", value: "24" },
            { label: "32% ($182,101 - $231,250)", value: "32" },
            { label: "35% ($231,251 - $578,125)", value: "35" },
            { label: "37% ($578,126+)", value: "37" },
          ],
        },
        {
          name: "stateRate",
          label: "State Tax Rate (%)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          max: 15,
        },
        {
          name: "withholding",
          label: "Employer Withholding Method",
          type: "select",
          options: [
            { label: "Sell to Cover (sell shares for taxes)", value: "sellToCover" },
            { label: "Net Settlement (employer withholds shares)", value: "netSettlement" },
            { label: "Cash (pay taxes from pocket)", value: "cash" },
          ],
        },
      ],
      calculate: (inputs) => {
        const shares = parseFloat(inputs.sharesVesting as string) || 0;
        const price = parseFloat(inputs.vestingPrice as string) || 0;
        const federalRate = parseFloat(inputs.federalRate as string) || 24;
        const stateRate = parseFloat(inputs.stateRate as string) || 0;
        const withholding = inputs.withholding as string;

        const totalValue = shares * price;
        const federalTax = totalValue * (federalRate / 100);
        const stateTax = totalValue * (stateRate / 100);
        const socialSecurityTax = Math.min(totalValue, 168600) * 0.062;
        const medicareTax = totalValue * 0.0145;
        const additionalMedicare = totalValue > 200000 ? (totalValue - 200000) * 0.009 : 0;
        const totalTax = federalTax + stateTax + socialSecurityTax + medicareTax + additionalMedicare;

        let sharesRetained = shares;
        let sharesWithheld = 0;
        if (withholding === "sellToCover" || withholding === "netSettlement") {
          sharesWithheld = price > 0 ? Math.ceil(totalTax / price) : 0;
          sharesRetained = shares - sharesWithheld;
        }

        const retainedValue = sharesRetained * price;

        return {
          primary: { label: "Total Tax on Vesting", value: "$" + formatNumber(totalTax) },
          details: [
            { label: "Gross Value at Vesting", value: "$" + formatNumber(totalValue) },
            { label: "Federal Tax (" + federalRate + "%)", value: "$" + formatNumber(federalTax) },
            { label: "State Tax (" + stateRate + "%)", value: "$" + formatNumber(stateTax) },
            { label: "Social Security Tax", value: "$" + formatNumber(socialSecurityTax) },
            { label: "Medicare Tax", value: "$" + formatNumber(medicareTax + additionalMedicare) },
            { label: "Shares Withheld for Tax", value: formatNumber(sharesWithheld, 0) },
            { label: "Shares Retained", value: formatNumber(sharesRetained, 0) },
            { label: "Value of Retained Shares", value: "$" + formatNumber(retainedValue) },
          ],
          note: "RSU income is taxed as ordinary income at vesting. The supplemental income flat withholding rate is 22% (37% over $1M), which may not match your actual tax bracket.",
        };
      },
    },
    {
      id: "sale-tax",
      name: "RSU Sale Tax (Capital Gains)",
      fields: [
        {
          name: "shares",
          label: "Shares Sold",
          type: "number",
          placeholder: "e.g. 200",
          min: 0,
        },
        {
          name: "vestingPrice",
          label: "Price at Vesting (Cost Basis) ($)",
          type: "number",
          placeholder: "e.g. 100",
          min: 0,
        },
        {
          name: "salePrice",
          label: "Sale Price Per Share ($)",
          type: "number",
          placeholder: "e.g. 150",
          min: 0,
        },
        {
          name: "holdingPeriod",
          label: "Holding Period",
          type: "select",
          options: [
            { label: "Short-term (under 1 year)", value: "short" },
            { label: "Long-term (over 1 year)", value: "long" },
          ],
        },
        {
          name: "taxBracket",
          label: "Income Tax Bracket",
          type: "select",
          options: [
            { label: "22%", value: "22" },
            { label: "24%", value: "24" },
            { label: "32%", value: "32" },
            { label: "35%", value: "35" },
            { label: "37%", value: "37" },
          ],
        },
      ],
      calculate: (inputs) => {
        const shares = parseFloat(inputs.shares as string) || 0;
        const vestingPrice = parseFloat(inputs.vestingPrice as string) || 0;
        const salePrice = parseFloat(inputs.salePrice as string) || 0;
        const holdingPeriod = inputs.holdingPeriod as string;
        const taxBracket = parseFloat(inputs.taxBracket as string) || 24;

        const costBasis = shares * vestingPrice;
        const saleProceeds = shares * salePrice;
        const capitalGain = saleProceeds - costBasis;

        let taxRate = 0;
        if (capitalGain > 0) {
          if (holdingPeriod === "short") {
            taxRate = taxBracket;
          } else {
            // Long-term capital gains rate based on bracket
            if (taxBracket <= 22) taxRate = 15;
            else if (taxBracket <= 35) taxRate = 15;
            else taxRate = 20;
          }
        }

        const capitalGainsTax = Math.max(0, capitalGain) * (taxRate / 100);
        const netProceeds = saleProceeds - capitalGainsTax;

        return {
          primary: { label: "Capital Gains Tax", value: "$" + formatNumber(capitalGainsTax) },
          details: [
            { label: "Cost Basis (vesting value)", value: "$" + formatNumber(costBasis) },
            { label: "Sale Proceeds", value: "$" + formatNumber(saleProceeds) },
            { label: "Capital Gain / Loss", value: "$" + formatNumber(capitalGain) },
            { label: "Tax Rate (" + holdingPeriod + ")", value: formatNumber(taxRate, 0) + "%" },
            { label: "Net Proceeds After Tax", value: "$" + formatNumber(netProceeds) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["stock-average-calc", "dividend-yield-calc", "side-hustle-tax"],
  faq: [
    {
      question: "When are RSUs taxed?",
      answer: "RSUs are taxed at vesting as ordinary income (the full market value at vesting). If you sell the shares later at a different price, you also pay capital gains tax on the difference between the sale price and the vesting price (your cost basis).",
    },
    {
      question: "What is sell to cover?",
      answer: "Sell to cover is a withholding method where your employer sells enough shares at vesting to cover the tax obligation, and you keep the remaining shares. This is the most common method for RSU tax withholding.",
    },
    {
      question: "How do I avoid double taxation on RSUs?",
      answer: "Ensure your cost basis is correctly set to the fair market value at vesting. When you sell, you only owe capital gains tax on the appreciation (or can claim a loss on depreciation) since vesting - not on the full sale price.",
    },
  ],
  formula: "Vesting Tax = Shares x Price x (Federal Rate + State Rate + FICA)\nCapital Gains = (Sale Price - Vesting Price) x Shares x Capital Gains Rate",
};

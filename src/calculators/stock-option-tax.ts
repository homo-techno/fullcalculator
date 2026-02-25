import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stockOptionTaxCalculator: CalculatorDefinition = {
  slug: "stock-option-tax-calculator",
  title: "Stock Option Tax Calculator",
  description:
    "Free stock option tax calculator. Estimate taxes on ISO and NSO stock option exercises including AMT implications.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "stock option tax",
    "ISO tax calculator",
    "NSO tax calculator",
    "employee stock options",
    "option exercise tax",
  ],
  variants: [
    {
      id: "stock-option",
      name: "Stock Option Tax Estimator",
      description:
        "Calculate tax on exercising incentive (ISO) or non-qualified (NSO) stock options",
      fields: [
        {
          name: "optionType",
          label: "Option Type",
          type: "select",
          options: [
            { label: "ISO (Incentive Stock Option)", value: "iso" },
            { label: "NSO (Non-Qualified Stock Option)", value: "nso" },
          ],
          defaultValue: "iso",
        },
        {
          name: "numShares",
          label: "Number of Shares",
          type: "number",
          placeholder: "e.g. 1000",
        },
        {
          name: "strikePrice",
          label: "Strike / Exercise Price",
          type: "number",
          placeholder: "e.g. 10",
          prefix: "$",
        },
        {
          name: "currentPrice",
          label: "Current Fair Market Value",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
        },
        {
          name: "salePrice",
          label: "Sale Price (if selling, 0 = hold)",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "marginalRate",
          label: "Marginal Income Tax Rate",
          type: "select",
          options: [
            { label: "22%", value: "22" },
            { label: "24%", value: "24" },
            { label: "32%", value: "32" },
            { label: "35%", value: "35" },
            { label: "37%", value: "37" },
          ],
          defaultValue: "32",
        },
        {
          name: "holdingPeriod",
          label: "Holding Period After Exercise",
          type: "select",
          options: [
            { label: "Less than 1 year", value: "short" },
            { label: "1+ year (long-term)", value: "long" },
          ],
          defaultValue: "short",
        },
      ],
      calculate: (inputs) => {
        const optionType = inputs.optionType as string;
        const shares = inputs.numShares as number;
        const strike = inputs.strikePrice as number;
        const fmv = inputs.currentPrice as number;
        const salePrice = (inputs.salePrice as number) || 0;
        const marginalRate =
          (parseInt(inputs.marginalRate as string) || 32) / 100;
        const holdingPeriod = inputs.holdingPeriod as string;

        if (!shares || !strike || !fmv || shares <= 0) return null;

        const spread = fmv - strike;
        const totalSpread = spread * shares;
        const exerciseCost = strike * shares;
        const selling = salePrice > 0;
        const saleGain = selling ? (salePrice - fmv) * shares : 0;

        let ordinaryIncomeTax = 0;
        let capitalGainsTax = 0;
        let amtExposure = 0;
        let totalTax = 0;

        if (optionType === "nso") {
          ordinaryIncomeTax = totalSpread * marginalRate;
          const ficaTax = totalSpread * 0.0765;
          if (selling) {
            const cgRate = holdingPeriod === "long" ? 0.15 : marginalRate;
            capitalGainsTax = Math.max(0, saleGain) * cgRate;
          }
          totalTax = ordinaryIncomeTax + ficaTax + capitalGainsTax;
        } else {
          // ISO - no tax at exercise for regular tax, but AMT
          amtExposure = totalSpread * 0.28;
          if (selling) {
            if (holdingPeriod === "long") {
              capitalGainsTax = Math.max(0, (salePrice - strike) * shares) * 0.15;
            } else {
              ordinaryIncomeTax = totalSpread * marginalRate;
              capitalGainsTax = Math.max(0, saleGain) * marginalRate;
            }
          }
          totalTax = ordinaryIncomeTax + capitalGainsTax + (selling ? 0 : amtExposure);
        }

        const totalValue = selling
          ? salePrice * shares
          : fmv * shares;
        const netProceeds = totalValue - exerciseCost - totalTax;

        return {
          primary: {
            label: "Estimated Total Tax",
            value: `$${formatNumber(totalTax)}`,
          },
          details: [
            {
              label: "Spread at exercise",
              value: `$${formatNumber(totalSpread)}`,
            },
            {
              label: "Exercise cost",
              value: `$${formatNumber(exerciseCost)}`,
            },
            {
              label: "Ordinary income tax",
              value: `$${formatNumber(ordinaryIncomeTax)}`,
            },
            {
              label: optionType === "iso" ? "AMT exposure" : "FICA on spread",
              value: `$${formatNumber(optionType === "iso" ? amtExposure : totalSpread * 0.0765)}`,
            },
            {
              label: "Capital gains tax",
              value: `$${formatNumber(capitalGainsTax)}`,
            },
            {
              label: "Net proceeds after tax",
              value: `$${formatNumber(netProceeds)}`,
            },
          ],
          note:
            optionType === "iso"
              ? "ISOs are not taxed at exercise for regular income tax, but the spread is an AMT preference item. Qualifying dispositions (held 1+ year after exercise and 2+ years after grant) are taxed at long-term capital gains rates."
              : "NSOs are taxed as ordinary income on the spread at exercise, plus FICA taxes. Any additional gain/loss when selling is a capital gain/loss.",
        };
      },
    },
  ],
  relatedSlugs: [
    "amt-calculator",
    "tax-calculator",
    "crypto-gains-tax-calculator",
  ],
  faq: [
    {
      question: "What is the difference between ISO and NSO stock options?",
      answer:
        "ISOs (Incentive Stock Options) are not taxed at exercise for regular income tax but may trigger AMT. NSOs (Non-Qualified Stock Options) are taxed as ordinary income on the spread at exercise. ISOs can qualify for long-term capital gains if holding requirements are met.",
    },
    {
      question: "When do I owe AMT on ISO exercises?",
      answer:
        "The spread between the exercise price and fair market value at the time of ISO exercise is an AMT preference item. You may owe AMT if this spread, plus other AMT adjustments, pushes your tentative minimum tax above your regular tax.",
    },
  ],
  formula:
    "NSO Tax = Spread x Ordinary Rate + FICA; ISO Tax = AMT on spread (26-28%) or capital gains if sold after qualifying period",
};

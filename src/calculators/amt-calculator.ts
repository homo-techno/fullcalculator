import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const amtCalculator: CalculatorDefinition = {
  slug: "amt-calculator",
  title: "Alternative Minimum Tax Calculator",
  description:
    "Free AMT calculator. Estimate whether you may owe Alternative Minimum Tax and calculate the tentative minimum tax amount.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "AMT calculator",
    "alternative minimum tax",
    "AMT exemption",
    "minimum tax calculator",
    "AMT threshold",
  ],
  variants: [
    {
      id: "amt-estimate",
      name: "AMT Estimator",
      description:
        "Estimate your Alternative Minimum Tax liability",
      fields: [
        {
          name: "taxableIncome",
          label: "Regular Taxable Income",
          type: "number",
          placeholder: "e.g. 250000",
          prefix: "$",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Married Filing Separately", value: "mfs" },
          ],
          defaultValue: "single",
        },
        {
          name: "stateLocalTaxes",
          label: "State & Local Taxes (SALT)",
          type: "number",
          placeholder: "e.g. 25000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "isoExerciseSpread",
          label: "ISO Exercise Spread",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "otherAmtPreferences",
          label: "Other AMT Preference Items",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "regularTax",
          label: "Regular Federal Tax",
          type: "number",
          placeholder: "e.g. 45000",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const taxableIncome = inputs.taxableIncome as number;
        const status = inputs.filingStatus as string;
        const salt = (inputs.stateLocalTaxes as number) || 0;
        const isoSpread = (inputs.isoExerciseSpread as number) || 0;
        const otherPrefs = (inputs.otherAmtPreferences as number) || 0;
        const regularTax = (inputs.regularTax as number) || 0;

        if (!taxableIncome || taxableIncome <= 0) return null;

        const exemption =
          status === "married"
            ? 133300
            : status === "mfs"
              ? 66650
              : 85700;
        const phaseoutStart =
          status === "married"
            ? 1218700
            : status === "mfs"
              ? 609350
              : 609350;

        const amti =
          taxableIncome + salt + isoSpread + otherPrefs;
        const phaseoutReduction =
          amti > phaseoutStart
            ? Math.min(exemption, (amti - phaseoutStart) * 0.25)
            : 0;
        const adjustedExemption = Math.max(0, exemption - phaseoutReduction);
        const amtBase = Math.max(0, amti - adjustedExemption);

        const amtThreshold = status === "mfs" ? 119950 : 239900;
        let tentativeMinTax = 0;
        if (amtBase <= amtThreshold) {
          tentativeMinTax = amtBase * 0.26;
        } else {
          tentativeMinTax =
            amtThreshold * 0.26 + (amtBase - amtThreshold) * 0.28;
        }

        const amtOwed = Math.max(0, tentativeMinTax - regularTax);

        return {
          primary: {
            label: "AMT Owed",
            value: `$${formatNumber(amtOwed)}`,
          },
          details: [
            {
              label: "Alternative Minimum Taxable Income",
              value: `$${formatNumber(amti)}`,
            },
            {
              label: "AMT exemption",
              value: `$${formatNumber(adjustedExemption)}`,
            },
            { label: "AMT base", value: `$${formatNumber(amtBase)}` },
            {
              label: "Tentative minimum tax",
              value: `$${formatNumber(tentativeMinTax)}`,
            },
            {
              label: "Regular tax",
              value: `$${formatNumber(regularTax)}`,
            },
            {
              label: "Total tax with AMT",
              value: `$${formatNumber(regularTax + amtOwed)}`,
            },
          ],
          note: "AMT is owed when the tentative minimum tax exceeds your regular tax. ISO exercise spreads are a common AMT trigger. Consult a tax professional for complex situations.",
        };
      },
    },
  ],
  relatedSlugs: [
    "tax-calculator",
    "stock-option-tax-calculator",
    "standard-vs-itemized-calculator",
  ],
  faq: [
    {
      question: "What triggers the Alternative Minimum Tax?",
      answer:
        "Common AMT triggers include exercising incentive stock options (ISOs), large state and local tax deductions, certain tax-exempt interest, and other preference items that reduce regular tax but not AMT.",
    },
    {
      question: "What is the AMT exemption amount?",
      answer:
        "For 2024, the AMT exemption is $85,700 for single filers and $133,300 for married filing jointly. The exemption phases out at 25 cents per dollar over $609,350 (single) or $1,218,700 (married).",
    },
  ],
  formula:
    "AMT = max(0, Tentative Minimum Tax - Regular Tax); TMT = 26% of AMT base up to threshold + 28% above",
};

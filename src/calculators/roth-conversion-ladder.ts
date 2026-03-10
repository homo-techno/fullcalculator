import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rothConversionLadder: CalculatorDefinition = {
  slug: "roth-conversion-ladder",
  title: "Roth Conversion Ladder Calculator",
  description:
    "Plan Roth conversion ladder strategy for early retirees. Access retirement savings before age 59.5 without penalties using pro-rata conversions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Roth conversion ladder",
    "Roth ladder strategy",
    "early retirement access",
    "retirement withdrawal strategy",
    "tax-efficient withdrawal",
  ],
  variants: [
    {
      id: "calculate",
      name: "Plan Roth Ladder",
      description: "Access funds via Roth conversion strategy",
      fields: [
        {
          name: "traditionalIra",
          label: "Traditional IRA Balance",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "$",
        },
        {
          name: "annualNeed",
          label: "Annual Income Need",
          type: "number",
          placeholder: "e.g. 40000",
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const traditionalIra = parseFloat(inputs.traditionalIra as string) || 500000;
        const annualNeed = parseFloat(inputs.annualNeed as string) || 40000;

        // Roth conversion ladder: convert amount needed, wait 5 years, withdraw
        const yearsToCoverFromRoth = Math.ceil(annualNeed / 10000);
        const conversionNeeded = annualNeed * yearsToCoverFromRoth;

        // Calculate tax on conversion (assuming 24% bracket)
        const conversionTax = annualNeed * 0.24;

        // Funds available immediately (after 5-year holding period)
        const fundsAccessible = annualNeed;

        return {
          primary: { label: "Annual Conversion Amount", value: `$${formatNumber(annualNeed, 0)}` },
          details: [
            { label: "Traditional IRA balance", value: `$${formatNumber(traditionalIra, 0)}` },
            { label: "Annual income need", value: `$${formatNumber(annualNeed, 0)}` },
            { label: "Annual Roth conversion", value: `$${formatNumber(annualNeed, 0)}` },
            { label: "Estimated conversion tax (24%)", value: `$${formatNumber(conversionTax, 0)}` },
            { label: "Funds accessible after 5 years", value: `$${formatNumber(fundsAccessible, 0)}/year` },
            { label: "Total ladder years needed", value: `${Math.ceil(traditionalIra / annualNeed)}` },
          ],
          note: "Strategy: convert tax efficiently in low-income years, wait 5 years, then withdraw penalty-free before age 59.5.",
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "fire-tax-optimization"],
  faq: [
    {
      question: "How does Roth conversion ladder work?",
      answer:
        "1) Convert X from Traditional IRA to Roth. 2) Pay tax on conversion. 3) Wait 5 years. 4) Withdraw conversion without 59.5 penalty. 5) Repeat.",
    },
    {
      question: "What's the pro-rata rule?",
      answer:
        "If you have pre-tax and after-tax IRAs, conversions are taxed proportionally. To avoid: use SEP-IRA/Solo 401k rollover strategy.",
    },
  ],
  formula: "Annual Tax on Conversion = Conversion Amount × Marginal Tax Rate",
};

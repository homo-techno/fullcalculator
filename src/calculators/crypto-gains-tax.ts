import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cryptoGainsTaxCalculator: CalculatorDefinition = {
  slug: "crypto-gains-tax-calculator",
  title: "Cryptocurrency Capital Gains Tax Calculator",
  description:
    "Free crypto tax calculator. Estimate capital gains tax on cryptocurrency sales, swaps, and dispositions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "crypto tax calculator",
    "cryptocurrency capital gains",
    "bitcoin tax",
    "crypto gains tax",
    "digital currency tax",
  ],
  variants: [
    {
      id: "crypto-gains",
      name: "Crypto Capital Gains Tax",
      description:
        "Calculate capital gains tax on cryptocurrency dispositions",
      fields: [
        {
          name: "saleProceeds",
          label: "Sale / Disposition Proceeds",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
        },
        {
          name: "costBasis",
          label: "Cost Basis (Purchase Price)",
          type: "number",
          placeholder: "e.g. 20000",
          prefix: "$",
        },
        {
          name: "holdingPeriod",
          label: "Holding Period",
          type: "select",
          options: [
            { label: "Short-term (less than 1 year)", value: "short" },
            { label: "Long-term (1 year or more)", value: "long" },
          ],
          defaultValue: "short",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Head of Household", value: "hoh" },
          ],
          defaultValue: "single",
        },
        {
          name: "annualIncome",
          label: "Other Annual Taxable Income",
          type: "number",
          placeholder: "e.g. 80000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "stateTaxRate",
          label: "State Tax Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const proceeds = inputs.saleProceeds as number;
        const basis = inputs.costBasis as number;
        const holding = inputs.holdingPeriod as string;
        const status = inputs.filingStatus as string;
        const otherIncome = (inputs.annualIncome as number) || 0;
        const stateRate = (inputs.stateTaxRate as number) || 0;

        if (!proceeds || !basis) return null;

        const gain = proceeds - basis;
        const isLoss = gain < 0;

        if (isLoss) {
          const deductibleLoss = Math.min(Math.abs(gain), 3000);
          return {
            primary: {
              label: "Capital Loss",
              value: `-$${formatNumber(Math.abs(gain))}`,
            },
            details: [
              {
                label: "Total capital loss",
                value: `-$${formatNumber(Math.abs(gain))}`,
              },
              {
                label: "Deductible this year (max $3,000)",
                value: `$${formatNumber(deductibleLoss)}`,
              },
              {
                label: "Carryover to future years",
                value: `$${formatNumber(Math.max(0, Math.abs(gain) - 3000))}`,
              },
              { label: "Proceeds", value: `$${formatNumber(proceeds)}` },
              { label: "Cost basis", value: `$${formatNumber(basis)}` },
            ],
            note: "Capital losses can offset capital gains. Up to $3,000 of net capital losses can be deducted against ordinary income each year. Excess losses carry forward indefinitely.",
          };
        }

        let federalTax = 0;
        let niit = 0;

        if (holding === "short") {
          const totalIncome = otherIncome + gain;
          const standardDeduction = status === "married" ? 30000 : 15000;
          const taxableTotal = Math.max(0, totalIncome - standardDeduction);
          const taxableBase = Math.max(0, otherIncome - standardDeduction);

          const calcTax = (
            amount: number,
            brackets: { limit: number; rate: number }[]
          ) => {
            let tax = 0;
            let rem = amount;
            let prev = 0;
            for (const b of brackets) {
              const t = Math.min(rem, b.limit - prev);
              if (t <= 0) break;
              tax += t * b.rate;
              rem -= t;
              prev = b.limit;
            }
            return tax;
          };

          const brackets =
            status === "married"
              ? [
                  { limit: 23200, rate: 0.1 },
                  { limit: 94300, rate: 0.12 },
                  { limit: 201050, rate: 0.22 },
                  { limit: 383900, rate: 0.24 },
                  { limit: 487450, rate: 0.32 },
                  { limit: 731200, rate: 0.35 },
                  { limit: Infinity, rate: 0.37 },
                ]
              : [
                  { limit: 11600, rate: 0.1 },
                  { limit: 47150, rate: 0.12 },
                  { limit: 100525, rate: 0.22 },
                  { limit: 191950, rate: 0.24 },
                  { limit: 243725, rate: 0.32 },
                  { limit: 609350, rate: 0.35 },
                  { limit: Infinity, rate: 0.37 },
                ];

          federalTax = calcTax(taxableTotal, brackets) - calcTax(taxableBase, brackets);
        } else {
          const ltcgBrackets =
            status === "married"
              ? [
                  { limit: 94050, rate: 0 },
                  { limit: 583750, rate: 0.15 },
                  { limit: Infinity, rate: 0.2 },
                ]
              : status === "hoh"
                ? [
                    { limit: 63000, rate: 0 },
                    { limit: 551350, rate: 0.15 },
                    { limit: Infinity, rate: 0.2 },
                  ]
                : [
                    { limit: 47025, rate: 0 },
                    { limit: 518900, rate: 0.15 },
                    { limit: Infinity, rate: 0.2 },
                  ];

          let rem = gain;
          let incomeUsed = otherIncome;
          for (const b of ltcgBrackets) {
            const space = Math.max(0, b.limit - incomeUsed);
            const taxableAtRate = Math.min(rem, space);
            if (taxableAtRate <= 0) {
              incomeUsed = Math.max(incomeUsed, b.limit);
              continue;
            }
            federalTax += taxableAtRate * b.rate;
            rem -= taxableAtRate;
            incomeUsed += taxableAtRate;
            if (rem <= 0) break;
          }
        }

        // NIIT
        const niitThreshold = status === "married" ? 250000 : 200000;
        const totalIncome = otherIncome + gain;
        if (totalIncome > niitThreshold) {
          const niitBase = Math.min(gain, totalIncome - niitThreshold);
          niit = Math.max(0, niitBase) * 0.038;
        }

        const stateTax = gain * (stateRate / 100);
        const totalTax = federalTax + niit + stateTax;
        const netGain = gain - totalTax;
        const effectiveRate = (totalTax / gain) * 100;

        return {
          primary: {
            label: "Total Tax on Crypto Gain",
            value: `$${formatNumber(totalTax)}`,
          },
          details: [
            {
              label: "Capital gain",
              value: `$${formatNumber(gain)}`,
            },
            {
              label: "Federal capital gains tax",
              value: `$${formatNumber(federalTax)}`,
            },
            {
              label: "Net Investment Income Tax (3.8%)",
              value: `$${formatNumber(niit)}`,
            },
            {
              label: "State tax",
              value: `$${formatNumber(stateTax)}`,
            },
            {
              label: "Net gain after tax",
              value: `$${formatNumber(netGain)}`,
            },
            {
              label: "Effective tax rate on gain",
              value: `${formatNumber(effectiveRate)}%`,
            },
          ],
          note: holding === "short"
            ? "Short-term crypto gains (held less than 1 year) are taxed as ordinary income at your marginal rate. Consider holding for 1+ year to qualify for lower long-term rates."
            : "Long-term crypto gains (held 1+ year) are taxed at preferential rates of 0%, 15%, or 20% depending on income. The NIIT may add 3.8% for high earners.",
        };
      },
    },
  ],
  relatedSlugs: [
    "tax-calculator",
    "stock-option-tax-calculator",
    "medicare-surtax-calculator",
  ],
  faq: [
    {
      question: "How is cryptocurrency taxed?",
      answer:
        "Cryptocurrency is treated as property by the IRS. Selling, trading, or using crypto to pay for goods triggers a taxable event. Short-term gains (held < 1 year) are taxed as ordinary income. Long-term gains (held 1+ year) qualify for lower capital gains rates (0%, 15%, or 20%).",
    },
    {
      question: "Do I owe taxes on crypto-to-crypto trades?",
      answer:
        "Yes. Swapping one cryptocurrency for another (e.g., Bitcoin to Ethereum) is a taxable event. You must calculate the gain or loss based on the fair market value at the time of the trade.",
    },
  ],
  formula:
    "Tax = Capital Gain x (Short-term: ordinary rate OR Long-term: 0/15/20%) + NIIT (3.8% if applicable) + State Tax",
};

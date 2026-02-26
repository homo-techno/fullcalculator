import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const capitalGainsTaxDetailedCalculator: CalculatorDefinition = {
  slug: "capital-gains-tax-detailed-calculator",
  title: "Capital Gains Tax Calculator (Detailed)",
  description:
    "Free detailed capital gains tax calculator. Calculate short-term and long-term capital gains tax with 2024 brackets, NIIT, and state tax estimates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "capital gains tax calculator",
    "long term capital gains",
    "short term capital gains",
    "capital gains brackets",
    "niit tax",
    "investment tax calculator",
  ],
  variants: [
    {
      id: "standard",
      name: "Capital Gains Tax Calculator",
      description:
        "Calculate federal capital gains tax on investment sales",
      fields: [
        {
          name: "salePrice",
          label: "Sale Price",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
        },
        {
          name: "costBasis",
          label: "Cost Basis (Purchase Price + Fees)",
          type: "number",
          placeholder: "e.g. 30000",
          prefix: "$",
        },
        {
          name: "holdingPeriod",
          label: "Holding Period",
          type: "select",
          options: [
            { label: "Short-Term (1 year or less)", value: "short" },
            { label: "Long-Term (more than 1 year)", value: "long" },
          ],
          defaultValue: "long",
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
          name: "taxableIncome",
          label: "Other Taxable Income (excluding this gain)",
          type: "number",
          placeholder: "e.g. 75000",
          prefix: "$",
        },
        {
          name: "stateTaxRate",
          label: "State Capital Gains Tax Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const salePrice = parseFloat(inputs.salePrice as string);
        const costBasis = parseFloat(inputs.costBasis as string);
        const holdingPeriod = inputs.holdingPeriod as string;
        const status = inputs.filingStatus as string;
        const otherIncome = parseFloat(inputs.taxableIncome as string) || 0;
        const stateRate = parseFloat(inputs.stateTaxRate as string) || 0;

        if (!salePrice || !costBasis) return null;

        const gain = salePrice - costBasis;
        if (gain <= 0) {
          const loss = Math.abs(gain);
          const deductible = Math.min(loss, 3000);
          return {
            primary: { label: "Capital Loss", value: `$${formatNumber(loss)}` },
            details: [
              { label: "Deductible this year ($3K max)", value: `$${formatNumber(deductible)}` },
              { label: "Carry forward to next year", value: `$${formatNumber(Math.max(0, loss - 3000))}` },
            ],
            note: "Capital losses offset capital gains first. Excess losses deduct up to $3,000/year from ordinary income. Remaining losses carry forward.",
          };
        }

        let federalTax: number;

        if (holdingPeriod === "short") {
          // Short-term: taxed as ordinary income
          const brackets: Record<string, { limit: number; rate: number }[]> = {
            single: [
              { limit: 11600, rate: 0.10 }, { limit: 47150, rate: 0.12 },
              { limit: 100525, rate: 0.22 }, { limit: 191950, rate: 0.24 },
              { limit: 243725, rate: 0.32 }, { limit: 609350, rate: 0.35 },
              { limit: Infinity, rate: 0.37 },
            ],
            married: [
              { limit: 23200, rate: 0.10 }, { limit: 94300, rate: 0.12 },
              { limit: 201050, rate: 0.22 }, { limit: 383900, rate: 0.24 },
              { limit: 487450, rate: 0.32 }, { limit: 731200, rate: 0.35 },
              { limit: Infinity, rate: 0.37 },
            ],
            hoh: [
              { limit: 16550, rate: 0.10 }, { limit: 63100, rate: 0.12 },
              { limit: 100500, rate: 0.22 }, { limit: 191950, rate: 0.24 },
              { limit: 243700, rate: 0.32 }, { limit: 609350, rate: 0.35 },
              { limit: Infinity, rate: 0.37 },
            ],
          };

          const b = brackets[status] || brackets.single;
          const totalIncome = otherIncome + gain;

          const taxOnTotal = (() => {
            let t = 0; let rem = totalIncome; let prev = 0;
            for (const br of b) {
              const taxable = Math.min(rem, br.limit - prev);
              if (taxable <= 0) break;
              t += taxable * br.rate; rem -= taxable; prev = br.limit;
            }
            return t;
          })();

          const taxOnOther = (() => {
            let t = 0; let rem = otherIncome; let prev = 0;
            for (const br of b) {
              const taxable = Math.min(rem, br.limit - prev);
              if (taxable <= 0) break;
              t += taxable * br.rate; rem -= taxable; prev = br.limit;
            }
            return t;
          })();

          federalTax = taxOnTotal - taxOnOther;
        } else {
          // Long-term capital gains brackets (2024)
          const ltBrackets: Record<string, { limit: number; rate: number }[]> = {
            single: [
              { limit: 47025, rate: 0.00 },
              { limit: 518900, rate: 0.15 },
              { limit: Infinity, rate: 0.20 },
            ],
            married: [
              { limit: 94050, rate: 0.00 },
              { limit: 583750, rate: 0.15 },
              { limit: Infinity, rate: 0.20 },
            ],
            hoh: [
              { limit: 63000, rate: 0.00 },
              { limit: 551350, rate: 0.15 },
              { limit: Infinity, rate: 0.20 },
            ],
          };

          const b = ltBrackets[status] || ltBrackets.single;
          let remaining = gain;
          let prevLimit = 0;
          federalTax = 0;

          // Gains stack on top of ordinary income
          let incomeUsed = otherIncome;
          for (const br of b) {
            if (incomeUsed >= br.limit) {
              prevLimit = br.limit;
              continue;
            }
            const spaceInBracket = br.limit - Math.max(incomeUsed, prevLimit);
            const taxableInBracket = Math.min(remaining, spaceInBracket);
            federalTax += taxableInBracket * br.rate;
            remaining -= taxableInBracket;
            if (remaining <= 0) break;
            prevLimit = br.limit;
          }
        }

        // Net Investment Income Tax (NIIT) - 3.8%
        const niitThreshold = status === "married" ? 250000 : 200000;
        const totalIncome = otherIncome + gain;
        const niitBase = Math.min(gain, Math.max(0, totalIncome - niitThreshold));
        const niitTax = niitBase * 0.038;

        const stateTax = gain * (stateRate / 100);
        const totalTax = federalTax + niitTax + stateTax;
        const effectiveRate = (totalTax / gain) * 100;
        const netProceeds = salePrice - totalTax;

        return {
          primary: { label: "Total Capital Gains Tax", value: `$${formatNumber(totalTax)}` },
          details: [
            { label: "Capital gain", value: `$${formatNumber(gain)}` },
            { label: "Federal tax", value: `$${formatNumber(federalTax)}` },
            { label: "NIIT (3.8%)", value: `$${formatNumber(niitTax)}` },
            { label: "State tax", value: `$${formatNumber(stateTax)}` },
            { label: "Effective tax rate on gain", value: `${formatNumber(effectiveRate)}%` },
            { label: "Net proceeds after tax", value: `$${formatNumber(netProceeds)}` },
          ],
          note: holdingPeriod === "short"
            ? "Short-term gains are taxed as ordinary income at your marginal rate. Consider holding longer than 1 year for lower long-term rates."
            : "Long-term capital gains are taxed at 0%, 15%, or 20% depending on income. The 3.8% NIIT applies above $200K (single) or $250K (married).",
        };
      },
    },
  ],
  relatedSlugs: ["tax-calculator", "tax-loss-harvesting-calculator", "stock-return-calculator"],
  faq: [
    {
      question: "What is the difference between short-term and long-term capital gains?",
      answer:
        "Short-term gains (assets held 1 year or less) are taxed as ordinary income (10-37%). Long-term gains (held more than 1 year) are taxed at preferential rates of 0%, 15%, or 20% depending on your income and filing status.",
    },
    {
      question: "What is the Net Investment Income Tax (NIIT)?",
      answer:
        "The NIIT is an additional 3.8% tax on investment income (including capital gains) for individuals with modified AGI above $200,000 (single) or $250,000 (married filing jointly). It applies to the lesser of net investment income or the amount above the threshold.",
    },
  ],
  formula:
    "Capital Gain = Sale Price - Cost Basis. Tax depends on holding period, income bracket, and filing status. NIIT = min(gain, max(0, total income - threshold)) x 3.8%",
};

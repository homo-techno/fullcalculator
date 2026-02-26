import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dividendTaxCalculator: CalculatorDefinition = {
  slug: "dividend-tax-calculator",
  title: "Dividend Tax Calculator",
  description:
    "Free dividend tax calculator. Calculate taxes on qualified vs ordinary dividends based on your income bracket, including NIIT and state taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "dividend tax calculator",
    "qualified dividend tax",
    "ordinary dividend tax",
    "dividend income tax",
    "dividend tax rate",
  ],
  variants: [
    {
      id: "standard",
      name: "Dividend Tax Calculator",
      description:
        "Calculate tax on qualified and ordinary dividends",
      fields: [
        {
          name: "qualifiedDividends",
          label: "Qualified Dividends",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "ordinaryDividends",
          label: "Ordinary (Non-Qualified) Dividends",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          defaultValue: 0,
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
          name: "otherTaxableIncome",
          label: "Other Taxable Income",
          type: "number",
          placeholder: "e.g. 75000",
          prefix: "$",
        },
        {
          name: "stateTaxRate",
          label: "State Tax Rate on Dividends",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const qualified = parseFloat(inputs.qualifiedDividends as string) || 0;
        const ordinary = parseFloat(inputs.ordinaryDividends as string) || 0;
        const status = inputs.filingStatus as string;
        const otherIncome = parseFloat(inputs.otherTaxableIncome as string) || 0;
        const stateRate = parseFloat(inputs.stateTaxRate as string) || 0;

        const totalDividends = qualified + ordinary;
        if (totalDividends <= 0) return null;

        // Qualified dividends use LTCG rates
        const ltcgBrackets: Record<string, { limit: number; rate: number }[]> = {
          single: [
            { limit: 47025, rate: 0 },
            { limit: 518900, rate: 0.15 },
            { limit: Infinity, rate: 0.20 },
          ],
          married: [
            { limit: 94050, rate: 0 },
            { limit: 583750, rate: 0.15 },
            { limit: Infinity, rate: 0.20 },
          ],
          hoh: [
            { limit: 63000, rate: 0 },
            { limit: 551350, rate: 0.15 },
            { limit: Infinity, rate: 0.20 },
          ],
        };

        // Calculate qualified dividend tax (stacks on top of other income)
        const qBrackets = ltcgBrackets[status] || ltcgBrackets.single;
        let qualifiedTax = 0;
        let qRemaining = qualified;
        let incomeUsed = otherIncome;

        for (const br of qBrackets) {
          if (qRemaining <= 0) break;
          if (incomeUsed >= br.limit) continue;
          const space = br.limit - Math.max(incomeUsed, 0);
          const taxable = Math.min(qRemaining, space);
          qualifiedTax += taxable * br.rate;
          qRemaining -= taxable;
          incomeUsed += taxable;
        }

        // Ordinary dividends taxed as ordinary income
        const ordBrackets: Record<string, { limit: number; rate: number }[]> = {
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

        const ob = ordBrackets[status] || ordBrackets.single;
        const taxWithOrd = (() => {
          let t = 0; let r = otherIncome + ordinary; let p = 0;
          for (const br of ob) {
            const taxable = Math.min(r, br.limit - p);
            if (taxable <= 0) break;
            t += taxable * br.rate; r -= taxable; p = br.limit;
          }
          return t;
        })();
        const taxWithoutOrd = (() => {
          let t = 0; let r = otherIncome; let p = 0;
          for (const br of ob) {
            const taxable = Math.min(r, br.limit - p);
            if (taxable <= 0) break;
            t += taxable * br.rate; r -= taxable; p = br.limit;
          }
          return t;
        })();
        const ordinaryTax = taxWithOrd - taxWithoutOrd;

        // NIIT
        const niitThreshold = status === "married" ? 250000 : 200000;
        const totalIncome = otherIncome + totalDividends;
        const niitBase = Math.min(totalDividends, Math.max(0, totalIncome - niitThreshold));
        const niitTax = niitBase * 0.038;

        const stateTax = totalDividends * (stateRate / 100);
        const totalFederalTax = qualifiedTax + ordinaryTax + niitTax;
        const totalTax = totalFederalTax + stateTax;
        const effectiveRate = (totalTax / totalDividends) * 100;
        const afterTaxDividends = totalDividends - totalTax;

        return {
          primary: { label: "Total Dividend Tax", value: `$${formatNumber(totalTax)}` },
          details: [
            { label: "Tax on qualified dividends", value: `$${formatNumber(qualifiedTax)}` },
            { label: "Tax on ordinary dividends", value: `$${formatNumber(ordinaryTax)}` },
            { label: "NIIT (3.8%)", value: `$${formatNumber(niitTax)}` },
            { label: "State tax", value: `$${formatNumber(stateTax)}` },
            { label: "Effective dividend tax rate", value: `${formatNumber(effectiveRate)}%` },
            { label: "After-tax dividend income", value: `$${formatNumber(afterTaxDividends)}` },
            { label: "Total dividends received", value: `$${formatNumber(totalDividends)}` },
          ],
          note: "Qualified dividends are taxed at preferential LTCG rates (0%, 15%, or 20%). Ordinary dividends are taxed at your marginal income tax rate. The 3.8% NIIT may apply above income thresholds.",
        };
      },
    },
  ],
  relatedSlugs: ["capital-gains-tax-detailed-calculator", "tax-calculator", "investment-calculator"],
  faq: [
    {
      question: "What is the difference between qualified and ordinary dividends?",
      answer:
        "Qualified dividends meet IRS holding period requirements (held 60+ days) and are from U.S. or qualifying foreign corporations. They are taxed at the lower LTCG rates (0%, 15%, or 20%). Ordinary dividends are taxed at your regular income tax rate (10-37%).",
    },
    {
      question: "How can I minimize dividend taxes?",
      answer:
        "Hold dividend stocks in tax-advantaged accounts (IRA, 401k), ensure dividends qualify for preferential rates by holding 60+ days, use tax-loss harvesting to offset gains, and consider municipal bond funds for tax-free income.",
    },
    {
      question: "Do I owe the 3.8% NIIT on dividends?",
      answer:
        "The Net Investment Income Tax applies if your modified AGI exceeds $200,000 (single) or $250,000 (married filing jointly). It is assessed on the lesser of your net investment income or the amount by which your MAGI exceeds the threshold.",
    },
  ],
  formula:
    "Qualified Dividend Tax = LTCG bracket rate (0/15/20%). Ordinary Dividend Tax = marginal income tax rate. Plus NIIT (3.8%) if above threshold.",
};

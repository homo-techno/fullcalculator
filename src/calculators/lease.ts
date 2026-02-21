import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const leaseCalculator: CalculatorDefinition = {
  slug: "lease-calculator",
  title: "Lease Calculator",
  description: "Free lease calculator. Calculate monthly car or equipment lease payments from price, residual value, money factor, and term.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["lease calculator", "car lease calculator", "lease payment calculator", "auto lease calculator", "lease vs buy"],
  variants: [
    {
      id: "carLease",
      name: "Car Lease Payment",
      fields: [
        { name: "msrp", label: "MSRP / Sticker Price", type: "number", prefix: "$", placeholder: "e.g. 35000" },
        { name: "negotiated", label: "Negotiated Price", type: "number", prefix: "$", placeholder: "e.g. 32000" },
        { name: "down", label: "Down Payment", type: "number", prefix: "$", placeholder: "e.g. 2000", defaultValue: 0 },
        { name: "residual", label: "Residual Value %", type: "number", suffix: "%", placeholder: "e.g. 55" },
        { name: "moneyFactor", label: "Money Factor", type: "number", placeholder: "e.g. 0.00125" },
        { name: "months", label: "Lease Term (months)", type: "number", placeholder: "e.g. 36", defaultValue: 36 },
      ],
      calculate: (inputs) => {
        const msrp = inputs.msrp as number, neg = inputs.negotiated as number;
        const down = (inputs.down as number) || 0, resPct = inputs.residual as number;
        const mf = inputs.moneyFactor as number, months = inputs.months as number;
        if (!msrp || !neg || !resPct || !mf || !months) return null;
        const residualVal = msrp * (resPct / 100);
        const capCost = neg - down;
        const depreciation = (capCost - residualVal) / months;
        const financeCharge = (capCost + residualVal) * mf;
        const monthly = depreciation + financeCharge;
        const apr = mf * 2400;
        return {
          primary: { label: "Monthly Payment", value: `$${formatNumber(monthly, 2)}` },
          details: [
            { label: "Depreciation/mo", value: `$${formatNumber(depreciation, 2)}` },
            { label: "Finance charge/mo", value: `$${formatNumber(financeCharge, 2)}` },
            { label: "Total lease cost", value: `$${formatNumber(monthly * months + down, 2)}` },
            { label: "Equivalent APR", value: `${formatNumber(apr, 2)}%` },
            { label: "Residual value", value: `$${formatNumber(residualVal, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-loan-calculator", "loan-calculator", "down-payment-calculator"],
  faq: [{ question: "How is a lease payment calculated?", answer: "Monthly lease payment = Depreciation + Finance Charge. Depreciation = (Cap Cost - Residual) / months. Finance Charge = (Cap Cost + Residual) × Money Factor. Money Factor × 2400 = approximate APR." }],
  formula: "Monthly = (Cap-Residual)/months + (Cap+Residual)×MF",
};

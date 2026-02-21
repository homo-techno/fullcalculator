import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const presentValueCalculator: CalculatorDefinition = {
  slug: "present-value-calculator",
  title: "Present Value Calculator",
  description:
    "Free present value calculator. Determine today's value of a future sum using the time value of money discount formula.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["present value", "PV", "discount", "time value of money", "NPV"],
  variants: [
    {
      id: "lumpSum",
      name: "Lump Sum Present Value",
      fields: [
        { name: "futureValue", label: "Future Value ($)", type: "number", placeholder: "e.g. 100000" },
        { name: "rate", label: "Discount Rate (%)", type: "number", placeholder: "e.g. 5" },
        { name: "periods", label: "Number of Periods (years)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const futureValue = inputs.futureValue as number;
        const rate = inputs.rate as number;
        const periods = inputs.periods as number;

        if (!futureValue || !rate || !periods) return null;

        const r = rate / 100;
        const pv = futureValue / Math.pow(1 + r, periods);
        const totalDiscount = futureValue - pv;
        const discountFactor = 1 / Math.pow(1 + r, periods);

        return {
          primary: { label: "Present Value", value: `$${formatNumber(pv, 2)}` },
          details: [
            { label: "Future Value", value: `$${formatNumber(futureValue, 2)}` },
            { label: "Total Discount", value: `$${formatNumber(totalDiscount, 2)}` },
            { label: "Discount Factor", value: formatNumber(discountFactor, 6) },
            { label: "Discount Rate", value: `${formatNumber(rate, 2)}%` },
            { label: "Periods", value: `${periods} years` },
          ],
        };
      },
    },
    {
      id: "annuity",
      name: "Present Value of Annuity",
      fields: [
        { name: "payment", label: "Periodic Payment ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "rate", label: "Discount Rate (%)", type: "number", placeholder: "e.g. 5" },
        { name: "periods", label: "Number of Periods", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const payment = inputs.payment as number;
        const rate = inputs.rate as number;
        const periods = inputs.periods as number;

        if (!payment || !rate || !periods) return null;

        const r = rate / 100;
        const pvAnnuity = payment * ((1 - Math.pow(1 + r, -periods)) / r);
        const totalPayments = payment * periods;
        const totalDiscount = totalPayments - pvAnnuity;

        return {
          primary: { label: "Present Value of Annuity", value: `$${formatNumber(pvAnnuity, 2)}` },
          details: [
            { label: "Total Payments", value: `$${formatNumber(totalPayments, 2)}` },
            { label: "Total Discount", value: `$${formatNumber(totalDiscount, 2)}` },
            { label: "Payment per Period", value: `$${formatNumber(payment, 2)}` },
            { label: "Annuity Factor", value: formatNumber((1 - Math.pow(1 + r, -periods)) / r, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["future-value-calculator", "npv-calculator", "irr-calculator"],
  faq: [
    { question: "What is present value?", answer: "Present value is today's value of a future amount of money, discounted at a specific rate. It reflects the principle that money today is worth more than the same amount in the future." },
    { question: "How is the discount rate chosen?", answer: "The discount rate typically reflects the opportunity cost of capital, inflation expectations, or the required rate of return. Common choices include market interest rates or a company's cost of capital." },
  ],
  formula: "PV = FV / (1 + r)^n; PV Annuity = PMT × [(1 - (1 + r)^-n) / r]",
};

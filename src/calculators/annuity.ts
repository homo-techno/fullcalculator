import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const annuityCalculator: CalculatorDefinition = {
  slug: "annuity-calculator",
  title: "Annuity Calculator",
  description: "Free annuity calculator. Calculate the present and future value of annuity payments. Plan for retirement income streams.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["annuity calculator", "annuity value calculator", "present value annuity", "future value annuity", "annuity payment calculator"],
  variants: [
    {
      id: "future",
      name: "Future Value of Annuity",
      fields: [
        { name: "payment", label: "Regular Payment", type: "number", placeholder: "e.g. 500", prefix: "$" },
        { name: "rate", label: "Annual Interest Rate", type: "number", placeholder: "e.g. 6", suffix: "%" },
        { name: "years", label: "Number of Years", type: "number", placeholder: "e.g. 20" },
        { name: "freq", label: "Payment Frequency", type: "select", options: [
          { label: "Monthly", value: "12" }, { label: "Quarterly", value: "4" }, { label: "Annually", value: "1" },
        ], defaultValue: "12" },
      ],
      calculate: (inputs) => {
        const pmt = inputs.payment as number;
        const apr = (inputs.rate as number) || 0;
        const years = inputs.years as number;
        const freq = parseInt(inputs.freq as string) || 12;
        if (!pmt || !years) return null;
        const r = apr / 100 / freq;
        const n = years * freq;
        const fv = r > 0 ? pmt * ((Math.pow(1 + r, n) - 1) / r) : pmt * n;
        const totalPaid = pmt * n;
        return {
          primary: { label: "Future Value", value: `$${formatNumber(fv)}` },
          details: [
            { label: "Total payments", value: `$${formatNumber(totalPaid)}` },
            { label: "Interest earned", value: `$${formatNumber(fv - totalPaid)}` },
            { label: "Number of payments", value: `${n}` },
          ],
        };
      },
    },
    {
      id: "present",
      name: "Present Value of Annuity",
      description: "How much a series of future payments is worth today",
      fields: [
        { name: "payment", label: "Regular Payment", type: "number", placeholder: "e.g. 1000", prefix: "$" },
        { name: "rate", label: "Discount Rate", type: "number", placeholder: "e.g. 5", suffix: "%" },
        { name: "years", label: "Number of Years", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const pmt = inputs.payment as number;
        const apr = (inputs.rate as number) || 0;
        const years = inputs.years as number;
        if (!pmt || !years) return null;
        const r = apr / 100;
        const pv = r > 0 ? pmt * ((1 - Math.pow(1 + r, -years)) / r) : pmt * years;
        const totalPayments = pmt * years;
        return {
          primary: { label: "Present Value", value: `$${formatNumber(pv)}` },
          details: [
            { label: "Total future payments", value: `$${formatNumber(totalPayments)}` },
            { label: "Discount amount", value: `$${formatNumber(totalPayments - pv)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["retirement-calculator", "compound-interest-calculator", "investment-calculator"],
  faq: [
    { question: "What is an annuity?", answer: "An annuity is a series of equal payments made at regular intervals. Examples: mortgage payments, retirement income, insurance payouts. The present value tells you what those future payments are worth today." },
  ],
  formula: "FV = PMT × ((1+r)^n - 1) / r | PV = PMT × (1 - (1+r)^-n) / r",
};

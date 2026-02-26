import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carLeaseCalculator: CalculatorDefinition = {
  slug: "car-lease-calculator",
  title: "Car Lease Calculator",
  description:
    "Free online car lease calculator. Estimate monthly lease payments, total lease cost, and compare leasing vs. buying for any vehicle.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "car lease calculator",
    "auto lease calculator",
    "lease payment calculator",
    "vehicle lease calculator",
    "monthly lease payment",
  ],
  variants: [
    {
      id: "lease-payment",
      name: "Monthly Lease Payment",
      description: "Calculate your monthly car lease payment",
      fields: [
        { name: "msrp", label: "MSRP (Sticker Price)", type: "number", placeholder: "e.g. 40000", prefix: "$" },
        { name: "negotiatedPrice", label: "Negotiated Price", type: "number", placeholder: "e.g. 37000", prefix: "$" },
        { name: "downPayment", label: "Down Payment", type: "number", placeholder: "e.g. 3000", prefix: "$" },
        { name: "residualPercent", label: "Residual Value %", type: "number", placeholder: "e.g. 55", suffix: "%" },
        { name: "moneyFactor", label: "Money Factor", type: "number", placeholder: "e.g. 0.00125", step: 0.00001 },
        {
          name: "term",
          label: "Lease Term",
          type: "select",
          options: [
            { label: "24 months", value: "24" },
            { label: "36 months", value: "36" },
            { label: "39 months", value: "39" },
            { label: "48 months", value: "48" },
          ],
          defaultValue: "36",
        },
      ],
      calculate: (inputs) => {
        const msrp = parseFloat(inputs.msrp as string) || 0;
        const negotiated = parseFloat(inputs.negotiatedPrice as string) || 0;
        const down = parseFloat(inputs.downPayment as string) || 0;
        const residualPct = parseFloat(inputs.residualPercent as string) || 0;
        const mf = parseFloat(inputs.moneyFactor as string) || 0;
        const months = parseInt(inputs.term as string) || 36;
        if (!msrp || !negotiated) return null;

        const capCost = negotiated - down;
        const residualValue = msrp * (residualPct / 100);
        const depreciation = (capCost - residualValue) / months;
        const financeCharge = (capCost + residualValue) * mf;
        const monthlyPayment = depreciation + financeCharge;
        const totalCost = monthlyPayment * months + down;
        const impliedAPR = mf * 2400;

        return {
          primary: { label: "Monthly Lease Payment", value: `$${formatNumber(monthlyPayment)}` },
          details: [
            { label: "Capitalized cost", value: `$${formatNumber(capCost)}` },
            { label: "Residual value", value: `$${formatNumber(residualValue)}` },
            { label: "Depreciation portion", value: `$${formatNumber(depreciation)}` },
            { label: "Finance charge portion", value: `$${formatNumber(financeCharge)}` },
            { label: "Implied APR", value: `${formatNumber(impliedAPR)}%` },
            { label: "Total lease cost", value: `$${formatNumber(totalCost)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-loan-calculator", "car-affordability-monthly-calculator"],
  faq: [
    {
      question: "What is a money factor in a car lease?",
      answer:
        "The money factor is the financing charge on a lease expressed as a small decimal. To convert it to an approximate APR, multiply by 2,400. For example, a money factor of 0.00125 equals about 3% APR.",
    },
    {
      question: "What is residual value?",
      answer:
        "Residual value is the projected worth of the vehicle at lease end, expressed as a percentage of MSRP. A higher residual means lower monthly payments because you are financing less depreciation.",
    },
    {
      question: "Is it better to lease or buy a car?",
      answer:
        "Leasing offers lower monthly payments and the ability to drive a new car every few years, but you build no equity. Buying costs more monthly but you own the vehicle outright after the loan is paid off.",
    },
  ],
  formula:
    "Monthly Payment = (Cap Cost - Residual) / Term + (Cap Cost + Residual) x Money Factor",
};

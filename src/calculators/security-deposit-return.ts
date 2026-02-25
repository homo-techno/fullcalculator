import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const securityDepositReturnCalculator: CalculatorDefinition = {
  slug: "security-deposit-return-calculator",
  title: "Security Deposit Return Calculator",
  description:
    "Free security deposit return calculator. Estimate your security deposit refund after deductions for damages, cleaning, and unpaid rent.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "security deposit return",
    "security deposit calculator",
    "deposit refund calculator",
    "rental deposit deductions",
    "security deposit deductions",
  ],
  variants: [
    {
      id: "refund-estimate",
      name: "Deposit Refund Estimate",
      description: "Calculate your expected security deposit refund",
      fields: [
        {
          name: "depositAmount",
          label: "Security Deposit Paid",
          type: "number",
          placeholder: "e.g. 2400",
          prefix: "$",
          min: 0,
        },
        {
          name: "unpaidRent",
          label: "Unpaid Rent",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          min: 0,
        },
        {
          name: "cleaningCost",
          label: "Cleaning Costs (beyond normal wear)",
          type: "number",
          placeholder: "e.g. 200",
          prefix: "$",
          min: 0,
        },
        {
          name: "damageCost",
          label: "Damage Repair Costs",
          type: "number",
          placeholder: "e.g. 300",
          prefix: "$",
          min: 0,
        },
        {
          name: "paintCost",
          label: "Painting Costs (beyond normal wear)",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          min: 0,
        },
        {
          name: "otherDeductions",
          label: "Other Deductions",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const deposit = inputs.depositAmount as number;
        const unpaidRent = (inputs.unpaidRent as number) || 0;
        const cleaning = (inputs.cleaningCost as number) || 0;
        const damage = (inputs.damageCost as number) || 0;
        const paint = (inputs.paintCost as number) || 0;
        const other = (inputs.otherDeductions as number) || 0;
        if (!deposit) return null;

        const totalDeductions = unpaidRent + cleaning + damage + paint + other;
        const refund = Math.max(0, deposit - totalDeductions);
        const deductionPercentage = (totalDeductions / deposit) * 100;

        return {
          primary: {
            label: "Estimated Refund",
            value: `$${formatNumber(refund)}`,
          },
          details: [
            { label: "Original deposit", value: `$${formatNumber(deposit)}` },
            { label: "Total deductions", value: `$${formatNumber(totalDeductions)}` },
            { label: "Unpaid rent", value: `$${formatNumber(unpaidRent)}` },
            { label: "Cleaning costs", value: `$${formatNumber(cleaning)}` },
            { label: "Damage repairs", value: `$${formatNumber(damage)}` },
            { label: "Deductions as % of deposit", value: `${formatNumber(deductionPercentage)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["prorated-rent-calculator", "rent-split-calculator", "rental-cash-flow-calculator"],
  faq: [
    {
      question: "What can a landlord deduct from my security deposit?",
      answer:
        "Landlords can typically deduct unpaid rent, damage beyond normal wear and tear, cleaning costs (if unit is left excessively dirty), and unreturned keys or remotes. They cannot deduct for normal wear and tear such as minor scuffs, carpet wear from foot traffic, or faded paint.",
    },
    {
      question: "How long does a landlord have to return my deposit?",
      answer:
        "The timeframe varies by state, typically 14-60 days after move-out. Most states require 21-30 days. Landlords must provide an itemized list of deductions. If they miss the deadline, they may owe the full deposit plus penalties.",
    },
    {
      question: "What is considered normal wear and tear?",
      answer:
        "Normal wear and tear includes small nail holes, minor scuffs on walls, worn carpet in high-traffic areas, faded paint, and minor dirtiness. Damage includes large holes in walls, stains, broken fixtures, pet damage, and excessive filth requiring professional cleaning.",
    },
  ],
  formula: "Refund = Security Deposit - (Unpaid Rent + Cleaning + Damages + Other Deductions)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const proratedRentCalculator: CalculatorDefinition = {
  slug: "prorated-rent-calculator",
  title: "Prorated Rent Calculator",
  description:
    "Free prorated rent calculator. Calculate prorated rent for partial months based on move-in or move-out dates using daily or monthly rate methods.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "prorated rent calculator",
    "partial month rent",
    "rent proration",
    "prorated rent calculation",
    "move-in rent calculator",
  ],
  variants: [
    {
      id: "move-in",
      name: "Move-In Proration",
      description: "Calculate prorated rent for a mid-month move-in",
      fields: [
        {
          name: "monthlyRent",
          label: "Monthly Rent",
          type: "number",
          placeholder: "e.g. 1800",
          prefix: "$",
          min: 0,
        },
        {
          name: "moveInDay",
          label: "Move-In Day of Month",
          type: "number",
          placeholder: "e.g. 15",
          min: 1,
          max: 31,
        },
        {
          name: "daysInMonth",
          label: "Days in That Month",
          type: "select",
          options: [
            { label: "28 days (Feb)", value: "28" },
            { label: "29 days (Feb leap)", value: "29" },
            { label: "30 days", value: "30" },
            { label: "31 days", value: "31" },
          ],
          defaultValue: "30",
        },
        {
          name: "method",
          label: "Proration Method",
          type: "select",
          options: [
            { label: "Actual days in month", value: "actual" },
            { label: "Banker's month (30 days)", value: "banker" },
          ],
          defaultValue: "actual",
        },
      ],
      calculate: (inputs) => {
        const rent = inputs.monthlyRent as number;
        const moveInDay = inputs.moveInDay as number;
        const daysInMonth = parseInt(inputs.daysInMonth as string) || 30;
        const method = inputs.method as string;
        if (!rent || !moveInDay) return null;

        const divisor = method === "banker" ? 30 : daysInMonth;
        const daysRemaining = daysInMonth - moveInDay + 1;
        const dailyRate = rent / divisor;
        const proratedRent = dailyRate * daysRemaining;
        const totalDueAtMoveIn = proratedRent;

        return {
          primary: {
            label: "Prorated Rent Due",
            value: `$${formatNumber(proratedRent)}`,
          },
          details: [
            { label: "Daily rent rate", value: `$${formatNumber(dailyRate)}` },
            { label: "Days remaining in month", value: `${daysRemaining} days` },
            { label: "Full monthly rent", value: `$${formatNumber(rent)}` },
            { label: "Savings vs full month", value: `$${formatNumber(rent - proratedRent)}` },
          ],
        };
      },
    },
    {
      id: "move-out",
      name: "Move-Out Proration",
      description: "Calculate prorated rent for a mid-month move-out",
      fields: [
        {
          name: "monthlyRent",
          label: "Monthly Rent",
          type: "number",
          placeholder: "e.g. 1800",
          prefix: "$",
          min: 0,
        },
        {
          name: "moveOutDay",
          label: "Move-Out Day of Month",
          type: "number",
          placeholder: "e.g. 15",
          min: 1,
          max: 31,
        },
        {
          name: "daysInMonth",
          label: "Days in That Month",
          type: "select",
          options: [
            { label: "28 days (Feb)", value: "28" },
            { label: "29 days (Feb leap)", value: "29" },
            { label: "30 days", value: "30" },
            { label: "31 days", value: "31" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const rent = inputs.monthlyRent as number;
        const moveOutDay = inputs.moveOutDay as number;
        const daysInMonth = parseInt(inputs.daysInMonth as string) || 30;
        if (!rent || !moveOutDay) return null;

        const dailyRate = rent / daysInMonth;
        const proratedRent = dailyRate * moveOutDay;
        const refund = rent - proratedRent;

        return {
          primary: {
            label: "Prorated Rent Due",
            value: `$${formatNumber(proratedRent)}`,
          },
          details: [
            { label: "Daily rent rate", value: `$${formatNumber(dailyRate)}` },
            { label: "Days occupied", value: `${moveOutDay} days` },
            { label: "Refund if full month paid", value: `$${formatNumber(refund)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rent-split-calculator", "security-deposit-return-calculator", "mortgage-calculator"],
  faq: [
    {
      question: "How is prorated rent calculated?",
      answer:
        "Prorated rent is calculated by dividing the monthly rent by the number of days in the month to get a daily rate, then multiplying by the number of days occupied. For example, $1,800 rent with a move-in on the 15th of a 30-day month: $1,800/30 = $60/day x 16 days = $960.",
    },
    {
      question: "What is the banker's method for proration?",
      answer:
        "The banker's method divides rent by 30 regardless of the actual days in the month, simplifying calculations. The actual-days method divides by the real number of days (28, 29, 30, or 31). The banker's method may slightly favor or disadvantage tenants depending on the month.",
    },
    {
      question: "When is prorated rent due?",
      answer:
        "Prorated rent for a move-in is typically due on the move-in date along with the security deposit and sometimes first and last month's rent. For move-outs, the prorated amount may be the only rent due for the final month.",
    },
  ],
  formula: "Prorated Rent = (Monthly Rent / Days in Month) x Days Occupied",
};

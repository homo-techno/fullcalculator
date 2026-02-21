import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const PAY_FREQUENCY_OPTIONS = [
  { label: "Weekly (52/year)", value: "weekly" },
  { label: "Bi-Weekly (26/year)", value: "biweekly" },
  { label: "Semi-Monthly (24/year)", value: "semimonthly" },
  { label: "Monthly (12/year)", value: "monthly" },
];

export const payPeriodCalculator: CalculatorDefinition = {
  slug: "pay-period-calculator",
  title: "Pay Period Calculator",
  description:
    "Free pay period calculator. Calculate your next pay date, pay periods in a year, and how much you earn each pay period.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pay period calculator",
    "next pay date",
    "how many pay periods in a year",
    "paycheck frequency",
    "biweekly pay calculator",
  ],
  variants: [
    {
      id: "pay-periods",
      name: "Pay Period Breakdown",
      description: "Calculate pay period details from annual salary",
      fields: [
        { name: "salary", label: "Annual Salary", type: "number", placeholder: "e.g. 60000", prefix: "$" },
        { name: "frequency", label: "Pay Frequency", type: "select", options: PAY_FREQUENCY_OPTIONS, defaultValue: "biweekly" },
      ],
      calculate: (inputs) => {
        const salary = inputs.salary as number;
        const freq = inputs.frequency as string;
        if (!salary) return null;

        let periodsPerYear: number;
        let periodLabel: string;
        switch (freq) {
          case "weekly": periodsPerYear = 52; periodLabel = "Weekly"; break;
          case "biweekly": periodsPerYear = 26; periodLabel = "Bi-Weekly"; break;
          case "semimonthly": periodsPerYear = 24; periodLabel = "Semi-Monthly"; break;
          case "monthly": periodsPerYear = 12; periodLabel = "Monthly"; break;
          default: periodsPerYear = 26; periodLabel = "Bi-Weekly";
        }

        const perPeriod = salary / periodsPerYear;
        const perWeek = salary / 52;
        const perDay = salary / 260; // 52 weeks × 5 days
        const perHour = salary / 2080; // 52 weeks × 40 hours

        return {
          primary: {
            label: `${periodLabel} Gross Pay`,
            value: `$${formatNumber(perPeriod, 2)}`,
          },
          details: [
            { label: "Pay periods per year", value: `${periodsPerYear}` },
            { label: "Annual salary", value: `$${formatNumber(salary, 2)}` },
            { label: "Weekly gross", value: `$${formatNumber(perWeek, 2)}` },
            { label: "Daily gross (weekdays)", value: `$${formatNumber(perDay, 2)}` },
            { label: "Hourly equivalent (40h/wk)", value: `$${formatNumber(perHour, 2)}` },
          ],
        };
      },
    },
    {
      id: "next-payday",
      name: "Next Pay Date",
      description: "Find your next pay date from your last pay date",
      fields: [
        { name: "lastPayYear", label: "Last Pay Year", type: "number", placeholder: "e.g. 2026", min: 2020, max: 2030 },
        { name: "lastPayMonth", label: "Last Pay Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "lastPayDay", label: "Last Pay Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "frequency", label: "Pay Frequency", type: "select", options: PAY_FREQUENCY_OPTIONS, defaultValue: "biweekly" },
      ],
      calculate: (inputs) => {
        const y = inputs.lastPayYear as number;
        const m = inputs.lastPayMonth as number;
        const d = inputs.lastPayDay as number;
        const freq = inputs.frequency as string;
        if (!y || !m || !d) return null;

        const lastPay = new Date(y, m - 1, d);
        let nextPay: Date;

        switch (freq) {
          case "weekly":
            nextPay = new Date(lastPay.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case "biweekly":
            nextPay = new Date(lastPay.getTime() + 14 * 24 * 60 * 60 * 1000);
            break;
          case "semimonthly":
            if (lastPay.getDate() <= 15) {
              nextPay = new Date(y, m - 1, lastPay.getDate() + 15 <= 28 ? lastPay.getDate() + 15 : 28);
            } else {
              nextPay = new Date(y, m, 15);
            }
            break;
          case "monthly":
            nextPay = new Date(y, m, d);
            break;
          default:
            nextPay = new Date(lastPay.getTime() + 14 * 24 * 60 * 60 * 1000);
        }

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const nextPayStr = `${dayNames[nextPay.getDay()]}, ${monthNames[nextPay.getMonth()]} ${nextPay.getDate()}, ${nextPay.getFullYear()}`;

        const now = new Date();
        const daysUntil = Math.ceil((nextPay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return {
          primary: { label: "Next Pay Date", value: nextPayStr },
          details: [
            { label: "Days until payday", value: daysUntil > 0 ? `${daysUntil}` : "Already passed" },
            { label: "Day of week", value: dayNames[nextPay.getDay()] },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "salary-calculator",
    "paycheck-calculator",
    "time-card-calculator",
  ],
  faq: [
    {
      question: "How many pay periods are in a year?",
      answer:
        "Weekly = 52, Bi-weekly = 26, Semi-monthly = 24, Monthly = 12. Bi-weekly is the most common pay frequency in the US.",
    },
    {
      question: "What is the difference between bi-weekly and semi-monthly?",
      answer:
        "Bi-weekly pay is every two weeks (26 pay periods). Semi-monthly pay is twice a month, usually on the 1st and 15th (24 pay periods). Bi-weekly results in 2 extra paychecks per year.",
    },
  ],
  formula: "Pay Per Period = Annual Salary / Number of Pay Periods",
};

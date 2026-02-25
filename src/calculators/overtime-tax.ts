import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const overtimeTaxCalculator: CalculatorDefinition = {
  slug: "overtime-tax-calculator",
  title: "Overtime Tax Calculator",
  description:
    "Free overtime tax calculator. Estimate the tax impact of overtime pay and see your actual take-home from overtime hours.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "overtime tax calculator",
    "overtime pay tax",
    "overtime take home",
    "time and a half tax",
    "overtime withholding",
  ],
  variants: [
    {
      id: "overtime-tax",
      name: "Overtime Tax Impact",
      description:
        "Calculate how much you actually take home from overtime pay after taxes",
      fields: [
        {
          name: "hourlyRate",
          label: "Regular Hourly Rate",
          type: "number",
          placeholder: "e.g. 30",
          prefix: "$",
        },
        {
          name: "regularHours",
          label: "Regular Hours Per Week",
          type: "number",
          placeholder: "e.g. 40",
          defaultValue: 40,
        },
        {
          name: "overtimeHours",
          label: "Overtime Hours Per Week",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "overtimeMultiplier",
          label: "Overtime Pay Multiplier",
          type: "select",
          options: [
            { label: "1.5x (Time and a Half)", value: "1.5" },
            { label: "2.0x (Double Time)", value: "2.0" },
            { label: "1.0x (Straight Time)", value: "1.0" },
          ],
          defaultValue: "1.5",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
          ],
          defaultValue: "single",
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
        const hourlyRate = inputs.hourlyRate as number;
        const regularHours = (inputs.regularHours as number) || 40;
        const overtimeHours = inputs.overtimeHours as number;
        const otMultiplier =
          parseFloat(inputs.overtimeMultiplier as string) || 1.5;
        const status = inputs.filingStatus as string;
        const stateRate = (inputs.stateTaxRate as number) || 0;

        if (!hourlyRate || hourlyRate <= 0 || !overtimeHours) return null;

        const weeklyRegular = hourlyRate * regularHours;
        const weeklyOT = hourlyRate * otMultiplier * overtimeHours;
        const weeklyTotal = weeklyRegular + weeklyOT;

        const annualWithoutOT = weeklyRegular * 52;
        const annualWithOT = weeklyTotal * 52;
        const annualOTPay = weeklyOT * 52;

        const standardDeduction = status === "married" ? 30000 : 15000;

        const calcFedTax = (annual: number) => {
          const taxable = Math.max(0, annual - standardDeduction);
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
          let tax = 0;
          let rem = taxable;
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

        const fedTaxWithout = calcFedTax(annualWithoutOT);
        const fedTaxWith = calcFedTax(annualWithOT);
        const marginalFedOnOT = fedTaxWith - fedTaxWithout;

        const ssOnOT = Math.min(annualOTPay, Math.max(0, 168600 - annualWithoutOT)) * 0.062;
        const medicareOnOT = annualOTPay * 0.0145;
        const stateOnOT = annualOTPay * (stateRate / 100);

        const totalTaxOnOT = marginalFedOnOT + ssOnOT + medicareOnOT + stateOnOT;
        const netOTPay = annualOTPay - totalTaxOnOT;
        const effectiveOTRate = (totalTaxOnOT / annualOTPay) * 100;
        const netOTHourlyRate = netOTPay / (overtimeHours * 52);

        return {
          primary: {
            label: "Net OT Take-Home (Annual)",
            value: `$${formatNumber(netOTPay)}`,
          },
          details: [
            {
              label: "Gross overtime pay (annual)",
              value: `$${formatNumber(annualOTPay)}`,
            },
            {
              label: "Federal tax on OT",
              value: `$${formatNumber(marginalFedOnOT)}`,
            },
            {
              label: "SS + Medicare on OT",
              value: `$${formatNumber(ssOnOT + medicareOnOT)}`,
            },
            {
              label: "State tax on OT",
              value: `$${formatNumber(stateOnOT)}`,
            },
            {
              label: "Effective tax rate on OT",
              value: `${formatNumber(effectiveOTRate)}%`,
            },
            {
              label: "Net hourly rate for OT",
              value: `$${formatNumber(netOTHourlyRate)}/hr`,
            },
          ],
          note: "Overtime pay is taxed at your marginal tax rate, not a special OT rate. It may feel more heavily taxed because it pushes income into higher brackets, but it is never taxed at 100%.",
        };
      },
    },
  ],
  relatedSlugs: [
    "paycheck-calculator",
    "payroll-withholding-calculator",
    "tax-calculator",
  ],
  faq: [
    {
      question: "Is overtime taxed at a higher rate?",
      answer:
        "Overtime is taxed at your marginal tax rate like all other income. It may appear more heavily taxed because your employer withholds at the rate assuming that paycheck is typical, but you will get any overpayment back as a refund.",
    },
    {
      question: "How much of my overtime do I actually keep?",
      answer:
        "Depending on your tax bracket and state, you typically keep 55-75% of your overtime pay after federal income tax, state tax, Social Security, and Medicare.",
    },
  ],
  formula:
    "Net OT = Gross OT - Marginal Federal Tax - SS (6.2%) - Medicare (1.45%) - State Tax",
};

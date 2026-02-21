import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const overtimePayCalculator: CalculatorDefinition = {
  slug: "overtime-calculator",
  title: "Overtime Calculator",
  description:
    "Free overtime calculator. Calculate gross pay including overtime hours at 1.5x rate. See regular pay, overtime pay, and total gross earnings for any pay period.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "overtime calculator",
    "overtime pay calculator",
    "time and a half calculator",
    "ot pay calculator",
    "overtime hours calculator",
  ],
  variants: [
    {
      id: "overtime",
      name: "Calculate Overtime Pay",
      description: "Calculate gross pay with regular and overtime hours",
      fields: [
        {
          name: "hourlyRate",
          label: "Hourly Rate",
          type: "number",
          placeholder: "e.g. 25",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "regularHours",
          label: "Regular Hours",
          type: "number",
          placeholder: "e.g. 40",
          min: 0,
          step: 0.5,
          defaultValue: 40,
        },
        {
          name: "overtimeHours",
          label: "Overtime Hours",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
          step: 0.5,
        },
        {
          name: "otMultiplier",
          label: "OT Rate Multiplier",
          type: "select",
          options: [
            { label: "1.5x (Time and a half)", value: "1.5" },
            { label: "2x (Double time)", value: "2" },
          ],
          defaultValue: "1.5",
        },
      ],
      calculate: (inputs) => {
        const hourlyRate = inputs.hourlyRate as number;
        const regularHours = (inputs.regularHours as number) || 40;
        const overtimeHours = (inputs.overtimeHours as number) || 0;
        const otMultiplier = parseFloat(inputs.otMultiplier as string) || 1.5;
        if (!hourlyRate) return null;

        const regularPay = hourlyRate * regularHours;
        const otRate = hourlyRate * otMultiplier;
        const overtimePay = otRate * overtimeHours;
        const totalGross = regularPay + overtimePay;
        const totalHours = regularHours + overtimeHours;
        const effectiveRate = totalHours > 0 ? totalGross / totalHours : 0;

        // Annual estimates (assuming same pattern every week)
        const weeklyGross = totalGross;
        const annualGross = weeklyGross * 52;

        return {
          primary: {
            label: "Total Gross Pay",
            value: `$${formatNumber(totalGross)}`,
          },
          details: [
            { label: "Regular pay", value: `$${formatNumber(regularPay)}` },
            { label: "Overtime pay", value: `$${formatNumber(overtimePay)}` },
            { label: "OT hourly rate", value: `$${formatNumber(otRate)}` },
            { label: "Total hours worked", value: `${formatNumber(totalHours, 1)}` },
            { label: "Effective hourly rate", value: `$${formatNumber(effectiveRate)}` },
            { label: "Estimated weekly gross", value: `$${formatNumber(weeklyGross)}` },
            { label: "Estimated annual gross", value: `$${formatNumber(annualGross)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "take-home-pay-calculator", "hourly-to-salary-calculator"],
  faq: [
    {
      question: "How is overtime pay calculated?",
      answer:
        "Overtime pay is typically calculated at 1.5 times your regular hourly rate (time and a half) for hours worked beyond 40 per week. For example, if your rate is $20/hr, overtime is $30/hr. Some employers or situations may offer double time (2x).",
    },
    {
      question: "When does overtime kick in?",
      answer:
        "Under the Fair Labor Standards Act (FLSA), non-exempt employees must receive overtime pay for hours over 40 in a workweek. Some states (like California) also require daily overtime after 8 hours. Salaried exempt employees generally do not qualify for overtime.",
    },
    {
      question: "Is overtime taxed at a higher rate?",
      answer:
        "Overtime is not taxed at a special higher rate. However, the additional income may push you into a higher tax bracket for those extra dollars. Your employer may withhold more from an overtime paycheck, but this is reconciled when you file taxes.",
    },
  ],
  formula:
    "Regular Pay = Hourly Rate × Regular Hours. OT Pay = (Hourly Rate × 1.5) × OT Hours. Total Gross = Regular Pay + OT Pay.",
};

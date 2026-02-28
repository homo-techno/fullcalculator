import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lostWagesCalculator: CalculatorDefinition = {
  slug: "lost-wages-calculator",
  title: "Lost Wages Calculator",
  description: "Free lost wages calculator. Calculate income lost due to injury, illness, or disability during recovery period.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["lost wages calculator", "lost income calculator", "lost earnings injury calculator"],
  variants: [{
    id: "standard",
    name: "Lost Wages",
    description: "Free lost wages calculator",
    fields: [
      { name: "hourlyRate", label: "Hourly Rate / Daily Rate", type: "number", prefix: "$", min: 0 },
      { name: "rateType", label: "Rate Type", type: "select", options: [{ label: "Hourly", value: "hourly" }, { label: "Daily", value: "daily" }, { label: "Annual Salary", value: "annual" }], defaultValue: "hourly" },
      { name: "daysLost", label: "Work Days Lost", type: "number", min: 0 },
      { name: "partialDisability", label: "Partial Disability %", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 100 },
    ],
    calculate: (inputs) => {
      const rate = inputs.hourlyRate as number;
      const rateType = inputs.rateType as string;
      const days = inputs.daysLost as number;
      const disability = (inputs.partialDisability as number) || 100;
      if (!rate || !days || rate <= 0 || days <= 0) return null;
      let dailyRate;
      if (rateType === "hourly") dailyRate = rate * 8;
      else if (rateType === "daily") dailyRate = rate;
      else dailyRate = rate / 260;
      const totalLost = dailyRate * days * (disability / 100);
      return {
        primary: { label: "Total Lost Wages", value: "$" + formatNumber(totalLost) },
        details: [
          { label: "Daily earnings", value: "$" + formatNumber(dailyRate) },
          { label: "Days missed", value: String(days) },
          { label: "Disability level", value: disability + "%" },
          { label: "Weekly lost income", value: "$" + formatNumber(dailyRate * 5 * disability / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["personal-injury-calculator", "workers-comp-calculator"],
  faq: [
    { question: "How are lost wages calculated?", answer: "Daily rate × number of work days missed × disability percentage. Hourly workers: rate × 8 hours. Salaried: annual salary ÷ 260 work days." },
    { question: "Can I claim lost wages for partial disability?", answer: "Yes. If you can work reduced hours or at lower capacity, you can claim the difference as partial lost wages." },
  ],
  formula: "Lost Wages = Daily Rate × Days Missed × Disability %",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const driverPayCalculator: CalculatorDefinition = {
  slug: "driver-pay-calculator",
  title: "Driver Pay Calculator",
  description: "Estimate truck driver pay for a trip or period.",
  category: "Finance",
  categorySlug: "$",
  icon: "DollarSign",
  keywords: ["driver","pay","trucking","salary","wages"],
  variants: [{
    id: "standard",
    name: "Driver Pay",
    description: "Estimate truck driver pay for a trip or period.",
    fields: [
      { name: "payType", label: "Pay Type", type: "select", options: [{ value: "mile", label: "Per Mile" }, { value: "hour", label: "Per Hour" }, { value: "percent", label: "Percent of Load" }] },
      { name: "rate", label: "Rate ($/mi, $/hr, or %)", type: "number", min: 0.1, max: 100, defaultValue: 0.55 },
      { name: "miles", label: "Total Miles", type: "number", min: 0, max: 20000, defaultValue: 2500 },
      { name: "hours", label: "Total Hours", type: "number", min: 0, max: 500, defaultValue: 50 },
      { name: "loadRevenue", label: "Load Revenue ($)", type: "number", min: 0, max: 100000, defaultValue: 5000 },
    ],
    calculate: (inputs) => {
    const payType = inputs.payType as string;
    const rate = inputs.rate as number;
    const miles = inputs.miles as number;
    const hours = inputs.hours as number;
    const loadRevenue = inputs.loadRevenue as number;
    let grossPay = 0;
    if (payType === "mile") {
      grossPay = rate * miles;
    } else if (payType === "hour") {
      grossPay = rate * hours;
    } else {
      grossPay = loadRevenue * (rate / 100);
    }
    const effectivePerMile = miles > 0 ? grossPay / miles : 0;
    const effectivePerHour = hours > 0 ? grossPay / hours : 0;
    return {
      primary: { label: "Gross Pay", value: "$" + formatNumber(grossPay) },
      details: [
        { label: "Pay Type", value: payType === "mile" ? "Per Mile" : payType === "hour" ? "Per Hour" : "Percent of Load" },
        { label: "Effective $/Mile", value: "$" + formatNumber(effectivePerMile) },
        { label: "Effective $/Hour", value: "$" + formatNumber(effectivePerHour) },
        { label: "Total Miles", value: formatNumber(miles) }
      ]
    };
  },
  }],
  relatedSlugs: ["deadhead-miles-calculator","eld-hours-calculator","fleet-fuel-cost-calculator"],
  faq: [
    { question: "How are truck drivers paid?", answer: "Common methods include per mile, per hour, or a percentage of load revenue." },
    { question: "What is average truck driver pay per mile?", answer: "Company drivers typically earn 0.45 to 0.65 per mile." },
  ],
  formula: "Gross Pay = Rate x Miles (or Hours or % of Revenue)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const workersCompRateCalculator: CalculatorDefinition = {
  slug: "workers-comp-rate-calculator",
  title: "Workers Comp Rate Calculator",
  description: "Estimate workers compensation insurance premium costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["workers comp","insurance","premium","workplace"],
  variants: [{
    id: "standard",
    name: "Workers Comp Rate",
    description: "Estimate workers compensation insurance premium costs.",
    fields: [
      { name: "annualPayroll", label: "Annual Payroll ($)", type: "number", min: 10000, max: 50000000, defaultValue: 500000 },
      { name: "classRate", label: "Class Rate (per $100)", type: "number", min: 0.1, max: 30, defaultValue: 2.5 },
      { name: "experienceMod", label: "Experience Modifier", type: "number", min: 0.5, max: 2, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const annualPayroll = inputs.annualPayroll as number;
    const classRate = inputs.classRate as number;
    const experienceMod = inputs.experienceMod as number;
    const manualPremium = (annualPayroll / 100) * classRate;
    const modifiedPremium = manualPremium * experienceMod;
    const monthlyPremium = modifiedPremium / 12;
    const ratePerEmployee = modifiedPremium / (annualPayroll / 50000);
    return { primary: { label: "Annual Premium", value: "$" + formatNumber(modifiedPremium) }, details: [{ label: "Manual Premium", value: "$" + formatNumber(manualPremium) }, { label: "Monthly Premium", value: "$" + formatNumber(monthlyPremium) }, { label: "Cost Per $50k Payroll", value: "$" + formatNumber(ratePerEmployee) }] };
  },
  }],
  relatedSlugs: ["overtime-cost-calculator","employee-benefits-cost-calculator","absenteeism-cost-calculator"],
  faq: [
    { question: "How is workers comp premium calculated?", answer: "Premium equals payroll divided by 100 times the class rate times the modifier." },
    { question: "What is an experience modifier?", answer: "It adjusts premiums based on your claims history versus industry average." },
    { question: "What affects the class rate?", answer: "Industry risk level, job duties, and state regulations determine the rate." },
  ],
  formula: "Premium = (Payroll / 100) * ClassRate * ExperienceModifier",
};

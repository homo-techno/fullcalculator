import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const restaurantLaborCostPercentageCalculator: CalculatorDefinition = {
  slug: "restaurant-labor-cost-percentage-calculator",
  title: "Restaurant Labor Cost Percentage Calculator",
  description: "Calculate your restaurant labor cost as a percentage of revenue including wages, benefits, payroll taxes, and overtime for all staff categories.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["restaurant labor cost","labor cost percentage","restaurant payroll","staff cost ratio"],
  variants: [{
    id: "standard",
    name: "Restaurant Labor Cost Percentage",
    description: "Calculate your restaurant labor cost as a percentage of revenue including wages, benefits, payroll taxes, and overtime for all staff categories.",
    fields: [
      { name: "monthlyRevenue", label: "Monthly Revenue ($)", type: "number", min: 1000, max: 5000000, defaultValue: 80000 },
      { name: "fohWages", label: "Front-of-House Wages ($)", type: "number", min: 0, max: 1000000, defaultValue: 12000 },
      { name: "bohWages", label: "Back-of-House Wages ($)", type: "number", min: 0, max: 1000000, defaultValue: 10000 },
      { name: "managementSalaries", label: "Management Salaries ($)", type: "number", min: 0, max: 500000, defaultValue: 5500 },
      { name: "payrollTaxPct", label: "Payroll Taxes and Benefits (%)", type: "number", min: 0, max: 40, defaultValue: 12 },
    ],
    calculate: (inputs) => {
    const revenue = inputs.monthlyRevenue as number;
    const foh = inputs.fohWages as number;
    const boh = inputs.bohWages as number;
    const mgmt = inputs.managementSalaries as number;
    const taxPct = inputs.payrollTaxPct as number / 100;
    const baseLabor = foh + boh + mgmt;
    const taxes = baseLabor * taxPct;
    const totalLabor = baseLabor + taxes;
    const laborPct = revenue > 0 ? (totalLabor / revenue) * 100 : 0;
    const fohPct = revenue > 0 ? (foh / revenue) * 100 : 0;
    const bohPct = revenue > 0 ? (boh / revenue) * 100 : 0;
    return {
      primary: { label: "Total Labor Cost %", value: formatNumber(Math.round(laborPct * 10) / 10) + "%" },
      details: [
        { label: "Total Labor Cost", value: "$" + formatNumber(Math.round(totalLabor)) },
        { label: "Base Wages (before taxes)", value: "$" + formatNumber(Math.round(baseLabor)) },
        { label: "Payroll Taxes and Benefits", value: "$" + formatNumber(Math.round(taxes)) },
        { label: "FOH Labor %", value: formatNumber(Math.round(fohPct * 10) / 10) + "%" },
        { label: "BOH Labor %", value: formatNumber(Math.round(bohPct * 10) / 10) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["restaurant-profit-margin-calculator","tip-pool-distribution-calculator"],
  faq: [
    { question: "What should restaurant labor cost percentage be?", answer: "Restaurant labor cost should be 25 to 35 percent of total revenue. Full-service restaurants run 30 to 35 percent, fast casual 25 to 30 percent, and quick-service 20 to 25 percent. Prime cost (food plus labor) should stay under 65 percent." },
    { question: "How can I reduce labor costs without cutting staff?", answer: "Cross-train employees to cover multiple roles, optimize scheduling using sales forecasts, reduce overtime through better shift planning, invest in kitchen technology, streamline prep processes, and use part-time staff during peak hours." },
    { question: "What is prime cost in a restaurant?", answer: "Prime cost is the sum of total food and beverage cost plus total labor cost. It is the single most important metric for restaurant profitability. A well-managed restaurant keeps prime cost between 55 and 65 percent of revenue." },
  ],
  formula: "Total Labor = FOH Wages + BOH Wages + Management + Payroll Taxes
Labor Cost % = (Total Labor / Revenue) x 100",
};

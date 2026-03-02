import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const farmLaborCostCalculator: CalculatorDefinition = {
  slug: "farm-labor-cost-calculator",
  title: "Farm Labor Cost Calculator",
  description: "Calculate total labor costs for farm operations including wages, overtime, benefits, and seasonal workers.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["farm labor cost","agricultural worker cost","farm payroll calculator"],
  variants: [{
    id: "standard",
    name: "Farm Labor Cost",
    description: "Calculate total labor costs for farm operations including wages, overtime, benefits, and seasonal workers.",
    fields: [
      { name: "numWorkers", label: "Number of Workers", type: "number", min: 1, max: 500, defaultValue: 5 },
      { name: "hourlyWage", label: "Hourly Wage ($)", type: "number", min: 7, max: 50, defaultValue: 15 },
      { name: "hoursPerWeek", label: "Hours Per Week", type: "number", min: 10, max: 80, defaultValue: 45 },
      { name: "weeksPerYear", label: "Weeks Per Year", type: "number", min: 1, max: 52, defaultValue: 40 },
      { name: "benefitsPct", label: "Benefits & Taxes (%)", type: "number", min: 0, max: 50, defaultValue: 18 },
    ],
    calculate: (inputs) => {
      const nw = inputs.numWorkers as number;
      const hw = inputs.hourlyWage as number;
      const hpw = inputs.hoursPerWeek as number;
      const wpy = inputs.weeksPerYear as number;
      const bp = inputs.benefitsPct as number;
      if (!nw || !hw || !hpw || !wpy) return null;
      const regHours = Math.min(hpw, 40);
      const otHours = Math.max(0, hpw - 40);
      const weeklyPay = (regHours * hw) + (otHours * hw * 1.5);
      const annualPerWorker = Math.round(weeklyPay * wpy * 100) / 100;
      const benefits = Math.round(annualPerWorker * bp / 100 * 100) / 100;
      const totalPerWorker = Math.round(annualPerWorker + benefits);
      const totalLabor = Math.round(totalPerWorker * nw);
      return {
        primary: { label: "Total Annual Labor Cost", value: "$" + formatNumber(totalLabor) },
        details: [
          { label: "Cost Per Worker", value: "$" + formatNumber(totalPerWorker) },
          { label: "Base Pay Per Worker", value: "$" + formatNumber(Math.round(annualPerWorker)) },
          { label: "Benefits Per Worker", value: "$" + formatNumber(Math.round(benefits)) },
          { label: "Overtime Hours/Week", value: formatNumber(otHours) },
        ],
      };
  },
  }],
  relatedSlugs: ["farm-profit-margin-calculator","tractor-fuel-cost-calculator"],
  faq: [
    { question: "What is the average farm worker wage?", answer: "The average US farm worker wage ranges from $13 to $18 per hour depending on region, experience, and type of agriculture. Skilled equipment operators and supervisors earn $18 to $28 per hour." },
    { question: "Are farm workers entitled to overtime?", answer: "Federal overtime rules for farm workers vary. Many states now require agricultural overtime after 40 or 60 hours per week. Check your state labor laws for specific requirements." },
  ],
  formula: "Weekly Pay = (Regular Hours x Wage) + (OT Hours x Wage x 1.5)
Annual Pay = Weekly Pay x Weeks Per Year
Total Cost = Annual Pay x (1 + Benefits%) x Number of Workers",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const turkeySgkCalculator: CalculatorDefinition = {
  slug: "turkey-sgk-calculator",
  title: "Turkey SGK Calculator",
  description: "Free Turkey SGK (social security) calculator for 2025. Calculate employee and employer SSI premiums and total payroll cost.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["turkey sgk calculator", "sgk primi hesaplama", "turkey social security calculator 2025"],
  variants: [{
    id: "standard",
    name: "Turkey SGK",
    description: "Free Turkey SGK (social security) calculator for 2025",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "₺", min: 0 },
    ],
    calculate: (inputs) => {
      const gross = inputs.gross as number;
      if (!gross || gross <= 0) return null;
      const floor = 26005.50;
      const ceiling = 195041.40;
      const base = Math.max(floor, Math.min(gross, ceiling));
      const empSSI = base * 0.14;
      const empUnemploy = base * 0.01;
      const stampTax = gross * 0.00759;
      const totalEmp = empSSI + empUnemploy + stampTax;
      const erSSI = base * 0.1675;
      const erUnemploy = base * 0.02;
      const totalEr = erSSI + erUnemploy;
      return {
        primary: { label: "Employee Deductions", value: "₺" + formatNumber(totalEmp) },
        details: [
          { label: "SSI premium (14%)", value: "₺" + formatNumber(empSSI) },
          { label: "Unemployment (1%)", value: "₺" + formatNumber(empUnemploy) },
          { label: "Stamp tax (0.759%)", value: "₺" + formatNumber(stampTax) },
          { label: "Employer SSI (16.75%)", value: "₺" + formatNumber(erSSI) },
          { label: "Employer unemployment (2%)", value: "₺" + formatNumber(erUnemploy) },
          { label: "Total employer cost", value: "₺" + formatNumber(gross + totalEr) },
        ],
        note: "2025 SGK floor: ₺26,005.50. Ceiling: ₺195,041.40. Employer gets 4-point discount reducing 20.75% to 16.75%.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What are SGK rates for 2025?", answer: "Employee: 14% SSI + 1% unemployment = 15%. Employer: 16.75% SSI (with discount) + 2% unemployment = 18.75%. Plus 0.759% stamp tax on gross salary." },
    { question: "What is the SGK salary ceiling?", answer: "The 2025 SGK ceiling is ₺195,041.40/month. Contributions are not calculated on salary above this amount." },
  ],
  formula: "Employee = SSI 14% + Unemployment 1% + Stamp Tax 0.759%. Employer = SSI 16.75% + Unemployment 2%.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const spainAutonomoCalculator: CalculatorDefinition = {
  slug: "spain-autonomo-calculator",
  title: "Spain Autónomo Calculator",
  description: "Free Spain self-employed (autónomo) calculator. Calculate social security contributions under the new income-based system.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["spain autonomo calculator", "cuota autonomo 2025 calculator", "spain self employed calculator"],
  variants: [{
    id: "standard",
    name: "Spain Autónomo",
    description: "Free Spain self-employed (autónomo) calculator",
    fields: [
      { name: "netIncome", label: "Monthly Net Income", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.netIncome as number;
      if (!income && income !== 0) return null;
      const brackets = [
        {max:670,quota:230},{max:900,quota:260},{max:1166.70,quota:275},{max:1300,quota:291},
        {max:1500,quota:294},{max:1700,quota:294},{max:1850,quota:310},{max:2030,quota:315},
        {max:2330,quota:320},{max:2760,quota:330},{max:3190,quota:350},{max:3620,quota:370},
        {max:4050,quota:390},{max:6000,quota:420},{max:Infinity,quota:530}
      ];
      const bracket = brackets.find(b => income <= b.max) || brackets[brackets.length - 1];
      const annual = bracket.quota * 12;
      return {
        primary: { label: "Monthly Cuota", value: "€" + formatNumber(bracket.quota) },
        details: [
          { label: "Net income bracket", value: "up to €" + (bracket.max === Infinity ? "6,000+" : formatNumber(bracket.max)) },
          { label: "Annual contributions", value: "€" + formatNumber(annual) },
          { label: "Income after cuota", value: "€" + formatNumber(Math.max(0, income - bracket.quota)) },
        ],
        note: "2025 income-based contribution system. Transitional period: actual brackets may be adjusted. Tarifa plana: €80/month for first 12 months for new autónomos.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much does an autónomo pay in Spain?", answer: "From 2025, contributions are based on net income: from €230/month (income ≤€670) to €530/month (income >€6,000). The old flat-rate system has been replaced." },
    { question: "What is the tarifa plana?", answer: "New autónomos pay a reduced flat rate of €80/month for the first 12 months, extendable to 24 months if income stays below minimum wage." },
  ],
  formula: "Monthly Cuota = Income-based bracket (€230-€530/month in 2025)",
};

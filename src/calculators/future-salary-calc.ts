import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const futureSalaryCalculator: CalculatorDefinition = {
  slug: "future-salary-calculator",
  title: "Future Salary Projection Calculator",
  description:
    "Free future salary calculator. Project your salary growth over time with annual raises and see the impact of inflation on your real purchasing power.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "future salary calculator",
    "salary projection",
    "salary growth calculator",
    "annual raise calculator",
    "salary forecast",
  ],
  variants: [
    {
      id: "standard",
      name: "Future Salary Projection",
      description:
        "Project salary growth with annual raises over a specified period",
      fields: [
        {
          name: "currentSalary",
          label: "Current Annual Salary",
          type: "number",
          placeholder: "e.g. 65000",
          prefix: "$",
        },
        {
          name: "annualRaise",
          label: "Expected Annual Raise",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "%",
        },
        {
          name: "years",
          label: "Years to Project",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "years",
        },
        {
          name: "inflationRate",
          label: "Expected Inflation Rate",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "%",
          defaultValue: 3,
        },
      ],
      calculate: (inputs) => {
        const current = parseFloat(inputs.currentSalary as string);
        const raise = parseFloat(inputs.annualRaise as string);
        const years = parseFloat(inputs.years as string);
        const inflation = parseFloat(inputs.inflationRate as string) || 0;

        if (!current || current <= 0 || raise === undefined || !years || years <= 0) return null;

        const raiseRate = raise / 100;
        const inflationRate = inflation / 100;

        const futureSalary = current * Math.pow(1 + raiseRate, years);
        const totalEarnings = raiseRate !== 0
          ? current * (Math.pow(1 + raiseRate, years) - 1) / raiseRate
          : current * years;

        const realSalary = futureSalary / Math.pow(1 + inflationRate, years);
        const realGrowthRate = ((1 + raiseRate) / (1 + inflationRate) - 1) * 100;

        const nominalGrowth = futureSalary - current;
        const percentGrowth = ((futureSalary - current) / current) * 100;

        return {
          primary: {
            label: `Salary in ${formatNumber(years)} Years`,
            value: `$${formatNumber(futureSalary)}`,
          },
          details: [
            { label: "Current salary", value: `$${formatNumber(current)}` },
            { label: "Nominal salary increase", value: `$${formatNumber(nominalGrowth)}` },
            { label: "Percentage growth", value: `${formatNumber(percentGrowth)}%` },
            { label: "Real salary (inflation-adjusted)", value: `$${formatNumber(realSalary)}` },
            { label: "Real annual growth rate", value: `${formatNumber(realGrowthRate)}%` },
            { label: "Total earnings over period", value: `$${formatNumber(totalEarnings)}` },
          ],
          note: "The real salary shows purchasing power in today's dollars. If your raise rate equals inflation, your real income stays flat. Aim for raises above inflation to grow real wealth.",
        };
      },
    },
    {
      id: "promotion",
      name: "Salary with Promotions",
      description:
        "Project salary with regular raises plus periodic promotions",
      fields: [
        {
          name: "currentSalary",
          label: "Current Annual Salary",
          type: "number",
          placeholder: "e.g. 65000",
          prefix: "$",
        },
        {
          name: "annualRaise",
          label: "Annual Merit Raise",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "%",
        },
        {
          name: "promotionBump",
          label: "Promotion Raise",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "%",
        },
        {
          name: "promotionFrequency",
          label: "Promotion Every (Years)",
          type: "select",
          options: [
            { label: "2 years", value: "2" },
            { label: "3 years", value: "3" },
            { label: "4 years", value: "4" },
            { label: "5 years", value: "5" },
          ],
          defaultValue: "3",
        },
        {
          name: "years",
          label: "Years to Project",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "years",
        },
      ],
      calculate: (inputs) => {
        const current = parseFloat(inputs.currentSalary as string);
        const raise = parseFloat(inputs.annualRaise as string);
        const promoBump = parseFloat(inputs.promotionBump as string);
        const promoFreq = parseInt(inputs.promotionFrequency as string, 10);
        const years = parseFloat(inputs.years as string);

        if (!current || current <= 0 || !years || years <= 0) return null;

        const raiseRate = (raise || 0) / 100;
        const promoRate = (promoBump || 0) / 100;

        let salary = current;
        let totalEarnings = 0;
        let promotions = 0;

        for (let y = 1; y <= years; y++) {
          salary *= 1 + raiseRate;
          if (y % promoFreq === 0) {
            salary *= 1 + promoRate;
            promotions++;
          }
          totalEarnings += salary;
        }

        const totalGrowth = ((salary - current) / current) * 100;

        return {
          primary: {
            label: `Salary in ${formatNumber(years)} Years`,
            value: `$${formatNumber(salary)}`,
          },
          details: [
            { label: "Starting salary", value: `$${formatNumber(current)}` },
            { label: "Total growth", value: `${formatNumber(totalGrowth)}%` },
            { label: "Number of promotions", value: formatNumber(promotions) },
            { label: "Total career earnings", value: `$${formatNumber(totalEarnings)}` },
            { label: "Average annual salary", value: `$${formatNumber(totalEarnings / years)}` },
          ],
          note: "This projection assumes consistent raise rates and regular promotions. Actual career progression varies based on performance, industry, and company.",
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "paycheck-calculator", "inflation-calculator"],
  faq: [
    {
      question: "What is a typical annual raise?",
      answer:
        "The average annual merit raise in the U.S. is typically 3-5%. Promotions may include 10-20% salary increases. High-demand fields (tech, healthcare) may see larger raises. Cost-of-living adjustments (COLA) aim to match inflation.",
    },
    {
      question: "How does inflation affect salary growth?",
      answer:
        "If your salary grows at 3% and inflation is 3%, your real purchasing power stays flat. To actually get richer, your salary needs to outpace inflation. A 5% raise with 3% inflation gives ~2% real growth.",
    },
  ],
  formula:
    "Future Salary = Current Salary x (1 + Annual Raise Rate)^Years. Real Salary = Future Salary / (1 + Inflation Rate)^Years",
};

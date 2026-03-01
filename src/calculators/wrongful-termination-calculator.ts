import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wrongfulTerminationCalculator: CalculatorDefinition = {
  slug: "wrongful-termination-calculator",
  title: "Wrongful Termination Calculator",
  description: "Estimate the potential value of a wrongful termination claim based on lost wages, tenure, and circumstances.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wrongful termination value", "wrongful termination settlement", "wrongful firing calculator"],
  variants: [{
    id: "standard",
    name: "Wrongful Termination",
    description: "Estimate the potential value of a wrongful termination claim based on lost wages, tenure, and circumstances",
    fields: [
      { name: "annualSalary", label: "Annual Salary at Termination", type: "number", prefix: "$", min: 15000, max: 1000000, step: 1000, defaultValue: 75000 },
      { name: "yearsEmployed", label: "Years Employed", type: "number", suffix: "years", min: 0.5, max: 40, step: 0.5, defaultValue: 5 },
      { name: "circumstance", label: "Termination Circumstance", type: "select", options: [{value:"discrimination",label:"Discrimination"},{value:"retaliation",label:"Retaliation"},{value:"breach",label:"Contract Breach"},{value:"whistleblower",label:"Whistleblower Retaliation"}], defaultValue: "discrimination" },
      { name: "monthsUnemployed", label: "Months Unemployed After", type: "number", suffix: "months", min: 1, max: 36, defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const salary = inputs.annualSalary as number;
      const years = inputs.yearsEmployed as number;
      const circumstance = inputs.circumstance as string;
      const months = inputs.monthsUnemployed as number;
      if (!salary || salary <= 0) return null;
      const lostWages = salary * (months / 12);
      const benefitsLost = lostWages * 0.3;
      const circumstanceMod: Record<string, number> = { discrimination: 2.0, retaliation: 1.8, breach: 1.2, whistleblower: 2.5 };
      const emotionalDamages = salary * 0.5 * (circumstanceMod[circumstance] || 1.5);
      const tenureMod = Math.min(years * 0.1, 1.5);
      const lowEstimate = (lostWages + benefitsLost) * (1 + tenureMod);
      const highEstimate = (lostWages + benefitsLost + emotionalDamages) * (1 + tenureMod);
      return {
        primary: { label: "Estimated Settlement Range", value: "$" + formatNumber(Math.round(lowEstimate)) + " - $" + formatNumber(Math.round(highEstimate)) },
        details: [
          { label: "Lost Wages", value: "$" + formatNumber(Math.round(lostWages)) },
          { label: "Lost Benefits Value", value: "$" + formatNumber(Math.round(benefitsLost)) },
          { label: "Potential Emotional Damages", value: "$" + formatNumber(Math.round(emotionalDamages)) },
        ],
      };
    },
  }],
  relatedSlugs: ["disability-benefits-calculator", "workers-comp-calculator"],
  faq: [
    { question: "What qualifies as wrongful termination?", answer: "Wrongful termination occurs when an employer fires an employee in violation of federal or state law, such as discrimination based on protected characteristics, retaliation for reporting violations, or breach of an employment contract." },
    { question: "How long do wrongful termination cases take?", answer: "Wrongful termination cases typically take 6 months to 2 years to resolve. Cases that go to trial can take longer, while settlements through mediation may be reached more quickly." },
  ],
  formula: "Settlement Range = (Lost Wages + Benefits + Damages) x (1 + Tenure Modifier)",
};

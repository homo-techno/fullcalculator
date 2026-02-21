import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const teacherSalaryCalculator: CalculatorDefinition = {
  slug: "teacher-salary-calculator",
  title: "Teacher Salary Calculator",
  description:
    "Free teacher salary calculator. Estimate teacher pay by experience level and education, calculate take-home pay, and compare to national averages.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "teacher salary calculator",
    "teacher pay calculator",
    "teacher income",
    "teacher salary by state",
    "how much do teachers make",
  ],
  variants: [
    {
      id: "estimate",
      name: "Teacher Salary Estimate",
      description: "Estimate salary based on experience, education level, and location type",
      fields: [
        {
          name: "experience",
          label: "Years of Experience",
          type: "select",
          options: [
            { label: "0-2 years (Entry)", value: "entry" },
            { label: "3-5 years", value: "early" },
            { label: "6-10 years", value: "mid" },
            { label: "11-20 years", value: "experienced" },
            { label: "20+ years", value: "veteran" },
          ],
        },
        {
          name: "education",
          label: "Education Level",
          type: "select",
          options: [
            { label: "Bachelor's Degree", value: "bachelors" },
            { label: "Bachelor's + 30 credits", value: "bachelors30" },
            { label: "Master's Degree", value: "masters" },
            { label: "Master's + 30 credits", value: "masters30" },
            { label: "Doctorate", value: "doctorate" },
          ],
        },
        {
          name: "locationType",
          label: "Location Type",
          type: "select",
          options: [
            { label: "Rural area", value: "rural" },
            { label: "Suburban area", value: "suburban" },
            { label: "Urban area", value: "urban" },
            { label: "High cost-of-living area", value: "high_col" },
          ],
        },
      ],
      calculate: (inputs) => {
        const exp = inputs.experience as string;
        const edu = inputs.education as string;
        const loc = inputs.locationType as string;
        if (!exp || !edu || !loc) return null;

        // Base salary by experience (national average approximations)
        const baseSalary: Record<string, number> = {
          entry: 42000,
          early: 47000,
          mid: 54000,
          experienced: 62000,
          veteran: 70000,
        };

        // Education multiplier
        const eduMultiplier: Record<string, number> = {
          bachelors: 1.0,
          bachelors30: 1.06,
          masters: 1.12,
          masters30: 1.18,
          doctorate: 1.25,
        };

        // Location multiplier
        const locMultiplier: Record<string, number> = {
          rural: 0.88,
          suburban: 1.0,
          urban: 1.08,
          high_col: 1.25,
        };

        const base = baseSalary[exp] || 42000;
        const salary = base * (eduMultiplier[edu] || 1.0) * (locMultiplier[loc] || 1.0);
        const monthlyGross = salary / 12;
        const biweeklyGross = salary / 26;

        // Approximate take-home (25% combined tax/deductions for typical teacher)
        const effectiveTaxRate = 0.25;
        const monthlyNet = monthlyGross * (1 - effectiveTaxRate);
        const annualNet = salary * (1 - effectiveTaxRate);

        const nationalAvg = 65000;
        const vsNational = salary - nationalAvg;

        return {
          primary: { label: "Estimated Annual Salary", value: `$${formatNumber(salary, 0)}` },
          details: [
            { label: "Monthly gross pay", value: `$${formatNumber(monthlyGross, 2)}` },
            { label: "Biweekly gross pay", value: `$${formatNumber(biweeklyGross, 2)}` },
            { label: "Estimated monthly take-home", value: `$${formatNumber(monthlyNet, 2)}` },
            { label: "Estimated annual take-home", value: `$${formatNumber(annualNet, 0)}` },
            { label: "vs. National avg ($65,000)", value: `${vsNational >= 0 ? "+" : ""}$${formatNumber(vsNational, 0)}` },
          ],
          note: "Estimates are based on national averages. Actual salaries vary by state, district, and specific salary schedule. Benefits like pension and health insurance are not included.",
        };
      },
    },
    {
      id: "schedule",
      name: "Salary Schedule Step Calculator",
      description: "Estimate salary progression over your teaching career",
      fields: [
        { name: "startingSalary", label: "Starting Salary ($)", type: "number", placeholder: "e.g. 42000" },
        { name: "annualStep", label: "Annual Step Increase ($)", type: "number", placeholder: "e.g. 1500" },
        { name: "yearsProjected", label: "Years to Project", type: "number", placeholder: "e.g. 10", min: 1, max: 30 },
        { name: "mastersBump", label: "Master's Degree Bump ($)", type: "number", placeholder: "e.g. 5000", defaultValue: 0 },
        { name: "masterYear", label: "Year You Get Master's", type: "number", placeholder: "e.g. 3", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const starting = inputs.startingSalary as number;
        const step = inputs.annualStep as number;
        const years = inputs.yearsProjected as number;
        const mastersBump = (inputs.mastersBump as number) || 0;
        const masterYear = (inputs.masterYear as number) || 0;
        if (!starting || !step || !years) return null;

        let totalEarnings = 0;
        let finalSalary = starting;
        for (let y = 0; y < years; y++) {
          let salary = starting + step * y;
          if (masterYear > 0 && y >= masterYear) salary += mastersBump;
          totalEarnings += salary;
          if (y === years - 1) finalSalary = salary;
        }

        const avgSalary = totalEarnings / years;
        const totalRaise = finalSalary - starting;

        return {
          primary: { label: `Salary After ${years} Years`, value: `$${formatNumber(finalSalary, 0)}` },
          details: [
            { label: "Starting salary", value: `$${formatNumber(starting, 0)}` },
            { label: "Total raise over period", value: `$${formatNumber(totalRaise, 0)}` },
            { label: "Average salary over period", value: `$${formatNumber(avgSalary, 0)}` },
            { label: "Total career earnings", value: `$${formatNumber(totalEarnings, 0)}` },
            { label: "Annual step increase", value: `$${formatNumber(step, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "take-home-pay-calculator", "hourly-to-salary-calculator"],
  faq: [
    {
      question: "What is the average teacher salary in the US?",
      answer:
        "The national average teacher salary is approximately $65,000 per year, but ranges from about $45,000 in lower-paying states to over $90,000 in higher-paying states like New York and California.",
    },
    {
      question: "How do teacher salary schedules work?",
      answer:
        "Most school districts use a step-and-lane salary schedule. Steps represent years of experience (annual increases of $1,000-$2,500), and lanes represent education level (earning a master's degree moves you to a higher-paying lane).",
    },
    {
      question: "Do teachers get a pay increase for a master's degree?",
      answer:
        "Yes, most districts give a salary bump of $2,000-$10,000 per year for teachers with a master's degree. Over a 25-year career, this can add $50,000-$250,000 in additional earnings.",
    },
  ],
  formula: "Salary = Base (by experience) x Education Multiplier x Location Multiplier",
};

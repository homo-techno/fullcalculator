import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studyAbroadCostCalculator: CalculatorDefinition = {
  slug: "study-abroad-cost-calculator",
  title: "Study Abroad Cost Calculator",
  description:
    "Free study abroad cost calculator. Estimate the total cost of studying abroad including tuition, housing, flights, and living expenses.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "study abroad cost calculator",
    "study abroad budget",
    "exchange program cost",
    "semester abroad expenses",
    "study abroad financial planning",
  ],
  variants: [
    {
      id: "semester",
      name: "Semester Abroad",
      description: "Calculate the total cost for a semester studying abroad",
      fields: [
        { name: "tuition", label: "Program Tuition/Fees ($)", type: "number", placeholder: "e.g. 12000", min: 0 },
        { name: "housing", label: "Housing for Semester ($)", type: "number", placeholder: "e.g. 4000", min: 0 },
        { name: "flights", label: "Round-Trip Flights ($)", type: "number", placeholder: "e.g. 1200", min: 0 },
        { name: "insurance", label: "Health Insurance ($)", type: "number", placeholder: "e.g. 500", min: 0 },
        { name: "monthlyLiving", label: "Monthly Living Expenses ($)", type: "number", placeholder: "e.g. 800", min: 0 },
        { name: "months", label: "Duration (months)", type: "number", placeholder: "e.g. 4", min: 1, max: 12, defaultValue: 4 },
        { name: "visaPassport", label: "Visa & Passport Costs ($)", type: "number", placeholder: "e.g. 300", min: 0 },
      ],
      calculate: (inputs) => {
        const tuition = (inputs.tuition as number) || 0;
        const housing = (inputs.housing as number) || 0;
        const flights = (inputs.flights as number) || 0;
        const insurance = (inputs.insurance as number) || 0;
        const living = (inputs.monthlyLiving as number) || 0;
        const months = (inputs.months as number) || 4;
        const visa = (inputs.visaPassport as number) || 0;

        const totalLiving = living * months;
        const total = tuition + housing + flights + insurance + totalLiving + visa;
        const perMonth = total / months;

        return {
          primary: { label: "Total Study Abroad Cost", value: `$${formatNumber(total, 2)}` },
          details: [
            { label: "Monthly cost", value: `$${formatNumber(perMonth, 2)}` },
            { label: "Academic costs (tuition)", value: `$${formatNumber(tuition, 2)}` },
            { label: "Living costs total", value: `$${formatNumber(totalLiving + housing, 2)}` },
            { label: "Travel & admin costs", value: `$${formatNumber(flights + insurance + visa, 2)}` },
          ],
        };
      },
    },
    {
      id: "comparison",
      name: "Home vs Abroad Comparison",
      description: "Compare costs of studying at your home school versus abroad",
      fields: [
        { name: "homeTuition", label: "Home School Semester Tuition ($)", type: "number", placeholder: "e.g. 10000", min: 0 },
        { name: "homeHousing", label: "Home Semester Housing ($)", type: "number", placeholder: "e.g. 5000", min: 0 },
        { name: "homeLiving", label: "Home Monthly Living ($)", type: "number", placeholder: "e.g. 1000", min: 0 },
        { name: "abroadTotal", label: "Total Abroad Cost ($)", type: "number", placeholder: "e.g. 18000", min: 0 },
        { name: "months", label: "Semester Length (months)", type: "number", placeholder: "e.g. 4", min: 1, max: 12, defaultValue: 4 },
      ],
      calculate: (inputs) => {
        const homeTuition = (inputs.homeTuition as number) || 0;
        const homeHousing = (inputs.homeHousing as number) || 0;
        const homeLiving = (inputs.homeLiving as number) || 0;
        const abroadTotal = (inputs.abroadTotal as number) || 0;
        const months = (inputs.months as number) || 4;

        const homeTotal = homeTuition + homeHousing + homeLiving * months;
        const difference = abroadTotal - homeTotal;

        let verdict: string;
        if (difference <= 0) verdict = "Study abroad is cheaper!";
        else if (difference < 2000) verdict = "Similar cost - abroad is worth it";
        else if (difference < 5000) verdict = "Moderately more expensive";
        else verdict = "Significantly more expensive - seek scholarships";

        return {
          primary: { label: "Additional Cost of Abroad", value: `$${formatNumber(difference, 2)}` },
          details: [
            { label: "Verdict", value: verdict },
            { label: "Home semester total", value: `$${formatNumber(homeTotal, 2)}` },
            { label: "Abroad total", value: `$${formatNumber(abroadTotal, 2)}` },
            { label: "Difference per month", value: `$${formatNumber(difference / months, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["student-budget-calculator", "tuition-cost-calculator"],
  faq: [
    {
      question: "How much does studying abroad cost?",
      answer:
        "A semester abroad typically costs $10,000-$30,000 including tuition, housing, food, flights, and living expenses. Costs vary widely by country - Western Europe and Australia tend to be more expensive, while Latin America and Southeast Asia are more affordable.",
    },
    {
      question: "Can financial aid be used for study abroad?",
      answer:
        "Yes, most federal financial aid (grants, loans) can be applied to approved study abroad programs. Many schools also offer study abroad-specific scholarships. Contact your financial aid office for details.",
    },
  ],
  formula: "Total Cost = Tuition + Housing + Flights + Insurance + (Monthly Living x Months) + Visa/Passport",
};

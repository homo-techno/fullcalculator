import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hoaCalculator: CalculatorDefinition = {
  slug: "hoa-calculator",
  title: "HOA Fee Calculator",
  description:
    "Free HOA calculator. Calculate the true cost of HOA fees over time and see how HOA dues impact your total housing payment and home affordability.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "HOA calculator",
    "HOA fee calculator",
    "homeowners association fee",
    "HOA cost calculator",
    "condo fee calculator",
  ],
  variants: [
    {
      id: "total-cost",
      name: "HOA Lifetime Cost",
      description: "Calculate the total cost of HOA fees over your ownership period",
      fields: [
        { name: "monthlyHOA", label: "Monthly HOA Fee", type: "number", placeholder: "e.g. 350", prefix: "$", min: 0 },
        { name: "annualIncrease", label: "Expected Annual Increase", type: "number", placeholder: "e.g. 3", suffix: "%", min: 0, max: 20, step: 0.1, defaultValue: 3 },
        {
          name: "years",
          label: "Ownership Period",
          type: "select",
          options: [
            { label: "5 years", value: "5" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
            { label: "30 years", value: "30" },
          ],
          defaultValue: "10",
        },
      ],
      calculate: (inputs) => {
        const monthly = inputs.monthlyHOA as number;
        const increase = (inputs.annualIncrease as number) || 0;
        const years = parseInt(inputs.years as string) || 10;
        if (!monthly) return null;

        let totalCost = 0;
        let yearlyFee = monthly * 12;
        for (let i = 0; i < years; i++) {
          totalCost += yearlyFee;
          yearlyFee *= 1 + increase / 100;
        }

        const finalMonthly = monthly * Math.pow(1 + increase / 100, years);
        const avgMonthly = totalCost / (years * 12);

        return {
          primary: { label: `Total HOA Cost (${years} years)`, value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Current monthly fee", value: `$${formatNumber(monthly)}` },
            { label: `Monthly fee in year ${years}`, value: `$${formatNumber(finalMonthly)}` },
            { label: "Average monthly fee", value: `$${formatNumber(avgMonthly)}` },
            { label: "First year cost", value: `$${formatNumber(monthly * 12)}` },
            { label: "Annual increase rate", value: `${formatNumber(increase)}%` },
          ],
        };
      },
    },
    {
      id: "housing-impact",
      name: "Impact on Housing Payment",
      description: "See how HOA fees affect your total monthly housing cost",
      fields: [
        { name: "monthlyMortgage", label: "Monthly Mortgage (P+I)", type: "number", placeholder: "e.g. 1800", prefix: "$", min: 0 },
        { name: "monthlyHOA", label: "Monthly HOA Fee", type: "number", placeholder: "e.g. 350", prefix: "$", min: 0 },
        { name: "propertyTax", label: "Monthly Property Tax", type: "number", placeholder: "e.g. 300", prefix: "$", min: 0 },
        { name: "insurance", label: "Monthly Insurance", type: "number", placeholder: "e.g. 120", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const mortgage = (inputs.monthlyMortgage as number) || 0;
        const hoa = inputs.monthlyHOA as number;
        const tax = (inputs.propertyTax as number) || 0;
        const insurance = (inputs.insurance as number) || 0;
        if (!hoa) return null;

        const totalWithHOA = mortgage + hoa + tax + insurance;
        const totalWithoutHOA = mortgage + tax + insurance;
        const hoaPercent = totalWithHOA > 0 ? (hoa / totalWithHOA) * 100 : 0;
        const annualHOA = hoa * 12;

        return {
          primary: { label: "Total Monthly Housing Cost", value: `$${formatNumber(totalWithHOA)}` },
          details: [
            { label: "Mortgage (P+I)", value: `$${formatNumber(mortgage)}` },
            { label: "HOA fee", value: `$${formatNumber(hoa)}` },
            { label: "Property tax", value: `$${formatNumber(tax)}` },
            { label: "Insurance", value: `$${formatNumber(insurance)}` },
            { label: "HOA as % of total payment", value: `${formatNumber(hoaPercent, 1)}%` },
            { label: "Annual HOA cost", value: `$${formatNumber(annualHOA)}` },
            { label: "Without HOA", value: `$${formatNumber(totalWithoutHOA)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "home-affordability-calculator", "closing-cost-calculator"],
  faq: [
    {
      question: "What is the average HOA fee?",
      answer:
        "Average HOA fees range from $200-$400/month for most communities. Condos and luxury communities can charge $500-$1,000+ per month. Fees depend on amenities (pool, gym, doorman), location, building age, and what's included (water, trash, exterior maintenance).",
    },
    {
      question: "What do HOA fees cover?",
      answer:
        "HOA fees typically cover common area maintenance, landscaping, exterior building maintenance, shared amenities (pool, gym, clubhouse), trash removal, sometimes water/sewer, snow removal, and the HOA's reserve fund for major repairs.",
    },
    {
      question: "Do HOA fees increase over time?",
      answer:
        "Yes, HOA fees typically increase 3-5% per year. They can increase more after special assessments for major repairs (roof, foundation, plumbing). Some HOAs have poorly funded reserves, leading to sudden large increases or special assessments.",
    },
  ],
  formula:
    "Total HOA Cost = Σ (Monthly Fee × 12 × (1 + Annual Increase)^year) | Total Housing = Mortgage + HOA + Tax + Insurance",
};

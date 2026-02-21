import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeMaintenanceCalculator: CalculatorDefinition = {
  slug: "home-maintenance-calculator",
  title: "Home Maintenance Calculator",
  description: "Free home maintenance budget calculator. Estimate your annual and monthly home maintenance costs based on home value, age, and condition.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["home maintenance calculator", "home maintenance budget", "home repair cost", "annual maintenance cost", "home upkeep calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Maintenance Budget",
      description: "Estimate annual home maintenance costs",
      fields: [
        { name: "homeValue", label: "Home Value ($)", type: "number", placeholder: "e.g. 350000", prefix: "$" },
        { name: "age", label: "Home Age", type: "select", options: [
          { label: "New (under 5 years)", value: "new" },
          { label: "5-10 years", value: "5-10" },
          { label: "10-20 years", value: "10-20" },
          { label: "20+ years", value: "20+" },
        ], defaultValue: "5-10" },
        { name: "sqft", label: "Square Footage (optional)", type: "number", placeholder: "e.g. 2000" },
      ],
      calculate: (inputs) => {
        const homeValue = inputs.homeValue as number;
        const age = inputs.age as string;
        const sqft = inputs.sqft as number;
        if (!homeValue || !age) return null;

        let percentMin: number, percentMax: number, ageLabel: string;
        switch (age) {
          case "new":
            percentMin = 0.5;
            percentMax = 1.0;
            ageLabel = "Under 5 years";
            break;
          case "5-10":
            percentMin = 1.0;
            percentMax = 1.5;
            ageLabel = "5-10 years";
            break;
          case "10-20":
            percentMin = 1.5;
            percentMax = 2.0;
            ageLabel = "10-20 years";
            break;
          case "20+":
            percentMin = 2.0;
            percentMax = 3.0;
            ageLabel = "20+ years";
            break;
          default:
            percentMin = 1.0;
            percentMax = 2.0;
            ageLabel = "Average";
        }

        const annualMin = homeValue * (percentMin / 100);
        const annualMax = homeValue * (percentMax / 100);
        const annualAvg = (annualMin + annualMax) / 2;
        const monthlyMin = annualMin / 12;
        const monthlyMax = annualMax / 12;
        const monthlyAvg = annualAvg / 12;

        const details: { label: string; value: string }[] = [
          { label: "Home value", value: `$${formatNumber(homeValue)}` },
          { label: "Home age", value: ageLabel },
          { label: "Recommended %", value: `${percentMin}-${percentMax}% of home value` },
          { label: "Annual budget (low)", value: `$${formatNumber(annualMin)}` },
          { label: "Annual budget (high)", value: `$${formatNumber(annualMax)}` },
          { label: "Annual budget (avg)", value: `$${formatNumber(annualAvg)}` },
          { label: "Monthly budget (low)", value: `$${formatNumber(monthlyMin)}` },
          { label: "Monthly budget (high)", value: `$${formatNumber(monthlyMax)}` },
        ];

        // Square footage method if provided
        if (sqft) {
          const perSqFt = annualAvg / sqft;
          const sqftBudget = sqft * 1; // $1 per sq ft rule of thumb
          details.push({ label: "Cost per sq ft (avg)", value: `$${formatNumber(perSqFt, 2)}/sq ft` });
          details.push({ label: "$1/sq ft rule estimate", value: `$${formatNumber(sqftBudget)}/year` });
        }

        return {
          primary: { label: "Monthly Maintenance Budget", value: `$${formatNumber(monthlyMin)} - $${formatNumber(monthlyMax)}` },
          details,
          note: "The 1-2% rule suggests budgeting 1-2% of your home value annually for maintenance. Older homes need more (2-3%). New homes need less (0.5-1%). This covers routine maintenance, not major renovations or disasters.",
        };
      },
    },
  ],
  relatedSlugs: ["home-equity-calculator", "mortgage-calculator", "budget-calculator"],
  faq: [
    { question: "How much should I budget for home maintenance?", answer: "The general rule is 1-2% of your home value per year. A $350,000 home should budget $3,500-$7,000 annually ($290-$585/month). Older homes, larger homes, and homes in harsh climates should budget toward the higher end." },
    { question: "What does the 1% rule cover?", answer: "The 1% rule covers routine maintenance like HVAC servicing, gutter cleaning, plumbing repairs, painting, appliance repairs, lawn care, pest control, and minor repairs. It does not cover major renovations, additions, or catastrophic damage." },
    { question: "Why do older homes cost more to maintain?", answer: "Older homes have aging systems (roof, HVAC, plumbing, electrical) that are closer to replacement. A 20-year-old roof may need replacement ($8,000-$15,000), older HVAC systems are less efficient, and outdated plumbing may develop leaks. Budget 2-3% for homes over 20 years old." },
  ],
  formula: "Annual Budget = Home Value x (1% to 2%) | Monthly Budget = Annual / 12",
};

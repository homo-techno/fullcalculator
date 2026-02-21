import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vacancyRateCalculator: CalculatorDefinition = {
  slug: "vacancy-rate-calculator",
  title: "Vacancy Rate Calculator",
  description:
    "Free vacancy rate calculator. Calculate the vacancy rate for rental properties, estimate income lost to vacancies, and analyze portfolio occupancy.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "vacancy rate calculator",
    "rental vacancy rate",
    "occupancy rate calculator",
    "vacancy loss calculator",
    "property vacancy rate",
  ],
  variants: [
    {
      id: "single-property",
      name: "Single Property Vacancy",
      description: "Calculate vacancy rate and income loss for a single property",
      fields: [
        { name: "monthlyRent", label: "Monthly Rent", type: "number", placeholder: "e.g. 2000", prefix: "$", min: 0 },
        { name: "vacantDays", label: "Vacant Days Per Year", type: "number", placeholder: "e.g. 21", suffix: "days", min: 0, max: 365, step: 1 },
        { name: "turnoverCost", label: "Turnover Cost (cleaning, repairs, marketing)", type: "number", placeholder: "e.g. 1500", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const rent = inputs.monthlyRent as number;
        const vacantDays = inputs.vacantDays as number;
        const turnover = (inputs.turnoverCost as number) || 0;
        if (!rent || vacantDays === undefined) return null;

        const dailyRent = (rent * 12) / 365;
        const vacancyRate = (vacantDays / 365) * 100;
        const occupancyRate = 100 - vacancyRate;
        const rentLoss = dailyRent * vacantDays;
        const totalVacancyCost = rentLoss + turnover;
        const effectiveGrossIncome = rent * 12 - rentLoss;

        return {
          primary: { label: "Vacancy Rate", value: `${formatNumber(vacancyRate, 1)}%` },
          details: [
            { label: "Occupancy rate", value: `${formatNumber(occupancyRate, 1)}%` },
            { label: "Vacant days per year", value: `${vacantDays} days` },
            { label: "Rent lost to vacancy", value: `$${formatNumber(rentLoss)}` },
            { label: "Turnover costs", value: `$${formatNumber(turnover)}` },
            { label: "Total vacancy cost", value: `$${formatNumber(totalVacancyCost)}` },
            { label: "Effective gross income", value: `$${formatNumber(effectiveGrossIncome)}` },
          ],
        };
      },
    },
    {
      id: "portfolio",
      name: "Portfolio Vacancy Rate",
      description: "Calculate vacancy rate for multiple units",
      fields: [
        { name: "totalUnits", label: "Total Units", type: "number", placeholder: "e.g. 10", min: 1, max: 10000, step: 1 },
        { name: "vacantUnits", label: "Currently Vacant Units", type: "number", placeholder: "e.g. 1", min: 0, max: 10000, step: 1 },
        { name: "avgRent", label: "Average Monthly Rent Per Unit", type: "number", placeholder: "e.g. 1200", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const total = inputs.totalUnits as number;
        const vacant = inputs.vacantUnits as number;
        const avgRent = inputs.avgRent as number;
        if (!total || vacant === undefined) return null;

        const occupied = total - vacant;
        const vacancyRate = (vacant / total) * 100;
        const occupancyRate = (occupied / total) * 100;
        const potentialGross = avgRent ? avgRent * total * 12 : 0;
        const actualGross = avgRent ? avgRent * occupied * 12 : 0;
        const vacancyLoss = potentialGross - actualGross;

        return {
          primary: { label: "Vacancy Rate", value: `${formatNumber(vacancyRate, 1)}%` },
          details: [
            { label: "Occupancy rate", value: `${formatNumber(occupancyRate, 1)}%` },
            { label: "Occupied units", value: `${occupied} of ${total}` },
            { label: "Vacant units", value: `${vacant}` },
            ...(avgRent ? [
              { label: "Potential gross income (annual)", value: `$${formatNumber(potentialGross)}` },
              { label: "Actual gross income (annual)", value: `$${formatNumber(actualGross)}` },
              { label: "Annual vacancy loss", value: `$${formatNumber(vacancyLoss)}` },
            ] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rental-income-calculator", "noi-calculator", "cap-rate-calculator"],
  faq: [
    {
      question: "What is vacancy rate?",
      answer:
        "Vacancy rate is the percentage of time (or units) that are unoccupied. For a single property: Vacancy Rate = (Vacant Days / 365) × 100. For a portfolio: Vacancy Rate = (Vacant Units / Total Units) × 100. Lower is better.",
    },
    {
      question: "What is a normal vacancy rate?",
      answer:
        "National average residential vacancy rates are typically 5-8%. Strong rental markets may have 2-4% vacancy, while weaker markets can see 10-15%+. For investment analysis, most investors assume 5-10% vacancy to be conservative.",
    },
    {
      question: "How do I reduce vacancy?",
      answer:
        "Reduce vacancy by: pricing rent competitively, maintaining the property well, responding quickly to maintenance requests, screening tenants thoroughly, offering lease renewal incentives, marketing vacancies early, and building good tenant relationships.",
    },
  ],
  formula:
    "Vacancy Rate = (Vacant Days / 365) × 100 | Portfolio Vacancy = (Vacant Units / Total Units) × 100 | Vacancy Loss = Monthly Rent × 12 × (Vacancy Rate / 100)",
};

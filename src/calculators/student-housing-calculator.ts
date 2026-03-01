import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studentHousingCalculator: CalculatorDefinition = {
  slug: "student-housing-calculator",
  title: "Student Housing Cost Calculator",
  description: "Compare the cost of dorm living versus off-campus apartment rental for college students.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["student housing cost", "dorm vs apartment", "college housing comparison"],
  variants: [{
    id: "standard",
    name: "Student Housing Cost",
    description: "Compare the cost of dorm living versus off-campus apartment rental for college students",
    fields: [
      { name: "dormCost", label: "Annual Dorm Cost (Room + Board)", type: "number", prefix: "$", min: 3000, max: 30000, defaultValue: 12000 },
      { name: "apartmentRent", label: "Monthly Apartment Rent", type: "number", prefix: "$", min: 200, max: 5000, defaultValue: 800 },
      { name: "monthlyFood", label: "Monthly Food Budget (Off-Campus)", type: "number", prefix: "$", min: 100, max: 2000, defaultValue: 350 },
      { name: "monthlyUtilities", label: "Monthly Utilities (Off-Campus)", type: "number", prefix: "$", min: 0, max: 500, defaultValue: 100 },
    ],
    calculate: (inputs) => {
      const dorm = inputs.dormCost as number;
      const rent = inputs.apartmentRent as number;
      const food = inputs.monthlyFood as number;
      const utilities = inputs.monthlyUtilities as number;
      if (!dorm || !rent) return null;
      const academicMonths = 9;
      const apartmentAnnual = (rent + food + utilities) * academicMonths;
      const diff = Math.abs(dorm - apartmentAnnual);
      const cheaper = dorm < apartmentAnnual ? "Dorm" : "Apartment";
      const fourYearSavings = diff * 4;
      return {
        primary: { label: "Cheaper Option", value: cheaper + " (save $" + formatNumber(Math.round(diff)) + "/yr)" },
        details: [
          { label: "Annual Dorm Cost", value: "$" + formatNumber(Math.round(dorm)) },
          { label: "Annual Apartment Cost", value: "$" + formatNumber(Math.round(apartmentAnnual)) },
          { label: "Monthly Apartment Total", value: "$" + formatNumber(Math.round(rent + food + utilities)) },
          { label: "4-Year Savings", value: "$" + formatNumber(Math.round(fourYearSavings)) },
        ],
      };
    },
  }],
  relatedSlugs: ["college-comparison-calculator", "gap-year-budget-calculator"],
  faq: [
    { question: "Is it cheaper to live in a dorm or apartment?", answer: "It depends on location. Dorms average $10,000-$15,000 per year with meals. Off-campus can be cheaper if you cook and share rent." },
    { question: "What costs should I consider for off-campus housing?", answer: "Include rent, utilities, food, internet, renter insurance, and transportation costs when comparing to dorm living." },
  ],
  formula: "Annual Apartment Cost = (Rent + Food + Utilities) x Academic Months; Compare to Dorm Cost",
};

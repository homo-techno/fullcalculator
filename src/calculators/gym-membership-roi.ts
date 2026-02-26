import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gymMembershipRoiCalculator: CalculatorDefinition = {
  slug: "gym-membership-roi-calculator",
  title: "Gym Membership ROI Calculator",
  description:
    "Free gym membership ROI calculator. Calculate the cost per visit, compare gym vs home workouts, and determine if your gym membership is worth the money.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "gym membership ROI",
    "gym cost per visit",
    "is gym membership worth it",
    "gym vs home workout cost",
    "gym membership calculator",
  ],
  variants: [
    {
      id: "cost-per-visit",
      name: "Cost per Visit",
      description: "Calculate the real cost per gym visit",
      fields: [
        {
          name: "monthlyFee",
          label: "Monthly Membership Fee",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          min: 5,
          max: 300,
          step: 5,
          defaultValue: 50,
        },
        {
          name: "visitsPerWeek",
          label: "Visits per Week",
          type: "number",
          placeholder: "e.g. 3",
          min: 0.5,
          max: 7,
          step: 0.5,
          defaultValue: 3,
        },
        {
          name: "annualFee",
          label: "Annual Maintenance Fee",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          min: 0,
          max: 200,
          step: 10,
          defaultValue: 50,
        },
        {
          name: "commuteCost",
          label: "Round-trip Commute Cost (gas, parking)",
          type: "number",
          placeholder: "e.g. 3",
          prefix: "$",
          min: 0,
          max: 20,
          step: 0.5,
          defaultValue: 3,
        },
      ],
      calculate: (inputs) => {
        const monthly = parseFloat(inputs.monthlyFee as string);
        const visits = parseFloat(inputs.visitsPerWeek as string);
        const annual = parseFloat(inputs.annualFee as string);
        const commute = parseFloat(inputs.commuteCost as string);
        if (!monthly || !visits) return null;

        const monthlyVisits = visits * 4.33;
        const yearlyMembership = monthly * 12 + (annual || 0);
        const yearlyCommute = (commute || 0) * visits * 52;
        const yearlyTotal = yearlyMembership + yearlyCommute;
        const costPerVisit = yearlyTotal / (visits * 52);
        const monthlyTotal = yearlyTotal / 12;

        let valueRating: string;
        if (costPerVisit < 5) valueRating = "Excellent Value";
        else if (costPerVisit < 10) valueRating = "Good Value";
        else if (costPerVisit < 15) valueRating = "Fair Value";
        else if (costPerVisit < 25) valueRating = "Below Average Value";
        else valueRating = "Poor Value - Consider Alternatives";

        return {
          primary: { label: "Cost per Visit", value: `$${formatNumber(costPerVisit)}` },
          details: [
            { label: "Value Rating", value: valueRating },
            { label: "Monthly Total Cost", value: `$${formatNumber(monthlyTotal)}` },
            { label: "Yearly Total Cost", value: `$${formatNumber(yearlyTotal)}` },
            { label: "Visits per Month", value: formatNumber(monthlyVisits, 1) },
            { label: "Visits per Year", value: formatNumber(visits * 52, 0) },
            { label: "Commute Cost/Year", value: `$${formatNumber(yearlyCommute)}` },
          ],
        };
      },
    },
    {
      id: "gym-vs-home",
      name: "Gym vs Home Workout",
      description: "Compare gym membership vs building a home gym",
      fields: [
        {
          name: "monthlyFee",
          label: "Gym Monthly Fee",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          min: 10,
          max: 300,
          step: 5,
          defaultValue: 50,
        },
        {
          name: "homeGymCost",
          label: "Home Gym Equipment Budget",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          min: 100,
          max: 20000,
          step: 100,
          defaultValue: 2000,
        },
        {
          name: "homeMonthly",
          label: "Home Gym Monthly Costs (maintenance, subscriptions)",
          type: "number",
          placeholder: "e.g. 15",
          prefix: "$",
          min: 0,
          max: 100,
          step: 5,
          defaultValue: 15,
        },
        {
          name: "years",
          label: "Comparison Period",
          type: "select",
          options: [
            { label: "1 year", value: "1" },
            { label: "2 years", value: "2" },
            { label: "3 years", value: "3" },
            { label: "5 years", value: "5" },
            { label: "10 years", value: "10" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const gymMonthly = parseFloat(inputs.monthlyFee as string);
        const homeEquip = parseFloat(inputs.homeGymCost as string);
        const homeMonthly = parseFloat(inputs.homeMonthly as string);
        const years = parseFloat(inputs.years as string);
        if (!gymMonthly || !homeEquip || !years) return null;

        const gymTotal = gymMonthly * 12 * years;
        const homeTotal = homeEquip + (homeMonthly || 0) * 12 * years;
        const savings = gymTotal - homeTotal;
        const breakEvenMonths = homeEquip / (gymMonthly - (homeMonthly || 0));

        return {
          primary: { label: `${years}-Year Comparison`, value: savings > 0 ? `Home saves $${formatNumber(savings)}` : `Gym saves $${formatNumber(Math.abs(savings))}` },
          details: [
            { label: `Gym Cost (${years} yrs)`, value: `$${formatNumber(gymTotal)}` },
            { label: `Home Gym Cost (${years} yrs)`, value: `$${formatNumber(homeTotal)}` },
            { label: "Break-even Point", value: `${formatNumber(Math.max(0, breakEvenMonths), 0)} months` },
            { label: "Gym Monthly", value: `$${formatNumber(gymMonthly)}` },
            { label: "Home Gym Monthly", value: `$${formatNumber(homeMonthly || 0)}` },
          ],
          note: savings > 0
            ? `A home gym pays for itself in about ${formatNumber(Math.max(0, breakEvenMonths), 0)} months.`
            : "The gym membership is more cost-effective for this time period. A home gym needs more time to pay for itself.",
        };
      },
    },
  ],
  relatedSlugs: ["coffee-spending-calculator", "subscription-audit-calculator"],
  faq: [
    {
      question: "How much should a gym visit cost?",
      answer:
        "A good benchmark is under $10 per visit. If you visit 3-4 times per week with a $40-$50/month membership, your cost per visit is about $3-$4. If you go less than once a week, the cost per visit becomes quite high.",
    },
    {
      question: "When does a home gym become cheaper than a gym membership?",
      answer:
        "A basic home gym ($1,000-$2,000) typically pays for itself in 2-3 years compared to a $50/month gym membership. Higher-end setups ($3,000-$5,000) may take 4-6 years to break even but offer long-term savings.",
    },
  ],
  formula:
    "Cost per Visit = (Monthly Fee x 12 + Annual Fee + Commute x Visits x 52) / (Visits x 52) | Break-even = Equipment Cost / (Gym Monthly - Home Monthly)",
};

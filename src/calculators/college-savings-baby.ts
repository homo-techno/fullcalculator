import type { CalculatorDefinition } from "./types";

export const collegeSavingsBabyCalculator: CalculatorDefinition = {
  slug: "college-savings-baby-calculator",
  title: "College Savings from Birth",
  description:
    "Free college savings calculator for new parents. Estimate how much to save monthly from birth to fund your child's college education.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "college savings baby",
    "529 plan calculator",
    "save for college",
    "college fund baby",
    "education savings",
  ],
  variants: [
    {
      id: "plan",
      name: "College Savings Plan",
      description: "Calculate monthly savings needed for your child's education",
      fields: [
        {
          name: "childAgeMonths",
          label: "Child's Current Age (months)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          max: 180,
        },
        {
          name: "collegeType",
          label: "Target College Type",
          type: "select",
          options: [
            { label: "Public In-State (4 years)", value: "public_in" },
            { label: "Public Out-of-State (4 years)", value: "public_out" },
            { label: "Private University (4 years)", value: "private" },
            { label: "Community College (2 years)", value: "community" },
          ],
        },
        {
          name: "coveragePercent",
          label: "Percentage to Fund",
          type: "select",
          options: [
            { label: "100% of costs", value: "100" },
            { label: "75% of costs", value: "75" },
            { label: "50% of costs", value: "50" },
            { label: "25% of costs", value: "25" },
          ],
        },
        {
          name: "currentSavings",
          label: "Current Savings ($)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          max: 500000,
        },
        {
          name: "returnRate",
          label: "Expected Annual Return",
          type: "select",
          options: [
            { label: "Conservative (5%)", value: "5" },
            { label: "Moderate (7%)", value: "7" },
            { label: "Aggressive (9%)", value: "9" },
          ],
        },
      ],
      calculate: (inputs) => {
        const ageMonths = inputs.childAgeMonths as number;
        const collegeType = inputs.collegeType as string;
        const coverageStr = inputs.coveragePercent as string;
        const currentSavings = (inputs.currentSavings as number) || 0;
        const returnRateStr = inputs.returnRate as string;
        if (ageMonths === undefined || !collegeType || !coverageStr || !returnRateStr) return null;

        const coverage = parseInt(coverageStr) / 100;
        const annualReturn = parseInt(returnRateStr) / 100;
        const monthlyReturn = annualReturn / 12;

        // Current average total costs (tuition + room & board, 2025 dollars)
        const currentCosts: Record<string, number> = {
          public_in: 100000,
          public_out: 180000,
          private: 240000,
          community: 36000,
        };

        const baseCost = currentCosts[collegeType] ?? 100000;

        // College cost inflation rate (~5% historically)
        const inflationRate = 0.05;
        const yearsUntilCollege = Math.max(0, 18 - ageMonths / 12);
        const futureCost = baseCost * Math.pow(1 + inflationRate, yearsUntilCollege);
        const targetAmount = futureCost * coverage;

        // Future value of current savings
        const fvCurrentSavings =
          currentSavings * Math.pow(1 + annualReturn, yearsUntilCollege);

        // Amount needed from monthly contributions
        const amountNeeded = Math.max(0, targetAmount - fvCurrentSavings);

        // Monthly savings needed (future value of annuity formula)
        const months = Math.max(1, Math.round(yearsUntilCollege * 12));
        let monthlySavings: number;
        if (monthlyReturn === 0) {
          monthlySavings = amountNeeded / months;
        } else {
          monthlySavings =
            amountNeeded /
            ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
        }

        const totalContributions = monthlySavings * months + currentSavings;
        const totalGrowth = targetAmount - totalContributions;

        const collegeLabels: Record<string, string> = {
          public_in: "Public In-State",
          public_out: "Public Out-of-State",
          private: "Private University",
          community: "Community College",
        };

        return {
          primary: {
            label: "Monthly Savings Needed",
            value: `$${Math.round(monthlySavings).toLocaleString()}/month`,
          },
          details: [
            {
              label: "Target amount (future $)",
              value: `$${Math.round(targetAmount).toLocaleString()}`,
            },
            {
              label: "Current cost (today's $)",
              value: `$${Math.round(baseCost * coverage).toLocaleString()}`,
            },
            {
              label: "College type",
              value: `${collegeLabels[collegeType]} (${(coverage * 100).toFixed(0)}% funded)`,
            },
            {
              label: "Years until college",
              value: `${yearsUntilCollege.toFixed(1)} years`,
            },
            {
              label: "Current savings growth",
              value: `$${currentSavings.toLocaleString()} grows to $${Math.round(fvCurrentSavings).toLocaleString()}`,
            },
            {
              label: "Total contributions",
              value: `$${Math.round(totalContributions).toLocaleString()}`,
            },
            {
              label: "Investment growth",
              value: `$${Math.round(Math.max(0, totalGrowth)).toLocaleString()}`,
            },
            {
              label: "529 Plan benefit",
              value: "Tax-free growth and withdrawals for qualified education expenses",
            },
          ],
          note: "College costs assume ~5% annual inflation. Investment returns are not guaranteed. A 529 plan offers tax-free growth for education expenses. Start early - time is your biggest advantage.",
        };
      },
    },
  ],
  relatedSlugs: ["daycare-cost-calculator", "compound-interest-calculator"],
  faq: [
    {
      question: "How much should I save for my baby's college?",
      answer:
        "Starting from birth, saving about $250-500/month can cover a significant portion of public college costs, assuming 7% returns. The earlier you start, the more compound growth helps. Even small amounts add up significantly over 18 years.",
    },
    {
      question: "What is a 529 plan?",
      answer:
        "A 529 plan is a tax-advantaged savings account for education expenses. Contributions grow tax-free, and withdrawals for qualified education expenses are also tax-free. Many states offer additional state tax deductions for contributions.",
    },
  ],
  formula:
    "Future cost = current cost x (1.05)^years. Monthly savings = (target - FV of current savings) / ((((1+r)^n - 1) / r)) where r = monthly return, n = months until college.",
};

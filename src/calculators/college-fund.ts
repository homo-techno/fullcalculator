import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const collegeFundCalculator: CalculatorDefinition = {
  slug: "college-fund-calculator",
  title: "College Fund Calculator (529 Plan)",
  description:
    "Free college fund calculator. Estimate how much to save monthly for your child's college education using a 529 plan with projected growth.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "college fund calculator",
    "529 plan calculator",
    "college savings calculator",
    "education savings",
    "how much to save for college",
  ],
  variants: [
    {
      id: "college-fund",
      name: "College Savings Plan",
      description: "How much should you save monthly for college?",
      fields: [
        {
          name: "childAge",
          label: "Child's Current Age",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          max: 17,
          defaultValue: 0,
        },
        {
          name: "collegeType",
          label: "College Type",
          type: "select",
          options: [
            { label: "In-State Public University", value: "instate" },
            { label: "Out-of-State Public University", value: "outstate" },
            { label: "Private University", value: "private" },
            { label: "Community College (2 years)", value: "community" },
          ],
          defaultValue: "instate",
        },
        {
          name: "coveragePercent",
          label: "Percentage of Cost to Cover",
          type: "select",
          options: [
            { label: "100% (full cost)", value: "100" },
            { label: "75% (child covers rest)", value: "75" },
            { label: "50% (split with child)", value: "50" },
            { label: "25% (partial help)", value: "25" },
          ],
          defaultValue: "100",
        },
        {
          name: "currentSavings",
          label: "Current College Savings ($)",
          type: "number",
          placeholder: "e.g. 5000",
          min: 0,
          max: 500000,
          defaultValue: 0,
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
          defaultValue: "7",
        },
      ],
      calculate: (inputs) => {
        const childAge = inputs.childAge as number;
        const collegeType = inputs.collegeType as string;
        const coveragePercent = parseInt(inputs.coveragePercent as string) || 100;
        const currentSavings = (inputs.currentSavings as number) || 0;
        const annualReturn = (parseInt(inputs.returnRate as string) || 7) / 100;
        if (childAge === undefined || childAge === null) return null;

        // 2024 average annual college costs (tuition + room + board)
        const currentCosts: Record<string, number> = {
          instate: 27000,    // ~$27K/year in-state public
          outstate: 45000,   // ~$45K/year out-of-state public
          private: 58000,    // ~$58K/year private
          community: 12000,  // ~$12K/year community college
        };

        const years = collegeType === "community" ? 2 : 4;
        const currentAnnualCost = currentCosts[collegeType] || 27000;
        const inflationRate = 0.05; // College cost inflation ~5%/year

        const yearsUntilCollege = 18 - childAge;
        if (yearsUntilCollege <= 0) return null;

        // Project future costs with inflation
        const futureAnnualCost = currentAnnualCost * Math.pow(1 + inflationRate, yearsUntilCollege);
        const futureTotalCost = futureAnnualCost * years;
        const targetAmount = futureTotalCost * (coveragePercent / 100);

        // Future value of current savings
        const monthlyReturn = annualReturn / 12;
        const totalMonths = yearsUntilCollege * 12;
        const futureCurrentSavings = currentSavings * Math.pow(1 + monthlyReturn, totalMonths);

        // Remaining amount needed
        const remaining = Math.max(0, targetAmount - futureCurrentSavings);

        // Monthly savings needed (PMT formula)
        let monthlyPayment: number;
        if (monthlyReturn === 0) {
          monthlyPayment = remaining / totalMonths;
        } else {
          monthlyPayment = remaining * monthlyReturn / (Math.pow(1 + monthlyReturn, totalMonths) - 1);
        }

        const totalContributions = monthlyPayment * totalMonths + currentSavings;
        const totalGrowth = targetAmount - totalContributions;
        const taxSavings = totalGrowth * 0.24; // Approximate federal tax savings (529 growth is tax-free)

        const typeLabel = collegeType === "instate" ? "In-State Public" : collegeType === "outstate" ? "Out-of-State Public" : collegeType === "private" ? "Private" : "Community College";

        return {
          primary: {
            label: "Monthly Savings Needed",
            value: `$${formatNumber(monthlyPayment, 0)}/month`,
          },
          details: [
            { label: "College Type", value: `${typeLabel} (${years} years)` },
            { label: "Current Annual Cost", value: `$${formatNumber(currentAnnualCost, 0)}/year` },
            { label: "Projected Annual Cost (at age 18)", value: `$${formatNumber(futureAnnualCost, 0)}/year` },
            { label: "Total Projected Cost", value: `$${formatNumber(futureTotalCost, 0)}` },
            { label: `Your Target (${coveragePercent}%)`, value: `$${formatNumber(targetAmount, 0)}` },
            { label: "Years Until College", value: `${yearsUntilCollege} years` },
            { label: "Current Savings Will Grow To", value: `$${formatNumber(futureCurrentSavings, 0)}` },
            { label: "Total Contributions Needed", value: `$${formatNumber(totalContributions, 0)}` },
            { label: "Investment Growth", value: `$${formatNumber(totalGrowth, 0)}` },
            { label: "Tax Savings (529 Plan)", value: `~$${formatNumber(taxSavings, 0)} (tax-free growth)` },
          ],
          note: "529 plans offer tax-free growth and tax-free withdrawals for qualified education expenses. Many states also offer state income tax deductions for contributions. Starting early allows compound growth to do much of the heavy lifting. College costs assume ~5% annual inflation.",
        };
      },
    },
  ],
  relatedSlugs: ["childcare-cost-calculator", "compound-interest-calculator", "savings-goal-calculator"],
  faq: [
    {
      question: "What is a 529 plan?",
      answer:
        "A 529 plan is a tax-advantaged savings account for education expenses. Investment growth is federal tax-free, and withdrawals are tax-free when used for qualified education expenses (tuition, room, board, books, computers). Over 30 states offer additional state tax deductions or credits for contributions.",
    },
    {
      question: "How much should I save per month for college?",
      answer:
        "For a child born today, saving $250-$400/month from birth typically covers in-state public college costs with moderate investment returns. For private universities, $500-$800/month may be needed. Starting earlier dramatically reduces the monthly amount needed due to compound growth.",
    },
    {
      question: "What if my child gets a scholarship or doesn't go to college?",
      answer:
        "529 plans are flexible: you can change the beneficiary to another family member (sibling, cousin, or even yourself). Since 2024, up to $35,000 in unused 529 funds can be rolled into a Roth IRA for the beneficiary. If withdrawn for non-education purposes, you pay taxes and a 10% penalty on earnings only (not contributions).",
    },
  ],
  formula:
    "Monthly Payment = (Target - FV of Current Savings) × r / ((1+r)^n - 1) | Target = Annual Cost × (1+inflation)^years × college years × coverage% | r = monthly return, n = months until college. College inflation ≈ 5%/year.",
};

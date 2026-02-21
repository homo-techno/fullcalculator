import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rmdCalculator: CalculatorDefinition = {
  slug: "rmd-calculator",
  title: "RMD Calculator",
  description:
    "Free Required Minimum Distribution (RMD) calculator. Calculate your annual RMD from IRAs and 401(k)s using the IRS Uniform Lifetime Table. Plan your retirement withdrawals.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "rmd calculator",
    "required minimum distribution calculator",
    "ira rmd calculator",
    "401k rmd calculator",
    "rmd table calculator",
  ],
  variants: [
    {
      id: "rmd",
      name: "Calculate RMD",
      description: "Calculate your required minimum distribution for the year",
      fields: [
        {
          name: "accountBalance",
          label: "Account Balance (Dec 31 prior year)",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "$",
          min: 0,
        },
        {
          name: "age",
          label: "Your Age This Year",
          type: "number",
          placeholder: "e.g. 75",
          min: 72,
          max: 120,
          step: 1,
        },
      ],
      calculate: (inputs) => {
        const balance = inputs.accountBalance as number;
        const age = inputs.age as number;
        if (!balance || !age) return null;

        if (age < 73) {
          return {
            primary: { label: "RMD Required", value: "Not Yet" },
            note: "Under the SECURE 2.0 Act, RMDs begin at age 73 (for those born 1951-1959) or age 75 (for those born 1960 or later). You do not need to take RMDs yet.",
          };
        }

        // IRS Uniform Lifetime Table (simplified, key ages)
        const uniformTable: Record<number, number> = {
          73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9,
          78: 22.0, 79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5,
          83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4,
          88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8,
          93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8,
          98: 7.3, 99: 6.8, 100: 6.4, 101: 6.0, 102: 5.6,
          103: 5.2, 104: 4.9, 105: 4.6, 106: 4.3, 107: 4.1,
          108: 3.9, 109: 3.7, 110: 3.5, 111: 3.4, 112: 3.3,
          113: 3.1, 114: 3.0, 115: 2.9, 116: 2.8, 117: 2.7,
          118: 2.5, 119: 2.3, 120: 2.0,
        };

        const distributionPeriod = uniformTable[age] || (age > 120 ? 2.0 : 26.5);
        const rmd = balance / distributionPeriod;
        const monthlyRMD = rmd / 12;
        const rmdPct = (rmd / balance) * 100;

        // Show RMDs for next several years (assuming 5% growth)
        const details = [
          { label: "Account balance", value: `$${formatNumber(balance)}` },
          { label: "Age", value: `${age}` },
          { label: "Distribution period", value: `${distributionPeriod} years` },
          { label: "Annual RMD", value: `$${formatNumber(rmd)}` },
          { label: "Monthly equivalent", value: `$${formatNumber(monthlyRMD)}` },
          { label: "RMD as % of balance", value: `${formatNumber(rmdPct, 2)}%` },
        ];

        // Project next 5 years
        let projBalance = balance - rmd;
        for (let y = 1; y <= 5; y++) {
          const futureAge = age + y;
          if (futureAge > 120) break;
          projBalance = projBalance * 1.05; // assume 5% growth
          const futurePeriod = uniformTable[futureAge] || 2.0;
          const futureRMD = projBalance / futurePeriod;
          details.push({
            label: `RMD at age ${futureAge} (est.)`,
            value: `$${formatNumber(futureRMD)}`,
          });
          projBalance -= futureRMD;
        }

        return {
          primary: {
            label: "Required Minimum Distribution",
            value: `$${formatNumber(rmd)}`,
          },
          details,
          note: "RMD is calculated using the prior year-end account balance divided by the IRS Uniform Lifetime Table factor. Projections assume 5% annual growth. Failure to take RMDs results in a 25% penalty (reduced to 10% if corrected).",
        };
      },
    },
  ],
  relatedSlugs: ["retirement-calculator", "roth-ira-calculator", "social-security-calculator"],
  faq: [
    {
      question: "When do I have to start taking RMDs?",
      answer:
        "Under the SECURE 2.0 Act, RMDs begin at age 73 for those born 1951-1959, and age 75 for those born 1960 or later. Your first RMD must be taken by April 1 of the year after you reach the applicable age. Subsequent RMDs are due by December 31 each year.",
    },
    {
      question: "How is the RMD calculated?",
      answer:
        "RMD = Account Balance (as of Dec 31 of the prior year) / Distribution Period from the IRS Uniform Lifetime Table. For example, at age 75 the distribution period is 24.6, so a $500,000 balance requires a $20,325 withdrawal.",
    },
    {
      question: "What happens if I don't take my RMD?",
      answer:
        "The penalty for not taking your full RMD is 25% of the amount not withdrawn (reduced from the former 50% penalty). If corrected within 2 years, the penalty drops to 10%. You should take your RMD on time to avoid penalties.",
    },
  ],
  formula:
    "RMD = Account Balance (Dec 31 prior year) / Distribution Period. Distribution Period comes from IRS Uniform Lifetime Table based on your age.",
};

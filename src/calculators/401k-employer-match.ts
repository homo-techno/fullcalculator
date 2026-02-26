import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fourOhOneKEmployerMatchCalculator: CalculatorDefinition = {
  slug: "401k-employer-match-calculator",
  title: "401(k) Employer Match Calculator",
  description:
    "Free 401(k) employer match calculator. Maximize your free money by understanding your employer's matching formula and optimizing your contribution rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "401k match calculator",
    "employer match calculator",
    "401k contribution calculator",
    "maximize 401k match",
    "free money calculator",
  ],
  variants: [
    {
      id: "standard",
      name: "401(k) Match Maximizer",
      description:
        "Calculate the optimal 401(k) contribution to maximize employer matching",
      fields: [
        {
          name: "annualSalary",
          label: "Annual Salary",
          type: "number",
          placeholder: "e.g. 85000",
          prefix: "$",
        },
        {
          name: "matchType",
          label: "Employer Match Type",
          type: "select",
          options: [
            { label: "Dollar-for-dollar up to %", value: "full" },
            { label: "50 cents per dollar up to %", value: "half" },
            { label: "Custom match rate", value: "custom" },
          ],
          defaultValue: "full",
        },
        {
          name: "matchUpTo",
          label: "Match Up To (% of salary)",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "%",
        },
        {
          name: "customMatchRate",
          label: "Custom Match Rate (cents per dollar)",
          type: "number",
          placeholder: "e.g. 75",
          suffix: "%",
          defaultValue: 100,
        },
        {
          name: "yourContribution",
          label: "Your Contribution Rate",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "%",
        },
        {
          name: "vestingPercent",
          label: "Vesting Percentage",
          type: "select",
          options: [
            { label: "100% (Fully vested)", value: "100" },
            { label: "80%", value: "80" },
            { label: "60%", value: "60" },
            { label: "40%", value: "40" },
            { label: "20%", value: "20" },
            { label: "0% (Not vested)", value: "0" },
          ],
          defaultValue: "100",
        },
      ],
      calculate: (inputs) => {
        const salary = parseFloat(inputs.annualSalary as string);
        const matchType = inputs.matchType as string;
        const matchUpTo = parseFloat(inputs.matchUpTo as string);
        const customRate = parseFloat(inputs.customMatchRate as string) || 100;
        const yourRate = parseFloat(inputs.yourContribution as string);
        const vesting = parseFloat(inputs.vestingPercent as string) / 100;

        if (!salary || salary <= 0 || !matchUpTo || !yourRate) return null;

        const annualContribLimit = 23500;
        const yourAnnualContrib = Math.min(salary * (yourRate / 100), annualContribLimit);
        const matchablePercent = Math.min(yourRate, matchUpTo);
        const matchableSalary = salary * (matchablePercent / 100);

        let matchRate: number;
        if (matchType === "full") matchRate = 1.0;
        else if (matchType === "half") matchRate = 0.5;
        else matchRate = customRate / 100;

        const annualMatch = matchableSalary * matchRate;
        const vestedMatch = annualMatch * vesting;
        const totalAnnual = yourAnnualContrib + vestedMatch;

        const maxMatchContrib = salary * (matchUpTo / 100);
        const maxAnnualMatch = maxMatchContrib * matchRate;
        const leftOnTable = Math.max(0, maxAnnualMatch - annualMatch);

        const monthlyContrib = yourAnnualContrib / 12;
        const monthlyMatch = vestedMatch / 12;

        return {
          primary: { label: "Annual Employer Match", value: `$${formatNumber(vestedMatch)}` },
          details: [
            { label: "Your annual contribution", value: `$${formatNumber(yourAnnualContrib)}` },
            { label: "Employer match (before vesting)", value: `$${formatNumber(annualMatch)}` },
            { label: "Vested employer match", value: `$${formatNumber(vestedMatch)}` },
            { label: "Total annual (you + match)", value: `$${formatNumber(totalAnnual)}` },
            { label: "Free money left on table", value: `$${formatNumber(leftOnTable)}` },
            { label: "Monthly contribution", value: `$${formatNumber(monthlyContrib)}` },
            { label: "Monthly match", value: `$${formatNumber(monthlyMatch)}` },
            { label: "Minimum % to max match", value: `${formatNumber(matchUpTo)}%` },
          ],
          note: leftOnTable > 0
            ? `You're leaving $${formatNumber(leftOnTable)}/year on the table! Increase your contribution to ${formatNumber(matchUpTo)}% to get the full match.`
            : "You are maximizing your employer match. Consider contributing more toward the $23,500 annual limit.",
        };
      },
    },
    {
      id: "growth",
      name: "Match Growth Over Time",
      description:
        "See how employer match compounds over your career",
      fields: [
        {
          name: "annualSalary",
          label: "Annual Salary",
          type: "number",
          placeholder: "e.g. 85000",
          prefix: "$",
        },
        {
          name: "annualMatch",
          label: "Annual Employer Match Amount",
          type: "number",
          placeholder: "e.g. 5100",
          prefix: "$",
        },
        {
          name: "growthRate",
          label: "Expected Annual Return",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
        },
        {
          name: "years",
          label: "Years to Retirement",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "years",
        },
      ],
      calculate: (inputs) => {
        const salary = parseFloat(inputs.annualSalary as string);
        const annualMatch = parseFloat(inputs.annualMatch as string);
        const growthRate = parseFloat(inputs.growthRate as string);
        const years = parseFloat(inputs.years as string);

        if (!annualMatch || annualMatch <= 0 || !growthRate || !years) return null;

        const r = growthRate / 100;
        const futureValue = annualMatch * ((Math.pow(1 + r, years) - 1) / r);
        const totalContributed = annualMatch * years;
        const investmentGrowth = futureValue - totalContributed;

        return {
          primary: {
            label: "Match Value at Retirement",
            value: `$${formatNumber(futureValue)}`,
          },
          details: [
            { label: "Total match contributions", value: `$${formatNumber(totalContributed)}` },
            { label: "Investment growth", value: `$${formatNumber(investmentGrowth)}` },
            { label: "Annual employer match", value: `$${formatNumber(annualMatch)}` },
            { label: "Growth multiplier", value: `${formatNumber(futureValue / totalContributed)}x` },
          ],
          note: "This shows the power of employer matching over time. A $5,000/year match growing at 7% for 30 years becomes over $500,000. Never leave free money on the table.",
        };
      },
    },
  ],
  relatedSlugs: ["retirement-calculator", "savings-rate-calculator", "investment-calculator"],
  faq: [
    {
      question: "How does 401(k) employer matching work?",
      answer:
        "Employers match a percentage of your contributions up to a limit. Common formulas: 100% match up to 6% of salary, or 50% match up to 6%. If you earn $85,000 and your employer matches dollar-for-dollar up to 6%, contributing 6% ($5,100) gets you $5,100 in free money.",
    },
    {
      question: "What happens if I don't contribute enough to get the full match?",
      answer:
        "You leave free money on the table. If your employer matches up to 6% and you only contribute 3%, you get half the available match. Always contribute at least enough to get the full match before paying off low-interest debt or saving elsewhere.",
    },
    {
      question: "What is a 401(k) vesting schedule?",
      answer:
        "Vesting determines how much of the employer match you keep if you leave the company. Cliff vesting means 0% until a date (usually 3 years), then 100%. Graded vesting increases gradually (e.g., 20% per year). Your own contributions are always 100% vested.",
    },
  ],
  formula:
    "Annual Match = min(Your Contribution Rate, Match Cap %) x Salary x Match Rate. Future Value = Annual Match x ((1 + r)^n - 1) / r",
};

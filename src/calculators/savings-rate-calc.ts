import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const savingsRateCalculator: CalculatorDefinition = {
  slug: "savings-rate-calculator",
  title: "Personal Savings Rate Calculator",
  description:
    "Free personal savings rate calculator. Calculate what percentage of your gross or net income you are saving and compare to recommended benchmarks.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "savings rate calculator",
    "personal savings rate",
    "savings percentage",
    "how much should i save",
    "savings ratio",
  ],
  variants: [
    {
      id: "standard",
      name: "Savings Rate Calculator",
      description:
        "Calculate your personal savings rate from income and savings",
      fields: [
        {
          name: "grossIncome",
          label: "Gross Monthly Income",
          type: "number",
          placeholder: "e.g. 7000",
          prefix: "$",
        },
        {
          name: "netIncome",
          label: "Net Monthly Income (Take-Home)",
          type: "number",
          placeholder: "e.g. 5200",
          prefix: "$",
        },
        {
          name: "retirement401k",
          label: "401(k)/403(b) Contributions",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "iraContrib",
          label: "IRA Contributions",
          type: "number",
          placeholder: "e.g. 250",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "otherSavings",
          label: "Other Savings & Investments",
          type: "number",
          placeholder: "e.g. 300",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "employerMatch",
          label: "Employer Match (if including)",
          type: "number",
          placeholder: "e.g. 250",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const gross = parseFloat(inputs.grossIncome as string);
        const net = parseFloat(inputs.netIncome as string);
        const ret401k = parseFloat(inputs.retirement401k as string) || 0;
        const ira = parseFloat(inputs.iraContrib as string) || 0;
        const other = parseFloat(inputs.otherSavings as string) || 0;
        const match = parseFloat(inputs.employerMatch as string) || 0;

        if (!gross || gross <= 0) return null;

        const totalSavings = ret401k + ira + other;
        const totalWithMatch = totalSavings + match;
        const grossRate = (totalSavings / gross) * 100;
        const grossRateWithMatch = (totalWithMatch / gross) * 100;
        const netRate = net > 0 ? (totalSavings / net) * 100 : 0;

        const annualSavings = totalSavings * 12;
        const annualWithMatch = totalWithMatch * 12;

        let rating: string;
        if (grossRate >= 20) rating = "Excellent (20%+ is FIRE territory)";
        else if (grossRate >= 15) rating = "Great (on track for retirement)";
        else if (grossRate >= 10) rating = "Good (above average)";
        else if (grossRate >= 5) rating = "Fair (below recommended)";
        else rating = "Needs improvement (aim for 10-15%)";

        return {
          primary: { label: "Savings Rate (Gross)", value: `${formatNumber(grossRate)}%` },
          details: [
            { label: "Savings rate (with match)", value: `${formatNumber(grossRateWithMatch)}%` },
            { label: "Savings rate (net income)", value: `${formatNumber(netRate)}%` },
            { label: "Monthly savings", value: `$${formatNumber(totalSavings)}` },
            { label: "Annual savings", value: `$${formatNumber(annualSavings)}` },
            { label: "Annual savings with match", value: `$${formatNumber(annualWithMatch)}` },
            { label: "Rating", value: rating },
          ],
          note: "Financial experts recommend saving 15-20% of gross income for retirement. The average U.S. personal savings rate is ~4-5%. FIRE enthusiasts target 50%+ savings rates.",
        };
      },
    },
  ],
  relatedSlugs: ["retirement-calculator", "savings-goal-calculator", "net-worth-calculator"],
  faq: [
    {
      question: "What is a good personal savings rate?",
      answer:
        "Financial advisors recommend saving at least 15-20% of gross income. This includes employer matches and retirement contributions. The national average is around 4-5%. Those pursuing FIRE (Financial Independence, Retire Early) often aim for 50% or more.",
    },
    {
      question: "Should I calculate savings rate on gross or net income?",
      answer:
        "Both are useful. Gross income rate is the standard benchmark (since 401k comes from gross). Net income rate shows what fraction of take-home pay you're saving. Include 401k/IRA contributions and employer matches for a complete picture.",
    },
  ],
  formula:
    "Savings Rate = (Total Monthly Savings / Gross Monthly Income) x 100",
};

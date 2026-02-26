import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const salaryComparisonCalculator: CalculatorDefinition = {
  slug: "salary-comparison-calculator",
  title: "Salary Comparison by City Calculator",
  description:
    "Free online salary comparison calculator. Compare job offers across different cities by adjusting for cost of living, taxes, and purchasing power.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "salary comparison calculator",
    "salary by city calculator",
    "job offer comparison",
    "salary cost of living",
    "salary purchasing power",
  ],
  variants: [
    {
      id: "compare-offers",
      name: "Compare Two Job Offers",
      description: "Compare salaries in two different cities after adjustments",
      fields: [
        { name: "salary1", label: "Offer 1 Salary", type: "number", placeholder: "e.g. 80000", prefix: "$" },
        {
          name: "city1Index",
          label: "Offer 1 City Cost Index",
          type: "select",
          options: [
            { label: "Low Cost (85)", value: "85" },
            { label: "Average (100)", value: "100" },
            { label: "Above Average (115)", value: "115" },
            { label: "High Cost (135)", value: "135" },
            { label: "Very High Cost (175)", value: "175" },
            { label: "Extreme (220)", value: "220" },
          ],
          defaultValue: "100",
        },
        { name: "stateTax1", label: "Offer 1 State Tax Rate %", type: "number", placeholder: "e.g. 5", suffix: "%" },
        { name: "salary2", label: "Offer 2 Salary", type: "number", placeholder: "e.g. 110000", prefix: "$" },
        {
          name: "city2Index",
          label: "Offer 2 City Cost Index",
          type: "select",
          options: [
            { label: "Low Cost (85)", value: "85" },
            { label: "Average (100)", value: "100" },
            { label: "Above Average (115)", value: "115" },
            { label: "High Cost (135)", value: "135" },
            { label: "Very High Cost (175)", value: "175" },
            { label: "Extreme (220)", value: "220" },
          ],
          defaultValue: "135",
        },
        { name: "stateTax2", label: "Offer 2 State Tax Rate %", type: "number", placeholder: "e.g. 9", suffix: "%" },
      ],
      calculate: (inputs) => {
        const sal1 = parseFloat(inputs.salary1 as string) || 0;
        const idx1 = parseFloat(inputs.city1Index as string) || 100;
        const tax1 = parseFloat(inputs.stateTax1 as string) || 0;
        const sal2 = parseFloat(inputs.salary2 as string) || 0;
        const idx2 = parseFloat(inputs.city2Index as string) || 100;
        const tax2 = parseFloat(inputs.stateTax2 as string) || 0;
        if (!sal1 || !sal2) return null;

        // After state tax
        const afterTax1 = sal1 * (1 - tax1 / 100);
        const afterTax2 = sal2 * (1 - tax2 / 100);

        // Purchasing power (normalized to index 100)
        const pp1 = afterTax1 * (100 / idx1);
        const pp2 = afterTax2 * (100 / idx2);

        const betterOffer = pp1 > pp2 ? "Offer 1" : "Offer 2";
        const ppDiff = Math.abs(pp1 - pp2);
        const ppDiffPct = (ppDiff / Math.min(pp1, pp2)) * 100;

        // Equivalent: What would Offer 2 salary need to be in Offer 1's city?
        const sal2InCity1 = afterTax2 * (idx1 / idx2) / (1 - tax1 / 100);

        return {
          primary: { label: "Better Purchasing Power", value: `${betterOffer} by $${formatNumber(ppDiff)}/yr` },
          details: [
            { label: "Offer 1 after state tax", value: `$${formatNumber(afterTax1)}` },
            { label: "Offer 2 after state tax", value: `$${formatNumber(afterTax2)}` },
            { label: "Offer 1 purchasing power", value: `$${formatNumber(pp1)}` },
            { label: "Offer 2 purchasing power", value: `$${formatNumber(pp2)}` },
            { label: "Purchasing power difference", value: `${formatNumber(ppDiffPct)}%` },
            { label: "Offer 2 equivalent in City 1", value: `$${formatNumber(sal2InCity1)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cost-of-living-calculator", "paycheck-calculator", "tax-calculator"],
  faq: [
    {
      question: "How do I compare salaries across different cities?",
      answer:
        "To compare salaries fairly, adjust each salary for cost of living and state taxes. A $100K salary in a low-cost city (index 85) has more purchasing power than $130K in a high-cost city (index 175). Calculate: Purchasing Power = After-Tax Salary x (100 / City Index).",
    },
    {
      question: "Should I only consider salary when comparing job offers?",
      answer:
        "No. Also consider benefits (health insurance, 401k match, stock options), work-life balance, career growth, commute time, quality of life, and non-monetary factors like weather and proximity to family.",
    },
  ],
  formula: "Purchasing Power = After-Tax Salary x (100 / City Cost Index)",
};

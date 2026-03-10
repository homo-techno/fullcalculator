import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fireWithKidsCalculator: CalculatorDefinition = {
  slug: "fire-with-kids-calculator",
  title: "FIRE with Kids Cost Calculator",
  description:
    "Calculate how children impact your FIRE number. Account for education, healthcare, activities, and lifestyle changes with kids.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "FIRE with children",
    "kids FIRE number",
    "family FIRE",
    "children cost FIRE",
    "education cost FIRE",
  ],
  variants: [
    {
      id: "calculate",
      name: "FIRE with Kids Impact",
      description: "How many kids affect your FIRE number",
      fields: [
        {
          name: "baseExpenses",
          label: "Base Annual Expenses (no kids)",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
        },
        {
          name: "numberOfKids",
          label: "Number of Children",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          max: 10,
        },
      ],
      calculate: (inputs) => {
        const baseExpenses = parseFloat(inputs.baseExpenses as string) || 50000;
        const kids = parseFloat(inputs.numberOfKids as string) || 2;

        // Cost per child: ~$15-25k/year depending on location
        const costPerChild = 20000;
        const totalWithKids = baseExpenses + (kids * costPerChild);

        const fireNumberNoKids = baseExpenses * 25;
        const fireNumberWithKids = totalWithKids * 25;
        const increase = fireNumberWithKids - fireNumberNoKids;

        return {
          primary: { label: "FIRE Number with Kids", value: `$${formatNumber(fireNumberWithKids, 0)}` },
          details: [
            { label: "Base expenses (no kids)", value: `$${formatNumber(baseExpenses, 0)}` },
            { label: "Number of children", value: formatNumber(kids) },
            { label: "Cost per child/year", value: `$${costPerChild}` },
            { label: "Total kids annual cost", value: `$${formatNumber(kids * costPerChild, 0)}` },
            { label: "Total annual expenses", value: `$${formatNumber(totalWithKids, 0)}` },
            { label: "FIRE number without kids", value: `$${formatNumber(fireNumberNoKids, 0)}` },
            { label: "FIRE number with kids", value: `$${formatNumber(fireNumberWithKids, 0)}` },
            { label: "Increase needed", value: `$${formatNumber(increase, 0)}` },
            { label: "Per child FIRE increase", value: `$${formatNumber(increase / kids, 0)}` },
          ],
          note: "Assumes kids through age 18. College costs may add $100-300k per child (plan separately).",
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "college-savings-impact"],
  faq: [
    {
      question: "How much does a kid cost for FIRE?",
      answer:
        "Roughly 25x $20k/year = $500k per child to your FIRE number. For 2 kids: $1M extra needed. Can reduce by: living frugally with kids, homeschooling, geographic arbitrage.",
    },
    {
      question: "Can I FIRE with kids?",
      answer:
        "Yes! Many people do. Strategies: lower expenses generally, partner income in early retirement, public school (vs private), shared housing with family.",
    },
  ],
  formula: "FIRE with Kids = (Base Expenses + (Kids × Cost Per Child)) × 25",
};

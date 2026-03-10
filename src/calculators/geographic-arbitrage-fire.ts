import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const geographicArbitrageFire: CalculatorDefinition = {
  slug: "geographic-arbitrage-fire",
  title: "Geographic Arbitrage FIRE Calculator",
  description:
    "Calculate FIRE by relocating to low cost-of-living countries. See how moving abroad reduces FIRE number significantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "geographic arbitrage FIRE",
    "expat FIRE",
    "FIRE abroad",
    "low cost FIRE",
    "relocation FIRE",
  ],
  variants: [
    {
      id: "compare",
      name: "Compare Cost of Living",
      description: "Retire in different countries",
      fields: [
        {
          name: "usExpenses",
          label: "Annual US Expenses",
          type: "number",
          placeholder: "e.g. 60000",
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const usExpenses = parseFloat(inputs.usExpenses as string) || 60000;

        const countries: Array<{ name: string; costMultiplier: number }> = [
          { name: "United States", costMultiplier: 1.0 },
          { name: "Mexico", costMultiplier: 0.4 },
          { name: "Portugal", costMultiplier: 0.5 },
          { name: "Thailand", costMultiplier: 0.3 },
          { name: "Vietnam", costMultiplier: 0.25 },
          { name: "Colombia", costMultiplier: 0.35 },
          { name: "Georgia", costMultiplier: 0.4 },
          { name: "Albania", costMultiplier: 0.35 },
        ];

        let details: { label: string; value: string }[] = [];

        countries.forEach((c) => {
          const localExpenses = usExpenses * c.costMultiplier;
          const fireNumber = localExpenses * 25;
          const savings = (usExpenses * 25) - fireNumber;

          details.push({
            label: c.name,
            value: `$${formatNumber(localExpenses, 0)}/yr | FIRE: $${formatNumber(fireNumber, 0)} | Save: $${formatNumber(savings, 0)}`
          });
        });

        return {
          primary: { label: "FIRE Savings Through Relocation", value: "See breakdown below" },
          details,
          note: "Cost multipliers approximate. Healthcare, visa requirements, and personal preferences also matter.",
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "leanfire-calculator"],
  faq: [
    {
      question: "Is it legal to retire abroad on US passport?",
      answer:
        "Yes, with appropriate visa. Many countries offer retirement visas (Portugal D7, Mexico Temporal, Thailand Elite). Requirements vary: some need $25k/year income, others need $300k+ assets.",
    },
    {
      question: "Can I reduce FIRE number by 50% by moving?",
      answer:
        "Yes! Retiring in SE Asia on $30k/year instead of $60k in US cuts your FIRE number in half: from $1.5M to $750k. Huge impact!",
    },
  ],
  formula: "FIRE Number Abroad = (US Expenses × Cost Multiplier) × 25",
};

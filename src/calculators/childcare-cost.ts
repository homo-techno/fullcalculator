import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const childcareCostCalculator: CalculatorDefinition = {
  slug: "childcare-cost-calculator",
  title: "Childcare Cost Calculator",
  description:
    "Free childcare cost calculator. Compare costs of daycare, nanny, au pair, and family care options, including tax benefits and subsidies.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "childcare cost",
    "daycare cost calculator",
    "nanny cost calculator",
    "childcare budget",
    "cost of childcare",
  ],
  variants: [
    {
      id: "childcare-compare",
      name: "Compare Childcare Costs",
      description: "Compare costs of different childcare options",
      fields: [
        {
          name: "childAge",
          label: "Child's Age",
          type: "select",
          options: [
            { label: "Infant (0-12 months)", value: "infant" },
            { label: "Toddler (1-2 years)", value: "toddler" },
            { label: "Preschool (3-4 years)", value: "preschool" },
            { label: "School-age (5+ years, after school)", value: "school" },
          ],
          defaultValue: "infant",
        },
        {
          name: "careType",
          label: "Type of Care",
          type: "select",
          options: [
            { label: "Daycare Center", value: "daycare" },
            { label: "Home Daycare", value: "homedaycare" },
            { label: "Nanny (full-time)", value: "nanny" },
            { label: "Nanny Share (split with another family)", value: "nannyshare" },
            { label: "Au Pair", value: "aupair" },
          ],
          defaultValue: "daycare",
        },
        {
          name: "costLevel",
          label: "Area Cost Level",
          type: "select",
          options: [
            { label: "Low cost area (rural/small city)", value: "low" },
            { label: "Average cost area (mid-size city)", value: "average" },
            { label: "High cost area (major metro)", value: "high" },
            { label: "Very high cost (NYC, SF, Boston)", value: "veryhigh" },
          ],
          defaultValue: "average",
        },
        {
          name: "numberOfChildren",
          label: "Number of Children in Care",
          type: "number",
          placeholder: "e.g. 1",
          min: 1,
          max: 4,
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const childAge = inputs.childAge as string;
        const careType = inputs.careType as string;
        const costLevel = inputs.costLevel as string;
        const numChildren = (inputs.numberOfChildren as number) || 1;

        // Base monthly costs (single child, average area) - US national averages
        const baseCosts: Record<string, Record<string, number>> = {
          daycare: { infant: 1450, toddler: 1300, preschool: 1100, school: 600 },
          homedaycare: { infant: 1000, toddler: 900, preschool: 800, school: 450 },
          nanny: { infant: 2800, toddler: 2800, preschool: 2800, school: 1800 },
          nannyshare: { infant: 1800, toddler: 1800, preschool: 1800, school: 1200 },
          aupair: { infant: 1600, toddler: 1600, preschool: 1600, school: 1600 },
        };

        // Cost multipliers by area
        const areaMultiplier: Record<string, number> = {
          low: 0.70, average: 1.0, high: 1.40, veryhigh: 1.85,
        };

        const base = baseCosts[careType]?.[childAge] || 1300;
        const multiplier = areaMultiplier[costLevel] || 1.0;
        const monthlyPerChild = base * multiplier;

        // Second+ child discount
        let monthlyCost = monthlyPerChild;
        if (numChildren > 1) {
          // Daycare: ~10% sibling discount, Nanny: ~30% cheaper than 2 separate
          const siblingRate = careType === "nanny" || careType === "nannyshare" ? 0.30 : 0.10;
          monthlyCost = monthlyPerChild + (monthlyPerChild * (numChildren - 1) * (1 - siblingRate));
        }

        const weeklyCost = monthlyCost / 4.33;
        const annualCost = monthlyCost * 12;
        const dailyCost = weeklyCost / 5;

        // Tax benefits
        const dcfsaMax = 5000; // Dependent Care FSA max
        const taxSavings = Math.min(annualCost, dcfsaMax) * 0.30; // Approximate 30% marginal tax rate
        const childCareCredit = Math.min(annualCost, numChildren > 1 ? 6000 : 3000) * 0.20; // 20% credit
        const effectiveAnnual = annualCost - Math.max(taxSavings, childCareCredit);

        const careLabel = careType === "daycare" ? "Daycare Center" : careType === "homedaycare" ? "Home Daycare" : careType === "nanny" ? "Full-Time Nanny" : careType === "nannyshare" ? "Nanny Share" : "Au Pair";

        return {
          primary: {
            label: "Monthly Cost",
            value: `$${formatNumber(monthlyCost, 0)}/month`,
          },
          details: [
            { label: "Care Type", value: careLabel },
            { label: "Weekly Cost", value: `$${formatNumber(weeklyCost, 0)}/week` },
            { label: "Daily Cost", value: `$${formatNumber(dailyCost, 0)}/day` },
            { label: "Annual Cost", value: `$${formatNumber(annualCost, 0)}/year` },
            { label: "Tax Savings (DCFSA/Credit)", value: `Up to $${formatNumber(Math.max(taxSavings, childCareCredit), 0)}/year` },
            { label: "Effective Annual Cost", value: `~$${formatNumber(effectiveAnnual, 0)}/year (after tax benefits)` },
            { label: "% of Median Income", value: `${formatNumber((annualCost / 65000) * 100, 1)}% of US median household income` },
          ],
          note: "Costs are estimates based on 2024 US national averages adjusted for area. Actual costs vary significantly by location, facility quality, and provider experience. Tax benefits include the Dependent Care FSA ($5,000/year) and Child/Dependent Care Tax Credit.",
        };
      },
    },
  ],
  relatedSlugs: ["maternity-leave-calculator", "college-fund-calculator", "diaper-cost-calculator"],
  faq: [
    {
      question: "How much does childcare cost on average?",
      answer:
        "In the US, the average cost of full-time infant care at a daycare center is about $1,100-$1,500/month nationally, but ranges from $800/month in low-cost areas to over $2,500/month in expensive metro areas. Infant care costs more than toddler or preschool care. A full-time nanny typically costs $2,500-$4,000+/month.",
    },
    {
      question: "What are the tax benefits for childcare?",
      answer:
        "Two main tax benefits: 1) Dependent Care FSA (DCFSA): set aside up to $5,000/year pre-tax for childcare, saving ~$1,500 in taxes. 2) Child and Dependent Care Tax Credit: 20-35% credit on up to $3,000 ($6,000 for 2+ children) in childcare expenses. You can use the DCFSA OR the credit, but generally not both on the same expenses.",
    },
    {
      question: "Is a nanny or daycare cheaper?",
      answer:
        "Daycare is typically cheaper for one child ($1,100-$1,500/month vs $2,500-$4,000+/month for a nanny). However, with two or more children, a nanny becomes more cost-competitive since you pay one salary regardless. A nanny share (splitting a nanny with another family) offers a middle-ground option.",
    },
  ],
  formula:
    "Monthly Cost = Base Cost × Area Multiplier × Number of Children (with sibling discount). Tax Savings = min(Annual Cost, $5,000) × marginal tax rate (DCFSA) or min(Annual Cost, $3,000-$6,000) × 20% (credit).",
};

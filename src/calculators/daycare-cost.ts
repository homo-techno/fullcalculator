import type { CalculatorDefinition } from "./types";

export const daycareCostCalculator: CalculatorDefinition = {
  slug: "daycare-cost-calculator",
  title: "Daycare Cost Calculator",
  description:
    "Free daycare cost calculator. Estimate annual daycare expenses, compare care options, and factor in tax benefits for childcare.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "daycare cost",
    "childcare cost",
    "daycare calculator",
    "childcare expenses",
    "nanny vs daycare",
  ],
  variants: [
    {
      id: "cost",
      name: "Daycare Cost Estimator",
      description: "Estimate childcare costs based on your situation",
      fields: [
        {
          name: "careType",
          label: "Type of Care",
          type: "select",
          options: [
            { label: "Daycare Center", value: "center" },
            { label: "Home Daycare", value: "home" },
            { label: "Nanny (Full-time)", value: "nanny" },
            { label: "Nanny Share", value: "nannyshare" },
            { label: "Au Pair", value: "aupair" },
          ],
        },
        {
          name: "childAge",
          label: "Child's Age",
          type: "select",
          options: [
            { label: "Infant (0-12 months)", value: "infant" },
            { label: "Toddler (1-2 years)", value: "toddler" },
            { label: "Preschool (3-4 years)", value: "preschool" },
            { label: "School-age (5+)", value: "school" },
          ],
        },
        {
          name: "region",
          label: "Cost-of-Living Area",
          type: "select",
          options: [
            { label: "High cost (NYC, SF, Boston)", value: "high" },
            { label: "Medium-high (Denver, Austin, Seattle)", value: "medhigh" },
            { label: "Medium (national average)", value: "medium" },
            { label: "Lower cost (rural/smaller cities)", value: "low" },
          ],
        },
        {
          name: "daysPerWeek",
          label: "Days Per Week",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 5,
        },
        {
          name: "numberOfChildren",
          label: "Number of Children in Care",
          type: "number",
          placeholder: "e.g. 1",
          min: 1,
          max: 4,
        },
      ],
      calculate: (inputs) => {
        const careType = inputs.careType as string;
        const childAge = inputs.childAge as string;
        const region = inputs.region as string;
        const days = inputs.daysPerWeek as number;
        const numChildren = inputs.numberOfChildren as number;
        if (!careType || !childAge || !region || !days || !numChildren) return null;

        // Base weekly costs (national average for full-time)
        const baseCosts: Record<string, Record<string, number>> = {
          center: { infant: 375, toddler: 325, preschool: 275, school: 225 },
          home: { infant: 275, toddler: 250, preschool: 225, school: 195 },
          nanny: { infant: 750, toddler: 725, preschool: 700, school: 675 },
          nannyshare: { infant: 475, toddler: 450, preschool: 425, school: 400 },
          aupair: { infant: 400, toddler: 400, preschool: 400, school: 400 },
        };

        const regionMultiplier: Record<string, number> = {
          high: 1.5,
          medhigh: 1.2,
          medium: 1.0,
          low: 0.75,
        };

        const baseWeekly = baseCosts[careType]?.[childAge] ?? 300;
        const multiplier = regionMultiplier[region] ?? 1.0;

        // Adjust for part-time (not linear - part-time often costs more per day)
        const daysFactor = days / 5;
        const ptPremium = days < 5 ? 1.1 : 1.0;

        let weeklyPerChild = baseWeekly * multiplier * daysFactor * ptPremium;

        // Sibling discount (typically 5-10% for second child at centers)
        let siblingDiscount = 0;
        if (numChildren > 1 && (careType === "center" || careType === "home")) {
          siblingDiscount = weeklyPerChild * 0.1 * (numChildren - 1);
        }

        const totalWeekly = weeklyPerChild * numChildren - siblingDiscount;
        const monthlyTotal = totalWeekly * 4.33;
        const annualTotal = totalWeekly * 52;

        // Tax benefits
        const dctcMax = Math.min(annualTotal, numChildren > 1 ? 6000 : 3000);
        const dctcBenefit = dctcMax * 0.2;
        const fsaMax = Math.min(annualTotal, 5000);
        const fsaSavings = fsaMax * 0.25;

        const careLabels: Record<string, string> = {
          center: "Daycare Center",
          home: "Home Daycare",
          nanny: "Full-time Nanny",
          nannyshare: "Nanny Share",
          aupair: "Au Pair",
        };

        return {
          primary: {
            label: "Estimated Annual Cost",
            value: `$${Math.round(annualTotal).toLocaleString()}`,
          },
          details: [
            {
              label: "Monthly cost",
              value: `$${Math.round(monthlyTotal).toLocaleString()}`,
            },
            {
              label: "Weekly cost",
              value: `$${Math.round(totalWeekly).toLocaleString()}`,
            },
            { label: "Care type", value: careLabels[careType] || careType },
            { label: "Schedule", value: `${days} days/week, ${numChildren} child(ren)` },
            {
              label: "Sibling discount (est.)",
              value: siblingDiscount > 0 ? `$${Math.round(siblingDiscount * 52)}/year` : "N/A",
            },
            {
              label: "DCTC tax credit (est.)",
              value: `Up to $${Math.round(dctcBenefit)}/year`,
            },
            {
              label: "FSA savings (est.)",
              value: `Up to $${Math.round(fsaSavings)}/year`,
            },
            {
              label: "After tax benefits",
              value: `~$${Math.round(annualTotal - dctcBenefit - fsaSavings).toLocaleString()}/year`,
            },
          ],
          note: "Costs vary significantly by location and provider. Tax benefits depend on your tax bracket and eligibility. Consult a tax professional for exact savings.",
        };
      },
    },
  ],
  relatedSlugs: ["college-savings-baby-calculator", "baby-proofing-calculator"],
  faq: [
    {
      question: "How much does daycare cost on average?",
      answer:
        "The national average for infant daycare at a center is about $1,300-$1,600/month. Costs vary dramatically by location: $2,000+ in high-cost cities, $800-1,000 in lower-cost areas. Home daycares are typically 20-30% less than centers.",
    },
    {
      question: "What tax benefits are available for childcare?",
      answer:
        "The Dependent Care Tax Credit (DCTC) provides a credit of 20-35% on up to $3,000 for one child or $6,000 for two or more. Dependent Care FSAs let you set aside up to $5,000 pre-tax. You cannot use the same expenses for both benefits.",
    },
  ],
  formula:
    "Annual cost = weekly rate x 52. Weekly rate = base cost x region multiplier x (days/5) x part-time premium. Sibling discount: ~10% for centers. Tax benefits: DCTC (20% of up to $3K/$6K) + FSA ($5K pre-tax).",
};

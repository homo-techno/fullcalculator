import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aduCostCalculator: CalculatorDefinition = {
  slug: "adu-cost",
  title: "ADU / Granny Flat Build Cost Estimator",
  description:
    "Estimate the cost to build an Accessory Dwelling Unit (ADU), granny flat, or in-law suite. Includes construction, permits, utilities, and potential rental income analysis.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ADU",
    "accessory dwelling unit",
    "granny flat",
    "in-law suite",
    "backyard cottage",
    "construction cost",
    "rental income",
    "housing",
    "build cost",
  ],
  variants: [
    {
      slug: "build-cost",
      title: "ADU Build Cost Estimate",
      fields: [
        {
          name: "sqft",
          label: "ADU Size (sq ft)",
          type: "number",
        },
        {
          name: "type",
          label: "ADU Type",
          type: "select",
          options: [
            { label: "Detached New Construction", value: "detached" },
            { label: "Attached Addition", value: "attached" },
            { label: "Garage Conversion", value: "garage" },
            { label: "Basement Conversion", value: "basement" },
            { label: "Prefab/Modular", value: "prefab" },
          ],
        },
        {
          name: "finish",
          label: "Finish Level",
          type: "select",
          options: [
            { label: "Basic/Economy", value: "150" },
            { label: "Standard/Mid-Range", value: "250" },
            { label: "High-End/Custom", value: "400" },
          ],
        },
      ],
      calculate(inputs) {
        const sqft = parseFloat(inputs.sqft as string);
        const type = inputs.type as string;
        const costPerSqft = parseFloat(inputs.finish as string);
        if (isNaN(sqft) || isNaN(costPerSqft))
          return { error: "Please enter a valid ADU size." };

        const typeMultiplier: Record<string, number> = {
          detached: 1.0,
          attached: 0.85,
          garage: 0.65,
          basement: 0.6,
          prefab: 0.8,
        };

        const constructionCost = sqft * costPerSqft * typeMultiplier[type];
        const permitCost = Math.max(5000, constructionCost * 0.03);
        const architectCost = constructionCost * 0.08;
        const utilityCost = type === "detached" ? 15000 : type === "garage" ? 8000 : 5000;
        const landscaping = 3000;
        const totalCost = constructionCost + permitCost + architectCost + utilityCost + landscaping;
        const costPerSqftActual = totalCost / sqft;

        return {
          results: [
            { label: "Construction Cost", value: `$${formatNumber(constructionCost)}` },
            { label: "Permits & Fees", value: `$${formatNumber(permitCost)}` },
            { label: "Architecture/Design", value: `$${formatNumber(architectCost)}` },
            { label: "Utility Connections", value: `$${formatNumber(utilityCost)}` },
            { label: "Landscaping/Site Work", value: `$${formatNumber(landscaping)}` },
            { label: "Total Estimated Cost", value: `$${formatNumber(totalCost)}` },
            { label: "All-in Cost per Sq Ft", value: `$${formatNumber(costPerSqftActual)}` },
          ],
        };
      },
    },
    {
      slug: "rental-roi",
      title: "ADU Rental Income ROI",
      fields: [
        {
          name: "buildCost",
          label: "Total Build Cost ($)",
          type: "number",
        },
        {
          name: "monthlyRent",
          label: "Expected Monthly Rent ($)",
          type: "number",
        },
        {
          name: "annualExpenses",
          label: "Annual Expenses (maintenance, insurance, etc.) ($)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const buildCost = parseFloat(inputs.buildCost as string);
        const rent = parseFloat(inputs.monthlyRent as string);
        const expenses = parseFloat(inputs.annualExpenses as string);
        if (isNaN(buildCost) || isNaN(rent) || isNaN(expenses))
          return { error: "Please enter all values." };

        const annualRent = rent * 12;
        const netIncome = annualRent - expenses;
        const capRate = (netIncome / buildCost) * 100;
        const paybackYears = netIncome > 0 ? buildCost / netIncome : 0;
        const roi5yr = netIncome * 5 - buildCost;
        const roi10yr = netIncome * 10 - buildCost;

        return {
          results: [
            { label: "Annual Gross Rent", value: `$${formatNumber(annualRent)}` },
            { label: "Annual Net Income", value: `$${formatNumber(netIncome)}` },
            { label: "Cap Rate", value: `${formatNumber(capRate)}%` },
            { label: "Payback Period", value: `${formatNumber(paybackYears)} years` },
            { label: "5-Year Net Return", value: `$${formatNumber(roi5yr)}` },
            { label: "10-Year Net Return", value: `$${formatNumber(roi10yr)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-appraisal-value", "rent-to-income", "airbnb-occupancy-rate"],
  faq: [
    {
      question: "How much does it cost to build an ADU?",
      answer:
        "ADU costs vary widely: garage conversions ($50,000-$150,000), basement conversions ($40,000-$100,000), attached additions ($100,000-$250,000), and detached new construction ($150,000-$400,000+). The national average is roughly $150-$400 per square foot all-in.",
    },
    {
      question: "Do ADUs increase property value?",
      answer:
        "ADUs typically increase property value by 20-30% of their construction cost, with some markets seeing even higher returns. The exact impact depends on local zoning, rental demand, and comparable sales with ADUs in your area.",
    },
    {
      question: "What permits are needed for an ADU?",
      answer:
        "Permits required typically include building permits, electrical and plumbing permits, and sometimes separate utility connections. Many states have streamlined ADU permitting. California, Oregon, and Washington have been particularly ADU-friendly with reduced requirements and fees.",
    },
  ],
  formula:
    "Total Cost = Construction + Permits + Design + Utilities + Landscaping | Cap Rate = (Annual Net Income / Build Cost) x 100 | Payback = Build Cost / Annual Net Income",
};

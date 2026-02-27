import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hoaFeeComparisonCalculator: CalculatorDefinition = {
  slug: "hoa-fee-comparison",
  title: "HOA Fee Value Analysis Calculator",
  description:
    "Analyze HOA fee value by comparing included amenities and services against their standalone costs. Determine if your HOA fees provide good value.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "HOA",
    "homeowners association",
    "fees",
    "dues",
    "condo fees",
    "amenities",
    "property management",
    "maintenance",
    "assessment",
  ],
  variants: [
    {
      slug: "fee-value-analysis",
      title: "HOA Fee Value Analysis",
      fields: [
        {
          name: "monthlyFee",
          label: "Monthly HOA Fee ($)",
          type: "number",
        },
        {
          name: "includesWater",
          label: "Includes Water/Sewer?",
          type: "select",
          options: [
            { label: "Yes", value: "75" },
            { label: "No", value: "0" },
          ],
        },
        {
          name: "includesTrash",
          label: "Includes Trash/Recycling?",
          type: "select",
          options: [
            { label: "Yes", value: "35" },
            { label: "No", value: "0" },
          ],
        },
        {
          name: "includesInsurance",
          label: "Includes Building Insurance?",
          type: "select",
          options: [
            { label: "Yes (condo/townhome)", value: "100" },
            { label: "No", value: "0" },
          ],
        },
        {
          name: "amenities",
          label: "Amenity Level",
          type: "select",
          options: [
            { label: "Basic (landscaping only)", value: "50" },
            { label: "Standard (pool, gym)", value: "120" },
            { label: "Premium (pool, gym, concierge, etc.)", value: "250" },
          ],
        },
      ],
      calculate(inputs) {
        const monthlyFee = parseFloat(inputs.monthlyFee as string);
        const water = parseFloat(inputs.includesWater as string);
        const trash = parseFloat(inputs.includesTrash as string);
        const insurance = parseFloat(inputs.includesInsurance as string);
        const amenities = parseFloat(inputs.amenities as string);
        if (isNaN(monthlyFee))
          return { error: "Please enter a valid monthly HOA fee." };

        const totalIncludedValue = water + trash + insurance + amenities;
        const reserveContribution = monthlyFee * 0.25;
        const managementCost = monthlyFee * 0.15;
        const maintenanceValue = monthlyFee - totalIncludedValue - reserveContribution - managementCost;
        const annualFee = monthlyFee * 12;
        const valueRatio = (totalIncludedValue / monthlyFee) * 100;

        const assessment =
          valueRatio > 80
            ? "Excellent value - included services cover most of the fee"
            : valueRatio > 50
            ? "Good value - reasonable for included services"
            : valueRatio > 30
            ? "Average - typical for the amenity level"
            : "Below average - consider what reserves and management provide";

        return {
          results: [
            { label: "Monthly HOA Fee", value: `$${formatNumber(monthlyFee)}` },
            { label: "Included Services Value", value: `$${formatNumber(totalIncludedValue)}/mo` },
            { label: "Est. Reserve Contribution (25%)", value: `$${formatNumber(reserveContribution)}/mo` },
            { label: "Est. Management Cost (15%)", value: `$${formatNumber(managementCost)}/mo` },
            { label: "Annual HOA Cost", value: `$${formatNumber(annualFee)}` },
            { label: "Value Ratio", value: `${formatNumber(valueRatio)}%` },
            { label: "Assessment", value: assessment },
          ],
        };
      },
    },
    {
      slug: "long-term-cost",
      title: "Long-Term HOA Cost Projection",
      fields: [
        {
          name: "currentFee",
          label: "Current Monthly Fee ($)",
          type: "number",
        },
        {
          name: "annualIncrease",
          label: "Expected Annual Increase (%)",
          type: "number",
        },
        {
          name: "years",
          label: "Projection Period",
          type: "select",
          options: [
            { label: "5 Years", value: "5" },
            { label: "10 Years", value: "10" },
            { label: "15 Years", value: "15" },
            { label: "20 Years", value: "20" },
            { label: "30 Years", value: "30" },
          ],
        },
      ],
      calculate(inputs) {
        const currentFee = parseFloat(inputs.currentFee as string);
        const annualIncrease = parseFloat(inputs.annualIncrease as string);
        const years = parseFloat(inputs.years as string);
        if (isNaN(currentFee) || isNaN(annualIncrease) || isNaN(years))
          return { error: "Please enter all values." };

        const rate = annualIncrease / 100;
        let totalPaid = 0;
        let feeAtEnd = currentFee;
        for (let y = 0; y < years; y++) {
          totalPaid += feeAtEnd * 12;
          feeAtEnd = feeAtEnd * (1 + rate);
        }
        const avgMonthly = totalPaid / (years * 12);
        const feeIncrease = feeAtEnd - currentFee;

        return {
          results: [
            { label: "Current Monthly Fee", value: `$${formatNumber(currentFee)}` },
            { label: `Monthly Fee in ${years} Years`, value: `$${formatNumber(feeAtEnd)}` },
            { label: "Fee Increase over Period", value: `$${formatNumber(feeIncrease)}` },
            { label: "Total Paid over Period", value: `$${formatNumber(totalPaid)}` },
            { label: "Average Monthly Cost", value: `$${formatNumber(avgMonthly)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-appraisal-value", "rent-to-income", "title-search-cost"],
  faq: [
    {
      question: "What is a reasonable HOA fee?",
      answer:
        "HOA fees vary widely: $200-$400/month is typical for condos, $100-$300 for townhomes, and $50-$150 for single-family communities. Fees depend on amenities, location, building age, and reserve fund health. Always review the HOA's financial statements and reserve study.",
    },
    {
      question: "What do HOA fees typically cover?",
      answer:
        "Common HOA fee components include common area maintenance, landscaping, property management, insurance (for condos), reserves for future repairs, amenities (pool, gym, clubhouse), trash collection, and sometimes water/sewer. Each HOA allocates differently.",
    },
    {
      question: "Can HOA fees increase and by how much?",
      answer:
        "Yes, HOA fees typically increase 3-5% annually. Most HOAs can raise fees with board approval, though large increases or special assessments may require homeowner votes. Review the HOA's history of fee increases and their reserve study to gauge future increases.",
    },
  ],
  formula:
    "Value Ratio = (Included Services Value / Monthly Fee) x 100 | Future Fee = Current x (1 + Rate)^Years | Total Paid = Sum of monthly fees over projection period",
};

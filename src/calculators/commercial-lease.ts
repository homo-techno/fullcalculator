import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const commercialLeaseCalculator: CalculatorDefinition = {
  slug: "commercial-lease-calculator",
  title: "Commercial Lease Calculator",
  description:
    "Free commercial lease calculator. Compare NNN, gross, and modified gross lease costs. Calculate rent per square foot and total occupancy costs for commercial properties.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "commercial lease calculator",
    "commercial rent calculator",
    "NNN lease calculator",
    "triple net lease calculator",
    "commercial lease cost",
  ],
  variants: [
    {
      id: "nnn",
      name: "NNN (Triple Net) Lease",
      description: "Calculate total cost of a triple net lease",
      fields: [
        { name: "sqft", label: "Leasable Square Footage", type: "number", placeholder: "e.g. 2000", suffix: "sq ft", min: 0 },
        { name: "baseRent", label: "Base Rent (per sq ft / year)", type: "number", placeholder: "e.g. 25", prefix: "$", min: 0, step: 0.01 },
        { name: "cam", label: "CAM Charges (per sq ft / year)", type: "number", placeholder: "e.g. 6", prefix: "$", min: 0, step: 0.01 },
        { name: "propertyTax", label: "Property Tax (per sq ft / year)", type: "number", placeholder: "e.g. 4", prefix: "$", min: 0, step: 0.01 },
        { name: "insurance", label: "Insurance (per sq ft / year)", type: "number", placeholder: "e.g. 2", prefix: "$", min: 0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const base = inputs.baseRent as number;
        const cam = (inputs.cam as number) || 0;
        const tax = (inputs.propertyTax as number) || 0;
        const insurance = (inputs.insurance as number) || 0;
        if (!sqft || !base) return null;

        const totalPerSqft = base + cam + tax + insurance;
        const annualTotal = totalPerSqft * sqft;
        const monthlyTotal = annualTotal / 12;
        const monthlyBase = (base * sqft) / 12;
        const monthlyExtras = monthlyTotal - monthlyBase;

        return {
          primary: { label: "Monthly Total Cost", value: `$${formatNumber(monthlyTotal)}` },
          details: [
            { label: "Monthly base rent", value: `$${formatNumber(monthlyBase)}` },
            { label: "Monthly NNN expenses", value: `$${formatNumber(monthlyExtras)}` },
            { label: "Annual total cost", value: `$${formatNumber(annualTotal)}` },
            { label: "Total per sq ft (annual)", value: `$${formatNumber(totalPerSqft, 2)}` },
            { label: "Base rent / sq ft / year", value: `$${formatNumber(base, 2)}` },
            { label: "NNN charges / sq ft / year", value: `$${formatNumber(cam + tax + insurance, 2)}` },
          ],
          note: "In a NNN lease, the tenant pays base rent plus property tax, insurance, and common area maintenance (CAM) separately.",
        };
      },
    },
    {
      id: "gross",
      name: "Gross Lease",
      description: "Calculate gross lease costs (all-inclusive rent)",
      fields: [
        { name: "sqft", label: "Leasable Square Footage", type: "number", placeholder: "e.g. 2000", suffix: "sq ft", min: 0 },
        { name: "grossRent", label: "Gross Rent (per sq ft / year)", type: "number", placeholder: "e.g. 35", prefix: "$", min: 0, step: 0.01 },
        {
          name: "escalation",
          label: "Annual Escalation",
          type: "select",
          options: [
            { label: "None (0%)", value: "0" },
            { label: "2% per year", value: "2" },
            { label: "3% per year", value: "3" },
            { label: "4% per year", value: "4" },
            { label: "5% per year", value: "5" },
          ],
          defaultValue: "3",
        },
        {
          name: "leaseTerm",
          label: "Lease Term",
          type: "select",
          options: [
            { label: "1 year", value: "1" },
            { label: "3 years", value: "3" },
            { label: "5 years", value: "5" },
            { label: "7 years", value: "7" },
            { label: "10 years", value: "10" },
          ],
          defaultValue: "5",
        },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const grossRent = inputs.grossRent as number;
        const escalation = parseFloat(inputs.escalation as string) || 0;
        const years = parseInt(inputs.leaseTerm as string) || 5;
        if (!sqft || !grossRent) return null;

        const year1Annual = grossRent * sqft;
        const year1Monthly = year1Annual / 12;
        let totalCost = 0;
        let lastYearRent = grossRent;
        for (let i = 0; i < years; i++) {
          const yearRate = grossRent * Math.pow(1 + escalation / 100, i);
          totalCost += yearRate * sqft;
          if (i === years - 1) lastYearRent = yearRate;
        }
        const avgMonthly = totalCost / (years * 12);

        return {
          primary: { label: "Year 1 Monthly Rent", value: `$${formatNumber(year1Monthly)}` },
          details: [
            { label: "Year 1 annual rent", value: `$${formatNumber(year1Annual)}` },
            { label: `Year ${years} monthly rent`, value: `$${formatNumber((lastYearRent * sqft) / 12)}` },
            { label: `Total cost (${years} years)`, value: `$${formatNumber(totalCost)}` },
            { label: "Average monthly cost", value: `$${formatNumber(avgMonthly)}` },
            { label: "Gross rent / sq ft / year", value: `$${formatNumber(grossRent, 2)}` },
            { label: "Annual escalation", value: `${escalation}%` },
          ],
          note: "In a gross lease, the landlord pays property taxes, insurance, and maintenance. Rent is typically higher than a NNN lease but more predictable.",
        };
      },
    },
  ],
  relatedSlugs: ["noi-calculator", "cap-rate-calculator", "rental-income-calculator"],
  faq: [
    {
      question: "What is a NNN (triple net) lease?",
      answer:
        "A NNN lease means the tenant pays base rent plus three additional costs: property taxes, building insurance, and common area maintenance (CAM). Total occupancy cost = base rent + NNN charges. NNN leases are common for retail and commercial properties.",
    },
    {
      question: "What is the difference between gross and NNN leases?",
      answer:
        "In a gross lease, the landlord pays all operating expenses and the rent is all-inclusive. In a NNN lease, the tenant pays base rent plus property tax, insurance, and CAM separately. NNN base rents are lower, but total costs may be similar. Modified gross splits expenses between landlord and tenant.",
    },
    {
      question: "How is commercial rent calculated?",
      answer:
        "Commercial rent is quoted as price per square foot per year. If a 2,000 sq ft space is $25/sq ft/year, annual rent = $50,000 ($4,167/month). Always clarify whether the rate includes NNN charges or is the base only.",
    },
  ],
  formula:
    "NNN Total = (Base Rent + CAM + Tax + Insurance) × Sq Ft | Gross Total = Gross Rent × Sq Ft × (1 + Escalation)^Year",
};

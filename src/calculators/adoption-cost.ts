import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const adoptionCostCalculator: CalculatorDefinition = {
  slug: "adoption-cost-calculator",
  title: "Adoption Cost Estimator",
  description:
    "Estimate adoption costs by pathway. Compare domestic, international, and foster care adoption expenses including agency fees, legal costs, and travel.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "adoption cost",
    "adoption fees",
    "domestic adoption",
    "international adoption",
    "foster care adoption",
  ],
  variants: [
    {
      id: "byPathway",
      name: "By Adoption Pathway",
      description: "Estimate costs based on the type of adoption",
      fields: [
        { name: "pathway", label: "Adoption Pathway", type: "select", options: [
          { label: "Domestic Private Adoption", value: "domestic" },
          { label: "International Adoption", value: "international" },
          { label: "Foster Care Adoption", value: "foster" },
          { label: "Independent/Attorney Adoption", value: "independent" },
        ], defaultValue: "domestic" },
        { name: "agencyFee", label: "Agency/Facilitator Fee ($)", type: "number", placeholder: "e.g. 15000" },
        { name: "legalFees", label: "Legal/Attorney Fees ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "homeStudy", label: "Home Study Fee ($)", type: "number", placeholder: "e.g. 2500", defaultValue: 2500 },
        { name: "travelCosts", label: "Travel Costs ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "documentFees", label: "Document/Filing Fees ($)", type: "number", placeholder: "e.g. 1000", defaultValue: 1000 },
      ],
      calculate: (inputs) => {
        const pathway = inputs.pathway as string;
        const homeStudy = parseFloat(inputs.homeStudy as string) || 0;
        const documentFees = parseFloat(inputs.documentFees as string) || 0;

        const defaults: Record<string, { agency: number; legal: number; travel: number }> = {
          domestic: { agency: 15000, legal: 5000, travel: 2000 },
          international: { agency: 25000, legal: 8000, travel: 8000 },
          foster: { agency: 0, legal: 1500, travel: 500 },
          independent: { agency: 5000, legal: 10000, travel: 2000 },
        };

        const d = defaults[pathway] || defaults.domestic;
        const agencyFee = parseFloat(inputs.agencyFee as string) || d.agency;
        const legalFees = parseFloat(inputs.legalFees as string) || d.legal;
        const travelCosts = parseFloat(inputs.travelCosts as string) || d.travel;

        const totalCost = agencyFee + legalFees + homeStudy + travelCosts + documentFees;
        const taxCredit = Math.min(totalCost, 16810);

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Agency/Facilitator", value: `$${formatNumber(agencyFee, 2)}` },
            { label: "Legal/Attorney", value: `$${formatNumber(legalFees, 2)}` },
            { label: "Home Study", value: `$${formatNumber(homeStudy, 2)}` },
            { label: "Travel", value: `$${formatNumber(travelCosts, 2)}` },
            { label: "Documents/Filing", value: `$${formatNumber(documentFees, 2)}` },
            { label: "Federal Adoption Tax Credit (max)", value: `$${formatNumber(taxCredit, 2)}` },
            { label: "Net Cost After Tax Credit", value: `$${formatNumber(totalCost - taxCredit, 2)}` },
          ],
          note: pathway === "foster" ? "Foster care adoption is often free or very low cost. Many states cover most expenses." : undefined,
        };
      },
    },
    {
      id: "financing",
      name: "Adoption Financing",
      description: "Plan how to finance your adoption",
      fields: [
        { name: "totalCost", label: "Total Adoption Cost ($)", type: "number", placeholder: "e.g. 30000", defaultValue: 30000 },
        { name: "savings", label: "Current Savings ($)", type: "number", placeholder: "e.g. 10000", defaultValue: 10000 },
        { name: "monthlyContribution", label: "Monthly Savings ($)", type: "number", placeholder: "e.g. 500", defaultValue: 500 },
        { name: "grantAmount", label: "Expected Grants ($)", type: "number", placeholder: "e.g. 5000", defaultValue: 0 },
        { name: "loanAmount", label: "Adoption Loan ($)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "loanRate", label: "Loan Interest Rate (%)", type: "number", placeholder: "e.g. 6", defaultValue: 6 },
      ],
      calculate: (inputs) => {
        const totalCost = parseFloat(inputs.totalCost as string) || 0;
        const savings = parseFloat(inputs.savings as string) || 0;
        const monthlyContribution = parseFloat(inputs.monthlyContribution as string) || 0;
        const grantAmount = parseFloat(inputs.grantAmount as string) || 0;
        const loanAmount = parseFloat(inputs.loanAmount as string) || 0;
        const loanRate = parseFloat(inputs.loanRate as string) || 0;

        if (totalCost <= 0) return null;

        const remaining = totalCost - savings - grantAmount - loanAmount;
        const monthsToSave = monthlyContribution > 0 ? Math.ceil(Math.max(0, remaining) / monthlyContribution) : 0;
        const loanInterest5yr = loanAmount > 0 ? loanAmount * (loanRate / 100) * 5 : 0;
        const loanPayment = loanAmount > 0 ? (loanAmount + loanInterest5yr) / 60 : 0;

        return {
          primary: { label: "Remaining to Fund", value: `$${formatNumber(Math.max(0, remaining), 2)}` },
          details: [
            { label: "Total Adoption Cost", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Current Savings", value: `$${formatNumber(savings, 2)}` },
            { label: "Expected Grants", value: `$${formatNumber(grantAmount, 2)}` },
            { label: "Loan Amount", value: `$${formatNumber(loanAmount, 2)}` },
            { label: "Months to Save Remainder", value: monthlyContribution > 0 ? formatNumber(monthsToSave, 0) : "N/A" },
            { label: "Est. Monthly Loan Payment (5yr)", value: loanAmount > 0 ? `$${formatNumber(loanPayment, 2)}` : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["baby-first-year-cost-calculator", "budget-calculator", "loan-calculator"],
  faq: [
    {
      question: "How much does adoption cost?",
      answer:
        "Costs vary widely: Foster care adoption is typically $0-$2,500, domestic private adoption runs $20,000-$50,000, and international adoption costs $25,000-$55,000. Independent adoptions fall between $15,000-$40,000.",
    },
    {
      question: "Is there financial help for adoption?",
      answer:
        "Yes. The federal adoption tax credit (up to ~$16,810) helps offset costs. Many employers offer adoption assistance benefits. Adoption grants from organizations like the Dave Thomas Foundation can provide $2,000-$15,000. Low-interest adoption loans are also available.",
    },
    {
      question: "Why is foster care adoption so much cheaper?",
      answer:
        "The government subsidizes foster care adoption because these children are already in state custody. Most legal fees, home study costs, and training are covered by the state. Some foster-adopt families also receive monthly subsidies.",
    },
  ],
  formula:
    "Total Cost = Agency Fee + Legal Fees + Home Study + Travel + Document Fees; Net Cost = Total - Tax Credit - Grants",
};

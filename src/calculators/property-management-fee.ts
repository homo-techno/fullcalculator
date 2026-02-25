import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const propertyManagementFeeCalculator: CalculatorDefinition = {
  slug: "property-management-fee-calculator",
  title: "Property Management Fee Calculator",
  description:
    "Free property management fee calculator. Calculate property management costs, compare fee structures, and understand the impact on your rental returns.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "property management fee",
    "property manager cost",
    "rental management fee calculator",
    "property management rates",
    "landlord management costs",
  ],
  variants: [
    {
      id: "fee-estimate",
      name: "Fee Estimate",
      description: "Calculate total property management fees",
      fields: [
        {
          name: "monthlyRent",
          label: "Monthly Rent",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          min: 0,
        },
        {
          name: "managementFeeRate",
          label: "Management Fee Rate",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.1,
          defaultValue: 10,
        },
        {
          name: "leaseUpFee",
          label: "Lease-Up / Placement Fee",
          type: "select",
          options: [
            { label: "No fee", value: "0" },
            { label: "50% of 1 month rent", value: "50" },
            { label: "75% of 1 month rent", value: "75" },
            { label: "100% of 1 month rent", value: "100" },
          ],
          defaultValue: "50",
        },
        {
          name: "turnoversPerYear",
          label: "Expected Turnovers Per Year",
          type: "select",
          options: [
            { label: "0 (stable tenant)", value: "0" },
            { label: "1 turnover", value: "1" },
            { label: "2 turnovers", value: "2" },
          ],
          defaultValue: "1",
        },
        {
          name: "maintenanceMarkup",
          label: "Maintenance Markup",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "%",
          min: 0,
          max: 50,
          step: 1,
          defaultValue: 10,
        },
        {
          name: "annualMaintenance",
          label: "Estimated Annual Maintenance",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const rent = inputs.monthlyRent as number;
        const feeRate = (inputs.managementFeeRate as number) || 10;
        const leaseUpPct = parseInt(inputs.leaseUpFee as string) || 0;
        const turnovers = parseInt(inputs.turnoversPerYear as string) || 0;
        const maintMarkup = (inputs.maintenanceMarkup as number) || 0;
        const annualMaint = (inputs.annualMaintenance as number) || 0;
        if (!rent) return null;

        const monthlyFee = rent * (feeRate / 100);
        const annualMgmtFee = monthlyFee * 12;
        const leaseUpCost = (rent * (leaseUpPct / 100)) * turnovers;
        const maintMarkupCost = annualMaint * (maintMarkup / 100);
        const totalAnnualCost = annualMgmtFee + leaseUpCost + maintMarkupCost;
        const effectiveRate = (totalAnnualCost / (rent * 12)) * 100;

        return {
          primary: {
            label: "Total Annual Management Cost",
            value: `$${formatNumber(totalAnnualCost)}`,
          },
          details: [
            { label: "Monthly management fee", value: `$${formatNumber(monthlyFee)}` },
            { label: "Annual management fees", value: `$${formatNumber(annualMgmtFee)}` },
            { label: "Lease-up fees per year", value: `$${formatNumber(leaseUpCost)}` },
            { label: "Maintenance markup cost", value: `$${formatNumber(maintMarkupCost)}` },
            { label: "Effective total rate", value: `${formatNumber(effectiveRate)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rental-cash-flow-calculator", "investment-property-calculator", "airbnb-income-calculator"],
  faq: [
    {
      question: "What is a typical property management fee?",
      answer:
        "Property management fees typically range from 8-12% of monthly rent for long-term rentals. Short-term vacation rentals may charge 20-30%. Additional fees include lease-up fees (50-100% of first month rent), maintenance markups (10-20%), and eviction fees.",
    },
    {
      question: "Is property management worth the cost?",
      answer:
        "Property management is worth it if you value your time, own multiple properties, live far from your rental, or lack landlord experience. The cost reduces your returns but saves time, reduces legal risk, and often results in better tenant screening and lower vacancy.",
    },
    {
      question: "What does a property manager do?",
      answer:
        "Property managers handle tenant screening, rent collection, maintenance coordination, lease enforcement, financial reporting, legal compliance, and eviction proceedings. Full-service managers handle all aspects of property operations.",
    },
  ],
  formula: "Total Cost = (Monthly Rent x Fee Rate x 12) + Lease-Up Fees + Maintenance Markup",
};

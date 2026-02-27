import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evTaxCreditCalculator: CalculatorDefinition = {
  slug: "ev-tax-credit-calculator",
  title: "EV Tax Credit Calculator",
  description:
    "Calculate your federal and state electric vehicle tax credit eligibility. Determine how much you can save on a new or used EV purchase based on IRA guidelines.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ev tax credit",
    "federal ev credit",
    "electric vehicle incentive",
    "ira ev credit",
    "7500 tax credit",
    "ev rebate",
    "clean vehicle credit",
  ],
  variants: [
    {
      id: "newVehicle",
      name: "New EV Credit (30D)",
      description: "Federal clean vehicle credit for new EVs up to $7,500",
      fields: [
        { name: "vehicleMsrp", label: "Vehicle MSRP ($)", type: "number", placeholder: "e.g. 45000" },
        {
          name: "vehicleType",
          label: "Vehicle Type",
          type: "select",
          options: [
            { label: "Sedan/Hatchback/Wagon", value: "sedan" },
            { label: "SUV/Crossover/Van", value: "suv" },
            { label: "Pickup Truck", value: "truck" },
          ],
          defaultValue: "sedan",
        },
        {
          name: "filingStatus",
          label: "Tax Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Head of Household", value: "hoh" },
          ],
          defaultValue: "single",
        },
        { name: "agi", label: "Modified Adjusted Gross Income ($)", type: "number", placeholder: "e.g. 100000" },
        { name: "federalTaxLiability", label: "Federal Tax Liability ($)", type: "number", placeholder: "e.g. 8000" },
        {
          name: "batteryRequirements",
          label: "Battery Component Requirements Met?",
          type: "select",
          options: [
            { label: "Both (critical minerals + battery components)", value: "both" },
            { label: "Critical minerals only", value: "minerals" },
            { label: "Battery components only", value: "components" },
            { label: "Neither / Unknown", value: "neither" },
          ],
          defaultValue: "both",
        },
        { name: "stateCredit", label: "State/Local EV Incentive ($)", type: "number", placeholder: "e.g. 2000" },
      ],
      calculate: (inputs) => {
        const vehicleMsrp = parseFloat(inputs.vehicleMsrp as string);
        const vehicleType = inputs.vehicleType as string;
        const filingStatus = inputs.filingStatus as string;
        const agi = parseFloat(inputs.agi as string);
        const federalTaxLiability = parseFloat(inputs.federalTaxLiability as string);
        const batteryReqs = inputs.batteryRequirements as string;
        const stateCredit = parseFloat(inputs.stateCredit as string) || 0;

        if (!vehicleMsrp || !agi || !federalTaxLiability) return null;

        const msrpLimits: Record<string, number> = { sedan: 55000, suv: 80000, truck: 80000 };
        const msrpLimit = msrpLimits[vehicleType] || 55000;
        const msrpEligible = vehicleMsrp <= msrpLimit;

        const incomeLimits: Record<string, number> = { single: 150000, married: 300000, hoh: 225000 };
        const incomeLimit = incomeLimits[filingStatus] || 150000;
        const incomeEligible = agi <= incomeLimit;

        let federalCredit = 0;
        if (msrpEligible && incomeEligible) {
          if (batteryReqs === "both") federalCredit = 7500;
          else if (batteryReqs === "minerals" || batteryReqs === "components") federalCredit = 3750;
          else federalCredit = 0;
        }

        const usableCredit = Math.min(federalCredit, federalTaxLiability);
        const totalSavings = usableCredit + stateCredit;
        const effectivePrice = vehicleMsrp - totalSavings;

        return {
          primary: {
            label: "Total EV Incentives",
            value: `$${formatNumber(totalSavings, 2)}`,
          },
          details: [
            { label: "Federal Credit Eligible", value: msrpEligible && incomeEligible ? "Yes" : "No" },
            { label: "Max Federal Credit", value: `$${formatNumber(federalCredit, 2)}` },
            { label: "Usable Federal Credit", value: `$${formatNumber(usableCredit, 2)}` },
            { label: "State/Local Incentive", value: `$${formatNumber(stateCredit, 2)}` },
            { label: "MSRP Limit for Type", value: `$${formatNumber(msrpLimit, 0)}` },
            { label: "Income Limit", value: `$${formatNumber(incomeLimit, 0)}` },
            { label: "Effective Purchase Price", value: `$${formatNumber(effectivePrice, 2)}` },
          ],
          note: !msrpEligible
            ? `Vehicle MSRP exceeds the $${formatNumber(msrpLimit, 0)} limit for this vehicle type.`
            : !incomeEligible
              ? `Your income exceeds the $${formatNumber(incomeLimit, 0)} limit for ${filingStatus} filers.`
              : federalCredit < 7500
                ? "Partial credit: vehicle may not meet all battery sourcing requirements."
                : "You qualify for the full federal EV tax credit. Starting 2024, this can be taken as a point-of-sale discount.",
        };
      },
    },
    {
      id: "usedVehicle",
      name: "Used EV Credit (25E)",
      description: "Up to $4,000 credit for qualifying used EVs",
      fields: [
        { name: "purchasePrice", label: "Used EV Purchase Price ($)", type: "number", placeholder: "e.g. 20000" },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Head of Household", value: "hoh" },
          ],
          defaultValue: "single",
        },
        { name: "agi", label: "Modified AGI ($)", type: "number", placeholder: "e.g. 60000" },
        { name: "federalTax", label: "Federal Tax Liability ($)", type: "number", placeholder: "e.g. 3000" },
      ],
      calculate: (inputs) => {
        const purchasePrice = parseFloat(inputs.purchasePrice as string);
        const filingStatus = inputs.filingStatus as string;
        const agi = parseFloat(inputs.agi as string);
        const federalTax = parseFloat(inputs.federalTax as string);

        if (!purchasePrice || !agi || !federalTax) return null;

        const priceEligible = purchasePrice <= 25000;
        const incomeLimits: Record<string, number> = { single: 75000, married: 150000, hoh: 112500 };
        const incomeLimit = incomeLimits[filingStatus] || 75000;
        const incomeEligible = agi <= incomeLimit;

        const maxCredit = Math.min(4000, purchasePrice * 0.30);
        const credit = priceEligible && incomeEligible ? Math.min(maxCredit, federalTax) : 0;

        return {
          primary: { label: "Used EV Tax Credit", value: `$${formatNumber(credit, 2)}` },
          details: [
            { label: "Price Eligible (≤$25,000)", value: priceEligible ? "Yes" : "No" },
            { label: "Income Eligible", value: incomeEligible ? "Yes" : "No" },
            { label: "Credit (30% of price, max $4,000)", value: `$${formatNumber(maxCredit, 2)}` },
            { label: "Effective Price After Credit", value: `$${formatNumber(purchasePrice - credit, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ev-lease-vs-buy-calculator", "ev-vs-gas-total-cost-calculator", "solar-tax-credit-calculator"],
  faq: [
    {
      question: "How does the federal EV tax credit work in 2024+?",
      answer:
        "The Inflation Reduction Act provides up to $7,500 for new EVs and $4,000 for used EVs. The new vehicle credit has two $3,750 components based on battery mineral sourcing and manufacturing. Starting in 2024, buyers can transfer the credit to the dealer for an instant discount at point of sale.",
    },
    {
      question: "What are the income limits for the EV tax credit?",
      answer:
        "For new EVs: $150,000 (single), $225,000 (head of household), $300,000 (married filing jointly). For used EVs: $75,000 (single), $112,500 (HOH), $150,000 (MFJ). These are based on modified adjusted gross income from the current or prior year.",
    },
    {
      question: "Can I get the EV tax credit if I don't owe enough taxes?",
      answer:
        "The credit is non-refundable, meaning it can only reduce your tax liability to zero but won't generate a refund. However, starting in 2024, you can transfer the credit to the dealer at purchase, effectively getting the discount regardless of your tax situation.",
    },
  ],
  formula:
    "New EV Credit = $3,750 (critical minerals) + $3,750 (battery components) if MSRP ≤ limit and AGI ≤ income limit; Used EV Credit = min($4,000, 30% × Purchase Price) if price ≤ $25,000 and AGI ≤ limit",
};

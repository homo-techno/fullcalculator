import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mileageReimbursementCalculator: CalculatorDefinition = {
  slug: "mileage-reimbursement-calculator",
  title: "Mileage Reimbursement Calculator",
  description: "Free mileage reimbursement calculator. Calculate IRS standard mileage rate reimbursement for business, medical, and charitable driving.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mileage reimbursement calculator", "IRS mileage rate", "mileage calculator", "business mileage", "mileage deduction calculator"],
  variants: [
    {
      id: "single",
      name: "Single Trip",
      description: "Calculate mileage reimbursement for a single trip",
      fields: [
        { name: "miles", label: "Total Miles Driven", type: "number", placeholder: "e.g. 150", step: 0.1 },
        { name: "purpose", label: "Purpose", type: "select", options: [
          { label: "Business (70 cents/mile - 2025)", value: "0.70" },
          { label: "Medical/Moving (21 cents/mile - 2025)", value: "0.21" },
          { label: "Charitable (14 cents/mile)", value: "0.14" },
          { label: "Custom Rate", value: "custom" },
        ], defaultValue: "0.70" },
        { name: "customRate", label: "Custom Rate ($/mile, if selected)", type: "number", placeholder: "e.g. 0.655", prefix: "$", step: 0.001 },
      ],
      calculate: (inputs) => {
        const miles = inputs.miles as number;
        const purpose = inputs.purpose as string;
        const customRate = inputs.customRate as number;
        if (!miles) return null;
        const rate = purpose === "custom" ? (customRate || 0) : parseFloat(purpose);
        if (!rate) return null;
        const reimbursement = miles * rate;
        return {
          primary: { label: "Mileage Reimbursement", value: `$${formatNumber(reimbursement)}` },
          details: [
            { label: "Miles Driven", value: formatNumber(miles, 1) },
            { label: "Rate per Mile", value: `$${formatNumber(rate, 3)}` },
            { label: "Round Trip Reimbursement", value: `$${formatNumber(reimbursement * 2)}` },
          ],
        };
      },
    },
    {
      id: "annual",
      name: "Annual Mileage",
      description: "Calculate annual mileage reimbursement or deduction",
      fields: [
        { name: "weeklyMiles", label: "Average Weekly Miles", type: "number", placeholder: "e.g. 200" },
        { name: "weeksPerYear", label: "Working Weeks per Year", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "ratePerMile", label: "Rate per Mile", type: "number", placeholder: "e.g. 0.70", prefix: "$", step: 0.001, defaultValue: 0.70 },
      ],
      calculate: (inputs) => {
        const weeklyMiles = inputs.weeklyMiles as number;
        const weeks = (inputs.weeksPerYear as number) || 50;
        const rate = inputs.ratePerMile as number;
        if (!weeklyMiles || !rate) return null;
        const annualMiles = weeklyMiles * weeks;
        const annualReimbursement = annualMiles * rate;
        const monthlyReimbursement = annualReimbursement / 12;
        return {
          primary: { label: "Annual Reimbursement", value: `$${formatNumber(annualReimbursement)}` },
          details: [
            { label: "Annual Miles", value: formatNumber(annualMiles, 0) },
            { label: "Monthly Reimbursement", value: `$${formatNumber(monthlyReimbursement)}` },
            { label: "Weekly Reimbursement", value: `$${formatNumber(weeklyMiles * rate)}` },
            { label: "Rate per Mile", value: `$${formatNumber(rate, 3)}` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Standard vs Actual",
      description: "Compare IRS standard mileage rate vs actual vehicle expense method",
      fields: [
        { name: "annualMiles", label: "Annual Business Miles", type: "number", placeholder: "e.g. 12000" },
        { name: "irsRate", label: "IRS Standard Rate", type: "number", placeholder: "e.g. 0.70", prefix: "$", step: 0.001, defaultValue: 0.70 },
        { name: "gasExpenses", label: "Annual Gas/Fuel Cost", type: "number", placeholder: "e.g. 3000", prefix: "$" },
        { name: "insuranceCost", label: "Annual Insurance (business %)", type: "number", placeholder: "e.g. 1200", prefix: "$" },
        { name: "maintenanceCost", label: "Annual Maintenance & Repairs", type: "number", placeholder: "e.g. 800", prefix: "$" },
        { name: "depreciation", label: "Annual Depreciation", type: "number", placeholder: "e.g. 3000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const miles = inputs.annualMiles as number;
        const rate = inputs.irsRate as number;
        if (!miles || !rate) return null;
        const standardDeduction = miles * rate;
        const gas = (inputs.gasExpenses as number) || 0;
        const insurance = (inputs.insuranceCost as number) || 0;
        const maintenance = (inputs.maintenanceCost as number) || 0;
        const depreciation = (inputs.depreciation as number) || 0;
        const actualExpenses = gas + insurance + maintenance + depreciation;
        const difference = standardDeduction - actualExpenses;
        const betterMethod = difference >= 0 ? "Standard Mileage Rate" : "Actual Expense Method";
        return {
          primary: { label: "Better Method", value: betterMethod, suffix: `by $${formatNumber(Math.abs(difference))}` },
          details: [
            { label: "Standard Mileage Deduction", value: `$${formatNumber(standardDeduction)}` },
            { label: "Actual Expenses Total", value: `$${formatNumber(actualExpenses)}` },
            { label: "Cost per Mile (actual)", value: `$${formatNumber(actualExpenses / miles, 3)}` },
            { label: "Cost per Mile (standard)", value: `$${formatNumber(rate, 3)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["per-diem-calculator", "employee-cost-calculator", "salary-calculator"],
  faq: [
    { question: "What is the IRS mileage rate for 2025?", answer: "For 2025, the IRS standard mileage rate is 70 cents per mile for business use, 21 cents per mile for medical or moving purposes, and 14 cents per mile for charitable purposes. These rates are updated annually." },
    { question: "What counts as business mileage?", answer: "Business mileage includes driving from one work location to another, visiting clients, traveling to a temporary work location, or driving for business errands. Commuting from home to your regular office does NOT qualify." },
    { question: "Standard mileage vs actual expenses - which is better?", answer: "The standard mileage rate is simpler and often better for newer, fuel-efficient cars. Actual expenses method may be better if you have an expensive vehicle with high maintenance, insurance, or depreciation. You can calculate both and choose the higher deduction." },
  ],
  formula: "Reimbursement = Miles × Rate per Mile | IRS Standard Rate (2025): Business $0.70/mile, Medical $0.21/mile, Charity $0.14/mile",
};

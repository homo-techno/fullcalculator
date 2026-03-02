import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carSubscriptionVsOwnershipCalculator: CalculatorDefinition = {
  slug: "car-subscription-vs-ownership-calculator",
  title: "Car Subscription vs Ownership Calculator",
  description: "Compare the total monthly cost of a car subscription service against traditional vehicle ownership including loan payments, insurance, and maintenance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["car subscription","car subscription vs buying","vehicle subscription cost","car ownership cost comparison"],
  variants: [{
    id: "standard",
    name: "Car Subscription vs Ownership",
    description: "Compare the total monthly cost of a car subscription service against traditional vehicle ownership including loan payments, insurance, and maintenance.",
    fields: [
      { name: "subscriptionMonthly", label: "Monthly Subscription Fee ($)", type: "number", min: 200, max: 3000, defaultValue: 600 },
      { name: "loanPayment", label: "Monthly Loan Payment ($)", type: "number", min: 0, max: 2000, defaultValue: 450 },
      { name: "insuranceCost", label: "Monthly Insurance ($)", type: "number", min: 50, max: 500, defaultValue: 150 },
      { name: "maintenanceCost", label: "Monthly Maintenance Avg ($)", type: "number", min: 20, max: 300, defaultValue: 80 },
      { name: "depreciationMonthly", label: "Monthly Depreciation ($)", type: "number", min: 50, max: 1000, defaultValue: 250 },
      { name: "comparisonMonths", label: "Comparison Period (months)", type: "number", min: 6, max: 60, defaultValue: 24 },
    ],
    calculate: (inputs) => {
    const subscription = inputs.subscriptionMonthly as number;
    const loan = inputs.loanPayment as number;
    const insurance = inputs.insuranceCost as number;
    const maintenance = inputs.maintenanceCost as number;
    const depreciation = inputs.depreciationMonthly as number;
    const months = inputs.comparisonMonths as number;
    const ownershipMonthly = loan + insurance + maintenance + depreciation;
    const subscriptionTotal = subscription * months;
    const ownershipTotal = ownershipMonthly * months;
    const difference = subscriptionTotal - ownershipTotal;
    const subscriptionIncludes = "Insurance, maintenance, and depreciation included";
    return {
      primary: { label: "Monthly Cost Difference", value: "$" + formatNumber(Math.round(Math.abs(difference / months))) + (difference > 0 ? " (ownership cheaper)" : " (subscription cheaper)") },
      details: [
        { label: "Subscription Monthly", value: "$" + formatNumber(subscription) },
        { label: "Ownership Monthly", value: "$" + formatNumber(Math.round(ownershipMonthly)) },
        { label: "Subscription Total (" + months + " mo)", value: "$" + formatNumber(subscriptionTotal) },
        { label: "Ownership Total (" + months + " mo)", value: "$" + formatNumber(Math.round(ownershipTotal)) },
        { label: "Subscription Benefit", value: subscriptionIncludes },
        { label: "Better Option", value: difference > 0 ? "Ownership" : "Subscription" }
      ]
    };
  },
  }],
  relatedSlugs: ["car-loan-refinance-calculator","car-depreciation-curve-calculator"],
  faq: [
    { question: "What is a car subscription?", answer: "A car subscription is an all-inclusive monthly fee that covers the vehicle, insurance, maintenance, and roadside assistance. You can typically swap vehicles or cancel with short notice." },
    { question: "Is a car subscription worth it?", answer: "Subscriptions offer flexibility and convenience but typically cost more than ownership for long-term use. They are ideal for people who want to change cars frequently or avoid long-term commitments." },
    { question: "What does a car subscription include?", answer: "Most subscriptions include the vehicle, insurance, scheduled maintenance, roadside assistance, and sometimes registration fees. Fuel and tolls are typically not included." },
  ],
  formula: "Ownership Monthly = Loan + Insurance + Maintenance + Depreciation
Subscription Total = Monthly Fee x Months
Ownership Total = Ownership Monthly x Months
Difference = Subscription Total - Ownership Total",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carTotalCostCalculator: CalculatorDefinition = {
  slug: "car-total-cost-calculator",
  title: "Total Cost of Car Ownership",
  description: "Free total cost of car ownership calculator. Estimate the true cost of owning a car including payments, insurance, fuel, and maintenance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["total cost of ownership car", "true cost of car", "car ownership cost", "vehicle total cost", "cost to own a car"],
  variants: [
    {
      id: "total",
      name: "Total Ownership Cost",
      description: "Calculate all costs of owning a car over time",
      fields: [
        { name: "monthlyPayment", label: "Monthly Car Payment", type: "number", placeholder: "e.g. 450", prefix: "$" },
        { name: "insurance", label: "Monthly Insurance", type: "number", placeholder: "e.g. 150", prefix: "$" },
        { name: "fuelMonthly", label: "Monthly Fuel Cost", type: "number", placeholder: "e.g. 200", prefix: "$" },
        { name: "maintenanceMonthly", label: "Monthly Maintenance", type: "number", placeholder: "e.g. 80", prefix: "$" },
        { name: "registration", label: "Annual Registration/Tax", type: "number", placeholder: "e.g. 300", prefix: "$" },
        { name: "parking", label: "Monthly Parking", type: "number", placeholder: "e.g. 0", prefix: "$" },
        { name: "years", label: "Ownership Period", type: "number", placeholder: "e.g. 5", suffix: "years" },
      ],
      calculate: (inputs) => {
        const payment = (inputs.monthlyPayment as number) || 0;
        const insurance = (inputs.insurance as number) || 0;
        const fuel = (inputs.fuelMonthly as number) || 0;
        const maintenance = (inputs.maintenanceMonthly as number) || 0;
        const registration = (inputs.registration as number) || 0;
        const parking = (inputs.parking as number) || 0;
        const years = (inputs.years as number) || 5;

        const months = years * 12;
        const monthlyTotal = payment + insurance + fuel + maintenance + parking + registration / 12;
        const annualTotal = monthlyTotal * 12;
        const totalCost = monthlyTotal * months;
        const dailyCost = annualTotal / 365;

        return {
          primary: { label: "Monthly Total Cost", value: `$${formatNumber(monthlyTotal)}` },
          details: [
            { label: "Annual total", value: `$${formatNumber(annualTotal)}` },
            { label: "Daily cost", value: `$${formatNumber(dailyCost)}` },
            { label: `Total over ${years} years`, value: `$${formatNumber(totalCost)}` },
            { label: "Payments total", value: `$${formatNumber(payment * months)}` },
            { label: "Insurance total", value: `$${formatNumber(insurance * months)}` },
            { label: "Fuel total", value: `$${formatNumber(fuel * months)}` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Compare Two Vehicles",
      description: "Compare total ownership cost of two vehicles",
      fields: [
        { name: "payment1", label: "Car 1 Monthly Payment", type: "number", placeholder: "e.g. 450", prefix: "$" },
        { name: "running1", label: "Car 1 Monthly Running Cost", type: "number", placeholder: "e.g. 400", prefix: "$" },
        { name: "payment2", label: "Car 2 Monthly Payment", type: "number", placeholder: "e.g. 350", prefix: "$" },
        { name: "running2", label: "Car 2 Monthly Running Cost", type: "number", placeholder: "e.g. 500", prefix: "$" },
        { name: "years", label: "Comparison Period", type: "number", placeholder: "e.g. 5", suffix: "years" },
      ],
      calculate: (inputs) => {
        const pay1 = (inputs.payment1 as number) || 0;
        const run1 = (inputs.running1 as number) || 0;
        const pay2 = (inputs.payment2 as number) || 0;
        const run2 = (inputs.running2 as number) || 0;
        const years = (inputs.years as number) || 5;

        const months = years * 12;
        const total1 = (pay1 + run1) * months;
        const total2 = (pay2 + run2) * months;
        const diff = Math.abs(total1 - total2);
        const cheaper = total1 < total2 ? "Car 1" : "Car 2";

        return {
          primary: { label: "Savings with Cheaper Car", value: `$${formatNumber(diff)}` },
          details: [
            { label: `Car 1 total (${years} yr)`, value: `$${formatNumber(total1)}` },
            { label: `Car 2 total (${years} yr)`, value: `$${formatNumber(total2)}` },
            { label: "Cheaper option", value: cheaper },
            { label: "Monthly savings", value: `$${formatNumber(diff / months)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-loan-calculator", "fuel-cost-calculator", "car-maintenance-cost-calculator"],
  faq: [
    { question: "What is the true cost of owning a car?", answer: "The average total cost of car ownership is $700-$1,000+ per month including loan payment, insurance, fuel, maintenance, registration, and depreciation. Over 5 years, this can total $40,000-$60,000." },
    { question: "What costs are often forgotten in car ownership?", answer: "Commonly overlooked costs include depreciation, parking fees, tolls, car washes, tire replacement, registration renewal, and opportunity cost of the down payment." },
  ],
  formula: "Monthly Total = Payment + Insurance + Fuel + Maintenance + Parking + (Registration / 12)",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wegovyCostCalculator: CalculatorDefinition = {
  slug: "wegovy-cost-calculator",
  title: "Wegovy Cost Calculator",
  description:
    "Estimate the cost of Wegovy (semaglutide 2.4mg) treatment with and without insurance. Compare monthly and annual costs including titration period.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "wegovy cost",
    "wegovy price",
    "semaglutide cost",
    "wegovy insurance",
    "wegovy without insurance",
    "wegovy savings",
  ],
  variants: [
    {
      id: "withInsurance",
      name: "With Insurance",
      description: "Estimate Wegovy cost with insurance coverage",
      fields: [
        {
          name: "copayType",
          label: "Copay Type",
          type: "select",
          options: [
            { label: "Fixed copay", value: "fixed" },
            { label: "Coinsurance (%)", value: "coinsurance" },
          ],
          defaultValue: "fixed",
        },
        {
          name: "copayAmount",
          label: "Copay / Coinsurance Amount",
          type: "number",
          placeholder: "e.g. 25 (dollars or %)",
          min: 0,
          max: 2000,
        },
        {
          name: "months",
          label: "Treatment Duration",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "months",
          min: 1,
          max: 60,
        },
        {
          name: "hasSavingsCard",
          label: "Manufacturer Savings Card",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
          defaultValue: "no",
        },
      ],
      calculate: (inputs) => {
        const copayType = inputs.copayType as string;
        const copayAmount = parseFloat(inputs.copayAmount as string);
        const months = parseFloat(inputs.months as string);
        const hasSavingsCard = inputs.hasSavingsCard as string;
        if (isNaN(copayAmount) || !months) return null;

        const listPrice = 1349.02; // Monthly list price
        let monthlyCost: number;

        if (copayType === "fixed") {
          monthlyCost = copayAmount;
        } else {
          monthlyCost = listPrice * (copayAmount / 100);
        }

        // Savings card can reduce copay (up to certain limits)
        if (hasSavingsCard === "yes" && monthlyCost > 0) {
          monthlyCost = Math.max(0, monthlyCost - 225);
        }

        const totalCost = monthlyCost * months;
        const annualCost = monthlyCost * 12;
        const vsOutOfPocket = listPrice * months - totalCost;

        return {
          primary: { label: "Monthly Cost", value: `$${formatNumber(monthlyCost, 2)}` },
          details: [
            { label: "Total Cost", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Annualized Cost", value: `$${formatNumber(annualCost, 2)}` },
            { label: "Savings vs. Cash Price", value: `$${formatNumber(vsOutOfPocket, 2)}` },
            { label: "List Price (reference)", value: `$${formatNumber(listPrice, 2)}/mo` },
          ],
          note: "Costs are estimates based on typical insurance structures. Actual costs depend on your specific plan, deductible status, and formulary. Savings card eligibility varies.",
        };
      },
    },
    {
      id: "withoutInsurance",
      name: "Without Insurance",
      description: "Estimate out-of-pocket Wegovy costs",
      fields: [
        {
          name: "source",
          label: "Purchase Source",
          type: "select",
          options: [
            { label: "Retail pharmacy (brand)", value: "retail" },
            { label: "Mail-order pharmacy", value: "mail" },
            { label: "Manufacturer savings program", value: "savings" },
          ],
          defaultValue: "retail",
        },
        {
          name: "months",
          label: "Treatment Duration",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "months",
          min: 1,
          max: 60,
        },
      ],
      calculate: (inputs) => {
        const source = inputs.source as string;
        const months = parseFloat(inputs.months as string);
        if (!months) return null;

        const prices: Record<string, number> = {
          retail: 1349.02,
          mail: 1250.00,
          savings: 500.00,
        };

        const monthlyCost = prices[source] || 1349.02;
        const totalCost = monthlyCost * months;
        const annualCost = monthlyCost * 12;

        return {
          primary: { label: "Monthly Cost", value: `$${formatNumber(monthlyCost, 2)}` },
          details: [
            { label: "Total Cost", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Annual Cost", value: `$${formatNumber(annualCost, 2)}` },
            { label: "Weekly Cost", value: `$${formatNumber(monthlyCost / 4.33, 2)}` },
            { label: "Daily Cost", value: `$${formatNumber(monthlyCost / 30, 2)}` },
          ],
          note: "Prices reflect approximate 2024-2025 retail costs. Manufacturer savings programs have eligibility requirements. Prices may vary by pharmacy and region.",
        };
      },
    },
  ],
  relatedSlugs: ["glp1-weight-loss-calculator", "semaglutide-savings-calculator", "mounjaro-dosage-calculator"],
  faq: [
    {
      question: "How much does Wegovy cost per month?",
      answer:
        "Wegovy's list price is approximately $1,349 per month without insurance. With insurance, costs vary widely from $0-$500 depending on your plan. Manufacturer savings cards may reduce copays for eligible patients with commercial insurance.",
    },
    {
      question: "Does insurance cover Wegovy?",
      answer:
        "Many commercial insurance plans cover Wegovy for weight management when BMI criteria are met (typically BMI >= 30 or >= 27 with comorbidities). Medicare Part D began covering Wegovy in 2025 for certain indications. Check your specific formulary.",
    },
    {
      question: "Are there cheaper alternatives to Wegovy?",
      answer:
        "Compounded semaglutide has been available at lower cost, though FDA regulations around compounding may change. Some patients use Ozempic off-label (lower dose, different indication). Generic semaglutide is not yet available. Always consult your doctor before switching medications.",
    },
  ],
  formula:
    "Monthly Cost (Insurance) = Copay or (List Price x Coinsurance%) - Savings Card | Total = Monthly x Months",
};

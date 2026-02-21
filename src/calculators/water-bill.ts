import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterBillCalculator: CalculatorDefinition = {
  slug: "water-bill-calculator",
  title: "Water Bill Calculator",
  description: "Free water bill calculator. Estimate your monthly water bill based on daily usage in gallons and your local water rate.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["water bill calculator", "water cost calculator", "monthly water bill", "water usage calculator", "water bill estimator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Water Bill",
      description: "Estimate your monthly water cost",
      fields: [
        { name: "dailyGallons", label: "Daily Usage (gallons)", type: "number", placeholder: "e.g. 80" },
        { name: "rate", label: "Rate ($ per 1,000 gallons)", type: "number", placeholder: "e.g. 5.00", step: 0.01 },
        { name: "baseCharge", label: "Monthly Base/Service Charge ($)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
      ],
      calculate: (inputs) => {
        const dailyGallons = inputs.dailyGallons as number;
        const rate = inputs.rate as number;
        const baseCharge = (inputs.baseCharge as number) || 0;
        if (!dailyGallons || !rate) return null;

        const monthlyGallons = dailyGallons * 30;
        const annualGallons = dailyGallons * 365;
        const monthlyUsageCost = (monthlyGallons / 1000) * rate;
        const monthlyTotal = monthlyUsageCost + baseCharge;
        const annualTotal = monthlyTotal * 12;

        // Sewer is often billed at 90-100% of water usage
        const estimatedSewerMonthly = monthlyUsageCost * 0.95;
        const totalWithSewer = monthlyTotal + estimatedSewerMonthly;

        // Usage breakdown tips
        const avgPersonDaily = 80; // gallons
        const householdSize = Math.round(dailyGallons / avgPersonDaily);

        return {
          primary: { label: "Monthly Water Bill", value: `$${formatNumber(monthlyTotal, 2)}` },
          details: [
            { label: "Daily usage", value: `${formatNumber(dailyGallons)} gallons` },
            { label: "Monthly usage", value: `${formatNumber(monthlyGallons)} gallons` },
            { label: "Annual usage", value: `${formatNumber(annualGallons)} gallons` },
            { label: "Usage charge", value: `$${formatNumber(monthlyUsageCost, 2)}` },
            { label: "Base/service charge", value: `$${formatNumber(baseCharge, 2)}` },
            { label: "Monthly water bill", value: `$${formatNumber(monthlyTotal, 2)}` },
            { label: "Est. sewer charge", value: `$${formatNumber(estimatedSewerMonthly, 2)}` },
            { label: "Total with sewer est.", value: `$${formatNumber(totalWithSewer, 2)}` },
            { label: "Annual water cost", value: `$${formatNumber(annualTotal, 2)}` },
            { label: "Est. household size", value: `~${householdSize} person${householdSize !== 1 ? "s" : ""} (at 80 gal/day avg)` },
          ],
          note: "Average US water rate is $4-6 per 1,000 gallons. Sewer charges are typically 90-100% of water usage cost. Average person uses about 80 gallons per day. Outdoor irrigation can double summer bills.",
        };
      },
    },
  ],
  relatedSlugs: ["gas-bill-calculator", "electricity-usage-calculator", "budget-calculator"],
  faq: [
    { question: "How much water does the average household use?", answer: "The average American household uses about 300 gallons per day (80-100 gallons per person). Toilets (27%), showers (17%), faucets (16%), washing machines (14%), and leaks (14%) account for most indoor use." },
    { question: "How is my water bill calculated?", answer: "Most water bills have a fixed monthly base/service charge plus a usage charge based on gallons consumed. Usage is typically billed per 1,000 gallons or per CCF (748 gallons). Sewer charges are usually added based on water consumption." },
    { question: "How can I lower my water bill?", answer: "Fix leaks (a dripping faucet wastes 3,000+ gallons/year), install low-flow showerheads and toilets, run full loads only in dishwashers and washing machines, and water lawns efficiently. Reducing outdoor irrigation has the biggest impact." },
  ],
  formula: "Monthly Bill = (Daily Gallons x 30 / 1,000 x Rate) + Base Charge",
};

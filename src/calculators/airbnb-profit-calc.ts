import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airbnbProfitCalculator: CalculatorDefinition = {
  slug: "airbnb-profit-calculator",
  title: "Airbnb Profitability Calculator",
  description:
    "Free online Airbnb profitability calculator. Estimate monthly and annual profit from short-term rental properties including occupancy, expenses, and ROI.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Airbnb calculator",
    "short-term rental calculator",
    "Airbnb profit calculator",
    "vacation rental income",
    "rental profitability calculator",
  ],
  variants: [
    {
      id: "profit",
      name: "Airbnb Profit Analysis",
      description: "Calculate projected Airbnb income and profit",
      fields: [
        { name: "nightlyRate", label: "Average Nightly Rate", type: "number", placeholder: "e.g. 150", prefix: "$" },
        { name: "occupancyRate", label: "Occupancy Rate", type: "number", placeholder: "e.g. 70", suffix: "%" },
        { name: "cleaningFee", label: "Cleaning Fee (per stay)", type: "number", placeholder: "e.g. 75", prefix: "$" },
        { name: "avgStayLength", label: "Average Stay Length (nights)", type: "number", placeholder: "e.g. 3" },
        { name: "hostFeePercent", label: "Airbnb Host Fee %", type: "number", placeholder: "e.g. 3", suffix: "%" },
        { name: "mortgage", label: "Monthly Mortgage/Rent", type: "number", placeholder: "e.g. 1800", prefix: "$" },
        { name: "utilities", label: "Monthly Utilities", type: "number", placeholder: "e.g. 250", prefix: "$" },
        { name: "insurance", label: "Monthly Insurance", type: "number", placeholder: "e.g. 150", prefix: "$" },
        { name: "cleaningCost", label: "Cleaning Cost per Turnover", type: "number", placeholder: "e.g. 60", prefix: "$" },
        { name: "otherMonthly", label: "Other Monthly Costs", type: "number", placeholder: "e.g. 200", prefix: "$" },
        { name: "propertyValue", label: "Property Value (for ROI)", type: "number", placeholder: "e.g. 350000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const nightly = parseFloat(inputs.nightlyRate as string) || 0;
        const occupancy = parseFloat(inputs.occupancyRate as string) || 0;
        const cleaningFee = parseFloat(inputs.cleaningFee as string) || 0;
        const avgStay = parseFloat(inputs.avgStayLength as string) || 3;
        const hostFee = parseFloat(inputs.hostFeePercent as string) || 3;
        const mortgage = parseFloat(inputs.mortgage as string) || 0;
        const utilities = parseFloat(inputs.utilities as string) || 0;
        const insurance = parseFloat(inputs.insurance as string) || 0;
        const cleaningCost = parseFloat(inputs.cleaningCost as string) || 0;
        const otherMonthly = parseFloat(inputs.otherMonthly as string) || 0;
        const propertyValue = parseFloat(inputs.propertyValue as string) || 0;
        if (!nightly || !occupancy) return null;

        const bookedNightsPerMonth = 30 * (occupancy / 100);
        const turnoversPerMonth = bookedNightsPerMonth / avgStay;
        const monthlyRentalIncome = bookedNightsPerMonth * nightly;
        const monthlyCleaningFeeIncome = turnoversPerMonth * cleaningFee;
        const grossMonthlyIncome = monthlyRentalIncome + monthlyCleaningFeeIncome;
        const airbnbFees = grossMonthlyIncome * (hostFee / 100);
        const netMonthlyIncome = grossMonthlyIncome - airbnbFees;

        const monthlyCleaningExpense = turnoversPerMonth * cleaningCost;
        const totalMonthlyExpenses = mortgage + utilities + insurance + monthlyCleaningExpense + otherMonthly;
        const monthlyProfit = netMonthlyIncome - totalMonthlyExpenses;
        const annualProfit = monthlyProfit * 12;
        const annualROI = propertyValue > 0 ? (annualProfit / propertyValue) * 100 : 0;

        return {
          primary: { label: "Monthly Profit", value: `$${formatNumber(monthlyProfit)}` },
          details: [
            { label: "Booked nights/month", value: formatNumber(bookedNightsPerMonth) },
            { label: "Turnovers/month", value: formatNumber(turnoversPerMonth) },
            { label: "Gross monthly income", value: `$${formatNumber(grossMonthlyIncome)}` },
            { label: "Airbnb fees", value: `$${formatNumber(airbnbFees)}` },
            { label: "Net income after fees", value: `$${formatNumber(netMonthlyIncome)}` },
            { label: "Total monthly expenses", value: `$${formatNumber(totalMonthlyExpenses)}` },
            { label: "Annual profit", value: `$${formatNumber(annualProfit)}` },
            { label: "Annual ROI", value: `${formatNumber(annualROI)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["noi-calculator", "gross-rent-multiplier-calculator", "roi-calculator"],
  faq: [
    {
      question: "What occupancy rate should I expect for Airbnb?",
      answer:
        "Average Airbnb occupancy rates range from 50-75% depending on location, seasonality, and pricing. Urban properties in popular destinations can achieve 70-80%, while rural or seasonal properties may see 40-60%.",
    },
    {
      question: "What are typical Airbnb host fees?",
      answer:
        "Airbnb charges hosts a service fee of about 3% per booking under the split-fee model, or 14-16% under the host-only fee model. The split-fee model also charges guests a service fee of up to 14%.",
    },
    {
      question: "Is Airbnb more profitable than long-term renting?",
      answer:
        "Short-term rentals can earn 2-3x more than long-term renting, but they also have higher expenses including cleaning, furnishing, utilities, higher insurance, and more management time. Profitability depends heavily on location and occupancy rates.",
    },
  ],
  formula: "Monthly Profit = (Nightly Rate x Booked Nights + Cleaning Fees) x (1 - Host Fee %) - Total Expenses",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentalArbitrageCalculator: CalculatorDefinition = {
  slug: "rental-arbitrage",
  title: "Rental Arbitrage (Airbnb) Profitability Calculator",
  description:
    "Calculate the profitability of rental arbitrage by leasing a property and subletting it on Airbnb or short-term rental platforms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "rental arbitrage",
    "Airbnb",
    "short-term rental",
    "subletting",
    "VRBO",
    "vacation rental",
    "passive income",
  ],
  variants: [
    {
      slug: "rental-arbitrage",
      title: "Rental Arbitrage Profitability",
      description:
        "Estimate monthly profit from leasing a property and listing it as a short-term rental.",
      fields: [
        {
          name: "monthlyRent",
          label: "Monthly Lease Payment ($)",
          type: "number",
          defaultValue: "1800",
        },
        {
          name: "nightlyRate",
          label: "Average Nightly Rate ($)",
          type: "number",
          defaultValue: "120",
        },
        {
          name: "occupancyRate",
          label: "Expected Occupancy Rate (%)",
          type: "number",
          defaultValue: "70",
        },
        {
          name: "platformFeePercent",
          label: "Platform Fee (Airbnb 3%) (%)",
          type: "number",
          defaultValue: "3",
        },
        {
          name: "cleaningFee",
          label: "Cleaning Fee Per Turnover ($)",
          type: "number",
          defaultValue: "75",
        },
        {
          name: "avgStayLength",
          label: "Average Stay Length (nights)",
          type: "number",
          defaultValue: "3",
        },
        {
          name: "utilities",
          label: "Monthly Utilities ($)",
          type: "number",
          defaultValue: "200",
        },
        {
          name: "wifi",
          label: "Monthly WiFi/Streaming ($)",
          type: "number",
          defaultValue: "80",
        },
        {
          name: "suppliesMaintenance",
          label: "Monthly Supplies/Maintenance ($)",
          type: "number",
          defaultValue: "150",
        },
        {
          name: "insurance",
          label: "Monthly Insurance ($)",
          type: "number",
          defaultValue: "100",
        },
      ],
      calculate(inputs) {
        const rent = parseFloat(inputs.monthlyRent as string);
        const nightly = parseFloat(inputs.nightlyRate as string);
        const occupancy = parseFloat(inputs.occupancyRate as string) / 100;
        const platformFee = parseFloat(inputs.platformFeePercent as string) / 100;
        const cleaningFee = parseFloat(inputs.cleaningFee as string);
        const avgStay = parseFloat(inputs.avgStayLength as string);
        const utilities = parseFloat(inputs.utilities as string);
        const wifi = parseFloat(inputs.wifi as string);
        const supplies = parseFloat(inputs.suppliesMaintenance as string);
        const insurance = parseFloat(inputs.insurance as string);

        const bookedNights = 30 * occupancy;
        const grossRevenue = bookedNights * nightly;
        const platformFees = grossRevenue * platformFee;
        const turnovers = Math.ceil(bookedNights / avgStay);
        const totalCleaningCost = turnovers * cleaningFee;
        const totalFixedCosts = rent + utilities + wifi + supplies + insurance;
        const totalVariableCosts = platformFees + totalCleaningCost;
        const totalExpenses = totalFixedCosts + totalVariableCosts;
        const monthlyProfit = grossRevenue - totalExpenses;
        const annualProfit = monthlyProfit * 12;
        const profitMargin = (monthlyProfit / grossRevenue) * 100;
        const breakEvenOccupancy =
          (totalFixedCosts / (nightly - cleaningFee / avgStay - nightly * platformFee)) /
          30 *
          100;
        const revenuePerNight = grossRevenue / bookedNights;

        return {
          "Booked Nights/Month": formatNumber(bookedNights),
          "Monthly Turnovers": formatNumber(turnovers),
          "Gross Revenue": `$${formatNumber(grossRevenue)}`,
          "Platform Fees": `$${formatNumber(platformFees)}`,
          "Cleaning Costs": `$${formatNumber(totalCleaningCost)}`,
          "Lease Payment": `$${formatNumber(rent)}`,
          "Utilities & WiFi": `$${formatNumber(utilities + wifi)}`,
          "Supplies & Maintenance": `$${formatNumber(supplies)}`,
          "Insurance": `$${formatNumber(insurance)}`,
          "Total Monthly Expenses": `$${formatNumber(totalExpenses)}`,
          "Monthly Net Profit": `$${formatNumber(monthlyProfit)}`,
          "Annual Net Profit": `$${formatNumber(annualProfit)}`,
          "Profit Margin": `${formatNumber(profitMargin)}%`,
          "Break-Even Occupancy": `${formatNumber(breakEvenOccupancy)}%`,
        };
      },
    },
    {
      slug: "rental-arbitrage-startup",
      title: "Rental Arbitrage Startup Costs",
      description: "Calculate the upfront investment to launch a rental arbitrage property.",
      fields: [
        {
          name: "securityDeposit",
          label: "Security Deposit ($)",
          type: "number",
          defaultValue: "1800",
        },
        {
          name: "firstLastMonth",
          label: "First & Last Month Rent ($)",
          type: "number",
          defaultValue: "3600",
        },
        {
          name: "furnishing",
          label: "Furnishing Cost ($)",
          type: "number",
          defaultValue: "5000",
        },
        {
          name: "photography",
          label: "Professional Photography ($)",
          type: "number",
          defaultValue: "200",
        },
        {
          name: "smartLocks",
          label: "Smart Locks/Tech ($)",
          type: "number",
          defaultValue: "300",
        },
        {
          name: "initialSupplies",
          label: "Initial Supplies & Linens ($)",
          type: "number",
          defaultValue: "800",
        },
        {
          name: "expectedMonthlyProfit",
          label: "Expected Monthly Profit ($)",
          type: "number",
          defaultValue: "800",
        },
      ],
      calculate(inputs) {
        const deposit = parseFloat(inputs.securityDeposit as string);
        const firstLast = parseFloat(inputs.firstLastMonth as string);
        const furnishing = parseFloat(inputs.furnishing as string);
        const photography = parseFloat(inputs.photography as string);
        const smartLocks = parseFloat(inputs.smartLocks as string);
        const supplies = parseFloat(inputs.initialSupplies as string);
        const monthlyProfit = parseFloat(inputs.expectedMonthlyProfit as string);

        const totalStartup = deposit + firstLast + furnishing + photography + smartLocks + supplies;
        const paybackMonths = totalStartup / monthlyProfit;
        const firstYearProfit = monthlyProfit * 12 - totalStartup;
        const roi = (firstYearProfit / totalStartup) * 100;

        return {
          "Security Deposit": `$${formatNumber(deposit)}`,
          "First & Last Month": `$${formatNumber(firstLast)}`,
          "Furnishing": `$${formatNumber(furnishing)}`,
          "Photography": `$${formatNumber(photography)}`,
          "Smart Locks/Tech": `$${formatNumber(smartLocks)}`,
          "Initial Supplies": `$${formatNumber(supplies)}`,
          "Total Startup Cost": `$${formatNumber(totalStartup)}`,
          "Payback Period": `${formatNumber(paybackMonths)} months`,
          "First Year Net Profit": `$${formatNumber(firstYearProfit)}`,
          "First Year ROI": `${formatNumber(roi)}%`,
        };
      },
    },
  ],
  relatedSlugs: [
    "vending-machine-profit",
    "self-storage-cost",
    "business-insurance-cost",
  ],
  faq: [
    {
      question: "Is rental arbitrage legal?",
      answer:
        "Rental arbitrage legality depends on your lease terms, local laws, and HOA rules. You must get landlord permission to sublet, check local short-term rental regulations, obtain required permits/licenses, and comply with tax obligations. Many cities have restrictions on short-term rentals.",
    },
    {
      question: "What occupancy rate is realistic for Airbnb?",
      answer:
        "Average Airbnb occupancy rates range from 48-65% nationally. Urban markets may see 65-80%, while seasonal vacation areas might average 40-60%. New listings typically take 2-3 months to build reviews and reach optimal occupancy.",
    },
  ],
  formula:
    "Monthly Profit = (Nightly Rate x 30 x Occupancy) - Platform Fees - Cleaning - Rent - Utilities - WiFi - Supplies - Insurance. Break-Even Occupancy = Fixed Costs / (Nightly Rate - Variable Cost Per Night) / 30.",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vendingMachineProfitCalculator: CalculatorDefinition = {
  slug: "vending-machine-profit",
  title: "Vending Machine Route Profitability Calculator",
  description:
    "Calculate the profitability of a vending machine route including machine costs, product COGS, location commissions, and maintenance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "vending machine",
    "passive income",
    "vending route",
    "profitability",
    "side business",
    "vending",
    "ROI",
  ],
  variants: [
    {
      slug: "vending-machine-profit",
      title: "Single Machine Profitability",
      description:
        "Calculate monthly profit for a single vending machine location.",
      fields: [
        {
          name: "machineCost",
          label: "Machine Purchase Cost ($)",
          type: "number",
          defaultValue: "3500",
        },
        {
          name: "avgItemPrice",
          label: "Average Item Selling Price ($)",
          type: "number",
          defaultValue: "1.75",
        },
        {
          name: "avgItemCost",
          label: "Average Item Wholesale Cost ($)",
          type: "number",
          defaultValue: "0.65",
        },
        {
          name: "salesPerDay",
          label: "Estimated Sales Per Day",
          type: "number",
          defaultValue: "25",
        },
        {
          name: "locationCommission",
          label: "Location Commission (%)",
          type: "number",
          defaultValue: "10",
        },
        {
          name: "monthlyElectricity",
          label: "Monthly Electricity Cost ($)",
          type: "number",
          defaultValue: "30",
        },
        {
          name: "restockTripsPerMonth",
          label: "Restock Trips Per Month",
          type: "number",
          defaultValue: "4",
        },
        {
          name: "costPerTrip",
          label: "Cost Per Restock Trip ($)",
          type: "number",
          defaultValue: "15",
        },
      ],
      calculate(inputs) {
        const machineCost = parseFloat(inputs.machineCost as string);
        const itemPrice = parseFloat(inputs.avgItemPrice as string);
        const itemCost = parseFloat(inputs.avgItemCost as string);
        const salesPerDay = parseFloat(inputs.salesPerDay as string);
        const commission = parseFloat(inputs.locationCommission as string) / 100;
        const electricity = parseFloat(inputs.monthlyElectricity as string);
        const restocks = parseFloat(inputs.restockTripsPerMonth as string);
        const tripCost = parseFloat(inputs.costPerTrip as string);

        const monthlySales = salesPerDay * 30;
        const monthlyRevenue = monthlySales * itemPrice;
        const monthlyCOGS = monthlySales * itemCost;
        const monthlyCommission = monthlyRevenue * commission;
        const monthlyRestock = restocks * tripCost;
        const monthlyMaintenance = 25;
        const totalExpenses =
          monthlyCOGS + monthlyCommission + electricity + monthlyRestock + monthlyMaintenance;
        const monthlyProfit = monthlyRevenue - totalExpenses;
        const annualProfit = monthlyProfit * 12;
        const paybackMonths = machineCost / monthlyProfit;
        const annualROI = (annualProfit / machineCost) * 100;
        const profitPerItem = (monthlyRevenue - totalExpenses) / monthlySales;
        const grossMargin = ((itemPrice - itemCost) / itemPrice) * 100;

        return {
          "Monthly Sales Volume": `${formatNumber(monthlySales)} items`,
          "Monthly Revenue": `$${formatNumber(monthlyRevenue)}`,
          "Product Cost (COGS)": `$${formatNumber(monthlyCOGS)}`,
          "Location Commission": `$${formatNumber(monthlyCommission)}`,
          "Electricity": `$${formatNumber(electricity)}`,
          "Restock Travel": `$${formatNumber(monthlyRestock)}`,
          "Maintenance Reserve": `$${formatNumber(monthlyMaintenance)}`,
          "Total Monthly Expenses": `$${formatNumber(totalExpenses)}`,
          "Monthly Net Profit": `$${formatNumber(monthlyProfit)}`,
          "Annual Profit": `$${formatNumber(annualProfit)}`,
          "Gross Margin": `${formatNumber(grossMargin)}%`,
          "Profit Per Item": `$${formatNumber(profitPerItem)}`,
          "Payback Period": `${formatNumber(paybackMonths)} months`,
          "Annual ROI": `${formatNumber(annualROI)}%`,
        };
      },
    },
    {
      slug: "vending-machine-profit-route",
      title: "Vending Route Profitability",
      description:
        "Calculate total route profitability across multiple machines.",
      fields: [
        {
          name: "numberOfMachines",
          label: "Number of Machines",
          type: "number",
          defaultValue: "5",
        },
        {
          name: "avgMonthlyRevenuePerMachine",
          label: "Avg Monthly Revenue Per Machine ($)",
          type: "number",
          defaultValue: "500",
        },
        {
          name: "avgCOGSPercent",
          label: "Average COGS (%)",
          type: "number",
          defaultValue: "40",
        },
        {
          name: "avgCommissionPercent",
          label: "Average Location Commission (%)",
          type: "number",
          defaultValue: "10",
        },
        {
          name: "monthlyVehicleCost",
          label: "Monthly Vehicle Cost ($)",
          type: "number",
          defaultValue: "300",
        },
        {
          name: "hoursPerWeek",
          label: "Hours Per Week Managing",
          type: "number",
          defaultValue: "10",
        },
      ],
      calculate(inputs) {
        const machines = parseFloat(inputs.numberOfMachines as string);
        const revenuePerMachine = parseFloat(inputs.avgMonthlyRevenuePerMachine as string);
        const cogsPct = parseFloat(inputs.avgCOGSPercent as string) / 100;
        const commPct = parseFloat(inputs.avgCommissionPercent as string) / 100;
        const vehicleCost = parseFloat(inputs.monthlyVehicleCost as string);
        const hoursPerWeek = parseFloat(inputs.hoursPerWeek as string);

        const totalRevenue = machines * revenuePerMachine;
        const totalCOGS = totalRevenue * cogsPct;
        const totalCommission = totalRevenue * commPct;
        const electricityAll = machines * 30;
        const maintenance = machines * 25;
        const totalExpenses =
          totalCOGS + totalCommission + electricityAll + maintenance + vehicleCost;
        const monthlyProfit = totalRevenue - totalExpenses;
        const annualProfit = monthlyProfit * 12;
        const monthlyHours = hoursPerWeek * 4.33;
        const effectiveHourly = monthlyProfit / monthlyHours;
        const revenuePerMachineActual = totalRevenue / machines;
        const profitPerMachine = monthlyProfit / machines;

        return {
          "Total Monthly Revenue": `$${formatNumber(totalRevenue)}`,
          "Total COGS": `$${formatNumber(totalCOGS)}`,
          "Total Commissions": `$${formatNumber(totalCommission)}`,
          "Electricity (all machines)": `$${formatNumber(electricityAll)}`,
          "Maintenance Reserve": `$${formatNumber(maintenance)}`,
          "Vehicle Cost": `$${formatNumber(vehicleCost)}`,
          "Total Expenses": `$${formatNumber(totalExpenses)}`,
          "Monthly Net Profit": `$${formatNumber(monthlyProfit)}`,
          "Annual Net Profit": `$${formatNumber(annualProfit)}`,
          "Profit Per Machine": `$${formatNumber(profitPerMachine)}/mo`,
          "Effective Hourly Rate": `$${formatNumber(effectiveHourly)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "rental-arbitrage",
    "self-storage-cost",
    "product-pricing",
  ],
  faq: [
    {
      question: "How much does a vending machine make per month?",
      answer:
        "A well-placed vending machine typically generates $200-$800 in monthly revenue. After COGS (35-45%), location commission (0-15%), electricity, and maintenance, net profit ranges from $50-$300 per machine per month. High-traffic locations like hospitals or factories perform best.",
    },
    {
      question: "How many vending machines do you need to make a living?",
      answer:
        "With average profit of $150-$250 per machine monthly, you would need 15-30 machines to generate $3,000-$5,000/month. Managing a route of this size typically requires 15-25 hours per week for restocking, maintenance, and bookkeeping.",
    },
  ],
  formula:
    "Monthly Profit = (Sales x Price) - (Sales x Cost) - Commission - Electricity - Restock Travel - Maintenance. Payback = Machine Cost / Monthly Profit. ROI = Annual Profit / Machine Cost x 100.",
};

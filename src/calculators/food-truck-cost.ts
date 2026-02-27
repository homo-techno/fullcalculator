import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const foodTruckCostCalculator: CalculatorDefinition = {
  slug: "food-truck-cost",
  title: "Food Truck Startup & Operating Cost Calculator",
  description:
    "Estimate the total startup costs and monthly operating expenses for a food truck business including vehicle, equipment, licenses, and food costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "food truck",
    "startup cost",
    "mobile food",
    "food business",
    "operating cost",
    "food vendor",
    "catering",
  ],
  variants: [
    {
      slug: "food-truck-cost",
      title: "Food Truck Startup Costs",
      description:
        "Estimate total startup investment for a food truck business.",
      fields: [
        {
          name: "truckCost",
          label: "Truck Purchase/Build ($)",
          type: "number",
          defaultValue: "75000",
        },
        {
          name: "equipmentCost",
          label: "Kitchen Equipment ($)",
          type: "number",
          defaultValue: "15000",
        },
        {
          name: "wrapDesign",
          label: "Wrap/Design/Branding ($)",
          type: "number",
          defaultValue: "5000",
        },
        {
          name: "permits",
          label: "Permits & Licenses ($)",
          type: "number",
          defaultValue: "3000",
        },
        {
          name: "initialInventory",
          label: "Initial Food Inventory ($)",
          type: "number",
          defaultValue: "2000",
        },
        {
          name: "posSystem",
          label: "POS System & Tech ($)",
          type: "number",
          defaultValue: "1500",
        },
        {
          name: "insurance",
          label: "First Year Insurance ($)",
          type: "number",
          defaultValue: "4000",
        },
        {
          name: "contingency",
          label: "Contingency Reserve ($)",
          type: "number",
          defaultValue: "5000",
        },
      ],
      calculate(inputs) {
        const truck = parseFloat(inputs.truckCost as string);
        const equipment = parseFloat(inputs.equipmentCost as string);
        const wrap = parseFloat(inputs.wrapDesign as string);
        const permits = parseFloat(inputs.permits as string);
        const inventory = parseFloat(inputs.initialInventory as string);
        const pos = parseFloat(inputs.posSystem as string);
        const insurance = parseFloat(inputs.insurance as string);
        const contingency = parseFloat(inputs.contingency as string);

        const totalStartup =
          truck + equipment + wrap + permits + inventory + pos + insurance + contingency;
        const downPayment20 = truck * 0.2;
        const loanAmount = truck * 0.8;
        const monthlyLoan = (loanAmount * (0.08 / 12)) / (1 - Math.pow(1 + 0.08 / 12, -60));
        const outOfPocket = downPayment20 + equipment + wrap + permits + inventory + pos + insurance + contingency;

        return {
          "Truck Cost": `$${formatNumber(truck)}`,
          "Equipment": `$${formatNumber(equipment)}`,
          "Wrap & Branding": `$${formatNumber(wrap)}`,
          "Permits & Licenses": `$${formatNumber(permits)}`,
          "Initial Inventory": `$${formatNumber(inventory)}`,
          "POS & Technology": `$${formatNumber(pos)}`,
          "First Year Insurance": `$${formatNumber(insurance)}`,
          "Contingency Reserve": `$${formatNumber(contingency)}`,
          "Total Startup Cost": `$${formatNumber(totalStartup)}`,
          "Down Payment (20%)": `$${formatNumber(downPayment20)}`,
          "Loan Amount (80%)": `$${formatNumber(loanAmount)}`,
          "Monthly Loan Payment (8%, 5yr)": `$${formatNumber(monthlyLoan)}`,
          "Out-of-Pocket to Launch": `$${formatNumber(outOfPocket)}`,
        };
      },
    },
    {
      slug: "food-truck-cost-monthly",
      title: "Food Truck Monthly Operating Costs",
      description:
        "Calculate monthly operating expenses and profitability for a food truck.",
      fields: [
        {
          name: "daysPerMonth",
          label: "Operating Days Per Month",
          type: "number",
          defaultValue: "22",
        },
        {
          name: "avgDailySales",
          label: "Average Daily Sales ($)",
          type: "number",
          defaultValue: "800",
        },
        {
          name: "foodCostPercent",
          label: "Food Cost (%)",
          type: "number",
          defaultValue: "30",
        },
        {
          name: "monthlyLoanPayment",
          label: "Monthly Truck Loan Payment ($)",
          type: "number",
          defaultValue: "1200",
        },
        {
          name: "monthlyInsurance",
          label: "Monthly Insurance ($)",
          type: "number",
          defaultValue: "350",
        },
        {
          name: "monthlyCommissary",
          label: "Monthly Commissary Fee ($)",
          type: "number",
          defaultValue: "500",
        },
        {
          name: "fuelPerDay",
          label: "Daily Fuel/Propane ($)",
          type: "number",
          defaultValue: "40",
        },
        {
          name: "staffCostDaily",
          label: "Daily Staff Cost ($)",
          type: "number",
          defaultValue: "150",
        },
        {
          name: "monthlyPermits",
          label: "Monthly Permits/Fees ($)",
          type: "number",
          defaultValue: "200",
        },
      ],
      calculate(inputs) {
        const days = parseFloat(inputs.daysPerMonth as string);
        const dailySales = parseFloat(inputs.avgDailySales as string);
        const foodPct = parseFloat(inputs.foodCostPercent as string) / 100;
        const loan = parseFloat(inputs.monthlyLoanPayment as string);
        const insurance = parseFloat(inputs.monthlyInsurance as string);
        const commissary = parseFloat(inputs.monthlyCommissary as string);
        const fuel = parseFloat(inputs.fuelPerDay as string);
        const staff = parseFloat(inputs.staffCostDaily as string);
        const permits = parseFloat(inputs.monthlyPermits as string);

        const monthlyRevenue = dailySales * days;
        const foodCost = monthlyRevenue * foodPct;
        const monthlyFuel = fuel * days;
        const monthlyStaff = staff * days;
        const totalMonthlyExpenses =
          foodCost + loan + insurance + commissary + monthlyFuel + monthlyStaff + permits;
        const monthlyProfit = monthlyRevenue - totalMonthlyExpenses;
        const profitMargin = (monthlyProfit / monthlyRevenue) * 100;
        const breakEvenDailySales = totalMonthlyExpenses / days;
        const annualProfit = monthlyProfit * 12;

        return {
          "Monthly Revenue": `$${formatNumber(monthlyRevenue)}`,
          "Food Cost": `$${formatNumber(foodCost)}`,
          "Truck Loan": `$${formatNumber(loan)}`,
          "Insurance": `$${formatNumber(insurance)}`,
          "Commissary": `$${formatNumber(commissary)}`,
          "Fuel/Propane": `$${formatNumber(monthlyFuel)}`,
          "Staff Cost": `$${formatNumber(monthlyStaff)}`,
          "Permits/Fees": `$${formatNumber(permits)}`,
          "Total Monthly Expenses": `$${formatNumber(totalMonthlyExpenses)}`,
          "Monthly Net Profit": `$${formatNumber(monthlyProfit)}`,
          "Profit Margin": `${formatNumber(profitMargin)}%`,
          "Break-Even Daily Sales": `$${formatNumber(breakEvenDailySales)}`,
          "Annual Projected Profit": `$${formatNumber(annualProfit)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "restaurant-food-cost",
    "popup-shop-cost",
    "business-insurance-cost",
  ],
  faq: [
    {
      question: "How much does it cost to start a food truck?",
      answer:
        "A food truck business typically costs $50,000-$200,000 to start. A used truck with basic equipment runs $30,000-$80,000, while a new custom build can cost $100,000-$200,000. Add $5,000-$15,000 for permits, licenses, branding, and initial inventory.",
    },
    {
      question: "What is a commissary kitchen and do I need one?",
      answer:
        "A commissary kitchen is a licensed commercial kitchen where food truck operators prep food, store supplies, and clean equipment. Many cities require food trucks to operate from a commissary. Monthly costs range from $400-$1,500 depending on location and amenities.",
    },
    {
      question: "How much can a food truck make per year?",
      answer:
        "Successful food trucks can gross $250,000-$500,000+ per year. After all expenses (food 28-32%, labor 25-30%, truck costs, permits, etc.), net profit margins typically range from 6-15%, meaning $25,000-$75,000 in annual profit for an owner-operator.",
    },
  ],
  formula:
    "Total Startup = Truck + Equipment + Wrap + Permits + Inventory + POS + Insurance + Contingency. Monthly Profit = (Daily Sales x Days) - Food Cost - Loan - Insurance - Commissary - Fuel - Staff - Permits.",
};

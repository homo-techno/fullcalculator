import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lyftDriverEarningsCalculator: CalculatorDefinition = {
  slug: "lyft-driver-earnings",
  title: "Lyft Driver Earnings Calculator",
  description:
    "Estimate your net Lyft driver pay per hour after deducting gas, vehicle wear, insurance, and other driving expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "lyft",
    "driver",
    "earnings",
    "rideshare",
    "gig economy",
    "net pay",
    "hourly rate",
  ],
  variants: [
    {
      slug: "lyft-driver-earnings",
      title: "Lyft Driver Weekly Earnings",
      description:
        "Calculate your weekly net earnings as a Lyft driver after all operating expenses.",
      fields: [
        {
          name: "grossWeekly",
          label: "Weekly Gross Earnings ($)",
          type: "number",
          defaultValue: "750",
        },
        {
          name: "bonuses",
          label: "Weekly Bonuses/Streaks ($)",
          type: "number",
          defaultValue: "50",
        },
        {
          name: "hoursWorked",
          label: "Hours Driven Per Week",
          type: "number",
          defaultValue: "35",
        },
        {
          name: "milesPerWeek",
          label: "Miles Driven Per Week",
          type: "number",
          defaultValue: "550",
        },
        {
          name: "gasPricePerGallon",
          label: "Gas Price Per Gallon ($)",
          type: "number",
          defaultValue: "3.50",
        },
        {
          name: "mpg",
          label: "Vehicle MPG",
          type: "number",
          defaultValue: "30",
        },
        {
          name: "weeklyCarPayment",
          label: "Weekly Car Payment Allocation ($)",
          type: "number",
          defaultValue: "75",
        },
        {
          name: "weeklyInsurance",
          label: "Weekly Insurance Cost ($)",
          type: "number",
          defaultValue: "55",
        },
      ],
      calculate(inputs) {
        const gross = parseFloat(inputs.grossWeekly as string);
        const bonuses = parseFloat(inputs.bonuses as string);
        const hours = parseFloat(inputs.hoursWorked as string);
        const miles = parseFloat(inputs.milesPerWeek as string);
        const gasPrice = parseFloat(inputs.gasPricePerGallon as string);
        const mpg = parseFloat(inputs.mpg as string);
        const carPayment = parseFloat(inputs.weeklyCarPayment as string);
        const insurance = parseFloat(inputs.weeklyInsurance as string);

        const totalGross = gross + bonuses;
        const gasCost = (miles / mpg) * gasPrice;
        const maintenanceCost = miles * 0.06;
        const totalExpenses = gasCost + carPayment + insurance + maintenanceCost;
        const netEarnings = totalGross - totalExpenses;
        const netHourly = netEarnings / hours;
        const grossHourly = totalGross / hours;
        const expenseRatio = (totalExpenses / totalGross) * 100;

        return {
          "Total Gross (with Bonuses)": `$${formatNumber(totalGross)}`,
          "Gas Cost": `$${formatNumber(gasCost)}`,
          "Maintenance Reserve": `$${formatNumber(maintenanceCost)}`,
          "Total Weekly Expenses": `$${formatNumber(totalExpenses)}`,
          "Net Weekly Earnings": `$${formatNumber(netEarnings)}`,
          "Gross Hourly Rate": `$${formatNumber(grossHourly)}`,
          "Net Hourly Rate": `$${formatNumber(netHourly)}`,
          "Expense Ratio": `${formatNumber(expenseRatio)}%`,
        };
      },
    },
    {
      slug: "lyft-driver-earnings-monthly",
      title: "Lyft Monthly Income Projection",
      description:
        "Project your monthly Lyft income and compare it to a traditional job.",
      fields: [
        {
          name: "avgDailyGross",
          label: "Average Daily Gross ($)",
          type: "number",
          defaultValue: "150",
        },
        {
          name: "daysPerWeek",
          label: "Days Driven Per Week",
          type: "number",
          defaultValue: "5",
        },
        {
          name: "avgDailyMiles",
          label: "Average Daily Miles",
          type: "number",
          defaultValue: "80",
        },
        {
          name: "gasPricePerGallon",
          label: "Gas Price Per Gallon ($)",
          type: "number",
          defaultValue: "3.50",
        },
        {
          name: "mpg",
          label: "Vehicle MPG",
          type: "number",
          defaultValue: "30",
        },
        {
          name: "monthlyFixedCosts",
          label: "Monthly Fixed Costs ($)",
          type: "number",
          defaultValue: "500",
        },
      ],
      calculate(inputs) {
        const dailyGross = parseFloat(inputs.avgDailyGross as string);
        const daysPerWeek = parseFloat(inputs.daysPerWeek as string);
        const dailyMiles = parseFloat(inputs.avgDailyMiles as string);
        const gasPrice = parseFloat(inputs.gasPricePerGallon as string);
        const mpg = parseFloat(inputs.mpg as string);
        const fixedCosts = parseFloat(inputs.monthlyFixedCosts as string);

        const monthlyDays = daysPerWeek * 4.33;
        const monthlyGross = dailyGross * monthlyDays;
        const monthlyMiles = dailyMiles * monthlyDays;
        const monthlyGas = (monthlyMiles / mpg) * gasPrice;
        const monthlyMaintenance = monthlyMiles * 0.06;
        const totalMonthlyExpenses = monthlyGas + monthlyMaintenance + fixedCosts;
        const monthlyNet = monthlyGross - totalMonthlyExpenses;
        const annualNet = monthlyNet * 12;
        const seTax = monthlyNet * 0.153;
        const afterTaxMonthly = monthlyNet - seTax;

        return {
          "Monthly Gross Income": `$${formatNumber(monthlyGross)}`,
          "Monthly Miles": formatNumber(monthlyMiles),
          "Monthly Gas Cost": `$${formatNumber(monthlyGas)}`,
          "Monthly Maintenance": `$${formatNumber(monthlyMaintenance)}`,
          "Total Monthly Expenses": `$${formatNumber(totalMonthlyExpenses)}`,
          "Monthly Net Income": `$${formatNumber(monthlyNet)}`,
          "Monthly SE Tax": `$${formatNumber(seTax)}`,
          "After-Tax Monthly": `$${formatNumber(afterTaxMonthly)}`,
          "Projected Annual Net": `$${formatNumber(annualNet)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "uber-driver-earnings",
    "gig-tax-calculator",
    "contractor-vs-employee",
  ],
  faq: [
    {
      question: "How does Lyft driver pay compare to Uber?",
      answer:
        "Lyft and Uber pay rates are generally similar, though they vary by market. Lyft tends to offer more predictable streak bonuses while Uber offers surge pricing. Net earnings after expenses are typically within 5-10% of each other in most markets.",
    },
    {
      question: "What is the Lyft service fee percentage?",
      answer:
        "Lyft typically takes a service fee that varies by ride type and market, generally ranging from 20-40% of the rider fare. Drivers see their earnings breakdown for each ride in the app.",
    },
  ],
  formula:
    "Net Earnings = (Gross Earnings + Bonuses) - Gas - Insurance - Car Payment - Maintenance. Gas Cost = (Miles / MPG) x Gas Price. Maintenance = Miles x $0.06/mile.",
};

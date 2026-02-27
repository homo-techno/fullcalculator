import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const turoProfitCalculator: CalculatorDefinition = {
  slug: "turo-profit",
  title: "Turo Car-Sharing Host Profitability Calculator",
  description:
    "Calculate potential profit from hosting your car on Turo. Accounts for daily rate, occupancy, Turo fees, depreciation, insurance, and maintenance costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Turo",
    "car sharing",
    "car rental",
    "host",
    "profit",
    "passive income",
    "vehicle",
    "side hustle",
    "peer-to-peer",
    "rental income",
  ],
  variants: [
    {
      slug: "monthly-profit",
      title: "Monthly Profit Estimate",
      fields: [
        {
          name: "dailyRate",
          label: "Daily Rental Rate ($)",
          type: "number",
        },
        {
          name: "daysPerMonth",
          label: "Expected Rental Days per Month",
          type: "number",
        },
        {
          name: "carPayment",
          label: "Monthly Car Payment ($, 0 if paid off)",
          type: "number",
        },
        {
          name: "protectionPlan",
          label: "Turo Protection Plan",
          type: "select",
          options: [
            { label: "60% Plan (you keep 60%)", value: "0.60" },
            { label: "75% Plan (you keep 75%)", value: "0.75" },
            { label: "85% Plan (you keep 85%)", value: "0.85" },
          ],
        },
      ],
      calculate(inputs) {
        const dailyRate = parseFloat(inputs.dailyRate as string);
        const days = parseFloat(inputs.daysPerMonth as string);
        const carPayment = parseFloat(inputs.carPayment as string);
        const keepPercent = parseFloat(inputs.protectionPlan as string);
        if (isNaN(dailyRate) || isNaN(days) || isNaN(carPayment) || isNaN(keepPercent))
          return { error: "Please enter all values." };

        const grossRevenue = dailyRate * days;
        const turoEarnings = grossRevenue * keepPercent;
        const monthlyInsurance = 150;
        const monthlyMaintenance = days * 8;
        const monthlyWash = days * 5;
        const depreciation = days * 3;
        const totalExpenses = carPayment + monthlyInsurance + monthlyMaintenance + monthlyWash + depreciation;
        const netProfit = turoEarnings - totalExpenses;
        const annualProfit = netProfit * 12;
        const occupancyRate = (days / 30) * 100;

        return {
          results: [
            { label: "Gross Revenue", value: `$${formatNumber(grossRevenue)}/mo` },
            { label: "After Turo Fees", value: `$${formatNumber(turoEarnings)}/mo` },
            { label: "Car Payment", value: `$${formatNumber(carPayment)}/mo` },
            { label: "Insurance", value: `$${formatNumber(monthlyInsurance)}/mo` },
            { label: "Maintenance & Cleaning", value: `$${formatNumber(monthlyMaintenance + monthlyWash)}/mo` },
            { label: "Depreciation", value: `$${formatNumber(depreciation)}/mo` },
            { label: "Monthly Net Profit", value: `$${formatNumber(netProfit)}` },
            { label: "Annual Net Profit", value: `$${formatNumber(annualProfit)}` },
            { label: "Occupancy Rate", value: `${formatNumber(occupancyRate)}%` },
          ],
        };
      },
    },
    {
      slug: "breakeven-analysis",
      title: "Break-Even Analysis",
      fields: [
        {
          name: "carValue",
          label: "Vehicle Value ($)",
          type: "number",
        },
        {
          name: "dailyRate",
          label: "Average Daily Rate ($)",
          type: "number",
        },
        {
          name: "monthlyExpenses",
          label: "Total Monthly Expenses ($)",
          type: "number",
        },
        {
          name: "protectionPlan",
          label: "Turo Protection Plan",
          type: "select",
          options: [
            { label: "60% Plan", value: "0.60" },
            { label: "75% Plan", value: "0.75" },
            { label: "85% Plan", value: "0.85" },
          ],
        },
      ],
      calculate(inputs) {
        const carValue = parseFloat(inputs.carValue as string);
        const dailyRate = parseFloat(inputs.dailyRate as string);
        const expenses = parseFloat(inputs.monthlyExpenses as string);
        const keepPercent = parseFloat(inputs.protectionPlan as string);
        if (isNaN(carValue) || isNaN(dailyRate) || isNaN(expenses) || isNaN(keepPercent))
          return { error: "Please enter all values." };

        const netPerDay = dailyRate * keepPercent - 16;
        const breakEvenDaysMonth = netPerDay > 0 ? expenses / netPerDay : 0;
        const breakEvenDaysTotal = netPerDay > 0 ? carValue / netPerDay : 0;
        const breakEvenMonths = breakEvenDaysTotal / 30;
        const annualNetAt50Pct = netPerDay * 15 * 12 - expenses * 12;
        const annualNetAt75Pct = netPerDay * 22 * 12 - expenses * 12;

        return {
          results: [
            { label: "Net Earnings per Rental Day", value: `$${formatNumber(netPerDay)}` },
            { label: "Days/Month to Cover Expenses", value: formatNumber(breakEvenDaysMonth) },
            { label: "Days to Recoup Car Value", value: formatNumber(breakEvenDaysTotal) },
            { label: "Months to Recoup Car Value", value: formatNumber(breakEvenMonths) },
            { label: "Annual Net at 50% Occupancy", value: `$${formatNumber(annualNetAt50Pct)}` },
            { label: "Annual Net at 75% Occupancy", value: `$${formatNumber(annualNetAt75Pct)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["airbnb-occupancy-rate", "adu-cost", "rent-to-income"],
  faq: [
    {
      question: "How much can I make hosting on Turo?",
      answer:
        "Turo earnings vary widely based on location, vehicle type, and occupancy. Average hosts earn $500-$1,000/month per vehicle. Premium vehicles (SUVs, luxury, specialty) can earn $1,500-$3,000+/month. After expenses, net profit is typically 30-50% of gross revenue.",
    },
    {
      question: "What are the costs of hosting on Turo?",
      answer:
        "Key costs include Turo's platform fee (15-40% of trip price depending on your protection plan), personal insurance, additional wear and maintenance, cleaning between guests, and accelerated depreciation. A car payment, if applicable, is your largest fixed expense.",
    },
    {
      question: "Is Turo hosting worth it?",
      answer:
        "Turo is most profitable with paid-off vehicles in high-demand markets. If your car would otherwise sit idle, hosting can offset ownership costs. However, factor in increased depreciation, wear and tear, and the time spent managing bookings, cleaning, and guest communications.",
    },
  ],
  formula:
    "Gross Revenue = Daily Rate x Rental Days | Turo Earnings = Gross x Keep % | Net Profit = Turo Earnings - (Car Payment + Insurance + Maintenance + Cleaning + Depreciation) | Break-Even Days = Car Value / Net per Day",
};

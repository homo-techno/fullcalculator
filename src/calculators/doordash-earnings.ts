import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const doordashEarningsCalculator: CalculatorDefinition = {
  slug: "doordash-earnings",
  title: "DoorDash Earnings Calculator",
  description:
    "Calculate your net DoorDash dasher pay per hour after gas, vehicle expenses, and self-employment taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "doordash",
    "dasher",
    "earnings",
    "delivery",
    "gig economy",
    "food delivery",
    "net pay",
  ],
  variants: [
    {
      slug: "doordash-earnings",
      title: "DoorDash Dasher Net Pay",
      description:
        "Calculate your true net earnings from DoorDash deliveries after all expenses.",
      fields: [
        {
          name: "deliveriesPerWeek",
          label: "Deliveries Per Week",
          type: "number",
          defaultValue: "50",
        },
        {
          name: "avgBasePay",
          label: "Average Base Pay Per Delivery ($)",
          type: "number",
          defaultValue: "4.50",
        },
        {
          name: "avgTip",
          label: "Average Tip Per Delivery ($)",
          type: "number",
          defaultValue: "4.00",
        },
        {
          name: "avgMilesPerDelivery",
          label: "Average Miles Per Delivery",
          type: "number",
          defaultValue: "5",
        },
        {
          name: "hoursPerWeek",
          label: "Active Hours Per Week",
          type: "number",
          defaultValue: "25",
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
          defaultValue: "28",
        },
        {
          name: "weeklyMaintenance",
          label: "Weekly Maintenance/Wear ($)",
          type: "number",
          defaultValue: "30",
        },
      ],
      calculate(inputs) {
        const deliveries = parseFloat(inputs.deliveriesPerWeek as string);
        const basePay = parseFloat(inputs.avgBasePay as string);
        const avgTip = parseFloat(inputs.avgTip as string);
        const milesPerDelivery = parseFloat(inputs.avgMilesPerDelivery as string);
        const hours = parseFloat(inputs.hoursPerWeek as string);
        const gasPrice = parseFloat(inputs.gasPricePerGallon as string);
        const mpg = parseFloat(inputs.mpg as string);
        const maintenance = parseFloat(inputs.weeklyMaintenance as string);

        const totalBase = deliveries * basePay;
        const totalTips = deliveries * avgTip;
        const grossWeekly = totalBase + totalTips;
        const totalMiles = deliveries * milesPerDelivery;
        const gasCost = (totalMiles / mpg) * gasPrice;
        const totalExpenses = gasCost + maintenance;
        const netWeekly = grossWeekly - totalExpenses;
        const netHourly = netWeekly / hours;
        const deliveriesPerHour = deliveries / hours;
        const costPerDelivery = totalExpenses / deliveries;

        return {
          "Total Base Pay": `$${formatNumber(totalBase)}`,
          "Total Tips": `$${formatNumber(totalTips)}`,
          "Gross Weekly": `$${formatNumber(grossWeekly)}`,
          "Weekly Miles": formatNumber(totalMiles),
          "Weekly Gas Cost": `$${formatNumber(gasCost)}`,
          "Total Expenses": `$${formatNumber(totalExpenses)}`,
          "Net Weekly Earnings": `$${formatNumber(netWeekly)}`,
          "Net Hourly Rate": `$${formatNumber(netHourly)}`,
          "Deliveries Per Hour": formatNumber(deliveriesPerHour),
          "Cost Per Delivery": `$${formatNumber(costPerDelivery)}`,
        };
      },
    },
    {
      slug: "doordash-earnings-strategy",
      title: "DoorDash Acceptance Strategy",
      description:
        "Compare earnings with different order acceptance strategies.",
      fields: [
        {
          name: "totalOffersPerHour",
          label: "Offers Received Per Hour",
          type: "number",
          defaultValue: "6",
        },
        {
          name: "acceptanceRate",
          label: "Acceptance Rate (%)",
          type: "number",
          defaultValue: "50",
        },
        {
          name: "avgAcceptedPay",
          label: "Avg Pay on Accepted Orders ($)",
          type: "number",
          defaultValue: "9.50",
        },
        {
          name: "avgMilesAccepted",
          label: "Avg Miles on Accepted Orders",
          type: "number",
          defaultValue: "4",
        },
        {
          name: "hoursPerDay",
          label: "Hours Dashing Per Day",
          type: "number",
          defaultValue: "6",
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
          defaultValue: "28",
        },
      ],
      calculate(inputs) {
        const offersPerHour = parseFloat(inputs.totalOffersPerHour as string);
        const acceptRate = parseFloat(inputs.acceptanceRate as string) / 100;
        const avgPay = parseFloat(inputs.avgAcceptedPay as string);
        const avgMiles = parseFloat(inputs.avgMilesAccepted as string);
        const hoursPerDay = parseFloat(inputs.hoursPerDay as string);
        const gasPrice = parseFloat(inputs.gasPricePerGallon as string);
        const mpg = parseFloat(inputs.mpg as string);

        const acceptedPerHour = offersPerHour * acceptRate;
        const grossPerHour = acceptedPerHour * avgPay;
        const milesPerHour = acceptedPerHour * avgMiles;
        const gasPerHour = (milesPerHour / mpg) * gasPrice;
        const netPerHour = grossPerHour - gasPerHour;
        const dailyGross = grossPerHour * hoursPerDay;
        const dailyGas = gasPerHour * hoursPerDay;
        const dailyNet = netPerHour * hoursPerDay;
        const dollarPerMile = avgPay / avgMiles;

        return {
          "Accepted Orders/Hour": formatNumber(acceptedPerHour),
          "Gross Per Hour": `$${formatNumber(grossPerHour)}`,
          "Gas Cost Per Hour": `$${formatNumber(gasPerHour)}`,
          "Net Per Hour": `$${formatNumber(netPerHour)}`,
          "Daily Gross": `$${formatNumber(dailyGross)}`,
          "Daily Gas Cost": `$${formatNumber(dailyGas)}`,
          "Daily Net Earnings": `$${formatNumber(dailyNet)}`,
          "Dollar Per Mile Ratio": `$${formatNumber(dollarPerMile)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "uber-driver-earnings",
    "instacart-earnings",
    "gig-tax-calculator",
  ],
  faq: [
    {
      question: "How much do DoorDash drivers make per delivery?",
      answer:
        "DoorDash base pay ranges from $2-$10+ per delivery depending on distance, duration, and desirability. Tips average $3-5 per order. Most dashers aim to earn at least $1.50-$2.00 per mile to maintain profitability.",
    },
    {
      question: "Is it worth it to DoorDash full time?",
      answer:
        "Full-time DoorDash can earn $15-$25+ per hour gross in busy markets, but after expenses and self-employment taxes, net earnings are lower. Success depends on market, strategy, and vehicle efficiency.",
    },
  ],
  formula:
    "Net Weekly = (Deliveries x Base Pay) + (Deliveries x Avg Tip) - Gas Cost - Maintenance. Gas Cost = (Total Miles / MPG) x Gas Price. Net Hourly = Net Weekly / Hours.",
};

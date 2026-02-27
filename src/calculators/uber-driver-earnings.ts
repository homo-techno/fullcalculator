import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const uberDriverEarningsCalculator: CalculatorDefinition = {
  slug: "uber-driver-earnings",
  title: "Uber Driver Earnings Calculator",
  description:
    "Calculate your net Uber driver earnings per hour after accounting for gas, vehicle maintenance, insurance, and other expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "uber",
    "driver",
    "earnings",
    "rideshare",
    "gig economy",
    "net pay",
    "expenses",
  ],
  variants: [
    {
      slug: "uber-driver-earnings",
      title: "Uber Driver Net Earnings",
      description:
        "Estimate your true hourly earnings as an Uber driver after all expenses.",
      fields: [
        {
          name: "grossEarnings",
          label: "Weekly Gross Earnings ($)",
          type: "number",
          defaultValue: "800",
        },
        {
          name: "hoursWorked",
          label: "Hours Driven Per Week",
          type: "number",
          defaultValue: "40",
        },
        {
          name: "milesPerWeek",
          label: "Miles Driven Per Week",
          type: "number",
          defaultValue: "600",
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
          name: "weeklyInsurance",
          label: "Weekly Insurance Cost ($)",
          type: "number",
          defaultValue: "60",
        },
        {
          name: "weeklyMaintenance",
          label: "Weekly Maintenance Reserve ($)",
          type: "number",
          defaultValue: "40",
        },
        {
          name: "phoneDataPlan",
          label: "Weekly Phone/Data Cost ($)",
          type: "number",
          defaultValue: "20",
        },
      ],
      calculate(inputs) {
        const gross = parseFloat(inputs.grossEarnings as string);
        const hours = parseFloat(inputs.hoursWorked as string);
        const miles = parseFloat(inputs.milesPerWeek as string);
        const gasPrice = parseFloat(inputs.gasPricePerGallon as string);
        const mpg = parseFloat(inputs.mpg as string);
        const insurance = parseFloat(inputs.weeklyInsurance as string);
        const maintenance = parseFloat(inputs.weeklyMaintenance as string);
        const phone = parseFloat(inputs.phoneDataPlan as string);

        const gasCost = (miles / mpg) * gasPrice;
        const totalExpenses = gasCost + insurance + maintenance + phone;
        const netEarnings = gross - totalExpenses;
        const netPerHour = netEarnings / hours;
        const costPerMile = totalExpenses / miles;
        const annualNet = netEarnings * 52;
        const selfEmploymentTax = netEarnings * 0.153;
        const afterTaxWeekly = netEarnings - selfEmploymentTax;

        return {
          "Weekly Gas Cost": `$${formatNumber(gasCost)}`,
          "Total Weekly Expenses": `$${formatNumber(totalExpenses)}`,
          "Net Weekly Earnings": `$${formatNumber(netEarnings)}`,
          "Net Hourly Rate": `$${formatNumber(netPerHour)}`,
          "Cost Per Mile": `$${formatNumber(costPerMile)}`,
          "Estimated Annual Net": `$${formatNumber(annualNet)}`,
          "Weekly SE Tax (15.3%)": `$${formatNumber(selfEmploymentTax)}`,
          "After-Tax Weekly": `$${formatNumber(afterTaxWeekly)}`,
        };
      },
    },
    {
      slug: "uber-driver-earnings-daily",
      title: "Uber Daily Earnings Breakdown",
      description:
        "Calculate your daily net earnings from Uber driving including per-trip costs.",
      fields: [
        {
          name: "tripsPerDay",
          label: "Trips Per Day",
          type: "number",
          defaultValue: "15",
        },
        {
          name: "avgFarePerTrip",
          label: "Average Fare Per Trip ($)",
          type: "number",
          defaultValue: "12",
        },
        {
          name: "avgTipsPerTrip",
          label: "Average Tips Per Trip ($)",
          type: "number",
          defaultValue: "3",
        },
        {
          name: "avgMilesPerTrip",
          label: "Average Miles Per Trip",
          type: "number",
          defaultValue: "5",
        },
        {
          name: "hoursOnline",
          label: "Hours Online Per Day",
          type: "number",
          defaultValue: "8",
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
        const trips = parseFloat(inputs.tripsPerDay as string);
        const fare = parseFloat(inputs.avgFarePerTrip as string);
        const tips = parseFloat(inputs.avgTipsPerTrip as string);
        const milesPerTrip = parseFloat(inputs.avgMilesPerTrip as string);
        const hours = parseFloat(inputs.hoursOnline as string);
        const gasPrice = parseFloat(inputs.gasPricePerGallon as string);
        const mpg = parseFloat(inputs.mpg as string);

        const grossFares = trips * fare;
        const totalTips = trips * tips;
        const grossDaily = grossFares + totalTips;
        const totalMiles = trips * milesPerTrip;
        const gasCost = (totalMiles / mpg) * gasPrice;
        const depreciation = totalMiles * 0.1;
        const netDaily = grossDaily - gasCost - depreciation;
        const netHourly = netDaily / hours;

        return {
          "Gross Fares": `$${formatNumber(grossFares)}`,
          "Total Tips": `$${formatNumber(totalTips)}`,
          "Gross Daily Earnings": `$${formatNumber(grossDaily)}`,
          "Total Miles Driven": formatNumber(totalMiles),
          "Daily Gas Cost": `$${formatNumber(gasCost)}`,
          "Daily Depreciation": `$${formatNumber(depreciation)}`,
          "Net Daily Earnings": `$${formatNumber(netDaily)}`,
          "Net Hourly Rate": `$${formatNumber(netHourly)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "lyft-driver-earnings",
    "doordash-earnings",
    "gig-tax-calculator",
  ],
  faq: [
    {
      question: "What expenses should Uber drivers track?",
      answer:
        "Uber drivers should track gas, vehicle maintenance, insurance, phone/data costs, car washes, tolls, parking, and vehicle depreciation. The IRS standard mileage rate for 2024 is 67 cents per mile, which covers most vehicle-related expenses.",
    },
    {
      question: "How much does the average Uber driver actually make per hour?",
      answer:
        "After accounting for all expenses including gas, maintenance, insurance, and depreciation, most Uber drivers earn between $10-$20 per hour net. Earnings vary significantly by city, time of day, and driving strategy.",
    },
    {
      question: "Do Uber drivers need to pay self-employment tax?",
      answer:
        "Yes. As independent contractors, Uber drivers must pay self-employment tax of 15.3% (12.4% Social Security + 2.9% Medicare) on net earnings, in addition to federal and state income taxes.",
    },
  ],
  formula:
    "Net Earnings = Gross Earnings - Gas Cost - Insurance - Maintenance - Phone/Data. Gas Cost = (Miles / MPG) x Price Per Gallon. Net Hourly = Net Earnings / Hours Worked.",
};

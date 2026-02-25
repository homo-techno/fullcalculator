import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airbnbIncomeCalculator: CalculatorDefinition = {
  slug: "airbnb-income-calculator",
  title: "Airbnb Income Estimator",
  description:
    "Free Airbnb income estimator. Calculate potential short-term rental income, occupancy rates, and compare Airbnb returns vs long-term rental income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "airbnb income calculator",
    "short-term rental income",
    "airbnb profit calculator",
    "vacation rental income",
    "airbnb roi",
  ],
  variants: [
    {
      id: "income-estimate",
      name: "Income Estimate",
      description: "Estimate monthly Airbnb income after expenses",
      fields: [
        {
          name: "nightlyRate",
          label: "Average Nightly Rate",
          type: "number",
          placeholder: "e.g. 150",
          prefix: "$",
          min: 0,
        },
        {
          name: "occupancyRate",
          label: "Expected Occupancy Rate",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "%",
          min: 0,
          max: 100,
          step: 1,
          defaultValue: 70,
        },
        {
          name: "cleaningFee",
          label: "Cleaning Fee Per Turnover",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
          min: 0,
        },
        {
          name: "avgStay",
          label: "Average Stay Length",
          type: "select",
          options: [
            { label: "1 night", value: "1" },
            { label: "2 nights", value: "2" },
            { label: "3 nights", value: "3" },
            { label: "5 nights", value: "5" },
            { label: "7 nights", value: "7" },
          ],
          defaultValue: "3",
        },
        {
          name: "platformFee",
          label: "Platform Fee (Host)",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.1,
          defaultValue: 3,
        },
        {
          name: "monthlyExpenses",
          label: "Monthly Expenses (utilities, supplies, etc.)",
          type: "number",
          placeholder: "e.g. 400",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const nightly = inputs.nightlyRate as number;
        const occupancy = (inputs.occupancyRate as number) || 70;
        const cleaningFee = (inputs.cleaningFee as number) || 0;
        const avgStay = parseInt(inputs.avgStay as string) || 3;
        const platformFee = (inputs.platformFee as number) || 3;
        const expenses = (inputs.monthlyExpenses as number) || 0;
        if (!nightly) return null;

        const occupiedNightsPerMonth = 30 * (occupancy / 100);
        const turnoversPerMonth = occupiedNightsPerMonth / avgStay;
        const grossIncome = occupiedNightsPerMonth * nightly;
        const cleaningIncome = turnoversPerMonth * cleaningFee;
        const totalGross = grossIncome + cleaningIncome;
        const platformCost = totalGross * (platformFee / 100);
        const cleaningCost = turnoversPerMonth * cleaningFee;
        const netIncome = totalGross - platformCost - cleaningCost - expenses;

        return {
          primary: {
            label: "Estimated Monthly Net Income",
            value: `$${formatNumber(netIncome)}`,
          },
          details: [
            { label: "Gross nightly income", value: `$${formatNumber(grossIncome)}/mo` },
            { label: "Occupied nights per month", value: `${formatNumber(occupiedNightsPerMonth, 0)} nights` },
            { label: "Turnovers per month", value: formatNumber(turnoversPerMonth, 1) },
            { label: "Platform fees", value: `$${formatNumber(platformCost)}/mo` },
            { label: "Annual net income", value: `$${formatNumber(netIncome * 12)}` },
          ],
        };
      },
    },
    {
      id: "vs-longterm",
      name: "Airbnb vs Long-Term Rental",
      description: "Compare short-term vs long-term rental returns",
      fields: [
        {
          name: "nightlyRate",
          label: "Airbnb Nightly Rate",
          type: "number",
          placeholder: "e.g. 150",
          prefix: "$",
          min: 0,
        },
        {
          name: "occupancyRate",
          label: "Expected Occupancy Rate",
          type: "number",
          placeholder: "e.g. 65",
          suffix: "%",
          min: 0,
          max: 100,
          step: 1,
        },
        {
          name: "airbnbExpenses",
          label: "Monthly Airbnb Expenses",
          type: "number",
          placeholder: "e.g. 800",
          prefix: "$",
          min: 0,
        },
        {
          name: "longTermRent",
          label: "Long-Term Monthly Rent",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          min: 0,
        },
        {
          name: "longTermExpenses",
          label: "Monthly Long-Term Expenses",
          type: "number",
          placeholder: "e.g. 200",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const nightly = inputs.nightlyRate as number;
        const occupancy = inputs.occupancyRate as number;
        const airbnbExp = (inputs.airbnbExpenses as number) || 0;
        const ltRent = inputs.longTermRent as number;
        const ltExp = (inputs.longTermExpenses as number) || 0;
        if (!nightly || !occupancy || !ltRent) return null;

        const airbnbGross = nightly * 30 * (occupancy / 100);
        const airbnbNet = airbnbGross - airbnbExp;
        const ltNet = ltRent - ltExp;
        const difference = airbnbNet - ltNet;

        return {
          primary: {
            label: "Monthly Difference",
            value: `$${formatNumber(difference)}`,
          },
          details: [
            { label: "Airbnb monthly net", value: `$${formatNumber(airbnbNet)}` },
            { label: "Long-term monthly net", value: `$${formatNumber(ltNet)}` },
            { label: "Annual difference", value: `$${formatNumber(difference * 12)}` },
            { label: "Better option", value: difference > 0 ? "Airbnb" : "Long-term rental" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rental-cash-flow-calculator", "vacation-rental-calculator", "investment-property-calculator"],
  faq: [
    {
      question: "What is a good Airbnb occupancy rate?",
      answer:
        "A good Airbnb occupancy rate is typically 60-80%. This varies by location, season, and property type. Urban areas and tourist destinations often have higher occupancy. A rate above 70% is generally considered excellent.",
    },
    {
      question: "What fees does Airbnb charge hosts?",
      answer:
        "Airbnb typically charges hosts a service fee of about 3% per booking under the split-fee model. Under the host-only fee model, hosts pay about 14-16%. Cleaning fees are set by the host and paid by the guest.",
    },
    {
      question: "Is Airbnb more profitable than long-term rental?",
      answer:
        "Airbnb can generate 2-3x more revenue than long-term rentals, but comes with higher expenses (cleaning, furnishing, utilities, management, supplies) and more variability. Net profit depends on occupancy rates, location, and how efficiently you manage costs.",
    },
  ],
  formula: "Net Income = (Nightly Rate x Occupied Nights) - Platform Fees - Cleaning Costs - Expenses",
};

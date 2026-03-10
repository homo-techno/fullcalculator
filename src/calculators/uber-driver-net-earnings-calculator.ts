import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const uberDriverNetEarningsCalculator: CalculatorDefinition = {
  slug: "uber-driver-net-earnings-calculator",
  title: "Uber Driver Net Earnings Calculator",
  description:
    "Calculate your true Uber driver income after gas, maintenance, depreciation, and taxes. See real hourly profit driving for Uber.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Uber driver earnings calculator",
    "Uber driver net income",
    "how much do Uber drivers make",
    "Uber driver profit after expenses",
    "Uber driver true hourly rate",
  ],
  variants: [
    {
      id: "net",
      name: "Net Earnings Calculator",
      description: "Calculate true income after all Uber driving costs",
      fields: [
        {
          name: "weeklyGross",
          label: "Weekly Gross from Uber",
          type: "number",
          placeholder: "e.g. 700",
          prefix: "$",
        },
        {
          name: "weeklyMiles",
          label: "Miles Driven per Week",
          type: "number",
          placeholder: "e.g. 400",
          suffix: "miles",
        },
        {
          name: "mpg",
          label: "Car MPG",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "mpg",
          defaultValue: 30,
        },
        {
          name: "gasPrice",
          label: "Gas Price per Gallon",
          type: "number",
          placeholder: "e.g. 3.50",
          prefix: "$",
          defaultValue: 3.50,
        },
        {
          name: "hoursPerWeek",
          label: "Hours Online per Week",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "hours",
        },
      ],
      calculate: (inputs) => {
        const weeklyGross = parseFloat(inputs.weeklyGross as string) || 0;
        const weeklyMiles = parseFloat(inputs.weeklyMiles as string) || 0;
        const mpg = parseFloat(inputs.mpg as string) || 30;
        const gasPrice = parseFloat(inputs.gasPrice as string) || 3.50;
        const hours = parseFloat(inputs.hoursPerWeek as string) || 1;

        // Gas cost
        const gasCost = (weeklyMiles / mpg) * gasPrice;

        // Vehicle depreciation: IRS rate ~$0.10/mile for rideshare wear
        const depreciation = weeklyMiles * 0.10;

        // Maintenance: ~$0.06/mile (oil, tires, brakes)
        const maintenance = weeklyMiles * 0.06;

        // Insurance premium for rideshare: ~$30/week extra
        const insurance = 30;

        const totalExpenses = gasCost + depreciation + maintenance + insurance;
        const weeklyNet = weeklyGross - totalExpenses;
        // Self-employment tax ~15.3% + income tax ~15% = ~30%
        const weeklyAfterTax = weeklyNet * 0.70;
        const trueHourlyRate = hours > 0 ? weeklyAfterTax / hours : 0;
        const monthlyNet = weeklyAfterTax * 4.33;

        return {
          primary: { label: "True Hourly Rate (after tax)", value: `$${formatNumber(trueHourlyRate, 2)}/hr` },
          details: [
            { label: "Weekly gross from Uber", value: `$${formatNumber(weeklyGross, 2)}` },
            { label: "Gas cost", value: `-$${formatNumber(gasCost, 2)}` },
            { label: "Depreciation (~$0.10/mi)", value: `-$${formatNumber(depreciation, 2)}` },
            { label: "Maintenance (~$0.06/mi)", value: `-$${formatNumber(maintenance, 2)}` },
            { label: "Rideshare insurance", value: `-$${formatNumber(insurance, 2)}` },
            { label: "Weekly net (before tax)", value: `$${formatNumber(weeklyNet, 2)}` },
            { label: "Weekly net (after 30% tax)", value: `$${formatNumber(weeklyAfterTax, 2)}` },
            { label: "True hourly rate", value: `$${formatNumber(trueHourlyRate, 2)}/hr` },
            { label: "Monthly net income", value: `$${formatNumber(monthlyNet, 2)}` },
          ],
          note: "Most Uber drivers earn $8–$15/hr true net. Top earners in surge-heavy cities earn $15–$22/hr by driving strategically.",
        };
      },
    },
  ],
  relatedSlugs: ["lyft-driver-net-income-calculator", "rideshare-earnings-comparison-calculator", "gig-worker-quarterly-tax-calculator"],
  faq: [
    {
      question: "How much do Uber drivers actually make per hour?",
      answer:
        "After gas, maintenance, depreciation, insurance, and taxes, most Uber drivers net $8–$15/hr. Uber's advertised earnings of $20–$30/hr are before expenses. In high-demand markets (NYC, SF) with strategic driving, $15–$22/hr net is achievable.",
    },
    {
      question: "What expenses can Uber drivers deduct on taxes?",
      answer:
        "Uber drivers can deduct: mileage (IRS standard rate: 67 cents/mile in 2024), actual vehicle expenses (gas, oil, insurance, registration), phone bill (business portion), car washes, and tolls. Keep a mileage log for accurate deductions.",
    },
    {
      question: "How does vehicle depreciation affect Uber driver income?",
      answer:
        "High-mileage rideshare driving rapidly depreciates a car's value. Rideshare drivers often put 40,000–80,000 miles/year on their car vs 15,000 for regular drivers. This represents a real cost of $4,000–$8,000/year in vehicle value lost.",
    },
  ],
  formula: "Net Earnings = Gross − Gas − Depreciation ($0.10/mi) − Maintenance ($0.06/mi) − Insurance",
};

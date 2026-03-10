import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lyftDriverNetIncomeCalculator: CalculatorDefinition = {
  slug: "lyft-driver-net-income-calculator",
  title: "Lyft Driver Net Income Calculator",
  description:
    "Calculate your true Lyft driver income after vehicle costs, taxes, and Lyft's commission. Compare Lyft vs Uber driver profitability.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Lyft driver income calculator",
    "how much do Lyft drivers make",
    "Lyft driver net earnings",
    "Lyft driver profit after expenses",
    "Lyft vs Uber driver income",
  ],
  variants: [
    {
      id: "lyft",
      name: "Lyft Net Income",
      description: "Calculate true net income driving for Lyft",
      fields: [
        {
          name: "weeklyGross",
          label: "Weekly Gross Earnings from Lyft",
          type: "number",
          placeholder: "e.g. 650",
          prefix: "$",
        },
        {
          name: "weeklyMiles",
          label: "Miles Driven per Week",
          type: "number",
          placeholder: "e.g. 350",
          suffix: "miles",
        },
        {
          name: "hoursOnline",
          label: "Hours Online per Week",
          type: "number",
          placeholder: "e.g. 18",
          suffix: "hours",
        },
        {
          name: "carType",
          label: "Vehicle Type",
          type: "select",
          options: [
            { label: "Economy / Standard", value: "economy" },
            { label: "Hybrid (better MPG)", value: "hybrid" },
            { label: "SUV / Large", value: "suv" },
          ],
          defaultValue: "economy",
        },
      ],
      calculate: (inputs) => {
        const weeklyGross = parseFloat(inputs.weeklyGross as string) || 0;
        const weeklyMiles = parseFloat(inputs.weeklyMiles as string) || 0;
        const hours = parseFloat(inputs.hoursOnline as string) || 1;
        const carType = inputs.carType as string;

        const costPerMile: Record<string, number> = {
          economy: 0.18, hybrid: 0.13, suv: 0.24,
        };
        const costMile = costPerMile[carType] || 0.18;

        const vehicleCosts = weeklyMiles * costMile;
        const insuranceExtra = 28; // rideshare rider per week
        const totalExpenses = vehicleCosts + insuranceExtra;
        const weeklyNet = weeklyGross - totalExpenses;
        const afterTax = weeklyNet * 0.70;
        const trueHourly = hours > 0 ? afterTax / hours : 0;

        return {
          primary: { label: "True Hourly Rate", value: `$${formatNumber(trueHourly, 2)}/hr` },
          details: [
            { label: "Weekly gross (Lyft)", value: `$${formatNumber(weeklyGross, 2)}` },
            { label: "Vehicle costs (all-in)", value: `-$${formatNumber(vehicleCosts, 2)}` },
            { label: "Rideshare insurance", value: `-$${formatNumber(insuranceExtra, 2)}` },
            { label: "Net before tax", value: `$${formatNumber(weeklyNet, 2)}` },
            { label: "Net after tax (30%)", value: `$${formatNumber(afterTax, 2)}` },
            { label: "True hourly rate", value: `$${formatNumber(trueHourly, 2)}/hr` },
            { label: "Monthly net income", value: `$${formatNumber(afterTax * 4.33, 2)}` },
          ],
          note: "Hybrids like Toyota Prius typically earn Lyft drivers 15–25% more per hour due to lower gas costs. Consider vehicle type when optimizing gig income.",
        };
      },
    },
  ],
  relatedSlugs: ["uber-driver-net-earnings-calculator", "rideshare-earnings-comparison-calculator", "gig-worker-quarterly-tax-calculator"],
  faq: [
    {
      question: "Does Lyft or Uber pay more?",
      answer:
        "Earnings vary by city and time of day. In most markets, Uber and Lyft pay similarly ($0.60–$1.20 per mile + time). Uber typically has more rides due to higher market share. Many drivers use both apps to maximize utilization.",
    },
    {
      question: "What is Lyft's commission rate?",
      answer:
        "Lyft takes approximately 25–30% of the passenger fare as a service fee. Drivers see this as the difference between what the passenger pays and what they receive. Lyft does not publicly disclose the exact per-ride commission.",
    },
    {
      question: "How many hours should I drive to make Lyft worthwhile?",
      answer:
        "At $12–$15/hr net, driving Lyft makes sense as a side income at 10–20 hours/week. As a full-time income ($60k equivalent), you'd need to drive 40+ hours/week in a high-demand market. Vehicle wear is the hidden cost that erodes profitability.",
    },
  ],
  formula: "Net Income = Gross − Vehicle Costs (all-in per mile) − Insurance − SE Tax (30%)",
};

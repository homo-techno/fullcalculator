import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const laundryCostCalculator: CalculatorDefinition = {
  slug: "laundry-cost-calculator",
  title: "Laundry Cost Calculator",
  description:
    "Free laundry cost calculator. Compare costs of doing laundry at home vs. a laundromat, including electricity, water, detergent, and machine wear.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "laundry cost calculator",
    "laundromat vs home laundry",
    "laundry cost comparison",
    "washing machine cost",
    "laundry expense",
  ],
  variants: [
    {
      id: "home-cost",
      name: "Home Laundry Cost",
      description: "Calculate the true cost of doing laundry at home",
      fields: [
        {
          name: "loadsPerWeek",
          label: "Loads per Week",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 20,
          step: 1,
          defaultValue: 5,
        },
        {
          name: "electricityRate",
          label: "Electricity Rate",
          type: "number",
          placeholder: "e.g. 0.15",
          prefix: "$",
          suffix: "/kWh",
          min: 0.01,
          max: 1,
          step: 0.01,
          defaultValue: 0.15,
        },
        {
          name: "waterRate",
          label: "Water Rate (per 1000 gal)",
          type: "number",
          placeholder: "e.g. 5",
          prefix: "$",
          min: 1,
          max: 30,
          step: 0.5,
          defaultValue: 5,
        },
        {
          name: "detergentCostPerLoad",
          label: "Detergent Cost per Load",
          type: "number",
          placeholder: "e.g. 0.20",
          prefix: "$",
          min: 0.05,
          max: 1,
          step: 0.01,
          defaultValue: 0.2,
        },
      ],
      calculate: (inputs) => {
        const loads = parseFloat(inputs.loadsPerWeek as string);
        const elecRate = parseFloat(inputs.electricityRate as string);
        const waterRate = parseFloat(inputs.waterRate as string);
        const detergent = parseFloat(inputs.detergentCostPerLoad as string);
        if (!loads || !elecRate || !waterRate || !detergent) return null;

        // Average washer: 0.5 kWh, dryer: 3 kWh per load
        const washerKwh = 0.5;
        const dryerKwh = 3.0;
        const electricityCostPerLoad = (washerKwh + dryerKwh) * elecRate;

        // Average washer uses 15-20 gallons per load
        const gallonsPerLoad = 17;
        const waterCostPerLoad = (gallonsPerLoad / 1000) * waterRate;

        // Machine depreciation: $800 washer + $800 dryer, 12-year life, ~5 loads/week
        const machineDepreciation = 1600 / (12 * 52 * 5);

        const totalPerLoad = electricityCostPerLoad + waterCostPerLoad + detergent + machineDepreciation;
        const weeklyTotal = totalPerLoad * loads;
        const monthlyTotal = weeklyTotal * 4.33;
        const yearlyTotal = weeklyTotal * 52;

        return {
          primary: { label: "Cost per Load (Home)", value: `$${formatNumber(totalPerLoad)}` },
          details: [
            { label: "Electricity per Load", value: `$${formatNumber(electricityCostPerLoad)}` },
            { label: "Water per Load", value: `$${formatNumber(waterCostPerLoad)}` },
            { label: "Detergent per Load", value: `$${formatNumber(detergent)}` },
            { label: "Machine Wear per Load", value: `$${formatNumber(machineDepreciation)}` },
            { label: "Weekly Cost", value: `$${formatNumber(weeklyTotal)}` },
            { label: "Monthly Cost", value: `$${formatNumber(monthlyTotal)}` },
            { label: "Yearly Cost", value: `$${formatNumber(yearlyTotal)}` },
          ],
        };
      },
    },
    {
      id: "comparison",
      name: "Home vs Laundromat",
      description: "Compare home laundry costs to a laundromat",
      fields: [
        {
          name: "loadsPerWeek",
          label: "Loads per Week",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 20,
          step: 1,
          defaultValue: 5,
        },
        {
          name: "laundromatWash",
          label: "Laundromat Wash Price",
          type: "number",
          placeholder: "e.g. 3.50",
          prefix: "$",
          min: 1,
          max: 15,
          step: 0.25,
          defaultValue: 3.5,
        },
        {
          name: "laundromatDry",
          label: "Laundromat Dry Price",
          type: "number",
          placeholder: "e.g. 2.00",
          prefix: "$",
          min: 0.5,
          max: 10,
          step: 0.25,
          defaultValue: 2.0,
        },
        {
          name: "homeCostPerLoad",
          label: "Home Cost per Load (all-in)",
          type: "number",
          placeholder: "e.g. 1.20",
          prefix: "$",
          min: 0.1,
          max: 5,
          step: 0.05,
          defaultValue: 1.2,
        },
      ],
      calculate: (inputs) => {
        const loads = parseFloat(inputs.loadsPerWeek as string);
        const wash = parseFloat(inputs.laundromatWash as string);
        const dry = parseFloat(inputs.laundromatDry as string);
        const homeCost = parseFloat(inputs.homeCostPerLoad as string);
        if (!loads || !wash || !dry || !homeCost) return null;

        const laundromatPerLoad = wash + dry;
        const laundromatYearly = laundromatPerLoad * loads * 52;
        const homeYearly = homeCost * loads * 52;
        const savings = laundromatYearly - homeYearly;
        const winner = savings > 0 ? "Home" : "Laundromat";

        return {
          primary: { label: `${winner} Saves`, value: `$${formatNumber(Math.abs(savings))}/year` },
          details: [
            { label: "Laundromat per Load", value: `$${formatNumber(laundromatPerLoad)}` },
            { label: "Home per Load", value: `$${formatNumber(homeCost)}` },
            { label: "Laundromat Yearly", value: `$${formatNumber(laundromatYearly)}` },
            { label: "Home Yearly", value: `$${formatNumber(homeYearly)}` },
            { label: "Monthly Savings", value: `$${formatNumber(Math.abs(savings) / 12)}` },
          ],
          note: savings > 0
            ? "Home laundry is cheaper. Factor in the upfront cost of machines (~$1,600) which typically pay for themselves in 1-3 years."
            : "Laundromat is cheaper in this scenario, likely due to low load count. Consider the convenience factor too.",
        };
      },
    },
  ],
  relatedSlugs: ["electricity-appliance-calculator", "electricity-calculator"],
  faq: [
    {
      question: "How much does it cost to do a load of laundry at home?",
      answer:
        "The average cost per home laundry load is $1.00-$1.50 including electricity (dryer ~$0.45, washer ~$0.08), water (~$0.09), detergent (~$0.20), and machine depreciation (~$0.50). Actual costs vary by utility rates and machine efficiency.",
    },
    {
      question: "Is it cheaper to do laundry at home or a laundromat?",
      answer:
        "Home laundry is usually cheaper per load ($1.00-$1.50) compared to a laundromat ($4-$7 per load). However, you need to factor in the $1,200-$2,000 upfront cost of machines. For most families, home laundry pays for itself within 1-2 years.",
    },
  ],
  formula:
    "Home Cost/Load = Electricity + Water + Detergent + Machine Depreciation | Savings = (Laundromat Cost - Home Cost) x Loads x 52",
};

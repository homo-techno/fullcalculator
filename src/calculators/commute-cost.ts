import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const commuteTypeOptions = [
  { label: "Car (own vehicle)", value: "car" },
  { label: "Public Transit", value: "transit" },
  { label: "Rideshare (Uber/Lyft)", value: "rideshare" },
  { label: "Motorcycle", value: "motorcycle" },
  { label: "Electric Vehicle", value: "ev" },
  { label: "Bicycle", value: "bike" },
];

export const commuteCostCalculator: CalculatorDefinition = {
  slug: "commute-cost-calculator",
  title: "Commute Cost Calculator",
  description:
    "Free commute cost calculator. Calculate the true cost of your daily commute including fuel, maintenance, parking, tolls, and time value.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "commute cost",
    "commuting cost",
    "commute calculator",
    "driving cost",
    "commute expense",
    "work commute",
  ],
  variants: [
    {
      id: "commute-cost",
      name: "Commute Cost",
      description: "Calculate the full cost of your daily commute",
      fields: [
        {
          name: "commuteType",
          label: "Commute Type",
          type: "select",
          options: commuteTypeOptions,
        },
        {
          name: "distanceMiles",
          label: "One-Way Distance (miles)",
          type: "number",
          placeholder: "e.g. 15",
          min: 0.1,
          max: 200,
          step: 0.1,
        },
        {
          name: "daysPerWeek",
          label: "Commute Days per Week",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 7,
          defaultValue: 5,
        },
        {
          name: "fuelPrice",
          label: "Gas Price ($/gallon) or Transit Pass ($/month)",
          type: "number",
          placeholder: "e.g. 3.50",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "mpg",
          label: "Fuel Efficiency (MPG) — cars only",
          type: "number",
          placeholder: "e.g. 28",
          min: 5,
          max: 150,
          defaultValue: 28,
        },
        {
          name: "parkingMonthly",
          label: "Monthly Parking Cost ($)",
          type: "number",
          placeholder: "e.g. 150",
          min: 0,
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "tollsDaily",
          label: "Daily Tolls (round trip $)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const commuteType = (inputs.commuteType as string) || "car";
        const distance = inputs.distanceMiles as number;
        const daysPerWeek = (inputs.daysPerWeek as number) || 5;
        const fuelPrice = (inputs.fuelPrice as number) || 0;
        const mpg = (inputs.mpg as number) || 28;
        const parking = (inputs.parkingMonthly as number) || 0;
        const tolls = (inputs.tollsDaily as number) || 0;

        if (!distance) return null;

        const roundTrip = distance * 2;
        const monthlyDays = daysPerWeek * 4.345;
        const yearlyDays = daysPerWeek * 52;

        let dailyFuelCost = 0;
        if (commuteType === "car" || commuteType === "motorcycle") {
          dailyFuelCost = (roundTrip / mpg) * fuelPrice;
        } else if (commuteType === "ev") {
          // Assume 3.5 miles/kWh and $0.13/kWh
          dailyFuelCost = (roundTrip / 3.5) * 0.13;
        } else if (commuteType === "transit") {
          dailyFuelCost = fuelPrice / monthlyDays;
        } else if (commuteType === "rideshare") {
          // Rough: $1.50/mile + $3 base
          dailyFuelCost = roundTrip * 1.5 + 3;
        }
        // bike = 0

        const dailyCost = dailyFuelCost + tolls;
        const monthlyCost = dailyCost * monthlyDays + parking;
        const yearlyCost = monthlyCost * 12;

        // Maintenance for cars: ~$0.10/mile
        const maintenanceCostYearly =
          commuteType === "car" || commuteType === "motorcycle"
            ? roundTrip * yearlyDays * 0.1
            : 0;
        const totalYearlyCost = yearlyCost + maintenanceCostYearly;

        const yearlyMiles = roundTrip * yearlyDays;

        return {
          primary: {
            label: "Monthly Commute Cost",
            value: `$${formatNumber(monthlyCost, 2)}`,
          },
          details: [
            { label: "Commute type", value: commuteTypeOptions.find((o) => o.value === commuteType)?.label ?? commuteType },
            { label: "Round trip distance", value: `${formatNumber(roundTrip, 1)} miles` },
            { label: "Daily fuel/fare cost", value: `$${formatNumber(dailyFuelCost, 2)}` },
            { label: "Daily tolls", value: `$${formatNumber(tolls, 2)}` },
            { label: "Monthly parking", value: `$${formatNumber(parking, 2)}` },
            { label: "Yearly commute cost", value: `$${formatNumber(yearlyCost, 2)}` },
            { label: "Yearly maintenance", value: `$${formatNumber(maintenanceCostYearly, 2)}` },
            { label: "Total yearly cost", value: `$${formatNumber(totalYearlyCost, 2)}` },
            { label: "Yearly miles driven", value: formatNumber(yearlyMiles, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "gas-cost-trip-calculator",
    "fuel-cost-calculator",
    "mpg-calculator",
  ],
  faq: [
    {
      question: "What is the average commute cost in the US?",
      answer:
        "The average American spends about $8,000-$12,000 per year on commuting when you include fuel, maintenance, parking, tolls, and vehicle depreciation for a 30-mile round trip.",
    },
    {
      question: "Does the calculator include vehicle depreciation?",
      answer:
        "The calculator includes fuel, tolls, parking, and a basic maintenance estimate ($0.10/mile). For a full cost, add vehicle depreciation (~$0.15-0.25/mile) and insurance attributable to commuting.",
    },
  ],
  formula:
    "Daily Cost = (Round Trip / MPG x Gas Price) + Tolls. Monthly = Daily x Work Days + Parking. Yearly = Monthly x 12 + Maintenance.",
};

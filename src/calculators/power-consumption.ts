import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const powerConsumptionCalculator: CalculatorDefinition = {
  slug: "power-consumption-calculator",
  title: "Power Consumption Calculator",
  description:
    "Free power consumption calculator. Calculate energy consumption in kWh and estimate electricity costs for any device or appliance based on wattage and usage time.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "power consumption",
    "energy consumption calculator",
    "kWh calculator",
    "watt hour calculator",
    "electricity usage",
    "power usage calculator",
  ],
  variants: [
    {
      id: "single-device",
      name: "Single Device Consumption",
      description: "Calculate energy use for one device",
      fields: [
        {
          name: "wattage",
          label: "Device Power (Watts)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "hoursPerDay",
          label: "Hours Used Per Day",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "daysPerMonth",
          label: "Days Per Month",
          type: "number",
          placeholder: "e.g. 30",
          defaultValue: 30,
        },
        {
          name: "costPerKwh",
          label: "Electricity Rate ($/kWh)",
          type: "number",
          placeholder: "e.g. 0.12",
          defaultValue: 0.12,
        },
      ],
      calculate: (inputs) => {
        const watts = inputs.wattage as number;
        const hours = inputs.hoursPerDay as number;
        const days = (inputs.daysPerMonth as number) || 30;
        const rate = (inputs.costPerKwh as number) || 0.12;
        if (!watts || !hours) return null;

        const dailyKwh = (watts * hours) / 1000;
        const monthlyKwh = dailyKwh * days;
        const yearlyKwh = dailyKwh * 365;
        const dailyCost = dailyKwh * rate;
        const monthlyCost = monthlyKwh * rate;
        const yearlyCost = yearlyKwh * rate;

        return {
          primary: {
            label: "Monthly Consumption",
            value: `${formatNumber(monthlyKwh, 2)} kWh`,
          },
          details: [
            { label: "Daily Consumption", value: `${formatNumber(dailyKwh, 4)} kWh` },
            { label: "Monthly Consumption", value: `${formatNumber(monthlyKwh, 2)} kWh` },
            { label: "Yearly Consumption", value: `${formatNumber(yearlyKwh, 2)} kWh` },
            { label: "Daily Cost", value: `$${formatNumber(dailyCost, 2)}` },
            { label: "Monthly Cost", value: `$${formatNumber(monthlyCost, 2)}` },
            { label: "Yearly Cost", value: `$${formatNumber(yearlyCost, 2)}` },
          ],
        };
      },
    },
    {
      id: "compare-devices",
      name: "Compare Two Devices",
      description: "Compare energy consumption and cost between two devices",
      fields: [
        {
          name: "watts1",
          label: "Device 1 Power (W)",
          type: "number",
          placeholder: "e.g. 60",
        },
        {
          name: "watts2",
          label: "Device 2 Power (W)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "hoursPerDay",
          label: "Hours Used Per Day",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "costPerKwh",
          label: "Electricity Rate ($/kWh)",
          type: "number",
          placeholder: "e.g. 0.12",
          defaultValue: 0.12,
        },
      ],
      calculate: (inputs) => {
        const w1 = inputs.watts1 as number;
        const w2 = inputs.watts2 as number;
        const hours = inputs.hoursPerDay as number;
        const rate = (inputs.costPerKwh as number) || 0.12;
        if (!w1 || !w2 || !hours) return null;

        const yearly1 = (w1 * hours * 365) / 1000;
        const yearly2 = (w2 * hours * 365) / 1000;
        const savings = (yearly1 - yearly2) * rate;
        const percentSaved = ((w1 - w2) / w1) * 100;

        return {
          primary: {
            label: "Annual Savings",
            value: `$${formatNumber(Math.abs(savings), 2)}`,
          },
          details: [
            { label: "Device 1 Annual kWh", value: `${formatNumber(yearly1, 2)} kWh ($${formatNumber(yearly1 * rate, 2)})` },
            { label: "Device 2 Annual kWh", value: `${formatNumber(yearly2, 2)} kWh ($${formatNumber(yearly2 * rate, 2)})` },
            { label: "Energy Savings", value: `${formatNumber(Math.abs(yearly1 - yearly2), 2)} kWh/year` },
            { label: "Cost Savings", value: `$${formatNumber(Math.abs(savings), 2)}/year` },
            { label: "Power Reduction", value: `${formatNumber(Math.abs(percentSaved), 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electricity-cost-appliance-calculator", "electrical-power-calculator", "watts-to-amps-calculator"],
  faq: [
    {
      question: "How do I calculate power consumption in kWh?",
      answer:
        "kWh = (Watts × Hours) / 1000. For example, a 100W light bulb running 10 hours uses 1 kWh. Monthly consumption = daily kWh × days per month. Your electric bill is based on total kWh consumed multiplied by the rate per kWh.",
    },
    {
      question: "What uses the most electricity in a home?",
      answer:
        "The largest consumers are typically: HVAC (heating/cooling) at 40-50%, water heating at 14-18%, washer/dryer at 5-10%, lighting at 5-10%, refrigerator at 4-6%, and electronics at 3-5%. Actual percentages vary by climate and household size.",
    },
    {
      question: "How can I reduce power consumption?",
      answer:
        "Switch to LED lights (85% less than incandescent), use Energy Star appliances, unplug devices when not in use (standby power is 5-10% of home energy), use smart power strips, improve insulation, and set thermostats wisely (each degree saves ~3% on HVAC).",
    },
  ],
  formula:
    "kWh = Watts × Hours / 1000 | Cost = kWh × Rate | Monthly = Daily × 30 | Yearly = Daily × 365",
};

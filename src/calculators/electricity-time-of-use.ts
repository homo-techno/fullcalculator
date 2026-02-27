import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricityTimeOfUseCalculator: CalculatorDefinition = {
  slug: "electricity-time-of-use-calculator",
  title: "Time-of-Use Rate Optimization Calculator",
  description:
    "Calculate your savings by switching to a time-of-use electricity rate plan. Optimize when you use energy to take advantage of off-peak pricing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "time of use",
    "tou rates",
    "peak pricing",
    "off-peak electricity",
    "electricity rate plan",
    "demand charges",
  ],
  variants: [
    {
      id: "touAnalysis",
      name: "TOU Rate Analysis",
      description: "Compare flat rate vs time-of-use plan with load shifting",
      fields: [
        { name: "monthlyUsage", label: "Monthly Usage (kWh)", type: "number", placeholder: "e.g. 1000" },
        { name: "flatRate", label: "Current Flat Rate ($/kWh)", type: "number", placeholder: "e.g. 0.15", step: 0.01 },
        { name: "peakRate", label: "TOU Peak Rate ($/kWh)", type: "number", placeholder: "e.g. 0.35", step: 0.01 },
        { name: "midPeakRate", label: "TOU Mid-Peak Rate ($/kWh)", type: "number", placeholder: "e.g. 0.18", step: 0.01 },
        { name: "offPeakRate", label: "TOU Off-Peak Rate ($/kWh)", type: "number", placeholder: "e.g. 0.10", step: 0.01 },
        { name: "peakPercent", label: "Current Peak Usage (%)", type: "number", placeholder: "e.g. 30" },
        { name: "midPeakPercent", label: "Current Mid-Peak Usage (%)", type: "number", placeholder: "e.g. 40" },
        { name: "shiftablePercent", label: "Shiftable Load (%)", type: "number", placeholder: "e.g. 25" },
      ],
      calculate: (inputs) => {
        const monthlyUsage = parseFloat(inputs.monthlyUsage as string);
        const flatRate = parseFloat(inputs.flatRate as string);
        const peakRate = parseFloat(inputs.peakRate as string);
        const midPeakRate = parseFloat(inputs.midPeakRate as string);
        const offPeakRate = parseFloat(inputs.offPeakRate as string);
        const peakPercent = parseFloat(inputs.peakPercent as string);
        const midPeakPercent = parseFloat(inputs.midPeakPercent as string);
        const shiftablePercent = parseFloat(inputs.shiftablePercent as string) || 0;

        if (!monthlyUsage || !flatRate || !peakRate || !offPeakRate || !peakPercent || !midPeakPercent) return null;

        const offPeakPercent = 100 - peakPercent - midPeakPercent;
        const flatCost = monthlyUsage * flatRate;

        const peakKwh = monthlyUsage * (peakPercent / 100);
        const midPeakKwh = monthlyUsage * (midPeakPercent / 100);
        const offPeakKwh = monthlyUsage * (offPeakPercent / 100);

        const touCostNoShift = peakKwh * peakRate + midPeakKwh * midPeakRate + offPeakKwh * offPeakRate;

        const shiftableKwh = monthlyUsage * (shiftablePercent / 100);
        const shiftedFromPeak = Math.min(shiftableKwh * 0.6, peakKwh * 0.5);
        const shiftedFromMid = Math.min(shiftableKwh * 0.4, midPeakKwh * 0.3);

        const newPeakKwh = peakKwh - shiftedFromPeak;
        const newMidKwh = midPeakKwh - shiftedFromMid;
        const newOffPeakKwh = offPeakKwh + shiftedFromPeak + shiftedFromMid;

        const touCostShifted = newPeakKwh * peakRate + newMidKwh * midPeakRate + newOffPeakKwh * offPeakRate;

        const savingsNoShift = flatCost - touCostNoShift;
        const savingsWithShift = flatCost - touCostShifted;
        const shiftBenefit = touCostNoShift - touCostShifted;

        return {
          primary: {
            label: "Monthly Savings (with load shifting)",
            value: `$${formatNumber(savingsWithShift, 2)}`,
          },
          details: [
            { label: "Current Flat Rate Bill", value: `$${formatNumber(flatCost, 2)}` },
            { label: "TOU Bill (no shifting)", value: `$${formatNumber(touCostNoShift, 2)}` },
            { label: "TOU Bill (with shifting)", value: `$${formatNumber(touCostShifted, 2)}` },
            { label: "Savings Without Shifting", value: `$${formatNumber(savingsNoShift, 2)}` },
            { label: "Additional Shifting Savings", value: `$${formatNumber(shiftBenefit, 2)}` },
            { label: "Peak Usage", value: `${formatNumber(peakKwh, 0)} kWh (${formatNumber(peakPercent, 0)}%)` },
            { label: "Off-Peak Usage", value: `${formatNumber(offPeakKwh, 0)} kWh (${formatNumber(offPeakPercent, 0)}%)` },
            { label: "Annual Savings", value: `$${formatNumber(savingsWithShift * 12, 2)}` },
          ],
          note: savingsNoShift < 0
            ? "Warning: TOU may cost more without shifting. You need to move more usage to off-peak hours."
            : `Shifting ${shiftablePercent}% of load saves an additional $${formatNumber(shiftBenefit, 2)}/month.`,
        };
      },
    },
    {
      id: "evCharging",
      name: "EV Charging Optimization",
      description: "Optimize EV charging costs with TOU rates",
      fields: [
        { name: "monthlyKwh", label: "Monthly EV Charging (kWh)", type: "number", placeholder: "e.g. 300" },
        { name: "peakRate", label: "Peak Rate ($/kWh)", type: "number", placeholder: "e.g. 0.35", step: 0.01 },
        { name: "offPeakRate", label: "Off-Peak Rate ($/kWh)", type: "number", placeholder: "e.g. 0.10", step: 0.01 },
        { name: "currentPeakCharging", label: "Current Peak Charging (%)", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const kwh = parseFloat(inputs.monthlyKwh as string);
        const peak = parseFloat(inputs.peakRate as string);
        const offPeak = parseFloat(inputs.offPeakRate as string);
        const peakPct = parseFloat(inputs.currentPeakCharging as string);

        if (!kwh || !peak || !offPeak || !peakPct) return null;

        const currentCost = kwh * (peakPct / 100) * peak + kwh * (1 - peakPct / 100) * offPeak;
        const optimizedCost = kwh * offPeak;
        const savings = currentCost - optimizedCost;

        return {
          primary: { label: "Monthly Savings (charge off-peak)", value: `$${formatNumber(savings, 2)}` },
          details: [
            { label: "Current Monthly Cost", value: `$${formatNumber(currentCost, 2)}` },
            { label: "Optimized Monthly Cost", value: `$${formatNumber(optimizedCost, 2)}` },
            { label: "Annual Savings", value: `$${formatNumber(savings * 12, 2)}` },
            { label: "Off-Peak Cost per Mile (3.5 mi/kWh)", value: `$${formatNumber(offPeak / 3.5, 3)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["solar-battery-payback-calculator", "ev-home-charger-cost-calculator", "smart-thermostat-savings-calculator"],
  faq: [
    {
      question: "What are time-of-use (TOU) electricity rates?",
      answer:
        "TOU rates charge different prices based on when you use electricity. Peak hours (typically 4-9 PM) have the highest rates, while off-peak hours (nights, early mornings) have the lowest. By shifting energy use to off-peak times, you can significantly reduce your bill.",
    },
    {
      question: "What loads can I shift to off-peak hours?",
      answer:
        "Common shiftable loads include: EV charging (use a timer), dishwasher, clothes washer/dryer, pool pump, and water heater. Smart plugs and timers make automation easy. Pre-cooling your home before peak hours with a smart thermostat also helps. These loads typically represent 25-40% of household usage.",
    },
  ],
  formula:
    "Flat Cost = Usage × Flat Rate; TOU Cost = (Peak kWh × Peak Rate) + (Mid-Peak kWh × Mid Rate) + (Off-Peak kWh × Off Rate); Savings = Flat Cost − TOU Cost after load shifting",
};

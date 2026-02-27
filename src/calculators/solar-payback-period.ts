import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarPaybackPeriodCalculator: CalculatorDefinition = {
  slug: "solar-payback-period-calculator",
  title: "Solar Panel Payback Period Calculator",
  description:
    "Calculate how long it takes for solar panels to pay for themselves. Factors in the 30% federal ITC, state incentives, net metering, and electricity rate increases.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "solar payback period",
    "solar roi",
    "solar panel investment",
    "solar break even",
    "solar savings",
    "solar panel cost",
  ],
  variants: [
    {
      id: "detailed",
      name: "Detailed Payback Analysis",
      description: "Full payback calculation with incentives and rate escalation",
      fields: [
        { name: "systemCost", label: "Total System Cost ($)", type: "number", placeholder: "e.g. 25000" },
        { name: "systemSize", label: "System Size (kW)", type: "number", placeholder: "e.g. 8", step: 0.1 },
        { name: "annualProduction", label: "Annual Production (kWh)", type: "number", placeholder: "e.g. 11000" },
        { name: "electricityRate", label: "Current Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.15", step: 0.01 },
        { name: "rateIncrease", label: "Annual Rate Increase (%)", type: "number", placeholder: "e.g. 3", step: 0.1 },
        {
          name: "federalItc",
          label: "Federal ITC Rate (%)",
          type: "select",
          options: [
            { label: "30% (2022-2032)", value: "30" },
            { label: "26% (2033)", value: "26" },
            { label: "22% (2034)", value: "22" },
            { label: "0% (no credit)", value: "0" },
          ],
          defaultValue: "30",
        },
        { name: "stateIncentive", label: "State/Local Incentives ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "srecIncome", label: "Annual SREC Income ($)", type: "number", placeholder: "e.g. 200" },
        {
          name: "netMetering",
          label: "Net Metering",
          type: "select",
          options: [
            { label: "Full retail rate", value: "1.0" },
            { label: "75% of retail", value: "0.75" },
            { label: "50% of retail (avoided cost)", value: "0.50" },
            { label: "No net metering", value: "0.0" },
          ],
          defaultValue: "1.0",
        },
        { name: "selfConsumption", label: "Self-Consumption Rate (%)", type: "number", placeholder: "e.g. 70" },
        { name: "degradation", label: "Annual Panel Degradation (%)", type: "number", placeholder: "e.g. 0.5", step: 0.1 },
      ],
      calculate: (inputs) => {
        const systemCost = parseFloat(inputs.systemCost as string);
        const annualProduction = parseFloat(inputs.annualProduction as string);
        const electricityRate = parseFloat(inputs.electricityRate as string);
        const rateIncrease = parseFloat(inputs.rateIncrease as string) || 3;
        const federalItc = parseFloat(inputs.federalItc as string);
        const stateIncentive = parseFloat(inputs.stateIncentive as string) || 0;
        const srecIncome = parseFloat(inputs.srecIncome as string) || 0;
        const netMeteringRate = parseFloat(inputs.netMetering as string);
        const selfConsumption = parseFloat(inputs.selfConsumption as string) || 70;
        const degradation = parseFloat(inputs.degradation as string) || 0.5;

        if (!systemCost || !annualProduction || !electricityRate) return null;

        const itcAmount = systemCost * (federalItc / 100);
        const netCost = systemCost - itcAmount - stateIncentive;
        const selfRate = selfConsumption / 100;

        let cumulativeSavings = 0;
        let paybackYear = 0;
        let totalSavings25 = 0;

        for (let year = 1; year <= 25; year++) {
          const production = annualProduction * Math.pow(1 - degradation / 100, year - 1);
          const rate = electricityRate * Math.pow(1 + rateIncrease / 100, year - 1);
          const selfConsumed = production * selfRate;
          const exported = production * (1 - selfRate);
          const savingsFromSelf = selfConsumed * rate;
          const savingsFromExport = exported * rate * netMeteringRate;
          const yearSavings = savingsFromSelf + savingsFromExport + srecIncome;

          cumulativeSavings += yearSavings;
          totalSavings25 += yearSavings;

          if (paybackYear === 0 && cumulativeSavings >= netCost) {
            paybackYear = year;
          }
        }

        const roi25 = ((totalSavings25 - netCost) / netCost) * 100;
        const firstYearSavings = annualProduction * electricityRate * (selfRate + (1 - selfRate) * netMeteringRate) + srecIncome;
        const costPerWatt = systemCost / (parseFloat(inputs.systemSize as string) || annualProduction / 1375) / 1000;

        return {
          primary: {
            label: "Solar Payback Period",
            value: paybackYear > 0 ? `${formatNumber(paybackYear, 0)} years` : "25+ years",
          },
          details: [
            { label: "Gross System Cost", value: `$${formatNumber(systemCost, 2)}` },
            { label: "Federal ITC (30%)", value: `-$${formatNumber(itcAmount, 2)}` },
            { label: "State Incentives", value: `-$${formatNumber(stateIncentive, 2)}` },
            { label: "Net System Cost", value: `$${formatNumber(netCost, 2)}` },
            { label: "First Year Savings", value: `$${formatNumber(firstYearSavings, 2)}` },
            { label: "25-Year Total Savings", value: `$${formatNumber(totalSavings25, 2)}` },
            { label: "25-Year Net Profit", value: `$${formatNumber(totalSavings25 - netCost, 2)}` },
            { label: "25-Year ROI", value: `${formatNumber(roi25, 1)}%` },
          ],
          note: `Assumes ${degradation}% annual panel degradation and ${rateIncrease}% annual electricity rate increases.`,
        };
      },
    },
    {
      id: "quick",
      name: "Quick Estimate",
      fields: [
        { name: "systemCost", label: "System Cost ($)", type: "number", placeholder: "e.g. 25000" },
        { name: "monthlyBill", label: "Monthly Electric Bill ($)", type: "number", placeholder: "e.g. 150" },
        { name: "billOffset", label: "Bill Offset (%)", type: "number", placeholder: "e.g. 90" },
      ],
      calculate: (inputs) => {
        const systemCost = parseFloat(inputs.systemCost as string);
        const monthlyBill = parseFloat(inputs.monthlyBill as string);
        const billOffset = parseFloat(inputs.billOffset as string) || 90;

        if (!systemCost || !monthlyBill) return null;

        const itc = systemCost * 0.30;
        const netCost = systemCost - itc;
        const annualSavings = monthlyBill * 12 * (billOffset / 100);
        const payback = netCost / annualSavings;

        return {
          primary: { label: "Estimated Payback", value: `${formatNumber(payback, 1)} years` },
          details: [
            { label: "Net Cost (after 30% ITC)", value: `$${formatNumber(netCost, 2)}` },
            { label: "Annual Savings", value: `$${formatNumber(annualSavings, 2)}` },
            { label: "25-Year Savings", value: `$${formatNumber(annualSavings * 25 - netCost, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["solar-tax-credit-calculator", "solar-battery-payback-calculator", "net-metering-savings-calculator"],
  faq: [
    {
      question: "What is the typical solar panel payback period?",
      answer:
        "The average solar payback period in the US is 6-10 years, depending on your location, electricity rates, and available incentives. States with high electricity rates (CA, MA, NY) often see payback in 5-7 years, while states with low rates may take 10-12 years.",
    },
    {
      question: "How does the 30% federal solar tax credit work?",
      answer:
        "The Investment Tax Credit (ITC) lets you deduct 30% of your solar installation cost from federal taxes. For a $25,000 system, that's $7,500 off your taxes. The 30% rate is available through 2032, then drops to 26% in 2033 and 22% in 2034 under the Inflation Reduction Act.",
    },
  ],
  formula:
    "Net Cost = System Cost − (System Cost × ITC%) − State Incentives; Annual Savings = Σ(Production × (1−Degradation)^yr × Rate × (1+Escalation)^yr); Payback = Year where Cumulative Savings ≥ Net Cost",
};

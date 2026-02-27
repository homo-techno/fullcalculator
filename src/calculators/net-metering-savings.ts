import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const netMeteringSavingsCalculator: CalculatorDefinition = {
  slug: "net-metering-savings-calculator",
  title: "Solar Net Metering Savings Calculator",
  description:
    "Calculate your savings from solar net metering. See how much you earn from exporting excess solar energy back to the grid at retail or reduced rates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "net metering",
    "solar net metering",
    "net metering savings",
    "solar export",
    "feed in tariff",
    "solar buyback",
  ],
  variants: [
    {
      id: "detailed",
      name: "Detailed Net Metering Analysis",
      description: "Monthly breakdown of solar self-consumption vs export",
      fields: [
        { name: "annualProduction", label: "Annual Solar Production (kWh)", type: "number", placeholder: "e.g. 10000" },
        { name: "annualConsumption", label: "Annual Electricity Consumption (kWh)", type: "number", placeholder: "e.g. 12000" },
        { name: "selfConsumptionRate", label: "Self-Consumption Rate (%)", type: "number", placeholder: "e.g. 40" },
        { name: "retailRate", label: "Retail Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.15", step: 0.01 },
        {
          name: "exportCompensation",
          label: "Net Metering Compensation",
          type: "select",
          options: [
            { label: "Full retail (1:1 NEM)", value: "1.0" },
            { label: "75% of retail (NEM 3.0 style)", value: "0.75" },
            { label: "50% of retail", value: "0.50" },
            { label: "Avoided cost (~$0.04-0.06)", value: "0.25" },
          ],
          defaultValue: "1.0",
        },
        { name: "fixedCharges", label: "Monthly Fixed/Connection Charge ($)", type: "number", placeholder: "e.g. 15" },
        { name: "rateEscalation", label: "Annual Rate Increase (%)", type: "number", placeholder: "e.g. 3", step: 0.1 },
        { name: "panelDegradation", label: "Annual Panel Degradation (%)", type: "number", placeholder: "e.g. 0.5", step: 0.1 },
      ],
      calculate: (inputs) => {
        const annualProduction = parseFloat(inputs.annualProduction as string);
        const annualConsumption = parseFloat(inputs.annualConsumption as string);
        const selfRate = parseFloat(inputs.selfConsumptionRate as string) / 100;
        const retailRate = parseFloat(inputs.retailRate as string);
        const exportRate = parseFloat(inputs.exportCompensation as string);
        const fixedCharges = parseFloat(inputs.fixedCharges as string) || 0;
        const escalation = parseFloat(inputs.rateEscalation as string) || 3;
        const degradation = parseFloat(inputs.panelDegradation as string) || 0.5;

        if (!annualProduction || !annualConsumption || !retailRate) return null;

        const selfConsumedKwh = annualProduction * selfRate;
        const exportedKwh = annualProduction * (1 - selfRate);
        const gridPurchased = Math.max(0, annualConsumption - selfConsumedKwh);

        const selfConsumptionValue = selfConsumedKwh * retailRate;
        const exportValue = exportedKwh * retailRate * exportRate;
        const gridCost = gridPurchased * retailRate;
        const fixedAnnual = fixedCharges * 12;

        const withoutSolarBill = annualConsumption * retailRate + fixedAnnual;
        const withSolarBill = gridCost - exportValue + fixedAnnual;
        const netWithSolar = Math.max(fixedAnnual, withSolarBill);
        const annualSavings = withoutSolarBill - netWithSolar;

        let totalSavings25 = 0;
        for (let y = 0; y < 25; y++) {
          const yearProduction = annualProduction * Math.pow(1 - degradation / 100, y);
          const yearRate = retailRate * Math.pow(1 + escalation / 100, y);
          const yearSelfConsumed = yearProduction * selfRate;
          const yearExported = yearProduction * (1 - selfRate);
          const yearGridPurchased = Math.max(0, annualConsumption - yearSelfConsumed);
          const yearSavings =
            (annualConsumption * yearRate + fixedAnnual) -
            (yearGridPurchased * yearRate - yearExported * yearRate * exportRate + fixedAnnual);
          totalSavings25 += Math.max(0, yearSavings);
        }

        const solarOffset = (annualProduction / annualConsumption) * 100;

        return {
          primary: {
            label: "Annual Net Metering Savings",
            value: `$${formatNumber(annualSavings, 2)}`,
          },
          details: [
            { label: "Bill Without Solar", value: `$${formatNumber(withoutSolarBill, 2)}/yr` },
            { label: "Bill With Solar", value: `$${formatNumber(netWithSolar, 2)}/yr` },
            { label: "Self-Consumed Energy", value: `${formatNumber(selfConsumedKwh, 0)} kWh` },
            { label: "Energy Exported", value: `${formatNumber(exportedKwh, 0)} kWh` },
            { label: "Self-Consumption Value", value: `$${formatNumber(selfConsumptionValue, 2)}` },
            { label: "Export Credit Value", value: `$${formatNumber(exportValue, 2)}` },
            { label: "Grid Energy Purchased", value: `${formatNumber(gridPurchased, 0)} kWh` },
            { label: "Solar Offset", value: `${formatNumber(solarOffset, 1)}%` },
            { label: "25-Year Total Savings", value: `$${formatNumber(totalSavings25, 2)}` },
          ],
          note: exportRate < 1
            ? `Export rate is ${formatNumber(exportRate * 100, 0)}% of retail. Maximize self-consumption with battery storage or load shifting to increase savings.`
            : "Full retail net metering (1:1) provides the best solar economics.",
        };
      },
    },
    {
      id: "quick",
      name: "Quick Net Metering Estimate",
      fields: [
        { name: "monthlyBill", label: "Monthly Electric Bill ($)", type: "number", placeholder: "e.g. 150" },
        { name: "solarOffset", label: "Solar Production Offset (%)", type: "number", placeholder: "e.g. 100" },
        { name: "selfConsumption", label: "Self-Consumption (%)", type: "number", placeholder: "e.g. 40" },
        {
          name: "nemRate",
          label: "Export Credit Rate",
          type: "select",
          options: [
            { label: "Full retail (100%)", value: "1.0" },
            { label: "75% of retail", value: "0.75" },
            { label: "50% of retail", value: "0.50" },
          ],
          defaultValue: "1.0",
        },
      ],
      calculate: (inputs) => {
        const bill = parseFloat(inputs.monthlyBill as string);
        const offset = parseFloat(inputs.solarOffset as string) / 100;
        const selfConsume = parseFloat(inputs.selfConsumption as string) / 100;
        const nemRate = parseFloat(inputs.nemRate as string);

        if (!bill || !offset) return null;

        const produced = bill * offset;
        const selfConsumedValue = produced * selfConsume;
        const exportedValue = produced * (1 - selfConsume) * nemRate;
        const monthlySavings = selfConsumedValue + exportedValue;

        return {
          primary: { label: "Monthly Savings", value: `$${formatNumber(monthlySavings, 2)}` },
          details: [
            { label: "Self-Consumption Value", value: `$${formatNumber(selfConsumedValue, 2)}` },
            { label: "Export Credit", value: `$${formatNumber(exportedValue, 2)}` },
            { label: "Remaining Bill", value: `$${formatNumber(Math.max(0, bill - monthlySavings), 2)}` },
            { label: "Annual Savings", value: `$${formatNumber(monthlySavings * 12, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["solar-payback-period-calculator", "solar-battery-payback-calculator", "community-solar-savings-calculator"],
  faq: [
    {
      question: "What is net metering?",
      answer:
        "Net metering is a billing mechanism that credits solar energy system owners for the electricity they export to the grid. When your solar panels produce more than you use, the excess flows to the grid and you receive a credit. At night, you draw from the grid and use those credits. Under full retail net metering (1:1), each kWh exported equals one kWh credit.",
    },
    {
      question: "Is net metering going away?",
      answer:
        "Many states are transitioning from full retail net metering to reduced compensation structures. California's NEM 3.0 significantly reduced export credits. However, most states still offer some form of net metering. Battery storage becomes more valuable when export rates decrease, as self-consuming solar energy is always valued at the full retail rate.",
    },
  ],
  formula:
    "Self-Consumption Value = Self-Consumed kWh × Retail Rate; Export Value = Exported kWh × Retail Rate × NEM Rate; Annual Savings = (Bill Without Solar) − (Grid Purchases − Export Credits + Fixed Charges)",
};

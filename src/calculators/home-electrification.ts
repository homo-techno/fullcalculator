import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeElectrificationCalculator: CalculatorDefinition = {
  slug: "home-electrification-calculator",
  title: "Full Home Electrification Cost & Savings Calculator",
  description:
    "Calculate the total cost and savings of fully electrifying your home. Covers heat pump HVAC, heat pump water heater, induction stove, EV charger, and panel upgrade with IRA incentives.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "home electrification",
    "all electric home",
    "electrify everything",
    "gas to electric",
    "home decarbonization",
    "electrification cost",
  ],
  variants: [
    {
      id: "fullElectrification",
      name: "Full Electrification Plan",
      description: "Complete cost and savings for whole-home electrification",
      fields: [
        { name: "heatPumpHvac", label: "Heat Pump HVAC Cost ($)", type: "number", placeholder: "e.g. 12000" },
        { name: "heatPumpWh", label: "Heat Pump Water Heater Cost ($)", type: "number", placeholder: "e.g. 3500" },
        { name: "inductionStove", label: "Induction Stove Cost ($)", type: "number", placeholder: "e.g. 1500" },
        { name: "electricDryer", label: "Electric Dryer (heat pump) Cost ($)", type: "number", placeholder: "e.g. 1200" },
        { name: "panelUpgrade", label: "Electrical Panel Upgrade ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "evCharger", label: "EV Charger Install ($)", type: "number", placeholder: "e.g. 1500" },
        { name: "monthlyGasBill", label: "Current Monthly Gas Bill ($)", type: "number", placeholder: "e.g. 120" },
        { name: "monthlyElectricBill", label: "Current Monthly Electric Bill ($)", type: "number", placeholder: "e.g. 130" },
        { name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.13", step: 0.01 },
        {
          name: "incomeLevel",
          label: "Income Level (for rebates)",
          type: "select",
          options: [
            { label: "Low (< 80% AMI)", value: "low" },
            { label: "Moderate (80-150% AMI)", value: "moderate" },
            { label: "Above 150% AMI", value: "above" },
          ],
          defaultValue: "moderate",
        },
      ],
      calculate: (inputs) => {
        const heatPumpHvac = parseFloat(inputs.heatPumpHvac as string) || 0;
        const heatPumpWh = parseFloat(inputs.heatPumpWh as string) || 0;
        const inductionStove = parseFloat(inputs.inductionStove as string) || 0;
        const electricDryer = parseFloat(inputs.electricDryer as string) || 0;
        const panelUpgrade = parseFloat(inputs.panelUpgrade as string) || 0;
        const evCharger = parseFloat(inputs.evCharger as string) || 0;
        const monthlyGas = parseFloat(inputs.monthlyGasBill as string);
        const monthlyElectric = parseFloat(inputs.monthlyElectricBill as string);
        const electricityRate = parseFloat(inputs.electricityRate as string);
        const incomeLevel = inputs.incomeLevel as string;

        if (!monthlyGas || !monthlyElectric || !electricityRate) return null;

        const totalProjectCost = heatPumpHvac + heatPumpWh + inductionStove + electricDryer + panelUpgrade + evCharger;

        const rebatePercent = incomeLevel === "low" ? 1.0 : incomeLevel === "moderate" ? 0.5 : 0;
        const homesHvac = Math.min(heatPumpHvac * rebatePercent, 8000);
        const homesWh = Math.min(heatPumpWh * rebatePercent, 1750);
        const homesStove = Math.min(inductionStove * rebatePercent, 840);
        const homesPanel = Math.min(panelUpgrade * rebatePercent, 4000);
        const homesDryer = Math.min(electricDryer * rebatePercent, 840);
        const totalHomesRebate = Math.min(homesHvac + homesWh + homesStove + homesPanel + homesDryer, 14000);

        const taxCredit25C = Math.min(heatPumpHvac * 0.30, 2000) + Math.min(heatPumpWh * 0.30, 2000);
        const cappedTax25C = Math.min(taxCredit25C, 3200);
        const evChargerCredit = Math.min(evCharger * 0.30, 1000);

        const totalIncentives = (incomeLevel !== "above" ? totalHomesRebate : 0) + cappedTax25C + evChargerCredit;
        const netCost = totalProjectCost - totalIncentives;

        const annualGasSaved = monthlyGas * 12;
        const electricIncrease = annualGasSaved * 0.45;
        const annualSavings = annualGasSaved - electricIncrease;
        const paybackYears = annualSavings > 0 ? netCost / annualSavings : 0;

        const newMonthlyElectric = monthlyElectric + electricIncrease / 12;

        return {
          primary: {
            label: "Net Electrification Cost",
            value: `$${formatNumber(netCost, 2)}`,
          },
          details: [
            { label: "Total Project Cost", value: `$${formatNumber(totalProjectCost, 2)}` },
            { label: "HOMES Rebates", value: `-$${formatNumber(incomeLevel !== "above" ? totalHomesRebate : 0, 2)}` },
            { label: "25C Tax Credits", value: `-$${formatNumber(cappedTax25C, 2)}` },
            { label: "EV Charger Credit", value: `-$${formatNumber(evChargerCredit, 2)}` },
            { label: "Total Incentives", value: `$${formatNumber(totalIncentives, 2)}` },
            { label: "Annual Gas Bill Eliminated", value: `$${formatNumber(annualGasSaved, 2)}` },
            { label: "Annual Electric Increase", value: `$${formatNumber(electricIncrease, 2)}` },
            { label: "Net Annual Savings", value: `$${formatNumber(annualSavings, 2)}` },
            { label: "New Monthly Electric", value: `$${formatNumber(newMonthlyElectric, 2)}` },
            { label: "Payback Period", value: paybackYears > 0 ? `${formatNumber(paybackYears, 1)} years` : "N/A" },
          ],
          note: `Electrifying eliminates your $${formatNumber(monthlyGas, 0)}/month gas bill. Heat pumps are 2-4x more efficient than gas for heating, reducing overall energy use.`,
        };
      },
    },
    {
      id: "gasBillElimination",
      name: "Gas Bill Elimination",
      fields: [
        { name: "monthlyGas", label: "Monthly Gas Bill ($)", type: "number", placeholder: "e.g. 120" },
        { name: "monthlyElectric", label: "Monthly Electric Bill ($)", type: "number", placeholder: "e.g. 130" },
        { name: "projectCost", label: "Total Electrification Cost ($)", type: "number", placeholder: "e.g. 20000" },
        { name: "incentives", label: "Total Available Incentives ($)", type: "number", placeholder: "e.g. 12000" },
      ],
      calculate: (inputs) => {
        const gas = parseFloat(inputs.monthlyGas as string);
        const electric = parseFloat(inputs.monthlyElectric as string);
        const cost = parseFloat(inputs.projectCost as string);
        const incentives = parseFloat(inputs.incentives as string) || 0;

        if (!gas || !electric || !cost) return null;

        const netCost = cost - incentives;
        const annualGas = gas * 12;
        const electricIncrease = annualGas * 0.45;
        const netSavings = annualGas - electricIncrease;
        const payback = netSavings > 0 ? netCost / netSavings : 0;

        return {
          primary: { label: "Annual Net Savings", value: `$${formatNumber(netSavings, 2)}` },
          details: [
            { label: "Net Project Cost", value: `$${formatNumber(netCost, 2)}` },
            { label: "Gas Bill Eliminated", value: `$${formatNumber(annualGas, 2)}/yr` },
            { label: "Electric Increase", value: `$${formatNumber(electricIncrease, 2)}/yr` },
            { label: "Payback Period", value: `${formatNumber(payback, 1)} years` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heat-pump-savings-calculator", "energy-rebate-calculator", "ev-home-charger-cost-calculator"],
  faq: [
    {
      question: "How much does full home electrification cost?",
      answer:
        "Full electrification typically costs $15,000-$40,000 depending on what needs replacing. The biggest costs are heat pump HVAC ($8,000-$18,000) and electrical panel upgrades ($2,000-$5,000). With IRA incentives, low-income households can offset up to $14,000, bringing costs down to $5,000-$20,000.",
    },
    {
      question: "Will my electric bill go up if I switch from gas?",
      answer:
        "Your electric bill will increase, but your total energy bill should decrease. Heat pumps are 2-4x more efficient than gas furnaces, so the electricity needed costs less than the gas it replaces. Typical homes see net savings of $500-$1,500/year after eliminating the gas bill.",
    },
  ],
  formula:
    "Net Cost = Total Equipment − HOMES Rebates − 25C Credits − EV Charger Credit; Annual Savings = Gas Bill Eliminated − Electricity Increase; Electricity Increase ≈ 45% of Former Gas Cost (due to heat pump efficiency gains)",
};

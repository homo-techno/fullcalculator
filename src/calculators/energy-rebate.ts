import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const energyRebateCalculator: CalculatorDefinition = {
  slug: "energy-rebate-calculator",
  title: "IRA Energy Efficiency Rebate Calculator",
  description:
    "Calculate your available rebates and tax credits under the Inflation Reduction Act for home energy upgrades including heat pumps, insulation, windows, and appliances.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ira rebate",
    "energy rebate",
    "energy tax credit",
    "homes rebate",
    "25c tax credit",
    "energy efficiency rebate",
    "inflation reduction act",
  ],
  variants: [
    {
      id: "comprehensive",
      name: "Comprehensive IRA Incentives",
      description: "Calculate all available IRA energy efficiency credits and rebates",
      fields: [
        {
          name: "incomeLevel",
          label: "Household Income Level",
          type: "select",
          options: [
            { label: "Low income (< 80% AMI)", value: "low" },
            { label: "Moderate income (80-150% AMI)", value: "moderate" },
            { label: "Above 150% AMI", value: "above" },
          ],
          defaultValue: "moderate",
        },
        { name: "heatPumpCost", label: "Heat Pump HVAC Cost ($)", type: "number", placeholder: "e.g. 12000" },
        { name: "hpWaterHeaterCost", label: "HP Water Heater Cost ($)", type: "number", placeholder: "e.g. 4000" },
        { name: "insulationCost", label: "Insulation & Air Sealing Cost ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "windowsCost", label: "Energy-Efficient Windows Cost ($)", type: "number", placeholder: "e.g. 8000" },
        { name: "doorsCost", label: "Exterior Doors Cost ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "electricPanelCost", label: "Electric Panel Upgrade Cost ($)", type: "number", placeholder: "e.g. 4000" },
        { name: "electricWiringCost", label: "Electric Wiring Cost ($)", type: "number", placeholder: "e.g. 2500" },
        { name: "solarCost", label: "Solar Panel System Cost ($)", type: "number", placeholder: "e.g. 25000" },
        { name: "batteryCost", label: "Battery Storage Cost ($)", type: "number", placeholder: "e.g. 12000" },
        { name: "evChargerCost", label: "EV Charger + Install Cost ($)", type: "number", placeholder: "e.g. 1500" },
      ],
      calculate: (inputs) => {
        const incomeLevel = inputs.incomeLevel as string;
        const heatPumpCost = parseFloat(inputs.heatPumpCost as string) || 0;
        const hpWaterHeaterCost = parseFloat(inputs.hpWaterHeaterCost as string) || 0;
        const insulationCost = parseFloat(inputs.insulationCost as string) || 0;
        const windowsCost = parseFloat(inputs.windowsCost as string) || 0;
        const doorsCost = parseFloat(inputs.doorsCost as string) || 0;
        const electricPanelCost = parseFloat(inputs.electricPanelCost as string) || 0;
        const electricWiringCost = parseFloat(inputs.electricWiringCost as string) || 0;
        const solarCost = parseFloat(inputs.solarCost as string) || 0;
        const batteryCost = parseFloat(inputs.batteryCost as string) || 0;
        const evChargerCost = parseFloat(inputs.evChargerCost as string) || 0;

        const totalProjectCost = heatPumpCost + hpWaterHeaterCost + insulationCost + windowsCost + doorsCost + electricPanelCost + electricWiringCost + solarCost + batteryCost + evChargerCost;
        if (totalProjectCost === 0) return null;

        const homesRebatePercent = incomeLevel === "low" ? 1.0 : incomeLevel === "moderate" ? 0.5 : 0;
        const heatPumpRebate = Math.min(heatPumpCost * homesRebatePercent, 8000);
        const hpWhRebate = Math.min(hpWaterHeaterCost * homesRebatePercent, 1750);
        const insulationRebate = Math.min(insulationCost * homesRebatePercent, 1600);
        const panelRebate = Math.min(electricPanelCost * homesRebatePercent, 4000);
        const wiringRebate = Math.min(electricWiringCost * homesRebatePercent, 2500);

        const totalHomesRebate = heatPumpRebate + hpWhRebate + insulationRebate + panelRebate + wiringRebate;
        const maxHomesRebate = incomeLevel === "low" ? 14000 : incomeLevel === "moderate" ? 14000 : 0;
        const cappedHomesRebate = Math.min(totalHomesRebate, maxHomesRebate);

        const taxCredit25C_heatPump = Math.min(heatPumpCost * 0.30, 2000);
        const taxCredit25C_hpwh = Math.min(hpWaterHeaterCost * 0.30, 2000);
        const taxCredit25C_insulation = Math.min(insulationCost * 0.30, 1200);
        const taxCredit25C_windows = Math.min(windowsCost * 0.30, 600);
        const taxCredit25C_doors = Math.min(doorsCost * 0.30, 500);
        const total25C = Math.min(taxCredit25C_heatPump + taxCredit25C_hpwh + taxCredit25C_insulation + taxCredit25C_windows + taxCredit25C_doors, 3200);

        const solarItc = (solarCost + batteryCost) * 0.30;
        const evChargerCredit = Math.min(evChargerCost * 0.30, 1000);

        const usableRebate = incomeLevel === "above" ? 0 : cappedHomesRebate;
        const totalIncentives = usableRebate + total25C + solarItc + evChargerCredit;
        const effectiveDiscount = totalProjectCost > 0 ? (totalIncentives / totalProjectCost) * 100 : 0;

        return {
          primary: {
            label: "Total Available Incentives",
            value: `$${formatNumber(totalIncentives, 2)}`,
          },
          details: [
            { label: "Total Project Cost", value: `$${formatNumber(totalProjectCost, 2)}` },
            { label: "HOMES Rebates (upfront)", value: `$${formatNumber(usableRebate, 2)}` },
            { label: "25C Tax Credits (annual max $3,200)", value: `$${formatNumber(total25C, 2)}` },
            { label: "Solar + Battery ITC (30%)", value: `$${formatNumber(solarItc, 2)}` },
            { label: "EV Charger Credit (30C)", value: `$${formatNumber(evChargerCredit, 2)}` },
            { label: "Net Cost After Incentives", value: `$${formatNumber(totalProjectCost - totalIncentives, 2)}` },
            { label: "Effective Discount", value: `${formatNumber(effectiveDiscount, 1)}%` },
          ],
          note: incomeLevel === "above"
            ? "Above 150% AMI households are not eligible for HOMES rebates but can claim 25C tax credits, solar ITC, and EV charger credits."
            : `${incomeLevel === "low" ? "Low" : "Moderate"} income households qualify for HOMES rebates covering ${incomeLevel === "low" ? "100%" : "50%"} of costs up to $14,000 total.`,
        };
      },
    },
    {
      id: "single",
      name: "Single Upgrade Credit",
      fields: [
        {
          name: "upgradeType",
          label: "Upgrade Type",
          type: "select",
          options: [
            { label: "Heat Pump (HVAC)", value: "heatpump" },
            { label: "HP Water Heater", value: "hpwh" },
            { label: "Insulation", value: "insulation" },
            { label: "Windows", value: "windows" },
            { label: "Doors", value: "doors" },
          ],
          defaultValue: "heatpump",
        },
        { name: "cost", label: "Upgrade Cost ($)", type: "number", placeholder: "e.g. 12000" },
      ],
      calculate: (inputs) => {
        const upgradeType = inputs.upgradeType as string;
        const cost = parseFloat(inputs.cost as string);

        if (!cost) return null;

        const maxCredits: Record<string, number> = { heatpump: 2000, hpwh: 2000, insulation: 1200, windows: 600, doors: 500 };
        const credit = Math.min(cost * 0.30, maxCredits[upgradeType] || 1200);

        return {
          primary: { label: "25C Tax Credit", value: `$${formatNumber(credit, 2)}` },
          details: [
            { label: "Upgrade Cost", value: `$${formatNumber(cost, 2)}` },
            { label: "Credit Rate", value: "30%" },
            { label: "Credit Cap", value: `$${formatNumber(maxCredits[upgradeType] || 1200, 0)}` },
            { label: "Net Cost", value: `$${formatNumber(cost - credit, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heat-pump-savings-calculator", "solar-tax-credit-calculator", "weatherization-roi-calculator"],
  faq: [
    {
      question: "What is the difference between the HOMES rebate and the 25C tax credit?",
      answer:
        "The HOMES rebate is an upfront point-of-sale discount available to low and moderate income households (up to $14,000). The 25C tax credit is available to everyone regardless of income, up to $3,200/year, and is claimed on your tax return. In some cases, these can be combined for maximum savings.",
    },
    {
      question: "How do I know if I qualify for the HOMES rebate?",
      answer:
        "Qualification is based on Area Median Income (AMI). Households below 80% AMI get 100% of costs covered (up to caps). Those at 80-150% AMI get 50% covered. Check your state's program administrator for specific AMI thresholds in your area.",
    },
    {
      question: "Can I claim these credits over multiple years?",
      answer:
        "Yes! The 25C tax credit has a $3,200 annual limit but resets each year through 2032. You can strategically spread upgrades across tax years to maximize credits. For example, do a heat pump one year ($2,000 credit) and windows + insulation the next ($1,800 credit).",
    },
  ],
  formula:
    "25C Credit = min(30% × Cost, Category Cap); HOMES Rebate = min(Cost × Income%, Category Cap, $14,000 total); Solar ITC = 30% × (Solar + Battery Cost); Total = HOMES + 25C + Solar ITC + EV Charger Credit",
};

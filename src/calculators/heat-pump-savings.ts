import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heatPumpSavingsCalculator: CalculatorDefinition = {
  slug: "heat-pump-savings-calculator",
  title: "Heat Pump vs Traditional HVAC Savings Calculator",
  description:
    "Compare the cost of a heat pump system versus traditional furnace and AC. Calculate installation costs, annual operating savings, and payback period with IRA rebates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "heat pump savings",
    "heat pump vs furnace",
    "heat pump cost",
    "hvac comparison",
    "mini split cost",
    "heat pump rebate",
  ],
  variants: [
    {
      id: "detailed",
      name: "Detailed Comparison",
      description: "Full heat pump vs conventional HVAC analysis",
      fields: [
        {
          name: "heatPumpType",
          label: "Heat Pump Type",
          type: "select",
          options: [
            { label: "Central ducted heat pump", value: "central" },
            { label: "Mini-split (ductless)", value: "minisplit" },
            { label: "Dual-fuel (HP + gas backup)", value: "dualfuel" },
          ],
          defaultValue: "central",
        },
        { name: "hpInstallCost", label: "Heat Pump Install Cost ($)", type: "number", placeholder: "e.g. 12000" },
        { name: "conventionalCost", label: "Conventional HVAC Install Cost ($)", type: "number", placeholder: "e.g. 8000" },
        { name: "homeSize", label: "Home Size (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "heatingDays", label: "Heating Degree Days (annual)", type: "number", placeholder: "e.g. 5000" },
        { name: "coolingDays", label: "Cooling Degree Days (annual)", type: "number", placeholder: "e.g. 1500" },
        {
          name: "currentFuel",
          label: "Current Heating Fuel",
          type: "select",
          options: [
            { label: "Natural Gas ($1.00/therm)", value: "1.00" },
            { label: "Propane ($2.50/gal)", value: "2.50" },
            { label: "Heating Oil ($3.50/gal)", value: "3.50" },
            { label: "Electric Resistance", value: "0" },
          ],
          defaultValue: "1.00",
        },
        { name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.13", step: 0.01 },
        { name: "hspf", label: "Heat Pump HSPF2 Rating", type: "number", placeholder: "e.g. 10", step: 0.1 },
        { name: "seer", label: "Heat Pump SEER2 Rating", type: "number", placeholder: "e.g. 18", step: 0.1 },
        { name: "iraRebate", label: "IRA / State Rebate ($)", type: "number", placeholder: "e.g. 8000" },
      ],
      calculate: (inputs) => {
        const hpInstallCost = parseFloat(inputs.hpInstallCost as string);
        const conventionalCost = parseFloat(inputs.conventionalCost as string);
        const homeSize = parseFloat(inputs.homeSize as string);
        const heatingDays = parseFloat(inputs.heatingDays as string);
        const coolingDays = parseFloat(inputs.coolingDays as string);
        const currentFuelCost = parseFloat(inputs.currentFuel as string);
        const electricityRate = parseFloat(inputs.electricityRate as string);
        const hspf = parseFloat(inputs.hspf as string) || 10;
        const seer = parseFloat(inputs.seer as string) || 18;
        const iraRebate = parseFloat(inputs.iraRebate as string) || 0;

        if (!hpInstallCost || !homeSize || !heatingDays || !electricityRate) return null;

        const heatingLoad = homeSize * heatingDays * 0.018;
        const coolingLoad = homeSize * (coolingDays || 0) * 0.018;

        const hpHeatingCost = (heatingLoad / (hspf * 1000)) * electricityRate * 1000;
        const hpCoolingCost = (coolingLoad / (seer * 1000)) * electricityRate * 1000;
        const hpAnnualCost = hpHeatingCost + hpCoolingCost;

        let conventionalHeatingCost: number;
        if (currentFuelCost === 0) {
          conventionalHeatingCost = (heatingLoad / 3412) * electricityRate;
        } else if (currentFuelCost <= 1.5) {
          conventionalHeatingCost = (heatingLoad / 100000) * currentFuelCost / 0.92 * 1000;
        } else {
          conventionalHeatingCost = (heatingLoad / 91500) * currentFuelCost / 0.85 * 1000;
        }
        const conventionalCoolingCost = (coolingLoad / (13 * 1000)) * electricityRate * 1000;
        const conventionalAnnualCost = conventionalHeatingCost + conventionalCoolingCost;

        const annualSavings = conventionalAnnualCost - hpAnnualCost;
        const costPremium = hpInstallCost - conventionalCost;
        const netPremium = costPremium - iraRebate;
        const paybackYears = annualSavings > 0 ? Math.max(0, netPremium) / annualSavings : 0;

        return {
          primary: {
            label: "Annual Savings with Heat Pump",
            value: `$${formatNumber(annualSavings, 2)}`,
          },
          details: [
            { label: "Heat Pump Annual Cost", value: `$${formatNumber(hpAnnualCost, 2)}` },
            { label: "Conventional Annual Cost", value: `$${formatNumber(conventionalAnnualCost, 2)}` },
            { label: "HP Heating Cost", value: `$${formatNumber(hpHeatingCost, 2)}` },
            { label: "HP Cooling Cost", value: `$${formatNumber(hpCoolingCost, 2)}` },
            { label: "Cost Premium over Conventional", value: `$${formatNumber(costPremium, 2)}` },
            { label: "IRA / State Rebate", value: `-$${formatNumber(iraRebate, 2)}` },
            { label: "Net Additional Cost", value: `$${formatNumber(Math.max(0, netPremium), 2)}` },
            { label: "Payback Period", value: paybackYears > 0 ? `${formatNumber(paybackYears, 1)} years` : "Immediate" },
            { label: "10-Year Net Savings", value: `$${formatNumber(annualSavings * 10 - Math.max(0, netPremium), 2)}` },
          ],
          note: `Heat pump efficiency: HSPF2 ${hspf}, SEER2 ${seer}. IRA HOMES rebate can cover up to $8,000 for qualified heat pump installations.`,
        };
      },
    },
    {
      id: "quick",
      name: "Quick Comparison",
      fields: [
        { name: "currentAnnualHvac", label: "Current Annual HVAC Cost ($)", type: "number", placeholder: "e.g. 2500" },
        { name: "hpEfficiencyGain", label: "Expected Efficiency Gain (%)", type: "number", placeholder: "e.g. 50" },
        { name: "hpCostPremium", label: "HP Cost Premium over Conv. ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "rebate", label: "Available Rebates ($)", type: "number", placeholder: "e.g. 4000" },
      ],
      calculate: (inputs) => {
        const currentCost = parseFloat(inputs.currentAnnualHvac as string);
        const effGain = parseFloat(inputs.hpEfficiencyGain as string);
        const premium = parseFloat(inputs.hpCostPremium as string);
        const rebate = parseFloat(inputs.rebate as string) || 0;

        if (!currentCost || !effGain || !premium) return null;

        const savings = currentCost * (effGain / 100);
        const netPremium = Math.max(0, premium - rebate);
        const payback = savings > 0 ? netPremium / savings : 0;

        return {
          primary: { label: "Estimated Payback", value: `${formatNumber(payback, 1)} years` },
          details: [
            { label: "Annual Savings", value: `$${formatNumber(savings, 2)}` },
            { label: "Net Cost Premium", value: `$${formatNumber(netPremium, 2)}` },
            { label: "10-Year Net Savings", value: `$${formatNumber(savings * 10 - netPremium, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["geothermal-cost-calculator", "home-electrification-calculator", "energy-rebate-calculator"],
  faq: [
    {
      question: "How much can a heat pump save me annually?",
      answer:
        "Savings vary widely based on your current fuel, climate, and electricity rates. Homes switching from oil/propane can save $1,000-$3,000/year. Gas-heated homes in moderate climates save $300-$800/year. Savings are highest with efficient heat pumps (HSPF2 10+) and low electricity rates.",
    },
    {
      question: "What IRA rebates are available for heat pumps?",
      answer:
        "The IRA provides two key incentives: (1) A $2,000 tax credit (25C) for qualified heat pump installation, and (2) HOMES rebate program offering up to $8,000 for heat pumps for low/moderate income households, or up to $4,000 for others. These can potentially be combined.",
    },
    {
      question: "Do heat pumps work in cold climates?",
      answer:
        "Modern cold-climate heat pumps work efficiently down to -15°F or below. Models from Mitsubishi, Daikin, and Bosch maintain high efficiency at very low temperatures. In extreme cold, a dual-fuel system (heat pump + gas backup) provides the best of both worlds.",
    },
  ],
  formula:
    "HP Heating Cost = (Heating Load BTU / HSPF) × Electricity Rate; Conventional Cost = Heating Load / (Fuel BTU × Efficiency) × Fuel Price; Payback = (HP Install − Conv. Install − Rebates) / Annual Savings",
};

import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evHomeChargerCostCalculator: CalculatorDefinition = {
  slug: "ev-home-charger-cost-calculator",
  title: "EV Home Charger Installation Cost Calculator",
  description:
    "Estimate the total cost of installing a Level 2 home EV charger, including equipment, electrical panel upgrades, wiring, permits, and available rebates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ev home charger cost",
    "level 2 charger installation",
    "ev charger install",
    "home ev charging",
    "240v charger cost",
    "evse installation",
  ],
  variants: [
    {
      id: "full",
      name: "Full Installation Estimate",
      description: "Complete cost estimate including electrical work and rebates",
      fields: [
        { name: "chargerCost", label: "Charger Unit Cost ($)", type: "number", placeholder: "e.g. 500" },
        {
          name: "chargerAmp",
          label: "Charger Amperage",
          type: "select",
          options: [
            { label: "32A (Level 2 - 7.7 kW)", value: "32" },
            { label: "40A (Level 2 - 9.6 kW)", value: "40" },
            { label: "48A (Level 2 - 11.5 kW)", value: "48" },
            { label: "80A (Level 2 - 19.2 kW)", value: "80" },
          ],
          defaultValue: "48",
        },
        {
          name: "panelUpgrade",
          label: "Electrical Panel Upgrade Needed?",
          type: "select",
          options: [
            { label: "No upgrade needed", value: "0" },
            { label: "Sub-panel addition ($800-1500)", value: "1200" },
            { label: "Full panel upgrade 200A ($2000-4000)", value: "3000" },
          ],
          defaultValue: "0",
        },
        { name: "wiringDistance", label: "Wiring Distance from Panel (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "permitCost", label: "Permit Cost ($)", type: "number", placeholder: "e.g. 150" },
        { name: "laborRate", label: "Electrician Hourly Rate ($)", type: "number", placeholder: "e.g. 100" },
        { name: "laborHours", label: "Estimated Labor Hours", type: "number", placeholder: "e.g. 6" },
        { name: "rebate", label: "Available Rebates/Credits ($)", type: "number", placeholder: "e.g. 1000" },
        { name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", placeholder: "e.g. 1000" },
        { name: "evEfficiency", label: "EV Efficiency (mi/kWh)", type: "number", placeholder: "e.g. 3.5", step: 0.1 },
        { name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.13", step: 0.01 },
      ],
      calculate: (inputs) => {
        const chargerCost = parseFloat(inputs.chargerCost as string);
        const panelUpgrade = parseFloat(inputs.panelUpgrade as string);
        const wiringDistance = parseFloat(inputs.wiringDistance as string);
        const permitCost = parseFloat(inputs.permitCost as string) || 0;
        const laborRate = parseFloat(inputs.laborRate as string);
        const laborHours = parseFloat(inputs.laborHours as string);
        const rebate = parseFloat(inputs.rebate as string) || 0;
        const monthlyMiles = parseFloat(inputs.monthlyMiles as string);
        const evEfficiency = parseFloat(inputs.evEfficiency as string);
        const electricityRate = parseFloat(inputs.electricityRate as string);

        if (!chargerCost || !wiringDistance || !laborRate || !laborHours) return null;

        const wiringCost = wiringDistance * 8;
        const laborCost = laborRate * laborHours;
        const totalBeforeRebate = chargerCost + panelUpgrade + wiringCost + permitCost + laborCost;
        const totalAfterRebate = totalBeforeRebate - rebate;
        const monthlyEnergy = monthlyMiles && evEfficiency ? monthlyMiles / evEfficiency : 0;
        const monthlyChargeCost = monthlyEnergy * (electricityRate || 0);
        const publicChargingCost = monthlyEnergy * 0.35;
        const monthlySavings = publicChargingCost - monthlyChargeCost;
        const paybackMonths = monthlySavings > 0 ? totalAfterRebate / monthlySavings : 0;

        return {
          primary: {
            label: "Total Installation Cost",
            value: `$${formatNumber(totalAfterRebate, 2)}`,
          },
          details: [
            { label: "Charger Unit", value: `$${formatNumber(chargerCost, 2)}` },
            { label: "Panel Upgrade", value: `$${formatNumber(panelUpgrade, 2)}` },
            { label: "Wiring Cost", value: `$${formatNumber(wiringCost, 2)}` },
            { label: "Labor Cost", value: `$${formatNumber(laborCost, 2)}` },
            { label: "Permit", value: `$${formatNumber(permitCost, 2)}` },
            { label: "Total Before Rebates", value: `$${formatNumber(totalBeforeRebate, 2)}` },
            { label: "Rebates/Credits", value: `-$${formatNumber(rebate, 2)}` },
            ...(monthlySavings > 0
              ? [
                  { label: "Monthly Home Charging Cost", value: `$${formatNumber(monthlyChargeCost, 2)}` },
                  { label: "Monthly Savings vs Public", value: `$${formatNumber(monthlySavings, 2)}` },
                  { label: "Payback Period", value: `${formatNumber(paybackMonths, 0)} months` },
                ]
              : []),
          ],
          note: "The IRA provides a tax credit of up to $1,000 (30%) for home EV charger installation through 2032.",
        };
      },
    },
    {
      id: "simple",
      name: "Quick Estimate",
      description: "Fast estimate based on typical installation scenarios",
      fields: [
        {
          name: "scenario",
          label: "Installation Scenario",
          type: "select",
          options: [
            { label: "Easy - Panel nearby, no upgrade", value: "easy" },
            { label: "Moderate - Some wiring needed", value: "moderate" },
            { label: "Complex - Panel upgrade + long run", value: "complex" },
          ],
          defaultValue: "moderate",
        },
        { name: "chargerCost", label: "Charger Unit Cost ($)", type: "number", placeholder: "e.g. 500" },
        { name: "rebate", label: "Available Rebate ($)", type: "number", placeholder: "e.g. 1000" },
      ],
      calculate: (inputs) => {
        const scenario = inputs.scenario as string;
        const chargerCost = parseFloat(inputs.chargerCost as string);
        const rebate = parseFloat(inputs.rebate as string) || 0;

        if (!chargerCost) return null;

        const installCosts: Record<string, number> = { easy: 500, moderate: 1200, complex: 3500 };
        const installCost = installCosts[scenario] || 1200;
        const total = chargerCost + installCost - rebate;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(total, 2)}` },
          details: [
            { label: "Charger Cost", value: `$${formatNumber(chargerCost, 2)}` },
            { label: "Installation Cost", value: `$${formatNumber(installCost, 2)}` },
            { label: "Rebate", value: `-$${formatNumber(rebate, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ev-lease-vs-buy-calculator", "ev-vs-gas-total-cost-calculator", "electricity-time-of-use-calculator"],
  faq: [
    {
      question: "How much does it cost to install a Level 2 EV charger at home?",
      answer:
        "A typical Level 2 home EV charger installation costs $1,000 to $3,000 total, including a $300-$700 charger unit and $500-$2,000 for installation. Costs increase if you need a panel upgrade ($2,000-$4,000) or long wiring runs. The IRA 30C tax credit covers 30% up to $1,000.",
    },
    {
      question: "Do I need to upgrade my electrical panel for an EV charger?",
      answer:
        "Not always. If your panel is 200 amps and has available breaker slots, you likely don't need an upgrade. Homes with 100-amp panels may need an upgrade to handle the 40-60 amp draw of a Level 2 charger. An electrician can assess your panel capacity.",
    },
  ],
  formula:
    "Total Cost = Charger + Panel Upgrade + (Wiring Distance × $/ft) + (Labor Rate × Hours) + Permits − Rebates; Payback = Net Cost / Monthly Savings vs Public Charging",
};

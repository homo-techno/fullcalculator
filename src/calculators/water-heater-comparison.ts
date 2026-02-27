import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterHeaterComparisonCalculator: CalculatorDefinition = {
  slug: "water-heater-comparison-calculator",
  title: "Water Heater Type Comparison Calculator",
  description:
    "Compare the total cost of ownership for different water heater types: tank, tankless, heat pump, and solar. Includes purchase, installation, energy costs, and available rebates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "water heater comparison",
    "tankless vs tank",
    "heat pump water heater",
    "solar water heater",
    "water heater cost",
    "hot water heater",
  ],
  variants: [
    {
      id: "fullComparison",
      name: "Full Type Comparison",
      description: "Compare 4 water heater types side by side",
      fields: [
        { name: "householdSize", label: "Household Size (people)", type: "number", placeholder: "e.g. 4" },
        { name: "dailyGallons", label: "Daily Hot Water Usage (gallons)", type: "number", placeholder: "e.g. 60" },
        { name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.13", step: 0.01 },
        { name: "gasRate", label: "Natural Gas Rate ($/therm)", type: "number", placeholder: "e.g. 1.00", step: 0.01 },
        { name: "inletTemp", label: "Inlet Water Temperature (°F)", type: "number", placeholder: "e.g. 55" },
        { name: "targetTemp", label: "Target Temperature (°F)", type: "number", placeholder: "e.g. 120" },
        { name: "yearsToCompare", label: "Comparison Period (years)", type: "number", placeholder: "e.g. 15" },
        { name: "energyInflation", label: "Annual Energy Cost Increase (%)", type: "number", placeholder: "e.g. 3", step: 0.1 },
      ],
      calculate: (inputs) => {
        const dailyGallons = parseFloat(inputs.dailyGallons as string);
        const electricityRate = parseFloat(inputs.electricityRate as string);
        const gasRate = parseFloat(inputs.gasRate as string);
        const inletTemp = parseFloat(inputs.inletTemp as string) || 55;
        const targetTemp = parseFloat(inputs.targetTemp as string) || 120;
        const years = parseFloat(inputs.yearsToCompare as string);
        const inflation = parseFloat(inputs.energyInflation as string) || 3;

        if (!dailyGallons || !electricityRate || !gasRate || !years) return null;

        const tempRise = targetTemp - inletTemp;
        const dailyBtu = dailyGallons * 8.34 * tempRise;
        const annualBtu = dailyBtu * 365;

        const types = [
          { name: "Gas Tank", install: 1500, efficiency: 0.60, fuel: "gas", lifespan: 12 },
          { name: "Gas Tankless", install: 3500, efficiency: 0.92, fuel: "gas", lifespan: 20 },
          { name: "Heat Pump (Electric)", install: 3800, efficiency: 3.5, fuel: "electric_hp", lifespan: 15 },
          { name: "Solar + Electric Backup", install: 6000, efficiency: 0.7, fuel: "solar", lifespan: 20 },
        ];

        const results = types.map((t) => {
          let annualEnergyCost: number;
          if (t.fuel === "gas") {
            annualEnergyCost = (annualBtu / 100000 / t.efficiency) * gasRate;
          } else if (t.fuel === "electric_hp") {
            annualEnergyCost = (annualBtu / 3412 / t.efficiency) * electricityRate;
          } else {
            const solarFraction = 0.65;
            const electricNeeded = annualBtu * (1 - solarFraction) / 3412;
            annualEnergyCost = electricNeeded * electricityRate;
          }

          let totalEnergy = 0;
          for (let y = 0; y < years; y++) {
            totalEnergy += annualEnergyCost * Math.pow(1 + inflation / 100, y);
          }

          const replacements = Math.floor(years / t.lifespan);
          const totalInstall = t.install * (1 + replacements);
          const rebate = t.fuel === "electric_hp" ? Math.min(t.install * 0.30, 2000) : 0;
          const totalCost = totalInstall + totalEnergy - rebate;

          return { ...t, annualEnergyCost, totalEnergy, totalCost, rebate };
        });

        const cheapest = results.reduce((a, b) => (a.totalCost < b.totalCost ? a : b));

        return {
          primary: {
            label: `Most Cost-Effective (${years}yr)`,
            value: cheapest.name,
          },
          details: [
            ...results.map((r) => ({
              label: `${r.name} - ${years}yr Total`,
              value: `$${formatNumber(r.totalCost, 2)}`,
            })),
            ...results.map((r) => ({
              label: `${r.name} - Annual Energy`,
              value: `$${formatNumber(r.annualEnergyCost, 2)}`,
            })),
            { label: "Heat Pump Tax Credit (25C)", value: `$${formatNumber(results[2].rebate, 2)}` },
          ],
          note: `${cheapest.name} is the most cost-effective over ${years} years. Heat pump water heaters qualify for a $2,000 IRA tax credit and are 3-4x more efficient than conventional electric tanks.`,
        };
      },
    },
    {
      id: "twoWay",
      name: "Two-Way Comparison",
      fields: [
        {
          name: "type1",
          label: "Option A",
          type: "select",
          options: [
            { label: "Gas Tank ($1,500)", value: "gastank" },
            { label: "Gas Tankless ($3,500)", value: "gastankless" },
            { label: "Heat Pump ($3,800)", value: "heatpump" },
            { label: "Solar ($6,000)", value: "solar" },
          ],
          defaultValue: "gastank",
        },
        {
          name: "type2",
          label: "Option B",
          type: "select",
          options: [
            { label: "Gas Tank ($1,500)", value: "gastank" },
            { label: "Gas Tankless ($3,500)", value: "gastankless" },
            { label: "Heat Pump ($3,800)", value: "heatpump" },
            { label: "Solar ($6,000)", value: "solar" },
          ],
          defaultValue: "heatpump",
        },
        { name: "annualEnergyA", label: "Option A Annual Energy Cost ($)", type: "number", placeholder: "e.g. 600" },
        { name: "annualEnergyB", label: "Option B Annual Energy Cost ($)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const type1 = inputs.type1 as string;
        const type2 = inputs.type2 as string;
        const energyA = parseFloat(inputs.annualEnergyA as string);
        const energyB = parseFloat(inputs.annualEnergyB as string);

        if (!energyA || !energyB) return null;

        const costs: Record<string, number> = { gastank: 1500, gastankless: 3500, heatpump: 3800, solar: 6000 };
        const costA = costs[type1] || 1500;
        const costB = costs[type2] || 3800;
        const rebateB = type2 === "heatpump" ? Math.min(costB * 0.30, 2000) : 0;
        const netCostDiff = (costB - rebateB) - costA;
        const annualSavings = energyA - energyB;
        const payback = annualSavings > 0 && netCostDiff > 0 ? netCostDiff / annualSavings : 0;

        return {
          primary: { label: "Annual Energy Savings (B vs A)", value: `$${formatNumber(annualSavings, 2)}` },
          details: [
            { label: "Option A Install Cost", value: `$${formatNumber(costA, 2)}` },
            { label: "Option B Install Cost (net)", value: `$${formatNumber(costB - rebateB, 2)}` },
            { label: "Cost Difference", value: `$${formatNumber(netCostDiff, 2)}` },
            { label: "Payback Period", value: payback > 0 ? `${formatNumber(payback, 1)} years` : "Immediate" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-electrification-calculator", "energy-rebate-calculator", "heat-pump-savings-calculator"],
  faq: [
    {
      question: "Which water heater type is most cost-effective?",
      answer:
        "Heat pump water heaters are typically the most cost-effective over 10-15 years due to their 3-4x efficiency advantage and the $2,000 IRA tax credit. They cost $3,000-$4,500 installed but save $200-$400/year in energy costs compared to gas tanks. In mild climates, solar water heaters can also be very economical.",
    },
    {
      question: "Is a tankless water heater worth it?",
      answer:
        "Tankless (on-demand) water heaters are 8-34% more energy efficient than tank heaters and last 20+ years vs 10-12 for tanks. However, they cost $2,500-$4,500 to install. They're most worth it for low-usage households or as replacements in homes already plumbed for them.",
    },
  ],
  formula:
    "Annual Energy = (Daily Gallons × 8.34 × Temp Rise × 365) / (Efficiency × Fuel BTU Factor) × Fuel Rate; Total Cost = Install + Σ(Annual Energy × (1+Inflation)^yr) − Rebates",
};

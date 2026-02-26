import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evChargingTimeCalculator: CalculatorDefinition = {
  slug: "ev-charging-time",
  title: "EV Charging Time Calculator",
  description:
    "Free EV charging time calculator. Estimate charge time by charger level, battery size, and current state of charge. Supports Level 1, Level 2, and DC Fast Charging.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "EV charging time",
    "electric vehicle charger",
    "Level 2 charging",
    "DC fast charging",
    "Tesla charging time",
    "EV battery calculator",
    "charging speed calculator",
  ],
  variants: [
    {
      id: "charging-time",
      name: "Charging Time Estimator",
      description: "Calculate time to charge an EV battery",
      fields: [
        {
          name: "batteryCapacity",
          label: "Battery Capacity (kWh)",
          type: "number",
          placeholder: "e.g. 75",
        },
        {
          name: "currentSoC",
          label: "Current State of Charge (%)",
          type: "number",
          placeholder: "e.g. 20",
          min: 0,
          max: 100,
          defaultValue: 20,
        },
        {
          name: "targetSoC",
          label: "Target State of Charge (%)",
          type: "number",
          placeholder: "e.g. 80",
          min: 1,
          max: 100,
          defaultValue: 80,
        },
        {
          name: "chargerLevel",
          label: "Charger Type",
          type: "select",
          options: [
            { label: "Level 1 (120V/12A = 1.4 kW)", value: "1.4" },
            { label: "Level 1 (120V/16A = 1.9 kW)", value: "1.9" },
            { label: "Level 2 (240V/16A = 3.8 kW)", value: "3.8" },
            { label: "Level 2 (240V/32A = 7.7 kW)", value: "7.7" },
            { label: "Level 2 (240V/40A = 9.6 kW)", value: "9.6" },
            { label: "Level 2 (240V/48A = 11.5 kW)", value: "11.5" },
            { label: "Level 2 (240V/80A = 19.2 kW)", value: "19.2" },
            { label: "DC Fast (50 kW)", value: "50" },
            { label: "DC Fast (150 kW)", value: "150" },
            { label: "DC Fast (250 kW / Tesla V3)", value: "250" },
            { label: "DC Fast (350 kW)", value: "350" },
          ],
          defaultValue: "7.7",
        },
      ],
      calculate: (inputs) => {
        const battery = parseFloat(inputs.batteryCapacity as string);
        const currentSoC = parseFloat(inputs.currentSoC as string);
        const targetSoC = parseFloat(inputs.targetSoC as string);
        const chargerKW = parseFloat(inputs.chargerLevel as string);
        if (isNaN(battery) || isNaN(currentSoC) || isNaN(targetSoC) || isNaN(chargerKW)) return null;
        if (battery <= 0 || chargerKW <= 0 || currentSoC >= targetSoC) return null;
        if (currentSoC < 0 || targetSoC > 100) return null;

        const energyNeeded = battery * (targetSoC - currentSoC) / 100;

        // DC fast charging efficiency ~90%, AC ~85% due to onboard charger losses
        const efficiency = chargerKW >= 50 ? 0.90 : 0.85;
        const actualEnergy = energyNeeded / efficiency;

        // DC fast charging slows above 80% SoC - add 50% more time for 80-100%
        let hours: number;
        if (chargerKW >= 50 && targetSoC > 80) {
          const energyTo80 = battery * Math.max(0, 80 - currentSoC) / 100 / efficiency;
          const energyAbove80 = battery * (targetSoC - Math.max(currentSoC, 80)) / 100 / efficiency;
          hours = energyTo80 / chargerKW + energyAbove80 / (chargerKW * 0.5);
        } else {
          hours = actualEnergy / chargerKW;
        }

        const totalMinutes = hours * 60;
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);

        let timeStr = "";
        if (h > 0) timeStr += h + "h ";
        timeStr += m + "m";

        const milesAdded = energyNeeded / 0.3; // ~3.3 mi/kWh average
        const costAt15cents = actualEnergy * 0.15;

        return {
          primary: {
            label: "Estimated Charge Time",
            value: timeStr.trim(),
          },
          details: [
            { label: "Energy Needed", value: formatNumber(energyNeeded, 1) + " kWh" },
            { label: "Incl. Charging Losses", value: formatNumber(actualEnergy, 1) + " kWh" },
            { label: "Charger Power", value: formatNumber(chargerKW, 1) + " kW" },
            { label: "Est. Range Added", value: formatNumber(milesAdded, 0) + " miles" },
            { label: "Est. Cost (@ $0.15/kWh)", value: "$" + formatNumber(costAt15cents, 2) },
            { label: "Charging Efficiency", value: formatNumber(efficiency * 100) + "%" },
          ],
          note: chargerKW >= 50 && targetSoC > 80
            ? "DC fast charging slows significantly above 80% SoC. Charging to 80% is most efficient."
            : undefined,
        };
      },
    },
    {
      id: "ev-range-cost",
      name: "EV vs Gas Cost Comparison",
      description: "Compare fuel costs between EV and gas vehicles",
      fields: [
        {
          name: "annualMiles",
          label: "Annual Miles Driven",
          type: "number",
          placeholder: "e.g. 12000",
          defaultValue: 12000,
        },
        {
          name: "evEfficiency",
          label: "EV Efficiency (mi/kWh)",
          type: "select",
          options: [
            { label: "2.5 mi/kWh (Large SUV)", value: "2.5" },
            { label: "3.0 mi/kWh (SUV/Truck)", value: "3.0" },
            { label: "3.5 mi/kWh (Midsize sedan)", value: "3.5" },
            { label: "4.0 mi/kWh (Compact/efficient)", value: "4.0" },
            { label: "4.5 mi/kWh (Very efficient)", value: "4.5" },
          ],
          defaultValue: "3.5",
        },
        {
          name: "electricityRate",
          label: "Electricity Rate ($/kWh)",
          type: "number",
          placeholder: "e.g. 0.15",
          step: 0.01,
          defaultValue: 0.15,
        },
        {
          name: "gasMPG",
          label: "Gas Vehicle MPG",
          type: "number",
          placeholder: "e.g. 28",
        },
        {
          name: "gasPrice",
          label: "Gas Price ($/gallon)",
          type: "number",
          placeholder: "e.g. 3.50",
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const miles = parseFloat(inputs.annualMiles as string);
        const evEff = parseFloat(inputs.evEfficiency as string);
        const elecRate = parseFloat(inputs.electricityRate as string);
        const mpg = parseFloat(inputs.gasMPG as string);
        const gasPrice = parseFloat(inputs.gasPrice as string);
        if ([miles, evEff, elecRate, mpg, gasPrice].some((v) => isNaN(v) || v <= 0)) return null;

        const evKWh = miles / evEff;
        const evCost = evKWh * elecRate;
        const gasGallons = miles / mpg;
        const gasCost = gasGallons * gasPrice;
        const savings = gasCost - evCost;

        return {
          primary: {
            label: "Annual Fuel Savings with EV",
            value: formatNumber(savings, 2),
            suffix: "$/year",
          },
          details: [
            { label: "EV Annual Fuel Cost", value: "$" + formatNumber(evCost, 2) },
            { label: "Gas Annual Fuel Cost", value: "$" + formatNumber(gasCost, 2) },
            { label: "EV Energy Used", value: formatNumber(evKWh, 0) + " kWh/year" },
            { label: "Gas Used", value: formatNumber(gasGallons, 0) + " gallons/year" },
            { label: "5-Year Savings", value: "$" + formatNumber(savings * 5, 2) },
            { label: "EV Cost per Mile", value: "$" + formatNumber(evCost / miles, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fuel-economy-converter", "fuel-cost-calculator", "electricity-calculator"],
  faq: [
    {
      question: "How long does it take to charge an EV?",
      answer:
        "It varies widely: Level 1 (household outlet) takes 24-60 hours for a full charge. Level 2 (240V home charger) takes 6-12 hours. DC Fast Charging can reach 80% in 20-45 minutes for most EVs. Charging speed depends on battery size and charger power.",
    },
    {
      question: "Why does DC fast charging slow down above 80%?",
      answer:
        "Battery chemistry requires slower charging as the battery fills up to prevent damage and overheating. Above 80%, the charge rate typically drops to 50% or less of peak speed. This is why most EV manufacturers recommend charging to 80% for daily use.",
    },
    {
      question: "How much does it cost to charge an EV?",
      answer:
        "At the US average electricity rate of ~$0.15/kWh, charging a 75 kWh battery costs about $11.25 for a full charge (~250 miles of range). This is roughly equivalent to $1.50/gallon gas in a 30 MPG car. Home charging is cheapest; DC fast charging stations often charge $0.30-0.50/kWh.",
    },
  ],
  formula:
    "Charge Time = Energy Needed / Charger Power | Energy = Battery x (Target% - Current%) / 100 / Efficiency",
};

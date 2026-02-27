import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evRoadTripPlannerCalculator: CalculatorDefinition = {
  slug: "ev-road-trip-planner-calculator",
  title: "EV Road Trip Planner Calculator",
  description:
    "Plan your electric vehicle road trip by estimating charging stops, total charging cost, and trip time. Accounts for real-world range, weather, and charging speeds.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "ev road trip",
    "electric car trip planner",
    "ev charging stops",
    "ev trip cost",
    "ev range calculator",
    "ev travel planner",
  ],
  variants: [
    {
      id: "standard",
      name: "Standard Trip",
      description: "Calculate charging stops and costs for an EV road trip",
      fields: [
        { name: "tripDistance", label: "Total Trip Distance (miles)", type: "number", placeholder: "e.g. 500" },
        { name: "evRange", label: "EV Rated Range (miles)", type: "number", placeholder: "e.g. 300" },
        { name: "batteryCapacity", label: "Battery Capacity (kWh)", type: "number", placeholder: "e.g. 75" },
        { name: "startCharge", label: "Starting Battery (%)", type: "number", placeholder: "e.g. 100" },
        { name: "minArrivalCharge", label: "Min Arrival Charge (%)", type: "number", placeholder: "e.g. 10" },
        { name: "chargingRate", label: "DC Fast Charge Speed (kW)", type: "number", placeholder: "e.g. 150" },
        { name: "chargingCost", label: "Charging Cost ($/kWh)", type: "number", placeholder: "e.g. 0.35", step: 0.01 },
        { name: "averageSpeed", label: "Average Driving Speed (mph)", type: "number", placeholder: "e.g. 65" },
        {
          name: "weatherFactor",
          label: "Weather Condition",
          type: "select",
          options: [
            { label: "Ideal (70°F)", value: "1.0" },
            { label: "Hot (95°F+)", value: "0.90" },
            { label: "Cold (32°F)", value: "0.80" },
            { label: "Very Cold (0°F)", value: "0.65" },
          ],
          defaultValue: "1.0",
        },
      ],
      calculate: (inputs) => {
        const tripDistance = parseFloat(inputs.tripDistance as string);
        const evRange = parseFloat(inputs.evRange as string);
        const batteryCapacity = parseFloat(inputs.batteryCapacity as string);
        const startCharge = parseFloat(inputs.startCharge as string);
        const minArrivalCharge = parseFloat(inputs.minArrivalCharge as string);
        const chargingRate = parseFloat(inputs.chargingRate as string);
        const chargingCost = parseFloat(inputs.chargingCost as string);
        const averageSpeed = parseFloat(inputs.averageSpeed as string);
        const weatherFactor = parseFloat(inputs.weatherFactor as string);

        if (!tripDistance || !evRange || !batteryCapacity || !chargingRate || !averageSpeed) return null;

        const realRange = evRange * weatherFactor;
        const efficiency = batteryCapacity / realRange;
        const usableStart = (startCharge / 100) * realRange;
        const usablePerStop = realRange * 0.80;
        const minReserve = (minArrivalCharge / 100) * realRange;

        const remainingAfterFirst = tripDistance - usableStart + minReserve;
        const chargingStops = remainingAfterFirst > 0 ? Math.ceil(remainingAfterFirst / usablePerStop) : 0;
        const totalEnergyNeeded = tripDistance * efficiency;
        const energyFromStart = (startCharge / 100) * batteryCapacity;
        const energyToCharge = Math.max(0, totalEnergyNeeded - energyFromStart + (minArrivalCharge / 100) * batteryCapacity);
        const totalChargingCost = energyToCharge * chargingCost;
        const avgChargeTime = (usablePerStop * efficiency) / chargingRate;
        const totalChargeTime = chargingStops * avgChargeTime;
        const drivingTime = tripDistance / averageSpeed;
        const totalTripTime = drivingTime + totalChargeTime;
        const costPerMile = totalChargingCost / tripDistance;

        return {
          primary: {
            label: "Charging Stops Needed",
            value: formatNumber(chargingStops, 0),
          },
          details: [
            { label: "Real-World Range", value: `${formatNumber(realRange, 0)} miles` },
            { label: "Total Energy Needed", value: `${formatNumber(totalEnergyNeeded, 1)} kWh` },
            { label: "Energy to Charge", value: `${formatNumber(energyToCharge, 1)} kWh` },
            { label: "Total Charging Cost", value: `$${formatNumber(totalChargingCost, 2)}` },
            { label: "Cost per Mile", value: `$${formatNumber(costPerMile, 3)}` },
            { label: "Avg Charge Time per Stop", value: `${formatNumber(avgChargeTime * 60, 0)} min` },
            { label: "Total Charging Time", value: `${formatNumber(totalChargeTime, 1)} hrs` },
            { label: "Total Trip Time", value: `${formatNumber(totalTripTime, 1)} hrs` },
          ],
          note: `Plan to charge from ~10% to ~90% at each stop for optimal charging speed.`,
        };
      },
    },
    {
      id: "costComparison",
      name: "EV vs Gas Trip Cost",
      description: "Compare EV and gas vehicle trip fuel costs",
      fields: [
        { name: "tripDistance", label: "Trip Distance (miles)", type: "number", placeholder: "e.g. 500" },
        { name: "evEfficiency", label: "EV Efficiency (kWh/100mi)", type: "number", placeholder: "e.g. 28" },
        { name: "electricityCost", label: "Electricity Cost ($/kWh)", type: "number", placeholder: "e.g. 0.35", step: 0.01 },
        { name: "gasMpg", label: "Gas Vehicle MPG", type: "number", placeholder: "e.g. 30" },
        { name: "gasPrice", label: "Gas Price ($/gallon)", type: "number", placeholder: "e.g. 3.50", step: 0.01 },
      ],
      calculate: (inputs) => {
        const tripDistance = parseFloat(inputs.tripDistance as string);
        const evEfficiency = parseFloat(inputs.evEfficiency as string);
        const electricityCost = parseFloat(inputs.electricityCost as string);
        const gasMpg = parseFloat(inputs.gasMpg as string);
        const gasPrice = parseFloat(inputs.gasPrice as string);

        if (!tripDistance || !evEfficiency || !electricityCost || !gasMpg || !gasPrice) return null;

        const evEnergy = (tripDistance / 100) * evEfficiency;
        const evCost = evEnergy * electricityCost;
        const gasGallons = tripDistance / gasMpg;
        const gasCost = gasGallons * gasPrice;
        const savings = gasCost - evCost;

        return {
          primary: {
            label: "EV Fuel Savings",
            value: `$${formatNumber(savings, 2)}`,
          },
          details: [
            { label: "EV Trip Cost", value: `$${formatNumber(evCost, 2)}` },
            { label: "Gas Trip Cost", value: `$${formatNumber(gasCost, 2)}` },
            { label: "EV Energy Used", value: `${formatNumber(evEnergy, 1)} kWh` },
            { label: "Gas Gallons Used", value: `${formatNumber(gasGallons, 1)} gal` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ev-vs-gas-total-cost-calculator", "ev-home-charger-cost-calculator", "ev-battery-degradation-calculator"],
  faq: [
    {
      question: "How long does it take to charge an EV on a road trip?",
      answer:
        "With DC fast charging (150-350 kW), most EVs can charge from 10% to 80% in 20-40 minutes. Charging slows significantly above 80%, so most road-trippers charge to 80% and continue driving. Total charging time depends on the number of stops needed.",
    },
    {
      question: "How much does it cost to charge an EV on a road trip?",
      answer:
        "DC fast charging typically costs $0.30-$0.50 per kWh at public stations. A 300-mile EV might cost $25-$40 to fully charge, compared to $40-$60 in gas for a 30 MPG car over the same distance. Home charging before the trip is much cheaper at around $0.12-$0.15 per kWh.",
    },
    {
      question: "Does cold weather really affect EV range?",
      answer:
        "Yes, significantly. At 0°F, EV range can drop 30-40% due to battery chemistry, cabin heating, and increased rolling resistance. At 32°F, expect about a 20% reduction. Pre-conditioning the battery and cabin while plugged in can help mitigate some of this loss.",
    },
  ],
  formula:
    "Charging Stops = ceil((Trip Distance − Usable Start Range + Min Reserve) / Usable Range per Stop); Trip Cost = Energy Needed (kWh) × Cost per kWh; Energy = Distance × (kWh / mile)",
};

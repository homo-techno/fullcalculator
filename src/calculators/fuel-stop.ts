import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fuelStopCalculator: CalculatorDefinition = {
  slug: "fuel-stop-calculator",
  title: "Fuel Stop Planner Calculator",
  description:
    "Free fuel stop planner. Calculate when and where you need to refuel on a road trip based on tank size, fuel efficiency, and route distance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "fuel stop planner",
    "gas stop calculator",
    "refuel planner",
    "fuel range",
    "tank range calculator",
  ],
  variants: [
    {
      id: "plan",
      name: "Plan Fuel Stops",
      description: "Calculate how many fuel stops you need for a trip",
      fields: [
        {
          name: "tripDistance",
          label: "Total Trip Distance (miles)",
          type: "number",
          placeholder: "e.g. 800",
        },
        {
          name: "tankSize",
          label: "Fuel Tank Size (gallons)",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "mpg",
          label: "Vehicle MPG",
          type: "number",
          placeholder: "e.g. 28",
        },
        {
          name: "startFuel",
          label: "Starting Fuel Level",
          type: "select",
          options: [
            { label: "Full tank", value: "1.0" },
            { label: "3/4 tank", value: "0.75" },
            { label: "1/2 tank", value: "0.5" },
            { label: "1/4 tank", value: "0.25" },
          ],
          defaultValue: "1.0",
        },
        {
          name: "refuelAt",
          label: "Refuel When Tank Reaches",
          type: "select",
          options: [
            { label: "1/4 tank (recommended)", value: "0.25" },
            { label: "1/8 tank (risky)", value: "0.125" },
            { label: "Near empty (not recommended)", value: "0.05" },
          ],
          defaultValue: "0.25",
        },
        {
          name: "gasPrice",
          label: "Gas Price per Gallon ($)",
          type: "number",
          placeholder: "e.g. 3.50",
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const tripDistance = inputs.tripDistance as number;
        const tankSize = inputs.tankSize as number;
        const mpg = inputs.mpg as number;
        const startFuel = parseFloat(inputs.startFuel as string);
        const refuelAt = parseFloat(inputs.refuelAt as string);
        const gasPrice = (inputs.gasPrice as number) || 3.50;
        if (!tripDistance || !tankSize || !mpg || tripDistance <= 0) return null;

        const fullRange = tankSize * mpg;
        const usableRange = (startFuel - refuelAt) * tankSize * mpg;
        const refillRange = (1 - refuelAt) * tankSize * mpg;
        const remainingAfterFirst = tripDistance - usableRange;
        const additionalStops = remainingAfterFirst > 0 ? Math.ceil(remainingAfterFirst / refillRange) : 0;
        const totalStops = additionalStops;

        const totalGallons = tripDistance / mpg;
        const totalFuelCost = totalGallons * gasPrice;
        const milesPerStop = totalStops > 0 ? tripDistance / (totalStops + 1) : tripDistance;

        const stopDistances: string[] = [];
        let milesSoFar = usableRange;
        if (milesSoFar < tripDistance) {
          stopDistances.push(`Stop 1 at mile ${formatNumber(milesSoFar, 0)}`);
          for (let i = 1; i < totalStops; i++) {
            milesSoFar += refillRange;
            if (milesSoFar < tripDistance) {
              stopDistances.push(`Stop ${i + 1} at mile ${formatNumber(milesSoFar, 0)}`);
            }
          }
        }

        return {
          primary: {
            label: "Fuel Stops Needed",
            value: `${totalStops} stop${totalStops !== 1 ? "s" : ""}`,
          },
          details: [
            { label: "Trip distance", value: `${formatNumber(tripDistance, 0)} miles` },
            { label: "Full tank range", value: `${formatNumber(fullRange, 0)} miles` },
            { label: "Usable range (first leg)", value: `${formatNumber(usableRange, 0)} miles` },
            { label: "Range per refill", value: `${formatNumber(refillRange, 0)} miles` },
            { label: "Fuel stops needed", value: `${totalStops}` },
            { label: "Stop locations", value: stopDistances.length > 0 ? stopDistances.join("; ") : "No stops needed" },
            { label: "Total gallons needed", value: `${formatNumber(totalGallons, 1)} gallons` },
            { label: "Total fuel cost", value: `$${formatNumber(totalFuelCost, 2)}` },
          ],
          note: totalStops === 0
            ? `Your vehicle can make this trip on your current tank. You'll use about ${formatNumber(totalGallons, 1)} gallons.`
            : `Plan ${totalStops} fuel stop${totalStops > 1 ? "s" : ""}, approximately every ${formatNumber(milesPerStop, 0)} miles. Total fuel cost: $${formatNumber(totalFuelCost, 2)}.`,
        };
      },
    },
    {
      id: "range",
      name: "Calculate Vehicle Range",
      description: "How far can you drive on your current fuel",
      fields: [
        {
          name: "tankSize",
          label: "Tank Size (gallons)",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "currentFuel",
          label: "Current Fuel Level",
          type: "select",
          options: [
            { label: "Full", value: "1.0" },
            { label: "3/4", value: "0.75" },
            { label: "1/2", value: "0.5" },
            { label: "1/4", value: "0.25" },
            { label: "Low fuel light on", value: "0.1" },
          ],
          defaultValue: "0.5",
        },
        {
          name: "mpg",
          label: "Vehicle MPG",
          type: "number",
          placeholder: "e.g. 28",
        },
      ],
      calculate: (inputs) => {
        const tankSize = inputs.tankSize as number;
        const currentFuel = parseFloat(inputs.currentFuel as string);
        const mpg = inputs.mpg as number;
        if (!tankSize || !mpg) return null;

        const gallonsRemaining = tankSize * currentFuel;
        const range = gallonsRemaining * mpg;
        const safeRange = range * 0.85;
        const rangeKm = range * 1.60934;

        return {
          primary: {
            label: "Estimated Range",
            value: `${formatNumber(range, 0)} miles`,
          },
          details: [
            { label: "Fuel remaining", value: `${formatNumber(gallonsRemaining, 1)} gallons` },
            { label: "Max range", value: `${formatNumber(range, 0)} miles (${formatNumber(rangeKm, 0)} km)` },
            { label: "Safe range (85%)", value: `${formatNumber(safeRange, 0)} miles` },
            { label: "MPG used", value: `${formatNumber(mpg, 1)} mpg` },
          ],
          note: range < 50
            ? "Warning: You have very limited range. Find a gas station soon."
            : `You can safely drive about ${formatNumber(safeRange, 0)} miles before needing to refuel.`,
        };
      },
    },
  ],
  relatedSlugs: ["gas-cost-trip-calculator", "driving-time-calculator", "road-trip-planner-calculator"],
  faq: [
    {
      question: "When should I stop for gas on a road trip?",
      answer:
        "Refuel when your tank reaches 1/4 full. This gives you a safety buffer in case gas stations are far apart or closed. In remote areas (desert, mountain passes), fill up whenever you see a station regardless of fuel level.",
    },
    {
      question: "How do I calculate my car's range?",
      answer:
        "Range = Tank Size (gallons) x MPG. For example, a 15-gallon tank with 28 MPG gives a range of 420 miles on a full tank. Use 85% of this for a safe estimate that accounts for varying driving conditions.",
    },
    {
      question: "Does highway driving use more or less fuel?",
      answer:
        "Most vehicles are most fuel-efficient at 45-65 mph. Highway driving at moderate speeds typically gives better MPG than city driving. However, driving above 65 mph significantly increases fuel consumption due to air resistance - every 5 mph over 50 is like paying an extra $0.20/gallon.",
    },
  ],
  formula:
    "Range = Tank Size x MPG; Usable Range = (Current Level - Refuel Level) x Tank x MPG; Stops = ceil((Trip - First Leg Range) / Refill Range).",
};

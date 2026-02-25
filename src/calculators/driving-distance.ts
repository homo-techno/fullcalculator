import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drivingDistance: CalculatorDefinition = {
  slug: "driving-distance",
  title: "Driving Distance Calculator",
  description:
    "Free online driving distance calculator. Calculate driving distance, travel time, and fuel cost for your road trip.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "driving distance",
    "drive time",
    "fuel cost",
    "road trip distance",
    "travel time",
  ],
  variants: [
    {
      id: "drive-calc",
      name: "Calculate Driving Trip",
      fields: [
        {
          name: "distance",
          label: "Driving Distance",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "distanceUnit",
          label: "Distance Unit",
          type: "select",
          options: [
            { label: "Miles", value: "miles" },
            { label: "Kilometers", value: "km" },
          ],
        },
        {
          name: "avgSpeed",
          label: "Average Speed (mph or km/h)",
          type: "number",
          placeholder: "e.g. 60",
        },
        {
          name: "fuelEfficiency",
          label: "Fuel Efficiency (mpg or km/L)",
          type: "number",
          placeholder: "e.g. 28",
        },
        {
          name: "fuelPrice",
          label: "Fuel Price per Gallon/Liter ($)",
          type: "number",
          placeholder: "e.g. 3.50",
        },
      ],
      calculate: (inputs) => {
        const distance = parseFloat(inputs.distance as string) || 0;
        const distanceUnit = inputs.distanceUnit as string;
        const avgSpeed = parseFloat(inputs.avgSpeed as string) || 60;
        const fuelEfficiency = parseFloat(inputs.fuelEfficiency as string) || 25;
        const fuelPrice = parseFloat(inputs.fuelPrice as string) || 3.5;

        const distMiles = distanceUnit === "km" ? distance / 1.60934 : distance;
        const distKm = distanceUnit === "km" ? distance : distance * 1.60934;

        // Driving time
        const totalHours = distance / avgSpeed;
        const driveH = Math.floor(totalHours);
        const driveM = Math.round((totalHours - driveH) * 60);

        // Add rest stops (15 min every 2 hours)
        const restStops = Math.floor(totalHours / 2);
        const restTimeMin = restStops * 15;
        const totalTripHours = totalHours + restTimeMin / 60;
        const tripH = Math.floor(totalTripHours);
        const tripM = Math.round((totalTripHours - tripH) * 60);

        // Fuel calculation
        const fuelNeeded = distanceUnit === "km"
          ? distance / fuelEfficiency
          : distance / fuelEfficiency;
        const fuelCost = fuelNeeded * fuelPrice;

        // Round trip
        const roundTripFuel = fuelCost * 2;

        return {
          primary: {
            label: "Driving Time",
            value: driveH + "h " + driveM + "m",
          },
          details: [
            { label: "Distance", value: formatNumber(distMiles, 0) + " mi / " + formatNumber(distKm, 0) + " km" },
            { label: "Pure Driving Time", value: driveH + "h " + driveM + "m" },
            { label: "With Rest Stops", value: tripH + "h " + tripM + "m (" + restStops + " stops)" },
            { label: "Fuel Needed", value: formatNumber(fuelNeeded, 1) + (distanceUnit === "km" ? " liters" : " gallons") },
            { label: "One-Way Fuel Cost", value: "$" + formatNumber(fuelCost, 2) },
            { label: "Round Trip Fuel Cost", value: "$" + formatNumber(roundTripFuel, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["road-trip-cost", "distance-between-cities", "travel-budget-daily"],
  faq: [
    {
      question: "How is driving time calculated?",
      answer:
        "Driving time is calculated by dividing the total distance by your average speed. The calculator also adds 15-minute rest stops every 2 hours of driving for a more realistic estimate.",
    },
    {
      question: "What average speed should I use?",
      answer:
        "For highway driving in the US, 60-65 mph is realistic (accounting for traffic, speed limits, and stops). For mixed city/highway, use 40-50 mph. In Europe, use 100-120 km/h for highways.",
    },
    {
      question: "How do I improve fuel efficiency?",
      answer:
        "Maintain steady speeds, use cruise control on highways, keep tires properly inflated, avoid rapid acceleration, remove roof racks when not in use, and keep your vehicle well-maintained.",
    },
  ],
  formula:
    "Driving Time = Distance / Average Speed\nFuel Needed = Distance / Fuel Efficiency\nFuel Cost = Fuel Needed x Price per Gallon",
};

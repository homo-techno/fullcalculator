import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roadTripCost: CalculatorDefinition = {
  slug: "road-trip-cost",
  title: "Road Trip Cost Calculator",
  description:
    "Free online road trip cost calculator. Calculate total road trip cost including fuel, tolls, food, lodging, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "road trip cost",
    "road trip budget",
    "driving cost",
    "road trip planner",
    "trip fuel cost",
  ],
  variants: [
    {
      id: "total-cost",
      name: "Calculate Total Road Trip Cost",
      fields: [
        {
          name: "totalMiles",
          label: "Total Round-Trip Miles",
          type: "number",
          placeholder: "e.g. 1200",
        },
        {
          name: "mpg",
          label: "Vehicle Fuel Efficiency (MPG)",
          type: "number",
          placeholder: "e.g. 28",
        },
        {
          name: "gasPrice",
          label: "Gas Price per Gallon ($)",
          type: "number",
          placeholder: "e.g. 3.50",
        },
        {
          name: "nights",
          label: "Number of Hotel Nights",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "hotelRate",
          label: "Average Hotel Rate per Night ($)",
          type: "number",
          placeholder: "e.g. 120",
        },
        {
          name: "travelers",
          label: "Number of Travelers",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "tollEstimate",
          label: "Estimated Tolls ($)",
          type: "number",
          placeholder: "e.g. 30",
        },
      ],
      calculate: (inputs) => {
        const totalMiles = parseFloat(inputs.totalMiles as string) || 0;
        const mpg = parseFloat(inputs.mpg as string) || 25;
        const gasPrice = parseFloat(inputs.gasPrice as string) || 3.5;
        const nights = parseFloat(inputs.nights as string) || 0;
        const hotelRate = parseFloat(inputs.hotelRate as string) || 120;
        const travelers = parseFloat(inputs.travelers as string) || 1;
        const tollEstimate = parseFloat(inputs.tollEstimate as string) || 0;

        const gallonsNeeded = totalMiles / mpg;
        const fuelCost = gallonsNeeded * gasPrice;
        const hotelCost = nights * hotelRate;
        const mealsPerDay = 3;
        const mealCostPerPerson = 40;
        const foodDays = nights + 1;
        const totalFood = foodDays * mealCostPerPerson * travelers;
        const parkingEstimate = nights * 15;
        const miscPerDay = 10 * travelers;
        const totalMisc = miscPerDay * foodDays;

        const totalCost = fuelCost + hotelCost + totalFood + tollEstimate + parkingEstimate + totalMisc;
        const perPerson = totalCost / travelers;
        const costPerMile = totalCost / Math.max(totalMiles, 1);

        return {
          primary: { label: "Total Road Trip Cost", value: "$" + formatNumber(totalCost, 2) },
          details: [
            { label: "Fuel Cost", value: "$" + formatNumber(fuelCost, 2) + " (" + formatNumber(gallonsNeeded, 1) + " gal)" },
            { label: "Hotels", value: "$" + formatNumber(hotelCost, 2) },
            { label: "Food & Meals", value: "$" + formatNumber(totalFood, 2) },
            { label: "Tolls", value: "$" + formatNumber(tollEstimate, 2) },
            { label: "Parking", value: "$" + formatNumber(parkingEstimate, 2) },
            { label: "Miscellaneous", value: "$" + formatNumber(totalMisc, 2) },
            { label: "Cost per Person", value: "$" + formatNumber(perPerson, 2) },
            { label: "Cost per Mile", value: "$" + formatNumber(costPerMile, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["driving-distance", "distance-between-cities", "travel-budget-daily"],
  faq: [
    {
      question: "How do I estimate road trip fuel costs?",
      answer:
        "Divide your total miles by your vehicle's MPG to get gallons needed, then multiply by the gas price. Use your actual MPG from highway driving, which is usually higher than the EPA combined rating.",
    },
    {
      question: "What are typical road trip expenses?",
      answer:
        "The main expenses are fuel (30-40%), lodging (25-35%), food (20-25%), and miscellaneous costs like tolls, parking, and attractions (10-15%).",
    },
    {
      question: "How can I save money on a road trip?",
      answer:
        "Use gas price apps like GasBuddy, book hotels with rewards points or use camping, pack a cooler with food and drinks, drive at fuel-efficient speeds (55-65 mph), and avoid toll roads when possible.",
    },
  ],
  formula:
    "Total = Fuel Cost + Hotel Cost + Food + Tolls + Parking + Misc\nFuel Cost = (Total Miles / MPG) x Gas Price\nFood = Days x $40/person/day",
};

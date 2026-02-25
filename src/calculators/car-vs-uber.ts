import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carVsUberCalculator: CalculatorDefinition = {
  slug: "car-vs-uber-calculator",
  title: "Car vs Uber Cost Comparison",
  description: "Free car vs Uber cost comparison calculator. Find out if owning a car or using rideshare services is cheaper for your lifestyle.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car vs uber cost", "rideshare vs car", "uber vs owning car", "lyft vs car ownership", "rideshare comparison calculator"],
  variants: [
    {
      id: "monthly",
      name: "Monthly Comparison",
      description: "Compare monthly cost of car ownership vs rideshare",
      fields: [
        { name: "carPayment", label: "Monthly Car Payment", type: "number", placeholder: "e.g. 450", prefix: "$" },
        { name: "carInsurance", label: "Monthly Insurance", type: "number", placeholder: "e.g. 150", prefix: "$" },
        { name: "carFuel", label: "Monthly Fuel", type: "number", placeholder: "e.g. 200", prefix: "$" },
        { name: "carMaintenance", label: "Monthly Maintenance", type: "number", placeholder: "e.g. 80", prefix: "$" },
        { name: "carParking", label: "Monthly Parking", type: "number", placeholder: "e.g. 100", prefix: "$" },
        { name: "uberTrips", label: "Rideshare Trips per Month", type: "number", placeholder: "e.g. 40" },
        { name: "avgUberCost", label: "Avg Cost per Ride", type: "number", placeholder: "e.g. 15", prefix: "$" },
      ],
      calculate: (inputs) => {
        const payment = (inputs.carPayment as number) || 0;
        const insurance = (inputs.carInsurance as number) || 0;
        const fuel = (inputs.carFuel as number) || 0;
        const maintenance = (inputs.carMaintenance as number) || 0;
        const parking = (inputs.carParking as number) || 0;
        const trips = (inputs.uberTrips as number) || 0;
        const avgCost = (inputs.avgUberCost as number) || 0;

        const monthlyCar = payment + insurance + fuel + maintenance + parking;
        const monthlyUber = trips * avgCost;
        const diff = Math.abs(monthlyCar - monthlyUber);
        const cheaper = monthlyCar < monthlyUber ? "Owning a Car" : "Using Rideshare";
        const annualSavings = diff * 12;

        return {
          primary: { label: "Cheaper Option", value: cheaper },
          details: [
            { label: "Monthly car cost", value: `$${formatNumber(monthlyCar)}` },
            { label: "Monthly rideshare cost", value: `$${formatNumber(monthlyUber)}` },
            { label: "Monthly savings", value: `$${formatNumber(diff)}` },
            { label: "Annual savings", value: `$${formatNumber(annualSavings)}` },
            { label: "Cost per car trip (same trips)", value: trips > 0 ? `$${formatNumber(monthlyCar / trips)}` : "N/A" },
          ],
        };
      },
    },
    {
      id: "breakeven",
      name: "Break-Even Trips",
      description: "Calculate how many trips make car ownership worthwhile",
      fields: [
        { name: "monthlyCar", label: "Total Monthly Car Cost", type: "number", placeholder: "e.g. 900", prefix: "$" },
        { name: "avgRideCost", label: "Avg Rideshare Cost per Trip", type: "number", placeholder: "e.g. 15", prefix: "$" },
      ],
      calculate: (inputs) => {
        const car = inputs.monthlyCar as number;
        const ride = inputs.avgRideCost as number;
        if (!car || !ride) return null;

        const breakEvenTrips = Math.ceil(car / ride);
        const weeklyTrips = breakEvenTrips / 4.33;

        return {
          primary: { label: "Break-Even Trips/Month", value: `${breakEvenTrips} trips` },
          details: [
            { label: "That's about", value: `${formatNumber(weeklyTrips, 1)} trips/week` },
            { label: "Or about", value: `${formatNumber(weeklyTrips / 7, 1)} trips/day` },
            { label: "If fewer trips, use", value: "Rideshare" },
            { label: "If more trips, use", value: "Own Car" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fuel-cost-calculator", "car-total-cost-calculator", "car-loan-calculator"],
  faq: [
    { question: "Is it cheaper to Uber or own a car?", answer: "It depends on usage. If you drive less than 10,000 miles/year or take fewer than 3-4 trips daily, rideshare may be cheaper. Car ownership is usually cheaper for frequent drivers or suburban/rural residents." },
    { question: "What costs should I include for car ownership?", answer: "Include loan payment, insurance, fuel, maintenance, parking, registration, depreciation, and any tolls. Many people underestimate the true monthly cost of owning a car by 30-50%." },
  ],
  formula: "Break-Even Trips = Monthly Car Cost / Average Rideshare Cost per Trip",
};

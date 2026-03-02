import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flightTimeEstimatorCalculator: CalculatorDefinition = {
  slug: "flight-time-estimator-calculator",
  title: "Flight Time Estimator Calculator",
  description: "Estimate total door-to-door travel time for a flight including airport time, flight duration, and ground transport.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["flight time estimator","total travel time","door to door flight time","air travel time"],
  variants: [{
    id: "standard",
    name: "Flight Time Estimator",
    description: "Estimate total door-to-door travel time for a flight including airport time, flight duration, and ground transport.",
    fields: [
      { name: "flightHours", label: "Flight Duration (hours)", type: "number", min: 0.5, max: 20, defaultValue: 4 },
      { name: "flightType", label: "Flight Type", type: "select", options: [{ value: "1", label: "Domestic" }, { value: "2", label: "International" }], defaultValue: "1" },
      { name: "driveToAirport", label: "Drive to Airport (minutes)", type: "number", min: 5, max: 180, defaultValue: 45 },
      { name: "driveFromAirport", label: "Drive from Dest. Airport (minutes)", type: "number", min: 5, max: 180, defaultValue: 30 },
      { name: "checkedBags", label: "Checked Bags?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const flightHours = inputs.flightHours as number;
    const flightType = inputs.flightType as string;
    const driveToAirport = inputs.driveToAirport as number;
    const driveFromAirport = inputs.driveFromAirport as number;
    const checkedBags = inputs.checkedBags as string;
    const earlyArrival = flightType === "2" ? 180 : 120;
    const securityMin = flightType === "2" ? 45 : 30;
    const baggageClaim = checkedBags === "1" ? 30 : 0;
    const customsMin = flightType === "2" ? 45 : 0;
    const boardingMin = 30;
    const taxiMin = 15;
    const totalMinutes = driveToAirport + earlyArrival + (flightHours * 60) + taxiMin + customsMin + baggageClaim + driveFromAirport;
    const totalHours = totalMinutes / 60;
    const overheadMinutes = totalMinutes - (flightHours * 60);
    const overheadPct = (overheadMinutes / totalMinutes) * 100;
    return {
      primary: { label: "Total Door-to-Door Time", value: formatNumber(Math.round(totalHours * 10) / 10) + " hours" },
      details: [
        { label: "Flight Time", value: formatNumber(flightHours) + " hours" },
        { label: "Ground/Airport Overhead", value: formatNumber(Math.round(overheadMinutes)) + " minutes" },
        { label: "Arrive at Airport Before", value: formatNumber(earlyArrival) + " min early" },
        { label: "Security Estimate", value: formatNumber(securityMin) + " min" },
        { label: "Overhead % of Total", value: formatNumber(Math.round(overheadPct)) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["flight-cost-per-mile-calculator","travel-budget-calculator","airport-parking-cost-calculator"],
  faq: [
    { question: "How early should I arrive at the airport?", answer: "Arrive 2 hours before domestic flights and 3 hours before international flights. During peak travel seasons, add an extra 30 minutes." },
    { question: "How long does baggage claim take?", answer: "Bags typically appear 20 to 45 minutes after landing for domestic flights. International flights with customs can take 30 to 60 minutes total." },
    { question: "Why is door-to-door time important?", answer: "For short trips, airport overhead can make driving competitive with flying. A 2-hour flight often takes 5 to 6 hours door-to-door." },
  ],
  formula: "Total Time = Drive To + Early Arrival + Flight + Taxi + Customs + Baggage + Drive From",
};

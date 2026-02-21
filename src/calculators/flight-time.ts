import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flightTimeCalculator: CalculatorDefinition = {
  slug: "flight-time-calculator",
  title: "Flight Time Estimator Calculator",
  description:
    "Free flight time estimator calculator. Calculate estimated flight duration based on distance, aircraft type, and route between cities.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "flight time",
    "flight duration",
    "how long is flight",
    "flight hours",
    "air travel time",
  ],
  variants: [
    {
      id: "distance",
      name: "Estimate by Distance",
      description: "Estimate flight time from distance",
      fields: [
        {
          name: "distance",
          label: "Flight Distance",
          type: "number",
          placeholder: "e.g. 3500",
        },
        {
          name: "distanceUnit",
          label: "Distance Unit",
          type: "select",
          options: [
            { label: "Miles", value: "miles" },
            { label: "Kilometers", value: "km" },
            { label: "Nautical Miles", value: "nm" },
          ],
          defaultValue: "miles",
        },
        {
          name: "aircraftType",
          label: "Aircraft Type",
          type: "select",
          options: [
            { label: "Regional Jet (450 mph)", value: "regional" },
            { label: "Narrow-body (530 mph)", value: "narrow" },
            { label: "Wide-body (570 mph)", value: "wide" },
            { label: "Long-haul (580 mph)", value: "longhaul" },
            { label: "Turboprop (350 mph)", value: "turboprop" },
          ],
          defaultValue: "narrow",
        },
        {
          name: "windCondition",
          label: "Wind Condition",
          type: "select",
          options: [
            { label: "Headwind (adds 5-10%)", value: "headwind" },
            { label: "No significant wind", value: "none" },
            { label: "Tailwind (saves 5-10%)", value: "tailwind" },
          ],
          defaultValue: "none",
        },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const distanceUnit = inputs.distanceUnit as string;
        const aircraftType = inputs.aircraftType as string;
        const windCondition = inputs.windCondition as string;
        if (!distance || distance <= 0) return null;

        let distanceMiles = distance;
        if (distanceUnit === "km") distanceMiles = distance * 0.621371;
        else if (distanceUnit === "nm") distanceMiles = distance * 1.15078;

        const speeds: Record<string, number> = {
          regional: 450,
          narrow: 530,
          wide: 570,
          longhaul: 580,
          turboprop: 350,
        };

        const speed = speeds[aircraftType] || 530;
        const windModifiers: Record<string, number> = {
          headwind: 1.08,
          none: 1.0,
          tailwind: 0.92,
        };
        const windMod = windModifiers[windCondition] || 1.0;

        const flightTimeHours = (distanceMiles / speed) * windMod;
        const taxiTime = 0.5;
        const totalTime = flightTimeHours + taxiTime;

        const flightH = Math.floor(flightTimeHours);
        const flightM = Math.round((flightTimeHours - flightH) * 60);
        const totalH = Math.floor(totalTime);
        const totalM = Math.round((totalTime - totalH) * 60);

        const distanceKm = distanceMiles * 1.60934;

        return {
          primary: {
            label: "Estimated Flight Time",
            value: `${flightH}h ${flightM}m`,
          },
          details: [
            { label: "Distance", value: `${formatNumber(distanceMiles, 0)} mi / ${formatNumber(distanceKm, 0)} km` },
            { label: "Aircraft cruise speed", value: `${speed} mph` },
            { label: "Wind adjustment", value: windCondition === "none" ? "None" : windCondition === "headwind" ? "+8%" : "-8%" },
            { label: "Air time", value: `${flightH}h ${flightM}m` },
            { label: "Taxi/boarding time", value: `~30 minutes` },
            { label: "Total gate-to-gate", value: `${totalH}h ${totalM}m` },
          ],
          note: `Estimated ${flightH}h ${flightM}m air time. Add 30-60 minutes for taxi, takeoff, and landing. Actual times may vary based on routing, weather, and air traffic.`,
        };
      },
    },
    {
      id: "popular",
      name: "Popular Route Estimator",
      description: "Estimate flight time for common routes",
      fields: [
        {
          name: "route",
          label: "Route",
          type: "select",
          options: [
            { label: "New York - Los Angeles (2,475 mi)", value: "2475" },
            { label: "New York - London (3,459 mi)", value: "3459" },
            { label: "New York - Paris (3,636 mi)", value: "3636" },
            { label: "Los Angeles - Tokyo (5,478 mi)", value: "5478" },
            { label: "London - Dubai (3,414 mi)", value: "3414" },
            { label: "Sydney - Los Angeles (7,488 mi)", value: "7488" },
            { label: "Chicago - Miami (1,197 mi)", value: "1197" },
            { label: "Dallas - New York (1,374 mi)", value: "1374" },
            { label: "San Francisco - Honolulu (2,397 mi)", value: "2397" },
            { label: "Miami - Cancun (524 mi)", value: "524" },
          ],
          defaultValue: "2475",
        },
        {
          name: "direction",
          label: "Direction",
          type: "select",
          options: [
            { label: "Outbound", value: "outbound" },
            { label: "Return", value: "return" },
          ],
          defaultValue: "outbound",
        },
      ],
      calculate: (inputs) => {
        const routeDistance = parseInt(inputs.route as string);
        const direction = inputs.direction as string;
        if (!routeDistance) return null;

        const speed = routeDistance > 4000 ? 580 : routeDistance > 2000 ? 550 : 530;
        const windMod = direction === "return" ? 0.95 : 1.05;
        const flightTimeHours = (routeDistance / speed) * windMod;

        const flightH = Math.floor(flightTimeHours);
        const flightM = Math.round((flightTimeHours - flightH) * 60);
        const totalH = Math.floor(flightTimeHours + 0.5);
        const totalM = Math.round((flightTimeHours + 0.5 - totalH) * 60);

        return {
          primary: {
            label: "Estimated Flight Time",
            value: `${flightH}h ${flightM}m`,
          },
          details: [
            { label: "Route distance", value: `${formatNumber(routeDistance, 0)} miles` },
            { label: "Average cruise speed", value: `${speed} mph` },
            { label: "Direction effect", value: direction === "return" ? "Slightly faster (tailwind)" : "Slightly slower (headwind)" },
            { label: "Air time", value: `${flightH}h ${flightM}m` },
            { label: "Gate-to-gate", value: `${totalH}h ${totalM}m` },
          ],
          note: direction === "return"
            ? "Eastbound/return flights are typically faster due to prevailing westerly jet stream winds."
            : "Westbound/outbound flights are typically slower due to flying against the jet stream.",
        };
      },
    },
  ],
  relatedSlugs: ["flight-distance-calculator", "layover-time-calculator", "jet-lag-calculator"],
  faq: [
    {
      question: "Why do eastbound flights take less time?",
      answer:
        "Eastbound flights benefit from the jet stream, a high-altitude wind that flows west to east at 100-250 mph. This tailwind effectively increases ground speed, reducing flight time. A New York to London flight takes about 6.5 hours eastbound but 7.5 hours westbound.",
    },
    {
      question: "What is the longest non-stop flight?",
      answer:
        "The longest non-stop commercial flight is Singapore Airlines' Singapore to New York route (SQ23) at approximately 9,537 miles, taking about 18 hours and 40 minutes. Ultra-long-haul flights use specially configured aircraft with extra fuel capacity.",
    },
    {
      question: "How is flight time different from travel time?",
      answer:
        "Flight time is the time from takeoff to landing. Total travel time includes airport arrival (2-3 hours before), taxi time (15-30 minutes each way), customs/immigration, baggage claim, and ground transportation. A 5-hour flight often requires 10-12 hours total.",
    },
  ],
  formula:
    "Flight Time = Distance / Aircraft Speed x Wind Factor; Gate-to-Gate = Flight Time + 30 min taxi/boarding.",
};

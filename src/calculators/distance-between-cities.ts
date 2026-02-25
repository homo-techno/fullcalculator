import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const distanceBetweenCities: CalculatorDefinition = {
  slug: "distance-between-cities",
  title: "Distance Between Cities Calculator",
  description:
    "Free online distance between cities calculator. Calculate the straight-line and approximate driving distance between major world cities.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "distance between cities",
    "city distance",
    "how far",
    "miles between cities",
    "flight distance",
  ],
  variants: [
    {
      id: "city-distance",
      name: "Distance Between Cities",
      fields: [
        {
          name: "fromCity",
          label: "From City",
          type: "select",
          options: [
            { label: "New York, USA", value: "nyc" },
            { label: "Los Angeles, USA", value: "lax" },
            { label: "Chicago, USA", value: "chi" },
            { label: "London, UK", value: "lon" },
            { label: "Paris, France", value: "par" },
            { label: "Tokyo, Japan", value: "tok" },
            { label: "Sydney, Australia", value: "syd" },
            { label: "Dubai, UAE", value: "dxb" },
            { label: "Mexico City, Mexico", value: "mex" },
            { label: "Toronto, Canada", value: "tor" },
            { label: "Bangkok, Thailand", value: "bkk" },
            { label: "Rome, Italy", value: "rom" },
          ],
        },
        {
          name: "toCity",
          label: "To City",
          type: "select",
          options: [
            { label: "New York, USA", value: "nyc" },
            { label: "Los Angeles, USA", value: "lax" },
            { label: "Chicago, USA", value: "chi" },
            { label: "London, UK", value: "lon" },
            { label: "Paris, France", value: "par" },
            { label: "Tokyo, Japan", value: "tok" },
            { label: "Sydney, Australia", value: "syd" },
            { label: "Dubai, UAE", value: "dxb" },
            { label: "Mexico City, Mexico", value: "mex" },
            { label: "Toronto, Canada", value: "tor" },
            { label: "Bangkok, Thailand", value: "bkk" },
            { label: "Rome, Italy", value: "rom" },
          ],
        },
        {
          name: "unit",
          label: "Distance Unit",
          type: "select",
          options: [
            { label: "Miles", value: "miles" },
            { label: "Kilometers", value: "km" },
          ],
        },
      ],
      calculate: (inputs) => {
        const fromCity = inputs.fromCity as string;
        const toCity = inputs.toCity as string;
        const unit = inputs.unit as string;

        // City coordinates (lat, lon)
        const coords: Record<string, [number, number]> = {
          nyc: [40.7128, -74.006],
          lax: [34.0522, -118.2437],
          chi: [41.8781, -87.6298],
          lon: [51.5074, -0.1278],
          par: [48.8566, 2.3522],
          tok: [35.6762, 139.6503],
          syd: [-33.8688, 151.2093],
          dxb: [25.2048, 55.2708],
          mex: [19.4326, -99.1332],
          tor: [43.6532, -79.3832],
          bkk: [13.7563, 100.5018],
          rom: [41.9028, 12.4964],
        };

        if (fromCity === toCity) {
          return {
            primary: { label: "Distance", value: "0" },
            details: [{ label: "Note", value: "Same city selected" }],
          };
        }

        const from = coords[fromCity] || coords.nyc;
        const to = coords[toCity] || coords.nyc;

        // Haversine formula
        const R = 3959; // Earth radius in miles
        const dLat = ((to[0] - from[0]) * Math.PI) / 180;
        const dLon = ((to[1] - from[1]) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((from[0] * Math.PI) / 180) *
            Math.cos((to[0] * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceMiles = R * c;
        const distanceKm = distanceMiles * 1.60934;

        const displayDistance = unit === "km" ? distanceKm : distanceMiles;
        const displayUnit = unit === "km" ? "km" : "miles";

        // Estimate flight time (average 550 mph)
        const flightHours = distanceMiles / 550;
        const flightH = Math.floor(flightHours);
        const flightM = Math.round((flightHours - flightH) * 60);

        return {
          primary: {
            label: "Straight-Line Distance",
            value: formatNumber(displayDistance, 0) + " " + displayUnit,
          },
          details: [
            { label: "Distance (miles)", value: formatNumber(distanceMiles, 0) },
            { label: "Distance (km)", value: formatNumber(distanceKm, 0) },
            { label: "Estimated Flight Time", value: flightH + "h " + flightM + "m" },
            { label: "Nautical Miles", value: formatNumber(distanceMiles * 0.868976, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["driving-distance", "timezone-converter", "travel-budget-daily"],
  faq: [
    {
      question: "How is the distance calculated?",
      answer:
        "The calculator uses the Haversine formula to compute the great-circle distance between two points on Earth, which is the shortest distance over the Earth's surface.",
    },
    {
      question: "Is straight-line distance the same as flight distance?",
      answer:
        "Actual flight distances are typically 5-15% longer than straight-line (great-circle) distances due to air traffic routes, wind patterns, and restricted airspace.",
    },
    {
      question: "How is flight time estimated?",
      answer:
        "Flight time is estimated based on an average cruising speed of 550 mph (885 km/h). Actual times vary based on aircraft type, wind conditions, and routing.",
    },
  ],
  formula:
    "Haversine: d = 2R x arcsin(sqrt(sin²((lat2-lat1)/2) + cos(lat1) x cos(lat2) x sin²((lon2-lon1)/2)))",
};

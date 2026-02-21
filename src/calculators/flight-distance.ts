import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flightDistanceCalculator: CalculatorDefinition = {
  slug: "flight-distance-calculator",
  title: "Flight Distance Calculator",
  description:
    "Free flight distance calculator. Calculate the great circle distance between two coordinates using the Haversine formula. Shows results in km and miles.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "flight distance",
    "great circle",
    "distance calculator",
    "coordinates distance",
    "haversine",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Flight Distance",
      fields: [
        {
          name: "lat1",
          label: "Origin Latitude (degrees)",
          type: "number",
          placeholder: "e.g. 40.7128 (New York)",
        },
        {
          name: "lon1",
          label: "Origin Longitude (degrees)",
          type: "number",
          placeholder: "e.g. -74.0060",
        },
        {
          name: "lat2",
          label: "Destination Latitude (degrees)",
          type: "number",
          placeholder: "e.g. 51.5074 (London)",
        },
        {
          name: "lon2",
          label: "Destination Longitude (degrees)",
          type: "number",
          placeholder: "e.g. -0.1278",
        },
      ],
      calculate: (inputs) => {
        const lat1 = inputs.lat1 as number;
        const lon1 = inputs.lon1 as number;
        const lat2 = inputs.lat2 as number;
        const lon2 = inputs.lon2 as number;

        if (lat1 === undefined || lat1 === null) return null;
        if (lon1 === undefined || lon1 === null) return null;
        if (lat2 === undefined || lat2 === null) return null;
        if (lon2 === undefined || lon2 === null) return null;

        const R = 6371; // Earth's radius in km

        // Convert degrees to radians
        const toRad = (deg: number) => (deg * Math.PI) / 180;

        const phi1 = toRad(lat1);
        const phi2 = toRad(lat2);
        const deltaLambda = toRad(lon2 - lon1);

        // Great circle distance using arccos formula
        const cosD =
          Math.sin(phi1) * Math.sin(phi2) +
          Math.cos(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

        // Clamp to prevent floating point errors with arccos
        const d = R * Math.acos(Math.min(1, Math.max(-1, cosD)));

        const distanceMiles = d * 0.621371;
        const distanceNauticalMiles = d * 0.539957;

        // Estimated flight time (average speed ~900 km/h for commercial jets)
        const flightHours = d / 900;
        const hours = Math.floor(flightHours);
        const minutes = Math.round((flightHours - hours) * 60);

        return {
          primary: {
            label: "Distance",
            value: `${formatNumber(d, 1)} km`,
          },
          details: [
            {
              label: "Origin",
              value: `${formatNumber(lat1, 4)}, ${formatNumber(lon1, 4)}`,
            },
            {
              label: "Destination",
              value: `${formatNumber(lat2, 4)}, ${formatNumber(lon2, 4)}`,
            },
            {
              label: "Distance (km)",
              value: `${formatNumber(d, 1)} km`,
            },
            {
              label: "Distance (miles)",
              value: `${formatNumber(distanceMiles, 1)} mi`,
            },
            {
              label: "Distance (nautical miles)",
              value: `${formatNumber(distanceNauticalMiles, 1)} nmi`,
            },
            {
              label: "Est. Flight Time (~900 km/h)",
              value: `${hours}h ${minutes}m`,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["travel-budget-calculator", "jet-lag-calculator"],
  faq: [
    {
      question: "How is the great circle distance calculated?",
      answer:
        "Using the spherical law of cosines: d = R x arccos(sin(lat1) x sin(lat2) + cos(lat1) x cos(lat2) x cos(lon2-lon1)), where R is Earth's radius (6,371 km).",
    },
    {
      question: "Is this the actual flight distance?",
      answer:
        "This is the shortest distance between two points on the Earth's surface (great circle distance). Actual flight paths may be longer due to air traffic routes, weather, and restricted airspace.",
    },
  ],
  formula:
    "d = R x arccos(sin(phi1) x sin(phi2) + cos(phi1) x cos(phi2) x cos(delta_lambda)), where R = 6,371 km.",
};

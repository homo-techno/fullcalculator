import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const latitudeLongitudeCalculator: CalculatorDefinition = {
  slug: "latitude-longitude-calculator",
  title: "Latitude/Longitude Distance Calculator",
  description:
    "Free latitude/longitude distance calculator. Calculate the exact distance between two GPS coordinates using the Haversine formula.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "latitude longitude distance",
    "GPS distance",
    "coordinate distance",
    "haversine formula",
    "lat long calculator",
  ],
  variants: [
    {
      id: "distance",
      name: "Distance Between Coordinates",
      description: "Calculate distance between two lat/long points",
      fields: [
        {
          name: "lat1",
          label: "Point 1 Latitude",
          type: "number",
          placeholder: "e.g. 40.7128 (New York)",
          step: 0.0001,
        },
        {
          name: "lon1",
          label: "Point 1 Longitude",
          type: "number",
          placeholder: "e.g. -74.0060",
          step: 0.0001,
        },
        {
          name: "lat2",
          label: "Point 2 Latitude",
          type: "number",
          placeholder: "e.g. 34.0522 (Los Angeles)",
          step: 0.0001,
        },
        {
          name: "lon2",
          label: "Point 2 Longitude",
          type: "number",
          placeholder: "e.g. -118.2437",
          step: 0.0001,
        },
      ],
      calculate: (inputs) => {
        const lat1 = inputs.lat1 as number;
        const lon1 = inputs.lon1 as number;
        const lat2 = inputs.lat2 as number;
        const lon2 = inputs.lon2 as number;
        if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return null;
        if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) return null;

        const R = 6371;
        const toRad = (deg: number) => (deg * Math.PI) / 180;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;
        const distanceMiles = distanceKm * 0.621371;
        const distanceNm = distanceKm * 0.539957;
        const distanceFeet = distanceMiles * 5280;
        const distanceMeters = distanceKm * 1000;

        const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
        const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
          Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
        const bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

        const midLat = (lat1 + lat2) / 2;
        const midLon = (lon1 + lon2) / 2;

        return {
          primary: {
            label: "Distance",
            value: `${formatNumber(distanceKm, 2)} km (${formatNumber(distanceMiles, 2)} mi)`,
          },
          details: [
            { label: "Point 1", value: `${formatNumber(lat1, 4)}, ${formatNumber(lon1, 4)}` },
            { label: "Point 2", value: `${formatNumber(lat2, 4)}, ${formatNumber(lon2, 4)}` },
            { label: "Distance (km)", value: `${formatNumber(distanceKm, 2)} km` },
            { label: "Distance (miles)", value: `${formatNumber(distanceMiles, 2)} mi` },
            { label: "Distance (nautical miles)", value: `${formatNumber(distanceNm, 2)} nm` },
            { label: "Distance (meters)", value: `${formatNumber(distanceMeters, 0)} m` },
            { label: "Initial bearing", value: `${formatNumber(bearing, 1)}°` },
            { label: "Midpoint", value: `${formatNumber(midLat, 4)}, ${formatNumber(midLon, 4)}` },
          ],
        };
      },
    },
    {
      id: "dms",
      name: "DMS to Decimal Converter",
      description: "Convert degrees-minutes-seconds to decimal coordinates",
      fields: [
        {
          name: "degrees",
          label: "Degrees",
          type: "number",
          placeholder: "e.g. 40",
        },
        {
          name: "minutes",
          label: "Minutes",
          type: "number",
          placeholder: "e.g. 42",
        },
        {
          name: "seconds",
          label: "Seconds",
          type: "number",
          placeholder: "e.g. 46.08",
          step: 0.01,
        },
        {
          name: "direction",
          label: "Direction",
          type: "select",
          options: [
            { label: "North (N)", value: "N" },
            { label: "South (S)", value: "S" },
            { label: "East (E)", value: "E" },
            { label: "West (W)", value: "W" },
          ],
          defaultValue: "N",
        },
      ],
      calculate: (inputs) => {
        const degrees = inputs.degrees as number;
        const minutes = (inputs.minutes as number) || 0;
        const seconds = (inputs.seconds as number) || 0;
        const direction = inputs.direction as string;
        if (degrees === undefined || degrees === null) return null;

        const decimal = degrees + minutes / 60 + seconds / 3600;
        const signed = direction === "S" || direction === "W" ? -decimal : decimal;

        return {
          primary: {
            label: "Decimal Degrees",
            value: `${formatNumber(signed, 6)}°`,
          },
          details: [
            { label: "DMS input", value: `${degrees}° ${minutes}' ${formatNumber(seconds, 2)}" ${direction}` },
            { label: "Decimal degrees", value: `${formatNumber(signed, 6)}` },
            { label: "Formula", value: `${degrees} + ${minutes}/60 + ${formatNumber(seconds, 2)}/3600` },
          ],
          note: `${degrees}° ${minutes}' ${formatNumber(seconds, 2)}" ${direction} = ${formatNumber(signed, 6)} decimal degrees. Use negative values for South latitude and West longitude.`,
        };
      },
    },
  ],
  relatedSlugs: ["map-distance-calculator", "flight-distance-calculator"],
  faq: [
    {
      question: "What is the Haversine formula?",
      answer:
        "The Haversine formula calculates the shortest distance between two points on a sphere from their latitudes and longitudes. It accounts for Earth's curvature, making it more accurate than simple Euclidean distance for geographic calculations. Formula: a = sin2(dlat/2) + cos(lat1) x cos(lat2) x sin2(dlon/2).",
    },
    {
      question: "How do I find GPS coordinates?",
      answer:
        "In Google Maps, right-click any location and select the coordinates shown. On iPhone, use the Compass app or drop a pin in Maps. On Android, long-press in Google Maps. Coordinates are shown as latitude (N/S) and longitude (E/W) in decimal degrees.",
    },
    {
      question: "What is the difference between DMS and decimal degrees?",
      answer:
        "DMS (degrees-minutes-seconds) format looks like 40° 42' 46\" N. Decimal degrees format is 40.7128°. To convert: Decimal = Degrees + Minutes/60 + Seconds/3600. Most GPS apps and mapping software use decimal degrees.",
    },
  ],
  formula:
    "Haversine: a = sin2((lat2-lat1)/2) + cos(lat1) x cos(lat2) x sin2((lon2-lon1)/2); d = 2R x atan2(sqrt(a), sqrt(1-a)); R = 6,371 km.",
};

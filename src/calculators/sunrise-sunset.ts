import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sunriseSunsetCalculator: CalculatorDefinition = {
  slug: "sunrise-sunset-calculator",
  title: "Sunrise & Sunset Calculator",
  description: "Free sunrise and sunset calculator. Estimate sunrise, sunset times, and day length for any location and date.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["sunrise calculator", "sunset calculator", "day length calculator", "sunrise time", "sunset time", "hours of daylight"],
  variants: [
    {
      id: "calc",
      name: "Calculate Sunrise & Sunset",
      fields: [
        { name: "latitude", label: "Latitude", type: "number", placeholder: "e.g. 40.71 (positive = N)", step: 0.01, min: -90, max: 90 },
        { name: "longitude", label: "Longitude", type: "number", placeholder: "e.g. -74.01 (negative = W)", step: 0.01, min: -180, max: 180 },
        { name: "month", label: "Month (1–12)", type: "number", placeholder: "e.g. 6", min: 1, max: 12 },
        { name: "day", label: "Day (1–31)", type: "number", placeholder: "e.g. 21", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const lat = inputs.latitude as number;
        const lon = inputs.longitude as number;
        const month = inputs.month as number;
        const day = inputs.day as number;
        if (lat === undefined || lat === null || lon === undefined || lon === null || !month || !day) return null;

        const year = new Date().getFullYear();
        const date = new Date(year, month - 1, day);
        if (date.getMonth() !== month - 1) {
          return { primary: { label: "Error", value: "Invalid date" }, details: [] };
        }

        // Day of year
        const start = new Date(year, 0, 1);
        const dayOfYear = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        const toRad = Math.PI / 180;
        const toDeg = 180 / Math.PI;

        // Solar declination (approximate)
        const declination = -23.45 * Math.cos(toRad * (360 / 365) * (dayOfYear + 10));
        const decRad = declination * toRad;
        const latRad = lat * toRad;

        // Hour angle at sunrise/sunset
        const cosHourAngle = -(Math.tan(latRad) * Math.tan(decRad));

        // Check for polar day/night
        if (cosHourAngle < -1) {
          return {
            primary: { label: "Day Length", value: "24:00 (Midnight Sun)" },
            details: [
              { label: "Sunrise", value: "No sunset — continuous daylight" },
              { label: "Sunset", value: "N/A" },
              { label: "Solar Declination", value: `${formatNumber(declination, 2)}°` },
            ],
            note: "At this latitude and date, the sun does not set (polar day / midnight sun).",
          };
        }
        if (cosHourAngle > 1) {
          return {
            primary: { label: "Day Length", value: "0:00 (Polar Night)" },
            details: [
              { label: "Sunrise", value: "No sunrise — continuous darkness" },
              { label: "Sunset", value: "N/A" },
              { label: "Solar Declination", value: `${formatNumber(declination, 2)}°` },
            ],
            note: "At this latitude and date, the sun does not rise (polar night).",
          };
        }

        const hourAngle = Math.acos(cosHourAngle) * toDeg;
        const dayLengthHours = (2 * hourAngle) / 15;

        // Solar noon (approximate, in hours UTC)
        const solarNoonUTC = 12 - (lon / 15);

        // Equation of time (simplified)
        const b = (360 / 365) * (dayOfYear - 81) * toRad;
        const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b); // minutes
        const solarNoonLocal = solarNoonUTC - eot / 60;

        const sunriseHours = solarNoonLocal - dayLengthHours / 2;
        const sunsetHours = solarNoonLocal + dayLengthHours / 2;

        const formatTime = (hours: number): string => {
          const h = ((Math.floor(hours) % 24) + 24) % 24;
          const m = Math.round((hours - Math.floor(hours)) * 60);
          return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} UTC`;
        };

        const dayH = Math.floor(dayLengthHours);
        const dayM = Math.round((dayLengthHours - dayH) * 60);

        return {
          primary: { label: "Day Length", value: `${dayH}h ${dayM}m` },
          details: [
            { label: "Sunrise (approx.)", value: formatTime(sunriseHours) },
            { label: "Sunset (approx.)", value: formatTime(sunsetHours) },
            { label: "Solar Noon", value: formatTime(solarNoonLocal) },
            { label: "Solar Declination", value: `${formatNumber(declination, 2)}°` },
            { label: "Latitude", value: `${formatNumber(lat, 2)}°` },
            { label: "Day of Year", value: `${dayOfYear}` },
          ],
          note: "Times are approximate and shown in UTC. Actual times vary due to atmospheric refraction, elevation, and local time zone. Accuracy is within ~5–10 minutes.",
        };
      },
    },
  ],
  relatedSlugs: ["moon-phase-calculator", "day-of-week-calculator", "time-zone-converter"],
  faq: [
    { question: "How accurate are these sunrise/sunset times?", answer: "These are approximate calculations based on simplified solar equations. Actual times may differ by 5–10 minutes due to atmospheric refraction, elevation, and the equation of time. For precise times, use astronomical almanac data." },
    { question: "What is solar declination?", answer: "Solar declination is the angle between the Sun and the celestial equator. It varies from +23.45° (summer solstice) to -23.45° (winter solstice) and determines day length at different latitudes." },
    { question: "Why are times shown in UTC?", answer: "UTC (Coordinated Universal Time) is used because local time zones vary. To convert to your local time, add or subtract your UTC offset (e.g., EST = UTC−5)." },
  ],
  formula: "Hour angle = acos(−tan(lat) × tan(declination)) | Day length = 2 × hour angle / 15",
};

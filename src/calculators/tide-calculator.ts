import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tideCalculator: CalculatorDefinition = {
  slug: "tide-calculator",
  title: "Tide Calculator",
  description: "Free tide prediction calculator. Estimate tide heights, tidal ranges, and the Rule of Twelfths for coastal planning and fishing.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["tide calculator", "tide prediction calculator", "tidal range calculator", "rule of twelfths", "tide height estimator"],
  variants: [
    {
      id: "rule-of-twelfths",
      name: "Rule of Twelfths",
      description: "Estimate tide height at any hour between high and low tide",
      fields: [
        { name: "highTide", label: "High Tide Height (feet)", type: "number", placeholder: "e.g. 8.5", step: 0.1 },
        { name: "lowTide", label: "Low Tide Height (feet)", type: "number", placeholder: "e.g. 1.5", step: 0.1 },
        { name: "hoursAfterHigh", label: "Hours After High Tide", type: "select", options: [
          { label: "0 (at high tide)", value: "0" },
          { label: "1 hour", value: "1" },
          { label: "2 hours", value: "2" },
          { label: "3 hours", value: "3" },
          { label: "4 hours", value: "4" },
          { label: "5 hours", value: "5" },
          { label: "6 hours (at low tide)", value: "6" },
        ], defaultValue: "3" },
      ],
      calculate: (inputs) => {
        const high = inputs.highTide as number;
        const low = inputs.lowTide as number;
        const hours = parseInt(inputs.hoursAfterHigh as string);
        if (high === undefined || low === undefined || hours === undefined) return null;
        const range = high - low;
        // Rule of Twelfths: 1/12, 2/12, 3/12, 3/12, 2/12, 1/12
        const twelfths = [0, 1, 3, 6, 9, 11, 12];
        const dropped = (twelfths[hours] / 12) * range;
        const currentHeight = high - dropped;
        const allHours = twelfths.map((t, i) => ({
          hour: i,
          height: formatNumber(high - (t / 12) * range, 1),
        }));
        return {
          primary: { label: "Tide Height", value: `${formatNumber(currentHeight, 1)} feet` },
          details: [
            { label: "High tide", value: `${formatNumber(high, 1)} ft` },
            { label: "Low tide", value: `${formatNumber(low, 1)} ft` },
            { label: "Tidal range", value: `${formatNumber(range, 1)} ft` },
            { label: "Water dropped", value: `${formatNumber(dropped, 1)} ft (${formatNumber((dropped / range) * 100, 0)}%)` },
            { label: "All hours", value: allHours.map(h => `Hr ${h.hour}: ${h.height} ft`).join(" | ") },
          ],
          note: "The Rule of Twelfths divides the tidal cycle into 6 hours. The tide changes 1/12 in hour 1, 2/12 in hour 2, 3/12 in hours 3-4, 2/12 in hour 5, and 1/12 in hour 6. The tide moves fastest in the middle hours.",
        };
      },
    },
    {
      id: "tidal-range",
      name: "Tidal Range & Type",
      description: "Understand tidal characteristics for a location",
      fields: [
        { name: "location", label: "Coast Type", type: "select", options: [
          { label: "Atlantic Coast (semidiurnal, 3-6 ft)", value: "atlantic" },
          { label: "Gulf Coast (diurnal, 1-2 ft)", value: "gulf" },
          { label: "Pacific Coast (mixed, 4-8 ft)", value: "pacific" },
          { label: "Bay of Fundy area (30-50 ft)", value: "fundy" },
          { label: "Mediterranean (1-2 ft)", value: "med" },
          { label: "Open Ocean (1-3 ft)", value: "ocean" },
        ] },
        { name: "moonPhase", label: "Moon Phase", type: "select", options: [
          { label: "New Moon (spring tide, max range)", value: "spring" },
          { label: "Full Moon (spring tide, max range)", value: "spring" },
          { label: "First Quarter (neap tide, min range)", value: "neap" },
          { label: "Third Quarter (neap tide, min range)", value: "neap" },
        ], defaultValue: "spring" },
      ],
      calculate: (inputs) => {
        const location = inputs.location as string;
        const moon = inputs.moonPhase as string;
        if (!location) return null;
        const locationData: Record<string, { type: string; avgRange: number; cycles: string }> = {
          atlantic: { type: "Semidiurnal (2 highs, 2 lows/day)", avgRange: 4.5, cycles: "~12h 25m between highs" },
          gulf: { type: "Diurnal (1 high, 1 low/day)", avgRange: 1.5, cycles: "~24h 50m between highs" },
          pacific: { type: "Mixed semidiurnal", avgRange: 6, cycles: "2 unequal highs and lows/day" },
          fundy: { type: "Semidiurnal (extreme)", avgRange: 40, cycles: "~12h 25m, funneling amplifies" },
          med: { type: "Mixed/Minimal", avgRange: 1.5, cycles: "Varies, generally small" },
          ocean: { type: "Semidiurnal", avgRange: 2, cycles: "~12h 25m between highs" },
        };
        const data = locationData[location] || locationData.atlantic;
        const springFactor = moon === "spring" ? 1.2 : 0.8;
        const actualRange = data.avgRange * springFactor;
        return {
          primary: { label: "Expected Tidal Range", value: `${formatNumber(actualRange, 1)} feet` },
          details: [
            { label: "Tide type", value: data.type },
            { label: "Average range", value: `${formatNumber(data.avgRange, 1)} ft` },
            { label: "Moon effect", value: moon === "spring" ? "Spring tide (+20% range)" : "Neap tide (-20% range)" },
            { label: "Tidal cycle", value: data.cycles },
            { label: "Range in meters", value: `${formatNumber(actualRange * 0.3048, 1)} m` },
          ],
          note: "Spring tides (new/full moon) produce the highest highs and lowest lows. Neap tides (quarter moons) have the smallest range. Wind and barometric pressure also affect actual tide levels.",
        };
      },
    },
  ],
  relatedSlugs: ["moon-phase-calculator", "sunrise-sunset-calculator", "fishing-line-calculator"],
  faq: [
    { question: "What is the Rule of Twelfths?", answer: "The Rule of Twelfths estimates tide height between high and low tide. The tidal range is divided into 12 parts. In the first hour, the tide changes 1/12. In hours 2: 2/12, hours 3: 3/12, hour 4: 3/12, hour 5: 2/12, hour 6: 1/12. The tide moves fastest in the middle 2 hours." },
    { question: "What causes tides?", answer: "Tides are caused primarily by the gravitational pull of the Moon and Sun on Earth's oceans. The Moon has the stronger effect due to proximity. Spring tides (highest tides) occur when the Sun and Moon align (new and full moon). Neap tides (lowest tides) occur at quarter moons." },
    { question: "How many tides are there per day?", answer: "Most coastlines have semidiurnal tides: 2 high tides and 2 low tides per day, approximately 12 hours 25 minutes apart. The Gulf of Mexico has diurnal tides (1 high, 1 low per day). The Pacific Coast has mixed tides with unequal highs and lows." },
  ],
  formula: "Rule of Twelfths: Height at hour H = HighTide - (Twelfths[H]/12) × TidalRange | Twelfths = [0, 1, 3, 6, 9, 11, 12]",
};

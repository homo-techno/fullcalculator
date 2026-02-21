import type { CalculatorDefinition } from "./types";

export const timestampConverter: CalculatorDefinition = {
  slug: "timestamp-converter",
  title: "Unix Timestamp Converter",
  description: "Free Unix timestamp converter. Convert between Unix timestamps and human-readable dates. Get the current timestamp.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["unix timestamp converter", "epoch converter", "timestamp to date", "date to timestamp", "unix time"],
  variants: [
    {
      id: "toDate",
      name: "Timestamp → Date",
      fields: [
        { name: "ts", label: "Unix Timestamp (seconds)", type: "number", placeholder: "e.g. 1700000000" },
      ],
      calculate: (inputs) => {
        const ts = inputs.ts as number;
        if (ts === undefined) return null;
        const ms = ts > 1e12 ? ts : ts * 1000;
        const d = new Date(ms);
        if (isNaN(d.getTime())) return null;
        return {
          primary: { label: "Date (UTC)", value: d.toUTCString() },
          details: [
            { label: "ISO 8601", value: d.toISOString() },
            { label: "Local time", value: d.toLocaleString() },
            { label: "Unix (seconds)", value: String(Math.floor(ms / 1000)) },
            { label: "Unix (milliseconds)", value: String(ms) },
          ],
        };
      },
    },
    {
      id: "toTimestamp",
      name: "Date → Timestamp",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2025" },
        { name: "month", label: "Month (1-12)", type: "number", placeholder: "e.g. 1", min: 1, max: 12 },
        { name: "day", label: "Day", type: "number", placeholder: "e.g. 15", min: 1, max: 31 },
        { name: "hour", label: "Hour (0-23)", type: "number", placeholder: "e.g. 12", defaultValue: 0 },
        { name: "minute", label: "Minute", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number, m = inputs.month as number, d = inputs.day as number;
        const h = (inputs.hour as number) || 0, min = (inputs.minute as number) || 0;
        if (!y || !m || !d) return null;
        const date = new Date(Date.UTC(y, m - 1, d, h, min));
        if (isNaN(date.getTime())) return null;
        const ts = Math.floor(date.getTime() / 1000);
        return {
          primary: { label: "Unix Timestamp", value: String(ts) },
          details: [
            { label: "Milliseconds", value: String(ts * 1000) },
            { label: "ISO 8601", value: date.toISOString() },
            { label: "UTC", value: date.toUTCString() },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["date-calculator", "time-zone-converter", "time-duration-calculator"],
  faq: [{ question: "What is a Unix timestamp?", answer: "A Unix timestamp is the number of seconds since January 1, 1970 00:00:00 UTC (the Unix epoch). It's widely used in programming and databases. Current timestamp increases by 1 every second." }],
  formula: "Seconds since Jan 1, 1970 00:00:00 UTC",
};

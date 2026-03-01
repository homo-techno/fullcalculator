import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const unixTimestampConverterCalculator: CalculatorDefinition = {
  slug: "unix-timestamp-converter",
  title: "Unix Timestamp Converter",
  description: "Convert between Unix epoch timestamps and human-readable dates.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["unix timestamp", "epoch converter", "timestamp to date"],
  variants: [{
    id: "standard",
    name: "Unix Timestamp",
    description: "Convert between Unix epoch timestamps and human-readable dates",
    fields: [
      { name: "timestamp", label: "Unix Timestamp (seconds)", type: "number", suffix: "", min: 0, max: 4102444800, defaultValue: 1700000000 },
      { name: "year", label: "Year", type: "number", suffix: "", min: 1970, max: 2100, defaultValue: 2024 },
      { name: "month", label: "Month", type: "number", suffix: "", min: 1, max: 12, defaultValue: 1 },
      { name: "day", label: "Day", type: "number", suffix: "", min: 1, max: 31, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const ts = inputs.timestamp as number;
      if (ts !== undefined && ts >= 0) {
        const d = new Date(ts * 1000);
        const iso = d.toISOString();
        const utcStr = d.toUTCString();
        const daysFromNow = Math.round((ts * 1000 - Date.now()) / 86400000);
        return {
          primary: { label: "Date (UTC)", value: iso.replace("T", " ").replace(".000Z", " UTC") },
          details: [
            { label: "ISO 8601", value: iso },
            { label: "UTC String", value: utcStr },
            { label: "Days From Now", value: formatNumber(daysFromNow) },
          ],
        };
      }
      const year = inputs.year as number;
      const month = inputs.month as number;
      const day = inputs.day as number;
      if (!year) return null;
      const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
      const unixTs = Math.floor(date.getTime() / 1000);
      return {
        primary: { label: "Unix Timestamp", value: formatNumber(unixTs) },
        details: [
          { label: "ISO 8601", value: date.toISOString() },
          { label: "Milliseconds", value: formatNumber(unixTs * 1000) },
          { label: "Date", value: date.toUTCString() },
        ],
      };
    },
  }],
  relatedSlugs: ["number-base-converter", "hex-to-rgb-calculator"],
  faq: [
    { question: "What is a Unix timestamp?", answer: "A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 00:00:00 UTC, also known as the Unix epoch." },
    { question: "What is the Year 2038 problem?", answer: "Systems using 32-bit signed integers to store Unix timestamps will overflow on January 19, 2038. Modern systems use 64-bit integers to avoid this issue." },
  ],
  formula: "Unix Timestamp = seconds since January 1, 1970 00:00:00 UTC",
};
